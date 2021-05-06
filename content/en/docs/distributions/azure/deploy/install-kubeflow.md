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
- Install Docker
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

## Kubeflow installation

**Important**: To deploy Kubeflow on Azure with multi-user authentication and namespace separation, use the instructions for [Authentication using OICD in Azure](/docs/azure/authentication-oidc). The instructions in this guide apply only to a single-user Kubeflow deployment. Such a deployment cannot be upgraded to a multi-user deployment at this time.

**Note**: kfctl is currently available for Linux and macOS users only. If you use Windows, you can install kfctl on Windows Subsystem for Linux (WSL). Refer to the official [instructions](https://docs.microsoft.com/en-us/windows/wsl/install-win10) for setting up WSL.

Run the following commands to set up and deploy Kubeflow.

1. Create user credentials. You only need to run this command once.

    ```
    az aks get-credentials -n <NAME> -g <RESOURCE_GROUP_NAME>
    ```

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases
  page](https://github.com/kubeflow/kfctl/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
    ```

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the
   binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the kfctl binary each time you run it.

    ```
    # The following command is optional. It adds the kfctl binary to your path.
    # If you don't add kfctl to your path, you must use the full path
    # each time you run kfctl.
    # Use only alphanumeric characters or - in the directory name.
    export PATH=$PATH:"<path-to-kfctl>"

    # Set KF_NAME to the name of your Kubeflow deployment. You also use this
    # value as directory name when creating your configuration directory.
    # For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
    export KF_NAME=<your choice of name for the Kubeflow deployment>

    # Set the path to the base directory where you want to store one or more 
    # Kubeflow deployments. For example, /opt/.
    # Then set the Kubeflow application directory for this deployment.
    export BASE_DIR=<path to a base directory>
    export KF_DIR=${BASE_DIR}/${KF_NAME}

    # Set the configuration file to use when deploying Kubeflow.
    # The following configuration installs Istio by default. Comment out 
    # the Istio components in the config file to skip Istio installation. 
    # See https://github.com/kubeflow/kubeflow/pull/3663
    export CONFIG_URI="{{% config-uri-k8s-istio %}}"
    
    mkdir -p ${KF_DIR}
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_URI}

    ```

    * **${KF_NAME}** - The name of your Kubeflow deployment.
      If you want a custom deployment name, specify that name here.
      For example,  `my-kubeflow` or `kf-test`.
      The value of KF_NAME must consist of lower case alphanumeric characters or
      '-', and must start and end with an alphanumeric character.
      The value of this variable cannot be greater than 25 characters. It must
      contain just a name, not a directory path.
      You also use this value as directory name when creating the directory where 
      your Kubeflow  configurations are stored, that is, the Kubeflow application 
      directory. 

    * **${KF_DIR}** - The full path to your Kubeflow application directory.

    * **${CONFIG_URI}** - The GitHub address of the configuration YAML file that
      you want to use to deploy Kubeflow. The URI used in this guide is
      {{% config-uri-k8s-istio %}}.
      When you run `kfctl apply` or `kfctl build` (see the next step), kfctl creates
      a local version of the configuration YAML file which you can further
      customize if necessary.

2. Run this command to check that the resources have been deployed correctly in namespace `kubeflow`:

      ```
      kubectl get all -n kubeflow
      ```  

3. Open the Kubeflow Dashboard

    The default installation does not create an external endpoint but you can use port-forwarding to visit your cluster.
    Run the following command:

     ```
     kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
     ```

     Next, open `http://localhost:8080` in your browser.

    To open the dashboard to a public IP address, you should first implement a solution to prevent unauthorized access.
    You can read more about Azure authentication options from [Access Control for Azure Deployment](/docs/azure/authentication).

## Additional information

  You can find general information about Kubeflow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/methods/kfctl/kustomize/).
