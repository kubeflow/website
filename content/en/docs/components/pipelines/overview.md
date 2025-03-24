+++
title = "Overview"
description = "What is Kubeflow Pipelines?"
weight = 1
+++

{{% kfp-v2-keywords %}}

Kubeflow Pipelines (KFP) is a platform for building and deploying portable and scalable machine learning (ML) workflows using containers on Kubernetes-based systems.

With KFP you can author [components][components] and [pipelines][pipelines] using the [KFP Python SDK][pypi], compile pipelines to an [intermediate representation YAML][ir-yaml], and submit the pipeline to run on a KFP-conformant backend such as the [open source KFP backend][installation] or [Google Cloud Vertex AI Pipelines](https://cloud.google.com/vertex-ai/docs/pipelines/introduction).

The open source KFP backend is available as a core component of Kubeflow or as a standalone installation. To use KFP as part of the Kubeflow platform, follow the instructions for [installing Kubeflow][installing Kubeflow]. To use KFP as a standalone application, follow the [standalone installation][installation] instructions. To get started with your first pipeline, follow the [Getting Started][getting-started] instructions.

## Why Kubeflow Pipelines?

KFP enables data scientists and machine learning engineers to:

* Author end-to-end ML workflows natively in Python
* Create fully custom ML components or leverage an ecosystem of existing components
* Easily pass parameters and ML artifacts between pipeline components
* Easily manage, track, and visualize pipeline definitions, runs, experiments, and ML artifacts
* Efficiently use compute resources through parallel task execution and through caching to eliminating redundant executions
* Keep experimentation and iteration light and Python-centric, minimizing the need to (re)build and maintain containers
* Maintain cross-platform pipeline portability through a platform-neutral [IR YAML pipeline definition][ir-yaml]

## What is a pipeline?

A [pipeline][pipelines] is a definition of a workflow that composes one or more [components][components] together to form a computational directed acyclic graph (DAG). At runtime, each component execution corresponds to a single container execution, which may create ML artifacts. Pipelines may also feature [control flow][control-flow].

## Next steps

* [Install Kubeflow Pipelines][installation]
* [Hello World Pipeline][hello-world-pipeline]
* Learn more about [authoring components][components]
* Learn more about [authoring pipelines][pipelines]

[installing Kubeflow]: /docs/started/installing-kubeflow
[components]: /docs/components/pipelines/user-guides/components
[pipelines]: /docs/components/pipelines/user-guides
[installation]: /docs/components/pipelines/operator-guides/installation
[ir-yaml]: /docs/components/pipelines/user-guides/core-functions/compile-a-pipeline#ir-yaml
[pypi]: https://pypi.org/project/kfp/
[getting-started]: /docs/components/pipelines/getting-started
[control-flow]: /docs/components/pipelines/user-guides/core-functions/control-flow
