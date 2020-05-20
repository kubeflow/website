+++
title = "Using the Kubeflow Pipelines Benchmark Scripts"
description = "How to use the Kubeflow Pipelines Benchmark Scripts"
weight = 10
+++

This guide explains the Kubeflow Pipelines [benchmark scripts](https://github.com/kubeflow/pipelines/tree/master/tools/benchmarks)
and demonstrates how to use them to collect basic performance data of a given
Kubeflow Pipelines deployemnt.

## Overview

The Kubeflow Pipelines benchmark scripts simulate typical workloads, apply them
to the Kubeflow Pipelines API server, and record the server latencies and
pipeline run durations under the workloads.

Among all the operations that the Kubeflow Pipelines API server can perform,
running a pipeline is arguably the most unpredictable and costly one. Other
operations, e.g., creating a pipeline (version) or creating an experiment, have
relatively predicatable and low costs. Creating a pipeline version will introduce
a new row in the pipeline versions table, a new file in minio server. The new
file's size depends on the pipeline version's manifest. If we exclude those
insanely large manifests and assume an average sized manifest, the total cost of
creating a pipeline version grows linearly with the number of pipeline versions.

However, on the other hand, the cost of running a pipeline or pipeline version
involves much more uncertainty and sometimes quite high a cost. A pipeline or a
pipeline version can have arbitrary complexities. E.g., the step in a pipeline
can use a customized container imange which performs some expensive training
task. Other that, the runs in Kubeflow Pipelines also consume more DB space than
pipelines, pipeline versions, experiments etc.

Therefore, when the performance and scalibility of Kubeflow Pipelines are in
question, the simulated benchmark workloads that focuses on the operation of
running a pipeline is usually more revealing. In the Kubeflow Pipelines benchmark
scripts, the pipelines in the workloads can be customized. Preloaded samples in
Kubeflow pipelines can be used. Moreover, it is also a good practice to use a
representative pipeline in light of the targeted Kubeflow Pipelines use case. E.g.,
if a Kubeflow Piplines user uses Kubeflow Pipelines mainly for pipelines that peform
image recognition, then it would be better that the user chooses an image recognition
pipeline in the benchmark scripts.

When a proper pipeline is chosen, the benchmark scripts can be run on any given
Kubeflow Pipelines deployment, and collects the server latencies and run durations.
It has to be noted that the collected performance data on Kubeflow Pipelines'
implementation, the benchmark pipeline that is used in the script and the Cloud
resource Kubeflow Pipelines deployment has access to.


tune pipeline, # of runs, cloud resource

## Before you start

To use the provided benchmark scripts, you will need a Jupyter notebook instance
and that instance should have access to the Kubeflow Pipelines API server.

set up the node: The performance of the Kubeflow Pipelines API server is affected by many
different factors. Among them, the two major factors are the workload and the

## Tuning and Running of Workloads
if you see errors, feel free to report it back some faqs here as well.

## Interpretation of Results

## Limitations

## Alternative Approaches

