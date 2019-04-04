+++
title = "Set up a GCP Project"
description = "Instructions for creating a GCP project for using Kubeflow"
weight = 1
+++

Before you start, follow these steps to set up your Google Cloud Platform 
(GCP) account and project:

1. Select or create a project on the 
  [GCP Console](https://console.cloud.google.com/cloud-resource-manager).

1. Make sure that billing is enabled for your project. See the guide to
  [modifying a project's billing 
  settings](https://cloud.google.com/billing/docs/how-to/modify-project).

1. Go to the following pages on the GCP Console and ensure that the 
  specified APIs are enabled on your GCP account:

  * [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com)
  * [GKE API](https://console.cloud.google.com/apis/library/container.googleapis.com)
  * [Identity and Access Management (IAM) API](https://console.cloud.google.com/apis/library/iam.googleapis.com)
  * [Deployment Manager API](https://console.cloud.google.com/apis/library/deploymentmanager.googleapis.com)

1. Check to see if you are eligible for the 
  [GCP Free Tier](https://cloud.google.com/free/docs/gcp-free-tier), which gives
  you free resources to try GCP services. The guide describes:

  * the GCP services which are always free, and
  * a 12-month trial period with $300 credit that you can use with any GCP 
    services.

1. Read the GCP guide to [resource quotas](https://cloud.google.com/compute/quotas)
  to understand the quotas on resource usage that Compute Engine enforces, and 
  to learn how to check your quota and how to request an increase in quota.

You do not need a running GKE cluster. The deployment process will create a
cluster for you.

## Next steps

* [Set up an OAuth credential](/docs/gke/deploy/oauth-setup) if you want to use [identity aware proxy(IAP)](https://cloud.google.com/iap/docs/)
* Deploy Kubeflow 
  * using the [CLI](/docs/gke/deploy/deploy-cli) 
  * using [UI](/docs/gke/deploy/deploy-ui)