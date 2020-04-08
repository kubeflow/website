+++
title = "Caching"
description = "Getting started with Kubeflow Pipelines step caching"
weight = 50
+++

Starting from Kubeflow Pipelines 0.4, Kubeflow Pipelines supports step caching capabilities in both standalone deployment and GCP hosted deployment.

## Before you start

This guide tells you the basic concepts of Kubeflow Pipelines step caching and how to use it. This guide assumes that you already have Kubeflow Pipelines installed or want to use standalone or GCP hosted deployment options in the [Kubeflow Pipelines deployment 
guide](/docs/pipelines/installation/) to deploy Kubeflow Pipelines.

## What is step caching?

Kubeflow Pipelines caching provides step-level output caching on [Kubeflow Pipelines SDK](/docs/pipelines/sdk) only. A step output will be taken from cache if this step template and input does not change. The change includes step name, input artifacts, parameters and underlying logic change. Step output passed in a GCS bucket has not been included in this cache support yet. A cached entry is managed by Kubeflow Pipelines database and will never expire by default. To control caching behavior and change cache entry staleness, please see sections below. With step caching, the output of a certain step can be re-used and we can save the efforts of re-executing previous steps.  

## Disabling/enabling caching

Cache is enabled by default after Kubeflow Pipelines 0.4. These are instructions on disabling and enabling cache service:

### Configure access to your Kubeflow cluster

Use the following instructions to configure `kubectl` with access to your
Kubeflow cluster. 

1.  To check if you have `kubectl` installed, run the following command:

    ```bash
    which kubectl
    ```

    The response should be something like this:

    ```bash
    /usr/bin/kubectl
    ```

    If you do not have `kubectl` installed, follow the instructions in the
    guide to [installing and setting up kubectl][kubectl-install].

2.  Follow the [guide to configuring access to Kubernetes
    clusters][kubectl-access]. 

### Disabling caching in your Kubeflow Pipelines deployment:

1. Make sure `mutatingwebhookconfiguration` exists in your cluster:

    ```
    export NAMESPACE=<Namespace where KFP is installed>
    kubectl get mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE}
    ```
2. Change `mutatingwebhookconfiguration` rules:

    ```
    kubectl patch mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE} --type='json' -p='[{"op":"replace", "path": "/webhooks/0/rules/0/operations/0", "value": "DELETE"}]'
    ```

### Enabling caching

1. Make sure `mutatingwebhookconfiguration` exists in your cluster:

    ```
    export NAMESPACE=<Namespace where KFP is installed>
    kubectl get mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE}
    ```
2. Change back `mutatingwebhookconfiguration` rules:

    ```
    kubectl patch mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE} --type='json' -p='[{"op":"replace", "path": "/webhooks/0/rules/0/operations/0", "value": "CREATE"}]'
    ```

## Managing the `max_cache_staleness`

For a given step, you can set step's `max_cache_staleness` to control the staleness of a target step. The `max_cache_staleness` is in [RFC3339 Duration](https://www.ietf.org/rfc/rfc3339.txt) format(Eg. 30 days = P30D). By default the `max_cache_staleness` will be set to infinity and never gets expired.

Set `max_cache_staleness` to 30 days for a step:

```
def some_pipeline():
      # task is a target step in a pipeline
      task = some_op()
      task.execution_options.caching_strategy.max_cache_staleness = "P30D"
```

Setting `max_cache_staleness` to 0 for a step means this step output will never be taken from cache:

```
def some_pipeline():
      # task is a target step in a pipeline
      task_never_use_cache = some_op()
      task_never_use_cache.execution_options.caching_strategy.max_cache_staleness = "P0D"
```

[kubectl-access]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/install-kubectl/