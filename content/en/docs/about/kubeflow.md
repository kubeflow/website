+++
title = "Kubeflow"
description = "An introduction to Kubeflow"
weight = 1
aliases = ["/docs/", "/docs/about/", "/docs/kubeflow/"]
                    
+++

The Kubeflow project is dedicated to making deployments of machine learning (ML)
workflows on Kubernetes simple, portable and scalable. Our goal is not to
recreate other services, but to provide a straightforward way to deploy
best-of-breed open-source systems for ML to diverse infrastructures. Anywhere
you are running Kubernetes, you should be able to run Kubeflow.

## Getting started with Kubeflow

Read the [Kubeflow overview](/docs/started/kubeflow-overview/) for an
introduction to the Kubeflow architecture and to see how you can use Kubeflow
to manage your ML workflow.

Follow the [getting-started guide](/docs/started/getting-started/) to set up
your environment and install Kubeflow.

Watch the following video which provides an introduction to Kubeflow.

{{< youtube cTZArDgbIWw >}}

## What is Kubeflow?

Kubeflow is _the machine learning toolkit for Kubernetes_. Learn about [Kubeflow use cases](/docs/about/use-cases/).

To use Kubeflow, the basic workflow is:

- Download and run the Kubeflow deployment binary.
- Customize the resulting configuration files.
- Run the specified script to deploy your containers to your specific
  environment.

You can adapt the configuration to choose the platforms and services that you
want to use for each stage of the ML workflow: data preparation, model training,
prediction serving, and service management.

You can choose to deploy your Kubernetes workloads locally, on-premises, or to
a cloud environment.

Read the [Kubeflow overview](/docs/started/kubeflow-overview/) for more details.

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

Kubeflow started as an open sourcing of the way Google ran [TensorFlow](https://www.tensorflow.org/) internally, based on a pipeline called [TensorFlow Extended](https://www.tensorflow.org/tfx/). It began as just a simpler way to run TensorFlow jobs on Kubernetes, but has since expanded to be a multi-architecture, multi-cloud framework for running entire machine learning pipelines.

## Roadmaps

To see what's coming up in future versions of Kubeflow, refer to the [Kubeflow roadmap](https://github.com/kubeflow/kubeflow/blob/master/ROADMAP.md).

The following components also have roadmaps:

- [Arena](https://github.com/kubeflow/arena/blob/master/ROADMAP.md)
- [Fairing](https://github.com/kubeflow/fairing/blob/master/roadmap.md)
- [Kubeflow Pipelines](https://github.com/kubeflow/pipelines/blob/master/ROADMAP.md)
- [KF Serving](https://github.com/kubeflow/kfserving/blob/master/ROADMAP.md)
- [Katib](https://github.com/kubeflow/katib/blob/master/ROADMAP.md)
- [MPI Operator](https://github.com/kubeflow/mpi-operator/blob/master/ROADMAP.md)

## Getting involved

There are many ways to contribute to Kubeflow, and we welcome contributions!
Read the [contributor's guide](/docs/about/contributing) to get started on the
code, and get to know the community in the
[community guide](/docs/about/community).
