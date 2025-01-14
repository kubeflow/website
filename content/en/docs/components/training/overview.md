+++
title = "Overview"
description = "An overview of the Kubeflow Training"
weight = 10
+++

{{% alert title="Note" color="dark" %}}
The Kubeflow Training V2 is currently in <strong>alpha</strong> status, and APIs may change.
If you are using the Kubeflow Training V1, please refer [to this migration document](/docs/components/training/admin-guides/migration).

For legacy Kubeflow Training V1 documentation, please check [these guides](/docs/components/training/legacy-v1)
{{% /alert %}}

## What is the Kubeflow Training

The Kubeflow Training is a Kubernetes-native project for large language models (LLMs) fine-tuning
and scalable distributed training of machine learning (ML) models created with different ML
frameworks such as PyTorch, JAX, TensorFlow, XGBoost, and others.

You can integrate other ML libraries such as [HuggingFace](https://huggingface.co),
[DeepSpeed](https://github.com/microsoft/DeepSpeed), or [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)
with the Kubeflow Training to orchestrate their ML training on Kubernetes.

The Kubeflow Training allows you effortlessly develop your LLMs with the Kubeflow Python SDK and
build Kubernetes-native Training Runtimes with Kubernetes Custom Resources APIs.

TODO (andreyvelich): Add diagram once it is ready.

## Who is this for

The Kubeflow Training is designed for two primary user personas, each with specific resources and
responsibilities:

<img src="/docs/components/training/images/user-personas.drawio.svg"
  alt="Kubeflow Training Personas"
  class="mt-3 mb-3">

### User Personas

The Kubeflow Training documentation is separated between these user personas:

- [ML Users](/docs/components/training/user-guides): engineers and scientists who develop AI models
  using the Kubeflow Python SDK and TrainJob.
- [Cluster Admins](/docs/components/training/admin-guides): administrators responsible for managing
  Kubernetes clusters and Kubeflow Training Runtimes.
- [Contributors](/docs/components/training/contributor-guides): open source contributors working on
  [Kubeflow Training project](https://github.com/kubeflow/training-operator).

## Kubeflow Training Introduction

Watch the following KubeCon + CloudNativeCon 2024 talk which provides an overview of Kubeflow Training:

{{< youtube id="Lgy4ir1AhYw" title="Kubeflow Training V2">}}

## Why use the Kubeflow Training

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

Follow [the installation guide](/docs/components/training/installation/) to deploy the Kubeflow Training.
