+++
title = "Kubeflow Pipelines Local Cluster Deployment"
description = "Instructions to deploy Kubeflow Pipelines standalone to a local cluster for testing purposes"
weight = 20
+++

As an alternative to deploying Kubeflow Pipelines (KFP) as part of the
[Kubeflow deployment](/docs/started/getting-started/#installing-kubeflow), you also have a choice
to deploy only Kubeflow Pipelines. Follow the instructions below to deploy
Kubeflow Pipelines as part of your local environment for test purposes using the supplied kustomize manifests.

You should be familiar with [Kubernetes](https://kubernetes.io/docs/home/),
[kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and [kustomize](https://kustomize.io/).

{{% alert title="Installation options for Kubeflow Pipelines standalone" color="info" %}}
This guide currently describes how to install Kubeflow Pipelines standalone
on Kind,K3s and K3s on WSL2 other configurations will be added here covering minikube(TBD) and others.
{{% /alert %}}

## Before you get started

Working with Kubeflow Pipelines Standalone requires a Kubernetes cluster as well as an installation of kubectl.

### Download and install kubectl

Download and install kubectl by following the [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

You need kubectl version 1.14 or higher for native support of kustomize.

### Set up your cluster on Kind

kind is a tool for running local Kubernetes clusters using Docker container “nodes”.
kind was primarily designed for testing Kubernetes itself, but may be used for local development or CI.
See the guide [to install and configure kind](https://kind.sigs.k8s.io/docs/user/quick-start/).
For simplicity we report below the basic steps here.
First download and move kind executable somewhere in your path directory:
On Linux:

```
curl -Lo ./kind https://kind.sigs.k8s.io/dl/<KIND-VERSION>/kind-linux-amd64
chmod +x ./kind
mv ./kind /some-dir-in-your-PATH/kind
```
On Mac:

```
 brew install kind
```
On Windows from within and administrative PowerShell console:

```
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/<KIND-VERSION>/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
```
On Windows via Chocolatey [https://chocolatey.org/packages/kind](https://chocolatey.org/packages/kind):

```
choco install kind
```
Note, kind use containerd as default container-runtime hence you cannot use the standard kubeflow pipeline manifests.

**References**:

  * [Kind - Quick Start Guide](https://kind.sigs.k8s.io/docs/user/quick-start/)

  * [Kind - Known Issues](https://kind.sigs.k8s.io/docs/user/known-issues/)

  * [Kind - Working Offline](https://kind.sigs.k8s.io/docs/user/working-offline/)

### Create your cluster on Kind

Creating a Kubernetes cluster is as simple as ```kind create cluster```.

This will bootstrap a Kubernetes cluster using a pre-built node image - you can find it on docker hub kindest/node. If you desire to build the node image yourself see the building image section. To specify another image use the --image flag.

By default, the cluster will be given the name kind. Use the --name flag to assign the cluster a different context name.

### Set up your cluster on K3S

K3s is a fully compliant Kubernetes distribution with the following enhancements:

* Packaged as a single binary.
* Lightweight storage backend based on sqlite3 as the default storage mechanism. etcd3, MySQL, Postgres also still available.
* Wrapped in simple launcher that handles a lot of the complexity of TLS and options.
* Secure by default with reasonable defaults for lightweight environments.
* Simple but powerful “batteries-included” features have been added, such as: a local storage provider, a service load balancer, a Helm controller, and the Traefik ingress controller.
* Operation of all Kubernetes control plane components is encapsulated in a single binary and process. This allows K3s to automate and manage complex cluster operations like distributing certificates.
* External dependencies have been minimized (just a modern kernel and cgroup mounts needed). K3s packages required dependencies, including:
     * containerd
     * Flannel
     * CoreDNS
     * CNI
     * Host utilities (iptables, socat, etc)
     * Ingress controller (traefik)
     * Embedded service loadbalancer
     * Embedded network policy controller

K3s provides an installation script that is a convenient way to install it as a service on systemd or openrc based systems. This script is available at https://get.k3s.io. To install K3s using this method, just run:

```
curl -sfL https://get.k3s.io | sh -
```
Note, kind use containerd as default container-runtime hence you cannot use the standard kubeflow pipeline manifests.

**References**:

  * [K3S - Quick Start Guide](https://rancher.com/docs/k3s/latest/en/quick-start/)

  * [K3S - Known Issues](https://rancher.com/docs/k3s/latest/en/known-issues/)

  * [K3S - FAQ](https://rancher.com/docs/k3s/latest/en/faq/)

### Create your cluster on K3S

Creating a Kubernetes cluster is as simple as ```sudo k3s server &```.

This will bootstrap a Kubernetes cluster kubeconfig is written to /etc/rancher/k3s/k3s.yaml

```
sudo k3s kubectl get node
```

On a different node run the below. NODE_TOKEN comes from /var/lib/rancher/k3s/server/node-token on your server

``` 
sudo k3s agent --server https://myserver:6443 --token ${NODE_TOKEN}
```
### Set up your cluster on K3S on WSL2

K3s is a fully compliant Kubernetes distribution with the following enhancements:

* Packaged as a single binary.
* Lightweight storage backend based on sqlite3 as the default storage mechanism. etcd3, MySQL, Postgres also still available.
* Wrapped in simple launcher that handles a lot of the complexity of TLS and options.
* Secure by default with reasonable defaults for lightweight environments.
* Simple but powerful “batteries-included” features have been added, such as: a local storage provider, a service load balancer, a Helm controller, and the Traefik ingress controller.
* Operation of all Kubernetes control plane components is encapsulated in a single binary and process. This allows K3s to automate and manage complex cluster operations like distributing certificates.
* External dependencies have been minimized (just a modern kernel and cgroup mounts needed). K3s packages required dependencies, including:
     * containerd
     * Flannel
     * CoreDNS
     * CNI
     * Host utilities (iptables, socat, etc)
     * Ingress controller (traefik)
     * Embedded service loadbalancer
     * Embedded network policy controller


The Windows Subsystem for Linux lets developers run a GNU/Linux environment -- including most command-line tools, utilities, and applications -- directly on Windows, unmodified, without the overhead of a traditional virtual machine or dualboot setup.

1. Install WSL2 as per official Microsoft Documentation [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

2. Update to WSL2 and download your favorite distibution:
     * [SUSE Linux Enterprise Server 15 SP1](https://www.microsoft.com/store/apps/9PN498VPMF3Z)
     * [openSUSE Leap 15.2](https://www.microsoft.com/store/apps/9MZD0N9Z4M4H)
     * [Ubuntu 18.04 LTS](https://www.microsoft.com/store/apps/9N9TNGVNDL3Q)
     * [Debian GNU/Linux](https://www.microsoft.com/store/apps/9MSVKQC78PK6)

**References**:

  * [K3S on WSL2 - Quick Start Guide](https://gist.github.com/ibuildthecloud/1b7d6940552ada6d37f54c71a89f7d00)


### Create your cluster on K3S on WSL2

Creating a Kubernetes cluster is as simple as ```sudo ./k3s server```.

This will bootstrap a Kubernetes cluster but you will cannot yet access from your windows 10 machine to the cluster itself.

**Note:** You can't install k3s using the curl script because there is no supervisor (systemd or openrc) in WSL2.

* Download k3s binary from https://github.com/rancher/k3s/releases/latest

     ```chmod +x k3s```
* Run k3s 
     ```sudo ./k3s server```

### Setup access to your WSL2 instance
    
 * Copy ```/etc/rancher/k3s/k3s.yaml``` from WSL to your home in Windows to ```%HOME%.kube\config```. Edit the copied file and change the server URL from ```https://localhost:6443``` to the IP of the your WSL2 instance (```ip addr show dev eth0```). So something like ```https://192.168.170.170:6443```.
 * Run kubectl from windows, if you don't have it yet you may obtain it from [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)

## Deploying Kubeflow Pipelines

The installation process for Kubeflow pipelines is the same for all the environments: kind, k3s, k3s on WSL2.

1. Deploy the Kubeflow Pipelines:

     ```
     export PIPELINE_VERSION={{% pipelines/latest-version %}}
     kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
     kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
     kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns-executor?ref=$PIPELINE_VERSION"
     ```

     The Kubeflow Pipelines deployment requires approximately 3 minutes to complete.

     **Note**: The above commands apply to Kubeflow Pipelines version 0.4.0 and higher.

     **Note**: `kubectl apply -k` accepts local paths and paths that are formatted as [hashicorp/go-getter URLs](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/remoteBuild.md#url-format). While the paths in the preceding commands look like URLs, the paths are not valid URLs.

     **Note**: Beside the

1. Get the public URL for the Kubeflow Pipelines UI and use it to access the Kubeflow Pipelines UI:

     ```
     kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
     ```


## Uninstalling Kubeflow Pipelines

To uninstall Kubeflow Pipelines, run `kubectl delete -k <manifest-file>`.

For example, to uninstall KFP using manifests from a GitHub repository, run:

```
export PIPELINE_VERSION={{% pipelines/latest-version %}}
kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-pns-executor?ref=$PIPELINE_VERSION"
kubectl delete -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
```

To uninstall KFP using manifests from your local repository or file system, run:

```
kubectl delete -k manifests/kustomize/env/platform-agnostic-pns-executor
kubectl delete -k manifests/kustomize/cluster-scoped-resources
```
