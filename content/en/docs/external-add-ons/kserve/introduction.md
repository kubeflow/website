+++
title = "Introduction"
description = "A brief introduction to KServe"
weight = 1
+++

{{% alert title="KFServing is now KServe" color="info" %}}
_KFServing_ was renamed to _KServe_ in September 2021, when the `kubeflow/kfserving` GitHub repository was transferred to the independent [KServe GitHub organization](https://github.com/kserve).

To learn about migrating from KFServing to KServe, see the [migration guide](https://kserve.github.io/website/0.13/admin/migration/) and the [blog post](https://blog.kubeflow.org/release/official/2021/09/27/kfserving-transition.html).
{{% /alert %}}

## What is KServe?

[KServe](https://kserve.github.io/website/latest/) is an [open-source](https://github.com/kserve/kserve) project that enables serverless inferencing on Kubernetes.
KServe provides performant, high abstraction interfaces for common machine learning (ML) frameworks like TensorFlow, XGBoost, scikit-learn, PyTorch, and ONNX to solve production model serving use cases.

The following diagram shows the architecture of KServe:

<img src="/docs/external-add-ons/kserve/pics/kserve-architecture.png"
     alt="KServe architecture diagram"
     class="p-2">
</img>

KServe provides the following functionality:
 
- Provide a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML models on arbitrary frameworks.
- Encapsulate the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU autoscaling, scale to zero, and canary rollouts to your ML deployments.
- Enable a simple, pluggable, and complete story for your production ML inference server by providing prediction, pre-processing, post-processing and explainability out of the box.

## How to use KServe with Kubeflow?

Kubeflow provides Kustomize installation files [in the `kubeflow/manifests` repo](https://github.com/kubeflow/manifests/tree/master/contrib/kserve) with each Kubeflow release.
However, these files may not be up-to-date with the latest KServe release.
See [KServe on Kubeflow with Istio-Dex](https://github.com/KServe/KServe/tree/master/docs/samples/istio-dex) from the `KServe/KServe` repository for the latest installation instructions.

Kubeflow also provides the [models web app](/docs/external-add-ons/kserve/webapp/) to manage your deployed model endpoints with a web interface.