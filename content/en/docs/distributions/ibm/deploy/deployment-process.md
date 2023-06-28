+++
title = "Kubeflow Deployment Process"
description = "How kubeflow installation works"
weight = 5
+++

## Understanding the Kubeflow deployment process

The deployment process is controlled by the following commands:

* **kustomize build** - Use kustomize to generate configuration files defining
  the various resources for your deployment. .
* **kubectl apply** - Apply the resources created by `kustomize build` to the
  kubenetes cluster

### Repository layout

IBM manifests repository contains the following files and directories:

* **iks-single** directory: A kustomize file for single-user deployment
* **iks-multi** directory: A kustomize file for multi-user deployment

* **others** Other files are used to compose Kubeflow resources

## Kubeflow installation

Starting from Kubeflow 1.3, the official installation documentation uses a combination of `kustomize` and `kubectl` to install Kubeflow.

### Install kubectl and kustomize

* [Install kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) 
* [Download kustomize 5.0.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv5.0.0)

 ## Next Steps

 1. Check [Kubeflow Compatibility](/docs/distributions/ibm/deploy/iks-compatibility)
 2. Go here for installing [Kubeflow on IKS](/docs/distributions/ibm/deploy/install-kubeflow-on-iks)
 3. Go here for installing [Kubeflow on IBM OpenShift](/docs/distributions/ibm/deploy/install-kubeflow-on-ibm-openshift)
