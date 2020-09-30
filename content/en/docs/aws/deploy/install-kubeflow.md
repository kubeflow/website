+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow on AWS with the shell"
weight = 4
+++

This guide describes how to use the kfctl CLI to
deploy Kubeflow on Amazon Web Services (AWS).

## Prerequisites

* Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)
* Install and configure the AWS Command Line Interface (AWS CLI):
    * Install the [AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).
    * Configure the AWS CLI by running the following command: `aws configure`.
    * Enter your Access Keys ([Access Key ID and Secret Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)).
    * Enter your preferred AWS Region and default output options.
* Install [eksctl](https://github.com/weaveworks/eksctl) (version 0.1.31 or newer) and the [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html).

## EKS cluster
There're many ways to provision EKS cluster, using AWS EKS CLI, CloudFormation or Terraform, AWS CDK or eksctl.
Here, we highly recommend you to create an EKS cluster using [eksctl](https://github.com/weaveworks/eksctl).

You are required to have an existing Amazon Elastic Kubernetes Service (Amazon EKS) cluster before moving the next step.

The installation tool uses the `eksctl` command and doesn't support the `--profile` option in that command.
If you need to switch role, use the `aws sts assume-role` commands. See the AWS guide to [using temporary security credentials to request access to AWS resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html).


<a id="prepare-environment"></a>
## Prepare your environment

In order to deploy Kubeflow on your existing Amazon EKS cluster, you need to provide `AWS_CLUSTER_NAME`, `cluster region` and `worker roles`.

Follow these steps to download the kfctl binary for the Kubeflow CLI and set
some handy environment variables:

1. Download the kfctl {{% kfctl-aws %}} release from the
  [Kubeflow releases
  page](https://github.com/kubeflow/kfctl/releases/tag/{{% kfctl-aws %}}).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_{{% kfctl-aws %}}_<platform>.tar.gz
    ```

1. Create environment variables to make the deployment process easier:

    ```
    # 1. Add kfctl to PATH, to make the kfctl binary easier to use.
    export PATH=$PATH:"<path to kfctl>"

    # 2. Use the following kfctl configuration file for the AWS setup without authentication:
    export CONFIG_URI="{{% config-uri-aws-standard %}}"

    # Alternatively, use the following kfctl configuration if you want to enable
    # authentication, authorization and multi-user:
    export CONFIG_URI="{{% config-uri-aws-cognito %}}"

    # 3. Set an environment variable for your AWS cluster name.
    export AWS_CLUSTER_NAME=<YOUR EKS CLUSTER NAME>

    # 4. Create the directory you want to store deployment, this has to be ${AWS_CLUSTER_NAME}
    mkdir ${AWS_CLUSTER_NAME} && cd ${AWS_CLUSTER_NAME}

    # 5. Download your configuration files, so that you can customize the configuration before deploying Kubeflow.
    wget -O kfctl_aws.yaml $CONFIG_URI
    ```

Notes:

* **${CONFIG_URI}** - The GitHub address of the configuration YAML file that
  you want to use to deploy Kubeflow. For AWS deployments, the following
  configurations are available:

  * `{{% config-uri-aws-standard %}}`
  * `{{% config-uri-aws-cognito %}}`

    When you run `kfctl apply` or `kfctl build` (see the next step), kfctl creates
    a local version of the configuration YAML file which you can further
    customize if necessary.

* **${AWS_CLUSTER_NAME}** - The name of your eks cluster.
  This will be picked by `kfctl` and set value to `metadata.name`.
  `alb-ingress-controller` requires correct value to provision application load balanders. 
  Alb will be only created with correct cluster name.


## Configure Kubeflow

Since v1.0.1, Kubeflow supports to use [AWS IAM Roles for Service Account](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) to fine grain control AWS service access.
kfctl will create two roles `kf-admin-${region}-${cluster_name}` and `kf-user-${region}-${cluster_name}` and Kubernetes service account `kf-admin` and `kf-user` under kubeflow namespace. `kf-admin-${region}-${cluster_name}` will be assumed by components like `alb-ingress-controller`, `profile-controller` or any Kubeflow control plane components which need to talk to AWS services. `kf-user-${region}-${cluster_name}` can be used by user's application.

This is only available on EKS, for DIY Kubernetes on AWS, check out [aws/amazon-eks-pod-identity-webhook](https://github.com/aws/amazon-eks-pod-identity-webhook/) to setup webhook.

Traditional way to attach IAM policies to node group role is still working, feel free choose the way you like to use.

### Option 1: Use IAM For Service Account

  `kfctl` will help create or reuse IAM OIDC Identity Provider, create role and handle trust relationship binding with Kubernetes Service Accounts.

  > Note: By default, we don't attach any policies to `kf-user-${region}-${cluster_name}`, you can attach policies based on your need.

  Add `enablePodIamPolicy: true` in your `${CONFIG_URI}` file:
  ```
  region: us-west-2
  enablePodIamPolicy: true

  # you can delete following roles settings.
  #roles:
  #- eksctl-kubeflow-example-nodegroup-ng-185-NodeInstanceRole-1DDJJXQBG9EM6
  ```

  Check [IAM Role For Service Account](/docs/aws/iam-for-sa) for more usage.

### Option 2: Use Node Group Role

1. Retrieve the AWS Region and IAM role name for your worker nodes.
  To get the IAM role name for your Amazon EKS worker node, run the following
  command:

    ```
    aws iam list-roles \
        | jq -r ".Roles[] \
        | select(.RoleName \
        | startswith(\"eksctl-$AWS_CLUSTER_NAME\") and contains(\"NodeInstanceRole\")) \
        .RoleName"

    eksctl-kubeflow-example-nodegroup-ng-185-NodeInstanceRole-1DDJJXQBG9EM6
    ```

    Note: The above command assumes that you used `eksctl` to create your
    cluster. If you use other provisioning tools to create your worker node
    groups, find the role that is associated with your worker nodes in the
    Amazon EC2 console.

1. Change cluster region and worker role names in your `kfctl_aws.yaml` file:

  ```
  region: us-west-2
  roles:
  - eksctl-kubeflow-example-nodegroup-ng-185-NodeInstanceRole-1DDJJXQBG9EM6
  ```

  If you have multiple node groups, you will see corresponding number of node group roles. In that case, please provide the role names as an array.


By default, the username is set to `admin@kubeflow.org` and the password is `12341234`. To secure your Kubeflow deployment, change this configuration.

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

NAMESPACE      NAME            HOSTS   ADDRESS                                                             PORTS   AGE
istio-system   istio-ingress   *       a743484b-istiosystem-istio-2af2-xxxxxx.us-west-2.elb.amazonaws.com   80      1h
```

This deployment may take 3-5 minutes to become ready. Verify that the address works by opening it in your preferred Internet browser.

- **Dex**
  If you're using basic authentication, the credentials are the ones you specified in the KfDef file, or the default (`admin@kubeflow.org`:`12341234`). It is highly recommended to change the default credentials. To add static users or change the existing one, [add static users for basic auth](/docs/aws/deploy/install-kubeflow/#add-static-users-for-basic-auth).

- **Cognito**
  To secure an enterprise-level installation, use the {{% config-uri-aws-cognito %}} configuration file and [configure authentication and authorization](/docs/aws/authentication) for your cluster.

### Add static users for basic authentication 
To add users to basic auth, you just have to edit the Dex ConfigMap under the key staticPasswords.

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

Kubeflow provides multi-tenancy support and user are not able to create notebooks in `kubeflow`, `default` namespace.

The first time you visit the cluster, you can ceate a namespace `anonymous` to use. If you want to create different users, you can create `Profile` and then `kubectl apply -f profile.yaml`. Profile controller will create new namespace and service account which is allowed to create notebook in that namespace.

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

> Note: `spec.owner.name` has to match your IDP user's email.

Check [Multi-Tenancy in Kubeflow](/docs/components/multi-tenancy) for more details.

## Understanding the deployment process

The kfctl deployment process is controlled by the following commands:

* `kfctl build` - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* `kfctl apply` - Creates or updates the resources.
* `kfctl delete` - Deletes the resources.

### App layout

Your Kubeflow app directory **${KF_DIR}** contains the following files and directories:

* **${CONFIG_URI}** is a YAML file that defines configurations related to your
  Kubeflow deployment.

  * This file is a copy of the GitHub-based configuration YAML file that
    you used when deploying Kubeflow.
  * When you run `kfctl apply` or `kfctl build`, kfctl creates
    a local version of the configuration file, `${CONFIG_URI}`,
    which you can further customize if necessary.

* **aws_config** is a directory that contains a sample `eksctl` cluster configuration file that defines the AWS cluster and policy files to attach to your node group roles.
    * You can modify the `cluster_config.yaml` and `cluster_features.yaml` files to customize your AWS infrastructure.
* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl build` or `kfctl apply`.
    * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).

The provisioning scripts can either bring up a new cluster and install Kubeflow on it, or you can install Kubeflow on your existing cluster. We recommend that you create a new cluster for better isolation.

If you experience any issues running these scripts, see the [troubleshooting guidance](/docs/aws/troubleshooting-aws) for more information.
