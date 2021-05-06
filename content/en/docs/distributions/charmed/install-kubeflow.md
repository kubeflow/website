+++
title = "Installing Kubeflow with Charmed Operators"
description = "Instructions for Kubeflow deployment with Kubeflow Charmed Operators"
weight = 10
+++

This guide outlines the steps you need to install and deploy Kubeflow with [Charmed Operators](https://charmed-kubeflow.io/docs) and [Juju](https://juju.is/docs/kubernetes) on any conformant Kubernetes, including [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/), [Amazon Elastic Kubernetes Service (EKS)](https://docs.aws.amazon.com/eks/index.html), [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/docs/), [OpenShift](https://docs.openshift.com), and any [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/)-deployed cluster (provided that you have access to it via `kubectl`). 

#### 1. Install the Juju client

On Linux, install `juju` via [snap](https://snapcraft.io/docs/installing-snapd) with the following command:

```bash
snap install juju --classic
```

If you use macOS, you can use [Homebrew](https://brew.sh) and type `brew install juju` in the command line. For Windows, download the Windows [installer for Juju](https://launchpad.net/juju/2.8/2.8.5/+download/juju-setup-2.8.5-signed.exe).

#### 2. Connect Juju to your Kubernetes cluster

To operate workloads in your Kubernetes cluster with Juju, you have to add the cluster to the list of *clouds* in Juju via the `add-k8s` command.

If your Kubernetes config file is in the default location (such as `~/.kube/config` on Linux) and you only have one cluster, you can simply run:

```bash
juju add-k8s myk8s
```
If your kubectl config file contains multiple clusters, you can specify the appropriate one by name:

```bash
juju add-k8s myk8s --cluster-name=foo
```
Finally, to use a different config file, you can set the `KUBECONFIG` environment variable to point to the relevant file. For example:

```bash
KUBECONFIG=path/to/file juju add-k8s myk8s
```

For more details, go to the [official Juju documentation](https://juju.is/docs/clouds).

#### 3. Create a controller

To operate workloads on your Kubernetes cluster, Juju uses controllers. You can create a controller with the  `bootstrap`  command:

```bash
juju bootstrap myk8s my-controller
```

This command will create a couple of pods under the `my-controller` namespace. You can see your controllers with the `juju controllers` command.

You can read more about controllers in the [Juju documentation](https://juju.is/docs/creating-a-controller).

#### 4. Create a model

A model in Juju is a blank canvas where your operators will be deployed, and it holds a 1:1 relationship with a Kubernetes namespace.

You can create a model and give it a name, e.g. `kubeflow`, with the `add-model` command, and you will also be creating a Kubernetes namespace of the same name:

```bash
juju add-model kubeflow
```
You can list your models with the `juju models` command.

#### 5. Deploy Kubeflow

{{% alert color="warning" %}}
To deploy the full Kubeflow bundle, you'll need at least 50Gb available of disk, 14Gb of RAM, and 2 CPUs available in your machine/VM.
If you have fewer resources, deploy kubeflow-lite or kubeflow-edge.
{{% /alert %}}

Once you have a model, you can simply `juju deploy` any of the provided [Kubeflow bundles](https://charmed-kubeflow.io/docs/operators-and-bundles) into your cluster. For the _Kubeflow lite_ bundle, run:

```bash
juju deploy kubeflow-lite
```

and your Kubeflow installation should begin!

You can observe your Kubeflow deployment getting spun-up with the command:

```bash
watch -c juju status --color
```

#### 6. Set URL in authentication methods 

Finally, you need to enable your Kubeflow dashboard access. Provide the dashboard's public URL to dex-auth and oidc-gatekeeper as follows:

```bash
juju config dex-auth public-url=http://<URL>
juju config oidc-gatekeeper public-url=http://<URL>
```

where in place of `<URL>` you should use the hostname that the Kubeflow dashboard responds to.

#### More documentation

For more documentation, visit the [Charmed Kubeflow website](https://charmed-kubeflow.io/docs).

#### Having issues?

If you have any issues or questions, feel free to create a GitHub issue [here](https://github.com/canonical/bundle-kubeflow/issues).
