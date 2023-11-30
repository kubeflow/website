+++
title = "Introduction"
description = "A brief introduction to KServe"
weight = 1
 
+++

## What is KServe?

KServe enables serverless inferencing on Kubernetes and provides performant, high abstraction interfaces for common machine learning (ML) frameworks like TensorFlow, XGBoost, scikit-learn, PyTorch, and ONNX to solve production model serving use cases.

You can use KServe to do the following:
 
- Provide a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML models on arbitrary frameworks.
- Encapsulate the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU autoscaling, scale to zero, and canary rollouts to your ML deployments.
- Enable a simple, pluggable, and complete story for your production ML inference server by providing prediction, pre-processing, post-processing and explainability out of the box.

### KFServing is now KServe

KFServing was [renamed to KServe](https://kserve.github.io/website/0.11/blog/articles/2021-09-27-kfserving-transition/) in September 2021.

The KFServing GitHub repository has been transferred to an independent [KServe GitHub organization](https://github.com/kserve) under the stewardship of the Kubeflow Serving Working Group leads.

For information about migrating from KFServing to KServe, see the [KServe migration guide](https://kserve.github.io/website/0.11/blog/articles/2021-09-27-kfserving-transition/).

### Architecture

<img src="/docs/external-add-ons/kserve/pics/kserve.png" class="mt-3 mb-3 p-3 border border-info rounded"></img>

## Installation

### Install from Kubeflow
 
Kubeflow provides Kustomize installation files [in the `kubeflow/manifests` repo](https://github.com/kubeflow/manifests/tree/master/contrib/kserve) with each Kubeflow release.
However, these files may not be up to date with the latest KServe release.

You may also review the [examples of running KServe on Istio & Dex](https://github.com/KServe/KServe/tree/master/docs/samples/istio-dex) from the `KServe/KServe` repository, as this is related to the Kubeflow installation.

### Install from KServe

You can install KServe without Kubeflow by following the [KServe getting started guide](https://kserve.github.io/website/0.11/get_started/).

## Resources

- [Website](https://kserve.github.io/website/)
- [Github](https://github.com/kserve/kserve/)
- [Slack(#kubeflow-kfserving)](https://kubeflow.slack.com/join/shared_invite/zt-n73pfj05-l206djXlXk5qdQKs4o1Zkg#/)

### Further reading

- [Kubeflow 101: What is KFserving?](https://www.youtube.com/watch?v=lj_X2ND2BBI) 
- [KFServing 101 slides](https://drive.google.com/file/d/16oqz6dhY5BR0u74pi9mDThU97Np__AFb/view).
- [Kubecon Introducing KFServing](https://kccncna19.sched.com/event/UaZo/introducing-kfserving-serverless-model-serving-on-kubernetes-ellis-bigelow-google-dan-sun-bloomberg).
- [Serving Machine Learning Models at Scale Using KServe - Yuzhui Liu, Bloomberg](https://www.youtube.com/watch?v=sE_A54T2n6k)
- [KServe (Kubeflow KFServing) Live Coding Session](https://www.youtube.com/watch?v=0YmM_h7PvpI)
- [TFiR: Let’s Talk About IBM’s ModelMesh, KServe And Other Open Source AI/ML Technologies](https://www.youtube.com/watch?v=0H-HvK8zIUI) | Animesh Singh |
- [KubeCon 2021: Serving Machine Learning Models at Scale Using KServe](https://www.youtube.com/watch?v=la3Y0lXuKRM) | Animesh Singh |
