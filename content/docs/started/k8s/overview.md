+++
title = "Kubeflow on Existing Kubernetes Clusters"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster with list of supported options"
weight = 1
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes cluster.

If you are using a Kubernetes distribution or Cloud Provider which has specific instructions for installing Kubeflow we recommend following those instructions. Those instructions do additional Cloud specific setup to create a really great Kubeflow experience.

The following table lists the options for installing Kubeflow on an existing Kubernetes Cluster and links to detailed instructions.

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
        <td>existing_arrikto.yaml</td>
        <td> This deployment uses Dex and Istio for vendor-neutral authentication. <br />Follow instructions: <a href="/docs/started/k8s/kfctl-existing-arrikto/">Kubeflow Deployment with existing_arrikto</a></td>
        <td><a href="https://www.arrikto.com/">Arrikto</a></td>
      </tr>
    </tbody>
  </table>
</div>
