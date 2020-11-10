+++
title = "Azure Machine Learning Components"
description = "Azure Machine Learning Pipeline Component that performs on step in ML workflow"
weight = 6
+++

A pipeline component is a self-contained set of code that performs one step in the ML workflow. A component is analogous to a function, in that it has a name, parameters, return value and a body. Azure Machine Learning Components are the pipeline components that would integrate with [Azure Machine Learning](https://docs.microsoft.com/en-us/azure/machine-learning/) to manage the life cycle of your models to improve the quality and consistency of your machine learning solution.

The Azure Machine Learning components are used to increase the efficiency of your workflow with Azure Machine Learning. For example, continuous integration, delivery, and deployment. The Azure Machine Learning Components provides the capabilities for: faster experimentation and development of models, faster deployment of models into production, and quality assurance.

## Prerequisites

- Follow the [instruction](https://www.kubeflow.org/docs/azure/) to install Kubeflow on AKS cluster.
- To interact with Azure resourses, you might need to configure them before using the component. See the `readme.md` file for each component to see what Azure resources are required.
- `kfp.azure` extention could be used to create secret to interact with Azure resourses. To create Azure credentials, run:

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


Model registration allows you to store and version your models in the Azure Machine Learning, in your workspace. The model registry makes it easy to organize and keep track of your trained models. After you register the model, you can then download or deploy it and receive all the files that you registered.

To learn more about the Azure ML Register Model pipeline component, refer to the [official repository](https://github.com/kubeflow/pipelines/tree/master/components/azure/azureml/aml-register-model).


To learn more about using Azure ML to manage the lifecycle of your models, go to [Model management, deployment, and monitoring](https://docs.microsoft.com/en-us/azure/machine-learning/concept-model-management-and-deployment).

## Azure ML Deploy Model Component

Trained machine learning models are deployed as web services in the cloud. You could use the model by accessing the model endpoint. When using the model as a web service, following items are included in the component: an entry script and Azure Machine Learning environment configurations.

Please navigate to [AML-deploy-model pipeline component](https://github.com/kubeflow/pipelines/tree/master/components/azure/azureml/aml-deploy-model) for usage details and more information.

See more for [Model Deploy on Azure Machine Learning Page](https://docs.microsoft.com/en-us/azure/machine-learning/concept-model-management-and-deployment).

## Other Azure Machine Learning Capabilities
Navigate to [Azure Machine Learning](https://docs.microsoft.com/en-us/azure/machine-learning/) page to see more capabilities to improve your machine learning workflow.
