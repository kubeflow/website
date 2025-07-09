+++
title = "Runtime Guide"
description = ""
weight = 30
+++

## Overview
This guide explains how cluster administrators should manage `TrainingRuntime` and `ClusterTrainingRuntime`. It describes how to configure `MLPolicy`, `PodGroupPolicy`, and `Template` APIs.

**Note**: **Runtimes** are the configurations or the blueprints which has the optimal configuration to run desired/specific task.

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
        apiVersion: kubeflow.org/v2alpha1
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
```   

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

#### Torch and MPI
- **Torch**: Configures distributed training for PyTorch jobs. Use this policy to set options like the number of processes per node (`numProcPerNode`) for PyTorch distributed workloads.
- **MPI**: Configures distributed training using MPI. This policy allows you to specify options such as the number of processes per node and MPI implementation details.

For a complete list of available options and detailed API fields, refer to the [Kubeflow Trainer API reference](https://pkg.go.dev/github.com/kubeflow/training-operator@v1.9.2/pkg/apis/kubeflow.org/v2alpha1#MLPolicy).

### What is Template ?
The `Template` API configures [the JobSet template](https://jobset.sigs.k8s.io/docs/overview/) to execute the TrainJob. Kubeflow Trainer controller manager creates the appropriate JobSet based on `Template` and other configurations from the runtime (e.g. `MLPolicy`).

#### Template Configuration 
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

### Ancestor Label Requirements for ReplicatedJobs
When defining `replicatedJobs` such as `initializer` and `trainer-node` (or `node`), it is important to ensure that each job template includes the necessary ancestor labels. These labels are used by the Kubeflow Trainer controller to track job lineage, manage dependencies, and enable correct orchestration of distributed training jobs.

**Required Labels:**
- `kubeflow.org/ancestor`: Identifies the parent resource (e.g., the `TrainJob` or runtime) that created this job.
- `kubeflow.org/role`: Specifies the role of the replicated job, such as `initializer` or `node`.

**Example:**
```YAML
replicatedJobs:
  - name: initializer
    template:
      metadata:
        labels:
          kubeflow.org/ancestor: example-train-job
          kubeflow.org/role: initializer
      spec:
        containers:
          - name: init-container
            image: busybox
            command: ["echo", "Initializing..."]
  - name: trainer-node
    template:
      metadata:
        labels:
          kubeflow.org/ancestor: example-train-job
          kubeflow.org/role: node
      spec:
        containers:
          - name: trainer-container
            image: pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime
            command: ["python", "/path/to/train.py"]
```

> **Note:**  
> These labels must be present in the metadata of each replicated job template. The controller uses them to manage job dependencies and ensure correct execution order.