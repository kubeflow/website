+++
title = "Microk8s for Kubeflow"
description = "Quickly get Kubeflow running locally on native hypervisors"
weight = 2
+++

This document outlines the steps that you can take to get your local
installation of Kubeflow running on top of Microk8s, a single-node Kubernetes cluster. Microk8s requires Linux; if you are not on a Linux system, you can use Multipass to create a Linux VM on your native hypervisor.

By the end of this document, you'll have a local installation of a Kubernetes cluster along with all the default core components of Kubeflow deployed as services in the pods. You can access the Kubeflow dashboard, JupyterHub notebooks, and dashboards of other Kubeflow components.

## Introduction

If you already have Ubuntu or Linux, you can easily install Kubernetes using [Microk8s](https://microk8s.io/). You can jump to the section below on **Install Kubeflow using Microk8s**.

If you don't have a Linux system already, or you would like to confine your Kubeflow to a disposable machine, then follow the instructions below on **Create a VM with Multipass** first. That will get you an Ubuntu machine that can be used to install Kubernetes and Kubeflow.

### Quickstart

Here's a consolidated list of instructions to launch a VM, install Kubernetes, and install Kubeflow, all with default settings:

```
$ multipass launch bionic -n kubeflow -m 8G -d 40G -c 4
$ multipass shell kubeflow
$ git clone https://github.com/canonical-labs/kubernetes-tools
$ sudo kubernetes-tools/setup-microk8s.sh
$ git clone https://github.com/canonical-labs/kubeflow-tools
$ kubeflow-tools/install-kubeflow.sh
# Point browser: http://<kubeflow VM IP>:<Ambassador PORT>
```

Read the next sections for more detail!

## Create a VM with Multipass

[Multipass](https://github.com/CanonicalLtd/multipass) is a general purpose command line interface (CLI) that launches Ubuntu virtual machines based on [cloud-images](http://cloud-images.ubuntu.com/). The benefits of using Multipass include the following:

  * quickly create disposable machine learning appliances
  * leverage the same cloud images locally, reducing surprises when changing from development to staging to production environments in a multi-cloud strategy.

Here's a summary of the steps involved:

1. Install the CLI
2. Use the CLI to create a VM
3. Enter the VM

### 1. Install Multipass

#### Mac OS X

Install Multipass using the native Mac OS installer:

* Download the latest \*-Darwin.pkg [here](https://github.com/CanonicalLtd/multipass/releases)
* For more information and documentation, visit the project on [GitHub](https://github.com/CanonicalLtd/multipass).

#### Linux

Install Multipass using [snapcraft](https://snapcraft.io):

```
$ sudo snap install multipass --beta --classic
```

### 2. Create an Ubuntu Virtual Machine

The following command creates a VM with 8GB of memory, 40GB of disk space, and 4 CPU. These are the minimum recommended settings. You are free to adjust them **higher** based on your host machine capabilities and workload requirements.
```
$ multipass launch bionic -n kubeflow -m 8G -d 40G -c 4
```

Note: If you need information on **resource utilization** in the VM, such as memory or disk space or CPU load, you can run ```multipass info kubeflow```

### 3. Enter the VM

```
$ multipass shell kubeflow
```

## Install Kubeflow using Microk8s

Here's a summary of the steps involved:

1. Set up Microk8s
2. Set up Kubeflow

### 1. Install and Setup Microk8s

This will install Microk8s if it doesn't already exist, and enable services that are useful for Kubeflow. Please inspect setup-microk8s.sh for more information.

```
$ git clone https://github.com/canonical-labs/kubernetes-tools
$ sudo kubernetes-tools/setup-microk8s.sh
# If you have a GPU, run: `microk8s.enable gpu`
```

If you would like access to the Kubernetes dashboard, please run this command:

```
kubernetes-tools/expose-dashboard.sh
```

### 2. Install and Setup Kubeflow

The current approach leverages ksonnet to setup and install Kubeflow. The kubeflow-tools repository contains scripts to facilitate this.

```
$ git clone https://github.com/canonical-labs/kubeflow-tools
$ kubeflow-tools/install-kubeflow.sh
```
This script will print out the port number for Ambassador and for JupyterHub (Note: you can access JupyterHub through Ambassador).


## Access Kubeflow

If you installed Microk8s on your local host, then you can use localhost as the IP address in your browser. Otherwise, if you used Multipass as per the instructions above, you can get the IP address of the VM with either `multipass list` or `multipass info kubeflow`.

```
Point browser to either:
- http://<kubeflow VM IP>:<Ambassador PORT>
- http://localhost:<Ambassador PORT>
```

### Where to go next

* Refer to the [user guide](/docs/guides/)
* Refer to the [components](/docs/guides/components/)
* Refer to the [JupyterHub guide](/docs/guides/components/jupyter)
