+++
title = "Getting Started with Kubeflow"
description = "Quickly get running with your ML Workflow"
weight = 1
+++

## Who should consider using Kubeflow?

Based on the current functionality you should consider using Kubeflow if:

  * You want to train/serve TensorFlow models in different environments (e.g.
    local, on prem, and cloud)
  * You want to use Jupyter notebooks to manage TensorFlow training jobs
  * You want to launch training jobs that use resources -- such as additional
    CPUs or GPUs -- that aren't available on your personal computer
  * You want to combine TensorFlow with other processes
       * For example, you may want to use
	 [tensorflow/agents](https://github.com/tensorflow/agents) to run
	 simulations to generate data for training reinforcement learning
	 models.

This list is based ONLY on current capabilities. We are investing significant
resources to expand the functionality and actively soliciting help from
companies and individuals interested in contributing (see
[Contributing](/docs/contributing/)).

## Installation without pre-existing Kubernetes

Here is how you can get Kubeflow up and running if you don't have a K8s cluster
running already.

### Local

There are a several options:

   * [MiniKF](/docs/started/getting-started-minikf/)
      * MiniKF is a fast and easy way to get started with Kubeflow.
      * It installs with just two commands and then you are up for
	experimentation, and for running complete Kubeflow Pipelines.
      * MiniKF runs on all major operating systems (Linux, macOS, Windows)

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

### Cloud

   * [Kubernetes Engine setup](/docs/started/getting-started-gke/).

For more general information on setting up a Kubernetes cluster please refer to
[Kubernetes Setup](https://kubernetes.io/docs/setup/). If you want to use GPUs,
be sure to follow the Kubernetes [instructions for enabling
GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/).

## Installation on existing Kubernetes

Use these instructions if you are already running a Κ8s cluster on-prem.

### Install Kubeflow

Requirements:

  * ksonnet version {{% ksonnet-min-version %}} or later. See the
    [ksonnet component guide](/docs/components/ksonnet) for help with installing
    ksonnet and understanding how Kubeflow uses ksonnet.
  * Kubernetes version {{% kubernetes-min-version %}} or later
  * kubectl

Download, set up, and deploy. (If you prefer to work from source code, feel free
to skip step 1):

1. Run the following commands to download `kfctl.sh`

    ```
    mkdir ${KUBEFLOW_SRC}
    cd ${KUBEFLOW_SRC}
    export KUBEFLOW_TAG={{% kf-stable-tag %}}
    curl
    https://raw.githubusercontent.com/kubeflow/kubeflow/${KUBEFLOW_TAG}/scripts/download.sh | bash
     ```
   * **KUBEFLOW_SRC** a directory where you want to download the source to
   * **KUBEFLOW_TAG** a tag corresponding to the version to check out, such as
     `master` for the latest code.
   * **Note** you can also just clone the repository using git.

2. Run the following commands to setup and deploy Kubeflow:

    ```
    ${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform none
    cd ${KFAPP}
    ${KUBEFLOW_SRC}/scripts/kfctl.sh generate k8s
    ${KUBEFLOW_SRC}/scripts/kfctl.sh apply k8s
    ```
   * **${KFAPP}** the name for the kubeflow deployment (shouldn't be a path). A
     directory with the name will be created under `pwd` when you run init, and
     that is where kubeflow configurations will be stored.
      * The ksonnet app will be created in the directory **${KFAPP}/ks_app**
   * (optional) For GPU support, make sure your cluster is in a
     [zone that has GPUs](https://cloud.google.com/compute/docs/regions-zones/).
     To set the zone explicitly, append `--zone ${ZONE}` to the `init` command.

**Important**: The commands above will enable collection of **anonymous** user
data to help us improve Kubeflow; for more information including instructions
for explicitly disabling it please refer to the [usage reporting
guide](/docs/other-guides/usage-reporting/).

### Remove KubeFlow

To remove your Kubeflow deployment, you can use the same `kfkctl` script as
above. Note, that it will delete the namespace kubeflow along with everything
you have deployed in it!

    
    cd ${KUBEFLOW_SRC}/${KFAPP}
    ${KUBEFLOW_SRC}/scripts/kfctl.sh delete k8s
    
    
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
