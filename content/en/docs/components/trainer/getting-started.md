+++
title = "Getting Started"
description = "Get Started with Kubeflow Trainer"
weight = 30
+++

This guide describes how to get started with Kubeflow Trainer and run distributed training
with PyTorch.

## Prerequisites

Ensure that you have access to a Kubernetes cluster with Kubeflow Trainer
control plane installed. If it is not set up yet, follow
[the installation guide](/docs/components/trainer/operator-guides/installation) to quickly deploy
Kubeflow Trainer.

### Installing the Kubeflow Python SDK

Install the latest Kubeflow Python SDK version directly from the source repository:

```bash
pip install git+https://github.com/kubeflow/trainer.git@master#subdirectory=sdk
```

## Getting Started with PyTorch

TODO (andreyvelich): Add example from the Notebook

Before creating Kubeflow TrainJob, defines the training function that implements end-to-end model
training. Each PyTorch node will execute this function using the appropriate distributed environment.

Usually, this function contains log to download dataset, create model, and train the model.

Kubeflow Trainer will automatically configure distributed environment for PyTorch to perform
[Distributed Data Parallel (DDP)](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html).

```python


```
