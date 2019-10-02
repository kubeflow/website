+++
title = "KFServing"
description = "Using KFServing for serving models"
weight = 2
+++

KFServing can be installed with Kubeflow v0.7, and KFServing kustomize installation files are [located in the manifests repo](https://github.com/kubeflow/manifests/tree/master/kfserving).

KFServing provides a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML Models on arbitrary frameworks. It aims to solve production model serving use cases by providing performant, high abstraction interfaces for common ML frameworks like Tensorflow, XGBoost, ScikitLearn, PyTorch, and ONNX. 

KFServing encapsulates the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU Autoscaling, Scale to Zero, and Canary Rollouts to your ML deployments. It enables a simple, pluggable, and complete story for production ML Inference Server by providing prediction, pre-processing, post-processing and explainability out of the box.

<img src="../kfserving.png" alt="KFServing">

## Examples
* [Tensorflow](https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorflow)
* [PyTorch](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pytorch)
* [XGBoost](https://github.com/kubeflow/kfserving/tree/master/docs/samples/xgboost)
* [Scikit-Learn](https://github.com/kubeflow/kfserving/tree/master/docs/samples/sklearn)
* [ONNX](https://github.com/kubeflow/kfserving/tree/master/docs/samples/onnx)
* [Custom](https://github.com/kubeflow/kfserving/tree/master/docs/samples/custom)
* [TensorRT](https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorrt)
* [GPU](https://github.com/kubeflow/kfserving/tree/master/docs/samples/accelerators)
* [Autoscaling](https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling)
* [Pipelines](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pipelines)
* [Explainability](https://github.com/kubeflow/kfserving/tree/master/docs/samples/explanation/alibi)

Please be on the lookout, we are constantly adding [more examples](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pipelines) about available features

## Learn More
* Join our [Working Group](https://groups.google.com/forum/#!forum/kfserving) for meeting invites and discussion.
* [Read the docs](https://github.com/kubeflow/kfserving/tree/master/docs).
* [API docs](https://github.com/kubeflow/kfserving/tree/master/docs/apis/README.md).
* [Roadmap](https://github.com/kubeflow/kfserving/tree/master/ROADMAP.md).
* [KFServing 101 slides](https://drive.google.com/file/d/16oqz6dhY5BR0u74pi9mDThU97Np__AFb/view).

## Prerequisits
KNative Serving (v0.8.0 +) and Istio (v1.1.7+) should be available on Kubernetes Cluster.

If you want to install Knative, you may find this [installation instruction](https://github.com/kubeflow/kfserving/blob/master/docs/DEVELOPER_GUIDE.md#install-knative-on-a-kubernetes-cluster) useful.

## KFServing installation using kubectl
```
TAG=v0.1.0
kubectl apply -f ./install/$TAG/kfserving.yaml
```

## Use
* Install the SDK
```
pip install kfserving
```
* Follow the [example here](https://github.com/kubeflow/kfserving/blob/master/docs/samples/client/kfserving_sdk_sample.ipynb) to use the KFServing SDK to create, patch, and delete a KFService instance.

## Contribute
* [Developer guide](https://github.com/kubeflow/kfserving/tree/master/docs/DEVELOPER_GUIDE.md).

