+++
title = "Getting Started"
description = "Get Started with Kubeflow Trainer"
weight = 30
+++

This guide describes how to get started with Kubeflow Trainer and run distributed training
with PyTorch.

## Prerequisites

Ensure that you have access to a Kubernetes cluster with Kubeflow Trainer
control plane installed. If it is not set up yet, followÍ
[the installation guide](/docs/components/trainer/operator-guides/installation) to quickly deploy
Kubeflow Trainer on your local Kind cluster.

### Installing the Kubeflow Python SDK

Install the Kubeflow Python SDK to interact with Kubeflow Trainer APIs:

```bash
pip install kubeflow
```

Alternatively, install the latest Kubeflow Python SDK version directly
from the source repository:

```bash
pip install git+https://github.com/kubeflow/training-operator.git@master#subdirectory=sdk_v2
```

## Getting Started with PyTorch

TODO (andreyvelich): Add example from the Notebook
