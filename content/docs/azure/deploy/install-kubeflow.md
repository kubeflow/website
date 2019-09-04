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
* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl generate`.
    * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).

If you experience any issues running these scripts, see the [troubleshooting guidance](/docs/azure/troubleshooting-azure) for more information.

## Azure Setup

### Login to Azure
    az login
### Initial cluster setup for new cluster

Create a resource group:

    az group create -n <RESOURCE_GROUP_NAME> -l <LOCATION>

Example variables:

- RESOURCE_GROUP_NAME=KubeTest
- LOCATION=westus

Create a specifically defined cluster:

    az aks create -g <RESOURCE_GROUP_NAME> -n <NAME> -s <AGENT_SIZE> -c <AGENT_COUNT> -l <LOCATION> --generate-ssh-keys

Example variables: 

- NAME=KubeTestCluster
- AGENT_SIZE=Standard_D4_v3
- AGENT_COUNT=2
- Use the same resource group and name from the previous step

**NOTE:  If you are using a GPU based AKS cluster (For example: AGENT_SIZE=Standard_NC6), you also need to [install the NVidia drivers](https://docs.microsoft.com/azure/aks/gpu-cluster#install-nvidia-drivers) on the cluster nodes before you can use GPUs with Kubeflow.**

## Kubeflow Installation
Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the ```kfctl``` binary each time you run it.

1. Create user credentials. You only need to run this command once.

        az aks get-credentials -n <NAME> -g <RESOURCE_GROUP_NAME>

1. Run the following commands to download the latest kfctl binary from the Kubeflow releases page (links from https://github.com/kubeflow/kubeflow/releases). While writing this document, the latest release was https://github.com/kubeflow/kubeflow/releases/tag/v0.6.2

        wget <link to the release e.g. https://github.com/kubeflow/kubeflow/releases/download/v0.6.2/kfctl_v0.6.2_linux.tar.gz>

1. Unpack the tar ball

        tar -xvf kfctl_<release tag>_<platform>.tar.gz

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the `kfctl` binary each time you run it.

    ```
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to where kfctl was unpacked>

    # Initialize a kubeflow app:
    export KFAPP=<your choice of application directory name> (ensure this is lowercase)
    export CONFIG=<file path or url to config to use, for example: https://raw.githubusercontent.com/kubeflow/kubeflow/v0.6.2/bootstrap/config/kfctl_k8s_istio.0.6.2.yaml>
    kfctl init ${KFAPP} --config=${CONFIG}

    # Generate and deploy the app:
    cd ${KFAPP}
    kfctl generate all -V
    kfctl apply all -V
    ```

    * ${KFAPP} - the name of a directory where you want Kubeflow configurations to be stored. This directory is created when you run kfctl init. If you want a custom deployment name, specify that name here. The value of this variable becomes the name of your deployment. The value of this variable cannot be greater than 25 characters. It must contain just the directory name, not the full path to the directory.

1. Check the resources deployed correctly in namespace `kubeflow`

        kubectl get all -n kubeflow

1. Open Kubeflow Dashboard

The default installation does not create an external endpoint but you can use port-forwarding to visit your cluster. Run the following command and visit http://localhost:8080.

    kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80

In case you want to expose the Kubeflow Dashboard over an external IP, you can change the type of the ingress gateway. To do that, you can edit the service:

        kubectl edit -n istio-system svc/istio-ingressgateway

From that file, replace `type: NodePort` with `type: LoadBalancer` and save.

While the change is being applied, you can watch the service until below command prints a value under the `EXTERNAL-IP` column:

        kubectl get -w -n istio-system svc/istio-ingressgateway

The external IP should be accessible by visiting http://<EXTERNAL-IP>. Note that above installation instructions do not create any protection for the external endpoint so it will be accessible to anyone without any authentication. You can read more about authentication from [Access Control for Azure Deployment](/docs/azure/authentication).

## Additional Information

You can find general information about Kubeflow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/other-guides/kustomize/).
