+++
title = "Getting Started"
description = "Get Started with the Kubeflow Training"
weight = 30
+++

This guide describes how to get started with the Kubeflow Training and run distributed
PyTorch training.

## Prerequisites

Ensure that you have access to a Kubernetes cluster with the Kubeflow Training
control plane installed. If it is not set up yet, follow
[the installation guide](/docs/components/training/admin-guides/installation) to quickly deploy
Kubeflow Training on a local Kind cluster.

## Installing the Kubeflow Python SDK

Install the Kubeflow Python SDK to interact with Kubeflow Training APIs:

```bash
pip install kubeflow
```

Alternatively, you can install the latest version directly from the source repository:

```bash
pip install git+https://github.com/kubeflow/training-operator.git@master#subdirectory=sdk_v2
```

## Getting Started with PyTorch

TODO (andreyvelich): Add example from the Notebook
