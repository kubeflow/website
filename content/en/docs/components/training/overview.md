+++
title = "Overview"
description = "An overview of Kubeflow Training Operator"
weight = 5
+++

## What is Kubeflow Training Operator ?

Kubeflow Training Operator is a Kubernetes-native project for fine-tuning and scalable
distributed training of machine learning (ML) models created with various ML frameworks such as
PyTorch, Tensorflow, XGBoost, and others.

User can integrate other ML libraries such as [HuggingFace](https://huggingface.co),
[DeepSpeed](https://github.com/microsoft/DeepSpeed), or [Megatron](https://github.com/NVIDIA/Megatron-LM)
with Training Operator to orchestrate their ML training on Kubernetes.

Training Operator allows you to use Kubernetes workloads to effectively train your large models
via Kubernetes Custom Resources APIs or using Training Operator Python SDK.

Training Operator implements centralized Kubernetes controller to orchestrate distributed training jobs.

Users can run High-performance computing (HPC) tasks with Training Operator and MPIJob since it
supports running Message Passing Interface (MPI) on Kubernetes which is heavily used for HPC.
Training Operator implements V1 API version of MPI Operator. For MPI Operator V2 version,
please follow [this guide](/docs/components/training/mpi/) to install MPI Operator V2.

## Custom Resources for ML Frameworks

To perform distributed training Training Operator implements the following
[Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
for each ML framework:

| ML Framework | Custom Resource                                      |
| ------------ | ---------------------------------------------------- |
| PyTorch      | [PyTorchJob](/docs/components/training/pytorch/)     |
| Tensorflow   | [TFJob](/docs/components/training/tftraining/)       |
| XGBoost      | [XGBoostJob](/docs/components/training/xgboost/)     |
| MPI          | [MPIJob](/docs/components/training/mpi/)             |
| PaddlePaddle | [PaddleJob](/docs/components/training/paddlepaddle/) |

## Architecture

This diagram shows the major features of Training Operator and supported ML frameworks.

<img src="/docs/components/training/images/training-operator-overview.drawio.png"
  alt="Training Operator Overview"
  class="mt-3 mb-3">

Training Operator is responsible to schedule the appropriate Kubernetes workloads to implement
various distributed training strategies for different ML frameworks. The following examples show
how Training Operator allows to run distributed PyTorch and Tensorflow on Kubernetes.

### Distributed Training for PyTorch

This diagram shows how Training Operator creates PyTorch workers for
[ring all-reduce algorithm](https://tech.preferred.jp/en/blog/technologies-behind-distributed-deep-learning-allreduce/).

<img src="/docs/components/training/images/distributed-pytorchjob.drawio.svg"
  alt="Distributed PyTorchJob"
  class="mt-3 mb-3">

User is responsible to write a training code using native
[PyTorch Distributed APIs](https://pytorch.org/tutorials/beginner/dist_overview.html)
and create a PyTorchJob with required number of workers and GPUs using Training Operator Python SDK.
Then, Training Operator creates Kubernetes pods with appropriate environment variables for the
[`torchrun`](https://pytorch.org/docs/stable/elastic/run.html) CLI to start distributed
PyTorch training job.

At the end of the ring all-reduce algorithm gradients are synchronized
in every worker (`g1, g2, g3, g4`) and model is trained.

You can define various distributed strategy supported by PyTorch in your training code, and Training
Operator will set the appropriate environment variables for `torchrun`.

### Distributed Training for Tensorflow

This diagram shows how Training Operator creates Tensorflow parameter server (PS) and workers for
[PS distributed training](https://www.tensorflow.org/tutorials/distribute/parameter_server_training).

<img src="/docs/components/training/images/distributed-tfjob.drawio.svg"
  alt="Distributed TFJob"
  class="mt-3 mb-3">

User is responsible to write a training code using native
[Tensorflow Distributed APIs](https://www.tensorflow.org/guide/distributed_training) and create a
TFJob with required number PSs, workers, and GPUs using Training Operator Python SDK.
Then, Training Operator creates Kubernetes pods with appropriate environment variables for
[`TF_CONFIG`](https://www.tensorflow.org/guide/distributed_training#setting_up_the_tf_config_environment_variable)
to start distributed Tensorflow training job.

Parameter server splits training data for every worker and averages model weights based on gradients
produced by every worker.

You can define various distributed strategy supported by Tensorflow in your training code, and Training
Operator will set the appropriate environment variables for `TF_CONFIG`.

## Getting Started

You can create your first Training Operator job using Python SDK. Define the training function
that implements end-to-end model training. Training Operator schedules appropriate resources
to run this training function on every Worker.

Install Training Operator SDK:

```
pip install kubeflow-training
```

You can implement your training loop in the train function. Each Worker will execute this function
on the appropriate Kubernetes Pod. Usually, this function contains logic to download dataset,
create model, and train the model.

World Size and Rank will be set automatically in env variables by Training Operator controller
to perform [PyTorch DDP](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html).

For example:

```python
def train_func():
    import torch
    import os

    # Create model.
    class Net(torch.nn.Module):
        """Create the Pytorch model"""
        ...
    model = Net()

    # Download dataset.
    train_loader = torch.utils.data.DataLoader(...)

    # Attach model to PyTorch distributor.
    torch.distributed.init_process_group(backend="nccl")
    Distributor = torch.nn.parallel.DistributedDataParallel
    model = Distributor(model)

    # Start model training.
    model.train()

# Start PyTorchJob with 100 Workers and 2 GPUs per Worker.
from kubeflow.training import TrainingClient
TrainingClient().create_job(
    name="pytorch-ddp",
    func=train_func,
    num_workers=100,
    resources_per_worker={"gpu": "2"},
)
```

## Next steps

- Learn more about [the PyTorchJob APIs](/docs/components/training/pytorch/).

- Follow [the scheduling guide](/docs/components/training/job-scheduling/) to configure various
  job schedulers for Training Operator jobs.
