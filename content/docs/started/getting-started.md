+++
title = "Installing Kubeflow"
description = "Overview of installation choices for various environments"
weight = 20
+++

## Before you begin

This document provides information about setting up Kubeflow in various environments.

It's important that you have some knowledge of the following systems and tools:

* [Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* [kustomize](https://kustomize.io/)

If you plan to deploy Kubeflow on an existing Kubernetes cluster, review these
[Kubernetes system requirements](/docs/started/k8s/overview#minimum-system-requirements).

<a id="installation-guides"></a>
## Installing Kubeflow

There are various ways to install Kubeflow. Choose one of the following options
to suit your environment (public cloud, existing Kubernetes cluster, or
desktop or server).

### Installing Kubeflow on a public cloud

  * To use Kubeflow on Google Cloud Platform (GCP) and Kubernetes Engine (GKE),
    follow the [GCP deployment guide](/docs/gke/deploy/).
  * To use Kubeflow on Amazon Web Services (AWS),
    follow the [AWS deployment guide](/docs/aws/deploy/).
  * To use Kubeflow on Microsoft Azure Kubernetes Service (AKS),
    follow the [AKS deployment guide](/docs/azure/deploy/).
  * To use Kubeflow on IBM Cloud Private (ICP),
	  follow the [ICP deployment guide](/docs/started/cloud/getting-started-icp/).

### Installing Kubeflow on an existing Kubernetes cluster

To install Kubeflow on an **existing Kubernetes cluster**, follow the
[guide to deploying Kubeflow on Kubernetes](/docs/started/k8s/overview/).

### Installing Kubeflow on a desktop or server

{{% alert title="<b>Not</b> recommended for getting started with Kubeflow" 
  color="info" %}}
The procedures for installing Kubeflow on a desktop or server can be complex and
highly dependent on your environment. The current recommendation is to choose
a cloud installation if you're just getting started with Kubeflow.
{{% /alert %}}

  * To use Kubeflow on Linux, follow the
    [Linux deployment guide](/docs/started/workstation/getting-started-linux/).
  * To use Kubeflow on MacOS, follow the
    [MacOS deployment guide](/docs/started/workstation/getting-started-macos/).
  * To use Kubeflow on Windows, follow the
    [Windows deployment guide](/docs/started/workstation/getting-started-windows/).
  * To use MiniKF (mini Kubeflow) on Google Cloud Platform, follow the guide to
    [MiniKF on GCP](/docs/started/workstation/minikf-gcp/).

## Configuration quick reference

Below is a matrix of the platforms where you can deploy Kubeflow and the 
corresponding manifest files that specify the default configuration for each
platform. The matrix shows the same manifests as the installation guides.
The matrix is therefore an alternative way of accessing the information in the
[installation section above](#installation-guides).

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Deployment platform</th>
        <th>Manifest</th>
        <th>Deployment guide</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Existing Kubernetes cluster</b> using a standard Kubeflow 
          installation</td>
        <td><a href="{{% config-uri-k8s-istio %}}">{{% config-file-k8s-istio %}}</a> 
        </td>
        <td><a href="/docs/started/k8s/kfctl-k8s-istio/">Docs</a></td>
      </tr>
      <tr>
        <td><b>Existing Kubernetes cluster</b> using Dex for authentication</td>
        <td><a href="{{% config-uri-existing-arrikto %}}">{{% config-file-existing-arrikto %}}</a> 
        </td>
        <td><a href="/docs/started/k8s/kfctl-existing-arrikto/">Docs</a></td>
      </tr>
      <tr>
        <td><b>Amazon Web Services (AWS)</b> using the standard setup</td>
        <td><a href="{{% config-uri-aws-standard %}}">{{% config-file-aws-standard %}}</a> 
        </td>
        <td><a href="/docs/aws/deploy/install-kubeflow/">Docs</a></td>
      </tr>
      <tr>
        <td><b>Amazon Web Services (AWS)</b> with authentication</td>
        <td><a href="{{% config-uri-aws-cognito %}}">{{% config-file-aws-cognito %}}</a> 
        </td>
        <td><a href="/docs/aws/deploy/install-kubeflow/">Docs</a></td>
      </tr>
      <tr>
        <td><b>Microsoft Azure</b></td>
        <td><a href="{{% config-uri-k8s-istio %}}">{{% config-file-k8s-istio %}}</a>  
        </td>
        <td><a href="/docs/azure/deploy/install-kubeflow/">Docs</a></td>
      </tr>
      <tr>
        <td><b>Google Cloud Platform (GCP)</b> with basic authentication</td>
        <td><a href="{{% config-uri-gcp-basic-auth %}}">{{% config-file-gcp-basic-auth %}}</a>  
        </td>
        <td><a href="/docs/gke/deploy/">Docs</a></td>
      </tr>
      <tr>
        <td><b>Google Cloud Platform (GCP)</b> with Cloud Identity-Aware Proxy 
          (Cloud IAP)</td>
        <td><a href="{{% config-uri-gcp-iap %}}">{{% config-file-gcp-iap %}}</a>  
        </td>
        <td><a href="/docs/gke/deploy/">Docs</a></td>
      </tr>
      <tr>
        <td><b>IBM Cloud Private</b></td>
        <td><a href="{{% config-uri-k8s-istio %}}">{{% config-file-k8s-istio %}}</a>  
        </td>
        <td><a href="/docs/started/cloud/getting-started-icp/">Docs</a></td>
      </tr>
    </tbody>
  </table>
</div>

## Installing command line tools

The following information is useful if you need or prefer to use command line
tools for deploying and managing Kubeflow:

* Download the kfctl binary from the
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

* Follow the kubectl installation and setup instructions from the [Kubernetes
  documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
  As described in the Kubernetes documentation, your kubectl
  version must be within one minor version of the Kubernetes version that you
  use in your Kubeflow cluster.

* Follow the kustomize installation and setup instructions from the guide to
  [kustomize in Kubeflow](/docs/other-guides/kustomize/).

## Troubleshooting

See the [Kubeflow troubleshooting guide](/docs/other-guides/troubleshooting/).

## Next steps

* Read the [documentation](/docs/) for in-depth instructions on using Kubeflow.
* Explore the [tutorials and
  codelabs](/docs/examples/codelabs-tutorials/) for learning and trying out Kubeflow.
* Build machine-learning pipelines with the [Kubeflow Pipelines
  SDK](/docs/pipelines/sdk/sdk-overview/).
