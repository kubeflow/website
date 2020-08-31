+++
title = "Installing Kubeflow Operator"
description = "Instructions for installing the Kubeflow Operator"
weight = 5
+++

This guide describes how to install the Kubeflow Operator.

There are different ways to install the Kubeflow Operator, choose one of the following:

## 1. Installing the Kubeflow Operator through the [operatorhub.io](https://operatorhub.io/operator/kubeflow)

The stable release of Kubeflow Operator is published to the [operatorhub.io](https://operatorhub.io). Navigate to the [operatorhub.io](https://operatorhub.io/operator/kubeflow), click on the `Install` and follow the instructions there to install the operator. 

<img src="/docs/images/operator-operatorhubio-kubeflow.png" 
    alt="Kubeflow Operator in OperatorHub"
    class="mt-3 mb-3 border border-info rounded">

Verify the Kubeflow Operator is running with following command.

```shell
kubectl get pod -n operators

NAME                                 READY   STATUS    RESTARTS   AGE
kubeflow-operator-55876578df-25mq5   1/1     Running   0          17h
```

## 2. Installing the Kubeflow Operator with `kustomize` and `kubectl`

Previous method is convenient and simple enough without any knowledges of the Operator SDK. However, if any of the following reasons applies, choose this approach to install the operator.

1. You want to install a different release of Kubeflow Operator since the Kubeflow KfDef manifests may not be compatible from release to release.
2. You want to install the latest release of Kubeflow Operator.

### Prerequisites

* Install [kustomize](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/INSTALL.md)

### Clone the [`kfctl`](https://github.com/kubeflow/kfctl.git) repo and switch to the desired release branch

Clone the repo and switch to the desired release branch with the following `git` commands

```shell
git clone https://github.com/kubeflow/kfctl.git
cd kfctl
git checkout v1.1-branch
```

### Create `operators` namespace and update the operator manifests

The `operators` namespace is the namespace where the Kubeflow Operator will be installed to. Create the namespace and update the manifests with these commands

```shell
export OPERATOR_NAMESPACE=operators
kubectl create ns ${OPERATOR_NAMESPACE}

cd deploy
kustomize edit set namespace ${OPERATOR_NAMESPACE}

# only deploy this if the k8s cluster is 1.15+ and has resource quota support, which will allow only one _kfdef_ instance or one deployment of Kubeflow on the cluster. This follows the singleton model, and is the current recommended and supported mode.
# kustomize edit add resource kustomize/include/quota
```

### Install the operator

Install the Kubeflow Operator with the `kustomize` and `kubectl` commands

```shell
kustomize build | kubectl apply -f -
```

Verify the Kubeflow Operator is running with following command.

```shell
kubectl get pod -n operators

NAME                                 READY   STATUS    RESTARTS   AGE
kubeflow-operator-55876578df-25mq5   1/1     Running   0          17h
```
