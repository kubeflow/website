+++
title = "Runtime Guide"
description = "How to manage Runtimes with Kubeflow Trainer"
weight = 30
+++

This guide explains how cluster administrators can manage TrainingRuntime and ClusterTrainingRuntime.
It describes how to configure `MLPolicy`, `PodGroupPolicy`, and `Template` APIs.

Runtimes are template configurations or blueprints that are used by TrainJob to run desired training
job.

## What is ClusterTrainingRuntime

The ClusterTrainingRuntime is a cluster-scoped API in Kubeflow Trainer that allows platform
administrators to manage templates for TrainJobs. Runtimes can be deployed across the entire
Kubernetes cluster and reused by AI practitioners in their TrainJobs. It simplifies the process of
running training jobs by providing standardized blueprints and ready-to-use environments.

### Example of ClusterTrainingRuntime

```YAML
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: torch-distributed
  labels:
    trainer.kubeflow.org/framework: torch
spec:
  mlPolicy:
    numNodes: 1
    torch:
      numProcPerNode: auto
  template:
    spec:
      replicatedJobs:
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
                      image: pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime
```

In Kubeflow, a ClusterTrainingRuntime defines a reusable template for distributed training,
specifying node count, processes, and scheduling policies. A TrainJob references this runtime
via the `RuntimeRef` API, linking to its `APIGroup`, `Kind` and `Name`. This enables the TrainJob
to use the runtime’s configuration for consistent and modular training setups.

```YAML
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: example-train-job
spec:
  runtimeRef:
    apiGroup: trainer.kubeflow.org
    name: torch-distributed
    kind: ClusterTrainingRuntime
```

## What is TrainingRuntime

The TrainingRuntime is a namespace-scoped API in Kubeflow Trainer that allows platform
administrators to manage templates for TrainJobs per namespace. It is ideal for teams or projects
that need their own customized training setups, offering flexibility for decentralized control.

### Example of TrainingRuntime

```YAML
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainingRuntime
metadata:
  name: pytorch-team-runtime
  namespace: team-a
  labels:
    trainer.kubeflow.org/framework: torch
spec:
  mlPolicy:
    numNodes: 1
    torch:
      numProcPerNode: auto
  template:
    spec:
      replicatedJobs:
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
                      image: pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime
```

{{% alert title="Note" color="info" %}}
When referencing TrainingRuntime, the Kubernetes namespace must be the same as the TrainJob's namespace
{{% /alert %}}

```YAML
apiVersion: kubeflow.org/v2alpha1
kind: TrainJob
metadata:
  name: example-train-job
  namespace: team-a # Only accessible to the namespace for which it is defined
spec:
  runtimeRef:
    apiGroup: trainer.kubeflow.org
    name: pytorch-team-runtime
    kind: TrainingRuntime
```

## Framework Label Requirement

Every deployed Runtime must have the label `trainer.kubeflow.org/framework` to ensure that
the Kubeflow SDK can recognize it. For example:

```yaml
trainer.kubeflow.org/framework: deepspeed
```

The Kubeflow SDK uses this label to determine the appropriate configuration for supported BuiltinTrainers.

## Supported Runtimes

Kubeflow Trainer community maintains
[several ClusterTrainingRuntime](https://github.com/kubeflow/trainer/tree/master/manifests/base/runtimes)
to help AI practitioners quickly experiment with Kubeflow Trainer, and to enable platform admins
to extend these runtimes to fit their specific requirement.

The following runtimes are supported for CustomTrainer:

| Runtime Name          | ML Framework                                                  |
| --------------------- | ------------------------------------------------------------- |
| torch-distributed     | [PyTorch](https://docs.pytorch.org/docs/stable/index.html)    |
| deepspeed-distributed | [DeepSpeed](https://www.deepspeed.ai/)                        |
| mlx-distributed       | [MLX](https://ml-explore.github.io/mlx/build/html/index.html) |

The following runtimes are supported for TorchTune BuiltinTrainer:

| Runtime Name          | Pre-trained LLM |
| --------------------- | --------------- |
| torchtune-llama3.2-1b | Llama 3.2 (1B)  |
| torchtune-llama3.2-3b | Llama 3.2 (3B)  |

### Runtime Deprecation Policy

Since ML frameworks naturally evolve over time, Kubeflow community may decide to deprecate
certain supported ClusterTrainingRuntimes. To avoid breaking existing users, we follow a deprecation
policy for Runtimes that are slated to be removed.

A supported ClusterTrainingRuntime may be marked as deprecated and is eligible for removal starting
from two minor releases after its deprecation.

To ensure users are aware of Runtime deprecations, the following measures are taken:

- Kubeflow Trainer release notes include the deprecation as a breaking change.
- The ClusterTrainingRuntime YAML is updated with a deprecation comment.
- If a deprecated Runtime is created, Kubeflow Trainer validation webhook prints a warning.
- If a TrainJob references a deprecated Runtime, the validation webhook also prints a warning.
- The Kubeflow SDK prints a warning when a deprecated Runtime is listed or referenced.

## Next Steps

- Learn how to configure [gang scheduling for TrainJobs](/docs/components/trainer/operator-guides/gang-scheduling).
- Explore how to set up [MLPolicy in Runtimes](/docs/components/trainer/operator-guides/ml-policy).
- See how to define [Job Template in Runtimes](/docs/components/trainer/operator-guides/job-template).
