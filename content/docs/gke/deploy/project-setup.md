+++
title = "Set up a GCP Project"
description = "Creating a Google Cloud Platform (GCP) project for your Kubeflow deployment"
weight = 1
+++

Follow these steps to set up your GCP project:

1. Select or create a project on the 
  [GCP Console](https://console.cloud.google.com/cloud-resource-manager).


1. Make sure that you have the 
  [owner role](https://cloud.google.com/iam/docs/understanding-roles#primitive_role_definitions)
  for the project.
  The deployment process creates various service accounts with
  appropriate roles in order to enable seamless integration with
  GCP services. This process requires that you have the 
  owner role for the project in order to deploy Kubeflow.

1. Make sure that billing is enabled for your project. See the guide to
  [modifying a project's billing 
  settings](https://cloud.google.com/billing/docs/how-to/modify-project).

1. Go to the following pages on the GCP Console and ensure that the 
  specified APIs are enabled:

   * [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com)
   * [Kubernetes Engine API](https://console.cloud.google.com/apis/library/container.googleapis.com)
   * [Identity and Access Management (IAM) API](https://console.cloud.google.com/apis/library/iam.googleapis.com)
   * [Deployment Manager API](https://console.cloud.google.com/apis/library/deploymentmanager.googleapis.com)
   * [Cloud Resource Manager API](https://console.developers.google.com/apis/library/cloudresourcemanager.googleapis.com)
   * [Cloud Filestore API](https://console.developers.google.com/apis/library/file.googleapis.com)
   * [AI Platform Training & Prediction API](https://console.developers.google.com/apis/library/ml.googleapis.com)

1. If you are using the 
  [GCP Free Tier](https://cloud.google.com/free/docs/gcp-free-tier) or the
  12-month trial period with $300 credit, note that you can't run the default
  GCP installation of Kubeflow, because the free tier does not offer enough
  resources. You need to 
  [upgrade to a paid account](https://cloud.google.com/free/docs/gcp-free-tier#how-to-upgrade).
  
    For more information, see the following issues: 

    * [kubeflow/website #1065](https://github.com/kubeflow/website/issues/1065)
      reports the problem.
    * [kubeflow/kubeflow #3936](https://github.com/kubeflow/kubeflow/issues/3936)
      requests a Kubeflow configuration to work with a free trial project.

1. Read the GCP guide to [resource quotas](https://cloud.google.com/compute/quotas)
  to understand the quotas on resource usage that Compute Engine enforces, and 
  to learn how to check your quota and how to request an increase in quota.

You do not need a running GKE cluster. The deployment process creates a
cluster for you.

## Next steps

* [Set up an OAuth credential](/docs/gke/deploy/oauth-setup) if you want to use 
  [Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/docs/).
  Cloud IAP is recommended for production deployments or deployments with access 
  to sensitive data. You can skip this step if you want to test Kubeflow
  in a non-production environment.
* Choose one of the following ways to deploy Kubeflow:

  * [Using the UI](/docs/gke/deploy/deploy-ui). This option provides a simple
    way to deploy Kubeflow.
  * [Using the CLI](/docs/gke/deploy/deploy-cli). This option provides more
    control over the deployment process.
