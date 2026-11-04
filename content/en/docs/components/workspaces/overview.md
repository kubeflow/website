---
title: Overview
description: An overview of Kubeflow Workspaces
weight: 10
---

## What do Kubeflow Workspaces offer?

Kubeflow Workspaces provides on-demand, containerized development environments that run directly on
your Kubernetes cluster. This bridges the gap to give data scientists, machine learning engineers
and agents convenient access to the infrastructure in your Kubernetes cluster to code, explore
data, and run experiments, while platform administrators keep full control over the images, hardware
resources, and security that back those environments.

Kubeflow Workspaces is the next generation of [Kubeflow Notebooks](/docs/components/notebooks/),
replacing the original Notebooks controller with a more flexible and extensible architecture.

{{< workspaces-beta-notice >}}

## Core Features

- **Interactive development environments on Kubernetes**: run your IDE next to your data and
  powerful compute instead of locally on your workstation.
- **Support for any web-based IDE**, with first-class examples for popular IDEs such as
  [JupyterLab](https://github.com/jupyterlab/jupyterlab), [Visual Studio Code
  (code-server)](https://github.com/coder/code-server), and
  [RStudio](https://github.com/rstudio/rstudio).
- **Persona-based design**: Cluster admins curate the available environments through the
  `WorkspaceKind` custom resource, including base images, default resources, and pod-level
  configuration, so end users can create `Workspace` resources in a guided wizard without having to
  understand the underlying Kubernetes resources.

## Core concepts and architecture

### Custom resources

- **`WorkspaceKind`**: Cluster-scoped resource curated by platform administrators. It defines the Workspace template, image and pod configuration choices, and administrative policies.
- **`Workspace`**: Namespace-scoped resource representing an individual user development environment. It references a `WorkspaceKind` and records the user-selected configuration.

### Component responsibilities

| Component | Responsibility |
| --- | --- |
| **Frontend** | User interface for creating, monitoring, and managing Workspaces. |
| **Backend** | Backend-for-frontend API used by the UI. |
| **Controller** | Reconciles `Workspace` and `WorkspaceKind` resources and manages the runtime Kubernetes resources. The controller currently owns a `StatefulSet`, `Service`, `ServiceAccount`, `RoleBindings`, and optionally an Istio `VirtualService`. |

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
