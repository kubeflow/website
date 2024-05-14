+++
title = "Introduction"
description = "An introduction to Kubeflow"
weight = 1
+++

## What is Kubeflow ?

Kubeflow is a community and ecosystem of open-source projects to address each stage in the
machine learning (ML) lifecycle. It makes ML on Kubernetes simple, portable, and scalable.
The Kubeflow goal is to facilitate the orchestration of Kubernetes ML workloads and to empower users
to deploy best-in-class open-source systems to any Cloud infrastructure.
Whether you’re a researcher, data scientist, ML engineer, or a team of developers, Kubeflow offers
modular and scalable tools that cater to all aspects of the ML lifecycle: from building ML models to
deploying them to production for AI applications.

## What are Kubeflow Standalone Components?

Kubeflow is composed of multiple, independent open-source projects which address different aspects
of a ML lifecycle. These standalone components are designed to be usable both within the Kubeflow
Platform and independently. These components can be installed independently on a Kubernetes cluster,
providing flexibility to users who may not require the full capabilities of Kubeflow Platform but
wish to leverage specific ML functionalities.

## What is Kubeflow Platform ?

The Kubeflow Platform refers to the full suite of Kubeflow components bundled together with
additional integration and management tools. Installing Kubeflow as a platform means deploying a
comprehensive ML toolkit that integrates these components into a cohesive system, optimized for
managing the end-to-end ML lifecycle. These includes not only the standalone components but also:

- Central Dashboard for easy navigation and management.
- Multi-user capabilities and access management.
- Additional tooling and services for data management, visualization, and more.

This integrated environment ensures that all the different pieces work together seamlessly,
providing a more robust and streamlined user experience.

Kubeflow Platform can be installed via
[Packaged Distributions](/docs/started/installing-kubeflow/#install-kubeflow-platform-from-packaged-distributions) or
[Raw Manifests](/docs/started/installing-kubeflow/#install-kubeflow-platform-from-raw-manifests).

## Getting started with Kubeflow

The following diagram shows the main Kubeflow components to cover each step of ML lifecycle
on top of Kubernetes.

<img src="/docs/started/images/kubeflow-intro-diagram.drawio.svg"
  alt="Kubeflow overview"
  class="mt-3 mb-3">

Read the [architecture overview](/docs/started/architecture/) for an
introduction to the architecture of Kubeflow and to see how you can use Kubeflow
to manage your ML workflow.

Follow [Installing Kubeflow](/docs/started/installing-kubeflow/) to set up
your environment and install Kubeflow.

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
- [KF Serving](https://github.com/kubeflow/kfserving/blob/master/ROADMAP.md)
- [Katib](https://github.com/kubeflow/katib/blob/master/ROADMAP.md)
- [Training Operator](https://github.com/kubeflow/common/blob/master/ROADMAP.md)

## Getting involved

There are many ways to contribute to Kubeflow, and we welcome contributions!

Read the [contributor's guide](/docs/about/contributing/) to get started on the code, and learn about the community on the [community page](/docs/about/community/).

## Next Steps

- Follow [the installation guide](/docs/started/installing-kubeflow) to deploy Kubeflow standalone
  components or Kubeflow Platform.
