+++
title = "Metadata"
description = "Tracking and managing metadata of machine learning workflows in Kubeflow"
weight = 5
+++

The goal of the [Metadata](https://github.com/kubeflow/metadata) project is to help Kubeflow users understand and manage their machine learning workflows by tracking and managing the metadata of workflows.

## Installation

The Metadata component is installed by default for Kubeflow versions >= 0.6.

If you want to install the latest version of the Metadata component or install it as an application of your Kubernetes cluster, you can follow these steps.

1. Download Kubeflow manifests repository.
```
git clone https://github.com/kubeflow/manifests
```

2. Run the following commands in the manifest repository to deploy services of Metadata component.
```
cd metadata/base
kustomize build . | kubectl apply -n kubeflow -f -
```

## Python Library

A [Python library](https://github.com/kubeflow/metadata/tree/master/sdk/python#python-client) is published for logging metadata.

You can install it via
```
pip install kfmd
```

To help you describe your ML workflows, the Python library has [predefined types](https://github.com/kubeflow/metadata/tree/master/schema) to capture models, datasets, evaluation metrics and executions.

You can find an example of how to use the logging API in this [notebook](https://github.com/kubeflow/metadata/blob/master/sdk/python/demo.ipynb).

## Backend

The backend uses [ML-Metadata](https://github.com/google/ml-metadata/blob/master/g3doc/get_started.md) to manage all the metadata and relations. It exposes a [REST API](https://github.com/kubeflow/metadata/blob/master/api/service.swagger.json).

## UI

You can view a list of logged artifacts and the details of each individual artifact via the _Artifact Store_ on [Kubeflow UIs](https://www.kubeflow.org/docs/other-guides/accessing-uis/).

