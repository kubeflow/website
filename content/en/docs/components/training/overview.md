+++
title = "Overview"
description = "An overview of Kubeflow Training Operator"
weight = 10
+++

## What is Training Operator ?

Training Operator is a Kubernetes-native project for fine-tuning and scalable
distributed training of machine learning (ML) models created with various ML frameworks such as
PyTorch, TensorFlow, XGBoost, and others.

User can integrate other ML libraries such as [HuggingFace](https://huggingface.co),
[DeepSpeed](https://github.com/microsoft/DeepSpeed), or [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)
with Training Operator to orchestrate their ML training on Kubernetes.

Training Operator allows you to use Kubernetes workloads to effectively train your large models
via Kubernetes Custom Resources APIs or using Training Operator Python SDK.

Training Operator implements centralized Kubernetes controller to orchestrate distributed training jobs.

Users can run High-performance computing (HPC) tasks with Training Operator and MPIJob since it
supports running Message Passing Interface (MPI) on Kubernetes which is heavily used for HPC.
Training Operator implements V1 API version of MPI Operator. For MPI Operator V2 version,
please follow [this guide](/docs/components/training/mpi/) to install MPI Operator V2.

<img src="/docs/components/training/images/training-operator-overview.drawio.png"
  alt="Training Operator Overview"
  class="mt-3 mb-3">

Training Operator is responsible for scheduling the appropriate Kubernetes workloads to implement
various distributed training strategies for different ML frameworks. The following examples show
how Training Operator allows to run distributed PyTorch and TensorFlow on Kubernetes.

## Why Training Operator ?

TODO (andreyvelich): Explain value of Training Operator.

## Custom Resources for ML Frameworks

To perform distributed training Training Operator implements the following
[Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
for each ML framework:

| ML Framework | Custom Resource                                            |
| ------------ | ---------------------------------------------------------- |
| PyTorch      | [PyTorchJob](/docs/components/training/pytorch/)           |
| TensorFlow   | [TFJob](/docs/components/training/user-guides/tensorflow/) |
| XGBoost      | [XGBoostJob](/docs/components/training/xgboost/)           |
| MPI          | [MPIJob](/docs/components/training/mpi/)                   |
| PaddlePaddle | [PaddleJob](/docs/components/training/paddlepaddle/)       |

### Distributed Training for PyTorch

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

### Distributed Training for TensorFlow

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

## Next steps

- Follow [the installation guide](/docs/components/training/installation/) to deploy Training Operator.

- Run examples from [getting started guide](/docs/components/training/getting-started/).
