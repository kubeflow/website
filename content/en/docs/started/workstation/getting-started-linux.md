+++
title = "Kubeflow on Linux"
description = "Install Kubeflow on Linux"
weight = 10

+++

There are a few installation options for Kubeflow on Linux.

### MicroK8s

MicroK8s is a lightweight zero-ops Kubernetes which runs natively on every Linux distribution that supports snaps.

- Install MicroK8s
- Install Kubeflow by running: `microk8s enable kubeflow`

The full set of instructions are available on the [Kubeflow on MicroK8s](https://www.kubeflow.org/docs/started/workstation/getting-started-multipass/) page.

### MiniKF

MiniKF is a Kubeflow appliance, a predefined virtual machine that has Kubeflow already installed. It installs onto VirtualBox through Vagrant. Once the necessary supporting software is installed no further installation steps are required.

The only following applications are required to use MiniKF:

- Install [Vagrant](https://www.vagrantup.com/downloads.html)
- Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

Follow the instructions on [MiniKF getting started](/docs/started/workstation/getting-started-minikf/) to complete this path.

### Minikube

Minikube is a tool for installing a single node Kubernetes in a virtual machine. After starting the virtual machine, you need
to install Kubeflow.

- Install [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)

Follow the instructions on [Kubeflow on MiniKube](/docs/started/workstation/minikube-linux/) to complete this path.

### Multipass

[Multipass](https://multipass.run/) creates a Linux virtual machine on Windows, Mac or Linux systems. The VM contains a complete Ubuntu operating
system which can then be used to deploy Kubernetes and Kubeflow.

- Install [Multipass](https://multipass.run/#install)

Follow instructions on [Kubeflow on Multipass](https://ubuntu.com/tutorials/deploy-kubeflow-ubuntu-windows-mac#1-overview) to complete this path.
