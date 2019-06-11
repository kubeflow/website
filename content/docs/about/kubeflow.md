+++
title = "Kubeflow"
description = "Quickly get running with your ML Workflow"
weight = 1
aliases = ["/docs/", "/docs/about/", "/docs/kubeflow/"]
+++

The Kubeflow project is dedicated to making deployments of machine learning (ML) 
workflows on Kubernetes simple, portable and scalable. Our goal is not to 
recreate other services, but to provide a straightforward way to deploy 
best-of-breed open-source systems for ML to diverse infrastructures. Anywhere 
you are running Kubernetes, you should be able to run Kubeflow.

## Getting started with Kubeflow

Follow the [getting-started guide](/docs/started/getting-started) to set up your
environment.

Then read the [documentation](/docs/) to learn about the features of Kubeflow, 
including the following guides to Kubeflow components:

* Kubeflow includes services for spawning and managing 
  [Jupyter notebooks](/docs/notebooks/). [Project Jupyter](https://jupyter.org/) 
  is a non-profit, open source project that supports interactive data science 
  and scientific computing across many programming languages.

* [Kubeflow Pipelines](/docs/pipelines/pipelines-overview/) is a platform for 
  building, deploying, and managing multi-step ML workflows based on Docker 
  containers.

* Kubeflow offers a number of [components](/docs/components/) that you can use
  to build your ML training, hyperparameter tuning, and serving workloads across
  multiple platforms.

## What is Kubeflow?

Kubeflow is *the machine learning toolkit for Kubernetes*.

To use Kubeflow, the basic workflow is:

* Download and run the Kubeflow deployment binary.
* Customize the resulting configuration files.
* Run the specified scripts to deploy your containers to your specific
  environment.

You can adapt the configuration to choose the platforms and services that you 
want to use for each stage of the ML workflow: data preparation, model training,
prediction serving, and service management.

You can choose to deploy your Kubernetes workloads locally or to a cloud 
environment.

## The Kubeflow mission

Our goal is to make scaling machine learning (ML) models and deploying them to
production as simple as possible, by letting Kubernetes do what it's great at:

  * Easy, repeatable, portable deployments on a diverse infrastructure:
     Kubernetes cluster on laptop, training cluster, production cluster
  * Deploying and managing loosely-coupled microservices
  * Scaling based on demand

Because ML practitioners use a diverse set of tools, one of the key goals is to
customize the stack based on user requirements (within reason) and let the
system take care of the "boring stuff". While we have started with a narrow set
of technologies, we are working with many different projects to include 
additional tooling.

Ultimately, we want to have a set of simple manifests that give you an easy to 
use ML stack _anywhere_ Kubernetes is already running, and that can self 
configure based on the cluster it deploys into.

## History

Kubeflow started as an open sourcing of the way Google ran [TensorFlow](https://www.tensorflow.org/) internally, based on a pipeline called [TensorFlow Extended](https://www.tensorflow.org/tfx/). It began as just a simpler way to run TensorFlow jobs on Kubernetes, but has since expanded to be a multi-architecture, multi-cloud framework for running entire machine learning pipelines.

## Getting involved

There are many ways to contribute to Kubeflow, and we welcome contributions! 
Read the [contributor's guide](/docs/about/contributing) to get started on the 
code, and get to know the community in the 
[community guide](/docs/about/community).
