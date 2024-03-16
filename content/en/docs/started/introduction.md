+++
title = "Introduction"
description = "An introduction to Kubeflow"
weight = 1
+++

The Kubeflow project is dedicated to making deployments of machine learning (ML)
workflows on Kubernetes simple, portable and scalable. Our goal is not to
recreate other services, but to provide a straightforward way to deploy
best-of-breed open-source systems for ML to diverse infrastructures. Anywhere
you are running Kubernetes, you should be able to run Kubeflow.

The following diagram shows the main Kubeflow components to cover each step of ML lifecycle
on top of Kubernetes.

<img src="/docs/started/images/kubeflow-intro-diagram.drawio.svg"
  alt="Kubeflow overview"
  class="mt-3 mb-3">

## Getting started with Kubeflow

Read the [architecture overview](/docs/started/architecture/) for an
introduction to the architecture of Kubeflow and to see how you can use Kubeflow
to manage your ML workflow.

Follow [Installing Kubeflow](/docs/started/installing-kubeflow/) to set up
your environment and install Kubeflow.

Watch the following video which provides an introduction to Kubeflow.

{{< youtube id="cTZArDgbIWw" title="Introduction to Kubeflow">}}

## What is Kubeflow?

Kubeflow is _the machine learning toolkit for Kubernetes_.

To use Kubeflow, the basic workflow is:

- Download and run the Kubeflow deployment binary.
- Customize the resulting configuration files.
- Run the specified script to deploy your containers to your specific
  environment.

You can adapt the configuration to choose the platforms and services that you
want to use for each stage of the ML workflow:

1. data preparation
2. model training,
3. prediction serving
4. service management

You can choose to deploy your Kubernetes workloads locally, on-premises, or to
a cloud environment.

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

The [Kubeflow logo represents](https://github.com/kubeflow/kubeflow/issues/187#issuecomment-375194419) the letters `K` and `F` inside the heptagon of the Kubernetes logo, which represent two communities: `Kubernetes` (cloud-native) and `flow` (Machine Learning). In this context, `flow` is not only indicating `TensorFlow`, but also all ML frameworks which make use of Dataflow Graph as the normal form for model/algorithm implementation.

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
