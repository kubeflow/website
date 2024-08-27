+++
title = "Getting Started"
description = "Get started with the Training Operator"
weight = 30
+++

This guide describes how to get started with the Training Operator and run a few simple examples.

## Prerequisites

You need to install the following components to run examples:

- The Training Operator control plane [installed](/docs/components/training/installation/#installing-the-control-plane).
- The Training Python SDK [installed](/docs/components/training/installation/#installing-the-python-sdk).

## Getting Started with PyTorchJob

You can create your first Training Operator distributed PyTorchJob using the Python SDK. Define the
training function that implements end-to-end model training. Each Worker will execute this
function on the appropriate Kubernetes Pod. Usually, this function contains logic to
download dataset, create model, and train the model.

The Training Operator will automatically set `WORLD_SIZE` and `RANK` for the appropriate PyTorchJob
worker to perform [PyTorch Distributed Data Parallel (DDP)](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html).

If you install the Training Operator as part of the Kubeflow Platform, you can open a new
[Kubeflow Notebook](/docs/components/notebooks/quickstart-guide/) to run this script. If you
install the Training Operator standalone, make sure that you
[configure local `kubeconfig`](https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#programmatic-access-to-the-api)
to access your Kubernetes cluster where you installed the Training Operator.

```python
def train_func():
    import torch
    import torch.nn.functional as F
    from torch.utils.data import DistributedSampler
    from torchvision import datasets, transforms

    # [1] Setup PyTorch DDP. WORLD_SIZE and RANK environments will be set by Training Operator.
    torch.distributed.init_process_group(backend="nccl")
    Distributor = torch.nn.parallel.DistributedDataParallel

    # [2] Create PyTorch CNN Model.
    class Net(torch.nn.Module):
        def __init__(self):
            super(Net, self).__init__()
            self.conv1 = torch.nn.Conv2d(1, 20, 5, 1)
            self.conv2 = torch.nn.Conv2d(20, 50, 5, 1)
            self.fc1 = torch.nn.Linear(4 * 4 * 50, 500)
            self.fc2 = torch.nn.Linear(500, 10)

        def forward(self, x):
            x = F.relu(self.conv1(x))
            x = F.max_pool2d(x, 2, 2)
            x = F.relu(self.conv2(x))
            x = F.max_pool2d(x, 2, 2)
            x = x.view(-1, 4 * 4 * 50)
            x = F.relu(self.fc1(x))
            x = self.fc2(x)
            return F.log_softmax(x, dim=1)

    # [3] Attach model to GPU and distributor.
    device = "cuda"
    model = Net().to(device)
    model = Distributor(model)
    optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.5)

    # [4] Setup FashionMNIST dataloader and distribute data across PyTorchJob workers.
    dataset = datasets.FashionMNIST(
        "./data",
        download=True,
        train=True,
        transform=transforms.Compose([transforms.ToTensor()]),
    )
    train_loader = torch.utils.data.DataLoader(
        dataset=dataset,
        batch_size=128,
        sampler=DistributedSampler(dataset),
    )

    # [5] Start model Training.
    for epoch in range(3):
        for batch_idx, (data, target) in enumerate(train_loader):
            # Attach Tensors to the device.
            data = data.to(device)
            target = target.to(device)

            optimizer.zero_grad()
            output = model(data)
            loss = F.nll_loss(output, target)
            loss.backward()
            optimizer.step()
            if batch_idx % 10 == 0:
                print(
                    "Train Epoch: {} [{}/{} ({:.0f}%)]\tloss={:.4f}".format(
                        epoch,
                        batch_idx * len(data),
                        len(train_loader.dataset),
                        100.0 * batch_idx / len(train_loader),
                        loss.item(),
                    )
                )


from kubeflow.training import TrainingClient

# Start PyTorchJob with 3 Workers and 1 GPUs per Worker.
TrainingClient().create_job(
    name="pytorch-ddp",
    train_func=train_func,
    num_workers=3,
    resources_per_worker={"gpu": "1"},
)
```

## Getting Started with TFJob

Similar to the PyTorchJob example, you can use the Python SDK to create your first distributed
TensorFlow job. Run the following script to create TFJob with pre-created Docker image:
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

- Run the [FashionMNIST example](https://github.com/kubeflow/training-operator/blob/7345e33b333ba5084127efe027774dd7bed8f6e6/examples/pytorch/image-classification/Train-CNN-with-FashionMNIST.ipynb) with using Training Operator Python SDK.

- Learn more about [the PyTorchJob APIs](/docs/components/training/user-guides/pytorch/).
