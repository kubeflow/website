+++
title = "Operator Guides"
description = "Documentation for cluster operators of Kubeflow Trainer"
weight = 50
+++

## Overview
This is a guide explains how cluster administrators should manage `TrainingRuntime` and `ClusterTrainingRuntime`. It describes how to configure `MLPolicy`, `PodGroupPolicy`, and `Template` APIs.

{{% alert title="Old Version" color="warning" %}}
Runtimes are the configurations or the blueprints which has the optimal configuration to run desired/specific task.
{{% /alert %}}

### What is ClusterTrainingRuntime?
The ClusterTrainingRuntime is a cluster-scoped API in Kubeflow Trainer that allows platform administrators to manage templates for TrainJobs. Runtimes can be deployed across the entire Kubernetes cluster and reused by ML engineers in their TrainJobs. It simplifies the process of running training jobs by providing standardized blueprints and ready-to-use environments.

### Example of ClusterTrainingRuntime

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
          apiGroup: kubeflow.org
          name: example-cluster-training-runtime
          kind: ClusterTrainingRuntime
            ...
    ```

### What is TrainingRuntime?
The Training Runtime on the other hand is a runtime defined at the namespace level. This means that the runtime once defined is specific for only a particular namespace. It can be perfect for teams or projects that need their own customized training setups, offering flexibility for decentralized control.

### Example of TrainingRuntime

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
            apiGroup: kubeflow.org
            name: pytorch-team-runtime
            kind: TrainingRuntime
        ...

### What is MLPolicy

The `MLPolicy` API configures the ML-specific parameters. For example, configuration for PyTorch Distributed or MPI hostfile location.

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

### What is Template ?

The `Template` API configures [the JobSet template](https://jobset.sigs.k8s.io/docs/overview/) to execute the TrainJob. Kubeflow Trainer controller manager creates the appropriate JobSet based on `Template` and other configurations from the runtime (e.g. `MLPolicy`).

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