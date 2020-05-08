+++
title = "Step"
description = "Conceptual overview of steps in Kubeflow Pipelines"
weight = 70
+++

A *step* is an execution of one of the components in the pipeline. The
relationship between a step and its component is one of instantiation, much like
the relationship between a run and its pipeline. In a complex pipeline,
components can execute multiple times in loops, or conditionally after resolving
an if/else like clause in the pipeline code.

## Next steps

* Read an [overview of Kubeflow Pipelines](/docs/pipelines/pipelines-overview/).
* Follow the [pipelines quickstart guide](/docs/pipelines/pipelines-quickstart/) 
  to deploy Kubeflow and run a sample pipeline directly from the Kubeflow 
  Pipelines UI.