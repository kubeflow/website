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
* [Download kustomize 3.2.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/v3.2.0)

To use the `kustomize` binary, you need to make it executable and move it to your path.

To add `kustomize` to your global path, run the following commands:

```bash
wget https://github.com/kubernetes-sigs/kustomize/releases/download/v3.2.0/<distribution>
chmod +x <distribution>
mv <distribution> /usr/local/bin/kustomize
```

Your machine might already have `kustomize` installed. If you want to temporarily add this version of `kustomize` to your path, run the following commands:

```bash
wget https://github.com/kubernetes-sigs/kustomize/releases/download/v3.2.0/<distribution>
chmod +x <distribution>
mv <distribution> /some/path/kustomize
# /some/path should not already be in path. 
export PATH=/some/path:$PATH
# order is important here. $PATH needs to be the last thing. We are trying to put our kustomize before the kustomize installtion in system.
```

 ## Next Steps

 1. Go here for installing [Kubeflow on IKS](/docs/distributions/ibm/deploy/install-kubeflow-on-iks)
 2. Go here for installing [Kubeflow on IBM OpenShift](/docs/distributions/ibm/deploy/install-kubeflow-on-ibm-openshift)
