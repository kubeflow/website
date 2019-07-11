+++
title = "Examples and tutorials"
description = "A summary of recommended walkthroughs, blog posts, tutorials, and codelabs"
weight = 50
+++

{{< blocks/content-section title="Kubeflow samples" color="light" >}}

{{% blocks/content-item %}}
This section introduces the examples in the 
[kubeflow/examples](https://github.com/kubeflow/examples) repo.
{{% /blocks/content-item %}}

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
{{< /blocks/content-section >}}


{{< blocks/content-section title="Codelabs, workshops, and walkthroughs" color="white" >}}

{{% blocks/content-item %}}
Below is a list of recommended end-to-end tutorials, workshops, walkthroughs,
and codelabs that are hosted outside the Kubeflow repositories.
{{% /blocks/content-item %}}

{{% blocks/content-item title="OpenShift Kubeflow Workshop"
  url="https://github.com/AICoE/openshift_kubeflow_workshop" %}}
Run Kubeflow on Red Hat [OpenShift](https://www.openshift.com/).
{{% /blocks/content-item %}}

{{% blocks/content-item title="Agile Stacks Kubeflow Pipelines Tutorial"
  url="https://www.agilestacks.com/tutorials/ml-pipelines" %}}
Run Kubeflow Pipelines tutorials on AWS, GCP, or on-prem hardware using [AgileStacks](https://www.agilestacks.com/).
Pipeline templates provide end-to-end examples for working with object storage filesystem, Kaniko, Keras, and Seldon.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Katacoda scenarios"
  url="https://www.katacoda.com/kubeflow" %}}
Follow the tutorials to deploy Kubeflow and run a machine learning model.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Introduction to Kubeflow Codelab"
  url="https://codelabs.developers.google.com/codelabs/kubeflow-introduction/index.html" %}}
Run MNIST with Kubeflow on Google Kubernetes Engine.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Introduction to Kubeflow Qwiklab"
  url="https://www.qwiklabs.com/catalog_lab/933" %}}
Run MNIST with resources provided by Qwiklabs.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Kubeflow End to End Codelab"
  url="https://codelabs.developers.google.com/codelabs/cloud-kubeflow-e2e-gis/index.html" %}}
Run GitHub Issue Summarization with Kubeflow on Google Kubernetes Engine.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Kubeflow End to End Qwiklab"
  url="https://www.qwiklabs.com/catalog_lab/1046" %}}
Run GitHub Issue Summarization with resources provided by Qwiklabs.
{{% /blocks/content-item %}}

{{< /blocks/content-section >}}

{{< blocks/content-section title="Blog posts" color="light" >}}

{{% blocks/content-item %}}
The following blog posts provide detailed examples and use cases. Be aware that
a blog post describes the interfaces at the time of publication of the post.
Some interfaces are under rapid development and therefore may change frequently.
{{% /blocks/content-item %}}

{{% blocks/content-item title="The Kubeflow blog"
  url="https://medium.com/kubeflow" %}}
Visit the Kubeflow blog to keep up to date with news about the project and to
learn how to use the latest features.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Using Kubeflow to train and serve a PyTorch model in Google Cloud Platform"
  date="January 23, 2019"
  url="https://medium.com/kubeflow/end-to-end-kubeflow-tutorial-using-a-pytorch-model-in-google-cloud-platform-10fef557a089" %}}
This example demonstrates how you can use Kubeflow to train and serve a 
distributed Machine Learning model with PyTorch on a Google Kubernetes Engine 
cluster in Google Cloud Platform (GCP).
{{% /blocks/content-item %}}


{{% blocks/content-item title="Getting started with Kubeflow Pipelines"
  date="November 16, 2018"
  url="https://cloud.google.com/blog/products/ai-machine-learning/getting-started-kubeflow-pipelines" %}}
This article describes how you can tackle ML workflow operations with 
Kubeflow Pipelines, and highlights some examples that you can try 
yourself. The examples revolve around a TensorFlow ‘taxi fare tip prediction’ 
model, with data pulled from a public BigQuery dataset of Chicago taxi trips.
{{% /blocks/content-item %}}

{{% blocks/content-item title="How to create and deploy a Kubeflow machine learning pipeline"
  date="November 22 - December 4, 2018"
  url="https://towardsdatascience.com/how-to-create-and-deploy-a-kubeflow-machine-learning-pipeline-part-1-efea7a4b650f" %}}
 A series of articles that walk you through the process of taking an existing 
 real-world TensorFlow model and operationalizing the training, evaluation, 
 deployment, and retraining of that model using Kubeflow Pipelines. 
 [Part 1](https://towardsdatascience.com/how-to-create-and-deploy-a-kubeflow-machine-learning-pipeline-part-1-efea7a4b650f)
 (creating and deploying a pipeline), and
 [part 2](https://towardsdatascience.com/how-to-deploy-jupyter-notebooks-as-components-of-a-kubeflow-ml-pipeline-part-2-b1df77f4e5b3)
 (using Jupyter notebooks).
{{% /blocks/content-item %}}
{{< /blocks/content-section >}}


{{< blocks/content-section title="Videos" color="white" >}}

{{% blocks/content-item %}}
Tutorials and overviews published in video format. Be aware that a video 
describes the interfaces at the time of publication of the video.
Some interfaces are under rapid development and therefore may change frequently.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Machine Learning as Code: and Kubernetes with Kubeflow"
  date="December 15, 2018"
  url_text="Watch"
  url="https://www.youtube.com/watch?v=VXrGp5er1ZE" %}}
Presenters: Jason "Jay" Smith and David Aronchick.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Artificial Intelligence at Cisco with Kubeflow"
  date="October 19, 2018"
  url_text="Watch"
  url="https://www.youtube.com/watch?v=ZzPyBY42wh8" %}}
Presenter: Debo Dutta, Distinguished Engineer at Cisco.
{{% /blocks/content-item %}}

{{% blocks/content-item title="CNCF (Cloud Native Computing Foundation) channel"
  url_text="Watch"
  url="https://www.youtube.com/channel/UCvqbFHwN-nwalWPjPUKpvTA/search?query=kubeflow" %}}
A YouTube search for Kubeflow in the CNCF (Cloud Native Computing Foundation)
channel.
{{% /blocks/content-item %}}

{{% blocks/content-item title="Google Cloud Platform channel"
  url_text="Watch"
  url="https://www.youtube.com/user/googlecloudplatform/search?query=kubeflow" %}}
A YouTube search for Kubeflow in the Google Cloud Platform
channel.
{{% /blocks/content-item %}}

{{< /blocks/content-section >}}
