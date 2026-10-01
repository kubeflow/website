---
title: Overview
description: An overview of Kubeflow Workspaces
weight: 10
---

## What does Kubeflow Workspace offer?

Kubeflow Workspaces provides on-demand, containerized development environments that run directly on
your Kubernetes cluster. This bridges the gap to give data scientists, machine learning engineers
and agents a convenient access to the infrastructure in your Kubernetes cluster to code, explore
data, and run experiments, while platform administrators keep full control over the images, hardware
resources, and security that back those environments.

Kubeflow Workspaces is the next generation of [Kubeflow Notebooks](/docs/components/notebooks/),
replacing the original Notebooks controller with a more flexible and extensible architecture.

{{< workspaces-beta-notice >}}

## Core Features

- **Interactive development environments on Kubernetes**: run your IDE next to your data and
  powerful compute instead of locally on your workstation.
- **Support for any web-based IDE**, with first-class examples for popular examples such as
  [JupyterLab](https://github.com/jupyterlab/jupyterlab), [Visual Studio Code
  (code-server)](https://github.com/coder/code-server), and
  [RStudio](https://github.com/rstudio/rstudio).
- **Persona-based design** Cluster admins curate the available environments through the
  `WorkspaceKind` custom resource, including base images, default resources, and pod-level
  configuration, so endusers can create `Workspace` resources in a guided wizard without having to
  understand the underlying Kubernetes resources.

## Get Started

Ready to try Kubeflow Workspaces? Follow the
[Deployment Guide](/docs/components/workspaces/operator-guides/deployment-guide/) to install
it alongside the [Kubeflow Community Distribution](/docs/started/installing-kubeflow/) on a
staging or development cluster.

## Next Steps

- Read the [Deployment Guide](/docs/components/workspaces/operator-guides/deployment-guide/)
  to install Kubeflow Workspaces.
- Want to help build it? See
  [Contribute to Kubeflow Workspaces](/docs/components/workspaces/contributor-guides/contribute/).
- Explore the current [Kubeflow Notebooks](/docs/components/notebooks/) documentation.
- Follow development in the
  [`kubeflow/notebooks`](https://github.com/kubeflow/notebooks) repository on GitHub.
