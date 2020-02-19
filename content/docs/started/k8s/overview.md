+++
title = "Overview of Deployment on Existing Clusters"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster with list of supported options"
weight = 1
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes
cluster. Some [clouds](/docs/started/cloud) and Kubernetes distributions provide
Kubeflow specific instructions for getting the most out of their Kubernetes. If your
existing Kubernetes cluster is from one of those, consider following those instructions.

## Minimum system requirements

The Kubernetes cluster must meet the following minimum requirements:

  * Your cluster must include at least one worker node with a minimum of:
    * 4 CPU
    * 50 GB storage
    * 12 GB memory


  * The recommended Kubernetes version is {{% kubernetes-tested-version %}}.
    Kubeflow has been validated and tested on Kubernetes
    {{% kubernetes-tested-version %}}.
    * Your cluster must run at least Kubernetes version
    {{% kubernetes-min-version %}}.
    * Kubeflow **does not work** on Kubernetes
      {{% kubernetes-incompatible-versions %}}.
    * Older versions of Kubernetes may not be compatible with the latest Kubeflow versions.  The following matrix
    provides information about compatibility between Kubeflow and Kubernetes versions.


<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Kubernetes Versions</th>
        <th>Kubeflow 0.4</th>
        <th>Kubeflow 0.5</th>
        <th>Kubeflow 0.6</th>
        <th>Kubeflow 0.7</th>
        <th>Kubeflow 1.0</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1.11</td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
      </tr>
      <tr>
        <td>1.12</td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
      </tr>
      <tr>
        <td>1.13</td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
      </tr>
      <tr>
        <td>1.14</td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
      </tr>
      <tr>
        <td>1.15</td>
        <td>incompatible</td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
      </tr>
      <tr>
        <td>1.16</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
      </tr>
    </tbody>
  </table>
</div>


## Kubeflow Deployment Configurations

The following tables list the options for installing Kubeflow on an existing Kubernetes
cluster and links to detailed instructions.

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
    <tbody>
      <tr>
        <td>kfctl_istio_dex.yaml</td>
        <td> This config creates a Kubeflow deployment with all its core components, and uses Dex and Istio for vendor-neutral authentication. <br />Follow instructions: <a href="/docs/started/k8s/kfctl-istio-dex/">Multi-user, auth-enabled Kubeflow with kfctl_istio_dex</a></td>
      </tr>
    </tbody>
  </table>
</div>
