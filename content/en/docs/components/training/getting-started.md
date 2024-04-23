+++
title = "Getting Started"
description = "Get started with Training Operator"
weight = 30
+++

This guide describes how to get started with Training Operator and run a few simple examples.

## Prerequisites

You need to install the following components to run examples:

- Training Operator [installed](/docs/components/training/installation/installing-training-operator).
- Training Operator Python SDK [installed](/docs/components/training/installation/installing-training-operator).

## Getting Started with PyTorch

You can create your first Training Operator distributed Job using Python SDK. Define the
training function that implements end-to-end model training. Each Worker will execute this
function on the appropriate Kubernetes Pod. Usually, this function contains logic to
download dataset, create model, and train the model.

World Size and Rank will be set automatically as environment variables by Training Operator
controller to perform [PyTorch Distributed Data Parallel (DDP)](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html).

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

## Getting Started with TensorFlow

Similar to PyTorch example, you can use the Python SDK to create your distributed TFJob. Run the
following script to create TFJob using pre-created Docker image:
`docker.io/kubeflow/tf-mnist-with-summaries:latest` that contains
[distributed TensorFlow code](https://github.com/kubeflow/training-operator/tree/e6b4300f9dfebb5c2a3269641c828add367688ee/examples/tensorflow/mnist_with_summaries):

```python
from kubeflow.training import TrainingClient

TrainingClient().create_job(
    name="tensorflow-dist",
    job_kind="TFJob",
    base_image="docker.io/kubeflow/tf-mnist-with-summaries:latest",
    num_workers=3,
)
```

Run the following API to get logs from your TFJob:

```python
TrainingClient().get_job_logs(
    name="tensorflow-dist",
    job_kind="TFJob",
    follow=True,
)
```

## Next steps

- Run [FashionMNIST example](https://github.com/kubeflow/training-operator/blob/7345e33b333ba5084127efe027774dd7bed8f6e6/examples/pytorch/image-classification/Train-CNN-with-FashionMNIST.ipynb) with using Training Operator Python SDK.

- Learn more about [the PyTorchJob APIs](/docs/components/training/pytorch/).
