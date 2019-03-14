+++
title = "Concepts in Kubeflow Pipelines"
description = "Glossary of terms relevant to Kubeflow Pipelines"
weight = 2
+++

This page describes the most important concepts used within the Kubeflow 
Pipelines platform.

## Pipeline

A description of a machine learning (ML) workflow, including all of the 
components in the workflow and how the components relate to each other in the 
form of a [graph](#graph). The pipeline configuration includes the definition of 
the inputs (parameters) required to run the pipeline and the inputs and outputs 
of each component.

A pipeline is the main shareable artifact in the Kubeflow Pipelines platform. 
After developing your pipeline, you can upload and share it on the 
Kubeflow Pipelines UI. Get started with the 
[quickstart guide](/docs/pipelines/pipelines-quickstart/).

<a id="graph"></a>
## Graph

A pictorial representation in the Kubeflow Pipelines UI of the runtime execution
of a pipeline. The graph shows the steps that a pipeline run has executed or is 
executing, with arrows indicating the 
parent/child  relationships between the pipeline components represented by each
step. The graph is viewable as soon as the run begins. Each node within the 
graph corresponds to a step within the pipeline and is labeled accordingly.

The screenshot below shows an example of a pipeline graph:

<img src="/docs/images/pipelines-xgboost-graph.png" 
  alt="XGBoost results on the pipelines UI"
  class="mt-3 mb-3 border border-info rounded">

At the top right of each node is an icon indicating its status: running,
succeeded, failed, or skipped. (A node can be skipped when its 
parent contains a conditional clause.)

## Pipeline component

A self-contained set of code that performs one step in the pipeline, such as 
data preprocessing, data transformation, model training, and so on. You must 
package your component as a 
[Docker image](https://docs.docker.com/get-started/). See the guide to
[building your own components](/docs/pipelines/build-component).

## Experiment

A workspace where you can try different configurations of your pipelines. You 
can use experiments to organize your runs into logical groups. Experiments can 
contain arbitrary runs, including [recurring runs](#recurring-run).

## Run

A single execution of a pipeline. Runs comprise an immutable log of all
experiments that you attempt, and are designed to be self-contained to allow for
reproducibility. You can track the progress of a run by looking at its details 
page on the Kubeflow Pipelines UI, where you can see the runtime graph, output 
artifacts, and logs for each step in the run.

<a id="recurring-run"></a>
## Recurring run

A repeatable run of a pipeline. The configuration for a recurring run includes a 
copy of a pipeline with all parameter values specified and a 
[run trigger](#run-trigger). You can start a recurring run inside any 
experiment, and it will periodically start a new copy of the run configuration. 
You can enable/disable the recurring run from the Kubeflow Pipelines UI.
You can also specify the maximum number of concurrent runs, to limit the 
number of runs launched in parallel. This can be helpful if the pipeline is 
expected to run for a long period of time and is triggered to run frequently.

<a id="run-trigger"></a>
## Run trigger

A flag that tells the system when a recurring run configuration spawns a new 
run. The following types of run trigger are available:

* Periodic: for an interval-based scheduling of runs (for example: every 2 hours 
  or every 45 minutes).
* Cron: for specifying `cron` semantics for scheduling runs.

## Step

An execution of one of the components in the pipeline. The relationship between 
a step and its component is one of instantiation, much like the relationship 
between a run and its pipeline. In a complex pipeline, components can execute 
multiple times in loops, or conditionally after resolving an if/else like clause 
in the pipeline code.

## Step output artifact

Outputs emitted by the pipeline's steps, which the Kubeflow 
Pipelines UI understands and can render as rich visualizations. It’s useful for 
pipeline components to include artifacts so that you can provide for performance 
evaluation, quick decision making for the run, or comparison across different 
runs. Artifacts also make it possible to understand how the pipeline’s various 
components work. An artifact can range from a plain textual view of the data to 
rich interactive visualizations.

Read more about the available [output viewers](/docs/pipelines/output-viewer) 
and how to provide the metadata to make use of the visualizations
that the output viewers provide.

## Back end

A REST API server supports the front end. For user data stored in external 
services (for example, Google Cloud Storage), the front end makes requests 
directly to those services using their client libraries.
