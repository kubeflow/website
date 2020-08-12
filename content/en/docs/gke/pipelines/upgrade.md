+++
title = "Upgrading"
description = "How to upgrade your Kubeflow Pipelines deployment on Google Cloud"
weight = 50
                    
+++

## Before you begin

There are various options on how to install Kubeflow Pipelines in the [Installation Options for Kubeflow Pipelines](/docs/pipelines/installation/overview/) guide. Be aware that upgrade support and instructions will vary depending on the method you used to install Kubeflow Pipelines.

### Upgrade-related feature matrix

| Installation \ Features                 | In-place upgrade | Reinstallation on the same cluster | Reinstallation on a different cluster | User customizations across upgrades (via [Kustomize](https://kustomize.io/)) |
|-----------------------------------------|------------------|------------------------------------|---------------------------------------|------------------------------------------------------------------------------------|
| Standalone                              | ✅                | ⚠️ Data is deleted by default.      |                                       | ✅                                                                                  |
| [Standalone (managed storage)](https://github.com/kubeflow/pipelines/tree/master/manifests/kustomize/env/gcp)            | ✅                | ✅                                  | ✅                                     | ✅                                                                                  |
| full Kubeflow (>= v1.1)                   | ✅                | ✅                                  | Needs documentation                   | ✅                                                                                  |
| full Kubeflow (< v1.1)                    |                  | ✅                                  | ✅                                     |                                                                                    |
| AI Platform Pipelines                   |                  | ✅                                  |                                       |                                                                                    |
| AI Platform Pipelines (managed storage) |                  | ✅                                  | ✅                                     |                                                                                    |

Notes:

* When you deploy Kubeflow Pipelines with managed storage on Google Cloud, you pipeline's metadata and artifacts are stored in [Cloud Storage](https://cloud.google.com/storage/docs) and [Cloud SQL](https://cloud.google.com/sql/docs). Using managed storage makes it easier to manage, back up, and restore Kubeflow Pipelines data.

## Kubeflow Pipelines Standalone

Upgrade Support for Kubeflow Pipelines Standalone is in **Beta**.

[Upgrading Kubeflow Pipelines Standalone](/docs/pipelines/installation/standalone-deployment/#upgrading-kubeflow-pipelines) introduces how to upgrade in-place.

## Full Kubeflow

On Google Cloud, the full Kubeflow deployment follows [the blueprint pattern](https://googlecontainertools.github.io/kpt/guides/producer/blueprint/) starting from Kubeflow 1.1.

The blueprint pattern enables you to upgrade the full Kubeflow in-place while keeping user customizations — refer to the [Update Kubeflow on Google Cloud](docs/gke/deploy/deploy-cli/#update-kubeflow) documentation for instructions.

However, there's no current support to upgrade from Kubeflow 1.0 or earlier to Kubeflow 1.1 while keeping Kubeflow Pipelines data. This may change in the future, so provide your feedback in [kubeflow/pipelines#4346](https://github.com/kubeflow/pipelines/issues/4346) on GitHub.

## AI Platform Pipelines

Upgrade Support for AI Platform Pipelines is in **Alpha**.

{{% alert title="Warning" color="warning" %}}
Although Kubeflow Pipelines Standalone deployments also show up in AI Platform Pipelines dashboard, DO NOT follow instructions below. Because data is deleted by default when a Kubeflow Pipelines Standalone deployment is deleted.
{{% /alert %}}

Below are the steps that describe how to upgrade your AI Platform Pipelines instance while keeping existing data:

### For instances _without_ managed storage:

1. [Delete your AI Platform Pipelines instance](https://cloud.google.com/ai-platform/pipelines/docs/getting-started#clean_up) **WITHOUT** selecting **Delete cluster**. The persisted artifacts and database data are stored in persistent volumes in the cluster. They are kept by default when you do not delete the cluster.
1. [Reinstall Kubeflow Pipelines from the Google Cloud Marketplace](https://console.cloud.google.com/marketplace/details/google-cloud-ai-platform/kubeflow-pipelines) using the same **Google Kubernetes Engine cluster**, **namespace**, and **application name**. Persisted data will be automatically picked up during reinstallation.

### For instances _with_ managed storage:

1. [Delete your AI Platform Pipelines instance](https://cloud.google.com/ai-platform/pipelines/docs/getting-started#clean_up).
1. If you are upgrading from Kubeflow Pipelines 0.5.1, note that the Cloud Storage bucket is a required starting from 1.0.0. Previously deployed instances should be using a bucket named like "<cloudsql instance connection name>-<database prefix or instance name>". Browse [your Cloud Storage buckets](https://console.cloud.google.com/storage/browser) to find your existing bucket name and provide it in the next step.
1. [Reinstall Kubeflow Pipelines from the Google Cloud Marketplace](https://console.cloud.google.com/marketplace/details/google-cloud-ai-platform/kubeflow-pipelines) using the same application name and managed storage options as before. You can freely install it in any cluster and namespace (not necessarily the same as before), because persisted artifacts and database data are stored in managed storages (Cloud Storage and Cloud SQL), and will be automatically picked up during reinstallation.
