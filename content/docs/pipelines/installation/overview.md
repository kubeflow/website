+++
title = "Installation Options for Kubeflow Pipelines"
description = "Overview of the ways to deploy Kubeflow Pipelines"
weight = 10
+++

Kubeflow Pipelines offers a few installation options.
This page describes the options and the features available
with each option:

* Kubeflow Pipelines as [part of a full Kubeflow deployment](#full-kubeflow).
* A [standalone](#standalone) Kubeflow Pipelines deployment.
* **Alpha**: Kubeflow Pipelines deployed [from the
  Google Cloud Platform (GCP) Marketplace](#marketplace).

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

<a id="standalone"></a>
## Kubeflow Pipelines Standalone

Use this option to deploy Kubeflow Pipelines to your local machine, on-premises,
or to a cloud, without the other components of Kubeflow.

Installation guide
: [Kubeflow Pipelines Standalone deployment 
  guide](/docs/pipelines/standalone-deployment-gcp/)

Interfaces
: 
  * Kubeflow Pipelines UI
  * Kubeflow Pipelines SDK
  * Kubeflow Pipelines API


Notes on specific features
: After deployment, your Kubernetes cluster contains Kubeflow Pipelines only. 
  It does not include the other Kubeflow components. 
  For example, to use a Jupyter Notebook, you must use a separate notebook 
  server.


<a id="marketplace"></a>
## GCP Marketplace

{{% alert title="Alpha release" color="warning" %}}
<p>Kubeflow Pipelines on GCP Marketplace is currently in <b>Alpha</b> with 
  limited support. The Kubeflow team is interested in any feedback you may have,
  in particular on the usability of the feature. Please raise any issues
  or discussion items in the
  <a href="https://github.com/kubeflow/pipelines/issues">Kubeflow Pipelines 
  issue tracker</a>.</p>
{{% /alert %}}

Use this option to deploy Kubeflow Pipelines to Google Kubernetes Engine (GKE)
(existing or new cluster) and to manage your cluster within GCP.

Installation guide
: [Marketplace deployment 
  guide](https://github.com/kubeflow/pipelines/blob/master/manifests/gcp_marketplace/guide.md)

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
