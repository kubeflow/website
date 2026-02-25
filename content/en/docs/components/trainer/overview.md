+++
title = "Overview"
description = "An overview of Kubeflow Trainer"
weight = 10
+++

{{% alert title="Note" color="info" %}}
If you are using Kubeflow Training Operator V1, refer [to this migration document](/docs/components/trainer/operator-guides/migration).

For legacy Kubeflow Training Operator V1 documentation, check [these guides](/docs/components/trainer/legacy-v1).
{{% /alert %}}

## What is Kubeflow Trainer

Kubeflow Trainer is a Kubernetes-native distributed AI platform for scalable large language model
(LLM) fine-tuning and training of AI models across a wide range of frameworks, including
PyTorch, MLX, HuggingFace, DeepSpeed, JAX, XGBoost, and more.

Kubeflow Trainer brings MPI to Kubernetes, orchestrating multi-node, multi-GPU distributed
jobs efficiently across high-performance computing (HPC) clusters. This enables high-throughput
communication between processes, making it ideal for large-scale AI training that requires
ultra-fast synchronization between GPUs nodes.

Kubeflow Trainer seamlessly integrates with the Cloud Native AI ecosystem, including
[Kueue](https://kueue.sigs.k8s.io/docs/tasks/run/trainjobs/) for topology-aware scheduling and
multi-cluster job dispatching, as well as [JobSet](https://github.com/kubernetes-sigs/jobset) and
[LeaderWorkerSet](https://github.com/kubernetes-sigs/lws) for AI workload orchestration.

Kubeflow Trainer provides a distributed data cache designed to stream large-scale data with zero-copy
transfer directly to GPU nodes. This ensures memory-efficient training jobs while maximizing
GPU utilization.

With [the Kubeflow Python SDK](https://github.com/kubeflow/sdk), AI practitioners can effortlessly
develop and fine-tune LLMs while leveraging the Kubeflow Trainer APIs: TrainJob and Runtimes.

<img src="/docs/components/trainer/images/trainer-tech-stack.drawio.svg"
  alt="Kubeflow Trainer Tech Stack"
  class="mt-3 mb-3 border rounded p-3 bg-white"
  style="width: 100%; max-width: 30em">

## Who is this for

Checkout following KubeCon + CloudNativeCon talks for Kubeflow Trainer capabilities:

<img src="/docs/components/trainer/images/user-personas.drawio.svg"
  alt="Kubeflow Trainer Personas"
  class="mt-3 mb-3 border rounded p-3 bg-white"
  style="width: 100%; max-width: 30em">

Additional talks:

- [From High Performance Computing To AI Workloads on Kubernetes: MPI Runtime in Kubeflow TrainJob](https://youtu.be/Fnb1a5Kaxgo)
- [Streamline LLM Fine-tuning on Kubernetes With Kubeflow LLM Trainer](https://youtu.be/O7cNlaz3Hqs)

### User Personas

Kubeflow Trainer documentation is separated between these user personas:

- [AI Practitioners](/docs/components/trainer/user-guides): ML engineers and data scientists who
  develop AI models using the Kubeflow Python SDK and TrainJob.
- [Platform Administrators](/docs/components/trainer/operator-guides): administrators and DevOps
  engineers responsible for managing Kubernetes clusters and Kubeflow Training Runtimes.
- [Contributors](/docs/components/trainer/contributor-guides): open source contributors working on
  [Kubeflow Trainer project](https://github.com/kubeflow/trainer).

## Kubeflow Trainer Introduction

Watch the following KubeCon + CloudNativeCon 2024 talk which provides an overview of Kubeflow Trainer:

{{< youtube id="Lgy4ir1AhYw" title="Kubeflow Trainer V2">}}

## Why use Kubeflow Trainer

The Kubeflow Trainer supports key phases on the [AI lifecycle](/docs/started/architecture/#kubeflow-projects-in-the-ai-lifecycle),
including model training and LLMs fine-tuning, as shown in the diagram below:

<img src="/docs/components/trainer/images/ai-lifecycle-trainer.drawio.svg"
  alt="AI Lifecycle Trainer"
  class="mt-3 mb-3 border rounded p-3 bg-white">

### Key Benefits

- 🚀 **Simple, Scalable, and Built for LLM Fine-Tuning**

Effortlessly scale from single-machine training to large, distributed Kubernetes clusters with
Kubeflow's Python APIs and supported Training Runtimes. Perfect for modern AI workloads.

- 🔧 **Extensible and Portable**

Run Kubeflow Trainer on any cloud or on-premises Kubernetes cluster. Easily integrate your own ML
frameworks—regardless of language or runtime—through a flexible, extensible API layer.

- ⚡️ **Distributed AI Data Caching**

Powered by [Apache Arrow](https://arrow.apache.org/) and [Apache DataFusion](https://datafusion.apache.org/),
Kubeflow Trainer streams tensors directly to GPU nodes via a distributed cache layer – enabling
seamless access to large datasets, minimizing I/O overhead, and cutting GPU costs.

- 🧠 **LLM Fine-Tuning Blueprints**

Accelerate your generative AI use-cases with ready-to-use Kubeflow LLM blueprints designed for
efficient fine-tuning and deployment of LLMs on Kubernetes.

- 💰 **Optimized for GPU Efficiency**

Reduce GPU costs through intelligent dataset streaming and model initialization. Kubeflow Trainer
offloads data preprocessing and I/O to CPU workloads, ensuring GPUs stay focused on training.

- ☸️ **Native Kubernetes Integrations**

Achieve optimal GPU utilization and coordinated scheduling for large-scale AI workloads.
Kubeflow Trainer seamlessly integrates with Kubernetes ecosystem projects like
[Kueue](https://kueue.sigs.k8s.io/),
[Coscheduling](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/coscheduling/README.md),
[Volcano](https://volcano.sh/en/), or [YuniKorn](https://yunikorn.apache.org/docs/).

## Next steps

Run your first Kubeflow TrainJob by following the
[Getting Started guide](/docs/components/trainer/getting-started/).
