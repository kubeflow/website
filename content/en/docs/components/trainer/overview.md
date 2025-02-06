+++
title = "Overview"
description = "An overview of Kubeflow Trainer"
weight = 10
+++

{{% alert title="Note" color="dark" %}}
Kubeflow Trainer project is currently in <strong>alpha</strong> status, and APIs may change.
If you are using Kubeflow Training Operator V1, refer [to this migration document](/docs/components/trainer/operator-guides/migration).

For legacy Kubeflow Training Operator V1 documentation, check [these guides](/docs/components/trainer/legacy-v1)
{{% /alert %}}

## What is Kubeflow Trainer

Kubeflow Trainer is a Kubernetes-native project designed for
large language models (LLMs) fine-tuning and enabling scalable, distributed training of
machine learning (ML) models across various frameworks, including PyTorch, JAX, TensorFlow, and XGBoost.

You can integrate other ML libraries such as [HuggingFace](https://huggingface.co),
[DeepSpeed](https://github.com/microsoft/DeepSpeed), or [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)
with Kubeflow Trainer to orchestrate their ML training on Kubernetes.

Kubeflow Trainer allows you to effortlessly develop your LLMs with the Kubeflow Python SDK and
build Kubernetes-native Training Runtimes with Kubernetes Custom Resources APIs.

<img src="/docs/components/trainer/images/trainer-tech-stack.drawio.svg"
  alt="Kubeflow Trainer Tech Stack"
  class="mt-3 mb-3">

## Who is this for

Kubeflow Trainer is designed for two primary user personas, each with specific resources and
responsibilities:

<img src="/docs/components/trainer/images/user-personas.drawio.svg"
  alt="Kubeflow Trainer Personas"
  class="mt-3 mb-3">

### User Personas

Kubeflow Trainer documentation is separated between these user personas:

- [ML Users](/docs/components/trainer/user-guides): engineers and scientists who develop AI models
  using the Kubeflow Python SDK and TrainJob.
- [Cluster Operators](/docs/components/trainer/operator-guides): administrators responsible for managing
  Kubernetes clusters and Kubeflow Training Runtimes.
- [Contributors](/docs/components/trainer/contributor-guides): open source contributors working on
  [Kubeflow Trainer project](https://github.com/kubeflow/training-operator).

## Kubeflow Trainer Introduction

Watch the following KubeCon + CloudNativeCon 2024 talk which provides an overview of Kubeflow Trainer:

{{< youtube id="Lgy4ir1AhYw" title="Kubeflow Trainer V2">}}

## Why use Kubeflow Trainer

The Kubeflow Trainer supports key phases on the AI/ML lifecycle, including model training and LLMs
fine-tuning, as shown in the diagram below:

<img src="/docs/components/trainer/images/ml-lifecycle-trainer.drawio.svg"
  alt="AI/ML Lifecycle Trainer"
  class="mt-3 mb-3">

### Key Benefits

- **Simple and Scalable for Distributed Training and LLMs Fine-Tuning**

Effortlessly scale your model training from a single machine to large distributed Kubernetes
clusters using Kubeflow Python APIs and supported Training Runtimes.

- **Extensible and Portable**

Deploy Kubeflow Trainer on any cloud platform with a Kubernetes cluster and integrate your own
ML frameworks in any programming language.

- **Blueprints for LLMs Fine-Tuning**

Fine-tune the latest LLMs on Kubernetes with ready-to-use Kubeflow LLM blueprints.

- **Reduce GPU Cost**

- Kubeflow Trainer implements custom dataset and model initializers to reduce GPU cost by
  offloading I/O tasks to CPU workloads and to streamline assets initialization across distributed
  training nodes.

- **Seamless Kubernetes Integration**

Optimize GPU utilization and gang-scheduling for ML workloads by leveraging Kubernetes projects like
[Kueue](https://kueue.sigs.k8s.io/),
[Coscheduling](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/coscheduling/README.md),
[Volcano](https://volcano.sh/en/) or [YuniKorn](https://yunikorn.apache.org/docs/).

## Next steps

Run your first Kubeflow TrainJob by following the
[Getting Started guide](/docs/components/trainer/getting-started/).
