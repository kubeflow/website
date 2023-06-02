+++
title = "Pipeline"
description = "Conceptual overview of pipelines in Kubeflow Pipelines"
weight = 10
                    
+++

## Pipeline

A *pipeline* is a description of a machine learning (ML) workflow, including:

* the metadata of the pipeline, including its name and description 
* all of the [components](components) in the pipeline 
* the execution configurations of each of the component
* [tasks](task) and how they relate to each other in the form of a root [DAG (Directed Acyclic Graph)](dag)
* the definition of the inputs required to run the pipeline 

When you run a pipeline, the system launches one or more Kubernetes Pods
corresponding to the [tasks](task) (components) in your pipeline. The Pods
start Docker containers, and the containers in turn start your programs.

You can author a pipeline in Python using KFP SDK. The KFP SDK compiles it to a YAML file,
then you can upload it using KFP UI or KFP CLI. The KFP UI visualizes the pipeline as a [DAG](dag). 

After creating a pipeline in KFP, you can upload newer *versions* of the same pipeline. When creating a run, you can 
select from the list of pipeline versions under this pipeline.

## Next steps
* [Hello World Pipeline][hello-world-pipeline]
* Learn more about [components][components]
* Learn more about [authoring pipelines][pipelines]

[pipelines]: /docs/components/pipelines/v2/pipelines
[hello-world-pipeline]: /docs/components/pipelines/v2/hello-world
[task]: /docs/components/pipelines/v2/concepts/task/
[dag]: /docs/components/pipelines/v2/concepts/task#task-dependency-and-dag
[components]: /docs/components/pipelines/v2/concepts/component/
[parameters]: /docs/components/pipelines/v2/data-types/parameters/
[artifacts]: /docs/components/pipelines/v2/data-types/artifacts/
