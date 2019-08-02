+++
title = "Kubeflow on Existing Kubernetes Clusters"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster with list of supported options"
weight = 4
aliases = [
    "/docs/k8s/"
]
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes cluster.

If you are using a Kubernetes distribution or Cloud Provider which has specific instructions for installing Kubeflow we recommend following those instructions. Those instructions do additional Cloud specific setup to create a really great Kubeflow experience.

The following table lists the options for installing Kubeflow on an existing Kubernetes Cluster and links to detailed instructions.

### Community maintained

This section includes vendor-neutral solutions governed by community consensus. Below deployment configs are maintained and supported by the community.


|  Deployment config|      Description      |
|----------|:-------------:|
| kfctl_k8s_istio.yaml |  This config creates a vanilla deployment of Kubeflow with all its core components without any external dependencies. The deployment can be customized based on your environment needs. <br />Follow instructions: [Kubeflow Deployment with kfctl_k8s_istio](/docs/k8s/deploy/kfctl-k8s-istio/)|


### Vendor maintained

This section includes the deployment solutions that are supported by specific vendors/providers.

| Deployment config     | Description                                                                                                                  | Maintainer/Supporter |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------|:----------:|
| existing_arrikto.yaml | This deployment uses Dex and Istio for vendor-neutral authentication. <br />Follow instructions: [Kubeflow Deployment with existing_arrikto](/docs/k8s/deploy/kfctl-existing-arrikto/) |   Arrikto  |

