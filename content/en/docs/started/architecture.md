+++
title = "Architecture"
description = "An overview of Kubeflow's architecture"
weight = 10
+++

This guide introduces Kubeflow ecosystem and explains how Kubeflow components fit in ML lifecycle.

Read [the introduction guide](/docs/started/introduction) to learn more about Kubeflow, standalone
Kubeflow components and Kubeflow Platform.

## Kubeflow Ecosystem

The following diagram gives an overview of the Kubeflow Ecosystem and how it relates to the wider
Kubernetes and AI/ML landscapes.

<img src="/docs/started/images/kubeflow-architecture.drawio.svg"
  alt="An architectural overview of Kubeflow on Kubernetes"
  class="mt-3 mb-3">

Kubeflow builds on [Kubernetes](https://kubernetes.io/) as a system for
deploying, scaling, and managing AI/ML infrastructure.

## Introducing the ML Lifecycle

When you develop and deploy an AI application, the ML lifecycle typically consists of
several stages. Developing an ML system is an iterative process.
You need to evaluate the output of various stages of the ML lifecycle, and apply
changes to the model and parameters when necessary to ensure the model keeps
producing the results you need.

The following diagram shows the ML lifecycle stages in sequence:

<img src="/docs/started/images/ml-lifecycle.drawio.svg"
  alt="ML Lifecycle"
  class="mt-3 mb-3">

Looking at the stages in more detail:

- In the _Data Preparation_ step you ingest raw data, perform feature engineering to extract ML
  features for the offline feature store, and prepare training data for model development.
  Usually, this step is associated with data processing tools such as Spark, Dask, Flink, or Ray.

- In the _Model Development_ step you choose an ML framework, develop your model architecture and
  explore the existing pre-trained models for fine-tuning like BERT or Llama.

- In the _Model Optimization_ step you can optimize your model hyperparameters and optimize your
  model with various AutoML algorithms such as neural architecture search and model compression.
  During model optimization you can store ML metadata in the _Model Registry_.

- In the _Model Training_ step you train or fine-tune your model on the large-scale
  compute environment. You should use a distributed training if single GPU can't handle your
  model size. The results of the model training is the trained model artifact that you
  can store in the _Model Registry_.

- In the _Model Serving_ step you serve your model artifact for online or batch inference. Your
  model may perform predictive or generative AI tasks depending on the use-case. During the model
  serving step you may use an online feature store to extract features. You monitor the model
  performance, and feed the results into your previous steps in the ML lifecycle.

### ML Lifecycle for Production and Development Phases

The ML lifecycle for AI applications may be conceptually split between _development_ and
_production_ phases, this diagram explores which stages fit into each phase:

<img src="/docs/started/images/ml-lifecycle-dev-prod.drawio.svg"
  alt="ML Lifecycle with Development and Production"
  class="mt-3 mb-3">

### Kubeflow Components in the ML Lifecycle

The next diagram shows how Kubeflow components are used for each stage in the ML lifecycle:

<img src="/docs/started/images/ml-lifecycle-kubeflow.drawio.svg"
  alt="Kubeflow Components in ML Lifecycle"
  class="mt-3 mb-3">

See the following links for more information about each Kubeflow component:

- [Kubeflow Spark Operator](https://github.com/kubeflow/spark-operator) can be used for data
  preparation and feature engineering step.

- [Kubeflow Notebooks](/docs/components/notebooks/) can be used for model development and interactive
  data science to experiment with your ML workflows.

- [Kubeflow Katib](/docs/components/katib/) can be used for model optimization and hyperparameter
  tuning using various AutoML algorithms.

- [Kubeflow Trainer](/docs/components/trainer/) can be used for large-scale distributed
  training or LLM fine-tuning.

- [Kubeflow Model Registry](/docs/components/model-registry/) can be used to store ML metadata,
  model artifacts, and preparing models for production serving.

- [KServe](https://kserve.github.io/website/master/) can be used for online and batch inference
  in the model serving step.

- [Feast](https://feast.dev/) can be used as a feature store and to manage offline and online
  features.

- [Kubeflow Pipelines](/docs/components/pipelines/) can be used to build, deploy, and manage each
  step in the ML lifecycle.

You can use most Kubeflow components as
[standalone tools](/docs/started/introduction/#what-are-standalone-kubeflow-components) and
integrate them into your existing AI/ML Platform, or you can deploy the full
[Kubeflow Platform](/docs/started/introduction/#what-is-kubeflow-platform) to get all Kubeflow
components for an end-to-end ML lifecycle.

## Kubeflow Interfaces

This section introduces the interfaces that you can use to interact with
Kubeflow and to build and run your ML workflows on Kubeflow.

### Kubeflow User Interface (UI)

The Kubeflow Central Dashboard looks like this:

<img src="/docs/images/dashboard/homepage.png" 
     alt="Kubeflow Central Dashboard - Homepage" 
     class="mt-3 mb-3 border border-info rounded">
</img>

The Kubeflow Platform includes [Kubeflow Central Dashboard](/docs/components/central-dash/overview/)
which acts as a hub for your ML platform and tools by exposing the UIs of components running in the
cluster.

### Kubeflow APIs and SDKs

<!--
TODO (andreyvelich): Add reference docs once this issue is implemented: https://github.com/kubeflow/katib/issues/2081
-->

Various components of Kubeflow offer APIs and Python SDKs.

See the following sets of reference documentation:

- [Pipelines reference docs](/docs/components/pipelines/reference/) for the Kubeflow
  Pipelines API and SDK, including the Kubeflow Pipelines domain-specific
  language (DSL).
- [Kubeflow Python SDK](https://github.com/kubeflow/sdk/blob/main/python/kubeflow/trainer/api/trainer_client.py)
  to interact with Kubeflow Trainer APIs and to manage TrainJobs.
- [Katib Python SDK](https://github.com/kubeflow/katib/blob/086093fed72610c227e3ae1b4044f27afa940852/sdk/python/v1beta1/kubeflow/katib/api/katib_client.py)
  to manage Katib hyperparameter tuning Experiments using Python APIs.

## Next steps

- Follow [Installing Kubeflow](/docs/started/installing-kubeflow/) to set up your environment and install Kubeflow.
