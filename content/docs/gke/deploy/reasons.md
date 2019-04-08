+++
title = "Reasons to Use Kubeflow on GCP"
description = "Reasons to deploy Kubeflow on GCP"
weight = 8
+++

Running Kubeflow on [GKE](https://cloud.google.com/kubernetes-engine/docs)
brings the following advantages:

  * You use
    [Deployment Manager](https://cloud.google.com/deployment-manager/docs/) to
    declaratively manage all non-Kubernetes resources (including the GKE 
    cluster). Deployment Manager is easy to customize for your particular use
    case.
  * You can take advantage of GKE autoscaling to scale your cluster horizontally 
    and vertically to meet the demands of machine learning (ML) workloads with 
    large resource requirements.
  * [Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/) 
    makes it easy to securely connect to Jupyter and other
    web apps running as part of Kubeflow.
  * Basic auth service supports simple username/password access to your 
    Kubeflow. It is an alternative to Cloud IAP service:
    * We recommend IAP for production and enterprise workloads.
    * Consider basic auth only when trying to test out Kubeflow and use it 
      without sensitive data.
  * [Stackdriver](https://cloud.google.com/logging/docs/) makes it easy to 
    persist logs to aid in debugging and troubleshooting
  * You can use GPUs and [TPUs](https://cloud.google.com/tpu/) to accelerate 
    your workload.
