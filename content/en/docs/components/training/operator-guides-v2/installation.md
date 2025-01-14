+++
title = "Installation"
description = "How to install the Kubeflow Training control plane"
weight = 10
+++

This guide describes how to install the Kubeflow Training control plane on a Kubernetes cluster.

You can skip these steps if [the Kubeflow platform](https://www.kubeflow.org/docs/started/installing-kubeflow/)
is already deployed using manifests or package distributions, as it includes Kubeflow Training by default.

## Prerequisites

These are the minimal requirements to install the Kubeflow Training control plane:

- Kubernetes >= 1.28
- `kubectl` >= 1.28

{{% alert title="Tip" color="primary" %}}
If you don't have Kubernetes cluster, you can quickly create one locally using [Kind](https://kind.sigs.k8s.io/docs/user/quick-start#installing-with-a-package-manager):

```bash
brew install kind
kind create cluster
```

{{% /alert %}}

## Installing the Kubeflow Training Manager

Run the following command to deploy the Kubeflow Training manager:

TODO (andreyvelich): Change the link once V1 is removed.

```bash
kubectl apply --server-side -k "github.com/kubeflow/training-operator.git/manifests/v2/overlays/manager?ref=master"
```

Ensure that the JobSet controller and Training Operator V2 pods are running:

TODO (andreyvelich): Add command to print output of

```bash
$ kubectl get pods -n kubeflow-system

```

## Installing the Kubeflow Training Runtimes

Run the following command to deploy the Kubeflow Training Runtimes:

```bash
kubectl apply --server-side -k "github.com/kubeflow/training-operator.git/manifests/v2/overlays/runtimes?ref=master"
```

## Next Steps

- How to [migrate from Kubeflow Training V1](/docs/components/training/admin-guides/migration).
