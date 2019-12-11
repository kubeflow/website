+++
title = "Overview"
description = "Model serving overview"
weight = 1
+++

Kubeflow supports two model serving systems that allow multi-framework model 
serving: *KFServing* and *Seldon Core*. Alternatively, you can use a
standalone model serving system. This page gives an overview of the options, so
that you can choose the framework that best supports your model serving 
requirements.

## Multi-framework serving with KFServing or Seldon Core

KFServing and Seldon Core are both open source systems that allow 
multi-framework model serving. The following table compares 
KFServing and Seldon Core:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Feature</th>
        <th>Sub-feature</th>
        <th>KFServing</th>
        <th>Seldon Core</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>Framework</td>
        <td>TensorFlow</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorflow" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/servers/tensorflow.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>XGBoost</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/xgboost" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/servers/xgboost.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>scikit-learn</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/sklearn" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/servers/sklearn.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>NVIDIA TensorRT Inference Server</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorrt" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/nvidia_mnist.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>ONNX</td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/onnx_resnet.html" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/onnx_resnet.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>PyTorch</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/pytorch" target="_blank">x</a></td>
        <td><a href="/docs/components/serving/pytorchserving/" target="_blank">x</a></td>
      </tr>

      <tr>
        <td>Graph</td>
        <td>Transformers</td>
        <td><a href="https://github.com/kubeflow/kfserving/blob/master/docs/samples/transformer/image_transformer/kfserving_sdk_transformer.ipynb" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/transformer_spam_model.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Combiners</td>
        <td>Roadmap</td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/openvino_ensemble.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Routers incl (<a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank">MAB</a>)</td>
        <td>Roadmap</td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/analytics/routers.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td>Analytics</td>
        <td>Explanations</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/explanation/alibi" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/analytics/explainers.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td>Scaling</td>
        <td>Knative</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling" target="_blank">x</a></td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td>GPU AutoScaling</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling" target="_blank">x</a></td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td>HPA</td>
        <td>x</td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/graph/autoscaling.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td>Custom</td>
        <td>Container</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/custom" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/README.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Language Wrappers</td>
        <td></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/python/index.html" target="_blank">python</a>, <a href="https://docs.seldon.io/projects/seldon-core/en/latest/java/README.html" target="_blank">java</a>, <a href="https://docs.seldon.io/projects/seldon-core/en/latest/R/README.html" target="_blank">R</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Multi-Container</td>
        <td></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/graph/inference-graph.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td>Rollout</td>
        <td>Canary</td>
        <td><a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/rollouts" target="_blank">x</a></td>
        <td><a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/istio_canary.html" target="_blank">x</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Shadow</td>
        <td></td>
        <td>x</td>
      </tr>

      <tr>
        <td>istio</td>
        <td></td>
        <td>x</td>
        <td>x</td>
      </tr>
    </tbody>
  </table>
</div>

Notes:

   * KFServing and Seldon Core share some technical features, including 
     explainability (using [Seldon Alibi 
     Explain](https://github.com/SeldonIO/alibi)) and payload logging, as well 
     as other areas.
   * A commercial product, 
     [Seldon Deploy](https://www.seldon.io/tech/products/deploy/), supports both 
     KFServing and Seldon in production.
   * KFServing is part of the Kubeflow project ecosystem. Seldon Core is an
     external project supported within Kubeflow.

Further information:

 * KFServing:
   * [Kubeflow documentation](/docs/components/serving/kfserving/)
   * [GitHub repository](https://github.com/kubeflow/kfserving)
   * [Community]/docs/about/community/)
 * Seldon Core
   * [Kubeflow documentation](/docs/components/serving/seldon/)
   * [Seldon Core documentation](https://docs.seldon.io/projects/seldon-core/en/latest/)
   * [GitHub repository](https://github.com/SeldonIO/seldon-core)
   * [Community](https://github.com/SeldonIO/seldon-core#community)

## TensorFlow Serving

For TensorFlow models you can use TensorFlow Serving for both 
[real-time](/docs/components/serving/tfserving_new) and 
[batch](/docs/components/serving/tfbatchpredict) prediction. Kubeflow also
supports [TensorFlow serving via Istio](/docs/components/serving/istio). 
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
