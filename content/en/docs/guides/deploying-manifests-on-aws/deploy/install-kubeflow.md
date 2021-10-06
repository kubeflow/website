+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow on Amazon EKS"
weight = 20
+++

This guide describes how to use the `kfctl` CLI to deploy Kubeflow on Amazon Elastic Kubernetes Service (Amazon EKS) and Amazon Web Services (AWS).

Kubernetes versions 1.15+ on Amazon EKS are compatible with Kubeflow version 1.2. Please see the [compatibility matrix](/docs/distributions/aws/deploy/eks-compatibility) for more information.

## Understanding the deployment process

`kfctl` is used for deploying and managing Kubeflow. The `kfctl` deployment process consists of the following commands:

* `kfctl build` - (Optional) Creates configuration files defining the various resources in your deployment. You may optionally run `kfctl build` to edit the resources before running `kfctl apply`.
* `kfctl apply` - Creates or updates the resources in your cluster
* `kfctl delete` - Deletes previously created resources

### App layout

When working with `kfctl` on AWS, the Kubeflow app directory contains the following files and directories:

* A configuration YAML file that defines configuration related to your Kubeflow deployment.
  * In the walkthrough below, a copy of the GitHub-based configuration YAML file is used to deploy Kubeflow (as `CONFIG_URI` below).
  * When you run `kfctl apply` or `kfctl build`, it works with this local version of the configuration file, which you can customize as needed.

* **aws_config** is a directory that contains a sample `eksctl` cluster configuration file as well as JSON files defining IAM policies.
* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl build` or `kfctl apply`.
    * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).

The provisioning scripts can be used with a new cluster, or you can install Kubeflow on an existing cluster. We recommend that you create a new cluster for better isolation. 

For information on customizing your deployment on AWS and Amazon EKS, please see [Customizing Kubeflow on AWS](/docs/distributions/aws/customizing-aws) for more information.

If you experience any issues with installation, see the [troubleshooting guidance](/docs/distributions/aws/troubleshooting-aws) for more information.

## Prerequisites

* Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)
* Install and configure the AWS Command Line Interface (AWS CLI):
    * Install the [AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).
    * Configure the AWS CLI by running the following command: `aws configure`.
    * Enter your Access Keys ([Access Key ID and Secret Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)).
    * Enter your preferred AWS Region and default output options.
* Install [eksctl](https://github.com/weaveworks/eksctl) and the [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html).

## EKS cluster

Before moving forward with Kubeflow installation, you will need a Kubernetes cluster in Amazon EKS. If you already have a cluster, ensure that your current `kubectl` context is set and move on to the next step.

There are several ways to provision a cluster in EKS, including with the `aws` CLI, in the EKS Console, or via AWS CloudFormation, Terraform, or the AWS Cloud Development Kit (CDK). A simple way to get started is by using [eksctl](https://github.com/weaveworks/eksctl), which we recommend here.

First, set a few environment variables to specify your desired cluster name, AWS region, Kubernetes version, and Amazon EC2 instance type to use for cluster nodes.

For example:

```shell
export AWS_CLUSTER_NAME=kubeflow-demo
export AWS_REGION=us-west-2
export K8S_VERSION=1.18
export EC2_INSTANCE_TYPE=m5.large
```

Now, create a cluster configuration file for use with `eksctl`.

```shell
cat << EOF > cluster.yaml
---
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: ${AWS_CLUSTER_NAME}
  version: "${K8S_VERSION}"
  region: ${AWS_REGION}

managedNodeGroups:
- name: kubeflow-mng
  desiredCapacity: 3
  instanceType: ${EC2_INSTANCE_TYPE}
EOF
```

Finally, create the cluster using `eksctl`.

```shell
eksctl create cluster -f cluster.yaml
```

## Prepare your environment

**Note**: `kfctl` is currently available for Linux and macOS users only. If you use Windows, you can install `kfctl` on Windows Subsystem for Linux (WSL). Refer to the official [instructions](https://docs.microsoft.com/en-us/windows/wsl/install-win10) for setting up WSL.

Follow the steps below to download the `kfctl` binary and set some handy environment variables.

1. Download the kfctl {{% aws/kfctl-aws %}} release from the [Kubeflow releases page](https://github.com/kubeflow/kfctl/releases/tag/{{% aws/kfctl-aws %}}).

1. Unpack the tar ball and add the current working directory to your shell's path to simplify use of `kfctl`.

    ```shell
    tar -xvf kfctl_{{% aws/kfctl-aws %}}_<platform>.tar.gz
    export PATH=$PATH:$PWD
    ```

1. Set an environment variable for the configuration file.

    Option 1: Use the default configuration file for authentication using [Dex](https://dexidp.io/):

    ```shell
    export CONFIG_URI="{{% aws/config-uri-aws-standard %}}"
    ```

    Option 2: Alternatively, use this configuration file to enable multi-user authentication with [AWS Cognito](https://aws.amazon.com/cognito/). For more information on this configuration, see [Authentication and Authorization](/docs/distributions/aws/authentication) before moving forward.

    ```shell
    export CONFIG_URI="{{% aws/config-uri-aws-cognito %}}"
    ```

1. Set an environment variable with the name of your Amazon EKS cluster.

    ```shell
    export AWS_CLUSTER_NAME=<YOUR EKS CLUSTER NAME>
    ```

1. Finally, create a deployment directory for your cluster, change to it, and download the `kfctl` configuration file.

    ```shell
    mkdir ${AWS_CLUSTER_NAME} && cd ${AWS_CLUSTER_NAME}
    wget -O kfctl_aws.yaml $CONFIG_URI
    ```

Note your EKS cluster name must be set correctly. This is used during the deployment process and will cause issues if not set.

## Configure Kubeflow

Modifications can be made to the local configuration file prior to deployment. Edit the file as follows with your favorite editor. 

By default, the username is set to `admin@kubeflow.org` and the password is `12341234`. To secure your Kubeflow deployment, change this configuration.

Since v1.0.1, Kubeflow supports use of [AWS IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html). This allows for fine-grained policy configuration bound to a specific service account in your Kubernetes cluster, as opposed to attaching the required policies to the node instance role.

`kfctl` will create two roles, *kf-admin-{aws-region}-{cluster-name}* and *kf-user-{aws-region}-{cluster-name}*, and two service accounts in the `kubeflow` namespace, `kf-admin` and `kf-user`. The `kf-admin` role will be assumed by components like `alb-ingress-controller`, `profile-controller` or any Kubeflow control plane components which need to talk to AWS services, while the `kf-user` role can be used by user applications.

This is only available on clusters managed by Amazon EKS. For DIY Kubernetes on AWS, check out [aws/amazon-eks-pod-identity-webhook](https://github.com/aws/amazon-eks-pod-identity-webhook/) for configuration options.

The method of attaching required IAM policies to the EKS node instance role is still supported (Option 2 below), but using IAM Roles for Service Accounts is recommended.

### Option 1: Use AWS IAM Roles For Service Accounts (default and recommended)

  `kfctl` will create or reuse your cluster's IAM OIDC Identity Provider, will create the required IAM roles, and configure the trust relationship binding the roles with your Kubernetes Service Accounts.

  This is the default configuration, just update this configuration file section with your AWS Region.

  ```shell
  region: ${AWS_REGION} (e.g. us-west-2)
  enablePodIamPolicy: true
  ```

  > Note: By default, no policies are attached to the *kf-user-{aws-region}-{cluster-name}* IAM Role, you can configure this as needed.

### Option 2: Use Node Group Role

  If you would prefer to not use IRSA, follow these steps to modify the configuration file as needed.

1. Retrieve your cluster's node instance role. This is the IAM Role that's used to provide permissions to your Kubernetes nodes. For example:

    ```
    aws iam list-roles \
        | jq -r ".Roles[] \
        | select(.RoleName \
        | startswith(\"eksctl-$AWS_CLUSTER_NAME\") and contains(\"NodeInstanceRole\")) \
        .RoleName"

    eksctl-kubeflow-example-nodegroup-ng-123-NodeInstanceRole-4567
    ```

    Note, this example assumes that you used `eksctl` to create your cluster. If you use other provisioning tools to create your worker node groups, find the role used by your Kubernetes nodes via AWS CLI or Console.

1. Update this configuration file section with your AWS Region and one or more IAM role names.

  ```
  region: ${AWS_REGION} (e.g. us-west-2)
  roles:
  - ${NODE_INSTANCE_ROLENAME} (e.g. eksctl-kubeflow-example-nodegroup-ng-123-NodeInstanceRole-4567)
  ```

## Deploy Kubeflow

1. Run the following commands to initialize the Kubeflow cluster:

    ```
    kfctl apply -V -f kfctl_aws.yaml
    ```

1. Wait for all the resources to become ready in the `kubeflow` namespace.
    ```
    kubectl -n kubeflow get all
    ```

## Access Kubeflow central dashboard

Run the following command to get your Kubeflow service's endpoint host name and copy link in browser.

```
kubectl get ingress -n istio-system

NAMESPACE      NAME            HOSTS   ADDRESS                                                       PORTS   AGE
istio-system   istio-ingress   *       123-istiosystem-istio-2af2-4567.us-west-2.elb.amazonaws.com   80      1h
```

This deployment may take 3-5 minutes to become ready. Once complete, you can verify the installation by opening the ingress address in your preferred browser.

- **Dex**
  If you're using basic authentication, the credentials are the ones you specified in the configuration file, or the default (`admin@kubeflow.org`:`12341234`). It is highly recommended to change the default credentials. To add static users or change the existing one, [add static users for basic auth](/docs/distributions/aws/deploy/install-kubeflow/#add-static-users-for-basic-auth).

- **Cognito**
  To secure an enterprise-level installation, use the {{% aws/config-uri-aws-cognito %}} configuration file and [configure authentication and authorization](/docs/distributions/aws/authentication) for your cluster.

### Add static users for basic authentication 
To add users to basic auth, edit the Dex ConfigMap under the key `staticPasswords`.

```
# Edit the dex config with extra users.
kubectl edit configmap dex -n auth

# The original example of configmap as below
staticPasswords:
- email: admin@kubeflow.org
  hash: JDJhJDEwJEU4SGhqTnpBRzc2eWJJM1RHSDk5Ly4xcWxIckx6UGlJbzMzdW9BWHZ4VU5hTWxjZXAzVTBp
  username: admin
  userID: 08a8684b-db88-4b73-90a9-3cd1661f5466

# If you want to add a static user (test@kubeflow.org: 123456789)
# The password (123456789) must be hashed with bcrypt with an at least 10 difficulty level.
# You can use an online tool like: https://passwordhashing.com/BCrypt
# After change, the example of configmap:
staticPasswords:
- email: admin@kubeflow.org
  hash: JDJhJDEwJEU4SGhqTnpBRzc2eWJJM1RHSDk5Ly4xcWxIckx6UGlJbzMzdW9BWHZ4VU5hTWxjZXAzVTBp
  username: admin
  userID: 08a8684b-db88-4b73-90a9-3cd1661f5466
- email: test@kubeflow.org
  hash: $2b$10$ow6fWbPojHUg56hInYmYXe.B7u3frcSR.kuUkQp2EzXs5t0xfMRtS
  username: test
  userID: 08a8684b-db88-4b73-90a9-3cd1661f5466

# After editing the config, restart Dex to pick up the changes in the ConfigMap
kubectl rollout restart deployment dex -n auth
```

## Post Installation

Kubeflow provides multi-tenancy support and users are not able to create notebooks in either the `kubeflow` or `default` namespaces.

During the first user login, the system will create the `anonymous` namespace. To create additional users, you can create profiles.

Create a manifest file `profile.yaml` with the following contents.

```yaml
apiVersion: kubeflow.org/v1beta1
kind: Profile
metadata:
  name: test
spec:
  owner:
    kind: User
    name: test@amazon.com
```

> Note: `spec.owner.name` is the user's email.

Now create the profile via `kubectl create -f profile.yaml`. The Profile controller will create a new namespace `name` and related service account to allow for notebook creation in that namespace.


Check [Multi-Tenancy in Kubeflow](/docs/components/multi-tenancy) for more details.

