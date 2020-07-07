+++
title = "Frequently Asked Questions"
description = "Collection of most asked questions"
weight = 105
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}



### Is deploying Kubeflow with Helm supported?

No, Kubeflow only provides Kustomize packages for Kubeflow applications. So deploying Kubeflow isn't supported except via Kustomize.

Kubeflow makes use of [Kustomize](https://kustomize.io/) to help customize Kubeflow for different platforms and configurations.

However, once you deploy Kubeflow you can express Kubernetes resources using YAML, Kustomize, Helm or whatever tool you like.
