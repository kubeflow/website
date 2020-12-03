+++
title = "KFServing"
description = "Model serving using KFServing"
weight = 2

+++

{{% beta-status
  feedbacklink="https://github.com/kubeflow/kfserving/issues" %}}

KFServing enables serverless inferencing on Kubernetes and provides performant, high abstraction interfaces for common machine learning (ML) frameworks like TensorFlow, XGBoost, scikit-learn, PyTorch, and ONNX to solve production model serving use cases.

You can use KFServing to do the following:

* Provide a Kubernetes [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for serving ML models on arbitrary frameworks.

* Encapsulate the complexity of autoscaling, networking, health checking, and server configuration to bring cutting edge serving features like GPU autoscaling, scale to zero, and canary rollouts to your ML deployments.

* Enable a simple, pluggable, and complete story for your production ML inference server by providing prediction, pre-processing, post-processing and explainability out of the box.

Our strong community contributions help KFServing to grow. We have a Technical Steering Committee driven by Bloomberg, IBM Cloud, Seldon, Amazon Web Services (AWS) and NVIDIA. [Browse the KFServing GitHub repo](https://github.com/kubeflow/kfserving) to give us feedback!

## Install with Kubeflow

KFServing works with Kubeflow 1.2. Kustomize installation files are [located in the manifests repo](https://github.com/kubeflow/manifests/tree/master/kfserving).
Check the examples running KFServing on Istio/Dex in the [`kubeflow/kfserving`](https://github.com/kubeflow/kfserving/tree/master/docs/samples/istio-dex) repository. For installation on major cloud providers with Kubeflow, follow their installation docs.

Kubeflow 1.2 includes KFServing v0.4.1, where the focus has been on enabling KFServing on OpenShift and additionally providing more features, such as adding batcher module as sidecar, Triton inference server renaming and integrations, upgrading Alibi explainer to 0.4.0, updating logger to CloudEvents V1 protocol and allowing customized URL paths on data plane. Additionally, the minimum Istio version is now v1.3.1. More details can be found [here](https://github.com/kubeflow/kfserving/releases/tag/v0.4.0) and [here](https://github.com/kubeflow/kfserving/releases/tag/v0.4.1)

<img src="../kfserving.png" alt="KFServing">

## Examples

### Deploy models with out-of-the-box model servers

* [TensorFlow](https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorflow)
* [PyTorch](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pytorch)
* [XGBoost](https://github.com/kubeflow/kfserving/tree/master/docs/samples/xgboost)
* [Scikit-Learn](https://github.com/kubeflow/kfserving/tree/master/docs/samples/sklearn)
* [ONNXRuntime](https://github.com/kubeflow/kfserving/tree/master/docs/samples/onnx)

### Deploy models with custom model servers

* [Custom](https://github.com/kubeflow/kfserving/tree/master/docs/samples/custom)
* [BentoML](https://github.com/kubeflow/kfserving/tree/master/docs/samples/bentoml)

### Deploy models on GPU

* [GPU](https://github.com/kubeflow/kfserving/tree/master/docs/samples/accelerators)
* [Nvidia Triton Inference Server](https://github.com/kubeflow/kfserving/tree/master/docs/samples/triton)

### Autoscaling and Rollouts

* [Autoscaling](https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling)
* [Canary Rollout](https://github.com/kubeflow/kfserving/tree/master/docs/samples/rollouts)

### Model explainability and outlier detection

* [Explainability](https://github.com/kubeflow/kfserving/tree/master/docs/samples/explanation/alibi)
* [OutlierDetection](https://github.com/kubeflow/kfserving/tree/master/docs/samples/outlier-detection/alibi-detect/cifar10)

### Integrations

* [Transformer](https://github.com/kubeflow/kfserving/tree/master/docs/samples/transformer/image_transformer)
* [Kafka](https://github.com/kubeflow/kfserving/tree/master/docs/samples/kafka)
* [Pipelines](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pipelines)
* [Request/Response logging](https://github.com/kubeflow/kfserving/tree/master/docs/samples/logger)

### Model Storages

* [Azure](https://github.com/kubeflow/kfserving/tree/master/docs/samples/azure)
* [S3](https://github.com/kubeflow/kfserving/tree/master/docs/samples/s3)
* [On-prem cluster](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pvc)

### Sample notebooks

* [SDK client](https://github.com/kubeflow/kfserving/blob/master/docs/samples/client/kfserving_sdk_v1alpha2_sample.ipynb)
* [Transformer (pre/post processing)](https://github.com/kubeflow/kfserving/blob/master/docs/samples/transformer/image_transformer/kfserving_sdk_transformer.ipynb)
* [ONNX](https://github.com/kubeflow/kfserving/blob/master/docs/samples/onnx/mosaic-onnx.ipynb)

We frequently add examples to our [GitHub repo](https://github.com/kubeflow/kfserving/tree/master/docs/samples/).

## Learn more

* Join our [working group](https://groups.google.com/forum/#!forum/kfserving) for meeting invitations and discussion.
* [Read the docs](https://github.com/kubeflow/kfserving/tree/master/docs).
* [API docs](https://github.com/kubeflow/kfserving/tree/master/docs/apis/README.md).
* [Debugging guide](https://github.com/kubeflow/kfserving/blob/master/docs/KFSERVING_DEBUG_GUIDE.md).
* [Roadmap](https://github.com/kubeflow/kfserving/tree/master/ROADMAP.md).
* [KFServing 101 slides](https://drive.google.com/file/d/16oqz6dhY5BR0u74pi9mDThU97Np__AFb/view).
* [Kubecon Introducing KFServing](https://kccncna19.sched.com/event/UaZo/introducing-kfserving-serverless-model-serving-on-kubernetes-ellis-bigelow-google-dan-sun-bloomberg).
* [Kubecon Advanced KFServing](https://kccncna19.sched.com/event/UaVw/advanced-model-inferencing-leveraging-knative-istio-and-kubeflow-serving-animesh-singh-ibm-clive-cox-seldon).
* [Nvidia GTC Accelerate and Autoscale Deep Learning Inference on GPUs](https://developer.nvidia.com/gtc/2020/video/s22459-vid).

## Standalone KFServing

### Install Knative/Istio

Knative Serving (v0.11.2 +), Istio (v1.3.1+), and Cert Manager(v0.12.0+) should be available on your Kubernetes cluster.
For installing KFServing prerequisites, refer to the [README section](https://github.com/kubeflow/kfserving#prerequisites).

### KFServing installation

Once you meet the above prerequisites KFServing can be [installed standalone](https://github.com/kubeflow/kfserving#standalone-kfserving-installation). Check the [KFServing `install` directory](https://github.com/kubeflow/kfserving/tree/master/install) for other available releases.

### Monitoring

* [Setup Monitoring](https://github.com/kubeflow/kfserving#setup-monitoring)

## Use SDK

1. Install the SDK with PiPy.

    ```shell
    pip install kfserving
    ```

1. [Follow the example(s)](https://github.com/kubeflow/kfserving/blob/master/docs/samples/client) to use the KFServing SDK to create, patch, roll out, and delete a KFServing instance.

## Contribute

* [Developer guide](https://github.com/kubeflow/kfserving/tree/master/docs/DEVELOPER_GUIDE.md).
