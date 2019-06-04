+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow with the shell"
weight = 4
+++

This guide describes how to use the `kfctl` binary to
deploy Kubeflow on Amazon Web Services (AWS).


## Prerequisites

* Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)
* Install and configure the AWS Command Line Interface (AWS CLI):
    * Install the [AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).
    * Configure the AWS CLI by running the following command: `aws configure`.
    * Enter your Access Keys ([Access Key ID and Secret Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)).
    * Enter your preferred AWS Region and default output options.
* Install [eksctl](https://github.com/weaveworks/eksctl) (version 0.1.27 or newer) and the [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html).
* Install [jq](https://stedolan.github.io/jq/download/).
* Install [ksonnet](https://github.com/ksonnet/ksonnet).

You do not need to have an existing Amazon Elastic Container Service for Kubernetes (Amazon EKS) cluster. The deployment process will create a cluster for you.


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
    * This directory is created when you run `kfctl generate platform`.
    * You can modify the `cluster_config.yaml` and `cluster_features.sh` files to customize your AWS infrastructure.
* **${KFAPP}/k8s_specs** - A directory that contains YAML specifications for daemons deployed on your Kubernetes Engine cluster.
* **${KFAPP}/ks_app** - A directory that contains the [ksonnet](https://ksonnet.io/) application for Kubeflow.
    * The directory is created when you run `kfctl generate k8s`.
    * You can use ksonnet to customize Kubeflow.


The provisioning scripts can either bring up a new cluster and install Kubeflow on it, or you can install Kubeflow on your existing cluster. We recommend that you create a new cluster for better isolation.

If you experience any issues running these scripts, see the [troubleshooting guidance](/docs/aws/troubleshooting-aws) for more information.


## Kubeflow installation

1. Download a ```kfctl``` release from the [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

    ```shell
    wget https://github.com/kubeflow/kubeflow/releases/download/<release_tag>/kfctl_<release_tag>_<platform>.tar.gz
    ```
1. Unpack the tar ball:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

1. Run the following commands to set up your environment and initialize the cluster.

    > Note: If you would like to install Kubeflow on your existing EKS cluster, please skip this step
    > and follow the setup instructions for an [existing cluster](/docs/aws/deploy/existing-cluster) instead.
    > When you are finished, return here and resume with the next step.


    ```shell
    # The following command is optional, to make the kfctl binary easier to use.
    export PATH=$PATH:<path to kfctl in your kubeflow installation>
    
    export KFAPP=kfapp
    export REGION=us-west-2
    export AWS_CLUSTER_NAME=kubeflow-aws

    kfctl init ${KFAPP} --platform aws \
    --awsClusterName ${AWS_CLUSTER_NAME} \
    --awsRegion ${REGION}
    ```


    * AWS_CLUSTER_NAME - Specify a unique name for your Amazon EKS cluster.
    * KFAPP - Use a relative directory name here rather than absolute path, such as `kfapp`.
    * REGION - Use the AWS Region you want to create your cluster in.

1. Generate and apply platform changes.

    You can customize your cluster configuration, control plane logging, and private cluster endpoint access before you `apply platform`, please see [Customizing Kubeflow on AWS](/docs/aws/customizing-aws) for more information.

    ```shell
    cd ${KFAPP}
    kfctl generate platform
    # Customize your Amazon EKS cluster configuration before following the next step
    kfctl apply platform
    ```

1. Generate and apply the Kubernetes changes.

    ```shell
    kfctl generate k8s
    ```

    __*Important!!!*__ By default, these scripts create an AWS Application Load Balancer for Kubeflow that is open to public. This is good for development testing and for short term use, but we do not recommend that you use this configuration for production workloads.

    To secure your installation, you have two options:

    * Disable ingress before you `apply k8s`. Open `env.sh` in your ${KFAPP} directory and edit the `KUBEFLOW_COMPONENTS` environment variable. Delete `,\"alb-ingress-controller\",\"istio-ingress\"` and save the file.

    * Follow the [instructions](/docs/aws/authentication) to add authentication before you `apply k8s`

    Once your customization is done, you can run this command to deploy Kubeflow.
    ```shell
    kfctl apply k8s
    ```

1. Wait for all the resources to become ready in the `kubeflow ` namespace.
    ```
    kubectl -n kubeflow get all
    ```

1. Open Kubeflow Dashboard
    * If you chose to use a load balancer, you can retrieve the public DNS name here.

        ```shell
        kubectl get ingress -n istio-system

        NAMESPACE      NAME            HOSTS   ADDRESS                                                             PORTS   AGE
        istio-system   istio-ingress   *       a743484b-istiosystem-istio-2af2-xxxxxx.us-west-2.elb.amazonaws.com   80      1h
        ```

        This deployment may take 3-5 minutes to become ready. Verify that the address works by opening it in your preferred Internet browser. You can also run `kubectl delete istio-ingress -n istio-system` to remove the load balancer entirely.

    * If you didn't create a load balancer, please use port-forwarding to visit your cluster. Run following command and visit `localhost:8080`.

        ```shell
        kubectl port-forward -n kubeflow `kubectl get pods -n kubeflow --selector=service=ambassador -o jsonpath='{.items[0].metadata.name}'` 8080:80
        ```
