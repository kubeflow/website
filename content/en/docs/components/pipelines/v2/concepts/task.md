+++
title = "Task and DAG"
description = "Conceptual overview of task and DAG in Kubeflow Pipelines"
weight = 70
                    
+++

## Task

A *task* is an execution of one of the components in the pipeline. 
The relationship between a task and its component is one of instantiation, much like
the relationship between a run and its pipeline. In a complex pipeline,
components can execute multiple times in loops, or conditionally after resolving
an if/else like clause in the pipeline code.

## Task dependency and DAG

A task can depend on other tasks in two ways:

* it uses the output of the upstream tasks
* it depends on the final condition of the upstream tasks

The pipeline uses a *DAG(Directed Acyclic Graph)* to represent the tasks and their dependency. 
A DAG is a [directed graph with no directed cycles](dag), indicating circular dependecy 
between tasks is not allowed.

In the KFP UI, the tasks are represented by boxes, with arrows representing their 
dependency. Click on a task, you can see its detailed information.

<img src="/docs/images/pipeline-dag.png" 
  alt="XGBoost results on the pipelines UI"
  class="mt-3 mb-3 border border-info rounded">

The component of a task can also be a DAG, so you can have nested dags. You can view the different layers of dags from the UI.


## Next steps

* [Hello World Pipeline][hello-world-pipeline]
* Learn more about [authoring components][components]
* Learn more about [authoring pipelines][pipelines]

[components]: /docs/components/pipelines/v2/components
[pipelines]: /docs/components/pipelines/v2/pipelines
[hello-world-pipeline]: /docs/components/pipelines/v2/hello-world
[dag]: https://en.wikipedia.org/wiki/Directed_acyclic_graph