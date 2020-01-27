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
* **Alpha**: [GCP Hosted ML Pipelines](#marketplace).

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

Notes on specific features
: After deployment, your Kubernetes cluster includes all the 
  [Kubeflow components](/docs/components/).
  For example, you can use the Jupyter notebook services 
  [deployed with Kubeflow](/docs/notebooks/) to create one or more notebook 
  servers in your Kubeflow cluster.

<a id="marketplace"></a>
## GCP Hosted ML Pipelines

{{% alert title="Alpha release" color="warning" %}}
<p>GCP Hosted ML Pipelines is currently in <b>Alpha</b> with 
  limited support. The Kubeflow team is interested in any feedback you may have,
  in particular on the usability of the feature. To get access to the Alpha
  release, email 
  <a href="mailto:kfp-mkp-alpha-feedback@googlegroups.com">kfp-mkp-alpha-feedback@googlegroups.com</a>.
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


Notes on specific features
: After deployment, your Kubernetes cluster contains Kubeflow Pipelines only. 
  It does not include the other Kubeflow components. 
  For example, to use a Jupyter Notebook, you can use [AI Platform 
  Notebooks](https://cloud.google.com/ai-platform/notebooks/docs/).
