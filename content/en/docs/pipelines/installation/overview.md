+++
title = "Installation Options for Kubeflow Pipelines"
description = "Overview of the ways to deploy Kubeflow Pipelines"
weight = 10
+++

Kubeflow Pipelines offers a few installation options.
This page describes the options and the features available
with each option:

* A [standalone](#standalone) Kubeflow Pipelines deployment.
* Kubeflow Pipelines as [part of a full Kubeflow deployment](#full-kubeflow).
* **Beta**: [AI Platform Pipelines](#marketplace).

## Choosing an installation option

1. Do you want to use other Kubeflow components in addition to Pipelines?

    If yes, choose the [full Kubeflow](#full-kubeflow).
1. Do you deploy on Google Cloud Platform (GCP)?
    1. Do you want to deploy with UI?

        If yes and you don't need to do complex configurations, choose the [AI Platform Pipelines](#marketplace). 
    1. Choose the [Kubeflow Pipelines Standalone](#standalone).
1. You deploy on other platforms.

    Please compare your platform specific [full Kubeflow](#full-kubeflow) with the
    [Kubeflow Pipelines Standalone](#standalone) before making your decision.

Please choose your installation option with caution, there's no supported path
to migrate data between different installation options. Please file a GitHub
issue if that's important to you.

<a id="standalone"></a>
## Kubeflow Pipelines Standalone

Use this option to deploy Kubeflow Pipelines to an on-premises or cloud
Kubernetes cluster, without the other components of Kubeflow.
To deploy Kubeflow Pipelines Standalone, you use kustomize manifests only.
This process makes it simpler to customize your deployment and to integrate
Kubeflow Pipelines into an existing Kubernetes cluster.

Installation guide
: [Kubeflow Pipelines Standalone deployment 
  guide](/docs/pipelines/installation/standalone-deployment/)

Interfaces
: 
  * Kubeflow Pipelines UI
  * Kubeflow Pipelines SDK
  * Kubeflow Pipelines API

Release Schedule
: Kubeflow Pipelines Standalone is available for every Kubeflow Pipelines release.
You will have access to latest features.

Upgrade Support (**Beta**)
: [Upgrading Kubeflow Pipelines Standalone](/docs/pipelines/installation/standalone-deployment/#upgrading-kubeflow-pipelines) introduces how to upgrade
in place.

Notes on specific features
: After deployment, your Kubernetes cluster contains Kubeflow Pipelines only. 
  It does not include the other Kubeflow components. 
  For example, to use a Jupyter Notebook, you must use a local notebook or a 
  hosted notebook in a cloud service such as the [AI Platform 
  Notebooks](https://cloud.google.com/ai-platform/notebooks/docs/).

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

Release Schedule
: The full Kubeflow is released quarterly. It has significant delay in receiving
Kubeflow Pipelines updates.

| Kubeflow Version       | Kubeflow Pipelines Version | Addition Comments                       |
|------------------------|----------------------------|-----------------------------------------|
| 0.7.0                  | 0.1.31                     |                                         |
| 1.0.0                  | 0.2.0                      |                                         |
| 1.0.2                  | 0.2.5                      |                                         |
| 1.1.0 (To be released) | 1.0.0*                     | Some platforms may still have KFP 0.2.5 |

Upgrade Support (**Alpha**)
: Reinstallation supported with [instructions](/docs/gke/pipelines/upgrade). Upgrade support is limited.

Notes on specific features
: After deployment, your Kubernetes cluster includes all the 
  [Kubeflow components](/docs/components/).
  For example, you can use the Jupyter notebook services 
  [deployed with Kubeflow](/docs/notebooks/) to create one or more notebook 
  servers in your Kubeflow cluster.

<a id="marketplace"></a>
## AI Platform Pipelines

{{% alert title="Beta release" color="warning" %}}
<p>AI Platform Pipelines is currently in <b>Beta</b> with 
  limited support. The Kubeflow team is interested in any feedback you may have,
  in particular on the usability of the feature.

  You can raise any issues or discussion items in the
  <a href="https://github.com/kubeflow/pipelines/issues">Kubeflow Pipelines 
  issue tracker</a>.</p>
{{% /alert %}}

Use this option to deploy Kubeflow Pipelines to Google Kubernetes Engine (GKE)
from GCP Marketplace. You can deploy Kubeflow Pipelines to an existing or new 
GKE cluster and manage your cluster within GCP.

Installation guide
: [Deploy Kubeflow Pipelines from Google Cloud
  Marketplace](https://github.com/kubeflow/pipelines/blob/master/manifests/gcp_marketplace/guide.md)

Interfaces
: 
  * GCP Console for managing the Kubeflow Pipelines cluster and other GCP 
    services.
  * Kubeflow Pipelines UI via the **Open Pipelines Dashboard** link in the 
    GCP Console
  * Kubeflow Pipelines SDK in Cloud Notebooks

Release Schedule
: AI Platform Pipelines is available for a chosen set of stable Kubeflow
Pipelines releases. You will receive updates slightly slower than Kubeflow
Pipelines Standalone.

Upgrade Support (**Alpha**)
: In place upgrade is not supported. Reinstall new version to upgrade is supported without official documentation. You can [delete a
AI Platform Pipelines application](https://cloud.google.com/ai-platform/pipelines/docs/getting-started#clean_up) **WITHOUT** selecting **Delete cluster** checkbox and
reinstall the newer version in the same cluster and same namespace. Persisted
artifact and database data are in GCP persistent disks and will be automatically
picked up during reinstallation.

Notes on specific features
: After deployment, your Kubernetes cluster contains Kubeflow Pipelines only. 
  It does not include the other Kubeflow components. 
  For example, to use a Jupyter Notebook, you can use [AI Platform 
  Notebooks](https://cloud.google.com/ai-platform/notebooks/docs/).
