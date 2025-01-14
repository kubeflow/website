+++
title = "Overview"
description = "An overview of Kubeflow Training"
weight = 10
+++

{{% alert title="Note" color="dark" %}}
Kubeflow Training project is currently in <strong>alpha</strong> status, and APIs may change.
If you are using Kubeflow Training Operator V1, please refer [to this migration document](/docs/components/training/operator-guides/migration).

For legacy Kubeflow Training V1 documentation, please check [these guides](/docs/components/training/legacy-v1)
{{% /alert %}}

## What is Kubeflow Training

Kubeflow Training project is a Kubernetes-native solution designed for
large language models (LLMs) fine-tuning and enabling scalable, distributed training of
machine learning (ML) models across various frameworks, including PyTorch, JAX, TensorFlow, and XGBoost.

You can integrate other ML libraries such as [HuggingFace](https://huggingface.co),
[DeepSpeed](https://github.com/microsoft/DeepSpeed), or [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)
with Kubeflow Training to orchestrate their ML training on Kubernetes.

Kubeflow Training allows you effortlessly develop your LLMs with the Kubeflow Python SDK and
build Kubernetes-native Training Runtimes with Kubernetes Custom Resources APIs.

TODO (andreyvelich): Add diagram once it is ready.

## Who is this for

Kubeflow Training is designed for two primary user personas, each with specific resources and
responsibilities:

<img src="/docs/components/training/images/user-personas.drawio.svg"
  alt="Kubeflow Training Personas"
  class="mt-3 mb-3">

### User Personas

Kubeflow Training documentation is separated between these user personas:

- [ML Users](/docs/components/training/user-guides-v2): engineers and scientists who develop AI models
  using the Kubeflow Python SDK and TrainJob.
- [Cluster Operators](/docs/components/training/operator-guides): administrators responsible for managing
  Kubernetes clusters and Kubeflow Training Runtimes.
- [Contributors](/docs/components/training/contributor-guides): open source contributors working on
  [Kubeflow Training project](https://github.com/kubeflow/training-operator).

## Kubeflow Training Introduction

Watch the following KubeCon + CloudNativeCon 2024 talk which provides an overview of Kubeflow Training:

{{< youtube id="Lgy4ir1AhYw" title="Kubeflow Training V2">}}

## Why use Kubeflow Training

The Kubeflow Training supports key phases on the AI/ML lifecycle, including model training and LLMs
fine-tuning, as shown in the diagram below:

<img src="/docs/components/training/images/ml-lifecycle-training.drawio.svg"
  alt="AI/ML Lifecycle Training"
  class="mt-3 mb-3">

### Key Benefits

- **Simple and Scalable for Distributed Training and LLMs Fine-Tuning**

Effortlessly scale your model training from a single machine to large distributed Kubernetes
clusters using Kubeflow Python APIs and supported Training Runtimes.

- **Extensible and Portable.**

Deploy Kubeflow Training on any cloud platform with a Kubernetes cluster and integrate your own
ML frameworks in any programming language.

- **Blueprints for LLMs Fine-Tuning**

Fine-tune the latest LLMs on Kubernetes with ready-to-use Kubeflow Training blueprints.

- **Seamless Kubernetes Integration**

Optimize GPU utilization and gang-scheduling for ML workloads by leveraging Kubernetes projects like
[Kueue](https://kueue.sigs.k8s.io/),
[Coscheduling](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/coscheduling/README.md),
[Volcano](https://volcano.sh/en/) or [YuniKorn](https://yunikorn.apache.org/docs/).

## Next steps

Run your first Kubeflow Training Job by following the
[Getting Started guide](/docs/components/training/getting-started/).
