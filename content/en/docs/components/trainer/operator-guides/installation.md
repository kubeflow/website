+++
title = "Installation"
description = "How to install Kubeflow Trainer control plane"
weight = 10
+++

This guide describes how to install Kubeflow Trainer control plane on a Kubernetes cluster.

You can skip these steps if [the Kubeflow platform](https://www.kubeflow.org/docs/started/installing-kubeflow/)
is already deployed using manifests or package distributions, as it includes Kubeflow Trainer by default.

## Prerequisites

These are the minimal requirements to install Kubeflow Trainer control plane:

- Kubernetes >= 1.28
- `kubectl` >= 1.28

{{% alert title="Tip" color="primary" %}}
If you don't have Kubernetes cluster, you can quickly create one locally using [Kind](https://kind.sigs.k8s.io/docs/user/quick-start#installing-with-a-package-manager):

```bash
kind create cluster # or minikube start
```

{{% /alert %}}

## Installing the Kubeflow Trainer Controller Manager

Run the following command to deploy a released version of Kubeflow Trainer controller manager:

```bash
VERSION=v2.0.0
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/manager?ref=${VERSION}"
```

For the latest changes run:

```bash
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/manager?ref=master"
```

Ensure that the JobSet and Trainer controller manager pods are running:

```bash
$ kubectl get pods -n kubeflow-system

NAME                                                  READY   STATUS    RESTARTS   AGE
jobset-controller-manager-54968bd57b-88dk4            2/2     Running   0          65s
kubeflow-trainer-controller-manager-cc6468559-dblnw   1/1     Running   0          65s
```

## Installing the Kubeflow Training Runtimes

Run the following command to deploy a released version of Kubeflow Training Runtimes:

```bash
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/runtimes?ref=${VERSION}"
```

For the latest changes run:

```bash
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/runtimes?ref=master"
```

## Next Steps

- How to [migrate from Kubeflow Training Operator v1](/docs/components/trainer/operator-guides/migration).
- Explore [the Kubeflow Trainer Runtime guide](docs/components/trainer/operator-guides/runtime)
