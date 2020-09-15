+++
title = "Deploying Kubeflow Pipelines Standalone on a local cluster with kind, k3s, and k3s on WSL"
description = "Instructions to deploy Kubeflow Pipelines Standalone to a local cluster for testing purposes"
weight = 30
+++

This guide shows how to deploy Kubeflow Pipelines Standalone using:

- kind
- k3s
- k3s on Windows Subsystem for Linux (WSL)

Such deployment methods can be part of your local environment using the supplied 
kustomize manifests for test purposes. This guide is an alternative to 
[Deploying Kubeflow Pipelines (KFP)](/docs/started/getting-started/#installing-kubeflow).

## Before you get started

- You should be familiar with [Kubernetes](https://kubernetes.io/docs/home/),
  [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and 
  [kustomize](https://kustomize.io/).
 
- You should have a Kubernetes cluster and install kubectl on it to work with 
  Kubeflow Pipelines Standalone. 
 
- For native support of kustomize, you will need kubectl v1.14 or higher. You 
  can download and install kubectl by following the 
  [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

## kind 

### 1. Installing kind

[kind](https://kind.sigs.k8s.io) is a tool for running local Kubernetes clusters 
using Docker container nodes. `kind` was primarily designed for testing 
Kubernetes itself. It can also be used for local development or CI.

You can install and configure kind by following the 
[official quick start](https://kind.sigs.k8s.io/docs/user/quick-start/).

To get started with kind:

**On Linux:**

Download and move the `kind` executable to your directory in your PATH by 
running the following commands:

  ```SHELL
   curl -Lo ./kind https://kind.sigs.k8s.io/dl/{KIND_VERSION}/kind-linux-amd64 && \
   chmod +x ./kind && \
   mv ./kind /{YOUR_KIND_DIRECTORY}/kind
  ```

where:

* `{KIND_VERSION}`: the kind version; for example, `v0.8.1` as of the date this 
guide was written
* `{YOUR_KIND_DIRECTORY}`: your directory in PATH

**On macOS:**

Use [Homebrew](https://brew.sh) by running the following command:

  ```SHELL
  brew install kind`
  ```

**On Windows:**

- You can use the administrative PowerShell console to run the following 
commands to download and move the `kind` executable to a directory in your PATH:

  ```SHELL
  curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/{KIND_VERSION}/kind-windows-amd64
  Move-Item .\kind-windows-amd64.exe c:\{YOUR_KIND_DIRECTORY}\kind.exe
  ```

where:

* `{KIND_VERSION}`: the kind version; for example, `v0.8.1` as of the date this 
guide was written
* `{YOUR_KIND_DIRECTORY}`: your directory in PATH

- Alternatively, you can use Chocolatey [https://chocolatey.org/packages/kind](https://chocolatey.org/packages/kind):
 
  ```SHELL
  choco install kind
  ```

**Note:** kind uses containerd as a default container-runtime hence you cannot 
use the standard kubeflow pipeline manifests.

**References**:

* [kind: Quick Start Guide](https://kind.sigs.k8s.io/docs/user/quick-start/)

* [kind: Known Issues](https://kind.sigs.k8s.io/docs/user/known-issues/)

* [kind: Working Offline](https://kind.sigs.k8s.io/docs/user/working-offline/)

### 2. Creating a cluster on kind

Having installed kind, you can create a Kubernetes cluster on kind by running
the following command:

```SHELL
kind create cluster
```

This will bootstrap a Kubernetes cluster using a pre-built node image. You can 
find that image on the Docker Hub `kindest/node` [here](https://hub.docker.com/r/kindest/node). 
If you wish to build the node image yourself, you can use the 
`kind build node-image` command—see the official 
[building image](https://kind.sigs.k8s.io/docs/user/quick-start/#building-images) 
section for more details. And, to specify another image, use the `--image` flag.

By default, the cluster will be given the name kind. Use the `--name` flag to 
assign the cluster a different context name.

## k3s

### 1. Setting up a cluster on k3s

k3s is a fully compliant Kubernetes distribution with the following 
enhancements:

* Packaged as a single binary.
* Lightweight storage backend based on sqlite3 as the default storage mechanism. 
etcd3, MySQL, Postgres also still available.
* Wrapped in simple launcher that handles a lot of the complexity of TLS and 
options.
* Secure by default with reasonable defaults for lightweight environments.
* Simple but powerful “batteries-included” features have been added, such as: a 
local storage provider, a service load balancer, a Helm controller, and the 
Traefik ingress controller.
* Operation of all Kubernetes control plane components is encapsulated in a 
single binary and process. This allows k3s to automate and manage complex 
cluster operations like distributing certificates.
* External dependencies have been minimized (just a modern kernel and cgroup 
mounts needed). k3s packages required dependencies, including:

  * containerd
  * Flannel
  * CoreDNS
  * CNI
  * Host utilities (iptables, socat, etc)
  * Ingress controller (traefik)
  * Embedded service loadbalancer
  * Embedded network policy controller

You can find the the official k3s installation script to install it as a service 
on systemd- or openrc-based systems on the official 
[k3s website](https://get.k3s.io). 

To install k3s using that method, run the following command:

```SHELL
curl -sfL https://get.k3s.io | sh -
```

**References**:

* [k3s: Quick Start Guide](https://rancher.com/docs/k3s/latest/en/quick-start/)

* [k3s: Known Issues](https://rancher.com/docs/k3s/latest/en/known-issues/)

* [k3s: FAQ](https://rancher.com/docs/k3s/latest/en/faq/)

### 2. Creating a cluster on k3s

1. To create a Kubernetes cluster on K3s, use the following command:
 
    ```SHELL
    sudo k3s server &
    ```

    This will bootstrap a Kubernetes cluster kubeconfig is written to 
    `/etc/rancher/k3s/k3s.yaml`.

    ```SHELL
    sudo k3s kubectl get node
    ```

2. (Optional) Check your cluster:

    ```SHELL
    sudo k3s kubectl get node
    ```

    k3s embeds the popular kubectl command directly in the binaries, so you may 
  immediately interact with the cluster through it.

3. (Optional) Run the below command on a different node. `NODE_TOKEN` comes from 
`/var/lib/rancher/k3s/server/node-token` on your server:

    ```SHELL
    sudo k3s agent --server https://myserver:6443 --token ${NODE_TOKEN}
    ```

## k3s on Windows Subsystem for Linux (WSL)

### 1. Setting up a cluster on k3s on Windows Subsystem for Linux (WSL)

The Windows Subsystem for Linux (WSL) lets developers run a GNU/Linux 
environment—including most command-line tools, utilities, and applications—
directly on Windows, unmodified, without the overhead of a traditional virtual 
machine or dualboot setup.

The full instructions for installing WSL can be found on the 
[official Windows site](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

The following steps summarize what you'll need to set up WSL and then k3s on 
WSL.

1. Install [WSL] by following the official [docs](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

2. As per the official instructions, update WSL and download your preferred 
distibution:

    * [SUSE Linux Enterprise Server 15 SP1](https://www.microsoft.com/store/apps/9PN498VPMF3Z)
    * [openSUSE Leap 15.2](https://www.microsoft.com/store/apps/9MZD0N9Z4M4H)
    * [Ubuntu 18.04 LTS](https://www.microsoft.com/store/apps/9N9TNGVNDL3Q)
    * [Debian GNU/Linux](https://www.microsoft.com/store/apps/9MSVKQC78PK6)

    **References**:

    * [k3s on WSL: Quick Start Guide](https://gist.github.com/ibuildthecloud/1b7d6940552ada6d37f54c71a89f7d00)

### 2. Creating a cluster on k3s on WSL

Below are the steps to create a cluster on k3s in WSL

1. To create a Kubernetes cluster on k3s on WSL, run the following command:

    ```SHELL
    sudo ./k3s server
    ```

    This will bootstrap a Kubernetes cluster but you will cannot yet access from 
    your Windows machine to the cluster itself.

    **Note:** You can't install k3s using the curl script because there is no 
    supervisor (systemd or openrc) in WSL.

2. Download the k3s binary from https://github.com/rancher/k3s/releases/latest. 
Then, inside the directory where you download the k3s binary to, run this 
command to add execute permission to the k3s binary:

    ```SHELL
    chmod +x k3s
    ```

3. Start k3s:

    ```SHELL
    sudo ./k3s server
    ```

### 3. Setting up access to WSL instance

To set up access to your WSL instance:

1. Copy `/etc/rancher/k3s/k3s.yaml` from WSL to `%HOME%.kube\config`.

2. Edit the copied file by changing the server URL from `https://localhost:6443` 
to the IP of the your WSL instance (`ip addr show dev eth0`) (For example, 
`https://192.168.170.170:6443`.)

3. Run kubectl in a Windows terminal. If you don't kubectl 
installed, follow the official 
[Kubernetes on Windows instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows).

## Deploying Kubeflow Pipelines

The installation process for Kubeflow Pipelines is the same for all three 
environments covered in this guide: kind, k3s, and k3s on WSL.

**Note**: Process Namespace Sharing (PNS) is not mature in Argo. 
Go to [Argo Executors](https://argoproj.github.io/argo/workflow-executors/) 
for more informations. Please reference "pns executors" in any issue that may 
arise using it.

1. To deploy the Kubeflow Pipelines, run the following commands:

    ```SHELL
    # env/platform-agnostic-pns hasn't been publically released, so we install from master temporarily
    export PIPELINE_VERSION={{% pipelines/latest-version %}}
    kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
    kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
    kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns?ref=$PIPELINE_VERSION"
    ```

    The Kubeflow Pipelines deployment may take several minutes to complete.

    **Note**: `kubectl apply -k` accepts local paths and paths that are formatted as 
[hashicorp/go-getter URLs](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/remoteBuild.md#url-format). While the paths in the preceding commands look like URLs, they are not valid 
URLs.

## Uninstalling Kubeflow Pipelines

Below are the steps to remove Kubeflow Pipelines on kind, k3s, or k3s on WSL:

- To uninstall Kubeflow Pipelines using your manifest file, run this command:

  ```SHELL
  kubectl delete -k {YOUR_MANIFEST_FILE}`
  ```

- To uninstall Kubeflow Pipelines using manifests from Kubeflow Pipelines's 
GitHub repository, run these commands:

  ```SHELL
  export PIPELINE_VERSION={{% pipelines/latest-version %}}
  kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns?ref=$PIPELINE_VERSION"
  kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
  ```

- To uninstall Kubeflow Pipelines using manifests from your local repository or 
file system, run the following commands:

  ```SHELL
  kubectl delete -k manifests/kustomize/env/platform-agnostic-pns
  kubectl delete -k manifests/kustomize/cluster-scoped-resources
  ```
