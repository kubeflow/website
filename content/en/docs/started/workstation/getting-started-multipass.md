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

**Note:** the minimum version of Microk8s needed to enable Kubeflow is 1.18

### 1. Install Microk8s

Single-command install MicroK8s snap:

```
sudo snap install microk8s --classic
```
Verify installation:
```
microk8s.status --wait-ready
```

### 2. Enable Microk8s services:

Enable common services:
```
microk8s.enable dns dashboard storage
```
If you would like to enable GPU passthrough (optional), run: `microk8s.enable gpu`

### 3. Enable Kubeflow:

Run the following command to enable Kubeflow:

```
microk8s.enable kubeflow
```

The deployment process may take a few minutes. Once completed, the script will print out the port number and credentials to access the Kubeflow Dashboard.


## Access Kubeflow Dashboard

### On you local host
If you installed Microk8s on your local host, you simply need to open a web browser window and access the link given in the previous step. 

### On Multipass or a Virtual Machine
If running Microk8s on Multipass or a Virtual Machine, we need to create a SOCKS proxy. This can be done as follows:

* Logout from the current session
* Re-establish connection to the machine using ssh, enabling SOCKS proxy with the -D9999 parameter.
Examples:

```
ssh -D9999 ubuntu@<machine_public_ip>
```
or find multipass IP with `multipass list` and connect with:
```
ssh -D9999 multipass@<machine_public_ip>
```

On your computer, go to `Settings > Network > Network Proxy`, and enable SOCKS proxy pointing to: `127.0.0.1:9999`.

On a new browser window, access the link given in the previous step (e.g. http://10.64.140.43.xip.io )


## Next steps

* Refer to the [microk8s common issues](https://microk8s.io/docs/troubleshooting)
* Refer to the [multipass docs](https://multipass.run/docs)
* Refer to the [user guide](/docs/)
* Refer to the [components](/docs/components/)
* Refer to the guide to [Jupyter notebooks in Kubeflow](/docs/notebooks/)
