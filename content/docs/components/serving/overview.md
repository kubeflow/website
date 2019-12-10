+++
title = "Overview"
description = "Model serving overview"
weight = 1
+++

Kubeflow supports two model serving systems that allow multi-framework model 
serving: KFServing and Seldon Core. Alternatively, you can choose to use a
standalone model serving system. This page gives an overview of the options, so
that you can choose the framework that best supports your model serving 
requirements.

## Multi-framework serving with KFServing or Seldon Core

KFServing and Seldon Core are both open source systems that allow 
multi-framework model serving. The following table gives a rough comparison 
between KFServing and Seldon Core:

| Feature        | Sub-feature    | KFServing | Seldon Core |
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

   * KFServing and Seldon Core share some technology, including explainability
     (using [Seldon Alibi Explain](https://github.com/SeldonIO/alibi)) and 
     payload logging, as well as other areas.
   * A commercial product, 
     [Seldon Deploy](https://www.seldon.io/tech/products/deploy/) supports both 
     KFServing and Seldon in production.
   * KFServing is part of the Kubeflow project ecosystem. Seldon Core is an
     external project supported within Kubeflow.

Further information:

 * KFServing:
   * [Kubeflow documentation](/docs/components/serving/kfserving/)
   * [GitHub repository](https://github.com/kubeflow/kfserving)
   * [Community](https://www.kubeflow.org/docs/about/community/)
 * Seldon Core
   * [Kubeflow documentation](/docs/components/serving/seldon/)
   * [GitHub repository](https://github.com/SeldonIO/seldon-core)
   * [Seldon Core documentation](https://docs.seldon.io/projects/seldon-core/en/latest/)
   * [Community](https://github.com/SeldonIO/seldon-core#community)

## TensorFlow Serving

For TensorFlow models you can use TensorFlow Serving for both 
[real-time](/docs/components/serving/tfserving_new) and 
[batch](/docs/components/serving/tfbatchpredict) prediction. Kubeflow also
a guide to [TensorFlow serving via Istio](/docs/components/serving/istio). 
However, if you plan to use multiple frameworks, you should consider KFServing
or Seldon Core as described above.

## NVIDIA TensorRT Inference Server

NVIDIA TensorRT Inference Server is a REST and GRPC service for deep-learning
inferencing of TensorRT, TensorFlow and Caffe2 models. The server is
optimized to deploy machine learning algorithms on both GPUs and
CPUs at scale.

You can use NVIDIA TensorRT Inference Server as a 
[standalone system](/docs/components/serving/trtinferenceserver),
but you should consider KFServing as described above. KFServing includes support 
for NVIDIA TensorRT Inference Server.
