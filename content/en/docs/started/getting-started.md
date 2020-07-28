+++
title = "Installing Kubeflow"
description = "Overview of installation choices for various environments"
weight = 20
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


This document provides information about setting up Kubeflow in various
environments.

## Before you begin

It's important that you have some knowledge of the following systems and tools:

* [Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* [kustomize](https://kustomize.io/)

If you plan to deploy Kubeflow on an existing Kubernetes cluster, review these
[Kubernetes system requirements](/docs/started/k8s/overview#minimum-system-requirements).

## Overview of installation options

<!--
Note for authors: The source of the diagram is
in the "Doc diagrams" folder in the Kubeflow team drive.
-->

The following diagram gives an overview of the options for deploying Kubeflow:

<div>
  <object type="image/svg+xml" 
    data="/docs/images/kubeflow-getting-started-diagram.svg" 
    alt="A diagrammatic overview of Kubeflow deployment options"
    class="mt-3 mb-3 border border-info rounded">
  </object>
</div>

The following section describes the options in more detail and links to the
relevant instructions.

<a id="installation-guides"></a>
## Installing Kubeflow

There are various ways to install Kubeflow. Choose one of the following options
to suit your environment (public cloud, existing Kubernetes cluster, or
a single-node cluster which you can use on a desktop or server or in the cloud).

<a id="cloud"></a>
### Installing Kubeflow on a public cloud

Choose the Kubeflow deployment guide for your chosen cloud:

  * To use Kubeflow on Google Cloud Platform (GCP) and Kubernetes Engine (GKE),
    follow the [GCP deployment guide](/docs/gke/deploy/).
  * To use Kubeflow on Amazon Web Services (AWS),
    follow the [AWS deployment guide](/docs/aws/deploy/).
  * To use Kubeflow on Microsoft Azure Kubernetes Service (AKS),
    follow the [AKS deployment guide](/docs/azure/deploy/).
  * To use Kubeflow on IBM Cloud (IKS),
	  follow the [IKS deployment guide](/docs/ibm/).
  * To use Kubeflow on OpenShift,
    follow the [OpenShift deployment guide](/docs/openshift/).

<a id="kubernetes"></a>
### Installing Kubeflow on an existing Kubernetes cluster

Follow the
[guide to deploying Kubeflow on Kubernetes](/docs/started/k8s/overview/).

<a id="single-node"></a>
### Installing Kubeflow on desktop, server, or cloud in a single-node Kubernetes cluster

You can use the following options to run Kubeflow on a single-node Kubernetes
cluster, which you can use on a desktop or server or in the cloud.

Choose the guide for your operating system or environment:

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
        <td><a href="{{% config-uri-istio-dex %}}">{{% config-file-istio-dex %}}</a>
        </td>
        <td><a href="/docs/started/k8s/kfctl-istio-dex/">Docs</a></td>
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
        <td><b>Google Cloud Platform (GCP)</b> with Cloud Identity-Aware Proxy 
          (Cloud IAP)</td>
        <td><a href="{{% config-uri-gcp-iap %}}">{{% config-file-gcp-iap %}}</a>  
        </td>
        <td><a href="/docs/gke/deploy/">Docs</a></td>
      </tr>
      <tr>
        <td><b>IBM Cloud (IKS)</b></td>
        <td><a href="{{% config-uri-ibm %}}">{{% config-file-ibm %}}</a>  
        </td>
        <td><a href="/docs/started/cloud/getting-started-icp/">Docs</a></td>
      </tr>
      <tr>
        <td><b>OpenShift</b></td>
        <td><a href="{{% config-uri-openshift %}}">{{% config-file-openshift %}}</a>  
        </td>
        <td><a href="/docs/openshift/">Docs</a></td>
      </tr>
    </tbody>
  </table>
</div>

## Installing command line tools

The following information is useful if you need or prefer to use command line
tools for deploying and managing Kubeflow:

* Download the kfctl binary from the
  [Kubeflow releases page](https://github.com/kubeflow/kfctl/releases/).

* Follow the kubectl installation and setup instructions from the [Kubernetes
  documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
  As described in the Kubernetes documentation, your kubectl
  version must be within one minor version of the Kubernetes version that you
  use in your Kubeflow cluster.

* Follow the kustomize installation and setup instructions from the guide to
  [kustomize in Kubeflow](/docs/other-guides/kustomize/).
  Make sure that you have the minimum required version of kustomize:
  <b>{{% kustomize-min-version %}}</b> or later.

## Understanding the Kubeflow versioning policies

With the launch of Kubeflow v1.0, the Kubeflow community attributes 
*stable status* to those applications and other components that 
meet the required level of stability, supportability, and upgradability.

Read about the 
[Kubeflow versioning policies](/docs/reference/version-policy/),
including the stable status of Kubeflow applications and deployment 
platforms.

## Troubleshooting

See the [Kubeflow troubleshooting guide](/docs/other-guides/troubleshooting/).

## Next steps

* Read the [documentation](/docs/) for in-depth instructions on using Kubeflow.
* Explore the [tutorials and
  codelabs](/docs/examples/codelabs-tutorials/) for learning and trying out Kubeflow.
* Build machine-learning pipelines with the [Kubeflow Pipelines
  SDK](/docs/pipelines/sdk/sdk-overview/).
