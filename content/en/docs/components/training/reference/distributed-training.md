+++
title = "Distributed Training with Training Operator"
description = "How Training Operator performs distributed training on Kubernetes"
weight = 10
+++

This page shows different distributed strategies that can be achieved with Training Operator.

## Distributed Training for PyTorch

This diagram shows how Training Operator creates PyTorch workers for
[ring all-reduce algorithm](https://tech.preferred.jp/en/blog/technologies-behind-distributed-deep-learning-allreduce/).

<img src="/docs/components/training/images/distributed-pytorchjob.drawio.svg"
  alt="Distributed PyTorchJob"
  class="mt-3 mb-3">

User is responsible for writing a training code using native
[PyTorch Distributed APIs](https://pytorch.org/tutorials/beginner/dist_overview.html)
and create a PyTorchJob with required number of workers and GPUs using Training Operator Python SDK.
Then, Training Operator creates Kubernetes pods with appropriate environment variables for the
[`torchrun`](https://pytorch.org/docs/stable/elastic/run.html) CLI to start distributed
PyTorch training job.

At the end of the ring all-reduce algorithm gradients are synchronized
in every worker (`g1, g2, g3, g4`) and model is trained.

You can define various distributed strategies supported by PyTorch in your training code
(e.g. [PyTorch FSDP](https://pytorch.org/docs/stable/fsdp.html)), and Training Operator will set
the appropriate environment variables for `torchrun`.

## Distributed Training for TensorFlow

This diagram shows how Training Operator creates TensorFlow parameter server (PS) and workers for
[PS distributed training](https://www.tensorflow.org/tutorials/distribute/parameter_server_training).

<img src="/docs/components/training/images/distributed-tfjob.drawio.svg"
  alt="Distributed TFJob"
  class="mt-3 mb-3">

User is responsible for writing a training code using native
[TensorFlow Distributed APIs](https://www.tensorflow.org/guide/distributed_training) and create a
TFJob with required number PSs, workers, and GPUs using Training Operator Python SDK.
Then, Training Operator creates Kubernetes pods with appropriate environment variables for
[`TF_CONFIG`](https://www.tensorflow.org/guide/distributed_training#setting_up_the_tf_config_environment_variable)
to start distributed TensorFlow training job.

Parameter server splits training data for every worker and averages model weights based on gradients
produced by every worker.

You can define various [distributed strategies supported by TensorFlow](https://www.tensorflow.org/guide/distributed_training#types_of_strategies)
in your training code, and Training Operator will set the appropriate environment
variables for `TF_CONFIG`.
