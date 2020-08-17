+++
title = "Microk8s for Kubeflow"
description = "Quickly get Kubeflow running locally on native hypervisors"
weight = 60
+++

{{% alpha-status 
  feedbacklink="https://github.com/kubeflow/kubeflow/issues" %}}

## Introduction

This guide describes how to deploy Kubeflow using [Microk8s](https://microk8s.io/) - a small enterprise Kubernetes cluster. Microk8s is now available on Windows, macOS and any Linux distribution that supports `snaps`. You can download it on the [Microk8s](https://microk8s.io/) website.

Alternatively, to deploy Kubeflow within a displosable Linux virtual machine, you can install Microk8s on a Linux appliance using [Multipass](https://multipass.run/) on Windows or macOS.

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

1. Logout from the current session using the `exit` command.
2. Re-establish connection to the machine using `SSH`, enabling SOCKS proxy with the `-D9999` parameter. Examples:

    ```
    ssh -D9999 ubuntu@<machine_public_ip>
    ```

    or find multipass IP with `multipass list` and connect with:

    ```
    ssh -D9999 multipass@<multipass_public_ip>
    ```

3. On your computer, go to `Settings > Network > Network Proxy`, and enable SOCKS proxy pointing to: `127.0.0.1:9999`.

4. Finally, (1) open a new web browser window and (2) access the link provided after you enable Kubeflow, e.g. `10.64.140.43.xip.io` (see previous step).

## Next steps

* Refer to the [microk8s common issues](https://microk8s.io/docs/troubleshooting)
* Refer to the [multipass docs](https://multipass.run/docs)
* Refer to the [user guide](/docs/)
* Refer to the [components](/docs/components/)
* Refer to the guide to [Jupyter notebooks in Kubeflow](/docs/notebooks/)
