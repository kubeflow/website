+++
title = "Kubeflow on Windows"
description = "Install Kubeflow on Windows"
weight = 30
                    
+++

For Windows systems you have multiple options for getting started. The options range
from fully-assembled Kubeflow stacks, to stacks that require some assembly.
In addition, with the recent announcement of
[Windows WSL 2](https://devblogs.microsoft.com/commandline/announcing-wsl-2/),
some of the [linux installation options](/docs/started/workstation/getting-started-linux)
for Kubeflow will be available on Windows, once WSL2 is formally released.


### MicroK8s

MicroK8s is a lightweight zero-ops Kubernetes which has a native installer for Windows. MicroK8s is highly available from 3+ nodes and includes a single-command install of Kubeflow.

To get Kubeflow:

1. Install [MicroK8s](https://microk8s.io/) - see "Alternative Install" page for Windows binary.
2. Install Kubeflow by running: `microk8s enable kubeflow`

The full set of instructions are available on the [Kubeflow on MicroK8s](https://www.kubeflow.org/docs/started/workstation/getting-started-multipass/) page.

### MiniKF

MiniKF is a Kubeflow appliance, a predefined virtual machine that has Kubeflow already installed. It installs onto VirtualBox through Vagrant. Once the necessary supporting software is installed no further installation steps are required.

The only following applications are required to use MiniKF:

1. Install [Vagrant](https://www.vagrantup.com/downloads.html)
2. Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

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
