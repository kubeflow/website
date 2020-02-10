+++
title = "Kubeflow Samples"
description = "Examples that demonstrate machine learning with Kubeflow"
weight = 10
+++

This section introduces the examples in the [Kubeflows/examples](https://github.com/kubeflow/example) repository.

{{% blocks/sample-section title="Financial time series"
  kfctl="v0.7"
  url="https://github.com/kubeflow/examples/tree/master/financial_time_series"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=financial_time_series&sha=master" %}}
Train and serve a model for financial time series analysis using TensorFlow on GCP.
{{% /blocks/sample-section %}}

{{% blocks/sample-section title="GitHub issue summarization"
  kfctl="v0.3.0-rc.3"
  url="https://github.com/kubeflow/examples/tree/master/github_issue_summarization"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=github_issue_summarization&sha=master" %}}
Infer summaries of GitHub issues from the descriptions, using a Sequence to Sequence natural language processing model.
You can run the tutorial in a Jupyter notebook or using TFJob. You use Seldon Core to serve the model.
Train and serve a model for financial time series analysis using TensorFlow on GCP.
{{% /blocks/sample-section %}}

{{% blocks/sample-section   title="MNIST image classification"
  kfctl=""
  url="https://github.com/kubeflow/examples/tree/master/mnist"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=mnist&sha=master" %}}
Train and serve an image classification model using the MNIST dataset.
You can choose to train the model locally, using GCP, or using Amazon S3. Serve the model using TensorFlow.
{{% /blocks/sample-section %}}

{{% blocks/sample-section   title="Object detection - cats and dogs"
  kfctl=""
  url="https://github.com/kubeflow/examples/tree/master/object_detection"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=object_detection&sha=master" %}}
Train a distributed model for recognizing breeds of cats and dogs with the TensorFlow Object Detection API. Serve the model using TensorFlow.
{{% /blocks/sample-section %}}

{{% blocks/sample-section title="PyTorch MNIST"
  kfctl=""
  url="https://github.com/kubeflow/examples/tree/master/pytorch_mnist"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=pytorch_mnist&sha=master" %}}
Train a distributed PyTorch model on GCP and serve the model with Seldon Core.
{{% /blocks/sample-section %}}

{{% blocks/sample-section title="Ames housing value prediction"
  kfctl=""
  url="https://github.com/kubeflow/examples/tree/master/xgboost_ames_housing"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=xgboost_ames_housing&sha=master" %}}
Train an XGBoost model using the Kaggle Ames Housing Prices prediction on GCP.
Use Seldon Core to serve the model locally, or GCP to serve it in the cloud.
{{% /blocks/sample-section %}}

{{% blocks/sample-section title="Semantic code search"
  kfctl="0.3"
  url="https://github.com/kubeflow/examples/tree/master/code_search"
  api="https://api.github.com/repos/kubeflow/examples/commits?path=code_search&sha=master" %}}
Use a Sequence to Sequence natural language processing model to perform a semantic code search.
This tutorial runs in a Jupyter notebook and uses Google Cloud Platform (GCP).
{{% /blocks/sample-section %}}
