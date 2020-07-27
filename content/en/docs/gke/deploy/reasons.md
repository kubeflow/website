+++
title = "Features of Kubeflow on GCP"
description = "Reasons to use Kubeflow on Google Cloud Platform (GCP)"
weight = 10
+++

Running Kubeflow on GCP has the following benefits:

  * The
    [Cloud Native Resource Manager](https://cloud.google.com/config-connector/docs) to
    declaratively manage all non-Kubernetes resources (including the GKE 
    cluster).
  * You can take advantage of GKE's
    [Cluster Autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler) 
    to automatically resize the number of nodes in a node pool in your cluster depending on the workload demands.
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