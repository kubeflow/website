+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow with the shell"
weight = 4
+++

This guide describes how to use the kfctl binary to
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

The deployment process is controlled by the following commands:

* **build** - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* **apply** - Creates or updates the resources.
* **delete** - Deletes the resources.

### App layout

Your Kubeflow app directory **${KFAPP}** contains the following files and directories:

* **app.yaml** - Defines the configuration related to your Kubeflow deployment.
    * These values are set when you run `kfctl build` or `kfctl apply`.
    * These values are snapshotted inside `app.yaml` to make your app self contained.
* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl build` or `kfctl apply`.
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
- AGENT_SIZE=Standard_D2_v2
- AGENT_COUNT=3
- Use the same resource group and name from the previous step

**NOTE:  If you are using a GPU based AKS cluster (For example: AGENT_SIZE=Standard_NC6), you also need to [install the NVidia drivers](https://docs.microsoft.com/azure/aks/gpu-cluster#install-nvidia-drivers) on the cluster nodes before you can use GPUs with Kubeflow.**

## Kubeflow Installation
Run the following commands to set up and deploy Kubeflow.

1. Create user credentials. You only need to run this command once.

        az aks get-credentials -n <NAME> -g <RESOURCE_GROUP_NAME>

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball

        tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the kfctl binary each time you run it.

    ```
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to where kfctl was unpacked>

    # Initialize a kubeflow app:
    export KFAPP=<your choice of application name for Kubeflow> (ensure this is lowercase)
    # Set the configuration file to use, such as the file specified below:
    export CONFIG="{{% config-uri-k8s-istio %}}"

    # Generate and deploy Kubeflow:
    mkdir ${KFAPP}
    cd ${KFAPP}
    kfctl apply -V -f ${CONFIG}
    ```

    * ${KFAPP} - The name of your Kubeflow application. This value also
  becomes the name of the directory where your Kubeflow configurations are 
  stored. If you want a custom deployment name, specify that name here.
  For example,  `kubeflow-test` or `kfw-test`.
  The value of KFAPP must consist of lower case alphanumeric characters or
  '-', and must start and end with an alphanumeric character.
  The value of this variable cannot be greater than 25 characters. It must
  contain just a name, not a directory path.

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
