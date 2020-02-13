+++
title = "Frequently Asked Questions"
description = ""
weight = 110
+++


### Is deploying Kubeflow with Helm supported?

No, Kubeflow only provides kustomize packages for Kubeflow applications. So deploying Kubeflow isn't supported except via kustomize.

Kubeflow makes use of [kustomize](https://kustomize.io/) to help customize YAML
configurations. With kustomize, you can traverse a Kubernetes manifest to add,
remove, or update configuration options without forking the manifest.

However, once you deploy Kubeflow you can express Kubernetes resources using Helm.
