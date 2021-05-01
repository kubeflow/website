+++
title = "Overview"
description = "Full fledged Kubeflow deployment on Google Cloud"
weight = 1
+++

This guide describes how to deploy Kubeflow and a series of Kubeflow components on GKE (Google Kubernetes Engine). 
If you want to use Kubeflow Pipelines only, redirect to [Kubeflow Pipelines](/docs/components/pipelines/) for installation
guide. Refer to [Installation Options for Kubeflow Pipelines](/docs/components/pipelines/installation/overview/)
for choosing an installation option.

### Features

Once you finish deployment, you will be able to:

1. manage a running Kubernetes cluster with multiple Kubeflow components installed.
1. get a [Cloud Endpoint](https://cloud.google.com/endpoints/docs) which is accessible via [IAP (Identity-aware Proxy)](https://cloud.google.com/iap).
1. enable [Multi-user feature](/docs/components/multi-tenancy/) for resource and access isolation.
1. take advantage of GKE's
  [Cluster Autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler) 
  to automatically resize the number of nodes in a node pool.
1. choose GPUs and [Cloud TPU](https://cloud.google.com/tpu/) to accelerate your workload.
1. use [Stackdriver](https://cloud.google.com/logging/docs/) to help debugging and troubleshooting.
1. access to many managed services offered by Google Cloud.

  <img src="/docs/images/gke/full-kf-home.png" 
    alt="Full Kubeflow Central Dashboard"
    class="mt-3 mb-3 border border-info rounded">

### Deployment Structure

As a high level overview, you need to create one management cluster which allows you to manage Google Cloud resources via [Config Connector](https://cloud.google.com/config-connector/docs/overview). Management cluster can create, manage and delete multiple Kubeflow clusters, while being independent from Kubeflow clusters' activities. Below is a simplified view of deployment structure.

  <img src="/docs/images/gke/full-deployment-structure.png" 
    alt="Full Kubeflow deployment structure"
    class="mt-3 mb-3 border border-info rounded">


### Deployment steps

Follow the steps below to set up Kubeflow environment on Google Cloud.

1.  [Set up Google Cloud project](/docs/distributions/gke/deploy/project-setup/).
1.  [Set up OAuth Client](/docs/distributions/gke/deploy/oauth-setup/).
1.  [Deploy Management Cluster](/docs/distributions/gke/deploy/management-setup/).
1.  [Deploy Kubeflow Cluster](/docs/distributions/gke/deploy/deploy-cli/).

If you encounter any issue during the deployment steps, refer to [Troubleshooting deployments on GKE](/docs/distributions/gke/troubleshooting-gke/) to find common issues
and debugging approaches. If this issue is new, file a bug to [kubeflow/gcp-blueprints](https://github.com/kubeflow/gcp-blueprints) for GKE related issue, or file a bug to the corresponding component in [Kubeflow on GitHub](https://github.com/kubeflow/) if the issue is component specific. 

## Next steps

* [Deploy Kubeflow](/docs/gke/deploy/deploy-ui/) if you haven't already done so.
* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/gke/gcp-e2e/) or the
  [GitHub issue summarization
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization).
