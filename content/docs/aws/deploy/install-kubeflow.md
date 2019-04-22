+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow with the shell"
weight = 4
+++

This guide describes how to use the `kfctl.sh`to
deploy Kubeflow.

> Note: AWS is moving from `kfctl.sh` to command line interface (CLI) which gives your more control on the configuration and better reliability.


## Prerequisites

* Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)
* Install and configure the AWS Command Line Interface (AWS CLI)
    * Install the [AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).
    * Configure the AWS CLI by running the following command: aws configure .
    * Enter your Access Keys [Access Key ID and Secret Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)
    * Enter Region and default output options.
* Install [eksctl](https://github.com/weaveworks/eksctl) (require 0.1.27 or newer) and [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html)
* Install [jq](https://stedolan.github.io/jq/download/)
* Install [ksonnet](https://github.com/ksonnet/ksonnet)

You do not need a running EKS cluster. The deployment process will create a cluster for you.


## Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time set up.
* **generate** - creates config files defining the various resources.
* **apply** - creates or updates the resources.
* **delete** - deletes the resources.

With the exception of `init`, all commands take an argument which describes the set of resources to apply the command to; this argument can be one of the following:

* **platform** - all AWS resources; that is, anything that doesn’t run on Kubernetes. Like IAM policy attach, eks cluster creation
* **k8s** - all resources that run on Kubernetes. Kubeflow packages and addon packages like fluentd, istio.
* **all** - AWS and Kubernetes resources.

### App layout

Your Kubeflow app directory contains the following files and directories:

* **app.yaml** defines configurations related to your Kubeflow deployment.
    * The values are set when you run `kfctl init`.
    * The values are snapshotted inside *app.yaml* to make your app self contained.
* **${KFAPP}/aws_config** is a directory that contains sample eksctl cluster config file defining your AWS cluster and policy files we want to attach to node group roles.
    * The directory is created when you run `kfctl.sh generate platform`.
    * You can modify these configurations `cluster_config.yaml` and `cluster_features.sh` to customize your AWS infrastructure.
* **${KFAPP}/k8s_specs** is a directory that contains YAML specifications for daemons deployed on your Kubernetes Engine cluster.
* **${KFAPP}/ks_app** is a directory that contains the [ksonnet](https://ksonnet.io/) application for Kubeflow.
    * The directory is created when you run `kfctl generate k8s`.
    * You can use ksonnet to customize Kubeflow.


The provision scripts can either bring up a new cluster and install kubeflow on it or just install kubeflow on your existing cluster. We recommend you to create a new cluster for better isolation.

## Kubeflow Installation

1. Run the following commands to download lastest `kfctl.sh`

    ```
    export KUBEFLOW_SRC=/tmp/kubeflow-aws
    export KUBEFLOW_TAG=master

    mkdir -p ${KUBEFLOW_SRC} && cd ${KUBEFLOW_SRC}

    # Use Jiaxin's own Repo for testing. Will be deleted after PR merged.
    export KUBEFLOW_PKG=/tmp/kubeflow-pkg
    mkdir ${KUBEFLOW_PKG} && git clone https://github.com/jeffwan/kubeflow.git -b make_ingress_optional ${KUBEFLOW_PKG}

    cp -r ${KUBEFLOW_PKG}/kubeflow ./
    cp -r ${KUBEFLOW_PKG}/scripts ./
    cp -r ${KUBEFLOW_PKG}/deployment ./

    # Once PR is merged
    #curl https://raw.githubusercontent.com/kubeflow/kubeflow/${KUBEFLOW_TAG}/scripts/download.sh | bash
    ```

    *KUBEFLOW_SRC* - Full path to your choice of download directory. Please do use full absolute path, for example `/tmp/kubeflow-aws`

1. Run the following scripts to setup environment.

    ```
    export KFAPP=kfapp
    export AWS_CLUSTER_NAME=kubeflow-aws
    export REGION=us-west-2
    ```

    AWS_CLUSTER_NAME - EKS cluster name
    KFAPP - Use relative directory name here rather than absolute path, like `kfapp`
    REGION - Use the region you want to create cluster.

1. Init cluster config.

    For non-existing cluster, please check [setup](/docs/aws/deploy/new-cluster)

    For existing cluster, please check [setup](/docs/aws/deploy/existing-cluster)

1. Generate and apply platform changes.

    You can customize your cluster configs, logging and private access before you `apply platform`, please check [Customizing Kubeflow on AWS](/docs/aws/customizing-aws.md) for details.

    ```
    cd ${KFAPP}
    ${KUBEFLOW_SRC}/scripts/kfctl.sh generate platform
    # Customize your eks cluster configuration before following step
    ${KUBEFLOW_SRC}/scripts/kfctl.sh apply platform
    ```

1. Generate and apply kubernetes changes.

    ```
    ${KUBEFLOW_SRC}/scripts/kfctl.sh generate k8s
    ```

    *Important!!!* By default, scripts will create an AWS Application Load Balancer for kubeflow and this is open to public. This is good for dev tests for short term but risky to leak your information for production environment.

    If you want to secure your endpoints, you have two options.

    1. Disable ingress before you `apply k8s`. Open `${KUBEFLOW_SRC}/${KFAPP}/env.sh` and edit `KUBEFLOW_COMPONENTS` environment viriable. Delete `,\"alb-ingress-controller\",\"istio-ingress\"` and save the file.
    > Note: Don't forget to delete common.

    1. Follow [instruction](/docs/aws/authentication.md) and add authentication before you `apply k8s`

    Once your customization is done, you can run this command to deploy kubeflow.
    ```
    ${KUBEFLOW_SRC}/scripts/kfctl.sh apply k8s
    ```

1. Wait for all the resources ready in namespace kubeflow
    ```
    kubectl -n kubeflow get all
    ```

1. Open Kubeflow Dashboard
    * If you choose to use load balancer, You can get dns name here.

      ```
      kubectl get ingress -n istio-system

      NAMESPACE      NAME            HOSTS   ADDRESS                                                             PORTS   AGE
      istio-system   istio-ingress   *       a743484b-istiosystem-istio-2af2-xxxxxx.us-west-2.elb.amazonaws.com   80      1h
      ```

      This may takes 3-5 mins to be ready. Verify that the address works by opening it in the browser. If you think this is not secure, you can also `kubectl delete istio-ingress -n istio-system` to remove load balancer.

    * If you don't create load balancer, please use port-forward to visit your cluster. Run following command and visit `localhost:8080`.

      ```
      kubectl port-forward -n kubeflow `kubectl get pods -n kubeflow --selector=service=ambassador -o jsonpath='{.items[0].metadata.name}'` 8080:80
      ```
