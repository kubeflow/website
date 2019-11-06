+++
title = "KFServing"
description = "Using KFServing for serving models"
weight = 2
+++

KFServing enables Serverless Inferencing on Kubernetes and provides performant, high abstraction interfaces for common ML frameworks like Tensorflow, XGBoost, ScikitLearn, PyTorch, and ONNX to solve production model serving use cases

KFServing:

* Provides a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML models on arbitrary frameworks.

* Encapsulates the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU autoscaling, scale to zero, and canary rollouts to your ML deployments

* Enables a simple, pluggable, and complete story for your production ML inference server by providing prediction, pre-processing, post-processing and explainability out of the box.

* Is evolving with strong community contributions, and has a Technical Steering Committee driven by Google, IBM, Microsoft, Seldon, and Bloomberg

Please browse through the [KFServing GitHub repo](https://github.com/kubeflow/kfserving) and give us feedback! 

## Installation with Kubeflow v0.7 ##
KFServing can be installed with Kubeflow v0.7, and KFServing kustomize installation files are [located in the manifests repo](https://github.com/kubeflow/manifests/tree/master/kfserving).

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

## Sample Notebooks
* [SDK Client](https://github.com/kubeflow/kfserving/blob/master/docs/samples/client/kfserving_sdk_sample.ipynb)
* [Transformer (Pre/Post Processing)](https://github.com/kubeflow/kfserving/blob/master/docs/samples/transformer/image_transformer/kfserving_sdk_transformer.ipynb)
* [ONNX](https://github.com/kubeflow/kfserving/blob/master/docs/samples/onnx/mosaic-onnx.ipynb)

Please be on the lookout, we are constantly adding [more examples](https://github.com/kubeflow/kfserving/tree/master/docs/samples/) about available features

## Learn More
* Join our [Working Group](https://groups.google.com/forum/#!forum/kfserving) for meeting invites and discussion.
* [Read the docs](https://github.com/kubeflow/kfserving/tree/master/docs).
* [API docs](https://github.com/kubeflow/kfserving/tree/master/docs/apis/README.md).
* [Roadmap](https://github.com/kubeflow/kfserving/tree/master/ROADMAP.md).
* [KFServing 101 slides](https://drive.google.com/file/d/16oqz6dhY5BR0u74pi9mDThU97Np__AFb/view).

## Prerequisites
KNative Serving (v0.8.0 +) and Istio (v1.1.7+) should be available on Kubernetes Cluster.

If you want to install Knative, you may find this [installation instruction](https://github.com/kubeflow/kfserving/blob/master/docs/DEVELOPER_GUIDE.md#install-knative-on-a-kubernetes-cluster) useful.

## KFServing installation using kubectl
```
TAG=v0.2.0
kubectl apply -f ./install/$TAG/kfserving.yaml
```

## Use
* Install the SDK
```
pip install kfserving
```
* Follow the [example](https://github.com/kubeflow/kfserving/blob/master/docs/samples/client/kfserving_sdk_sample.ipynb) to use the KFServing SDK to create, patch, rollout and delete a KFService instance.

## Contribute
* [Developer guide](https://github.com/kubeflow/kfserving/tree/master/docs/DEVELOPER_GUIDE.md).

