+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow with the shell"
weight = 4
+++

This guide describes how to use the `kfctl` binary to
deploy Kubeflow on Azure.

## Prerequisites

-   Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
-   Install and configure the [Azure Command Line Interface (Az)](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
	-  Log in with ```az login```
-   (Optional) Install Docker
	-   For Windows and WSL: [Guide](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly)
	-   For other OS: [Docker Desktop](https://hub.docker.com/?overlay=onboarding)

You do not need to have an existing Azure Resource Group or Cluster for AKS (Azure Kubernetes Service). You can create a cluster in the deployment process.

## Understanding the deployment process

The deployment process is controlled by 4 different commands:

*    init - The initial one-time set up.
*  generate - Creates the configuration files that define your various resources.
*   apply - Creates or updates the resources.
*   delete - Deletes the resources.

With the exception of init, all commands take an argument which describes the set of resources to apply the command to; this argument can be one of the following:

-   k8s - All Kubernetes resources. Such as Kubeflow packages and add-on packages like fluentd or istio.
-   all - Both Azure (WIP) and Kubernetes resources.
- `${KFAPP}` - the name of a directory where you want Kubeflow configurations to be stored. This directory is created when you runkfctl init. If you want a custom deployment name, specify that name here. The value of this variable becomes the name of your deployment. The value of this variable cannot be greater than 25 characters. It must contain just the directory name, not the full path to the directory. The content of this directory is described in the next section.

### App layout

Your Kubeflow `app` directory contains the following files and directories:

* **app.yaml** - Defines the configuration related to your Kubeflow deployment.
    * These values are set when you run `kfctl init`.
    * These values are snapshotted inside `app.yaml` to make your app self contained.

If you experience any issues running these scripts, see the [troubleshooting guidance](/docs/azure/troubleshooting-azure) for more information.

## Azure Setup

### Login to Azure
    az login
### Initial cluster setup for new cluster

Create a resource group:

    az group create --name <RESOURCE_GROUP_NAME> --location <LOCATION>

Example variables:

- RESOURCE_GROUP_NAME=KubeTest
- LOCATION=westus

Create a specifically defined cluster:

    az aks create -g <RESOURCE_GROUP_NAME> -n <NAME> -s <AGENT_SIZE> -c <AGENT_COUNT> -l <LOCATION> --generate-ssh-keys
Example variables: 

- NAME=KubeTestCluster
- AGENT_SIZE=Standard_D2_v2
- AGENT_COUNT=3
- Use the same resource group and name from the previous step

**NOTE:  If you are using a GPU based AKS cluster (For example: AGENT_SIZE=Standard_NC6), you also need to [install the NVidia drivers](https://docs.microsoft.com/azure/aks/gpu-cluster#install-nvidia-drivers) on the cluster nodes before you can use GPUs with Kubeflow.**

## Kubeflow Installation
Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the ```kfctl``` binary each time you run it.

1. Create user credentials. You only need to run this command once.

        az aks get-credentials --name <NAME> --resource-group <RG>

1. Run the following commands to download the latest binary from the Kubeflow releases page (link = https://github.com/kubeflow/kubeflow/releases/).

        wget <link to your release>

1. Unpack the tar ball

        tar -xvf kfctl_<release tag>_<platform>.tar.gz

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the `kfctl` binary each time you run it.

    ```
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to kfctl in your kubeflow installation>

    # Initialize a kubeflow app:
    export KFAPP=<your choice of application directory name> (ensure this is lowercase)
    kfctl init ${KFAPP}

    # Generate and deploy the app:
    cd ${KFAPP}
    kfctl generate all -V
    kfctl apply k8s -V
    ```

    * ${KFAPP} - the name of a directory where you want Kubeflow configurations to be stored. This directory is created when you runkfctl init. If you want a custom deployment name, specify that name here. The value of this variable becomes the name of your deployment. The value of this variable cannot be greater than 25 characters. It must contain just the directory name, not the full path to the directory. The content of this directory is described in the next section.

1. Check the resources deployed correctly in namespace `kubeflow`

        kubectl get all -n kubeflow

1. Open Kubeflow Dashboard

    ```
    # You may choose to use a load balancer:

    kubectl get svc –n kubeflow
    kubectl expose svc ambassador -n kubeflow --type LoadBalancer --name <SVC_NAME>
    kfctl apply k8s -V

    # Find the external IP to access the dashboard:
    kubectl get svc –n kubeflow
    ```

In this case, the external IP for the service named 'amb1' was 40.XX.XXX.XXX, so it was accessible at that address.

If you didn’t create a load balancer, please use port-forwarding to visit your cluster. Run the following command and visit localhost:8080.

    kubectl port-forward svc/ambassador -n kubeflow 8080:80
