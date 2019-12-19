+++
title = "KFServing"
description = "Model serving using KFServing"
weight = 2
+++

KFServing enables serverless inferencing on Kubernetes and provides performant, high abstraction interfaces for common machine learning (ML) frameworks like TensorFlow, XGBoost, scikit-learn, PyTorch, and ONNX to solve production model serving use cases.

You can use KFServing to do the following:

* Provide a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML models on arbitrary frameworks.

* Encapsulate the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU autoscaling, scale to zero, and canary rollouts to your ML deployments.

* Enable a simple, pluggable, and complete story for your production ML inference server by providing prediction, pre-processing, post-processing and explainability out of the box.

Our strong community contributions help KFServing to grow. We have a Technical Steering Committee driven by Google, IBM, Microsoft, Seldon, and Bloomberg. [Browse the KFServing GitHub repo](https://github.com/kubeflow/kfserving) to give us feedback!

## Install with Kubeflow
KFServing works with Kubeflow 0.7. Kustomize installation files are [located in the manifests repo](https://github.com/kubeflow/manifests/tree/master/kfserving).

<img src="../kfserving.png" alt="KFServing">

## Examples
* [TensorFlow](https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorflow)
* [PyTorch](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pytorch)
* [XGBoost](https://github.com/kubeflow/kfserving/tree/master/docs/samples/xgboost)
* [scikit-learn](https://github.com/kubeflow/kfserving/tree/master/docs/samples/sklearn)
* [ONNX](https://github.com/kubeflow/kfserving/tree/master/docs/samples/onnx)
* [Custom](https://github.com/kubeflow/kfserving/tree/master/docs/samples/custom)
* [TensorRT](https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorrt)
* [GPU](https://github.com/kubeflow/kfserving/tree/master/docs/samples/accelerators)
* [Autoscaling](https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling)
* [Pipelines](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pipelines)
* [Explainability](https://github.com/kubeflow/kfserving/tree/master/docs/samples/explanation/alibi)
* [Azure](https://github.com/kubeflow/kfserving/tree/master/docs/samples/azure)
* [Kafka](https://github.com/kubeflow/kfserving/tree/master/docs/samples/kafka)
* [S3](https://github.com/kubeflow/kfserving/tree/master/docs/samples/s3)
* [On-prem cluster](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pvc)

## Sample notebooks
* [SDK client](https://github.com/kubeflow/kfserving/blob/master/docs/samples/client/kfserving_sdk_sample.ipynb)
* [Transformer (pre/post processing)](https://github.com/kubeflow/kfserving/blob/master/docs/samples/transformer/image_transformer/kfserving_sdk_transformer.ipynb)
* [ONNX](https://github.com/kubeflow/kfserving/blob/master/docs/samples/onnx/mosaic-onnx.ipynb)

We frequently add examples to our [GitHub repo](https://github.com/kubeflow/kfserving/tree/master/docs/samples/).

## Learn more
* Join our [working group](https://groups.google.com/forum/#!forum/kfserving) for meeting invitations and discussion.
* [Read the docs](https://github.com/kubeflow/kfserving/tree/master/docs).
* [API docs](https://github.com/kubeflow/kfserving/tree/master/docs/apis/README.md).
* [Roadmap](https://github.com/kubeflow/kfserving/tree/master/ROADMAP.md).
* [KFServing 101 slides](https://drive.google.com/file/d/16oqz6dhY5BR0u74pi9mDThU97Np__AFb/view).

## Prerequisites
Knative Serving (v0.8.0 +) and Istio (v1.1.7+) should be available on your Kubernetes cluster.

Read more about [installing Knative on a Kubernetes cluster](https://github.com/kubeflow/kfserving/blob/master/docs/DEVELOPER_GUIDE.md#install-knative-on-a-kubernetes-cluster).

## KFServing installation using kubectl
```
TAG=v0.2.0
kubectl apply -f ./install/$TAG/kfserving.yaml
```

## Use
1. Install the SDK.
```
pip install kfserving
```
1. [Follow the example](https://github.com/kubeflow/kfserving/blob/master/docs/samples/client/kfserving_sdk_sample.ipynb) to use the KFServing SDK to create, patch, roll out, and delete a KFServing instance.

## Contribute
* [Developer guide](https://github.com/kubeflow/kfserving/tree/master/docs/DEVELOPER_GUIDE.md).
