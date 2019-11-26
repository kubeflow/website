+++
title = "Overview"
description = "Model serving overview"
weight = 1
+++

## Multi-frmaework Serving

Kubeflow provides two supported open source model serving systems that allow multi-framework model serving: KFServing and Seldon Core. You should choose the framework that best supports your model serving requirements.  A rough comparison between KFServing and Seldon Core is shown below:

| Feature        | sub-feature    | KFServing | Seldon |
|----------------|----------------|  :--:     |  :--:  |
| Framework      | TensorFlow     | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorflow) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/servers/tensorflow.html)  |
|                | XGBoost        | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/xgboost) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/servers/xgboost.html) |
|                | scikit-learn        | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/sklearn) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/servers/sklearn.html) |
|                | NVIDIA TensorRT Inference Server    | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorrt) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/examples/nvidia_mnist.html) |
|                | ONNX           | [x](https://docs.seldon.io/projects/seldon-core/en/latest/examples/onnx_resnet.html) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/examples/onnx_resnet.html) |
|                | PyTorch        | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/pytorch) | [x](https://www.kubeflow.org/docs/components/serving/pytorchserving/) |
| Graph          | Transformers   | [x](https://github.com/kubeflow/kfserving/blob/master/docs/samples/transformer/image_transformer/kfserving_sdk_transformer.ipynb) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/examples/transformer_spam_model.html)
|                | Combiners       | Roadmap | [x](https://docs.seldon.io/projects/seldon-core/en/latest/examples/openvino_ensemble.html) |
|                | Routers incl ([MAB](https://en.wikipedia.org/wiki/Multi-armed_bandit))         | Roadmap | [x](https://docs.seldon.io/projects/seldon-core/en/latest/analytics/routers.html) |
| Analytics      | Explanations   | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/explanation/alibi) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/analytics/explainers.html) |
| Scaling        | Knative        | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling) | |
|                | GPU AutoScaling| [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling) | |
|                | HPA            |  x | [x](https://docs.seldon.io/projects/seldon-core/en/latest/graph/autoscaling.html) |
| Custom         |  Container     | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/custom) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/README.html) |
|                | Language Wrappers | | [python](https://docs.seldon.io/projects/seldon-core/en/latest/python/index.html), [java](https://docs.seldon.io/projects/seldon-core/en/latest/java/README.html), [R](https://docs.seldon.io/projects/seldon-core/en/latest/R/README.html) |
|                | Multi-Container | | [x](https://docs.seldon.io/projects/seldon-core/en/latest/graph/inference-graph.html) |
| Rollout        | Canary         | [x](https://github.com/kubeflow/kfserving/tree/master/docs/samples/rollouts) | [x](https://docs.seldon.io/projects/seldon-core/en/latest/examples/istio_canary.html) |
|                | Shadow          | | x |
| istio          |                 | x | x |


Notes:

   * Both projects share technology including Explainability (via [Seldon Alibi Explain](https://github.com/SeldonIO/alibi)) and Payload Logging amongst other areas.
   * A commercial product [Seldon Deploy](https://www.seldon.io/tech/products/deploy/) is available from Seldon that supports both KFServing and Seldon in production.
   * KFServing is part of the Kubeflow project ecosystem. Seldon is an external project supported within Kubeflow.

For further information:

 * KFServing:
   * [Github Repo](https://github.com/kubeflow/kfserving)
   * [Kubeflow Documentation](https://www.kubeflow.org/docs/components/serving/kfserving/)
   * [Community](https://www.kubeflow.org/docs/about/community/)
 * Seldon
   * [Github Repo](https://github.com/SeldonIO/seldon-core)
   * [Kubeflow documentation](https://www.kubeflow.org/docs/components/serving/seldon/)
   * [External Documentation](https://docs.seldon.io/projects/seldon-core/en/latest/)
   * [Community](https://github.com/SeldonIO/seldon-core#community)


## TensorFlow Serving

For TensorFlow models you can use TensorFlow Serving for both [real-time](/docs/components/serving/tfserving_new) and [batch](/docs/components/serving/tfbatchpredict) prediction. Documentation is also provided on using [TensorFlow serving via Istio](/docs/components/serving/istio). However, if you are thinking of utlizing multiple frameworks we would suggest you use KFServing or Seldon Core as described above.

## NVIDIA TensorRT Inference Server

NVIDIA TensorRT Inference Server is a REST and GRPC service for deep-learning
inferencing of TensorRT, TensorFlow and Caffe2 models. The server is
optimized deploy machine and deep learning algorithms on both GPUs and
CPUs at scale.

You can use [NVIDIA TensorRT Inference Server standalone](/docs/components/serving/trtinferenceserver) but we also recommend you look at using KFServing which includes support for NVIDIA TensorRT Inference Server.

