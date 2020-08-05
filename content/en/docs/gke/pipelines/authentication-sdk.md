+++
title = "Connecting to Kubeflow Pipelines on Google Cloud using the SDK"
description = "How to connect to different Kubeflow Pipelines installations on Google Cloud with Kubeflow Pipelines SDK?"
weight = 20
+++

This guide describes how to connect to your Kubeflow Pipelines on Google CLoud using [the Kubeflow Pipelines SDK](/docs/pipelines/sdk/sdk-overview/).

## Before you begin

* You need a Kubeflow Pipelines deployment on Google Cloud using one of the [installation options](/docs/pipelines/installation/overview/).
* You need to [install Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## Connecting to Kubeflow Pipelines standalone or AI Platform Pipelines

You can refer to [Connecting to AI Platform Pipelines using the Kubeflow Pipelines SDK](https://cloud.google.com/ai-platform/pipelines/docs/connecting-with-sdk) for
both Kubeflow Pipelines standalone and AI Platform Pipelines.

Kubeflow Pipelines standalone deployments also show up in [AI Platform Pipelines](https://console.cloud.google.com/ai-platform/pipelines/clusters). They have the
name "pipeline" by default, but you can customize the name by overriding
[the `appName` parameter in `params.env`](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/base/params.env#L1) when [deploying Kubeflow Pipelines standalone](/docs/pipelines/installation/standalone-deployment/).

## Connecting to Kubeflow Pipelines in a full Kubeflow deployment

