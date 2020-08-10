+++
title = "Upgrading and Reinstalling"
description = "How to upgrade or reinstall your Kubeflow Pipelines deployment on Google Cloud"
weight = 50
                    
+++

## Before you begin

[Installation Options for Kubeflow Pipelines](/docs/pipelines/installation/overview/) introduces options to install Kubeflow Pipelines. Be aware that upgrade support and instructions will vary depending on the option you installed Kubeflow Pipelines with.

### Upgrade related Feature Matrix

| Installation \ Features                 | In-place Upgrade | Reinstallation on the same cluster | Reinstallation on a different cluster | User Customizations across Upgrades (via [Kustomize](https://kustomize.io/)) |
|-----------------------------------------|------------------|------------------------------------|---------------------------------------|------------------------------------------------------------------------------------|
| Standalone                              | ✅                | ⚠️ Data is deleted by default.      |                                       | ✅                                                                                  |
| [Standalone (managed storage)](https://github.com/kubeflow/pipelines/tree/master/manifests/kustomize/env/gcp)            | ✅                | ✅                                  | ✅                                     | ✅                                                                                  |
| full Kubeflow (>=1.1)                   | ✅                | ✅                                  | Needs documentation                   | ✅                                                                                  |
| full Kubeflow (<1.1)                    |                  | ✅                                  | ✅                                     |                                                                                    |
| AI Platform Pipelines                   |                  | ✅                                  |                                       |                                                                                    |
| AI Platform Pipelines (managed storage) |                  | ✅                                  | ✅                                     |                                                                                    |

Notes:
* Managed storage means storing all the data in managed storage services on Google Cloud. A Google Cloud Storage (GCS) bucket and a Cloud SQL instance is required. Using managed storages make it easy to manage, back up, and restore Kubeflow Pipelines data.

## Kubeflow Pipelines Standalone

Upgrade Support for Kubeflow Pipelines standalone is **Beta**.

[Upgrading Kubeflow Pipelines Standalone](/docs/pipelines/installation/standalone-deployment/#upgrading-kubeflow-pipelines) introduces how to upgrade in place.

## Full Kubeflow

On Google Cloud, the full Kubeflow follows [the blueprint pattern](https://googlecontainertools.github.io/kpt/guides/producer/blueprint/) starting from Kubeflow 1.1.

The blueprint pattern makes it easy to upgrade the full Kubeflow in-place, refer to [Update Kubeflow on Google Cloud](docs/gke/deploy/deploy-cli/#update-kubeflow) documentation for instructions.

However, there's no current support to upgrade from Kubeflow 1.0 or earlier to Kubeflow 1.1 whiling keeping Kubeflow Pipelines data. Provide your feedback in [kubeflow/pipelines#4346](https://github.com/kubeflow/pipelines/issues/4346) if it's important to you.

## AI Platform Pipelines

Upgrade Support for AI Platform Pipelines is **Alpha**.

To upgrade your AI Platform Pipelines instance while keeping existing data:

### For instances **without** managed storage:

1. [Delete your AI Platform Pipelines instance](https://cloud.google.com/ai-platform/pipelines/docs/getting-started#clean_up) **without** selecting **Delete cluster**. The persisted artifacts and database data are stored in persistent volumes in the cluster. They are kept by default when you do not delete the cluster.
1. [Reinstall Kubeflow Pipelines from the Google Cloud Marketplace](https://console.cloud.google.com/marketplace/details/google-cloud-ai-platform/kubeflow-pipelines) using the same **Google Kubernetes Engine cluster**, **namespace**, and **application name**. Persisted data will be automatically picked up during reinstallation.

### For instances with managed storage:

1. [Delete your AI Platform Pipelines instance](https://cloud.google.com/ai-platform/pipelines/docs/getting-started#clean_up).
1. If upgrading from 0.5.1, note the Google Cloud Storage (GCS) bucket is a required starting from 1.0.0. Previously deployed instances should be using a bucket named like "<cloudsql instance connection name>-<database prefix or instance name>". Browse [your GCS buckets](https://console.cloud.google.com/storage/browser) to find your existing bucket name and provide it in the next step.
1. [Reinstall Kubeflow Pipelines from the Google Cloud Marketplace](https://console.cloud.google.com/marketplace/details/google-cloud-ai-platform/kubeflow-pipelines) using the same application name and managed storage options as before. You can freely install it in any cluster and namespace (not necessarily the same as before), because persisted artifacts and database data are stored in managed storages (Google Cloud Storage and Cloud SQL), and will be automatically picked up during reinstallation.
