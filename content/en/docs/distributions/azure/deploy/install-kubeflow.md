+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow"
weight = 4
                    
+++
This guide describes how to use the kfctl binary to
deploy Kubeflow on Azure.

## Prerequisites

- Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
- Install the [Azure Command Line Interface](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- Install Docker
  - For Windows and Windows Subsystem for Linux (WSL): [Guide](https://docs.docker.com/docker-for-windows/wsl/)
  - For other OS: [Docker Desktop](https://docs.docker.com/docker-hub/)

- If you already have an existing Azure resource group with an Azure Kubernetes Service (AKS) Cluster, you can skip the ressource creation steps in the first part.


## Azure setup

1. Log into Azure from the command line interface
  ```
  az login
  az account set --subscription <NAME OR ID OF SUBSCRIPTION>
  ```
2. Create a resource group
  ```
  az group create -n <RESOURCE_GROUP_NAME> -l <LOCATION>
  ```
  `RESOURCE_GROUP_NAME = KubeFlow`
  `LOCATION = westus`

3. Setup a new Kubernetes cluster
  ```
  az aks create -g <RESOURCE_GROUP_NAME> -n <NAME> -s <AGENT_SIZE> -c <AGENT_COUNT> -l <LOCATION> --generate-ssh-keys
  ```
  `NAME = KubeFlowCluster`
  `AGENT_SIZE = Standard_D4s_v3`
  `AGENT_COUNT = 2`

4. Create user credentials
    ```
    az aks get-credentials -n <NAME> -g <RESOURCE_GROUP_NAME>
    ```

**NOTE**:  If you are using a GPU based AKS cluster, e.g. AGENT_SIZE=Standard_NC6, you also need to [install the NVidia drivers](https://docs.microsoft.com/azure/aks/gpu-cluster#install-nvidia-drivers) on the cluster nodes.



## KubeFlow setup

**NOTE**: To deploy KubeFlow on Azure with multi-user authentication and namespace separation, use the instructions for [Authentication using OICD in Azure](/docs/azure/authentication-oidc). The instructions in this guide apply only to a single-user KubeFlow deployment that currently cannot be upgraded to a multi-user deployment afterwards.

**NOTE**: *kfctl* is currently available for Linux and MacOS users only. If you use Windows, you can install *kfctl* on WSL using the official setup [instructions](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

Run the following commands to deploy KubeFlow on your cluster.

1. Download the latest *kfctl* release from the
  [KubeFlow releases
  page](https://github.com/kubeflow/kfctl/releases/latest).
  
    ```
    wget https://github.com/kubeflow/kfctl/releases/download/v1.2.0/kfctl_v1.2.0-0-gbc038f9_linux.tar.gz
    ```

2. Unpack the tar ball:
    ```
    tar -xvf kfctl_v1.2.0-0-gbc038f9_linux.tar.gz
    ```
3. Optionally, move the unpacked *kfctl* binary file to the bin folder and add it to your path.
    ```
    mv ./kfctl bin/
    export PATH=$PATH:bin
    ```
    
4. Choose a name for your local KubeFlow deployment directory that must contain
    - less than 25 characters
    - only lower case alphanumeric characters or '-'
    - an alphanumeric character at the start and end of the name
    - just a name, not a directory path.  
    ```
    export KF_NAME = my-kubeflow
    ```
  
5. Create a local KubeFlow deployment directory to where you want to store deployments, e.g. /opt.
    ```
    export KF_DIR = /opt/${KF_NAME}
    mkdir -p ${KF_DIR}
    ```
    
6. Set the URI of your KubeFlow deployment configuration file
    ```
    export CONFIG_URI = "{{% config-uri-k8s-istio %}}"
    ```

6. Deploy Kubeflow 
    ```
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_URI}
    
    ```

    * **${CONFIG_URI}** - The URI to the KubeFlow deployment configuration file points to a YAML file on GitHub. This configuration installs Istio by default. 
      Comment out the Istio components in the config file to skip Istio installation. 
      See https://github.com/kubeflow/kubeflow/pull/3663
      
      Running `kfctl apply` or `kfctl build` creates
      a local version of the configuration YAML file in your KubeFlow deployment directory.
      You can customize these files and the Kubernetes resources (modify the manifests and run `kfctl apply` again). 
      
      `kfctl delete` deletes the resources.

7. Run this command to check that the resources have been deployed correctly in the namespace `kubeflow`:

      ```
      kubectl get all -n kubeflow
      ```  

8. Open the KubeFlow Dashboard

    The default installation does not create an external endpoint, but you can use port-forwarding to visit your cluster by running:

    ```
    kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
    ```

    Next, open `http://localhost:8080` in your browser. The KubeFlow Dashboard opens after choosing a workspace name.
     
    Please note you cannot port forward like this from Azure Cloud Shell as it uses this port. 

    To open the dashboard to a public IP address, you should first implement a solution to prevent unauthorized access.
    You can read more about Azure authentication options from [Access Control for Azure Deployment](/docs/azure/authentication).
    

## Additional information

  If you experience any issues running the installation scripts, check the [troubleshooting guidance](/docs/azure/troubleshooting-azure).

  You can find general information about KubeFlow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/methods/kfctl/kustomize/).
