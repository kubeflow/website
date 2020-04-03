+++
title = "Microk8s for Kubeflow"
description = "Quickly get Kubeflow running locally on native hypervisors"
weight = 60
+++

{{% alpha-status 
  feedbacklink="https://github.com/kubeflow/kubeflow/issues" %}}

This document outlines the steps that you can take to get your local installation of Kubeflow running on top of Microk8s, a small enterprise Kubernetes cluster. Microk8s requires Linux; if you are not on a Linux system, you can use Multipass to create a Linux VM (virtual machine) on your native hypervisor.

## Introduction

If you already have Ubuntu or Linux that supports [snaps](https://snapcraft.io/), you can easily install Kubernetes using [Microk8s](https://microk8s.io/). You can jump to the **Install Kubeflow using Microk8s** section below.

If you don't have a Linux system already, or you would like to confine your Kubeflow to a disposable machine, then [Create a VM with Multipass](https://multipass.run/) first and then follow the instructions below. That will get you an Ubuntu machine that can be used to install Kubernetes and Kubeflow.

## Install Kubeflow using Microk8s

Here's a summary of the steps involved:

1. Set up Microk8s
2. Enable Kubeflow

### 1. Install and set up Microk8s

Run the following commands to install and setup MicroK8s:

```
snap install microk8s --classic
microk8s.status --wait-ready
# Enable common services:
microk8s.enable dns dashboard storage
# If you have a GPU, run: `microk8s.enable gpu`
```

### 2. Enable Kubeflow

Run the following command to enable Kubeflow:

```
microk8s.enable kubeflow
```

This script will print out the port number for Ambassador and for Jupyter notebook 
servers.


## Access Kubeflow

If you installed Microk8s on your local host, then you can use localhost as the IP address in your browser. Otherwise, if you used Multipass, you can get the IP address of the VM with either `multipass list` or `multipass info kubeflow`.

Point browser to either:
- http://" Your kubeflow VM IP":"Ambassador PORT"
- http://localhost:" Ambassador PORT"

## Next steps

* Refer to the [microk8s common issues](https://microk8s.io/docs/troubleshooting)
* Refer to the [multipass docs](https://multipass.run/docs)
* Refer to the [user guide](/docs/)
* Refer to the [components](/docs/components/)
* Refer to the guide to [Jupyter notebooks in Kubeflow](/docs/notebooks/)
