+++
title = "Runtime Guide"
description = "How to manage Runtimes with Kubeflow Trainer"
weight = 30
+++

## Overview
This guide explains how cluster administrators should manage `TrainingRuntime` and `ClusterTrainingRuntime`. It describes how to configure `MLPolicy`, `PodGroupPolicy`, and `Template` APIs.

**Note**: **Runtimes** are the configurations or the blueprints which has the optimal configuration to run desired/specific task.

### What is ClusterTrainingRuntime
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
In Kubeflow, a ClusterTrainingRuntime defines a reusable template for distributed training, specifying node count, processes, and scheduling policies. A TrainJob references this runtime via the runtimeRef field, linking to its apiGroup, kind and name. This enables the TrainJob to use the runtime’s configuration for consistent and modular training setups.

```YAML
    apiVersion: trainer.kubeflow.org/v2alpha1
    kind: TrainJob
    metadata:
        name: example-train-job
        namespace: default
    spec:
      runtimeRef:
        apiGroup: kubeflow.org
        name: torch-cluster-runtime
        kind: ClusterTrainingRuntime
        ...
```
### What is TrainingRuntime

The TrainingRuntime is a namespace-scoped API in Kubeflow Trainer that allows platform administrators to manage templates for TrainJobs per namespace. It can be perfect for teams or projects that need their own customized training setups, offering flexibility for decentralized control.

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
          torch:
            numProcPerNode: 4
      template:
          spec:
            containers:
              - name: pytorch-container
                image: pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime
                command: ["python", "/path/to/train.py"]
                resources:
                  requests:
                    cpu: "1"
                    memory: "2Gi"
                    nvidia.com/gpu: "1"
                  limits:
                    cpu: "2"
                    memory: "4Gi"
                    nvidia.com/gpu: "1"
```
Referencing: When using TrainingRuntime, the Kubernetes namespace must be the same as the TrainJob's namespace.

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

To define MLPolicy in ClusterTrainingRuntime or TrainingRuntime:
```YAML
mlPolicy:
  numNodes: 3
  torch:
    numProcPerNode: "gpu"
```

#### Torch and MPI
- **Torch**: Configures distributed training for PyTorch jobs. Use this policy to set options like the number of processes per node (`numProcPerNode`) for PyTorch distributed workloads.
- **MPI**: Configures distributed training using MPI. This policy allows you to specify options such as the number of processes per node and MPI implementation details.

For a complete list of available options and detailed API fields, refer to the [Kubeflow Trainer API reference](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#MLPolicy).
### What is Template

The `Template` API configures [the JobSet template](https://jobset.sigs.k8s.io/docs/overview/) to execute the TrainJob. Kubeflow Trainer controller manager creates the appropriate JobSet based on `Template` and other configurations from the runtime (e.g. `MLPolicy`).

#### Template Configuration 

For each job in replicatedJobs, you can provide detailed settings, like the container image, commands, and resource requirements.
Here's an example below.
```YAML
replicatedJobs:
  - name: initializer
        template:
          spec:
            template:
              spec:
                containers:
                  - name: init-container
                    image: busybox
                    command: ["echo", "Initializing..."]
      - name: node
        template:
          spec:
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

### Ancestor Label Requirements for ReplicatedJobs
When defining `replicatedJobs` such as `initializer` and `node`, it is important to ensure that each job template includes the necessary ancestor labels. These labels are used by the Kubeflow Trainer controller to inject values from the TrainJob to the underlying training job.

**Required Labels:**
- `trainer.kubeflow.org/trainjob-ancestor-step`: Specifies the role or step of the replicated job in the training workflow (e.g., `dataset-initializer`, `model-initializer` or `trainer`).

**Example:**
```YAML
apiVersion: kubeflow.org/v2alpha1
kind: ClusterTrainingRuntime
metadata:
  name: example-runtime
spec:
  template:
    spec:
      replicatedJobs:
        - name: dataset-initializer
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: dataset-initializer
            spec:
              template:
                spec:
                  containers:
                    - name: dataset-initializer
                      image: ghcr.io/kubeflow/trainer/dataset-initializer
        - name: model-initializer
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: model-initializer
            spec:
              template:
                spec:
                  containers:
                    - name: model-initializer
                      image: ghcr.io/kubeflow/trainer/model-initializer
        - name: node
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              template:
                spec:
                  containers:
                    - name: node
                      image: ghcr.io/kubeflow/trainer/torchtune-trainer
```
