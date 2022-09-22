+++
title = "Introduction"
description = "What is Kubeflow Pipelines?"
weight = 1
                    
+++

{{% stable-status %}}

Kubeflow Pipelines (KFP) is a platform for building and deploying portable and
scalable machine learning (ML) workflows by using Docker containers.

KFP is available as a core component of Kubeflow or as a standalone installation. To quickly get started with a KFP deployment and usage example, see the [Quickstart][quickstart] guide.

<!-- REVIEWER COMMENT (REMOVE BEFORE PUBLISHING): Best to comment these out until the topic is available -->
<!-- [Learn more about installing Kubeflow][Installation]
[Learn more about installing Kubeflow Pipelines standalone][Installation] -->

## Objectives

The primary objectives of Kubeflow Pipelines are to enable the following:
* End-to-end orchestration of ML workflows
* Pipeline composability through reusable components and pipelines
* Easy management, tracking, and visualization of pipeline definitions, pipeline runs, experiments, and ML artifacts
* Efficient use of compute resources by eliminating redundant executions through [caching][caching]
* Cross-platform pipeline portability through a platform-neutral [IR YAML pipeline definition][ir-yaml]

## What is a pipeline?

A [_pipeline_][pipelines] is the description of a workflow with one or more steps, also known as [_tasks_][tasks]. A task is defined by a single container execution. Each task in a pipeline consists of input and output parameters. By specifying the output of one task as the input of another task, a pipeline author can form a computed acyclic graph (DAG) of tasks.

Pipelines are written in Python to provide an easy authoring experience, compiled to YAML for portability, and executed on Kubernetes for scalability.


## What does using KFP look like?

At a high level, using KFP consists of the following steps:

1. [Author a pipeline][author-a-pipeline] with one or more components using the **Python KFP SDK**'s domain-specific language (DSL). You can [author your own components][components] or use prebuilt components provided by other authors.
2. [Compile the pipeline][compile-a-pipeline] into a static configuration (YAML) by using the **KFP SDK's DSL compiler**.
3. Submit the pipeline to run on the **KFP backend**. The **KFP backend** orchestrates the Kubernetes Pod creation and data passes, which are required to execute your workflow.
4. View your runs, experiments, and ML artifacts on the **KFP Dashboard**.


## Next steps

* Follow the 
  [pipelines quickstart guide][Quickstart] guide to 
  deploy Kubeflow Pipelines and run your first pipeline
* Learn more about the [different ways to install KFP][installation]
* Learn more about [authoring pipelines][author-a-pipeline]

[quickstart]: /docs/components/pipelines/v2/quickstart
[author-a-pipeline]: /docs/components/pipelines/v2/author-a-pipeline
[components]: /docs/components/pipelines/v2/author-a-pipeline/components
[pipelines]: /docs/components/pipelines/v2/author-a-pipeline/pipelines
[tasks]: /docs/components/pipelines/v2/author-a-pipeline/tasks
[compile-a-pipeline]: /docs/components/pipelines/v2/compile-a-pipeline
[installation]: /docs/components/pipelines/v2/installation
[caching]: /docs/components/pipelines/v2/author-a-pipeline/tasks/#caching
[ir-yaml]: /docs/components/pipelines/v2/compile-a-pipeline/#ir-yaml