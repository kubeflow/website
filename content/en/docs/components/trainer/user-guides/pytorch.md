+++
title = "PyTorch Guide"
description = "How to develop PyTorch models with Kubeflow Trainer"
weight = 10
+++

This page describes how to use `TrainJob` for training a machine learning model with [PyTorch](https://pytorch.org/).

The `TrainJob` is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
to run PyTorch training jobs on Kubernetes. The Kubeflow implementation of
the `TrainJob` is in the [`trainer`](https://github.com/kubeflow/trainer).

## Creating a PyTorch Training Job

### Define the Training Function

The first step is to create a function to train a CNN model using the Fashion MNIST dataset. Below is an example of a PyTorch training function using Distributed Data Parallel (DDP). The function configures distributed training, downloads the FashionMNIST dataset (only on the primary node), and runs training loops across workers. The code also shows how to clean up the distributed group at the end.

```python
def train_pytorch():
    import os
    import torch
    import torch.distributed as dist
    import torch.nn.functional as F
    from torch import nn
    from torch.utils.data import DataLoader, DistributedSampler
    from torchvision import datasets, transforms

    # Define the PyTorch CNN model to be trained
    class Net(nn.Module):
        def __init__(self):
            super(Net, self).__init__()
            self.conv1 = nn.Conv2d(1, 20, 5, 1)
            self.conv2 = nn.Conv2d(20, 50, 5, 1)
            self.fc1 = nn.Linear(4 * 4 * 50, 500)
            self.fc2 = nn.Linear(500, 10)

        def forward(self, x):
            x = F.relu(self.conv1(x))
            x = F.max_pool2d(x, 2, 2)
            x = F.relu(self.conv2(x))
            x = F.max_pool2d(x, 2, 2)
            x = x.view(-1, 4 * 4 * 50)
            x = F.relu(self.fc1(x))
            x = self.fc2(x)
            return F.log_softmax(x, dim=1)

    # Use NCCL if a GPU is available, otherwise use Gloo as communication backend.
    device, backend = ("cuda", "nccl") if torch.cuda.is_available() else ("cpu", "gloo")
    print(f"Using Device: {device}, Backend: {backend}")

    # Setup PyTorch distributed.
    local_rank = int(os.getenv("LOCAL_RANK", 0))
    dist.init_process_group(backend=backend)
    print(
        "Distributed Training for WORLD_SIZE: {}, RANK: {}, LOCAL_RANK: {}".format(
            dist.get_world_size(),
            dist.get_rank(),
            local_rank,
        )
    )

    # Create the model and load it into the device.
    device = torch.device(f"{device}:{local_rank}")
    model = nn.parallel.DistributedDataParallel(Net().to(device))
    optimizer = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)

    # Download FashionMNIST dataset only on local_rank=0 process.
    if local_rank == 0:
        dataset = datasets.FashionMNIST(
            "./data",
            train=True,
            download=True,
            transform=transforms.Compose([transforms.ToTensor()]),
        )
    # Wait for the download to complete.
    dist.barrier()

    dataset = datasets.FashionMNIST(
        "./data",
        train=True,
        download=False,
        transform=transforms.Compose([transforms.ToTensor()]),
    )

    # Shard the dataset accross workers.
    train_loader = DataLoader(
        dataset, batch_size=100, sampler=DistributedSampler(dataset)
    )

    dist.barrier()
    for epoch in range(1, 3):
        model.train()

        # Iterate over mini-batches from the training set
        for batch_idx, (inputs, labels) in enumerate(train_loader):
            # Copy the data to the GPU device if available
            inputs, labels = inputs.to(device), labels.to(device)
            # Forward pass
            outputs = model(inputs)
            loss = F.nll_loss(outputs, labels)
            # Backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            if batch_idx % 10 == 0 and dist.get_rank() == 0:
                print(
                    "Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}".format(
                        epoch,
                        batch_idx * len(inputs),
                        len(train_loader.dataset),
                        100.0 * batch_idx / len(train_loader),
                        loss.item(),
                    )
                )

    # Wait for the distributed training to complete
    dist.barrier()
    if dist.get_rank() == 0:
        print("Training is finished")

    # Finally clean up PyTorch distributed
    dist.destroy_process_group()
```

### Scale PyTorch DDP with Kubeflow TrainJob

You can use the `TrainerClient()` from the Kubeflow SDK to communicate with Kubeflow Trainer APIs and scale your training function across multiple PyTorch training nodes.

`TrainerClient()` verifies that you have the required access to the Kubernetes cluster.

The Kubeflow Trainer creates a `TrainJob` resource and automatically sets the appropriate environment variables to set up PyTorch in a distributed environment.

```python
from kubeflow.trainer import CustomTrainer, TrainerClient

client = TrainerClient()
```

### List Available Training Runtimes

You can get the list of available Training Runtimes to start your TrainJob.

```python
torch_runtime = None
for runtime in client.list_runtimes():
    print(runtime)
    if runtime.name == "torch-distributed":
        torch_runtime = runtime
```

Additionally, it might show available accelerator types and the number of available resources.

```bash
Runtime(name='mpi-distributed', trainer=Trainer(trainer_type=<TrainerType.CUSTOM_TRAINER: 'CustomTrainer'>, framework=<Framework.TORCH: 'torch'>, entrypoint=['torchrun'], accelerator='Unknown', accelerator_count=1), pretrained_model=None)
Runtime(name='torch-distributed', trainer=Trainer(trainer_type=<TrainerType.CUSTOM_TRAINER: 'CustomTrainer'>, framework=<Framework.TORCH: 'torch'>, entrypoint=['torchrun'], accelerator='Unknown', accelerator_count='Unknown'), pretrained_model=None)
```

### Configure the train() API

The Kubeflow TrainJob will train the above model on 2 PyTorch nodes. You can specify the resources needed per node.

```python
job_name = client.train(
    trainer=CustomTrainer(
        func=train_pytorch,
        # Set how many PyTorch nodes you want to use for distributed training.
        num_nodes=2,
        # Set the resources for each PyTorch node.
        resources_per_node={
            "cpu": 2,
            "memory": "1Gi",
            # Uncomment this to distribute the TrainJob using GPU nodes.
            # "nvidia.com/gpu": 1,
        },
    ),
    runtime=torch_runtime,
)
```

---

## Monitoring and Managing a TrainJob
### Check TrainJob steps

Since the TrainJob performs distributed training across 2 nodes, it generates 2 steps: `node-0`, `node-1`.
```python
import time

def wait_for_job_running():
    for _ in range(100):
        trainjob = client.get_job(name=job_name)
        for step in trainjob.steps:
            if step.name == "node-0" and step.status == "Running":
                return
        print("Wait for TrainJob running status. Sleep for 5 seconds")
        time.sleep(5)

wait_for_job_running()
```
After nodes are in the running state, you can get the individual status of each step.
```python
for step in client.get_job(name=job_name).steps:
    print(
        f"Step: {step.name}, Status: {step.status}, Devices: {step.device} x {step.device_count}\n"
    )
```
```bash
Step: node-0, Status: Running, Devices: cpu x 2

Step: node-1, Status: Running, Devices: cpu x 2
```

### Watch the TrainJob Logs

We can use the `get_job_logs()` API to get the TrainJob logs.

Since we run training on 2 CPUs per node, every PyTorch node uses 60,000/4 = 15,000 images from the dataset.
```python
_ = client.get_job_logs(job_name, follow=True)
```
<details>
<summary> <b>Logs</b> </summary>

```bash
[node-0]: W0321 23:22:48.944000 1 site-packages/torch/distributed/run.py:793] 
[node-0]: W0321 23:22:48.944000 1 site-packages/torch/distributed/run.py:793] *****************************************
[node-0]: W0321 23:22:48.944000 1 site-packages/torch/distributed/run.py:793] Setting OMP_NUM_THREADS environment variable for each process to be 1 in default, to avoid your system being overloaded, please further tune the variable for optimal performance in your application as needed. 
[node-0]: W0321 23:22:48.944000 1 site-packages/torch/distributed/run.py:793] *****************************************
[node-0]: Using Device: cpu, Backend: glooUsing Device: cpu, Backend: gloo
[node-0]: Distributed Training for WORLD_SIZE: 4, RANK: 0, LOCAL_RANK: 0Distributed Training for WORLD_SIZE: 4, RANK: 1, LOCAL_RANK: 1
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/train-images-idx3-ubyte.gz
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/train-images-idx3-ubyte.gz to ./data/FashionMNIST/raw/train-images-idx3-ubyte.gz
100%|██████████| 26.4M/26.4M [00:53<00:00, 491kB/s] 
[node-0]: Extracting ./data/FashionMNIST/raw/train-images-idx3-ubyte.gz to ./data/FashionMNIST/raw
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/train-labels-idx1-ubyte.gz
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/train-labels-idx1-ubyte.gz to ./data/FashionMNIST/raw/train-labels-idx1-ubyte.gz
100%|██████████| 29.5k/29.5k [00:00<00:00, 172kB/s]
[node-0]: Extracting ./data/FashionMNIST/raw/train-labels-idx1-ubyte.gz to ./data/FashionMNIST/raw
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/t10k-images-idx3-ubyte.gz
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/t10k-images-idx3-ubyte.gz to ./data/FashionMNIST/raw/t10k-images-idx3-ubyte.gz
100%|██████████| 4.42M/4.42M [00:02<00:00, 1.55MB/s]
[node-0]: Extracting ./data/FashionMNIST/raw/t10k-images-idx3-ubyte.gz to ./data/FashionMNIST/raw
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/t10k-labels-idx1-ubyte.gz
[node-0]: Downloading http://fashion-mnist.s3-website.eu-central-1.amazonaws.com/t10k-labels-idx1-ubyte.gz to ./data/FashionMNIST/raw/t10k-labels-idx1-ubyte.gz
100%|██████████| 5.15k/5.15k [00:00<00:00, 13.4MB/s]
[node-0]: Extracting ./data/FashionMNIST/raw/t10k-labels-idx1-ubyte.gz to ./data/FashionMNIST/raw
[node-0]: Train Epoch: 1 [0/60000 (0%)]	Loss: 2.298795
[node-0]: Train Epoch: 1 [1000/60000 (7%)]	Loss: 2.194849
[node-0]: Train Epoch: 1 [2000/60000 (13%)]	Loss: 2.328425
[node-0]: Train Epoch: 1 [3000/60000 (20%)]	Loss: 1.481808
[node-0]: Train Epoch: 1 [4000/60000 (27%)]	Loss: 1.264420
[node-0]: Train Epoch: 1 [5000/60000 (33%)]	Loss: 0.820549
[node-0]: Train Epoch: 1 [6000/60000 (40%)]	Loss: 0.716728
[node-0]: Train Epoch: 1 [7000/60000 (47%)]	Loss: 0.733303
[node-0]: Train Epoch: 1 [8000/60000 (53%)]	Loss: 0.454807
[node-0]: Train Epoch: 1 [9000/60000 (60%)]	Loss: 0.554016
[node-0]: Train Epoch: 1 [10000/60000 (67%)]	Loss: 0.414725
[node-0]: Train Epoch: 1 [11000/60000 (73%)]	Loss: 0.544151
[node-0]: Train Epoch: 1 [12000/60000 (80%)]	Loss: 0.473595
[node-0]: Train Epoch: 1 [13000/60000 (87%)]	Loss: 0.491940
[node-0]: Train Epoch: 1 [14000/60000 (93%)]	Loss: 0.507782
[node-0]: Train Epoch: 2 [0/60000 (0%)]	Loss: 0.504748
[node-0]: Train Epoch: 2 [1000/60000 (7%)]	Loss: 0.448021
[node-0]: Train Epoch: 2 [2000/60000 (13%)]	Loss: 0.438320
[node-0]: Train Epoch: 2 [3000/60000 (20%)]	Loss: 0.308895
[node-0]: Train Epoch: 2 [4000/60000 (27%)]	Loss: 0.421823
[node-0]: Train Epoch: 2 [5000/60000 (33%)]	Loss: 0.397320
[node-0]: Train Epoch: 2 [6000/60000 (40%)]	Loss: 0.521149
[node-0]: Train Epoch: 2 [7000/60000 (47%)]	Loss: 0.505759
[node-0]: Train Epoch: 2 [8000/60000 (53%)]	Loss: 0.334409
[node-0]: Train Epoch: 2 [9000/60000 (60%)]	Loss: 0.381091
[node-0]: Train Epoch: 2 [10000/60000 (67%)]	Loss: 0.278955
[node-0]: Train Epoch: 2 [11000/60000 (73%)]	Loss: 0.409761
[node-0]: Train Epoch: 2 [12000/60000 (80%)]	Loss: 0.337577
[node-0]: Train Epoch: 2 [13000/60000 (87%)]	Loss: 0.390389
[node-0]: Train Epoch: 2 [14000/60000 (93%)]	Loss: 0.288414
[node-0]: Training is finished
```
</details>

### Delete the TrainJob

When the TrainJob is finished, you can delete the resource.

```python
client.delete_job(job_name)
```

## Next steps

- Learn about [distributed training](/docs/components/trainer/legacy-v1/reference/distributed-training/) in the Training Operator.

- See how to [run a job with gang-scheduling](/docs/components/trainer/legacy-v1/user-guides/job-scheduling#running-jobs-with-gang-scheduling).
