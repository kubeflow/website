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
- The ability to [customize and include links](/docs/components/central-dash/customize/) to third-party applications.

## Screenshots

Here is a screenshot of the Kubeflow Central Dashboard:

<img src="/docs/images/dashboard/homepage.png" 
     alt="Kubeflow Central Dashboard - Homepage" 
     class="mt-3 mb-3 border rounded">
</img>

## Navigation

Kubeflow and its components have a number of user interfaces which you access from the central dashboard.

Here is a list of the main pages, grouped by component.

### Core Sections

The following sections are available in all Kubeflow deployments:

- **Home**: landing page for Kubeflow Central Dashboard
- **Manage Contributors**: manage contributors of profiles (namespaces) that you own

### Kubeflow Notebooks

The following sections are available when [Kubeflow Notebooks](/docs/components/notebooks/) is installed:

- **Notebooks**: manage Kubeflow Notebooks
- **TensorBoards**: manage TensorBoard instances
- **Volumes**: manage Kubernetes PVC Volumes

### Kubeflow Katib

The following sections are available when [Katib](/docs/components/katib/) is installed:

- **Katib Experiments**: manage Katib AutoML experiments

### KServe

The following sections are available when [KServe](/docs/components/kserve/) is installed:

- **KServe Endpoints**: manage deployed KServe model endpoints

### Kubeflow Pipelines

When [Kubeflow Pipelines](/docs/components/pipelines/) is installed, you can select **Pipelines** from the sidebar:

<img src="/docs/images/dashboard/pipelines-runs.png" 
     alt="Kubeflow Central Dashboard - Pipelines - Runs" 
     class="mt-3 mb-3 border rounded">
</img>

In the **Pipelines** section, you can access the following pages:

- **Pipelines**: manage pipeline definitions
- **Experiments**: manage pipeline experiments
- **Runs**: manage pipeline runs
- **Recurring Runs**: manage recurring pipeline runs
- **Artifacts**: track artifacts produced by pipelines stored in MLMD
- **Executions**: track executions of pipeline components stored in MLMD

## Next steps

- Learn how to [Access the Central Dashboard](/docs/components/central-dash/access/).
- Learn about [Profiles and Namespaces](/docs/components/central-dash/profiles/).
