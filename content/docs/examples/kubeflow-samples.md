+++
title = "Kubeflow samples"
description = "This section introduces the examples in the [kubeflow/examples](https://github.com/kubeflow/examples) repo."
weight = 10
+++

{{% blocks/content-item title="Semantic code search"
  url="https://github.com/kubeflow/examples/tree/master/code_search" %}}
Use a Sequence to Sequence natural language processing model to perform a semantic code search. This tutorial runs in a Jupyter notebook and uses Google Cloud Platform (GCP).
{{% /blocks/content-item %}}

{{% blocks/content-item title="Financial time series"
  url="https://github.com/kubeflow/examples/tree/master/financial_time_series" %}}
Train and serve a model for financial time series analysis using TensorFlow
on GCP.
{{% /blocks/content-item %}}


{{% blocks/content-item title="GitHub issue summarization"
  url="https://github.com/kubeflow/examples/tree/master/github_issue_summarization" %}}
Infer summaries of GitHub issues from the descriptions, using a Sequence to
Sequence natural language processing model. You can run the tutorial in a
Jupyter notebook or using TFJob. You use Seldon Core to serve the model.
{{% /blocks/content-item %}}

{{% blocks/content-item title="MNIST image classification"
  url="https://github.com/kubeflow/examples/tree/master/mnist" %}}
Train and serve an image classification model using the MNIST dataset. You can
choose to train the model locally, using GCP, or using Amazon S3. Serve the
model using TensorFlow.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Object detection - cats and dogs"
  url="https://github.com/kubeflow/examples/tree/master/object_detection" %}}
Train a distributed model for recognizing breeds of cats and
dogs with the TensorFlow Object Detection API. Serve the model using TensorFlow.
{{% /blocks/content-item %}}

{{% blocks/content-item title="PyTorch MNIST"
  url="https://github.com/kubeflow/examples/tree/master/pytorch_mnist" %}}
Train a distributed PyTorch model on GCP and serve the model with Seldon Core.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Ames housing value prediction"
  url="https://github.com/kubeflow/examples/tree/master/xgboost_ames_housing" %}}
Train an XGBoost model using the Kaggle Ames Housing Prices prediction on GCP.
Use Seldon Core to serve the model locally, or GCP to serve it in the cloud.
{{% /blocks/content-item %}}
