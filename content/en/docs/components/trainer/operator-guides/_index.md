+++
title = "Operator Guides"
description = "Documentation for cluster operators of Kubeflow Trainer"
weight = 50
+++

## Overview
The Kubeflow Trainer Operator is a Kubernetes operator designed to simplify the management of machine learning (ML) training jobs within a Kubeflow environment. It automates the orchestration of distributed training jobs for popular frameworks like TensorFlow, PyTorch, and MXNet, making it easier to scale and manage ML workloads on Kubernetes.
This is a guide for Operator which specifically focuses on Kubeflow trainer Runtime specifically on `TrainingRuntime` and `ClusterTrainingRuntime` as rebel Runtimes and configurations of their components `mlPolicy` and `Templete(Jobset)`.

{{% alert title="Old Version" color="warning" %}}
Runtimes are the configurations or the blueprints which has the optimal configuration to run desired/specific task.
{{% /alert %}}

### What is `ClusterTrainingRuntime`?
ClusterTrainingRuntime is a capability in Kubeflow Trainer that allows the Ops(DEVOPS/MLOPS) engineer to define and manage a training runtime at the cluster level. This means the runtime is set up once for the entire Kubernetes cluster and can then be accessed and reused by all ML engineers, no matter which tenant they belong to. It simplifies the process of running training jobs for ML engineers by providing a standardized, ready-to-use environment.

- Example:
    - Defining :
        ```YAML
        apiVersion: kubeflow.org/v2alpha1
        kind: ClusterTrainingRuntime
        metadata:
            name: torch-cluster-runtime
        spec:
        mlPolicy:
            numNodes: 2
            torch:
            numProcPerNode: auto
        podGroupPolicy:
            coscheduling:
            scheduleTimeoutSeconds: 100
        template:
            spec:
            replicatedJobs:
                - name: initializer
                - name: trainer-node
        ```
    - Referencing:
        ```YAML
        apiVersion: trainer.kubeflow.org/v2alpha1
        kind: TrainJob
        metadata:
            name: example-train-job
            namespace: default #any namespace
        spec:
            runtimeRef:
                name: example-cluster-training-runtime
                kind: torch-cluster-runtime
            ...
        ```

### What is `TrainingRuntime`?
The Training Runtime on the other hand is a runtime defined at the namespace level. This means that the runtime once defined is specific for only a particular namespace. It can be perfect for teams or projects that need their own customized training setups, offering flexibility for decentralized control.

- Example:
    - Defining :
        ```YAML
        apiVersion: kubeflow.org/v2alpha1
        kind: TrainingRuntime
        metadata:
            name: pytorch-team-runtime
            namespace: team-a
        spec:
        mlPolicy:
            numNodes: 1
            pytorch:
            numProcPerNode: 4
        template:
            spec:
            containers:
                - name: pytorch-container
                image: pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime
                command: ["python", "/path/to/train.py"]
        ```
    - Reference:
        ```YAML
            apiVersion: trainer.kubeflow.org/v2
            kind: TrainJob
            metadata:
                name: example-train-job
                namespace: team-a # Only accessible to the namespace for which it is defined
            spec:
            runtimeRef:
                name: pytorch-team-runtime
                kind: TrainingRuntime
            ...

### `mlPolicy` Configurations

`mlPolicy` configures the model training with ML-specific parameters. It supports runtime-specific configurations for various technologies like PyTorch and MPI.

Configuration
Define MLPolicy in ClusterTrainingRuntime or TrainingRuntime:
```YAML
mlPolicy:
  numNodes: 3
  torch:
    numProcPerNode: "gpu"
```

Options:
- numNodes: Number of training nodes (default: 1).
- torch: Configuration for the PyTorch runtime.
    - numProcPerNode: Number of processes per node (auto, cpu, gpu, or int value).
    - elasticPolicy: Configuration for PyTorch elastic training.
        - maxRestarts: Maximum number of restarts.
        - minNodes: Minimum number of nodes.
        - maxNodes: Maximum number of nodes.
        - metrics: Metrics for auto-scaling.
- mpi: Configuration for the MPI runtime.
    - numProcPerNode: Number of processes per node (default: 1).
    - mpiImplementation: MPI implementation (OpenMPI, Intel, MPICH).
    - sshAuthMountPath: Directory where SSH keys are mounted (default: /root/.ssh).
    - runLauncherAsNode: Whether to run the training process on the launcher job (default: false).
- Tensorflow(Inprogress)
- JAX(Inprogress)

### What is a Template(Jobset) in Kubeflow?
A Jobset Template in Kubeflow is a reusable configuration that defines a collection of jobs (called replicated jobs) that work together, often for distributed machine learning tasks like training models. It specifies how these jobs are structured, scheduled, and executed across multiple nodes or pods in a Kubernetes cluster. This is especially useful for workflows where you need multiple components—like an initialization step and a training step—to coordinate efficiently.

#### `Templete` Configuration 
For each job in replicatedJobs, you can provide detailed settings, like the container image, commands, and resource requirements.
Here's an example below.
```YAML
replicatedJobs:
        - name: initializer
          template:
            spec:
              containers:
                - name: init-container
                  image: busybox
                  command: ["echo", "Initializing..."]
        - name: trainer-node
          template:
            spec:
              containers:
                - name: trainer-container
                  image: pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime
                  command: ["python", "/path/to/train.py"]
                  resources:
                    requests:
                      cpu: "2"
                      memory: "4Gi"
                    limits:
                      nvidia.com/gpu: "1"
```

Kubeflow has some Dedicated replicated jobset templete, Below is an example: 
```YAML
replicatedJobs:
  - name: trainer-node
    containers:
      - name: trainer
        image: docker.io/kubeflow/torch-llm-trainer
        resources:
          limits:
            nvidia.com/gpu: 4
        volumeMounts:
          - mountPath: /workspace/dataset
            name: storage-initializer
          - mountPath: /workspace/model
            name: storage-initializer
    volumes:
      - name: storage-initializer
        persistentVolumeClaim:
          claimName: storage-initializer
```