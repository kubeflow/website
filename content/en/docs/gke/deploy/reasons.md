+++
title = "Features of Kubeflow on GCP"
description = "Reasons to use Kubeflow on Google Cloud Platform (GCP)"
weight = 10
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


Running Kubeflow on GCP brings you the following features:

  * You use
    [Deployment Manager](https://cloud.google.com/deployment-manager/docs/) to
    declaratively manage all non-Kubernetes resources (including the GKE 
    cluster). Deployment Manager is easy to customize for your particular use
    case.
  * You can take advantage of 
    [GKE](https://cloud.google.com/kubernetes-engine/docs) autoscaling to scale 
    your cluster horizontally 
    and vertically to meet the demands of machine learning (ML) workloads with 
    large resource requirements.
  * [Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/) 
    makes it easy to securely connect to Jupyter and other
    web apps running as part of Kubeflow.
  * [Stackdriver](https://cloud.google.com/logging/docs/) provides 
    persistent logs to aid in debugging and troubleshooting.
  * You can use GPUs and [Cloud TPU](https://cloud.google.com/tpu/) to 
    accelerate your workload.

## Next steps

* [Deploy Kubeflow](/docs/gke/deploy/deploy-ui/) if you haven't already done so.
* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/gke/gcp-e2e/) or the
  [GitHub issue summarization 
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization).