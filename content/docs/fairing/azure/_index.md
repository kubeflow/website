+++
title = "Fairing on Azure"
description = "Documentation for Kubeflow Fairing on Microsoft Azure Kubernetes Service"
weight = 45
+++

This page documents how to run the [Fairing prediction example
notebook][xgb-notebook] on [Azure Kubernetes Service
(AKS)][az-kubernetes] in a notebook hosted on Kubeflow.

## Prerequisites

Before you configure and use the Kubeflow Fairing Python SDK, you must have a
Kubeflow environment installed. The example notebook does in-cluster training.
The example notebook has been tested to work in a cluster with 2 nodes and
virtual machines with Standard_D4_v3 size. It is not recommended to use the
smallest size virtual machines.

* If you do not have a Kubeflow installation on Azure, follow the [installation
  guide][kf-az-deploy].
* You must have the `kubectl` command line interface installed and configured
  to use the Kubernetes cluster where Kubeflow is installed. In the above
  installation guide, the command `az aks get-credentials` configures `kubectl`
  to access your Kubernetes cluster.

## Create Azure Container Registry and Storage

The example notebook uses Azure Container Registry (ACR) to host docker
images for deployment and Azure Storage (Storage) is used as build context for
in-cluster building.

You can re-use existing ACR and Storage resources or create new ones. For more
information, see the documentation for [ACR][az-container-reg] and
[Storage][az-storage].

After you have created your ACR and Storage resources, you must configure a
service principal with access to these resources. If you want to use the same
service principal as your AKS cluster, you can get the service principal ID
with the following command:

```bash
az aks show -g <resource-group-name> -n <name>
```

The above command has output like this:

```
  "servicePrincipalProfile": {
    "clientId": "<id>"
  },
```

The role you grant must have at least read and write permissions to ACR and
Storage.

To learn more about how to grant the Service Principal access, follow the
[Azure role-based authentication documentation][az-roles].

## Setting up credentials as Kubernetes secrets

Before running the notebook, you must first configure credentials so that the
Python code running within the cluster can access the Azure resources required
to train and deploy a model.

Run the following commands to set up your credentials as a Kubernetes secret.

1.  Set environment variables to use in the following commands.

    ```bash
    export AZ_CLIENT_ID=<service-principal-client-id>
    export AZ_CLIENT_SECRET=<service-principal-client-secret>
    export AZ_TENANT_ID=<tenant-id>
    export AZ_SUBSCRIPTION_ID=<subscription-id>
    export TARGET_NAMESPACE=<target-namespace e.g. kubeflow-anonymous>
    export ACR_NAME=<acr-name>
    ```

    * **AZ_CLIENT_ID:** The Service Principal client ID. You can get the
      `client_id` property from ~/.azure/aksServicePrincipal.json.
    * **AZ_CLIENT_SECRET:** The Service Principal secret. You can get the
      `client_secret` property from ~/.azure/aksServicePrincipal.json.
    * **AZ_TENANT_ID:** The Azure Tenant ID of your account. You can get the
      Tenant ID from the `tenantId` field in the output of `az account show`.
    * **AZ_SUBSCRIPTION:** The Azure Subscription ID of your account. You can
      get the Subscription ID from the `id` field in the output of `az account
      show`.
    * **TARGET_NAMESPACE:** Specify the namespace that your Notebook Server is
      in. For example, this guide recommends using `kubeflow-anonymous`.
    * **ACR_NAME:** The name of an ACR that the Service Principal can access.

1.  Use the following command to create a secret that Kubeflow can use to access
    Azure APIs.

    ```bash
    kubectl create secret generic -n ${TARGET_NAMESPACE} azcreds \
    --from-literal=AZ_CLIENT_ID=${AZ_CLIENT_ID} \
    --from-literal=AZ_CLIENT_SECRET=${AZ_CLIENT_SECRET} \
    --from-literal=AZ_TENANT_ID=${AZ_TENANT_ID} \
    --from-literal=AZ_SUBSCRIPTION_ID=${AZ_SUBSCRIPTION_ID}
    ```

1.  Use the following command to create a secret that Kubeflow can use to access
    ACR.

    ```bash
    kubectl create secret docker-registry -n ${TARGET_NAMESPACE} acrcreds \
    --docker-server=${ACR_NAME}.azurecr.io \
    --docker-username=${AZ_CLIENT_ID} \
    --docker-password=${AZ_CLIENT_SECRET}
    kubectl patch serviceaccount default-editor -n ${TARGET_NAMESPACE} \
    -p "{\"imagePullSecrets\": [{\"name\": \"acrcreds\"}]}"
    ```

## Creating a Notebook Server in Kubeflow

To create a notebook server, use your Web browser to access the Kubeflow
Central Dashboard and select the **Notebook Servers** panel from the menu.

First, select the target namespace in which you want to host the server. In the
default Kubeflow installation, there should be a namespace `kubeflow-anonymous`
available in the namespace drop-down menu.

After the target namespace is selected, click **NEW SERVER** and fill in the
mandatory fields. The fields with default values can all be left as they
are and do not have to be modified to run the example notebook.

After launching the server, wait for the **CONNECT** button to appear and click
**CONNECT** to launch your Notebook Server. It may take up to a minute for the
server to be ready for connections.

## Cloning the example notebook

Clone the Kubeflow Fairing repository to download the files used in this example. 

1.  Connect to your notebook server, then click the new terminal option
    like in the screenshot below:
    <img src="/docs/images/azure-notebook-new-terminal.png" alt="Creating new terminal after connecting to notebook server" class="mt-3 mb-3 p-3 border border-info rounded" />

1.  Run the following command to clone the Kubeflow Fairing project:
    ```bash
    git clone https://github.com/kubeflow/fairing.git
    ```
    This command clones the project including the example into your notebook server.

You can now close the terminal window, and you should now see the `fairing` folder
in your notebooks server's Files tab. Navigate to the example notebooks at
`fairing/examples/prediction/xgboost-high-level-apis.ipynb`.

## Executing the notebook

Before running the cells, read the following to learn how to configure Fairing
to use your Azure resources.

In the `xgboost-high-level-apis.ipynb` notebook, find the cell tagged with
`parameters` and update this cell to use Azure. Update following values to
configure Fairing to use your Azure backend and Storage.

```bash
export FAIRING_BACKEND = 'KubeflowAzureBackend'
export DOCKER_REGISTRY = '<acr-name>.azurecr.io'
export AZURE_REGION = None # This is only relevant if you haven't created a
                           # Storage yet and let Fairing create it for you.
                           # In that case, you can specify the region as
                           # string, for example, 'NorthEurope'.
export AZURE_RESOURCE_GROUP = '<storage-resource-group>'
export AZURE_STORAGE_ACCOUNT = '<storage-name>'
```

After the above steps have been completed, you can run the example notebook.

You can also have a look at the [CI pipeline][az-ci-pipeline] that runs the
example notebook in AKS for steps involved to accomplish a successful run
programmatically.

[xgb-notebook]: https://github.com/kubeflow/fairing/blob/master/examples/prediction/xgboost-high-level-apis.ipynb
[az-kubernetes]: https://azure.microsoft.com/en-in/services/kubernetes-service/
[az-container-reg]: https://docs.microsoft.com/en-us/azure/container-registry/
[az-storage]: https://docs.microsoft.com/en-us/azure/storage/
[az-roles]: https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal
[az-ci-pipeline]: https://dev.azure.com/kubeflow/kubeflow/_build
[kf-az-deploy]: /docs/azure/deploy/install-kubeflow