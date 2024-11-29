+++
title = "Introduction"
description = "An introduction to Kubeflow"
weight = 1
+++

## What is Kubeflow

Kubeflow is a community and ecosystem of open-source projects to address each stage in the
[machine learning (ML) lifecycle](/docs/started/architecture/#kubeflow-components-in-the-ml-lifecycle)
with support for best-in-class open source
[tools and frameworks](/docs/started/architecture/#kubeflow-ecosystem). Kubeflow makes AI/ML
on Kubernetes simple, portable, and scalable.

Whether you’re a researcher, data scientist, ML engineer, or a team of developers, Kubeflow offers
modular and scalable tools that cater to all aspects of the ML lifecycle: from building ML models to
deploying them to production for AI applications.

## What are Standalone Kubeflow Components

The Kubeflow ecosystem is composed of multiple open-source projects that address different aspects
of the ML lifecycle. Many of these projects are designed to be usable both within the
Kubeflow Platform and independently. These Kubeflow components can be installed standalone on a
Kubernetes cluster. It provides flexibility to users who may not require the full Kubeflow Platform
capabilities but wish to leverage specific ML functionalities such as model training or model serving.

## What is Kubeflow Platform

The Kubeflow Platform refers to the full suite of Kubeflow components bundled together with
additional integration and management tools. Using Kubeflow as a platform means deploying a
comprehensive ML toolkit for the entire ML lifecycle.

In addition to the standalone Kubeflow components, the Kubeflow Platform includes

- [Kubeflow Notebooks](/docs/components/notebooks/overview) for interactive data exploration and
  model development.
- [Central Dashboard](/docs/components/central-dash/overview/) for easy navigation and management
  with [Kubeflow Profiles](/docs/components/central-dash/profiles/) for access control.
- Additional tooling for data management (PVC Viewer), visualization (TensorBoards), and more.

The Kubeflow Platform can be installed via
[Packaged Distributions](/docs/started/installing-kubeflow/#packaged-distributions) or
[Kubeflow Manifests](/docs/started/installing-kubeflow/#kubeflow-manifests).

## Kubeflow Overview Diagram

The following diagram shows the main Kubeflow components to cover each stage of the ML lifecycle
on top of Kubernetes.

<img src="/docs/started/images/kubeflow-intro-diagram.drawio.svg"
  alt="Kubeflow overview"
  class="mt-3 mb-3">

Read the [architecture overview](/docs/started/architecture/) to learn about the Kubeflow ecosystem
and to see how Kubeflow components fit in ML lifecycle.

## Kubeflow Video Introduction

Watch the following video which provides an introduction to Kubeflow.

{{< youtube id="cTZArDgbIWw" title="Introduction to Kubeflow">}}

## The Kubeflow mission

Our goal is to make scaling machine learning (ML) models and deploying them to
production as simple as possible, by letting Kubernetes do what it's great at:

- Easy, repeatable, portable deployments on a diverse infrastructure
  (for example, experimenting on a laptop, then moving to an on-premises
  cluster or to the cloud)
- Deploying and managing loosely-coupled microservices
- Scaling based on demand

Because ML practitioners use a diverse set of tools, one of the key goals is to
customize the stack based on user requirements (within reason) and let the
system take care of the "boring stuff". While we have started with a narrow set
of technologies, we are working with many different projects to include
additional tooling.

Ultimately, we want to have a set of simple manifests that give you an easy to
use ML stack _anywhere_ Kubernetes is already running, and that can self
configure based on the cluster it deploys into.

## History

Kubeflow started as an open sourcing of the way Google ran [TensorFlow](https://www.tensorflow.org/) internally, based on a pipeline called [TensorFlow Extended](https://www.tensorflow.org/tfx/).
It began as just a simpler way to run TensorFlow jobs on Kubernetes, but has since expanded to be a multi-architecture, multi-cloud framework for running end-to-end machine learning workflows.

## Roadmaps

To see what's coming up in future versions of Kubeflow, refer to the [Kubeflow roadmap](https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md).

The following components also have roadmaps:

- [Kubeflow Pipelines](https://github.com/kubeflow/pipelines/blob/master/ROADMAP.md)
- [KServe](https://github.com/kserve/kserve/blob/master/ROADMAP.md)
- [Katib](https://github.com/kubeflow/katib/blob/master/ROADMAP.md)
- [Training Operator](https://github.com/kubeflow/training-operator/blob/master/ROADMAP.md)

## Getting involved

There are many ways to contribute to Kubeflow, and we welcome contributions!

Read the [contributor's guide](/docs/about/contributing/) to get started on the code, and learn about the community on the [community page](/docs/about/community/).

## Next Steps

- Follow [the installation guide](/docs/started/installing-kubeflow) to deploy standalone
  Kubeflow components or Kubeflow Platform.
