+++
title = "Installing Kubeflow"
description = "Instructions for Kubeflow deployment with Kubeflow Charmed Operators"
weight = 10
+++

This guide lists the steps necessary to install Kubeflow on any conformant Kubernetes, including AKS, EKS, GKE, Openshift and any kubeadm-deployed cluster,  provided that you have access to it via `kubectl`. 

#### 1. Install the Juju client

On Linux, install `juju` via [snap](https://snapcraft.io/docs/installing-snapd) with the following command:

```bash
snap install juju --classic
```

Alternatively,  `brew install juju` on macOS or [download the Windows installer](https://launchpad.net/juju/2.8/2.8.5/+download/juju-setup-2.8.5-signed.exe). 

#### 2. Connect Juju to your Kubernetes cluster

In order to operate workloads in your Kubernetes cluster with Juju, you have to add your cluster to the list of *clouds* in juju via the `add-k8s` command.

If your Kubernetes config file is in the standard location (`~/.kube/config` on Linux), and you only have one cluster, you can simply run:

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
For more details, see the [Juju documentation](https://juju.is/docs/clouds).

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

[note type="caution" status="MIN RESOURCES"]
The minimum resources to deploy `kubeflow` are - 50Gb of disk, 14Gb of RAM and 2 CPUs - available to your Linux machine or VM. 
If you have fewer resources, deploy `kubeflow-lite` or `kubeflow-edge`.
[/note]

Once you have a model, you can simply `juju deploy` any of the provided [Kubeflow bundles](https://charmed-kubeflow.io/docs/operators-and-bundles) into your cluster. For the Kubeflow lite bundle, run:

```bash
juju deploy kubeflow-lite
```

**Congratulations, Kubeflow is now installing !**

You can observe your Kubeflow deployment getting spun-up with the command:

```bash
watch -c juju status --color
```

#### 6. Add an RBAC role for istio

Currently, in order to setup Kubeflow with Istio correctly, you need to provide the `istio-ingressgateway` operator access to Kubernetes resources. The following command will create the appropriate role:

```bash
kubectl patch role -n kubeflow istio-ingressgateway-operator -p '{"apiVersion":"rbac.authorization.k8s.io/v1","kind":"Role","metadata":{"name":"istio-ingressgateway-operator"},"rules":[{"apiGroups":["*"],"resources":["*"],"verbs":["*"]}]}'
```

#### 7. Set URL in authentication methods 

A final step to enable your Kubeflow dashboard access is to provide your dashboard public URL to dex-auth and oidc-gatekeeper via the following commands:

```bash
juju config dex-auth public-url=http://<URL>
juju config oidc-gatekeeper public-url=http://<URL>
```

Where `<URL>` is the hostname that the Kubeflow dashboard responds to. 

#### More documentation

For more documentation visit [Charmed Kubeflow docs](https://charmed-kubeflow.io/docs)

#### Having issues?
If you face any difficulties following these instructions, please create an issue [here](https://github.com/juju-solutions/bundle-kubeflow/issues).