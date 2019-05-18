+++
title = "Overview of Kubeflow Fairing"
description = "Build, train, and deploy your ML training jobs remotely"
weight = 5
+++

Kubeflow Fairing streamlines the process of building, training, and deploying
machine learning (ML) training jobs in a hybrid cloud environment. By using
Kubeflow Fairing and adding a few lines of code, you can run your ML training
job locally or in the cloud, directly from Python code or a Jupyter
notebook. After your training job is complete, you can use Kubeflow Fairing to
deploy your trained model as a prediction endpoint.

## Quickstart

Follow a quickstart guide to learn how to get started running training jobs
remotely with Kubeflow Fairing:

*  Learn how to [train and deploy a model on Google Cloud Platform (GCP) from
   a local notebook][gcp-local].
*  Learn how to [train and deploy a model on GCP from a notebook hosted on
   Kubeflow][gcp-kubeflow].
*  Learn how to [train and deploy a model on GCP from a notebook hosted on
   Google AI Platform Notebooks][gcp-ai-platform].

## What is Kubeflow Fairing?

Kubeflow Fairing is a Python package that makes it easy to train and deploy ML
models on [Kubeflow][kubeflow] or [Google AI Platform][ai-platform]. 

Kubeflow Fairing packages your Jupyter notebook, Python function, or Python
file as a Docker image, then deploys and runs the training job on Kubeflow
or AI Platform. After your training job is complete, you can use Kubeflow
Fairing to deploy your trained model as a prediction endpoint on Kubeflow. 

The following are the goals of the [Kubeflow Fairing project][fairing-repo]:

*  Easily package ML training jobs: Enable ML practitioners to easily package
   their ML model training code, and their code's dependencies, as a Docker
   image. 
*  Easily train ML models in a hybrid cloud environment: Provide a high-level
   API for training ML models to make it easy to run training jobs in the
   cloud, without needing to understand the underlying infrastructure.
*  Streamline the process of deploying a trained model: Make it easy for ML
   practitioners to deploy trained ML models to a hybrid cloud environment. 

## Next steps

*  Learn how to [set up a Jupyter notebooks instance on your Kubeflow
   cluster][kubeflow-notebooks].

[gcp-local]: /docs/fairing/gcp-local-notebook/
[gcp-kubeflow]: /docs/fairing/gcp-kubeflow-notebook/
[gcp-ai-platform]: /docs/fairing/gcp-ai-platform-notebook/
[kubeflow-notebooks]: /docs/notebooks/setup/
[ai-platform]: https://cloud.google.com/ml-engine/docs/
[fairing-repo]: https://github.com/kubeflow/fairing
[kubeflow]: /docs/about/kubeflow/