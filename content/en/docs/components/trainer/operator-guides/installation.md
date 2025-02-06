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

Run the following command to deploy the Kubeflow Trainer controller manager:

```bash
kubectl apply --server-side -k "https://github.com/kubeflow/training-operator.git/manifests/overlays/manager?ref=master"
```

Ensure that the JobSet and Trainer controller manager pods are running:

```bash
$ kubectl get pods -n kubeflow-system

NAME                                                READY   STATUS    RESTARTS   AGE
jobset-controller-manager-59fc8bf679-7qb9x          2/2     Running   0          1m
trainer-controller-manager-7b9949cc86-756rx         1/1     Running   0          1m
```

## Installing the Kubeflow Training Runtimes

Run the following command to deploy the Kubeflow Training Runtimes:

```bash
kubectl apply --server-side -k "https://github.com/kubeflow/training-operator.git/manifests/overlays/runtimes?ref=master"
```

## Next Steps

- How to [migrate from Kubeflow Training Operator V1](/docs/components/trainer/operator-guides/migration).
