+++
title = "Local Installation"
description = "Get started with Kuberflow on local hardware"
weight = 1
+++

   * [MiniKF](/docs/started/local/getting-started-minikf/)
      * MiniKF is a fast and easy way to get started with Kubeflow.
      * It installs with just two commands and then you are up for
	      experimentation, and for running complete Kubeflow Pipelines.
      * MiniKF runs on all major operating systems (Linux, macOS, Windows).

   * [Minikube](/docs/started/local/getting-started-minikube/)
      * Minikube uses virtualization applications like 
        [VirtualBox](https://www.virtualbox.org/) or [VMware
        Fusion](https://www.vmware.com/products/fusion.html) to host the VM
	      and provides a CLI that you can use outside the VM.
      * Minikube defines a fully-baked
       [ISO image](https://en.wikipedia.org/wiki/ISO_image) that contains a
        minimal operating system and Kubernetes already installed.
      * This option may be useful if you are just starting to learn and already
	      have one of the virtualization applications installed.

   * [MicroK8s](/docs/started/local/getting-started-multipass/)
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

