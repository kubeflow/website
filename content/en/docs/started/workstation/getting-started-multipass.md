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

**Note:** the minimum version of Microk8s needed to enable Kubeflow is 1.18.

1. Install MicroK8s with Snap by running the following command:

    ```
    sudo snap install microk8s --classic
    ```

2. Verify that MicroK8s is running with the command:

    ```
    microk8s.status --wait-ready
    ```

3. Enable common services on your Microk8s deployment:

    ```
    microk8s.enable dns dashboard storage
    ```

4. Optional, to enable GPU support (available only for NVIDIA GPU hardware), run: `microk8s.enable gpu`

5. Deploy Kubeflow with the command:

    ```
    microk8s.enable kubeflow
    ```

    The deployment process may take a few minutes. Once completed, the script will print out the port number and credentials to access the Kubeflow dashboard.

## Access Kubeflow dashboard

### On your Linux machine
If you installed Microk8s directly on your Linux machine, (1) open a web browser window and (2) access the link provided after you enable Kubeflow, e.g. `10.64.140.43.xip.io` (see previous step).

### On Multipass or a virtual machine
When running Microk8s on Multipass or a virtual machine, create a SOCKS proxy to access the Kubeflow dashboard, as follows:

* Logout from the current session using the `exit` command.
* Re-establish connection to the machine using `SSH`, enabling SOCKS proxy with the `-D9999` parameter. Examples:

    ```
    ssh -D9999 ubuntu@<machine_public_ip>
    ```

    or find multipass IP with `multipass list` and connect with:

    ```
    ssh -D9999 multipass@<multipass_public_ip>
    ```

* On your computer, go to `Settings > Network > Network Proxy`, and enable SOCKS proxy pointing to: `127.0.0.1:9999`.

* Finally, (1) open a new web browser window and (2) access the link provided after you enable Kubeflow, e.g. `10.64.140.43.xip.io` (see previous step).

## Next steps

* Refer to the [microk8s common issues](https://microk8s.io/docs/troubleshooting)
* Refer to the [multipass docs](https://multipass.run/docs)
* Refer to the [user guide](/docs/)
* Refer to the [components](/docs/components/)
* Refer to the guide to [Jupyter notebooks in Kubeflow](/docs/notebooks/)
