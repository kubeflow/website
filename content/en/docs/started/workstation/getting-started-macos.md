+++
title = "Kubeflow on macOS"
description = "Install Kubeflow on macOS"
weight = 20
                    
+++

For macOS systems you have multiple options for getting started. The options range
from fully-assembled Kubeflow stacks, to stacks that require some assembly.

*Note:* It is recommended that you have at least 12GB of RAM and 50GB of storage available.

### MicroK8s

MicroK8s is a lightweight zero-ops Kubernetes which has a native installer for macOS. MicroK8s is highly available from 3+ nodes and includes a single-command install of Kubeflow.

To get Kubeflow:

1. Install [MicroK8s](https://microk8s.io/) - see the "Alternative Install" page for links to the latest macOS installer.
2. Install Kubeflow by running: `microk8s enable kubeflow`

The full set of instructions are available on the [Kubeflow on MicroK8s](https://www.kubeflow.org/docs/started/workstation/getting-started-multipass/) page.

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
