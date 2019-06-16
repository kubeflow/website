+++
title = "Overview of the Pipelines SDK"
description = "Introduction to building components and pipelines"
weight = 2
+++

The [Kubeflow Pipelines 
SDK](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.html)
provides a set of Python packages that you can use to specify and run your 
machine learning (ML) workflows. A *pipeline* is a description of an ML 
workflow, including all of the components in the workflow and how the components
interact with each other. (If you're new to Kubeflow Pipelines, see the
conceptual guides to [pipelines](/docs/pipelines/concepts/pipeline/)
and [components](/docs/pipelines/concepts/component/).)

The SDK includes the following packages: TODO SUMMARISE THE PACKAGES

* [`kfp.compiler`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html)
  includes xTODO SUMMARY. The main classes are as follows:

  * `kfp.compiler.Compiler` compiles your Python DSL code into a single static 
    configuration (in YAML format) that the Kubeflow Pipelines service can 
    process. The Kubeflow Pipelines service converts the static configuration 
    into a set of Kubernetes resources for execution.

  * TODO

## Installing the SDK

Follow the guide to 
[installing the Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## TODO

