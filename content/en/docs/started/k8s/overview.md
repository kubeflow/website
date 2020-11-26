+++
title = "Overview of Deployment on an Existing Kubernetes Cluster"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster with a list of supported options"
weight = 1
                    
+++

Instructions for installing Kubeflow on an existing Kubernetes cluster.
Some [cloud providers](/docs/started/cloud) and Kubernetes distributions have
Kubeflow specific instructions for getting the most out of their Kubernetes. If your
existing Kubernetes cluster is from one of them, consider following those instructions.

## Minimum system requirements

Your Kubernetes cluster must meet the following minimum requirements:

- Your cluster must include at least one worker node with a minimum of:
  - 4 CPU
  - 50 GB storage
  - 12 GB memory

- The recommended Kubernetes version is {{% kubernetes-tested-version %}}.
  Kubeflow has been validated and tested on Kubernetes
  {{% kubernetes-tested-version %}}.
  - Your cluster must run at least Kubernetes version
    {{% kubernetes-min-version %}}.
  - Older versions of Kubernetes may not be compatible with the latest Kubeflow versions. The following matrix
    provides information about compatibility between Kubeflow and Kubernetes versions.

- You need a default
  [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/)
  with a [dynamic volume
  provisioner](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/).
  For more information, refer to [this
  guide](https://www.kubeflow.org/docs/started/k8s/kfctl-k8s-istio/#before-you-start).

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
        <th>Kubeflow 1.1</th>        
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
        <td>incompatible</td>
      </tr>
      <tr>
        <td>1.12</td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
        <td>incompatible</td>
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
        <td>incompatible</td>
      </tr>
      <tr>
        <td>1.14</td>
        <td><b>compatible</b></td>
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
        <td><b>compatible</b></td>
      </tr>
      <tr>
        <td>1.16</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td><b>compatible</b></td>
        <td><b>compatible</b></td>
      </tr>
      <tr>
        <td>1.17</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td><b>no known issues</b></td>
        <td><b>no known issues</b></td>
      </tr>
      <tr>
        <td>1.18</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td>incompatible</td>
        <td><b>no known issues</b></td>
        <td><b>no known issues</b></td>
      </tr>
    </tbody>
  </table>
</div>

- **incompatible**: the combination does not work at all
- **compatible**: all Kubeflow features have been tested and verified for the
  Kubernetes version
- **no known issues**: the combination has not been fully tested but there are
  no reported issues

## Kubeflow deployment configuration

The following table lists the options for installing Kubeflow on an existing Kubernetes
cluster and links to detailed instructions. These solutions are vendor-neutral and are
governed by consensus within the Kubeflow community.

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
