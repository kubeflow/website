+++
title = "Upgrade Notes"
description = "Notices and breaking changes when you upgrade Kubeflow Pipelines Backend"
weight = 90
+++
{{% alert title="Old Version" color="warning" %}}
This page is about __Kubeflow Pipelines V1__, please see the [V2 documentation](/docs/components/pipelines) for the latest information.

Note, while the V2 backend is able to run pipelines submitted by the V1 SDK, we strongly recommend [migrating to the V2 SDK](/docs/components/pipelines/user-guides/migration).
For reference, the final release of the V1 SDK was [`kfp==1.8.22`](https://pypi.org/project/kfp/1.8.22/), and its reference documentation is [available here](https://kubeflow-pipelines.readthedocs.io/en/1.8.22/).
{{% /alert %}}

This page introduces notices and breaking changes you need to know when upgrading Kubeflow Pipelines Backend.

For upgrade instructions, refer to distribution specific documentations:

* [Upgrading Kubeflow Pipelines on Google Cloud](/docs/distributions/gke/pipelines/upgrade/)

## Upgrading to v2.0

* **Notice**: In v2.0 frontend, run metrics columns are deprecated in the run list page, but users can still get the same information by using [KFPv2 Scalar metrics](/docs/components/pipelines/legacy-v1/sdk/output-viewer/#scalar-metrics)

## Upgrading to [v1.7]

[v1.7]: https://github.com/kubeflow/pipelines/releases/tag/1.7.0

* **Breaking Change**: Metadata UI and visualizations are not compatible with TensorFlow Extended (TFX) <= v1.0.0. Upgrade to v1.2.0 or above, refer to [Kubeflow Pipelines Backend and TensorFlow Extended (TFX) compatibility matrix](/docs/components/pipelines/legacy-v1/installation/compatibility-matrix/).

* **Notice**: Emissary executor (Alpha), a new argo workflow executor is available as an option. Due to [Kubernetes deprecating Docker as a container runtime after v1.20](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/), emissary may become the default workflow executor for Kubeflow Pipelines in the near future.

    For example, the current default docker executor does not work on Google Kubernetes Engine (GKE) 1.19+ out of the box. To use docker executor, your cluster node image must be configured to use docker (deprecated) as container runtime.

    Alternatively, using emissary executor (Alpha) removes the restriction on container runtime, but note some of your pipelines may require manual migrations. The Kubeflow Pipelines team welcomes your feedback in [the Emissary Executor feedback github issue](https://github.com/kubeflow/pipelines/issues/6249).

    For detailed configuration and migration instructions for both options, refer to [Argo Workflow Executors](/docs/components/pipelines/legacy-v1/installation/choose-executor/).

* **Notice**: [Kubeflow Pipelines SDK v2](/docs/components/pipelines/user-guides/migration/) was released. The new mode adds support for tracking pipeline runs and artifacts using ML Metadata. In v1.7 backend, complete UI support and caching capabilities for v2 compatibility mode are newly added. We welcome any [feedback](https://github.com/kubeflow/pipelines/issues/6451) on positive experiences or issues you encounter.
