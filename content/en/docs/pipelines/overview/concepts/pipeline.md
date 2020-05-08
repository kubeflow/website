+++
title = "Pipeline"
description = "Conceptual overview of pipelines in Kubeflow Pipelines"
weight = 10
+++

A *pipeline* is a description of a machine learning (ML) workflow, including all
of the [components](/docs/pipelines/overview/concepts/component/) in the workflow and how the components relate to each other in
the form of a [graph](/docs/pipelines/concepts/graph/). The pipeline
configuration includes the definition of the inputs (parameters) required to run
the pipeline and the inputs and outputs of each component.

When you run a pipeline, the system launches one or more Kubernetes Pods
corresponding to the [steps](/docs/pipelines/overview/concepts/step/) (components) in your workflow (pipeline). The Pods
start Docker containers, and the containers in turn start your programs.

After developing your pipeline, you can upload your pipeline using the Kubeflow Pipelines UI or the Kubeflow Pipelines SDK.

## Next steps

* Read an [overview of Kubeflow Pipelines](/docs/pipelines/pipelines-overview/).
* Follow the [pipelines quickstart guide](/docs/pipelines/pipelines-quickstart/) 
  to deploy Kubeflow and run a sample pipeline directly from the Kubeflow 
  Pipelines UI.
