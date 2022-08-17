+++
title = "Introduction"
description = "What is Kubeflow Pipelines?"
weight = 1
                    
+++

{{% stable-status %}}

Kubeflow Pipelines (KFP) is a platform for building and deploying portable, 
scalable machine learning workflows using Docker containers.

To get started quickly with a KFP deployment and usage example, see the [Quickstart][quickstart] guide.

## Objectives
Kubeflow Pipelines' primary objectives are to enable:
* End-to-end orchestration of machine learning workflows
* Pipeline composability through [reusable components and pipelines][author-a-pipeline]
* Easy management, tracking, and visualization of pipeline definitions, pipeline runs, experiments, and machine learning artifacts
* Efficient use of compute resources by eliminating redundant executions through [caching][caching]
* Cross-platform pipeline portability through a platform-neutral [IR YAML pipeline definition][ir-yaml]

KFP is available as a core component of Kubeflow or as a standalone installation.

* [Learn more about installing Kubeflow][installation].
* [Learn more about installing Kubeflow Pipelines standalone][installation].

## What is a pipeline?

A [_pipeline_][pipelines] is a description of an multi-step workflow, where each step is defined by a single container execution. Each step, or [_task_][tasks], is parameterized by inputs and outputs, enabling pipeline authors to form a computational directed acyclic graph (DAG) of tasks by specifying the output of one task as the input to another.

Pipelines are written in Python to enable an easy authoring experience, compiled to YAML for portability, and executed on Kubernetes for scalability.


## What does using KFP look like?
At a high level, a typical KFP user experience is as follows:
1. [Author a pipeline][author-a-pipeline] using the **Python KFP SDK**'s domain-specific language (DSL)
2. [Compile the pipeline][compile-a-pipeline] to YAML using the **KFP SDK's DSL compiler**
3. Submit the pipeline to run on the **KFP backend**, which orchestrates the Kubernetes Pod creation and data passing required to execute your workflow
4. View your runs, experiments, and machine learning artifacts on the [**KFP Dashboard**][dashboard]


## Next steps

* Follow the 
  [pipelines quickstart guide](/docs/components/pipelines/quickstart) to 
  deploy Kubeflow Pipelines and run your first pipeline
* Learn more about [different ways to install KFP][installation]
* Learn more about [approaches to author pipelines][author-a-pipeline]

[quickstart]: /docs/components/pipelines/quickstart
[author-a-pipeline]: /docs/components/pipelines/author-a-pipeline
[pipelines]: /docs/components/pipelines/author-a-pipeline/pipelines
[tasks]: /docs/components/pipelines/author-a-pipeline/tasks
[compile-a-pipeline]: /docs/components/pipelines/compile-a-pipeline
[installation]: /docs/components/pipelines/installation
[dashboard]: /docs/components/pipelines/user-interface
<!-- TODO: add cross-section links -->
[caching]: /
[ir-yaml]: /