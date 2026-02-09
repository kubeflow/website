+++
title = "JAX Guide"
description = "How to run JAX training on Kubernetes with Kubeflow Trainer"
weight = 10
+++

This guide describes how to use TrainJob to train or fine-tune AI models with
[JAX](https://jax.readthedocs.io/).

---

## Prerequisites

Before exploring this guide, make sure to follow
[the Getting Started guide](/docs/components/trainer/getting-started/)
to understand the basics of Kubeflow Trainer.

---

## JAX Overview

JAX supports distributed and parallel computation through its
[`jax.distributed`](https://jax.readthedocs.io/en/latest/jax.distributed.html)
module and Single Program, Multiple Data (SPMD) primitives such as `pmap`, `pjit`, and `shard_map`.
These APIs allow you to scale JAX workloads across multiple devices
and multiple nodes.

Kubeflow Trainer integrates with JAX by:
- Launching one Pod per JAX process
- Injecting the required JAX distributed environment variables
- Ensuring deterministic process indexing across restarts

With Kubeflow Trainer, you can run:
- Multi-process CPU training
- Multi-GPU training using CUDA-enabled JAX
- Data-parallel and model-parallel JAX workloads

{{% alert title="Note" color="info" %}}
The JAX runtime currently supports CPU and GPU workloads only.

TPU workloads are not supported because installing both `jax[cuda]`
and `jax[tpu]` in the same image leads to backend and plugin conflicts.
A separate TPU-specific runtime is required.
{{% /alert %}}

---

## JAX Runtime in Kubeflow Trainer

Kubeflow Trainer provides a built-in JAX distributed runtime named
`jax-distributed`.

This runtime:
- Uses the official NVIDIA JAX container image
- Enables distributed execution by declaring a JAX ML policy
- Requires no manual configuration of networking

Internally, the runtime maps:
- One Kubernetes Pod → one JAX process
- Multiple devices per Pod → local JAX devices

---

## Get JAX Runtime Packages

Kubeflow Trainer includes a JAX runtime that uses the official
NVIDIA JAX container image. This runtime provides native CPU and GPU
support and comes with a curated set of pre-installed packages.

Run the following command to inspect the runtime packages:

```python
from kubeflow.trainer import TrainerClient

TrainerClient().get_runtime_packages(
    runtime=TrainerClient().get_runtime("jax-distributed")
)

```
## Creating a TrainJob with JAX Runtime

To run a JAX workload, reference the `jax-distributed`
`ClusterTrainingRuntime` in your TrainJob.

### Minimal TrainJob Example

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: jax-example
spec:
  runtimeRef:
    apiVersion: trainer.kubeflow.org/v1alpha1
    kind: ClusterTrainingRuntime
    name: jax-distributed
  trainer:
    numNodes: 2
    container:
      image: nvcr.io/nvidia/jax:25.10-py3
      command: ["python", "train.py"]
```

This configuration:

- Creates 2 Pods
- Runs the same `train.py` script in each Pod
- Forms a single distributed JAX execution

---

## Scaling Semantics

In the JAX runtime:

- `spec.trainer.numNodes` controls the number of JAX processes
- Each process corresponds to one Pod
- All Pods run identical code

```yaml
spec:
  trainer:
    numNodes: 4
```
Results:

- 4 Pods
- 4 JAX processes
- One global SPMD program

If each Pod has multiple GPUs, JAX will automatically detect and use them as local devices.

---
## Creating a TrainJob with the Python SDK

Kubeflow Trainer also provides a Python SDK that allows you to
programmatically create and submit TrainJobs without writing YAML.

```python 

from kubeflow.trainer import TrainerClient, TrainJob

client = TrainerClient()

job = TrainJob(
    name="jax-sdk-example",
    runtime="jax-distributed",
    num_nodes=2,
    container={
        "image": "nvcr.io/nvidia/jax:25.10-py3",
        "command": ["python", "train.py"],
    },
)

client.create_trainjob(job)
``` 




## Environment Variables Injected by the JAX Runtime

Kubeflow Trainer automatically injects the following environment variables into each trainer container:

| Variable | Description |
|--------|-------------|
| `JAX_NUM_PROCESSES` | Total number of JAX processes |
| `JAX_PROCESS_ID` | Global process index (0-based) |
| `JAX_COORDINATOR_ADDRESS` | Address of the coordinator (process 0) |

---

## Initializing the JAX Distributed Runtime

Your training script must explicitly initialize the JAX distributed runtime before performing any JAX computation.

### Example: train.py

```python
import os
import jax
import jax.distributed as dist

def main():
    dist.initialize(
        num_processes=int(os.environ["JAX_NUM_PROCESSES"]),
        process_id=int(os.environ["JAX_PROCESS_ID"]),
        coordinator_address=os.environ["JAX_COORDINATOR_ADDRESS"],
    )

    print("Global devices:", jax.devices())
    print("Local devices:", jax.local_devices())

    # Training logic here

if __name__ == "__main__":
    main()
```
{{% alert title="Important" color="warning" %}}
All processes must call **jax.distributed.initialize()** exactly once
and before any JAX computation. Failure to do so may result in deadlocks.
{{% /alert %}}




---

## Parallelism with JAX Primitives

Once initialized, you can use JAX SPMD primitives normally:

- `pmap` — data-parallel execution  
- `pjit` — explicit global sharding  
- `shard_map` — low-level SPMD control  

Kubeflow Trainer does not alter JAX semantics, it only provides the distributed execution environment.

---

## Limitations

Current limitations of the JAX runtime include:

- No TPU support
- No elastic or dynamic scaling
- Homogeneous node and device configurations are assumed
- All processes must start and finish together

---

## Next Steps

- Check out [the MNIST JAX example](https://github.com/kaisoz/trainer/blob/ca27f54971070a1f65f2d9bf3a1b643f92736448/examples/jax/image-classification/mnist.ipynb).
