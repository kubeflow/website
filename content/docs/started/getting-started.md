+++
title = "Getting Started with Kubeflow"
description = "Overview"
weight = 1
+++

## Before you begin

This document provides information about setting up Kubeflow in various environments.

It's important that you have some knowledge of the following systems and tools:

* [Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* [TensorFlow](https://www.tensorflow.org/get_started/)
* [kustomize](https://kustomize.io/)

### Kubeflow requirements

Before installing Kubeflow, ensure that your environment meets the
following requirements:

* You need kustomize version {{% kustomize-min-version %}} or later. See the 
  [kustomize component guide](/docs/components/misc/kustomize/) 
  for details about installing kustomize.

* If you intend to install Kubeflow on an existing Kubernetes cluster, the
  cluster must meet the following requirements:

  * Kubernetes version {{% kubernetes-min-version %}} or later.
  * A minimum of 0.6 CPU in cluster. (Reserved for 3 replicated ambassador pods 
    and according to your needs add additional CPUs.)
  * Node with storage >= 10 GB. (Due to the ML libraries and third party packages 
    bundled in the Kubeflow Docker images.)

## Get your machine-learning workflow up and running on Kubeflow

There are various ways to install Kubeflow. Choose one of the following options
to suit your environment (cloud, on premises (on prem), or local):

* To use Kubeflow on Google Cloud Platform (GCP) and Kubernetes Engine (GKE),
  follow the [GCP deployment guide](/docs/gke/deploy/).
* To use Kubeflow on Amazon Web Services (AWS),
  follow the [AWS deployment guide](/docs/aws/deploy/).
* To use Kubeflow on Microsoft Azure Kubernetes Service (AKS),
  follow the [AKS deployment guide](/docs/azure/deploy/).
* To use Kubeflow on IBM Cloud Private (ICP),
	follow the [ICP deployment guide](/docs/started/getting-started-icp/).  
* If you have an existing Kubernetes cluster or want to use Kubeflow on prem,
  follow the [guide to deploying Kubeflow on
  Kubernetes](/docs/started/k8s/overview/).
* If you want to run Kubernetes locally in a virtual machine (VM), choose one of
  the following options:

   * [MiniKF setup](/docs/started/getting-started-minikf/)
      * MiniKF is a fast and easy way to get started with Kubeflow.
      * It installs with just two commands and then you are up for
	      experimentation, and for running complete Kubeflow Pipelines.
      * MiniKF runs on all major operating systems (Linux, macOS, Windows).

   * [Minikube setup](/docs/started/getting-started-minikube/)
      * Minikube uses virtualization applications like
        [VirtualBox](https://www.virtualbox.org/) or [VMware
        Fusion](https://www.vmware.com/products/fusion.html) to host the VM
	      and provides a CLI that you can use outside the VM.
      * Minikube defines a fully-baked
       [ISO image](https://en.wikipedia.org/wiki/ISO_image) that contains a
        minimal operating system and Kubernetes already installed.
      * This option may be useful if you are just starting to learn and already
	      have one of the virtualization applications installed.

   * [MicroK8s setup](/docs/started/getting-started-multipass/)
      * [MicroK8s](https://microk8s.io/) can provide the following benefits:
          - A small, fast, secure, single node Kubernetes installation that installs on any
            Linux system as a [snap](https://snapcraft.io/microk8s).
          - Strong isolation and update semantics - your cluster
            is updated within a short period after upstream Kubernetes
            releases.
          - Built-in support to enable an installed GPU:
            `microk8s.enable gpu`
      * MicroK8s requires Linux. If you are not on a Linux machine, or you want
        to confine your Kubeflow to a disposable machine, the installation guide
        show you how to use
        [Multipass](https://github.com/CanonicalLtd/multipass) to launch a VM.
        Benefits include:
          - [Ubuntu Cloud Images](http://cloud-images.ubuntu.com/) already
            integrated.
          - Lightweight hypervisor using native operating system mechanisms
            (for example, [Hypervisor
            Framework](https://developer.apple.com/documentation/hypervisor) on
            macOS, [Hyper-V on Windows
            10](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v), or
            QEMU/KVM for Linux).
          - No need to install a separate virtualization application.
          - Use of `cloud-init` to customize the VM.

## Installing command line tools

The following information is useful if you need or prefer to use command line
tools for deploying and managing Kubeflow:

* Download the `kfctl` binary from the
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

* Follow the `kubectl` installation and setup from the [Kubernetes 
  documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
  As described in the Kubernetes documentation, your kubectl 
  version must be within one minor version of the Kubernetes version that you
  use in your Kubeflow cluster.

## Troubleshooting

See the [Kubeflow troubleshooting guide](/docs/other-guides/troubleshooting/).

## Next steps

* Read the [documentation](/docs/) for in-depth instructions on using Kubeflow.
* Explore the [tutorials and 
  codelabs](/docs/examples/codelabs-tutorials/) for learning and trying out Kubeflow.
* Build machine-learning pipelines with the [Kubeflow Pipelines
  SDK](/docs/pipelines/sdk/sdk-overview/).
