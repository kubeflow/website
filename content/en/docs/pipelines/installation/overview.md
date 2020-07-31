+++
title = "Installation Options for Kubeflow Pipelines"
description = "Overview of the ways to deploy Kubeflow Pipelines"
weight = 10
+++

Kubeflow Pipelines offers a few installation options.
This page describes the options and the features available
with each option:

* A [standalone](#standalone) Kubeflow Pipelines deployment is the minimal
portable installation that only includes Kubeflow Pipelines.
* Kubeflow Pipelines as [part of a full Kubeflow deployment](#full-kubeflow) provides
all Kubeflow components and more integration with each platform.
* **Beta**: [Google Cloud AI Platform Pipelines](#marketplace) provides easy-to-use management
UI for installing and using Kubeflow Pipelines on Google Cloud.

## Choosing an installation option

1. Do you want to use other Kubeflow components in addition to Pipelines?

    If yes, choose the [full Kubeflow](#full-kubeflow).
1. Do you want to use Kubeflow Pipelines with [multi-user support](https://github.com/kubeflow/pipelines/issues/1223)?

    If yes, wait for the feature to be released in [Kubeflow](#full-kubeflow) 1.1.
1. Do you deploy on Google Cloud?

    If yes, deploy [Kubeflow Pipelines Standalone](#standalone). You can also
    use [AI Platform Pipelines](#marketplace) to deploy Kubeflow Pipelines
    Standalone using a user interface, but there are limitations in
    customizability and upgradability. For details, please read corresponding
    sections.
1. You deploy on other platforms.

    Please compare your platform specific [full Kubeflow](#full-kubeflow) with the
    [Kubeflow Pipelines Standalone](#standalone) before making your decision.

**Warning:** Choose your installation option with caution, there's no current
supported path to migrate data between different installation options. Please
create [a GitHub issue](https://github.com/kubeflow/pipelines/issues/new/choose)
if that's important for you.

<a id="standalone"></a>
## Kubeflow Pipelines Standalone

Use this option to deploy Kubeflow Pipelines to an on-premises, cloud
or even local Kubernetes cluster, without the other components of Kubeflow.
To deploy Kubeflow Pipelines Standalone, you use kustomize manifests only.
This process makes it simpler to customize your deployment and to integrate
Kubeflow Pipelines into an existing Kubernetes cluster.

Installation guide
: [Kubeflow Pipelines Standalone deployment
  guide](/docs/pipelines/installation/standalone-deployment/)

Interfaces
:
  * Kubeflow Pipelines UI
  * Kubeflow Pipelines UI via the **Open Pipelines Dashboard** link in the
    Google Cloud Console
  * Kubeflow Pipelines SDK
  * Kubeflow Pipelines API
  * Kubeflow Pipelines endpoint is **only auto-configured** for Google Cloud.

  If you wish to deploy Kubeflow Pipelines on other platforms, you can either access it through
  `kubectl port-forward` or configure your own platform specific auth-enabled
  endpoint by yourself.

Release Schedule
: Kubeflow Pipelines Standalone is available for every Kubeflow Pipelines release.
You will have access to latest features.

Upgrade Support (**Beta**)
: [Upgrading Kubeflow Pipelines Standalone](/docs/pipelines/installation/standalone-deployment/#upgrading-kubeflow-pipelines) introduces how to upgrade
in place.

Notes on specific features
:
  * After deployment, your Kubernetes cluster contains Kubeflow Pipelines only.
  It does not include the other Kubeflow components.
  For example, to use a Jupyter Notebook, you must use a local notebook or a
  hosted notebook in a cloud service such as the [AI Platform
  Notebooks](https://cloud.google.com/ai-platform/notebooks/docs/).
  * Kubeflow Pipelines multi-user support is **not available** in standalone, because
  multi-user support depends on other Kubeflow components.

<a id="full-kubeflow"></a>
## Full Kubeflow deployment

Use this option to deploy Kubeflow Pipelines to your local machine, on-premises,
or to a cloud, as part of a full Kubeflow installation.

Installation guide
: [Kubeflow installation guide](/docs/started/getting-started/)

Interfaces
:
  * Kubeflow UI
  * Kubeflow Pipelines UI within or outside the Kubeflow UI
  * Kubeflow Pipelines SDK
  * Kubeflow Pipelines API
  * Other Kubeflow APIs
  * Kubeflow Pipelines endpoint is auto-configured with auth support for each platform

Release Schedule
: The full Kubeflow is released quarterly. It has significant delay in receiving
Kubeflow Pipelines updates.

| Kubeflow Version       | Kubeflow Pipelines Version | Addition Comments                       |
|------------------------|----------------------------|-----------------------------------------|
| 0.7.0                  | 0.1.31                     |                                         |
| 1.0.0                  | 0.2.0                      |                                         |
| 1.0.2                  | 0.2.5                      |                                         |
| 1.1.0 (To be released) | 1.0.0*                     | Some platforms may still have Kubeflow Pipelines 0.2.5 |

Upgrade Support (**Alpha**)
: Reinstallation supported with [instructions](/docs/gke/pipelines/upgrade). Upgrade support is limited.

Notes on specific features
:
  * After deployment, your Kubernetes cluster includes all the
  [Kubeflow components](/docs/components/).
  For example, you can use the Jupyter notebook services
  [deployed with Kubeflow](/docs/notebooks/) to create one or more notebook
  servers in your Kubeflow cluster.
  * Kubeflow Pipelines multi-user support is **only available** in full Kubeflow. It supports
  using a single Kubeflow Pipelines control plane to orchestrate user pipeline
  runs in multiple user namespaces with authorization.
  * Latest features and bug fixes may not be available soon because release
  cadence is long.

<a id="marketplace"></a>
## Google Cloud AI Platform Pipelines

{{% alert title="Beta release" color="warning" %}}
<p>Google Cloud AI Platform Pipelines is currently in <b>Beta</b> with
  limited support. The Kubeflow Pipelines team is interested in any feedback you may have,
  in particular on the usability of the feature.

  You can raise any issues or discussion items in the
  <a href="https://github.com/kubeflow/pipelines/issues">Kubeflow Pipelines
  issue tracker</a>.</p>
{{% /alert %}}

Use this option to deploy Kubeflow Pipelines to Google Kubernetes Engine (GKE)
from Google Cloud Marketplace. You can deploy Kubeflow Pipelines to an existing or new
GKE cluster and manage your cluster within Google Cloud.

Installation guide
: [Google Cloud AI Platform Pipelines documentation](https://cloud.google.com/ai-platform/pipelines/docs)

Interfaces
:
  * Google Cloud Console for managing the Kubeflow Pipelines cluster and other Google Cloud
    services
  * Kubeflow Pipelines UI via the **Open Pipelines Dashboard** link in the
    Google Cloud Console
  * Kubeflow Pipelines SDK in Cloud Notebooks
  * Kubeflow Pipelines endpoint of your instance is auto-configured for you

Release Schedule
: AI Platform Pipelines is available for a chosen set of stable Kubeflow
Pipelines releases. You will receive updates slightly slower than Kubeflow
Pipelines Standalone.

Upgrade Support (**Alpha**)
: An in-place upgrade is not supported.

To upgrade your AI Platform Pipelines instance while keeping existing data:

For instances **without** managed storage:

1. [Delete your AI Platform Pipelines instance](https://cloud.google.com/ai-platform/pipelines/docs/getting-started#clean_up) **without** selecting **Delete cluster**.
1. Reinstall Kubeflow Pipelines from the Google Cloud Marketplace using the same application name, namespace, and Google Kubernetes Engine cluster. Persisted artifacts and database data are stored in persistent disks and will be automatically picked up during reinstallation.

For instances with managed storage:

1. [Delete your AI Platform Pipelines instance](https://cloud.google.com/ai-platform/pipelines/docs/getting-started#clean_up).
1. Reinstall Kubeflow Pipelines from the Google Cloud Marketplace using the same application name and managed storage options as before. You can freely install it in a different cluster or namespace, because persisted artifacts and database data are stored in managed storages (Google Cloud Storage and Cloud SQL), and will be automatically picked up during reinstallation.

Notes on specific features
:
  * After deployment, your Kubernetes cluster contains Kubeflow Pipelines only.
  It does not include the other Kubeflow components.
  For example, to use a Jupyter Notebook, you can use [AI Platform
  Notebooks](https://cloud.google.com/ai-platform/notebooks/docs/).
  * Kubeflow Pipelines multi-user support is **not available** in AI Platform Pipelines, because
  multi-user support depends on other Kubeflow components.
