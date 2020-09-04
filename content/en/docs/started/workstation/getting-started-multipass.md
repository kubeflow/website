+++
title = "MicroK8s for Kubeflow"
description = "Run Kubeflow locally on built-in hypervisors with MicroK8s" weight = 60
+++

{{% alpha-status 
feedbacklink="https://github.com/kubeflow/kubeflow/issues" %}}

## Introduction

This guide describes how to deploy and run Kubeflow using [MicroK8s](https://microk8s.io/) - a small enterprise Kubernetes cluster — locally on built-in hypervisors.

MicroK8s is available on Windows, macOS and any Linux distribution that supports [Snaps](https://snapcraft.io/). You can download and install MicroK8s by following the installation steps on the [official website](https://microk8s.io/).

Alternatively, you can install MicroK8s on a Linux appliance with [Multipass](https://multipass.run/), which gives you a disposable Ubuntu command line on Windows, macOS or Linux. Refer to the [official documentation](https://multipass.run/docs) for more details.


## Installing and enabling Kubeflow using MicroK8s

To get Kubeflow running using MicroK8s, you'll need to install MicroK8s, enable basic services, and then enable Kubeflow.

**Note:** You need MicroK8s version 1.18 and above to enable and run Kubeflow.

1. Install MicroK8s with [Snap](https://snapcraft.io/) by running the following command:

    ```
    sudo snap install microk8s --classic
    ```

2. Verify that MicroK8s is running:

    ```
    microk8s.status --wait-ready
    ```

3. Having installed MicroK8s, you can now enable common services on your MicroK8s deployment. To do that, run the following command:

    ```
    microk8s.enable dns dashboard storage
    ```

    **Optional:** To enable NVIDIA GPU hardware support, also run `MicroK8s.enable gpu`.

4. Deploy Kubeflow by running this command:

    ```
    microk8s.enable kubeflow
    ```

    The deployment process may take a few minutes. Once it is complete, the script will print out the port number and credentials to access the Kubeflow dashboard.


## Accessing the Kubeflow dashboard

### On your Linux machine

If you installed MicroK8s directly on your Linux machine, you can view the Kubeflow dashboard as follows:

1. Open a web browser window.
2. Access the link provided after you have enabled Kubeflow (for example,
   `10.64.140.43.xip.io`).

### On Windows, macOS, Multipass or a virtual machine

When running MicroK8s on Windows, macOS, Multipass or a virtual machine, you need to create a SOCKS proxy to access the Kubeflow dashboard:

1. Logout from the current session in your terminal using the `exit` command.

2. Re-establish connection to the machine using `SSH`, enabling SOCKS proxy with the `-D9999` parameter.

    In the VM case, run the following command, where `<machine_public_ip>` is your machine's public IP:

    ```
    ssh -D9999 ubuntu@<machine_public_ip>
    ```

    On Windows, macOS or multipass, you can check for the IP first with:

    ```
    multipass list`
    ```

    and then, run this command, replacing `<multipass_public_ip>` with that IP:
    ```
    ssh -D9999 multipass@<multipass_public_ip>
    ```

3. In your Linux operating system, go to **Settings** > **Network** > **Network Proxy**, and enable SOCKS proxy pointing to: `127.0.0.1:9999`.

4. Finally, access the Kubeflow dashboard by:
    1. Opening a new web browser window.
    2. Access the link provided after you have enabled Kubeflow (for example, `10.64.140.43.xip.io`).

## Additional guides

* MicroK8s: [troubleshooting](https://MicroK8s.io/docs/troubleshooting)
* Multipass: [documentation](https://multipass.run/docs)
* Kubeflow: [documentation](/docs/)
* Kubeflow components: [documentation](/docs/components/)
* Jupyter notebooks in Kubeflow: [documentation](/docs/notebooks/)
