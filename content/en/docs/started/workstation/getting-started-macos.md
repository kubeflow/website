+++
title = "Kubeflow on macOS"
description = "Install Kubeflow on macOS"
weight = 20
                    
+++

For macOS systems you have multiple options for getting started. The options range
from fully-assembled Kubeflow stacks, to stacks that require some assembly.


### MicroK8s

MicroK8s is a lightweight zero-ops Kubernetes which has a native installer for macOS. MicroK8s is highly available from 3+ nodes and includes a single-command install of Kubeflow.

To get Kubeflow:

1. Install [MicroK8s](https://microk8s.io/)
2. Install Kubeflow by running: `microk8s enable kubeflow`

The full set of instructions are available on the [Kubeflow on MicroK8s](https://www.kubeflow.org/docs/started/workstation/getting-started-multipass/) page.

### MiniKF

MiniKF is a predefined virtual machine that installs onto VirtualBox through Vagrant.
The only following applications are required to use MiniKF:

- Install [Vagrant](https://www.vagrantup.com/downloads.html)
- Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

The full set of instructions are available on the
[MiniKF getting started](/docs/started/workstation/getting-started-minikf/) page.

### Multipass

[Multipass](https://multipass.run/) creates a Linux virtual machine on Windows, Mac or Linux systems. The VM contains a complete Ubuntu operating
system which can then be used to deploy Kubernetes and Kubeflow.

- Install [Multipass](https://multipass.run/#install)

Follow instructions on [Kubeflow on Multipass](https://ubuntu.com/tutorials/deploy-kubeflow-ubuntu-windows-mac#1-overview) to complete this path.
