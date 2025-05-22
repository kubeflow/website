+++
title = "PyTorch Guide"
description = "How to develop PyTorch models with Kubeflow Trainer"
weight = 10
+++

This page describes how to use `TrainJob` for training a machine learning model with [PyTorch](https://pytorch.org/)

The `TrainJob` is a Kubernetes [custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to run PyTorch training jobs on Kubernetes. The Kubeflow implementation of the `TrainJob` is in the [`trainer`](https://github.com/kubeflow/trainer).


Kubeflow trainer is a part of Kubeflow ecosystem that enables you to train distributed PyTorch models, deploy training models on kubernetes clusters and manage jobs using Python SDK. With just a few lines of code, you can launch, monitor and scale PyTorch training jobs across Kubernetes.


## Kubeflow Trainer SDK Elements

To use the Kubeflow Trainer, it is important to understand the core SDK components that define and control training jobs.


### TrainerClient

This is a controller class that is responsible for submitting a job, retrieving job status, listing all the jobs, deleting jobs, etc.

Example:
from kubeflow.trainer import TrainerClient
client = TrainerClient()

```python
from kubeflow.trainer import TrainerClient
client = TrainerClient()
```


### TrainJob

This is the main base class that defines the job metadata and training runtime. 

| Field       | Type   | Description |
|-------------|--------|-------------|
| `job_type`  | str    | Type of job, e.g., `"pytorchjob"` |
| `job_name`  | str    | A unique name for the job |
| `framework` | str    | Framework used, e.g., `"pytorch"` |
| `runtime`   | `TrainerRuntime` | Runtime configuration |



### TrainerRuntime

This is a nested configuration class that holds job-specific runtime settings. It defines how the jobs runs.

| Field         | Type            | Description |
|---------------|-----------------|-------------|
| `namespace`   | str             | Kubernetes namespace |
| `image`       | str             | Docker image |
| `command`     | list of str     | Command to execute |
| `num_masters` | int             | Number of master pods (usually 1) |
| `num_workers` | int             | Number of worker pods |
| `env`         | dict (optional) | Environment variables |
| `volumes`     | list (optional) | Volume mounts |


## Deploying PyTorch Models using Kubeflow Trainer

The below example illustrates a PyTorchJob submitted to Kubernetes cluster

```python
from kubeflow.trainer import TrainerClient
from kubeflow.trainer.types import TrainJob, TrainerRuntime

runtime = TrainerRuntime(
    namespace="kubeflow-user",
    image="your-dockerhub/mnist-train:latest",
    command=["python", "train.py"],
    num_masters=1,
    num_workers=2,
    env={"EPOCHS": "2"}
)

job = TrainJob(
    job_type="pytorchjob",
    job_name="mnist-pytorch-distributed",
    framework="pytorch",
    runtime=runtime
)

client = TrainerClient()
client.submit(job)
```


## Logging 

### Option 1: `kubectl logs`

```bash
kubectl get pods -n kubeflow-user
kubectl logs <master-pod-name> -n kubeflow-user
```

### Option 2: Kubeflow Dashboard

1. Navigate to the Kubeflow UI.
2. Select your namespace.
3. Go to **Training > Jobs**.
4. Click your job to see logs.


## Monitoring

```python
status = client.get("mnist-pytorch-distributed", job_type="pytorchjob")
print("Current job status:", status.status.conditions)
client.wait("mnist-pytorch-distributed", job_type="pytorchjob")
```

## Next steps
- Learn about [distributed training](/docs/components/trainer/legacy-v1/reference/distributed-training/) in the Training Operator.
- See how to [run a job with gang-scheduling](/docs/components/trainer/legacy-v1/user-guides/job-scheduling#running-jobs-with-gang-scheduling).