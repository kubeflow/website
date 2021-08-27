+++
title = "Upgrade Notes"
description = "Notices and breaking changes when you upgrade Kubeflow Pipelines Backend"
weight = 50
+++

This page introduces notices and breaking changes you need to know when upgrading Kubeflow Pipelines Backend.

For upgrade instructions, refer to distribution specific documentations:

* [Upgrading Kubeflow Pipelines on Google Cloud](/docs/distributions/gke/pipelines/upgrade/)

## Upgrading to [v1.7]

[v1.7]: https://github.com/kubeflow/pipelines/releases/tag/1.7.0

* **Breaking Change**: Metadata UI and visualizations are not compatible with TensorFlow Extended (TFX) <= v1.0.0. Upgrade to v1.2.0 or above, refer to [Kubeflow Pipelines Backend and TensorFlow Extended (TFX) compatibility matrix](/docs/components/pipelines/installation/compatibility-matrix/).

* **Notice**: Emissary executor (Alpha), a new argo workflow executor is available as an option. Due to [Kubernetes deprecating Docker as a container runtime after v1.20](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/), emissary may become the default workflow executor for Kubeflow Pipelines in the near future.

    For example, the current default docker executor does not work on Google Kubernetes Engine (GKE) 1.19+ out of the box. To use docker executor, your cluster node image must be configured to use docker (deprecated) as container runtime.

    Alternatively, using emissary executor (Alpha) removes the restriction on container runtime, but note some of your pipelines may require manual migrations. The Kubeflow Pipelines team welcomes your feedback in [the Emissary Executor feedback github issue](https://github.com/kubeflow/pipelines/issues/6249).

    For detailed configuration and migration instructions for both options, refer to [Argo Workflow Executors](https://www.kubeflow.org/docs/components/pipelines/installation/choose-executor/).

* **Notice**: [Kubeflow Pipelines SDK v2 compatibility mode](/docs/components/pipelines/sdk/v2/v2-compatibility/) (Beta) was recently released. The new mode adds support for tracking pipeline runs and artifacts using ML Metadata. In v1.7 backend release complete UI support and caching capabilities for v2 compatibility mode are newly added, [your feedback is welcomed](https://github.com/kubeflow/pipelines/issues/6451).
