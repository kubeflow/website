+++
title = "Kubeflow on MacOS"
description = "Install Kubeflow on MacOS"
weight = 2
+++

<!--
  TODO: Create a table that summarizes the options below, helping the user choose
        more quickly
  TODO: Surface the mac specific instructions here .. for instance, installing
        vagrant and virtualbox through brew / brew cask
-->

For MacOS systems you have multiple options for getting started. The options range
from fully-assembled Kubeflow stacks, to stacks that require some assembly.

## Kubeflow Appliance

A Kubeflow appliance is a virtual machine that has Kubeflow already installed. Once the
necessary supporting software is installed no further installation steps are required.

### MiniKF

MiniKF is a predefined virtual machine that installs onto VirtualBox through Vagrant.
The only following applications are required to use MiniKF:

- Install [Vagrant](https://www.vagrantup.com/downloads.html)
- Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

The full set of instructions are available on the
[MiniKF getting started](/docs/other-guides/virtual-dev/getting-started-minikf/) page.

## Linux Appliance

A Linux appliance is a virtual machine that holds the linux operating system. From there
you have complete choice over Kubernetes and Kubeflow, which offers the greatest degree
of flexibility. You only need to install a single application to follow this path:

- Install [Multipass](https://multipass.run/#install)

The instructions on [Multipass and MicroK8s getting started](/docs/other-guides/virtual-dev/getting-started-multipass/)
page will complete this path.

## Kubernetes Appliance

Similar to the Kubeflow appliance, the Kubernetes appliance is a virtual machine has a
Kubernetes cluster already installed. After starting the virtual machine you will need
to install Kubeflow. This option gives you full control over your Kubeflow setup.

### Minikube

Minikube runs a simple, single-node Kubernetes cluster inside a virtual machine (VM).
You can choose amongst a couple of hypervisor applications. Similar to the Kubeflow
appliance, you only need to install a couple of applications, and then install Kubeflow:

- Install a Hypervisor (*one of the following*)
  - Install [Vagrant](https://www.vagrantup.com/downloads.html)
  - Install [VMware Fusion](https://www.vmware.com/products/fusion)
- Install [Minikube](https://github.com/kubernetes/minikube/releases)

The full set of instructions are available on the
[Minikube getting started](/docs/other-guides/virtual-dev/getting-started-minikube/) page.
