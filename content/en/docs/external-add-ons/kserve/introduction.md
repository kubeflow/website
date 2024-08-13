+++
title = "Introduction"
description = "A brief introduction to KServe"
weight = 1
+++

{{% alert title="KFServing is now KServe" color="dark" %}}
KFServing was [renamed to KServe](https://kserve.github.io/website/0.11/blog/articles/2021-09-27-kfserving-transition/) in September 2021.

The KFServing GitHub repository has been transferred to an independent [KServe GitHub organization](https://github.com/kserve) under the stewardship of the _Kubeflow Serving Working Group_ leads.

For information about migrating from KFServing to KServe, see the [KServe migration guide](https://kserve.github.io/website/0.11/blog/articles/2021-09-27-kfserving-transition/).
{{% /alert %}}

## What is KServe?

[KServe](https://kserve.github.io/website/latest/) is an [open-source](https://github.com/kserve/kserve) project that enables serverless inferencing on Kubernetes.
KServe provides performant, high abstraction interfaces for common machine learning (ML) frameworks like TensorFlow, XGBoost, scikit-learn, PyTorch, and ONNX to solve production model serving use cases.

You can use KServe to do the following:
 
- Provide a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML models on arbitrary frameworks.
- Encapsulate the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU autoscaling, scale to zero, and canary rollouts to your ML deployments.
- Enable a simple, pluggable, and complete story for your production ML inference server by providing prediction, pre-processing, post-processing and explainability out of the box.

The following diagram shows the main components of KServe:

<img src="/docs/external-add-ons/kserve/pics/kserve.png" class="mt-3 mb-3 p-3 border border-info rounded"></img>

## How to use KServe with Kubeflow?

Kubeflow provides Kustomize installation files [in the `kubeflow/manifests` repo](https://github.com/kubeflow/manifests/tree/master/contrib/kserve) with each Kubeflow release.
However, these files may not be up-to-date with the latest KServe release.
See [KServe on Kubeflow with Istio-Dex](https://github.com/KServe/KServe/tree/master/docs/samples/istio-dex) from the `KServe/KServe` repository for the latest installation instructions.

Kubeflow also provides the [models web app](/docs/external-add-ons/kserve/webapp/) to manage your deployed model endpoints with a web interface.