+++
title = "ML Policy"
description = "How to configure MLPolicy in Kubeflow Trainer Runtimes"
weight = 50
+++

This guide describes how to configure
[the `MLPolicy` API](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#MLPolicy)
in the Kubeflow Trainer Runtimes.

Before exploring this guide, make sure to follow [the Runtime guide](/docs/components/trainer/operator-guides/runtime)
to understand the basics of Kubeflow Trainer Runtimes.

## MLPolicy Overview

The `MLPolicy` API defines the ML-specific configuration for the training jobs - for example,
the number of training nodes (e.g., Pods) to launch, or PyTorch settings.

```YAML
mlPolicy:
  numNodes: 3
  torch:
    numProcPerNode: gpu
```

## Types of MLPolicy

The `MLPolicy` API supports multiple types, known as `MLPolicySources`. Each type defines how
the training job is launched and orchestrated. You can specify one of the supported sources in the
`MLPolicy` API.

### Torch

[The `Torch` policy](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#TorchMLPolicySource)
configures distributed training for PyTorch.

TrainJobs using this policy are launched via [the `torchrun` CLI](https://docs.pytorch.org/docs/stable/elastic/run.html).
You can customize `torchrun` options such as `numProcPerNode` to define number of
processes (e.g. GPUs) to launch per training node.

### MPI

[The `MPI` policy](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#MPIMLPolicySource)
configures distributed training using Message Passing Interface (MPI).

TrainJobs using this policy are launched via the `mpirun` CLI, the standard entrypoint for
MPI-based applications. This makes it compatible with frameworks like DeepSpeed which
[uses OpenMPI for distributed training](https://www.deepspeed.ai/getting-started/#launching-deepspeed-training).

You can customize the `MPI` options such as `numProcPerNode` to define the number of slots per
training node in the MPI hostfile.
