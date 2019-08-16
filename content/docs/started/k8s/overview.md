+++
title = "Deploying Kubeflow on Existing Clusters"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster with list of supported options"
weight = 1
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes
cluster. Some [clouds](/docs/started/cloud) and Kubernetes distributions provide
Kubeflow specific instructions for getting the most out of their Kubernetes. If your
existing Kubernetes cluster is from one of those, consider following those instructions.

## Minimum system requirements

The Kubernetes cluster must meet the following minimum requirements:

  * Kubernetes version {{% kubernetes-min-version %}} or later.
  * At least one worker node with a minimum of:
    * 4 CPU
    * 50 GB storage
    * 12 GB memory

## Kubeflow Deployment Configurations

The following tables list the options for installing Kubeflow on an existing Kubernetes
Cluster and links to detailed instructions.

### Community maintained

This section includes vendor-neutral solutions governed by community consensus. Below deployment configs are maintained and supported by the community.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Deployment config</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>kfctl_k8s_istio.yaml</td>
        <td> This config creates a vanilla deployment of Kubeflow with all its core components without any external dependencies. The deployment can be customized based on your environment needs. <br />Follow instructions: <a href="/docs/started/k8s/kfctl-k8s-istio/">Kubeflow Deployment with kfctl_k8s_istio</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Vendor maintained

This section includes the deployment solutions that are supported by specific vendors/providers.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Deployment config</th>
        <th>Description</th>
        <th>Maintainer/Supporter</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>kfctl_existing_arrikto.yaml</td>
        <td> This config creates a Kubeflow deployment with all its core components, and uses Dex and Istio for vendor-neutral authentication. <br />Follow instructions: <a href="/docs/started/k8s/kfctl-existing-arrikto/">Multi-user, auth-enabled Kubeflow with kfctl_existing_arrikto</a></td>
        <td><a href="https://www.arrikto.com/">Arrikto</a></td>
      </tr>
    </tbody>
  </table>
</div>
