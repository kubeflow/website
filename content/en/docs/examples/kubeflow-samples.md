+++
title = "Kubeflow Samples"
description = "Examples that demonstrate machine learning with Kubeflow"
weight = 10
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

This section introduces the examples in the 
[kubeflow/examples](https://github.com/kubeflow/examples) repository.
Before using a sample, check the sample's README file for known issues.

{{% blocks/sample-section title="MNIST image classification"
  kfctl="v1.0.0"
  url="https://github.com/kubeflow/examples/tree/master/mnist"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=mnist&sha=master" %}}
Train and serve an image classification model using the MNIST dataset.
This tutorial takes the form of a Jupyter notebook running in your Kubeflow
cluster.
You can choose to deploy Kubeflow and train the model on various clouds, 
including Amazon Web Services (AWS), Google Cloud Platform (GCP), IBM Cloud, 
Microsoft Azure, and on-premises. Serve the model with TensorFlow Serving.
{{% /blocks/sample-section %}}

{{% blocks/sample-section title="Financial time series"
  kfctl="v0.7"
  url="https://github.com/kubeflow/examples/tree/master/financial_time_series"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=financial_time_series&sha=master" %}}
Train and serve a model for financial time series analysis using TensorFlow on
Google Cloud Platform (GCP). Use the Kubeflow Pipelines SDK to automate the 
workflow.
{{% /blocks/sample-section %}}

## Next steps

Work through one of the 
[Kubeflow Pipelines samples](/docs/pipelines/tutorials/build-pipeline/).
