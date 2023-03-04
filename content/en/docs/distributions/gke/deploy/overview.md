+++
title = "Overview"
description = "Full fledged Kubeflow deployment on Google Cloud"
weight = 1
+++

This guide describes how to deploy Kubeflow and a series of Kubeflow components on GKE (Google Kubernetes Engine).
If you want to use Kubeflow Pipelines only, refer to [Installation Options for Kubeflow Pipelines](/docs/components/pipelines/installation/overview/)
for choosing an installation option.

## Deployment Structure

As a high level overview, you need to create one Management cluster which allows you to manage Google Cloud resources via [Config Connector](https://cloud.google.com/config-connector/docs/overview). Management cluster can create, manage and delete multiple Kubeflow clusters, while being independent from Kubeflow clusters' activities. Below is a simplified view of deployment structure. Note that Management cluster can live in a different Google Cloud project from Kubeflow clusters, admin should assign owner permission to Management cluster's service account. It will be explained in detail during Deployment steps.

<img src="/docs/images/gke/full-deployment-structure.png" 
    alt="Full Kubeflow deployment structure"
    class="mt-3 mb-3 border border-info rounded">

## Deployment steps

Follow the steps below to set up Kubeflow environment on Google Cloud. Some of these steps are one-time only, for example: OAuth Client can be shared by multiple Kubeflow clusters in the same Google Cloud project.

1.  [Set up Google Cloud project](/docs/distributions/gke/deploy/project-setup/).
1.  [Set up OAuth Client](/docs/distributions/gke/deploy/oauth-setup/).
1.  [Deploy Management Cluster](/docs/distributions/gke/deploy/management-setup/).
1.  [Deploy Kubeflow Cluster](/docs/distributions/gke/deploy/deploy-cli/).

If you encounter any issue during the deployment steps, refer to [Troubleshooting deployments on GKE](/docs/distributions/gke/troubleshooting-gke/) to find common issues
and debugging approaches. If this issue is new, file a bug to [GoogleCloudPlatform/kubeflow-distribution](https://github.com/GoogleCloudPlatform/kubeflow-distribution) for GKE related issue, or file a bug to the corresponding component in [Kubeflow on GitHub](https://github.com/kubeflow/) if the issue is component specific.

## Features

Once you finish deployment, you will be able to:

1. manage a running Kubernetes cluster with multiple Kubeflow components installed.
1. get a [Cloud Endpoint](https://cloud.google.com/endpoints/docs) which is accessible via [IAP (Identity-aware Proxy)](https://cloud.google.com/iap).
1. enable [Multi-user feature](/docs/components/multi-tenancy/) for resource and access isolation.
1. take advantage of GKE's
   [Cluster Autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler)
   to automatically resize the number of nodes in a node pool.
1. choose GPUs and [Cloud TPU](https://cloud.google.com/tpu/) to accelerate your workload.
1. use [Cloud Logging](https://cloud.google.com/logging/docs/) to help debugging and troubleshooting.
1. access to many managed services offered by Google Cloud.

<img src="/docs/images/gke/full-kf-home.png" 
    alt="Full Kubeflow Central Dashboard"
    class="mt-3 mb-3 border border-info rounded">

## Next steps

- Repeat [Deploy Kubeflow Cluster](/docs/distributions/gke/deploy/deploy-cli/) if you want to deploy multiple clusters.
- Run a full ML workflow on Kubeflow, using the [end-to-end MNIST tutorial](https://github.com/kubeflow/pipelines/blob/e42d9d2609369b96973c821dca11fe5b2565e705/samples/contrib/kubeflow-e2e-mnist/kubeflow-e2e-mnist.ipynb).
