---
title: Concepts
description: Core concepts in Kubeflow Workspaces
weight: 15
---

Kubeflow Workspaces uses an option-based model that separates the development environment a
data scientist wants from the Kubernetes configuration used to run it. Platform administrators
define `WorkspaceKind` resources containing reusable software, compute, and policy options,
while data scientists create and update `Workspace` resources through a guided interface using
those available options.

## Workspace and WorkspaceKind

A **`Workspace`** represents an interactive development environment intended for data scientists.
It is a namespaced resource that records the `WorkspaceKind` and configuration options selected
by the data scientist.

A **`WorkspaceKind`** is a cluster-scoped resource managed by platform administrators. It defines
a type of development environment, such as JupyterLab, Visual Studio Code (code-server), or
RStudio, together with the options and policies available to users.

This separation allows users to work with meaningful environment choices without configuring the
underlying Kubernetes resources directly.

## How the concepts fit together

The administrator defines a [`WorkspaceKind`](#workspace-and-workspacekind) containing the
environment options and policies available to users:

- [Image Configs and Pod Configs](#image-configs-and-pod-configs)
- [Filter Rules](#filter-rules)
- [Option Redirects](#option-redirects)
- [Activity Rules](#activity-rules)

In the Workspaces frontend, a data scientist creates a
[`Workspace`](#workspace-and-workspacekind) through a guided process:

- Choose an available `WorkspaceKind`
- Select from the Image Config and Pod Config options presented by the frontend
- Create the `Workspace`

The frontend presents the administrator-defined options, so data scientists do not need to
write Kubernetes resource definitions themselves. The Workspace controller translates the
selected configuration into the Kubernetes resources needed to run the environment.

## Image Configs and Pod Configs

A `WorkspaceKind` can define two primary groups of options:

- **Image Configs** define the software environment available to a Workspace, including the
  container image and ports exposed by that configuration.
- **Pod Configs** define reusable pod-level configuration, such as compute resources and scheduling
  requirements.

**Example:**

A data scientist might select a JupyterLab `WorkspaceKind`, a PyTorch Image Config,
and a GPU Pod Config. Workspaces translates those selections into the Kubernetes configuration
defined by the cluster administrator.

## Filter Rules

**Filter Rules** control which WorkspaceKinds, Image Configs, or Pod Configs are visible or allowed
for a given context.

Rules can use information such as namespace labels or previously selected options to present only
the configurations that are relevant to the user.

**Example:**

An administrator can use Filter Rules to show GPU Pod Configs only when a compatible
Image Config is selected, or restrict certain configurations based on namespace labels.

## Option Redirects

**Option Redirects** allow administrators to point an existing Image Config or Pod Config to a
replacement.

This provides a controlled way to evolve the available environment catalog. When a data scientist
starts or edits a Workspace, the frontend can display redirect information to explain which
replacement configuration will be used.

**Example:**

An older image option can redirect to a newer image option without changing the configuration of
an already running Workspace unexpectedly.

## Activity Rules

**Activity Rules** define lifecycle policies for Workspaces based on their activity.

**Activity Probes** allow administrators to define how activity is detected for a Workspace,
rather than relying on a single fixed definition of activity.

Administrators can configure Activity Rules to determine when an inactive Workspace becomes
eligible to be paused. These policies can be tailored to different teams or hardware requirements.

**Example:**

An administrator might configure a shorter inactivity period for GPU-backed
Workspaces to conserve expensive compute resources, while allowing longer periods for other
environments.
