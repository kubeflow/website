+++
title = "Fairing on Azure"
description = "Documentation for Kubeflow Fairing on Azure Kubernetes Service (AKS)"
weight = 45
+++

This page documents how to run the [Fairing prediction sample notebook](https://github.com/kubeflow/fairing/blob/master/examples/prediction/xgboost-high-level-apis.ipynb) on Azure in a notebook hosted in Kubeflow.

While the documentation shows how to run the sample on [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-in/services/kubernetes-service/), the steps should work on any standard Kubernetes cluster.

## Prerequisites

Before you configure and use the Kubeflow Fairing Python SDK, you must have a Kubeflow environment installed. The sample notebook does in-cluster training and thus it is not recommended to use the smallest size virtual machines. The sample has been tested to work in a cluster with 2 nodes and Standard_D4_v3 size.

* If you do not have a Kubeflow installation on Azure, follow the [installation guide][/docs/azure/deploy/install-kubeflow]
* You must have the `kubectl` CLI installed and configured to use the Kubernetes cluster where Kubeflow is installed (in above installation guide, the command `az aks get-credentials` takes care of that)

## Create Azure Container Registry and Storage

In this notebook sample, Azure Container Registry (ACR) is used to host docker images for deployment and Azure Storage (Storage) is used as build context for in-cluster building.

You can re-use existing ACR and Storage or create new ones. For more information how to create, please see the documentation for [ACR](https://docs.microsoft.com/en-us/azure/container-registry/) and [Storage](https://docs.microsoft.com/en-us/azure/storage/).

After you have the ACR and Storage resources created, you must configure a Service Principal to have access to them. If you want to use the same Service Principal as what is configured to be used in your AKS cluster, you can check the id with command:

```
az aks show -g <RESOURCE_GROUP_NAME> -n <NAME>
```

Above command has output like:

```
  "servicePrincipalProfile": {
    "clientId": "<id>"
  },
```

The role you grant must have at least read and write permissions to ACR and Storage.

To read more about how to grant the Service Principal access, please follow the documentation [here](https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal).

## Setting up credentials as Kubernetes secrets

Before running the notebook, you must first configure credentials so that the Python code running within the cluster can
access the Azure resources required to train and deploy.

One way to accomplish this is to first set the right environment variables and then run the commands below that use them.

### Setting the environment variables variables

```
export AZ_CLIENT_ID=<Service Principal Client ID e.g. property `client_id` from ~/.azure/aksServicePrincipal.json>
export AZ_CLIENT_SECRET=<Service Principal Client Secret e.g. property `client_secret` from ~/.azure/aksServicePrincipal.json>
export AZ_TENANT_ID=<Tenant ID of the subscription e.g. `tenantId` from output of `az account show`>
export AZ_SUBSCRIPTION_ID=<Subscription ID e.g. `id` from output of `az account show`>
export TARGET_NAMESPACE=<target namespace e.g. kubeflow-anonymous>
export ACR_NAME=<name of the configured ACR to which the Service Principal has access to e.g. kubeflowacr>
```

### Setting the secrets with kubectl

```
kubectl create secret generic -n ${TARGET_NAMESPACE} azcreds --from-literal=AZ_CLIENT_ID=${AZ_CLIENT_ID} --from-literal=AZ_CLIENT_SECRET=${AZ_CLIENT_SECRET} --from-literal=AZ_TENANT_ID=${AZ_TENANT_ID} --from-literal=AZ_SUBSCRIPTION_ID=${AZ_SUBSCRIPTION_ID}
```

```
kubectl create secret docker-registry -n ${TARGET_NAMESPACE} acrcreds --docker-server=${ACR_NAME}.azurecr.io --docker-username=${AZ_CLIENT_ID} --docker-password=${AZ_CLIENT_SECRET}
kubectl patch serviceaccount default-editor -n ${TARGET_NAMESPACE} -p "{\"imagePullSecrets\": [{\"name\": \"acrcreds\"}]}"
```

## Creating a Notebook Server in Kubeflow

To create a Notebook Server, use your Web browser to access the Kubeflow Central Dashboard and select the `Notebook Servers` panel from the menu.

First, select the target namespace in which you want to host the server. In the default Kubeflow installation, there should be a namespace `kubeflow-anonymous` available in the namespace drop-down menu.

After the target namespace is selected, press the `NEW SERVER`-button and fill in the mandatory fields. The fields with default values can all be left as they are and do not have to be modified for the purpose of running the sample notebook.

After launching the server, wait for the `CONNECT`-button to appear and press it to connect (it may take up to a minute for the server to ready for connection).

## Cloning the sample notebook

The easiest way to get the latest sample notebook to the notebook server is to clone it using the terminal.

After you have connected to the notebook server, select the new terminal option like in the screenshot below:

<img src="/docs/images/azure-notebook-new-terminal.png"
    alt="Creating new terminal after connecting to notebook server"
    class="mt-3 mb-3 p-3 border border-info rounded">

In the terminal window, type:

```
git clone https://github.com/kubeflow/fairing.git
```

This clones the project including the samples so that they are accessible within the notebook server.

The terminal window can be closed and you should now see the `fairing`-folder in the Web browser tab in which you have connected to the notebook server. Use the browser to navigate to the sample and once done, the address bar in your Web browser should have path matching like this:

```
/notebook/<target-namespace>/<notebook-server-name>/notebooks/fairing/examples/prediction/xgboost-high-level-apis.ipynb
```

## Executing the notebook

Before running the cells, please read below how to configure Fairing to use the right Azure resources.

The notebook `xgboost-high-level-apis.ipynb` has a cell where you can configure which backend to use. This cell is tagged with `parameters`-tag and to use the Azure backend with the Storage you configured to be used, these values need to be configured:

```
export FAIRING_BACKEND = 'KubeflowAzureBackend'
export DOCKER_REGISTRY = '<ACR_NAME>.azurecr.io'
export AZURE_REGION = None # This is only relevant if you haven't created a Storage yet and let Fairing create it for you. In that case, you can specify the region as string, for example, 'NorthEurope'.
export AZURE_RESOURCE_GROUP = '<STORAGE_RESOURCE_GROUP>'
export AZURE_STORAGE_ACCOUNT = '<STORAGE_NAME>'
```

After above steps have been followed, you can run all the cells.

You can also have a look at the [CI pipeline](https://dev.azure.com/kubeflow/kubeflow/_build) that runs the sample notebook in AKS for steps involved to accomplish a success run programmatically.
