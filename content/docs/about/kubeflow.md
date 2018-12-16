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

## The Kubeflow mission

Our goal is to make scaling machine learning (ML) models and deploying them to
production as simple as possible, by letting Kubernetes do what it's great at:

  * Easy, repeatable, portable deployments on a diverse infrastructure (laptop
    <-> ML rig <-> training cluster <-> production cluster)
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

## What is Kubeflow?

Kubeflow is *the machine learning toolkit for Kubernetes*.

To use Kubeflow, the basic workflow is:

* Download the Kubeflow scripts and configuration files.
* Customize the configuration.
* Run the scripts to deploy your containers to your chosen environment.

You adapt the configuration to choose the platforms and services that you want
to use for each stage of the ML workflow: data preparation, model training,
prediction serving, and service management.

You can choose to deploy your workloads locally or to a cloud environment.

## History

Kubeflow started as an open sourcing of the way Google ran [TensorFlow](https://www.tensorflow.org/) internally, based on a pipeline called [TensorFlow Extended](https://www.tensorflow.org/tfx/). It began as just a simpler way to run TensorFlow jobs on Kubernetes, but has since expanded to be a multi-architecture, multi-cloud framework for running entire machine learning pipelines.

## Workflow 

The basic workflow is:

* Download the Kubeflow scripts and configuration files.
* Customize the configuration.
* Run the scripts to deploy your containers to your chosen environment.

You adapt the configuration to choose the platforms and services that you want
to use for each stage of the ML workflow: data preparation, model training, 
prediction serving, and service management.

You can choose to deploy your workloads locally or to a cloud environment.

## Notebooks

Included in Kubeflow is [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/) to create and manage multi-user interactive Jupyter notebooks. Project Jupyter is a non-profit, open-source project to support interactive data science and scientific computing across all programming languages.

## Using Kubeflow

Read the [getting-started guide](/docs/started/getting-started) to set up your
environment.

## Getting involved

There are many ways to contribute to Kubeflow, and we welcome contributions! 
Read the [contributor's guide](/docs/about/contributing) to get started on the 
code, and get to know the community in the 
[community guide](/docs/about/community).
