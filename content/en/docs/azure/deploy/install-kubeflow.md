+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow"
weight = 4
                    
+++
This guide describes how to use the kfctl binary to
deploy Kubeflow on Azure.

## Prerequisites

- Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
- Install and configure the [Azure Command Line Interface (Az)](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
  - Log in with ```az login```
- (Optional) Install Docker
  - For Windows and WSL: [Guide](https://docs.docker.com/docker-for-windows/wsl/)
  - For other OS: [Docker Desktop](https://docs.docker.com/docker-hub/)

You do not need to have an existing Azure Resource Group or Cluster for AKS (Azure Kubernetes Service). You can create a cluster in the deployment process.

## Understanding the deployment process

The deployment process is controlled by the following commands:

* **build** - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* **apply** - Creates or updates the resources.
* **delete** - Deletes the resources.

### App layout

Your Kubeflow application directory **${KF_DIR}** contains the following files and
directories:

* **${CONFIG_FILE}** is a YAML file that defines configurations related to your
  Kubeflow deployment.

  * This file is a copy of the GitHub-based configuration YAML file that
    you used when deploying Kubeflow. For example, {{% azure/config-uri-azure %}}.
  * When you run `kfctl apply` or `kfctl build`, kfctl creates
    a local version of the configuration file, `${CONFIG_FILE}`,
    which you can further customize if necessary.

* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
  * The directory is created when you run `kfctl build` or `kfctl apply`.
  * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).

If you experience any issues running these scripts, see the [troubleshooting guidance](/docs/azure/troubleshooting-azure) for more information.

## Azure setup

### To log into Azure from the command line interface, run the following commands

  ```
  az login
  az account set --subscription <NAME OR ID OF SUBSCRIPTION>
  ```

### Initial cluster setup for new cluster

Create a resource group:

  ```
  az group create -n <RESOURCE_GROUP_NAME> -l <LOCATION>
  ```

Example variables:

- `RESOURCE_GROUP_NAME=KubeTest`
- `LOCATION=westus`

Create a specifically defined cluster:
  
  ```
  az aks create -g <RESOURCE_GROUP_NAME> -n <NAME> -s <AGENT_SIZE> -c <AGENT_COUNT> -l <LOCATION> --generate-ssh-keys
  ```

Example variables:

- `NAME=KubeTestCluster`
- `AGENT_SIZE=Standard_D4s_v3`
- `AGENT_COUNT=2`
- `RESOURCE_GROUP_NAME=KubeTest`

**NOTE**:  If you are using a GPU based AKS cluster (For example: AGENT_SIZE=Standard_NC6), you also need to [install the NVidia drivers](https://docs.microsoft.com/azure/aks/gpu-cluster#install-nvidia-drivers) on the cluster nodes before you can use GPUs with Kubeflow.

Obtain the `kubeconfig` user credentials:
    ```
    az aks get-credentials -n <NAME> -g <RESOURCE_GROUP_NAME>
    ```

## Kubeflow installation

**Important**: To deploy Kubeflow on Azure with multi-user authentication and namespace separation, use the instructions for [Authentication using OICD in Azure](/docs/azure/authentication-oidc). The instructions in this guide apply only to a single-user Kubeflow deployment. Such a deployment cannot be upgraded to a multi-user deployment at this time.

For a standard single-user installation of Kubeflow on Azure Kubernetes Service please continue with the general instructions for installing Kubeflow on any existing Kubernetes cluster. These instructions can be found at [Instructions for installing Kubeflow on your existing Kubernetes cluster using kfctl_k8s_istio config](/docs/started/k8s/kfctl-k8s-istio/).

## Additional information

  You can find general information about Kubeflow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/other-guides/kustomize/).
