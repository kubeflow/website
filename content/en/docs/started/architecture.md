+++
title = "Architecture"
description = "An overview of Kubeflow's architecture"
weight = 10
+++

This guide introduces Kubeflow projects and how they fit in each stage of the AI lifecycle.

Read [the introduction](/docs/started/introduction) to learn more about Kubeflow, Kubeflow
projects, and Kubeflow AI reference platform.

## Kubeflow Ecosystem

The following diagram gives an overview of the Kubeflow Ecosystem and how it relates to the wider
Kubernetes and AI landscape. Kubeflow builds on [Kubernetes](https://kubernetes.io/) as a system for
deploying, scaling, and managing AI platforms.

<img src="/docs/started/images/kubeflow-architecture.drawio.svg" 
     alt="Kubeflow Ecosystem Diagram"
     class="mt-3 mb-3 border rounded p-3 bg-white"
     style="width: 100%; max-width: 40em">
</img>

## Introducing the AI Lifecycle

When you develop and deploy an AI application, the AI lifecycle typically consists of
several stages. Developing an AI system is an iterative process.
You need to evaluate the output of various stages of the AI lifecycle, and apply
changes to the model and parameters when necessary to ensure the model keeps
producing the results you need.

The following diagram shows the AI lifecycle stages in sequence:

<img src="/docs/started/images/ai-lifecycle.drawio.svg" 
     alt="AI Lifecycle"
     class="mt-3 mb-3 border rounded p-3 bg-white">
</img>

Looking at the stages in more detail:

- In the _Data Preparation_ step you ingest raw data, perform feature engineering to extract ML
  features for the offline feature store, and prepare training data for model development.
  Usually, this step is associated with data processing tools such as Spark, Dask, Flink, or Ray.

- In the _Model Development_ step you choose an ML framework, develop your model architecture and
  explore the existing pre-trained models for fine-tuning like BERT or Llama.

- In the _Model Training_ step you train or fine-tune your models on the large-scale
  compute environment. You should use a distributed training if single GPU can't handle your
  model size. The results of the model training is the trained model artifact that you
  can store in the _Model Registry_.

- In the _Model Optimization_ step you optimize your model hyperparameters and optimize your
  model with various AutoML algorithms such as neural architecture search and model compression.
  During model optimization you can store ML metadata in the _Model Registry_.

- In the _Model Serving_ step you serve your model artifact for online or batch inference. Your
  model may perform predictive or generative AI tasks depending on the use-case. During the model
  serving step you may use an online feature store to extract features. You monitor the model
  performance, and feed the results into your previous steps in the AI lifecycle.

### AI Lifecycle for Production and Development Phases

The AI lifecycle for AI applications may be conceptually split between _development_ and
_production_ phases, this diagram explores which stages fit into each phase:

<img src="/docs/started/images/ai-lifecycle-dev-prod.drawio.svg" 
     alt="AI Lifecycle with Development and Production"
     class="mt-3 mb-3 rounded">
</img>

### Kubeflow Projects in the AI Lifecycle

The next diagram shows how Kubeflow projects fit for each stage of the AI lifecycle:

<img src="/docs/started/images/ai-lifecycle-kubeflow.drawio.svg" 
     alt="Kubeflow Projects in the AI Lifecycle"
     class="mt-3 mb-3 border rounded p-3 bg-white">
</img>

See the following links for more information about each Kubeflow project:

- [Kubeflow Spark Operator](/docs/components/spark-operator/) can be used for data
  preparation and feature engineering step.

- [Kubeflow Notebooks](/docs/components/notebooks/) can be used for model development and interactive
  data science to experiment with your AI workflows.

- [Kubeflow Trainer](/docs/components/trainer/) can be used for large-scale distributed
  training or LLMs fine-tuning.

- [Kubeflow Katib](/docs/components/katib/) can be used for model optimization and hyperparameter
  tuning using various AutoML algorithms.

- [Kubeflow Model Registry](/docs/components/model-registry/) can be used to store ML metadata,
  model artifacts, and preparing models for production serving.

- [KServe](https://kserve.github.io/website/master/) can be used for online and batch inference
  in the model serving step.

- [Feast](https://feast.dev/) can be used as a feature store and to manage offline and online
  features.

- [Kubeflow Pipelines](/docs/components/pipelines/) can be used to build, deploy, and manage each
  step in the AI lifecycle.

AI platform teams can build on top of Kubeflow by using each
[project independently](/docs/started/introduction/#what-are-kubeflow-projects) or deploying the
entire [AI reference platform](/docs/started/introduction/#what-is-the-kubeflow-ai-reference-platform)
to meet their specific needs.

## Kubeflow Interfaces

This section introduces the interfaces that you can use to interact with Kubeflow projects.

### Kubeflow Dashboard

The Kubeflow Central Dashboard looks like this:

<img src="/docs/images/dashboard/homepage.png" 
     alt="Kubeflow Central Dashboard - Homepage" 
     class="mt-3 mb-3 border rounded">
</img>

The Kubeflow AI reference platform includes [Kubeflow Central Dashboard](/docs/components/central-dash/overview/)
which acts as a hub for your AI platform and tools by exposing the UIs of components running in the
cluster.

### Kubeflow APIs and SDKs

<!--
TODO (andreyvelich): Add reference docs once this issue is implemented: https://github.com/kubeflow/katib/issues/2081
-->

Various Kubeflow projects offer APIs and Python SDKs.

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
