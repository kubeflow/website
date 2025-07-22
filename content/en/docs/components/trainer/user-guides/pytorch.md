+++
title = "PyTorch Guide"
description = "How to develop PyTorch models with Kubeflow Trainer"
weight = 10
+++

This guide describes how to use TrainJob for training a AI models with [PyTorch](https://pytorch.org/).

## PyTorch Distributed Overview

PyTorch has inbuilt [package `torch.distributed`](https://docs.pytorch.org/docs/stable/distributed.html)
to perform distributed training including data and model parallelism. You can leverage Kubeflow
Trainer Python SDK to create your TrainJobs with [PyTorch Distributed Data Parallel (DDP)](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html),
[Fully Sharded Data Parallel (FSDP)](https://docs.pytorch.org/docs/stable/fsdp.html), [FSDP2](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html),
or any other distributed algorithm that PyTorch supports.

In the DDP training each GPU has a copy of the same model, and the dataset gets chopped and assigned
across multiple GPUs. The gradients are calculated locally, then synchronized globally to update
the model parameters.

In FSDP training the dataset gets distributed and the model gets chopped into slices and assigned
to the different GPUs. The gradients and model parameter updates are calculated locally,
then synchronized globally. The FSDP is particular useful for training of very large models that
cannot fit the memory of a single GPU.

## Get PyTorch Runtime Packages

Kubeflow Trainer has PyTorch runtime: `torch-distributed` with some pre-installed Python packages.

Run the following command to get list of available packages:

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
...
```

## PyTorch Distributed Environment

Kubeflow Trainer uses [`torchrun` utility](https://docs.pytorch.org/docs/stable/elastic/run.html)
to run PyTorch script on every training node. Kubeflow Trainer automatically configures the
appropriate distributed environment for the PyTorch:

- `dist.get_world_size()` - number of total processes (e.g. GPUs) in PyTorch cluster.
- `dist.get_rank()` - rank of the current process within PyTorch cluster.
- `os.environ["LOCAL_RANK"]` - rank of the current process within PyTorch training nodes.

You can use the above values to download dataset only on node with `local_rank=0`, or export
your fine-tuned LLM only on node with `rank=0` (e.g. master node).

You can the distributed env as follows:

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

You should see the distributed env across two training nodes:

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

You can leverage the `CustomTrainer` to wrap your PyTorch code under the function
and create the TrainJob. The function handles end-to-end model training or fine-tuning of pre-trained
model.

{{% alert title="Note" color="info" %}}
Imports must also be included in the function body, so TrainJob can recognize them on every
training node.
{{% /alert %}}

Your training function might look as follows:

```py
def fine_tune_qwen():
    import torch
    import torch.distributed as dist
    from torch.utils.data import DataLoader, DistributedSampler
    from transformers import AutoTokenizer, AutoModelForCausalLM
    import boto3

    # Configure distributed Torch.
    device, backend = ("cuda", "nccl") if torch.cuda.is_available() else ("cpu", "gloo")
    dist.init_process_group(backend=backend)

    # Configure dataset and dataloader.
    dataset = ...
    train_loader = DataLoader(
        dataset, batch_size=128, sampler=DistributedSampler(dataset)
    )
    # Configure pre-trained model and tokenizer.
    tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen3-32B")
    model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3-32B")

    # Configure PyTorch training loop.
    for epoch in range(10):
        for batch_idx, batch in enumerate(train_loader):
            output = model(...)
            model.backward(output.loss)
            model.step()
            ...
    if dist.get_rank() == 0:
        # Export model to object storage (e.g. S3)
        boto3.upload_file()
```

### Create TrainJob with `train()` API

After configuring the PyTorch training function, use the `train()` API to create TrainJob:

```python
TrainerClient().train(
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

## Next Steps

- Check [the PyTorch MNIST example](https://github.com/kubeflow/trainer/blob/master/examples/pytorch/image-classification/mnist.ipynb).
- Follow [the PyTorch fine-tuning example](https://github.com/kubeflow/trainer/blob/master/examples/pytorch/question-answering/fine-tune-distilbert.ipynb) of pre-trained DistilBERT.
