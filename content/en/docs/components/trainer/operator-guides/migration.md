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

## Migration Paths

Kubeflow Trainer v2 introduces new APIs that replace the older, framework-specific CRDs such as `PyTorchJob`, `TFJob`, and `MPIJob`. These new APIs—`TrainingRuntime`, `TrainJob`, and `ClusterTrainingRuntime`—offer a more flexible and unified interface for defining training jobs across frameworks.

This section shows how to migrate an existing PyTorchJob to the new API.

### Migrate PyTorchJob to TrainingRuntime

The following example demonstrates how to migrate from a `PyTorchJob` (v1) to a `TrainingRuntime` (v2alpha1),  utilizing the default Torch runtime and overriding it with TrainJob.

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
### New: TrainingRuntime with TrainJob Override (v2alpha1)

```yaml
apiVersion: trainer.kubeflow.org/v2alpha1
kind: TrainJob
metadata:
  name: pytorch-simple
  namespace: kubeflow
spec:
  runtimeRef:
    name: torch-distributed  
  template:
    spec:
      containers:
        - name: trainer
          image: docker.io/kubeflowkatib/pytorch-mnist:v1beta1-45c5727
          command: ["torchrun", "/opt/pytorch-mnist/mnist.py", "--epochs=1"]
          env:
            - name: MASTER_ADDR
              value: "pytorch-simple-0"  
            - name: MASTER_PORT
              value: "29400"
      replicas: 2
```

### Additional Notes:


- The TrainingRuntime now leverages the default Torch runtime and is overridden with TrainJob to define the training configuration.

- Kubeflow Trainer provides a Python SDK, enabling ML users to programmatically submit TrainJob instances without relying on kubectl, enhancing usability and integration with Kubeflow workflows.

### Additional information

- Trainer v2 does not use individual CRDs per framework. Instead, it abstracts functionality into a unified runtime specification.
- You can use the `Kubeflow Python SDK` to generate and submit Trainer v2 workloads programmatically.
- Initializer and multi-node coordination logic is managed by the system, reducing overhead on the training container.
- Support for specifying `managedBy` fields and runtime API versions (via `runtimeRef.version`) is under consideration.

You can find detailed proposals and discussion [in the Kubeflow Trainer GitHub repository](https://github.com/kubeflow/trainer/tree/master/docs/proposals/2170-kubeflow-trainer-v2).

