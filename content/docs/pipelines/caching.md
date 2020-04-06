+++
title = "Caching"
description = "Getting start with Kubeflow Pipelines step caching"
weight = 50
+++

Starting from Kubeflow Pipelines v0.4, Kubeflow Pipelines supports the step caching capabilities in both standalone deployment and marketplace deployment.

## Before you start

This guide tells you the basic concepts of Kubeflow Pipelines step caching and how to use it. This guide assumes that you already have Kubeflow Pipelines installed or want to use standalone or marketplace deployment options in the [Kubeflow Pipelines deployment 
guide](/docs/pipelines/installation/) to deploy Kubeflow Pipelines.

## What is step caching?

Kubeflow Pipelines step caching provides step-level output caching. For a single pipeline, a step output will be taken from cache if this step template and input does not change. With step caching, the output of a certain step can be shareable and already existing step can prevent re-executing.  

## Installation

Caching is installed by default after Kubeflow Pipelines v0.4. You can follow the instructions of [Upgrading or reinstalling Kubeflow Pipelines](/docs/pipelines/upgrade) to upgrade or reinstall your Kubeflow Pipelines.


## Control caching behavior

### Configure kubectl to talk to your cluster
See the Google Kubernetes Engine (GKE) guide to [configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

### Switch off caching in your Kubeflow Pipelines deployment:

1. Make sure mutatingwebhookconfiguration exists in your cluster:

    ```
    export NAMESPACE=namespace_kfp_installed
    kubectl get mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE}
    ```
2. Change mutatingwebhookconfiguration rules:

    ```
    kubectl patch mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE} --type='json' -p='[{"op":"replace", "path": "/webhooks/0/rules/0/operations/0", "value": "DELETE"}]'
    ```

### Switch on caching

1. Make sure mutatingwebhookconfiguration exists in your cluster:

    ```
    export NAMESPACE=namespace_kfp_installed
    kubectl get mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE}
    ```
2. Change back mutatingwebhookconfiguration rules:

    ```
    kubectl patch mutatingwebhookconfiguration cache-webhook -n ${NAMESPACE} --type='json' -p='[{"op":"replace", "path": "/webhooks/0/rules/0/operations/0", "value": "CREATE"}]'
    ```
