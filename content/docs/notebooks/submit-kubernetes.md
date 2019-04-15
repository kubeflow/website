+++
title = "Submit Kubernetes Resources"
description = "Submitting Kubernetes resources from a Jupyter notebook"
weight = 30
+++

The Jupyter Notebook pods are assigned the `jupyter-notebook` service account. This service account is bound to `jupyter-notebook` role which has namespace-scoped permissions to the following k8s resources:

* pods
* deployments
* services
* jobs
* tfjobs
* pytorchjobs

This means that you can directly create these k8s resources directly from your jupyter notebook. kubectl is already installed in the notebook, so you can create k8s resources running the following command in a jupyter notebook cell

```
!kubectl create -f myspec.yaml
```