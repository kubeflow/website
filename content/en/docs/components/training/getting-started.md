+++
title = "Getting Started"
description = "Get Started with Kubeflow Training"
weight = 30
+++

This guide describes how to get started with Kubeflow Training and run distributed training
with PyTorch.

## Prerequisites

Ensure that you have access to a Kubernetes cluster with Kubeflow Training
control plane installed. If it is not set up yet, follow
[the installation guide](/docs/components/training/admin-guides/installation) to quickly deploy
Kubeflow Training on a local Kind cluster.

### Installing the Kubeflow Python SDK

Install the Kubeflow Python SDK to interact with Kubeflow Training APIs:

```bash
pip install kubeflow
```

Alternatively, you can install the latest Kubeflow Python SDK version directly
from the source repository:

```bash
pip install git+https://github.com/kubeflow/training-operator.git@master#subdirectory=sdk_v2
```

## Getting Started with PyTorch

TODO (andreyvelich): Add example from the Notebook
