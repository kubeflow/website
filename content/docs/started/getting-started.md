+++
title = "Getting Started with Kubeflow"
description = "Overview"
weight = 1
+++

## Before you begin

This document provides information about setting up Kubeflow in various environments.

It's important that you have some knowledge of the following systems and tools:

* [Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* [kustomize](https://kustomize.io/)

If you plan to deploy Kubeflow on an existing Kubernetes cluster, review these
[Kubernetes system requirements](/docs/started/k8s/overview#minimum-system-requirements).


## Installing Kubeflow

There are various ways to install Kubeflow. Choose one of the following options
to suit your environment (desktop or server, existing Kubernetes cluster or public cloud):


* Installing Kubeflow on a **desktop** or **server**:

  * To use Kubeflow on Windows,
  follow the [Windows deployment guide](/docs/started/workstation/getting-started-windows/).
  * To use Kubeflow on MacOS,
  follow the [MacOS deployment guide](/docs/started/workstation/getting-started-macos/).
  * To use Kubeflow on Linux,
  follow the [Linux deployment guide](/docs/started/workstation/getting-started-linux/).

* Installing Kubeflow on a **existing Kubernetes cluster** or a **public cloud**:

  * To install Kubeflow on a Kubernetes cluster, follow the
  [guide to deploying Kubeflow on Kubernetes](/docs/started/k8s/overview/).
  * To use Kubeflow on Google Cloud Platform (GCP) and Kubernetes Engine (GKE),
  follow the [GCP deployment guide](/docs/gke/deploy/). To use MiniKF (mini
  Kubeflow) on GCP, follow the [MiniKF on GCP guide](/docs/gke/deploy/minikf-gcp).
  * To use Kubeflow on Amazon Web Services (AWS),
  follow the [AWS deployment guide](/docs/aws/deploy/).
  * To use Kubeflow on Microsoft Azure Kubernetes Service (AKS),
  follow the [AKS deployment guide](/docs/azure/deploy/).
  * To use Kubeflow on IBM Cloud Private (ICP),
	follow the [ICP deployment guide](/docs/started/cloud/getting-started-icp/).


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
