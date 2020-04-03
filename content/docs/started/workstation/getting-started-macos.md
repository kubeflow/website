+++
title = "Kubeflow on macOS"
description = "Install Kubeflow on macOS"
weight = 20
+++

For macOS systems you have multiple options for getting started. The options range
from fully-assembled Kubeflow stacks, to stacks that require some assembly.

## Kubeflow appliance

A Kubeflow appliance is a virtual machine that has Kubeflow already installed. Once the
necessary supporting software is installed no further installation steps are required.

### MiniKF

MiniKF is a predefined virtual machine that installs onto VirtualBox through Vagrant.
The only following applications are required to use MiniKF:

- Install [Vagrant](https://www.vagrantup.com/downloads.html)
- Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

The full set of instructions are available on the
[MiniKF getting started](/docs/started/workstation/getting-started-minikf/) page.

## Linux appliance

A Linux appliance is a virtual machine that holds the linux operating system. From there
you have complete choice over Kubernetes and Kubeflow, which offers the greatest degree
of flexibility. You only need to install a single application to follow this path:

- Install [Multipass](https://multipass.run/#install)

The instructions on [Multipass and MicroK8s getting started](/docs/started/workstation/getting-started-multipass/)
page will complete this path.

## Kubernetes appliance

Similar to the Kubeflow appliance, the Kubernetes appliance is a virtual machine that
has a Kubernetes cluster already installed. After starting the virtual machine you
will need to install Kubeflow. This option gives you full control over your Kubeflow
setup.
