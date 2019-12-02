+++
title = "Kubeflow Overview"
description = "How Kubeflow helps you organize your ML workflow"
weight = 10
+++

<!--
Note for authors: The source of the diagrams is held in Google Slides decks,
in the "Doc diagrams" folder in the public Kubeflow shared drive.
-->

This guide introduces Kubeflow as a platform for developing and deploying a
machine learning (ML) system.

## Architectural overview

Kubeflow is *the ML toolkit for Kubernetes*.
The following diagram shows Kubeflow as a platform for arranging the
components of your ML system on top of Kubernetes:

<img src="/docs/images/kubeflow-overview-platform-diagram.svg" 
  alt="A typical machine learning workflow"
  class="mt-3 mb-3 border border-info rounded">

## The ML workflow

Developing an ML system is an iterative process. You need to evaluate the
the output of your ML model continuously, and apply changes to the model and
parameters when necessary to ensure the model keeps producing the results you
need.

To keep the explanation as simple as possible, the following diagram
shows the workflow stages in sequence, with just one arrow at the end pointing
back into the flow, to indicate the iterative nature of the process:

<img src="/docs/images/kubeflow-overview-workflow-diagram-1.svg" 
  alt="A typical machine learning workflow"
  class="mt-3 mb-3 border border-info rounded">

When you develop and deploy an ML system, you typically need to build the
following stages into your workflow:

* In the experimental phase:

  * Identify the problem you want the ML system to solve.
  * Collect and analyse the data you need to train your ML model.
  * Choose an ML algorithm and code the initial version of your model.
  * Experiment with the data and with training your model.
  * Tune the model hyperparameters to ensure the most efficient processing and the
    most accurate results possible.

* In the production phase:

  * Transform the data into the format that your training process needs. The
    transformation process must be the same in the experimental and production
    phases, to ensure that the model bases its predictions on the same data 
    format as that used to train the model.
  * Train the ML model.
  * Serve the model for online prediction or for running in batch mode.
  * Monitor the model's performance, and feed the results into your processes
    for tuning or retraining the model.

The next diagram adds Kubeflow to the workflow, showing which Kubeflow
components are useful at each stage of the workflow:

<img src="/docs/images/kubeflow-overview-workflow-diagram-2.svg" 
  alt="A typical machine learning workflow"
  class="mt-3 mb-3 border border-info rounded">

TODO diagram in words.

## Kubeflow interfaces

<img src="/docs/images/central-ui.png" 
  alt="A typical machine learning workflow"
  class="mt-3 mb-3 border border-info rounded">

TODO: UI, CLI, APIs, SDKs

## Next steps

See how to [install Kubeflow](/docs/started/getting-started/) depending on
your chosen environment (local, cloud, or on-premises).
