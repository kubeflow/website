+++
title = "Kubeflow Pipelines Local Cluster Deployment"
description = "Instructions to deploy Kubeflow Pipelines standalone to a local cluster for testing purposes"
weight = 20
+++


This guide shows how to deploy only Kubeflow Pipelines—Kubeflow Pipelines Standalone using:

- kind
- k3s
- k3s on WSL

It can be part of your local environment using the supplied kustomize manifests for test 
purposes. The guide is an alternative to [deploying Kubeflow Pipelines (KFP)](/docs/started/getting-started/#installing-kubeflow).

## Before you get started

- You should be familiar with [Kubernetes](https://kubernetes.io/docs/home/),
  [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and [kustomize](https://kustomize.io/).
 
- You should have a Kubernetes cluster and install kubectl to work with Kubeflow Pipelines Standalone. If you don't have kubectl installed, follow the 
  [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
 
- For native support of kustomize, you will need kubectl v1.14 or higher.

### Download and install kubectl

Download and install kubectl by following the [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

You need kubectl version 1.14 or higher for native support of kustomize.

## Installing kind

[kind](https://kind.sigs.k8s.io) is a tool for running local Kubernetes clusters using Docker 
container nodes. `kind` was primarily designed for testing Kubernetes itself, but may be 
used for local development or CI.

You can install and configure kind by following the [official quick start](https://kind.sigs.k8s.io/docs/user/quick-start/).

Below are basic installation steps to get you started.

**On Linux:**

Download and move the `kind` executable to your directory in your PATH by running the 
following commands:
```SHELL
 curl -Lo ./kind https://kind.sigs.k8s.io/dl/{KIND_VERSION}/kind-linux-amd64 && \
 chmod +x ./kind && \
 mv ./kind /{YOUR_KIND_DIRECTORY}/kind
```
where:

* `{KIND_VERSION}`: the kind version; for example, `v0.8.1` as of the date this guide was written
* `{YOUR_KIND_DIRECTORY}`: your directory in PATH

**On macOS:**

Use [Homebrew](https://brew.sh) by running the following command:
```SHELL
brew install kind`
```
**On Windows:**

- You can use the administrative PowerShell console to run the following commands to 
download and move the `kind` executable to a directory in your PATH:
```SHELL
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/{KIND_VERSION}/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\{YOUR_KIND_DIRECTORY}\kind.exe
```
where:

* `{KIND_VERSION}`: the kind version; for example, `v0.8.1` as of the date this guide was 
written
* `{YOUR_KIND_DIRECTORY}`: your directory in PATH

- Alternatively, you can use Chocolatey [https://chocolatey.org/packages/kind](https://chocolatey.org/packages/kind):
- 
```SHELL
choco install kind
```
**Note:** kind use containerd as default container-runtime hence you cannot use the 
standard kubeflow pipeline manifests.

**References**:

* [kind Quick Start Guide](https://kind.sigs.k8s.io/docs/user/quick-start/)

* [kind: Known Issues](https://kind.sigs.k8s.io/docs/user/known-issues/)

* [kind: Working Offline](https://kind.sigs.k8s.io/docs/user/working-offline/)

## Creating a cluster on kind

Having installed kind, you can create a Kubernetes cluster on kind by running:
```SHELL
kind create cluster
```
This will bootstrap a Kubernetes cluster using a pre-built node image. You can find that 
image on the Docker Hub `kindest/node` [here](https://hub.docker.com/r/kindest/node). 
If you wish to build the node image yourself, you can use the `kind build node-image` 
command—see the official [building image](https://kind.sigs.k8s.io/docs/user/quick-start/#building-images) 
section for more details. And, to specify another image use the `--image` flag.

By default, the cluster will be given the name kind. Use the `--name` flag to assign the 
cluster a different context name.

## Setting up a cluster on k3s

k3s is a fully compliant Kubernetes distribution with the following enhancements:

* Packaged as a single binary.
* Lightweight storage backend based on sqlite3 as the default storage mechanism. etcd3, 
MySQL, Postgres also still available.
* Wrapped in simple launcher that handles a lot of the complexity of TLS and options.
* Secure by default with reasonable defaults for lightweight environments.
* Simple but powerful “batteries-included” features have been added, such as: a local storage 
provider, a service load balancer, a Helm controller, and the Traefik ingress controller.
* Operation of all Kubernetes control plane components is encapsulated in a single binary and 
process. This allows k3s to automate and manage complex cluster operations like distributing 
certificates.
* External dependencies have been minimized (just a modern kernel and cgroup mounts needed). 
k3s packages required dependencies, including:

  * containerd
  * Flannel
  * CoreDNS
  * CNI
  * Host utilities (iptables, socat, etc)
  * Ingress controller (traefik)
  * Embedded service loadbalancer
  * Embedded network policy controller

You can find the the official k3s installation script to install it as a service on systemd- or openrc-based 
systems on the official [k3s website](https://get.k3s.io). 

To install K3s using that method, run the following command:
```SHELL
curl -sfL https://get.k3s.io | sh -
```
Note, kind use containerd as default container-runtime hence you cannot use the standard kubeflow pipeline manifests.

**Note:** You cannot use the standard Kubeflow Pipeline manifests as kind uses 
[containerd](https://github.com/containerd/containerd) as a default container-runtime.

**References**:

* [K3S: Quick Start Guide](https://rancher.com/docs/k3s/latest/en/quick-start/)

* [k3s: Known Issues](https://rancher.com/docs/k3s/latest/en/known-issues/)

* [k3s: FAQ](https://rancher.com/docs/k3s/latest/en/faq/)

### Creating a cluster on k3s

1. To create a Kubernetes cluster on K3s, use the following command:
```SHELL
sudo k3s server &
```
This will bootstrap a Kubernetes cluster kubeconfig is written to /etc/rancher/k3s/k3s.yaml
```SHELL
sudo k3s kubectl get node
```
2. (Optional) Check your cluster
```SHELL
sudo k3s kubectl get node
```
K3s embed the popular kubectl command directly in the binaries so you may immediately interact with the cluster through it.

3. (Optional) Run the below command on a different node. `NODE_TOKEN` comes from `/var/lib/rancher/k3s/server/node-token` 
on your server
```SHELL
sudo k3s agent --server https://myserver:6443 --token ${NODE_TOKEN}
```
### Setting up a cluster on k3s on Windows Subsystem for Linux (WSL)

The Windows Subsystem for Linux (WSL) lets developers run a GNU/Linux environment—
including most command-line tools, utilities, and applications—directly on Windows, unmodified, 
without the overhead of a traditional virtual machine or dualboot setup.

The full instructions for installing WSL can be found on the [official Windows site](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

1. Install WSL

The following steps summarize what you'll need to set up WSL first, and then K3s on WSL.

  1. Install [WSL] by following the official [docs](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

  2. As per the official instructions, update WSL and download your favorite distibution:

     * [SUSE Linux Enterprise Server 15 SP1](https://www.microsoft.com/store/apps/9PN498VPMF3Z)
     * [openSUSE Leap 15.2](https://www.microsoft.com/store/apps/9MZD0N9Z4M4H)
     * [Ubuntu 18.04 LTS](https://www.microsoft.com/store/apps/9N9TNGVNDL3Q)
     * [Debian GNU/Linux](https://www.microsoft.com/store/apps/9MSVKQC78PK6)

**References**:

* [K3s on WSL: Quick Start Guide](https://gist.github.com/ibuildthecloud/1b7d6940552ada6d37f54c71a89f7d00)

1. Install WSL as per official Microsoft Documentation [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

2. Update to WSL and download your favorite distribution:
     * [SUSE Linux Enterprise Server 15 SP1](https://www.microsoft.com/store/apps/9PN498VPMF3Z)
     * [openSUSE Leap 15.2](https://www.microsoft.com/store/apps/9MZD0N9Z4M4H)
     * [Ubuntu 18.04 LTS](https://www.microsoft.com/store/apps/9N9TNGVNDL3Q)
     * [Debian GNU/Linux](https://www.microsoft.com/store/apps/9MSVKQC78PK6)

**References**:

* [K3S on WSL - Quick Start Guide](https://gist.github.com/ibuildthecloud/1b7d6940552ada6d37f54c71a89f7d00)

## Creating a cluster on k3s on WSL

1. To create a Kubernetes cluster, use `sudo ./k3s server`.

This will bootstrap a Kubernetes cluster but you will cannot yet access from your Windows machine to the cluster itself.

**Note:** You can't install k3s using the curl script because there is no supervisor (systemd or openrc) in WSL.

2. Download k3s binary from https://github.com/rancher/k3s/releases/latest. Then run this command in the directory where you download the k3s binary to:
   ```SHELL
   chmod +x k3s
   ```
3. Run k3s:
   ```SHELL
   sudo ./k3s server
   ```
### Setup access to your WSL instance

* Copy `/etc/rancher/k3s/k3s.yaml` from WSL to `%HOME%.kube\config`.
Edit the copied file by changing the server URL from `https://localhost:6443` to the IP of the your WSL instance (`ip addr show dev eth0`) (For 
example, `https://192.168.170.170:6443`.)

* Run kubectl within your favorite terminal in Windows, if you don't have it yet you may obtain it from 
[here](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)

## Deploying Kubeflow Pipelines

The installation process for Kubeflow pipelines is the same for all the environments: kind, k3s, k3s on WSL.

**Note**: Process Namespace Sharing (PNS) is not mature in Argo, see [Argo Executors](https://argoproj.github.io/argo/workflow-executors/) for more informations.Please reference "pns executors" in any issue that may arise using it.

1. Deploy the Kubeflow Pipelines:
```SHELL
export PIPELINE_VERSION={{% pipelines/latest-version %}}
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns?ref=$PIPELINE_VERSION"
```
The Kubeflow Pipelines deployment requires approximately 3 minutes to complete.

**Note**: The above commands apply to Kubeflow Pipelines version 0.4.0 and higher.

**Note**: `kubectl apply -k` accepts local paths and paths that are formatted as [hashicorp/go-getter URLs](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/remoteBuild.md#url-format). While the paths in the preceding commands look like URLs, the paths are not valid URLs.

## Uninstalling Kubeflow Pipelines

To uninstall Kubeflow Pipelines, run `kubectl delete -k <manifest-file>`.

For example, to uninstall KFP using manifests from a GitHub repository, run:

```SHELL
export PIPELINE_VERSION={{% pipelines/latest-version %}}
kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns?ref=$PIPELINE_VERSION"
kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
```

To uninstall KFP using manifests from your local repository or file system, run:

```SHELL
kubectl delete -k manifests/kustomize/env/platform-agnostic-pns
kubectl delete -k manifests/kustomize/cluster-scoped-resources
```
