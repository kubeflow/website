+++
title = "KFServing"
description = "Using KFServing for serving models"
weight = 2
+++

KFServing can be installed with Kubeflow v0.7, and KFServing kustomize installation files are [located in the manifests repo](https://github.com/kubeflow/manifests/tree/master/kfserving).

KFServing provides a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML Models on arbitrary frameworks. It aims to solve 80% of model serving use cases by providing performant, high abstraction interfaces for common ML frameworks like Tensorflow, XGBoost, ScikitLearn, PyTorch, and ONNX. 

KFServing encapsulates the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU Autoscaling, Scale to Zero, and Canary Rollouts to your ML deployments. It enables a simple, pluggable, and complete story for production ML Inference Server by providing prediction, pre-processing, post-processing and explainability out of the box.

<img src=".https://github.com/kubeflow/kfserving/tree/master/docs/diagrams/kfserving.png" alt="KFServing" class="mt-3 mb-3 border border-info rounded">

## Learn More
* Join our [Working Group](https://groups.google.com/forum/#!forum/kfserving) for meeting invites and discussion.
* [Read the Docs](https://github.com/kubeflow/kfserving/tree/master/docs).
* [Examples](https://github.com/kubeflow/kfserving/tree/master/docs/samples).
* [API Docs](https://github.com/kubeflow/kfserving/tree/master/docs/apis/README.md)
* [Roadmap](https://github.com/kubeflow/kfserving/tree/master/ROADMAP.md).
* [KFServing 101 Slides](https://drive.google.com/file/d/16oqz6dhY5BR0u74pi9mDThU97Np__AFb/view).

## Prerequisits
KNative Serving and Istio should be available on Kubernetes Cluster.
*  Istio Version: v1.1.7 + 
*  Knative Version: v0.8.0 +

If you want to install KFServing individually outside of Kubeflow, you may find this [installation instruction](https://github.com/kubeflow/kfserving/blob/master/docs/DEVELOPER_GUIDE.md#install-knative-on-a-kubernetes-cluster) useful.

## KFServing independent install
```
TAG=v0.1.0
kubectl apply -f ./install/$TAG/kfserving.yaml
```

## Use
* Install the SDK
```
pip install kfserving
```
* Follow the [example here](docs/samples/client/kfserving_sdk_sample.ipynb) to use the KFServing SDK to create, patch, and delete a KFService instance.

## Contribute
* [Developer Guide](https://github.com/kubeflow/kfserving/tree/master/docs/DEVELOPER_GUIDE.md).

