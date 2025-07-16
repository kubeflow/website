+++
title = "Introduction"
description = "An introduction to Kubeflow"
weight = 1
+++

## What is Kubeflow

[Kubeflow](https://www.kubeflow.org/) is the foundation of tools for AI Platforms on Kubernetes.

AI platform teams can build on top of Kubeflow by using each project independently or deploying the
entire AI reference platform to meet their specific needs. The Kubeflow AI reference platform is
composable, modular, portable, and scalable, backed by an ecosystem of Kubernetes-native
projects that cover every stage of the [AI lifecycle](https://www.kubeflow.org/docs/started/architecture/#kubeflow-projects-in-the-ai-lifecycle).

Whether you’re an AI practitioner, a platform administrator, or a team of developers, Kubeflow
offers modular, scalable, and extensible tools to support your AI use cases.

## What are Kubeflow Projects

Kubeflow is composed of multiple open source projects that address different aspects
of the AI lifecycle. These projects are designed to be usable both independently and as part of the
Kubeflow AI reference platform. This provides flexibility for users who may not need the full
end-to-end AI platform capabilities but want to leverage specific functionalities, such as model
training or model serving.

| Kubeflow Project                                                                    | Source Code                                                             |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [KServe](https://www.kubeflow.org/docs/external-add-ons/kserve/)                    | [`kserve/kserve`](https://github.com/kserve/kserve)                     |
| [Kubeflow Katib](https://www.kubeflow.org/docs/components/katib/)                   | [`kubeflow/katib`](https://github.com/kubeflow/katib)                   |
| [Kubeflow Model Registry](https://www.kubeflow.org/docs/components/model-registry/) | [`kubeflow/model-registry`](https://github.com/kubeflow/model-registry) |
| [Kubeflow Notebooks](https://www.kubeflow.org/docs/components/notebooks/)           | [`kubeflow/notebooks`](https://github.com/kubeflow/notebooks)           |
| [Kubeflow Pipelines](https://www.kubeflow.org/docs/components/pipelines/)           | [`kubeflow/pipelines`](https://github.com/kubeflow/pipelines)           |
| [Kubeflow Spark Operator](https://www.kubeflow.org/docs/components/spark-operator/) | [`kubeflow/spark-operator`](https://github.com/kubeflow/spark-operator) |
| [Kubeflow Trainer](https://www.kubeflow.org/docs/components/trainer/)               | [`kubeflow/trainer`](https://github.com/kubeflow/trainer)               |

## What is the Kubeflow AI Reference Platform

The Kubeflow AI reference platform refers to the full suite of Kubeflow projects bundled together
with additional integration and management tools. Kubeflow AI reference platform deploys the
comprehensive toolkit for the entire AI lifecycle. The Kubeflow AI reference platform can be
installed via [Packaged Distributions](https://www.kubeflow.org/docs/started/installing-kubeflow/#packaged-distributions)
or [Kubeflow Manifests](https://www.kubeflow.org/docs/started/installing-kubeflow/#kubeflow-manifests).

| Kubeflow AI Reference Platform Tool                                                                 | Source Code                                                   |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Central Dashboard](https://www.kubeflow.org/docs/components/central-dash/)                         | [`kubeflow/dashboard`](https://github.com/kubeflow/dashboard) |
| [Profile Controller](https://www.kubeflow.org/docs/components/central-dash/profiles/)               | [`kubeflow/dashboard`](https://github.com/kubeflow/dashboard) |
| [Kubeflow Manifests](https://www.kubeflow.org/docs/started/installing-kubeflow/#kubeflow-manifests) | [`kubeflow/manifests`](https://github.com/kubeflow/manifests) |

## Kubeflow Overview Diagram

The following diagram shows the Kubeflow projects to cover each stage of the AI lifecycle
on top of Kubernetes. Read the [architecture overview](/docs/started/architecture/) to
learn how Kubeflow projects fit in AI lifecycle.

<img src="/docs/started/images/kubeflow-overview.drawio.svg" 
     alt="Kubeflow Overview Diagram"
     class="mt-3 mb-3 border rounded p-3 bg-white">
</img>

## Kubeflow Video Introduction

Watch the following video which provides an introduction to Kubeflow.

{{< youtube id="cTZArDgbIWw" title="Introduction to Kubeflow">}}

## The Kubeflow Mission

Our goal is to make scaling AI models and deploying them to
production as simple as possible, by letting Kubernetes do what it's great at:

- Easy, repeatable, portable deployments on a diverse infrastructure
  (for example, experimenting on a laptop, then moving to an on-premises
  cluster or to the cloud).
- Deploying and managing loosely-coupled microservices.
- Scaling based on demand.

Because AI practitioners use a diverse set of tools, one of the key goals is to
customize the stack based on user requirements (within reason) and let the
system take care of the "boring stuff". While we have started with a narrow set
of technologies, we are working with many different projects to include
additional tooling.

Ultimately, we want to have a set of simple manifests that give you an easy to
use AI stack _anywhere_ Kubernetes is already running, and that can self
configure based on the cluster it deploys into.

## History

Kubeflow started as an open sourcing of the way Google ran [TensorFlow](https://www.tensorflow.org/)
internally, based on a pipeline called [TensorFlow Extended](https://www.tensorflow.org/tfx/).
It began as just a simpler way to run TensorFlow jobs on Kubernetes, but has since expanded to be
a foundation of tools for running AI workloads on Kubernetes.

The [Kubeflow logo represents](https://github.com/kubeflow/kubeflow/issues/187#issuecomment-375194419) the letters `K` and `F` inside the heptagon of the Kubernetes logo, which represent two communities: `Kubernetes` (cloud-native) and `flow` (Machine Learning). In this context, `flow` is not only indicating `TensorFlow`, but also all ML frameworks which make use of Dataflow Graph as the normal form for model/algorithm implementation.

## Roadmaps

Kubeflow projects have individual roadmaps which established by project maintainers:

- [KServe roadmap](https://github.com/kserve/kserve/blob/master/ROADMAP.md)
- [Kubeflow Pipelines roadmap](https://github.com/kubeflow/pipelines/blob/master/ROADMAP.md)
- [Kubeflow Katib roadmap](https://github.com/kubeflow/katib/blob/master/ROADMAP.md)
- [Kubeflow Model Registry roadmap](https://github.com/kubeflow/model-registry/blob/main/ROADMAP.md)
- [Kubeflow Spark Operator roadmap](https://github.com/kubeflow/spark-operator/blob/master/ROADMAP.md)
- [Kubeflow Trainer roadmap](https://github.com/kubeflow/trainer/blob/master/ROADMAP.md)

To see what's coming up in future versions of Kubeflow AI reference platform, refer to the
[Kubeflow AI reference platform](https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md).

## Getting involved

There are many ways to contribute to Kubeflow, and we welcome contributions!

Read the [contributor's guide](/docs/about/contributing/) to get started on the code, and learn about
the community on the [community page](/docs/about/community/).

## Next Steps

- Follow [the installation guide](/docs/started/installing-kubeflow) to deploy Kubeflow projects or
  Kubeflow AI reference platform.
