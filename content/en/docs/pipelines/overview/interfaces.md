+++
title = "Introduction to the Pipelines Interfaces"
description = "The ways you can interact with the Kubeflow Pipelines system"
weight = 20
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


This page introduces the interfaces that you can use to build and run
machine learning (ML) workflows with Kubeflow Pipelines.

## User interface (UI)

You can access the Kubeflow Pipelines UI by clicking **Pipeline Dashboard** on 
the Kubeflow UI. The Kubeflow Pipelines UI looks like this:
  <img src="/docs/images/pipelines-ui.png" 
    alt="Pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

From the Kubeflow Pipelines UI you can perform the following tasks:

* Run one or more of the preloaded samples to try out pipelines quickly.
* Upload a pipeline as a compressed file. The pipeline can be one that you
  have built (see how to [build a 
  pipeline](/docs/pipelines/sdk/build-component/#compile-the-pipeline)) or one 
  that someone has shared with you.
* Create an *experiment* to group one or more of your pipeline runs.
  See the [definition of an
  experiment](/docs/pipelines/overview/concepts/experiment/).
* Create and start a *run* within the experiment. A run is a single execution
  of a pipeline. See the [definition of a
  run](/docs/pipelines/overview/concepts/run/).
* Explore the configuration, graph, and output of your pipeline run.
* Compare the results of one or more runs within an experiment.
* Schedule runs by creating a recurring run.

See the [quickstart guide](/docs/pipelines/pipelines-quickstart/) for more
information about accessing the Kubeflow Pipelines UI and running the samples.

When building a pipeline component, you can write out information for display
in the UI. See the guides to [exporting 
metrics](/docs/pipelines/sdk/pipelines-metrics/) and [visualizing results in 
the UI](/docs/pipelines/sdk/output-viewer/).

## Python SDK

The Kubeflow Pipelines SDK provides a set of Python packages that you can use to 
specify and run your ML workflows.

See the [introduction to the Kubeflow Pipelines 
SDK](/docs/pipelines/sdk/sdk-overview/) for an overview of the ways you can
use the SDK to build pipeline components and pipelines.

## REST API

The Kubeflow Pipelines API is useful for continuous integration/deployment
systems, for example, where you want to incorporate your pipeline executions
into shell scripts or other systems. 
For example, you may want to trigger a pipeline run when new data comes in.

See the [Kubeflow Pipelines API reference 
documentation](/docs/pipelines/reference/api/kubeflow-pipeline-api-spec/).
