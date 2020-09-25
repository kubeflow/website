+++
title = "Kubeflow Pipelines Standalone Deployment with kind, K3s, and K3s on WSL"
description = "Instructions for deploying only Kubeflow Pipelines on a local cluster with kind, K3s, and K3s on WSL"
weight = 30
+++

This guide shows how to deploy Kubeflow Pipelines standalone on a local
Kubernetes cluster using:

- kind
- K3s
- K3s on Windows Subsystem for Linux (WSL)

Such deployment methods can be part of your local environment using the supplied
kustomize manifests for testing purposes. This guide is an alternative to
[Deploying Kubeflow Pipelines
(KFP)](/docs/started/getting-started/#installing-kubeflow).

## Before you get started

- You should be familiar with [Kubernetes](https://kubernetes.io/docs/home/),
  [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and
  [kustomize](https://kustomize.io/).

- You should have a Kubernetes cluster with [kubectl
  installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to work
  with Kubeflow Pipelines standalone.

- For native support of kustomize, you will need kubectl v1.14 or higher. You
  can download and install kubectl by following the [kubectl installation
  guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

## kind

### 1. Installing kind

[kind](https://kind.sigs.k8s.io) is a tool for running local Kubernetes clusters
using Docker container nodes. It was primarily designed for testing
Kubernetes itself. It can also be used for local development or CI.

You can install and configure kind by following the [official quick
start](https://kind.sigs.k8s.io/docs/user/quick-start/). Below is a summary of
how to install kind on Linux, macOS and Windows.

**On Linux:**

Download and move the `kind` executable to your directory in your PATH by
running the following commands in your terminal:

```shell
curl -Lo ./kind https://kind.sigs.k8s.io/dl/{KIND_VERSION}/kind-linux-amd64 && \
chmod +x ./kind && \
mv ./kind /{YOUR_KIND_DIRECTORY}/kind
```

Replace the following:

- `{KIND_VERSION}`: the kind version - for example, `v0.9` (check the latest
  stable binary versions on the [kind releases
  pages](https://github.com/kubernetes-sigs/kind/releases))
- `{YOUR_KIND_DIRECTORY}`: your directory for kind in PATH

**On macOS:**

You can use [Homebrew](https://brew.sh) to install kind:

```shell
brew install kind`
```

**On Windows:**

You can install kind on Windows with the administrative PowerShell console or
[Chocolatey](https://chocolatey.org/packages/kind).

- **PowerShell:** Run these commands to download and move the `kind` executable
  to a directory in your PATH:

  ```powershell
  curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/{KIND_VERSION}/kind-windows-amd64
  Move-Item .\kind-windows-amd64.exe c:\{YOUR_KIND_DIRECTORY}\kind.exe
  ```

  Replace the following:

  - `{KIND_VERSION}`: the kind version - for example, `v0.9` (check the latest
  stable binary versions on the [kind releases
  pages](https://github.com/kubernetes-sigs/kind/releases))
  - `{YOUR_KIND_DIRECTORY}`: your directory for kind in PATH

- **Chocolatey:** Enter the following command:

  ```shell
  choco install kind
  ```

**Note:** kind uses containerd as a default container-runtime. Hence, you cannot
use the standard Kubeflow Pipeline manifests.

**References:**

- [kind: Quick Start Guide](https://kind.sigs.k8s.io/docs/user/quick-start/)
- [kind: Known Issues](https://kind.sigs.k8s.io/docs/user/known-issues/)
- [kind: Working Offline](https://kind.sigs.k8s.io/docs/user/working-offline/)

### 2. Creating a cluster on kind

Having installed kind, you can create a Kubernetes cluster on kind with this
command:

```shell
kind create cluster
```

This will bootstrap a Kubernetes cluster using a pre-built node image. You can
find that image on the Docker Hub at
[`kindest/node`](https://hub.docker.com/r/kindest/node).

If you wish to build the node
image yourself, you can use the `kind build node-image` command—see the official
[building
image](https://kind.sigs.k8s.io/docs/user/quick-start/#building-images) section
for more details. And, to specify another image, use the `--image` flag.

By default, the cluster will be given the name kind. Use the `--name` flag to
assign the cluster a different context name.

**References:**

- [kind: Building Images](https://kind.sigs.k8s.io/docs/user/quick-start/#building-images)

## K3s

### 1. Setting up a cluster on K3s

K3s is a fully compliant Kubernetes distribution with the following
enhancements:

- Packaged as a single binary.
- Lightweight storage backend based on sqlite3 as the default storage mechanism.
  etcd3, MySQL, Postgres also still available.
- Wrapped in simple launcher that handles a lot of the complexity of TLS and
  options.
- Secure by default with reasonable defaults for lightweight environments.
- Simple but powerful “batteries-included” features have been added, such as: a
  local storage provider, a service load balancer, a Helm controller, and the
  Traefik ingress controller.
- Operation of all Kubernetes control plane components is encapsulated in a
  single binary and process. This allows K3s to automate and manage complex
  cluster operations like distributing certificates.
- External dependencies have been minimized (just a modern kernel and cgroup
  mounts needed). K3s packages required dependencies, including:

  - containerd
  - Flannel
  - CoreDNS
  - CNI
  - Host utilities (iptables, socat, etc)
  - Ingress controller (traefik)
  - Embedded service loadbalancer
  - Embedded network policy controller

You can find the the official K3s installation script to install it as a service
on systemd- or openrc-based systems on the official [K3s
website](https://get.k3s.io).

To install K3s using that method, run the following command:

```shell
curl -sfL https://get.k3s.io | sh -
```

**References:**

- [K3s: Quick Start Guide](https://rancher.com/docs/k3s/latest/en/quick-start/)
- [K3s: Known Issues](https://rancher.com/docs/k3s/latest/en/known-issues/)
- [K3s: FAQ](https://rancher.com/docs/k3s/latest/en/faq/)

### 2. Creating a cluster on K3s

1. To create a Kubernetes cluster on K3s, use the following command:

    ```shell
    sudo k3s server &
    ```

    This will bootstrap a Kubernetes cluster kubeconfig is written to
    `/etc/rancher/k3s/k3s.yaml`.

    ```shell
    sudo k3s kubectl get node
    ```

2. (Optional) Check your cluster:

    ```shell
    sudo k3s kubectl get node
    ```

    K3s embeds the popular kubectl command directly in the binaries, so you may
    immediately interact with the cluster through it.

3. (Optional) Run this command on a different node:

    ```shell
    sudo k3s agent --server https://myserver:6443 --token {YOUR_NODE_TOKEN}
    ```

    where `{YOUR_NODE_TOKEN}` should be your token from
    `/var/lib/rancher/k3s/server/node-token` on your server.

## K3s on Windows Subsystem for Linux (WSL)

### 1. Setting up a cluster on K3s on Windows Subsystem for Linux (WSL)

The Windows Subsystem for Linux (WSL) lets developers run a GNU/Linux
environment—including most command-line tools, utilities, and applications—
directly on Windows, unmodified, without the overhead of a traditional virtual
machine or dualboot setup.

The full instructions for installing WSL can be found on the [official Windows
site](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

The following steps summarize what you'll need to set up WSL and then K3s on
WSL.

Follow the [official WSL installation
guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10) from
Microsoft. Don't forget to download your preferred Linux distibution from the
[Microsoft Store](https://aka.ms/wslstore). For example:

- [SUSE Linux Enterprise Server 15
  SP1](https://www.microsoft.com/store/apps/9PN498VPMF3Z)
- [openSUSE Leap 15.2](https://www.microsoft.com/store/apps/9MZD0N9Z4M4H)
- [Ubuntu 18.04 LTS](https://www.microsoft.com/store/apps/9N9TNGVNDL3Q)
- [Debian GNU/Linux](https://www.microsoft.com/store/apps/9MSVKQC78PK6)

**References:**

- [K3s on WSL: Quick Start
  Guide](https://gist.github.com/ibuildthecloud/1b7d6940552ada6d37f54c71a89f7d00)
- [Windows Subsystem for Linux Installation Guide for Windows 10
](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

### 2. Creating a cluster on K3s on WSL

Having installed WSL, follow these steps to create a cluster on K3s on WSL:

1. Begin with creating a Kubernetes cluster on K3s on WSL:

    ```shell
    sudo ./k3s server
    ```

    This will bootstrap a Kubernetes cluster but you won't be able to access it
    yet from your Windows machine.

    **Note:** You can't install K3s using the `curl` script because there is no
    supervisor (systemd or openrc) in WSL.

2. Download the K3s binary from Rancher's [K3s
   repository](https://github.com/rancher/k3s/releases/latest). Then, inside the
   directory where you saved it, run this command to add the execute permission
   to the file:

    ```shell
    chmod +x k3s
    ```

3. Start K3s:

    ```shell
    sudo ./k3s server
    ```

### 3. Setting up access to WSL instance

To set up access to your WSL instance:

1. Copy `/etc/rancher/k3s/k3s.yaml` from WSL to `$HOME/.kube/config`.

2. Open `k3s.yaml` you've just copied and edit the server URL by changing
   `https://localhost:6443` to the IP address of the your WSL instance (`ip addr
   show dev eth0`). For example, `https://192.168.170.170:6443`.

    **Note:** Alternatively, you can run the following commands in the PowerShell
console:
  
    ```powershell
    $env:KUBECONFIG='//wsl$/saio-wsl/etc/rancher/k3s/k3s.yaml'
    sc //wsl$/saio-wsl/etc/rancher/k3s/k3s.yaml ((gc -raw //wsl$/saio-wsl/etc/rancher/k3s/k3s.yaml) -replace '127.0.0.1','localhost')
    ```

3. Run kubectl in Windows Terminal. If you don't have kubectl installed, follow
   the official [Kubernetes on Windows
   instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows).

## Deploying Kubeflow Pipelines

The installation process for Kubeflow Pipelines is the same for kind, K3s, and
K3s on WSL environments.

**Note:** Process Namespace Sharing (PNS) is not mature in Argo. Go to [Argo
Executors](https://argoproj.github.io/argo/workflow-executors/) for more
information. Please reference "pns executors" in any issue your may come across.

1. To deploy the Kubeflow Pipelines, run the following commands:

    ```shell
    # env/platform-agnostic-pns hasn't been publically released, so you will install it from master
    export PIPELINE_VERSION={{% pipelines/latest-version %}}
    kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
    kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
    kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns?ref=$PIPELINE_VERSION"
    ```

    The Kubeflow Pipelines deployment may take several minutes to complete.

2. Verify that the Kubeflow Pipelines UI is accessible by port-forwarding:

    ```shell
    kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
    ```

    Then, open the Kubeflow Pipelines UI at `http://localhost:8080/`. If you are
    using kind or K3s in a virtual machine (VM), you can access the web UI at
    `http://{VM_IP_ADDRESS}:8080/` (replace `{VM_IP_ADDRESS}` with your VM's IP
    address.)

    **Note**: `kubectl apply -k` accepts local paths and paths that are
    formatted as [hashicorp/go-getter
    URLs](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/remoteBuild.md#url-format).
    While the paths in the preceding commands look like URLs, they are not
    valid URLs.

## Uninstalling Kubeflow Pipelines

Below are the steps to remove Kubeflow Pipelines on kind, K3s, or K3s on WSL:

- To uninstall Kubeflow Pipelines using your manifest file, run the following command,
  replacing `{YOUR_MANIFEST_FILE}` with the name of your manifest file:

  ```shell
  kubectl delete -k {YOUR_MANIFEST_FILE}`
  ```

- To uninstall Kubeflow Pipelines using manifests from Kubeflow Pipelines's
  GitHub repository, run these commands:

  ```shell
  export PIPELINE_VERSION={{% pipelines/latest-version %}}
  kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns?ref=$PIPELINE_VERSION"
  kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
  ```

- To uninstall Kubeflow Pipelines using manifests from your local repository or
  file system, run the following commands:

  ```shell
  kubectl delete -k manifests/kustomize/env/platform-agnostic-pns
  kubectl delete -k manifests/kustomize/cluster-scoped-resources
  ```
