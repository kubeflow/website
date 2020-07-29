+++
title = "Installing Kubeflow Operator"
description = "Instructions for installing the Kubeflow Operator"
weight = 5
+++

This guide describes how to install the Kubeflow Operator.

There are different ways to install the Kubeflow Operator, choose one of the following:

## 1. Installing the Kubeflow Operator through the OLM console

If the [Operator Lifecycle Manger](https://github.com/operator-framework/operator-lifecycle-manager) (OLM) and the OLM [console](https://github.com/openshift/console) are installed on your cluster, you can find the Kubeflow Operator from the OperatorHub catalog under the Operators as shown on the console.

<img src="/docs/images/operator-catalog-kubeflow.png" 
    alt="Kubeflow Operator in OLM console"
    class="mt-3 mb-3 border border-info rounded">

Choose the `operators` namespace, select the Kubeflow Operator and follow the instructions there to install the operator. Verify the Kubeflow Operator is running with following command.

```shell
kubectl get pod -n operators

NAME                                 READY   STATUS    RESTARTS   AGE
kubeflow-operator-55876578df-25mq5   1/1     Running   0          17h
```

## 2. Installing the Kubeflow Operator through the [operatorhub.io](https://operatorhub.io/operator/kubeflow)

If your cluster does not have OLM installed, navigate to the [operatorhub.io](https://operatorhub.io/operator/kubeflow), click on the `Install` and follow the instructios there to install the operator. 

<img src="/docs/images/operator-operatorhubio-kubeflow.png" 
    alt="Kubeflow Operator in OperatorHub"
    class="mt-3 mb-3 border border-info rounded">

Verify the Kubeflow Operator is running with following command.

```shell
kubectl get pod -n operators

NAME                                 READY   STATUS    RESTARTS   AGE
kubeflow-operator-55876578df-25mq5   1/1     Running   0          17h
```

## 3. Installing the Kubeflow Operator with `kustomize` and `kubectl`

Previous methods install the stable release of Kubeflow Operator published to the [operatorhub.io](https://operatorhub.io). Both are convenient and simple enough without any knowledges of the Operator SDK. However, if any of the following reasons applies, choose this approach to install the operator.

1. You want to install a different release of Kubeflow Operator since the Kubeflow KfDef manifests may not be compatible from release to release.
2. You want to install the latest release of Kubeflow Operator.
3. You want to avoid the OLM but rather install the Kubeflow Operator itself.

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
