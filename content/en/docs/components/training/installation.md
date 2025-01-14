+++
title = "Installation"
description = "How to install the Kubeflow SDK"
weight = 20
+++

This guide describes how to install the Kubeflow Python SDK to manage your TrainJobs.

## Prerequisites

Ensure that you have access to a Kubernetes clusters with the Kubeflow Training
control plane installed. If it is not set up yet, follow
[the installation guide](/docs/components/training/admin-guides/installation) to quickly deploy
Kubeflow Training on a local Kind cluster.

## Installing the Kubeflow SDK

You can chose between installing the latest stable release of the development version from
the source.

### Install the Latest Stable Release

Run the following command:

```bash
pip install kubeflow
```

### Install from Source

Run the following command to install the latest version directly from the source repository:

TODO (andreyvelich): Fix path when it is changed.

```bash
pip install git+https://github.com/kubeflow/training-operator.git@master#subdirectory=sdk_v2
```

## Next steps

Start your first TrainJob by following the [Getting Started guide](/docs/components/training/getting-started/).
