+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow with the shell"
weight = 4
+++

This guide describes how to use the `kfctl` golang cli to
deploy Kubeflow on Amazon Web Services (AWS).

## Prerequisites

* Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)
* Install and configure the AWS Command Line Interface (AWS CLI):
    * Install the [AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).
    * Configure the AWS CLI by running the following command: `aws configure`.
    * Enter your Access Keys ([Access Key ID and Secret Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)).
    * Enter your preferred AWS Region and default output options.
* Install [eksctl](https://github.com/weaveworks/eksctl) (version 0.1.31 or newer) and the [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html).

You do not need to have an existing Amazon Elastic Container Service for Kubernetes (Amazon EKS) cluster. The deployment process will create a cluster for you.

The installation tool uses the `eksctl` command and doesn't support the `--profile` option in that command.
If you need to switch role, use the `aws sts assume-role` commands. See the AWS guide to [using temporary security credentials to request access to AWS resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html).


## Kubeflow installation

1. Download the latest `kfctl` golang binary from [Kubeflow release page](https://github.com/kubeflow/kubeflow/releases) and unpack it.

    ```
    # Add kfctl to PATH, to make the kfctl binary easier to use.
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    export PATH=$PATH:"<path to kfctl>"
    ```

1. Download manifest and config setups

    ```shell
    # Download config files
    export CONFIG="/tmp/kfctl_aws.yaml"
    wget https://raw.githubusercontent.com/kubeflow/kubeflow/master/bootstrap/config/kfctl_aws.yaml -O ${CONFIG}
    ```

    * `kfctl_aws.yaml` is one of setup manifests, please check [kfctl_aws_cognito.yaml](https://github.com/kubeflow/kubeflow/blob/master/bootstrap/config/kfctl_aws_cognito.yaml) for the template to enable authentication.

    - If you plan to use `kfctl` to create a new eks cluster, please remove follow lines in the manifest file.
    - If you want to install on existing EKS cluster, please change roles to your worker node group roles. See [existing cluster](/docs/aws/deploy/existing-cluster) for details.

    ```shell
    roles:
      - eksctl-kubeflow-aws-nodegroup-ng-a2-NodeInstanceRole-xxxxxxx
    ```

1. Run the following commands to set up your environment and initialize the cluster.

    Since there're many ways to create your cluster, we highly recommend you to get our own eks cluster ready.

    Note: If you would like to install Kubeflow on your existing EKS cluster,
    please skip this step and follow the setup instructions for an [existing cluster](/docs/aws/deploy/existing-cluster) instead.

    ```
    export KFAPP=kfaws

    kfctl init ${KFAPP} --config=${CONFIG} -V
    cd ${KFAPP}

    kfctl generate all -V
    kfctl apply all -V
    ```

    * KFAPP - Use a relative directory name here rather than absolute path, such as `kfapp`. It will be used as eks cluster name.
    * CONFIG - Path to the configuration file


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
apiVersion: kubeflow.org/v1alpha1
kind: Profile
metadata:
  name: aws-sample-user
spec:
  owner:
    kind: User
    name: aws-sample-user
```

## Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - The initial one-time set up.
* **generate** - Creates the configuration files that define your various resources.
* **apply** - Creates or updates the resources.
* **delete** - Deletes the resources.

With the exception of `init`, all commands take an argument which describes the set of resources to apply the command to; this argument can be one of the following:

* **platform** - All AWS resources; that is, anything that doesn’t run on Kubernetes. Like IAM policy attachments, Amazon EKS cluster creation, etc.
* **k8s** - All Kubernetes resources. Such as Kubeflow packages and add-on packages like `fluentd` or `istio`.
* **all** - Both AWS and Kubernetes resources.

### App layout

Your Kubeflow `app` directory contains the following files and directories:

* **app.yaml** - Defines the configuration related to your Kubeflow deployment.
    * These values are set when you run `kfctl init`.
    * These values are snapshotted inside `app.yaml` to make your app self contained.
* **${KFAPP}/aws_config** - A directory that contains a sample `eksctl` cluster configuration file that defines the AWS cluster and policy files to attach to your node group roles.
    * This directory is created when you run `kfctl generate platform -V`.
    * You can modify the `cluster_config.yaml` and `cluster_features.yaml` files to customize your AWS infrastructure.
* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl generate`.
    * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).

The provisioning scripts can either bring up a new cluster and install Kubeflow on it, or you can install Kubeflow on your existing cluster. We recommend that you create a new cluster for better isolation.

If you experience any issues running these scripts, see the [troubleshooting guidance](/docs/aws/troubleshooting-aws) for more information.
