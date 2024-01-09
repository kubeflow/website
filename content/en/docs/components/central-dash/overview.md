+++
title = "Overview"
description = "Overview of the Kubeflow Central Dashboard"
weight = 10
+++

{{% stable-status %}}

## What is the Kubeflow Central Dashboard?

The _Kubeflow Central Dashboard_ provides an authenticated web interface for Kubeflow and ecosystem components. 
It acts as a hub for your machine learning platform and tools by exposing the UIs of components running in the cluster.

Some core features of the central dashboard include:

- Authentication and authorization based on [Profiles and Namespaces](/docs/components/central-dash/profiles/).
- Access to the [user interface's](#navigation) of Kubeflow components.
- The ability to [customize and include links](/docs/components/central-dash/customizing-menu/) to third-party applications.

## Screenshots

Here is a screenshot of the Kubeflow Central Dashboard:

<img src="/docs/images/central-ui.png" alt="Kubeflow central UI" class="mt-3 mb-3 border border-info rounded"></img>

## Navigation

Kubeflow and its components have a number of user interfaces which you access from the central dashboard.

Here is a list of the main pages, grouped by component.

### Core Sections

The following sections are available in all Kubeflow deployments:

- **Home**: landing page for the Kubeflow Central Dashboard
- **Manage Contributors**: manage contributors for the current profile/namespace

### Kubeflow Notebooks

The following sections are available when [Kubeflow Notebooks](/docs/components/notebooks/) is installed:

- **Notebooks**: manage Kubeflow Notebooks
- **Volumes**: manage Kubernetes PVC Volumes

### Kubeflow Pipelines

The following sections are available when [Kubeflow Pipelines](/docs/components/pipelines/) is installed:

- **Experiments (KFP)**: manage KFP experiments
- **Runs**: manage KFP runs
- **Recurring Runs**: To manage KFP recurring runs
- **Pipelines**: manage KFP pipelines
- **Artifacts**: track ML Metadata (MLMD) artifacts
- **Executions**: track various component executions in MLMD

### Katib

The following sections are available when [Katib](/docs/components/katib/) is installed:

- **Experiments (AutoML)**: manage Katib experiments

### KServe

The following sections are available when [KServe](/docs/external-add-ons/kserve/) is installed:

- **Models**: manage deployed KServe models

## Next steps

- Learn how to [Access the Central Dashboard](/docs/components/central-dash/access/).
- Learn about [Profiles and Namespaces](/docs/components/central-dash/profiles/).