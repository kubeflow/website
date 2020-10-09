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

## Kubeflow appliance

A Kubeflow appliance is a virtual machine that has Kubeflow already installed. Once the
necessary supporting software is installed no further installation steps are required.

### MiniKF

MiniKF is a predefined virtual machine that installs onto VirtualBox through Vagrant.
The following applications are required to use MiniKF:

- Install [Vagrant](https://www.vagrantup.com/downloads.html)
- Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

The full set of instructions are available on the
[MiniKF getting started](/docs/started/workstation/getting-started-minikf/) page.

## Multipass Ubuntu

Windows users can get Kubeflow with [Multipass](https://multipass.run/#install) 
by following the instructions on the 
[Multipass and MicroK8s getting started](/docs/started/workstation/getting-started-multipass/)
page.

## Kubernetes appliance

Similar to the Kubeflow appliance, the Kubernetes appliance is a virtual machine has a
Kubernetes cluster already installed. After starting the virtual machine you will need
to install Kubeflow. This option gives you full control over your Kubeflow setup.
