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
KFServing and Seldon Core. A check mark (**&check;**) indicates that the system
(KFServing or Seldon Core) supports the feature specified in that row.

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
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorflow">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/servers/tensorflow.html">docs</a></td>
      </tr>

      <tr>
        <td></td>
        <td>XGBoost</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/xgboost">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/servers/xgboost.html">docs</a></td>
      </tr>

      <tr>
        <td></td>
        <td>scikit-learn</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/sklearn">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/servers/sklearn.html">docs</a></td>
      </tr>

      <tr>
        <td></td>
        <td>NVIDIA TensorRT Inference Server</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/tensorrt">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/nvidia_mnist.html">docs</a></td>
      </tr>

      <tr>
        <td></td>
        <td>ONNX</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/onnx">sample</a></td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td>PyTorch</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/pytorch">sample</a></td>
        <td><b>&check;</b></td>
      </tr>

      <tr>
        <td>Graph</td>
        <td>Transformers</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/blob/master/docs/samples/transformer/image_transformer/kfserving_sdk_transformer.ipynb">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/transformer_spam_model.html">docs</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Combiners</td>
        <td>Roadmap</td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/openvino_ensemble.html">sample</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Routers including <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit">MAB</a></td>
        <td>Roadmap</td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/analytics/routers.html">docs</a></td>
      </tr>

      <tr>
        <td>Analytics</td>
        <td>Explanations</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/explanation/alibi">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/analytics/explainers.html">docs</a></td>
      </tr>

      <tr>
        <td>Scaling</td>
        <td>Knative</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling">sample</a></td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td>GPU AutoScaling</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/autoscaling">sample</a></td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td>HPA</td>
        <td><b>&check;</b></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/graph/autoscaling.html">docs</a></td>
      </tr>

      <tr>
        <td>Custom</td>
        <td>Container</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/custom">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/language_wrappers.html">docs</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Language Wrappers</td>
        <td></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/python/index.html">Python</a>, <a href="https://docs.seldon.io/projects/seldon-core/en/latest/java/README.html">Java</a>, <a href="https://docs.seldon.io/projects/seldon-core/en/latest/R/README.html">R</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Multi-Container</td>
        <td></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/graph/inference-graph.html">docs</a></td>
      </tr>

      <tr>
        <td>Rollout</td>
        <td>Canary</td>
        <td><b>&check;</b> <a href="https://github.com/kubeflow/kfserving/tree/master/docs/samples/rollouts">sample</a></td>
        <td><b>&check;</b> <a href="https://docs.seldon.io/projects/seldon-core/en/latest/examples/istio_canary.html">docs</a></td>
      </tr>

      <tr>
        <td></td>
        <td>Shadow</td>
        <td></td>
        <td><b>&check;</b></td>
      </tr>

      <tr>
        <td>Istio</td>
        <td></td>
        <td><b>&check;</b></td>
        <td><b>&check;</b></td>
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
   * [Community](/docs/about/community/)
 * Seldon Core
   * [Kubeflow documentation](/docs/components/serving/seldon/)
   * [Seldon Core documentation](https://docs.seldon.io/projects/seldon-core/en/latest/)
   * [GitHub repository](https://github.com/SeldonIO/seldon-core)
   * [Community](https://github.com/SeldonIO/seldon-core#community)

## TensorFlow Serving

For TensorFlow models you can use TensorFlow Serving for 
[real-time prediction](/docs/components/serving/tfserving_new).
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
