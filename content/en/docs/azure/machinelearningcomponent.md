+++
title = "Azure Machine Learning Components"
description = "Overview of Azure Machine Learning pipeline components for workflow improvements"
weight = 6
+++

Azure Machine Learning (Azure ML) components are pipeline components that integrate with [Azure ML](https://docs.microsoft.com/en-us/azure/machine-learning/) to manage the lifecycle of your machine learning (ML) models to improve the quality and consistency of your machine learning solution. A pipeline component is a self-contained set of code that performs one step in the ML workflow. A component is analogous to a function, in that it has a name, parameters, return value and a body. 

The Azure Machine Learning components are used to increase the efficiency of your workflow with Azure Machine Learning. For example, continuous integration, delivery, and deployment. The Azure Machine Learning Components provides the capabilities for: faster experimentation and development of models, faster deployment of models into production, and quality assurance.

## Prerequisites

- Follow the [instruction](https://www.kubeflow.org/docs/azure/) to install Kubeflow on AKS cluster.
- To interact with Azure resources, you may need to configure them before using a particular pipeline component. Check the README for each component to learn about what Azure resources are required.
- The `kfp.azure` extension can be used to create a secret to interact with Azure resources. To create Azure credentials, run:

```shell
# Initialize variables:
AZ_SUBSCRIPTION_ID={Your_Azure_subscription_ID}
AZ_TENANT_ID={Your_Tenant_ID}
AZ_CLIENT_ID={Your_client_ID}
AZ_CLIENT_SECRET={Your_client_secret}
KUBEFLOW_NAMESPACE=kubeflow

kubectl create secret generic azcreds --from-literal=AZ_SUBSCRIPTION_ID=$AZ_SUBSCRIPTION_ID \
                                      --from-literal=AZ_TENANT_ID=$AZ_TENANT_ID \
                                      --from-literal=AZ_CLIENT_ID=$AZ_CLIENT_ID \
                                      --from-literal=AZ_CLIENT_SECRET=$AZ_CLIENT_SECRET \
                                      -n $KUBEFLOW_NAMESPACE
```

## Azure ML Register Model component


Model registration allows you to store and version your models in Azure Machine Learning in your workspace. The model registry makes it easy to organize and keep track of your trained models. After you register the model, you can then download or deploy it and receive all the registered files.


To learn more about the Azure ML Register Model pipeline component, refer to the [official repository](https://github.com/kubeflow/pipelines/tree/master/components/azure/azureml/aml-register-model).


To learn more about using Azure ML to manage the lifecycle of your models, go to [Model management, deployment, and monitoring](https://docs.microsoft.com/en-us/azure/machine-learning/concept-model-management-and-deployment).

## Azure ML Deploy Model component

Trained machine learning models are deployed as web services in the cloud and you can use your model by accessing its endpoint. When using the model as a web service, the following items are included in the Azure ML Deploy Model component: 

- An entry script
- Azure ML environment configurations

For more information about the Azure ML Deploy Model pipeline component, check the [official repository](https://github.com/kubeflow/pipelines/tree/master/components/azure/azureml/aml-deploy-model).

To learn more about using Azure ML to manage the lifecycle of your models, go to [Model management, deployment, and monitoring](https://docs.microsoft.com/en-us/azure/machine-learning/concept-model-management-and-deployment).

## Other Azure ML capabilities

You can learn more about the capabilities of Azure ML and how to improve your ML workflow by checking the [Azure ML documentation](https://docs.microsoft.com/en-us/azure/machine-learning/) 
