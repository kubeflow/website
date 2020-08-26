+++
title = "Overview of Pipeline Development"
description = "Getting started with pipeline development"
weight = 10          
+++

Kubeflow Pipelines lets you deploy and run portable, scalable machine learning
(ML) workflows based on Docker containers. You can orchestrate your ML workflow
as a pipeline using the Kubeflow Pipelines SDK or TensorFlow Extended (TFX).

This document describes how to choose the best option for building your
pipeline, and provides resources for getting started.

## Selecting a pipelines SDK

At a high level, the Kubeflow Pipelines SDK and TFX take a similar approach
to defining pipelines. In both cases:

*  A pipeline is a set of components and input parameters. 
*  Component outputs are called artifacts. Components can accept either
   pipeline parameters or the artifacts of other components as inputs.
*  The execution order of pipeline components is a directed acyclic graph of
   the pipeline's component artifact dependencies and any task-based
   dependencies that were defined between components.
*  The custom logic in a component is defined in a Python function or in a
   container image.

Use the Kubeflow Pipelines SDK, if:

*  You rely on recursion, loops, graph components (pipelines that are executed
   as a component of another pipeline), and conditional logic in the definition
   of your pipeline's graph. 
*  Your pipeline needs to manipulate Kubernetes resources, or you need to
   specify resource dependencies at a component level. For example, your
   training component may require GPUs and more memory than other steps in
   your pipeline.
*  Your model or pipeline is not a good match for TFX pipelines.

[Learn more about getting started with the Kubeflow Pipelines SDK](#building-pipelines-with-the-kubeflow-pipelines-sdk). 

Use TFX, if you are orchestrating a process that trains a TensorFlow model.
By using TFX, you can gain the following benefits:

   *  TFX standard components implement a proven ML workflow. By using these
      components, you can focus on implementing your model within a proven
      process.
   *  TFX templates let you start from an example workflow and then customize
      the process to meet your needs.

[Learn more about getting started with TFX](#building-tfx-pipelines). 

## Building pipelines with the Kubeflow Pipelines SDK

The Kubeflow Pipelines SDK provides a set of Python packages that you can use
to build portable and scalable ML pipelines. You can define your pipeline using
pre-built components or custom pipeline components.

To get started building pipelines with the Kubeflow Pipelines SDK:

*  [Read the Introduction to the Kubeflow Pipelines SDK](/docs/pipelines/building-pipelines/pipelines-sdk/sdk-overview).
*  Learn more about [building components and pipelines](/docs/pipelines/building-pipelines/pipelines-sdk/build-component).
*  Learn more about Kubeflow pipelines by [exploring the Kubeflow Pipelines
   samples](/docs/pipelines/tutorials/build-pipeline/).
*  [Reuse pre-built components by exploring the Kubeflow pipeline components
   on GitHub](https://github.com/kubeflow/pipelines/tree/master/components).

## Building TFX pipelines

Use the following resources to get started with TFX pipelines:

*  [Follow a TFX pipelines tutorial](https://www.tensorflow.org/tfx/tutorials).
*  Learn more about the [concepts required to understand TFX
   pipelines](https://www.tensorflow.org/tfx/guide/understanding_tfx_pipelines).
*  Learn how to [build a TFX pipeline](https://www.tensorflow.org/tfx/guide/build_tfx_pipeline).
*  Learn more about [TFX standard components](https://www.tensorflow.org/tfx/guide#tfx_standard_components)
   and [TFX custom components](https://www.tensorflow.org/tfx/guide/understanding_custom_components). 

## Next steps

*  Read the overview of Kubeflow Pipelines to [understand the goals and main
   concepts of Kubeflow Pipelines](/docs/pipelines/concepts/).