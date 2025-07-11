+++
title = "Migrating to Kubeflow Trainer V2"
description = "How to migrate to the new Kubeflow Trainer V2."
weight = 20
+++

## Overview

Kubeflow Trainer is a significant update to the Kubeflow Training Operator project.

The key features introduced by Kubeflow Trainer are:

- The new CRDs: TrainJob, TrainingRuntime, and ClusterTrainingRuntime APIs. These APIs enable the
  creation of templates for distributed model training and LLM fine-tuning. It abstracts the
  Kubernetes complexities, providing more intuitive experience for data scientists and ML engineers.

- The Kubeflow Python SDK: to further enhance ML user experience and to provide seamless integration
  with Kubeflow Trainer APIs.

- Custom dataset and model initializer: to streamline assets initialization across distributed
  training nodes and to reduce GPU cost by offloading I/O tasks to CPU workloads.

- Enhanced MPI support: featuring MPI-Operator V2 features with SSH-based optimization to boost
  MPI performance.

## Migration paths

Kubeflow Trainer v2 introduces new APIs that replace the older, framework-specific CRDs such as `PyTorchJob`, `TFJob`, and `MPIJob`. These new APIs—`TrainingRuntime`, `TrainJob`, and `ClusterTrainingRuntime`—offer a more flexible and unified interface for defining training jobs across frameworks.

This section shows how to migrate an existing PyTorch job to the new API.

### Migrate PyTorchJob to TrainingRuntime

The following example demonstrates how to migrate from a `PyTorchJob` (v1) to a `TrainingRuntime` (v2alpha1).

### Old: PyTorchJob (v1)
```yaml
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  name: pytorch-simple
  namespace: kubeflow
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      restartPolicy: OnFailure
      template:
        spec:
          containers:
            - name: pytorch
              image: docker.io/kubeflowkatib/pytorch-mnist:v1beta1-45c5727
              command: ["python3", "/opt/pytorch-mnist/mnist.py", "--epochs=1"]
    Worker:
      replicas: 1
      restartPolicy: OnFailure
      template:
        spec:
          containers:
            - name: pytorch
              image: docker.io/kubeflowkatib/pytorch-mnist:v1beta1-45c5727
              command: ["python3", "/opt/pytorch-mnist/mnist.py", "--epochs=1"]
```
### New: TrainingRuntime (v2alpha1)
```yaml
apiVersion: trainer.kubeflow.org/v2alpha1
kind: TrainingRuntime
metadata:
  name: torch-distributed-multi-node
spec:
  mpiPolicy:
    numNodes: 2
  template:
    spec:
      replicatedJobs:
        - name: node
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              containers:
                - name: trainer
                  image: docker.io/kubeflowkatib/pytorch-mnist:v1beta1-45c5727
                  env:
                    - name: MASTER_ADDR
                      value: "pytorch-node-0-0.pytorch"
                    - name: MASTER_PORT
                      value: "29400"
                  command: ["torchrun", "train.py"]
```
The new `TrainingRuntime` CRD allows you to define reusable templates and use MPI-based distributed training with greater flexibility. The `replicatedJobs` and `mpiPolicy` fields replace framework-specific roles like `Master` and `Worker`.

### Version compatibility table

The following table lists compatibility between Kubeflow Trainer versions, supported APIs, and minimum Kubernetes versions:

| Trainer version | API version | CRDs introduced                                | Minimum Kubernetes version | Notes                        |
|-----------------|-------------|-------------------------------------------------|-----------------------------|-------------------------------|
| v1.4–v1.8       | v1          | `PyTorchJob`, `TFJob`, `MPIJob`, etc.          | 1.23+                       | Training Operator style       |
| v1.9+           | v2alpha1    | `TrainingRuntime`, `TrainJob`, `ClusterTrainingRuntime` | 1.31.3+                     | Trainer v2 (breaking changes) |

### Additional information

- Trainer v2 does not use individual CRDs per framework. Instead, it abstracts functionality into a unified runtime specification.
- You can use the `Kubeflow Python SDK` to generate and submit Trainer v2 workloads programmatically.
- Initializer and multi-node coordination logic is managed by the system, reducing overhead on the training container.
- Support for specifying `managedBy` fields and runtime API versions (via `runtimeRef.version`) is under consideration.

You can find detailed proposals and discussion [in the Kubeflow Trainer GitHub repository](https://github.com/kubeflow/trainer/tree/master/docs/proposals).

