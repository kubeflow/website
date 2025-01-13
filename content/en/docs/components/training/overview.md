+++
title = "Overview"
description = "An overview of the Kubeflow Training"
weight = 10
+++


## What is the Kubeflow Training

The Kubeflow Training is a Kubernetes-native project for large language models (LLMs) fine-tuning
and scalable distributed training of machine learning (ML) models created with different ML
frameworks such as PyTorch, JAX, TensorFlow, XGBoost, and others.

You can integrate other ML libraries such as [HuggingFace](https://huggingface.co),
[DeepSpeed](https://github.com/microsoft/DeepSpeed), or [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)
with the Kubeflow Training to orchestrate their ML training on Kubernetes.

The Kubeflow Training allows you effortlessly develop your LLMs with the Kubeflow Python SDK and
build Kubernetes-native Training Runtimes with Kubernetes Custom Resources APIs.

## Who's this for

The Kubeflow Training focuses on two personas and corresponding resources they can manage:

<img src="/docs/components/training/images/user-personas.drawio.svg"
  alt="Kubeflow Training Personas"
  class="mt-3 mb-3">


The Kubeflow Training can be utilized for these personas:

- [Data Scientists and ML Engineers](): people who develop model with Kubeflow Python SDK and TrainJob.
- Platform Administrators: people who manage training runtimes on Kubernetes.

