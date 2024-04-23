+++
title = "Installation"
description = "How to install Training Operator"
weight = 20
+++

This guide describes how to install Training Operator on your Kubernetes cluster.
Training Operator is a lightweight Kubernetes controller that orchestrates appropriate Kubernetes
workloads to perform distributed ML training and fine-tuning.

## Prerequisites

These are minimal requirements to install Training Operator:

- Kubernetes >= 1.27
- `kubectl` >= 1.27

## Installing Training Operator

You can skip these steps if you have already
[installed Kubeflow platform](https://www.kubeflow.org/docs/started/installing-kubeflow/#how-to-install-kubeflow)
using manifests or package distributions. Kubeflow platform includes Training Operator.

You can install Training Operator as a standalone component.

Run the following command to install the stable release of Training Operator: `v1.7.0`

```shell
kubectl apply -k "github.com/kubeflow/training-operator/manifests/overlays/standalone?ref=v1.7.0"
```

Run the following command to install the latest changes of Training Operator:

```shell
kubectl apply -k "github.com/kubeflow/training-operator/manifests/overlays/standalone?ref=v1.7.0"
```

After installing Training Operator, you can verify that controller is running as follows:

```shell
$ kubectl get pods -n kubeflow

NAME                                             READY   STATUS    RESTARTS   AGE
training-operator-658c68d697-46zmn               1/1     Running   0          90s
```

## Installing Training Operator Python SDK

Training Operator [implements Python SDK](https://pypi.org/project/kubeflow-training/)
to simplify creation of distributed training and fine-tuning jobs for Data Scientists.

Run the following command to install the stable release of Training Operator SDK:

```shell
pip install -U kubeflow-training
```

You can also install the Python SDK using the specific GitHub commit, for example:

```shell
pip install git+https://github.com/kubeflow/training-operator.git@7345e33b333ba5084127efe027774dd7bed8f6e6#subdirectory=sdk/python
```

### Install Python SDK with Fine-Tuning Capabilities

If you want to use `train` API for LLM fine-tuning with Training Operator, install the Python SDK
with the additional packages from HuggingFace:

```shell
pip install -U kubeflow-training[huggingface]
```

## Next steps

Run your first training Job following the [Getting Started guide](/docs/components/training/getting-started/).
