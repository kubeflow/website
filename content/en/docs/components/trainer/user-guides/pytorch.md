+++
title = "PyTorch Guide"
description = "How to develop PyTorch models with Kubeflow Trainer"
weight = 10
+++

This guide describes how to use TrainJob to train or fine-tune an AI models with [PyTorch](https://pytorch.org/).

## PyTorch Distributed Overview

PyTorch has the builtin [`torch.distributed` package](https://docs.pytorch.org/docs/stable/distributed.html)
to perform distributed training, including both data and model parallelism. You can use the Kubeflow
Trainer Python SDK to create your TrainJobs with
[PyTorch Distributed Data Parallel (DDP)](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html),
[Fully Sharded Data Parallel (FSDP)](https://docs.pytorch.org/docs/stable/fsdp.html),
[FSDP2](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html),
or any other distributed algorithm supported by PyTorch.

In the DDP training, each GPU holds a full copy of the model, and the dataset gets chopped and assigned
across multiple GPUs. The gradients are calculated locally on each GPU and then synchronized globally
to update the model parameters.

In FSDP training, both the dataset and the model gets chopped into slices and assigned to the
different GPUs. The model is split into shards, each hosted on a different GPU. Gradients and
parameter updates are computed locally and synchronized globally.
FSDP is particularly useful for training very large models that cannot fit into the memory of a single GPU.

## Get PyTorch Runtime Packages

Kubeflow Trainer includes a PyTorch runtime called `torch-distributed`, which comes with several
pre-installed Python packages.

Run the following command to get a list of the available packages:

```py
# TODO(andreyvelich): This should be changed to the `get_runtime_packages()` API.
from kubeflow.trainer import TrainerClient, Runtime, CustomTrainer
import time

job_id = TrainerClient().train(
    runtime=TrainerClient().get_runtime("torch-distributed"),
)

while True:
    if TrainerClient().get_job(name=job_id).status == "Succeeded":
        break
    time.sleep(1)

print(TrainerClient().get_job_logs(name=job_id)["node-0"])
```

You should see the installed packages, for example:

```sh
Torch Distributed Runtime
--------------------------------------
Torch Default Runtime Env
Package                   Version
------------------------- ------------
...
torch                     2.7.1+cu128
torchaudio                2.7.1+cu128
torchelastic              0.2.2
torchvision               0.22.1+cu128
```

## PyTorch Distributed Environment

Kubeflow Trainer uses the [`torchrun` utility](https://docs.pytorch.org/docs/stable/elastic/run.html)
to run PyTorch script on every training node. It automatically configures the appropriate distributed
environment for PyTorch cluster:

- `dist.get_world_size()` - Total number of processes (e.g., GPUs) in the PyTorch cluster
- `dist.get_rank()` - Rank of the current process within the PyTorch cluster.
- `os.environ["LOCAL_RANK"]` - Rank of the current process within a PyTorch training node.

You can use these values to, for example, download the dataset only on the node with `local_rank=0`,
or export your fine-tuned LLM only on the node with `rank=0` (e.g., the master node).

You can access the distributed environment as follows:

```py
from kubeflow.trainer import TrainerClient, CustomTrainer

def get_torch_dist():
    import os
    import torch
    import torch.distributed as dist

    device, backend = ("cuda", "nccl") if torch.cuda.is_available() else ("cpu", "gloo")
    dist.init_process_group(backend=backend)

    print("PyTorch Distributed Environment")
    print(f"Using device: {device}")
    print(f"WORLD_SIZE: {dist.get_world_size()}")
    print(f"RANK: {dist.get_rank()}")
    print(f"LOCAL_RANK: {os.environ['LOCAL_RANK']}")


job_id = TrainerClient().train(
    runtime=TrainerClient().get_runtime("torch-distributed"),
    trainer=CustomTrainer(
        func=get_torch_dist,
        num_nodes=3,
        resources_per_node={
            "cpu": 2,
        },
    ),
)


# TODO (andreyvelich): Change it to is_job_complete() API.
while True:
    if TrainerClient().get_job(name=job_id).status == "Succeeded":
        break
    time.sleep(1)


print("Distributed PyTorch env on node-0")
print(TrainerClient().get_job_logs(name=job_id, step="node", node_rank=0)["node-0"])

print("Distributed PyTorch env on node-1")
print(TrainerClient().get_job_logs(name=job_id, step="node", node_rank=1)["node-1"])
```

You should see the distributed environment across the two training nodes as follows:

```shell
Distributed PyTorch env on node-0
PyTorch Distributed Environment
Using device: cpu
WORLD_SIZE: 6
RANK: 0
LOCAL_RANK: 0
PyTorch Distributed Environment
Using device: cpu
WORLD_SIZE: 6
RANK: 1
LOCAL_RANK: 1

Distributed PyTorch env on Node-1
PyTorch Distributed Environment
Using device: cpu
WORLD_SIZE: 6
RANK: 2
LOCAL_RANK: 0
PyTorch Distributed Environment
Using device: cpu
WORLD_SIZE: 6
RANK: 3
LOCAL_RANK: 1
```

## Create TrainJob with PyTorch Training

### Configure PyTorch Training Function

You can leverage the `CustomTrainer()` to wrap your PyTorch code inside a function and create a
TrainJob. This function should handle the end-to-end model training or fine-tuning of a
pre-trained model.

{{% alert title="Note" color="info" %}}
All necessary imports must be included inside the function body so that the TrainJob can recognize
them on every training node.
{{% /alert %}}

Your training function might look like this:

```py
def fine_tune_qwen():
    import torch
    import torch.distributed as dist
    from torch.utils.data import DataLoader, DistributedSampler
    from transformers import AutoTokenizer, AutoModelForCausalLM
    import boto3

    # Setup distributed Torch.
    device, backend = ("cuda", "nccl") if torch.cuda.is_available() else ("cpu", "gloo")
    dist.init_process_group(backend=backend)

    # Configure the dataset and dataloader.
    dataset = ...
    train_loader = DataLoader(
        dataset, batch_size=128, sampler=DistributedSampler(dataset)
    )
    # Configure the pre-trained model and tokenizer.
    tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-32B")
    model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3-32B")

    # Configure the PyTorch training loop.
    for epoch in range(10):
        for batch_idx, batch in enumerate(train_loader):
            output = model(...)
            model.backward(output.loss)
            model.step()
            ...
    if dist.get_rank() == 0:
        # Export your model to the object storage (e.g. S3)
        boto3.upload_file()
```

### Create TrainJob with `train()` API

After configuring the PyTorch training function, use the `train()` API to create TrainJob:

```python
job_id = TrainerClient().train(
    runtime=TrainerClient().get_runtime("torch-distributed"),
    trainer=CustomTrainer(
        func=fine_tune_qwen,
        num_nodes=2,
        resources_per_node={
            "gpu": 4
        },
        # These packages will be installed on every training node.
        packages_to_install=["transformers>=4.53.0", "boto3"],
    )
)
```

### Get the TrainJob Results

You can use the `get_job_logs()` API to see your TrainJob logs:

```py
print(TrainerClient().get_job_logs(name=job_id)["node-0"])
```

## Next Steps

- Check out [the PyTorch MNIST example](https://github.com/kubeflow/trainer/blob/master/examples/pytorch/image-classification/mnist.ipynb).
- Follow [the PyTorch fine-tuning example](https://github.com/kubeflow/trainer/blob/master/examples/pytorch/question-answering/fine-tune-distilbert.ipynb)
  using the pre-trained DistilBERT model.
- Learn more about [the Kubeflow SDK APIs](https://github.com/kubeflow/sdk/blob/main/python/kubeflow/trainer/api/trainer_client.py)
  for `TrainerClient()`.
