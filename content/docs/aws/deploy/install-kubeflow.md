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

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases
  page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
    ```

1. Create environment variables to make the deployment process easier:

    ```
    # Add kfctl to PATH, to make the kfctl binary easier to use.
    export PATH=$PATH:"<path to kfctl>"

    # Use the following kfctl configuration file for the standard AWS setup:
    export CONFIG_URI="{{% config-uri-aws-standard %}}"

    # Alternatively, use the following kfctl configuration if you want to enable
    # authentication:
    export CONFIG_URI="{{% config-uri-aws-cognito %}}"

    # Set an environment variable for your AWS cluster name, and set the name
    # of the Kubeflow deployment to the same as the cluster name.
    export AWS_CLUSTER_NAME=<YOUR EKS CLUSTER NAME>
    export KF_NAME=${AWS_CLUSTER_NAME}

    # Set the path to the base directory where you want to store one or more
    # Kubeflow deployments. For example, /opt/.
    # Then set the Kubeflow application directory for this deployment.
    export BASE_DIR=<path to a base directory>
    export KF_DIR=${BASE_DIR}/${KF_NAME}
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

* **${KF_NAME}** - The name of your Kubeflow deployment.
  You should set this value to be the same as your AWS cluster name.
  The value of KF_NAME must consist of lower case alphanumeric characters or
  '-', and must start and end with an alphanumeric character.
  The value of this variable cannot be greater than 25 characters. It must
  contain just a name, not a directory path.
  This value also becomes the name of the directory where your Kubeflow
  configurations are stored, that is, the Kubeflow application directory.

* **${KF_DIR}** - The full path to your Kubeflow application directory.

## Set up your Kubeflow configuration

Run kfctl to build your configuration files, so that you can edit the
configuration before deploying Kubeflow:

1. Run the `kfctl build` command to set up your configuration:

  ```
  mkdir -p ${KF_DIR}
  cd ${KF_DIR}
  kfctl build -V -f ${CONFIG_URI}
  ```

1. Set an environment variable pointing to your local configuration file:

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-aws-standard %}}
  ```

    Or:

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-aws-cognito %}}
  ```

## Customize your configuration

1. Replace the AWS cluster name in your `${CONFIG_FILE}` file, by changing
  the value `kubeflow-aws` to `${AWS_CLUSTER_NAME}` in multiple locations in
  the file. For example, use this `sed` command:

  ```
  sed -i'.bak' -e 's/kubeflow-aws/'"$AWS_CLUSTER_NAME"'/' ${CONFIG_FILE}
  ```

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

1. Change cluster region and worker role names in your `${CONFIG_FILE}` file:

  ```
    region: us-west-2
    roles:
      - eksctl-kubeflow-example-nodegroup-ng-185-NodeInstanceRole-1DDJJXQBG9EM6
  ```
    If you have multiple node groups, you will see corresponding number of node group roles. In that case, please provide the role names as an array.

## Deploy Kubeflow

1. Run the following commands to initialize the Kubeflow cluster:

    ```
    cd ${KF_DIR}
    rm -rf kustomize/  # Remove kustomize folder and regenerate files after customization
    kfctl apply -V -f ${CONFIG_FILE}
    ```

    *Important!!!* By default, these scripts create an AWS Application Load Balancer for Kubeflow that is open to public. This is good for development testing and for short term use, but we do not recommend that you use this configuration for production workloads.

    To secure your installation, Follow the [instructions](/docs/aws/authentication) to add authentication.


1. Wait for all the resources to become ready in the `kubeflow` namespace.
    ```
    kubectl -n kubeflow get all
    ```

1. Get Kubeflow service endpoint and copy link in browser.

    ```
    kubectl get ingress -n istio-system

    NAMESPACE      NAME            HOSTS   ADDRESS                                                             PORTS   AGE
    istio-system   istio-ingress   *       a743484b-istiosystem-istio-2af2-xxxxxx.us-west-2.elb.amazonaws.com   80      1h
    ```

    This deployment may take 3-5 minutes to become ready. Verify that the address works by opening it in your preferred Internet browser. You can also run `kubectl delete istio-ingress -n istio-system` to remove the load balancer entirely.

## Post Installation

Kubeflow 0.6 release brings multi-tenancy support and user are not able to create notebooks in `kubeflow`, `default` namespace. Instead, please create a `Profile` using `kubectl apply -f profile.yaml` and profile controller will create new namespace and service account which is allowed to create notebook in that namespace.

```yaml
apiVersion: kubeflow.org/v1beta1
kind: Profile
metadata:
  name: aws-sample-user
spec:
  owner:
    kind: User
    name: aws-sample-user
```

## Understanding the deployment process

The kfctl deployment process is controlled by the following commands:

* `kfctl build` - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* `kfctl apply` - Creates or updates the resources.
* `kfctl delete` - Deletes the resources.

### App layout

Your Kubeflow app directory **${KF_DIR}** contains the following files and directories:

* **${CONFIG_FILE}** is a YAML file that defines configurations related to your
  Kubeflow deployment.

  * This file is a copy of the GitHub-based configuration YAML file that
    you used when deploying Kubeflow.
  * When you run `kfctl apply` or `kfctl build`, kfctl creates
    a local version of the configuration file, `${CONFIG_FILE},`
    which you can further customize if necessary.

* **aws_config** is a directory that contains a sample `eksctl` cluster configuration file that defines the AWS cluster and policy files to attach to your node group roles.
    * You can modify the `cluster_config.yaml` and `cluster_features.yaml` files to customize your AWS infrastructure.
* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl build` or `kfctl apply`.
    * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).

The provisioning scripts can either bring up a new cluster and install Kubeflow on it, or you can install Kubeflow on your existing cluster. We recommend that you create a new cluster for better isolation.

If you experience any issues running these scripts, see the [troubleshooting guidance](/docs/aws/troubleshooting-aws) for more information.
