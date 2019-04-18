+++
title = "Getting Started with Kubeflow"
description = "Quickly get running with your ML Workflow"
weight = 1
+++

There are a variety of ways to install Kubeflow

* GCP users should follow the [guide for deploying on GCP](/docs/gke/deploy/)
* On prem users or users with an existing Kubernetes cluster should follow the [guide for deploying on kubernetes](/docs/started/getting-started-k8s/)
* Users who want to run Kubernetes locally in a virtual machine can select one of the following options

   * [MiniKF setup](/docs/started/getting-started-minikf/)
      * MiniKF is a fast and easy way to get started with Kubeflow.
      * It installs with just two commands and then you are up for
	experimentation, and for running complete Kubeflow Pipelines.
      * MiniKF runs on all major operating systems (Linux, macOS, Windows).

   * [Minikube setup](/docs/started/getting-started-minikube/)
      * Minikube leverages virtualization applications like [Virtual
	Box](https://www.virtualbox.org/) or [VMware
	Fusion](https://www.vmware.com/products/fusion.html) to host the virtual
	machine and provides a CLI that can be leveraged outside of the VM.
      * Minikube defines a fully baked ISO that contains a minimal operating
	system and kubernetes already installed.
      * This option may be useful if you are just starting to learn and already
	have one of the virtualization applications already installed.

   * [Microk8s setup](/docs/started/getting-started-multipass/)
      * The benefits of using [Microk8s](https://microk8s.io/) include:
	   - Can be installed on any Linux system as a
	     [snap](https://snapcraft.io/)
	   - Strong isolation and update semantics - your single-node cluster
	     will be updated within a short period after upstream Kubernetes
	     releases.
	   - GPU pass through built in - e.g. **microk8s.enable gpu**
      * If you are not on a Linux machine, or you want to use Kubeflow in a
	confined environment, then use
	[Multipass](https://github.com/CanonicalLtd/multipass) to launch a
	virtual machine. Benefits include:
	   - Ubuntu [cloud-images](http://cloud-images.ubuntu.com/) already
	     integrated.
	   - Lightweight hypervisor using native operating system mechanisms
	     (e.g. [Hypervisor
	     Framework](https://developer.apple.com/documentation/hypervisor) on
	     MacOS, [Hyper-V on Windows
	     10](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v),
	     QEMU/KVM for linux)
	   - Eliminates the need to install a separate virtualization
	     application.
	   - You can use cloud-init to customize the VM (as you might in a cloud)
    
## Troubleshooting

For detailed troubleshooting instructions, please refer to the [troubleshooting
guide](/docs/other-guides/troubleshooting/).

## Resources

* The [documentation](/docs/) provides in-depth instructions for using Kubeflow
* Self-paced scenarios for learning and trying out Kubeflow:
  * [Codelabs](https://codelabs.developers.google.com/?cat=tensorflow)
      * [Introduction to Kubeflow on Google Kubernetes
        Engine](https://codelabs.developers.google.com/codelabs/kubeflow-introduction/index.html)
      * [Kubeflow End to End: GitHub Issue
        Summarization](https://codelabs.developers.google.com/codelabs/cloud-kubeflow-e2e-gis/index.html)
      * [Kubeflow Pipelines: GitHub Issue
        Summarization](https://codelabs.developers.google.com/codelabs/cloud-kubeflow-pipelines-gis/index.html)
  * [Katacoda](https://www.katacoda.com/kubeflow)
      * [Deploying GitHub Issue Summarization with
        Kubeflow](https://www.katacoda.com/kubeflow/scenarios/deploying-github-issue-summarization)
      * [Deploying
        Kubeflow](https://www.katacoda.com/kubeflow/scenarios/deploying-kubeflow)
      * [Deploying Kubeflow with
        Ksonnet](https://www.katacoda.com/kubeflow/scenarios/deploying-kubeflow-with-ksonnet)
      * [Deploying Pytorch with
        Kubeflow](https://www.katacoda.com/kubeflow/scenarios/deploy-pytorch-with-kubeflow)
  * [Qwiklabs](https://qwiklabs.com/catalog?keywords=kubeflow)
      * [Introduction to Kubeflow on Google Kubernetes
        Engine](https://qwiklabs.com/focuses/960?locale=en&parent=catalog)
      * [Kubeflow End to End: GitHub Issue
        Summarization](https://qwiklabs.com/focuses/1257?locale=en&parent=catalog)
