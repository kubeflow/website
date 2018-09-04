+++
title = "Getting Started with Kubeflow"
description = "Quickly get running with your ML Workflow on an existing Kubernetes installation"
weight = 25
toc = true
bref = "The Kubeflow project is dedicated to making deployments of machine learning (ML) workflows on Kubernetes simple, portable and scalable. Our goal is not to recreate other services, but to provide a straightforward way to deploy best-of-breed open-source systems for ML to diverse infrastructures. Anywhere you are running Kubernetes, you should be able to run Kubeflow."
aliases = ["/docs/started/"]
[menu.docs]
  parent = "started"
  weight = 1
+++

## Who should consider using Kubeflow?

Based on the current functionality you should consider using Kubeflow if:

  * You want to train/serve TensorFlow models in different environments (e.g. local, on prem, and cloud)
  * You want to use Jupyter notebooks to manage TensorFlow training jobs
  * You want to launch training jobs that use resources -- such as additional
    CPUs or GPUs -- that aren't available on your personal computer
  * You want to combine TensorFlow with other processes
       * For example, you may want to use [tensorflow/agents](https://github.com/tensorflow/agents) to run simulations to generate data for training reinforcement learning models.

This list is based ONLY on current capabilities. We are investing significant resources to expand the
functionality and actively soliciting help from companies and individuals interested in contributing (see [Contributing](/docs/contributing/)).

## Setup

This documentation assumes you have a Kubernetes cluster already available.

  * For local environment try [Minikube setup](/docs/started/getting-started-minikube/).
  * For cloud environment try [GKE setup](/docs/started/getting-started-gke/).
  * For general k8s cluster try [quick start](/docs/started/getting-started/#quick-start) or [install via ksonnet](/docs/started/getting-started/#install-via-ksonnet).

For more general information on setting up a Kubernetes cluster please refer to [Kubernetes Setup](https://kubernetes.io/docs/setup/). If you want to use GPUs, be sure to follow the Kubernetes [instructions for enabling GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/).

## Quick start

Requirements:

  * ksonnet version [0.11.0](https://github.com/ksonnet/ksonnet/releases).
  * Kubernetes >= 1.8 [see here](https://github.com/kubeflow/tf-operator#requirements)
  * kubectl

Run the following script to create a ksonnet app for Kubeflow and deploy it.

```
export KUBEFLOW_VERSION=0.2.5
curl https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/deploy.sh | bash
```

**Important**: The commands above will enable collection of **anonymous** user data to help us improve Kubeflow; for more information including instructions for explictly
disabling it please refer to the [Usage Reporting section](/docs/guides/usage-reporting/) of the user guide.

## Troubleshooting
For detailed troubleshooting instructions, please refer to the [Troubleshooting Guide](/docs/guides/troubleshooting/).

## Resources

* The Guides section (see sections on left) provides in-depth instructions for using Kubeflow
* Katacoda has produced a [self-paced scenario](https://www.katacoda.com/kubeflow) for learning and trying out Kubeflow
