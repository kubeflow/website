+++
title = "Overview"
description = "An overview of Training Operator"
weight = 10
+++

{{% stable-status %}}

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
please follow [this guide](/docs/components/training/user-guides/mpi/) to install MPI Operator V2.

<img src="/docs/components/training/images/training-operator-overview.drawio.png"
  alt="Training Operator Overview"
  class="mt-3 mb-3">

Training Operator is responsible for scheduling the appropriate Kubernetes workloads to implement
various distributed training strategies for different ML frameworks.

## Why Training Operator ?

Training Operator addresses Model Training and Model Fine-Tuning step in AI/ML lifecycle as shown on
that diagram:

<img src="/docs/components/training/images/ml-lifecycle-training-operator.drawio.png"
  alt="Training Operator Overview"
  class="mt-3 mb-3">

## Custom Resources for ML Frameworks

To perform distributed training Training Operator implements the following
[Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
for each ML framework:

| ML Framework | Custom Resource                                                  |
| ------------ | ---------------------------------------------------------------- |
| PyTorch      | [PyTorchJob](/docs/components/training/user-guides/pytorch/)     |
| TensorFlow   | [TFJob](/docs/components/training/user-guides/tensorflow/)       |
| XGBoost      | [XGBoostJob](/docs/components/training/user-guides/xgboost/)     |
| MPI          | [MPIJob](/docs/components/training/user-guides/mpi/)             |
| PaddlePaddle | [PaddleJob](/docs/components/training/user-guides/paddlepaddle/) |

## Next steps

- Follow [the installation guide](/docs/components/training/installation/) to deploy Training Operator.

- Run examples from [getting started guide](/docs/components/training/getting-started/).
