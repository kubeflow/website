+++
title = "Kubeflow on MicroK8s"
description = "Run Kubeflow locally on built-in hypervisors with MicroK8s" 
weight = 60
+++


## Introduction

This guide describes how to deploy and run Kubeflow locally with [MicroK8s](https://microk8s.io/) - a small enterprise Kubernetes cluster.

Kubeflow is already built into MicroK8s as an add-on. This means once you install MicroK8s, you can enable Kubeflow straight away.

MicroK8s is available on Windows, macOS and any Linux distribution that supports [Snaps](https://snapcraft.io/). You can download and install MicroK8s by following the installation steps on the [official website](https://microk8s.io/).

Alternatively, you can install MicroK8s on a Linux appliance with [Multipass](https://multipass.run/), which gives you a disposable Ubuntu command line on Windows, macOS or Linux. Refer to the [official documentation](https://multipass.run/docs) for more details.


## Installing and enabling Kubeflow using MicroK8s

To get Kubeflow running using MicroK8s, you'll need to install MicroK8s, enable basic services, and then enable Kubeflow.

**Note:** You need MicroK8s version 1.18 and above to enable and run Kubeflow.

1. Install MicroK8s by running the following command:

    ```shell
    sudo snap install microk8s --classic
    ```

2. Add yourself (current user) to admin group:

    ```shell
    sudo usermod -a -G microk8s $USER
    sudo chown -f -R $USER ~/.kube
    ```

    You will have to `exit` the current session and log in again for this change to take effect.

3. Verify that MicroK8s is running:

    ```shell
    microk8s status --wait-ready
    ```

4. Deploy Kubeflow by running this command:

    ```shell
    microk8s enable kubeflow
    ```

    The deployment process may take a few minutes. Once it is complete, the script will print out the port number and credentials to access the Kubeflow dashboard.

5. **Optional:** To enable NVIDIA GPU hardware support, also run `microk8s enable gpu`.

## Accessing the Kubeflow dashboard

### On your Linux machine

If you installed MicroK8s directly on your Linux machine, you can view the Kubeflow dashboard as follows:

1. Open a web browser window.
2. Access the link provided after you have enabled Kubeflow (for example,
   `10.64.140.43.xip.io`).

### On Windows, macOS, Multipass or a virtual machine

When running MicroK8s on Windows, macOS, Multipass or a virtual machine, you need to create a SOCKS proxy to access the Kubeflow dashboard:

1. Log out from the current session in your terminal using the `exit` command.

2. Re-establish connection to the machine using `SSH`, enabling SOCKS proxy with the `-D9999` parameter.

    In the VM case, run the following command, where `<machine_public_ip>` is your machine's public IP:

    ```shell
    ssh -D9999 ubuntu@<machine_public_ip>
    ```

    On Windows, macOS or Multipass, you can check for the IP first with:

    ```shell
    multipass list
    ```

    and then, run this command, replacing `<multipass_public_ip>` with that IP:
    ```shell
    ssh -D9999 multipass@<multipass_public_ip>
    ```

3. In your host operating system, go to **Settings** > **Network** > **Network Proxy**, and enable SOCKS proxy pointing to: `127.0.0.1:9999`.

4. Finally, access the Kubeflow dashboard by:
    1. Opening a new web browser window.
    2. Accessing the link provided after you have enabled Kubeflow (for example, `10.64.140.43.xip.io`).

## Additional guides

* MicroK8s [getting started docs](https://MicroK8s.io/docs)
* MicroK8s Kubeflow [add-on docs](https://microk8s.io/docs/addon-kubeflow)
* Addittional docs in [Charmed Kubeflow](https://charmed-kubeflow.io/docs)

## Troubleshooting

* MicroK8s [troubleshooting docs](https://MicroK8s.io/docs/troubleshooting)
* Start a [new issue](https://github.com/juju-solutions/bundle-kubeflow/issues/new)
* Reach out on [Slack](https://kubeflow.slack.com/archives/C7REE0EHK)
