+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow from the command line"
weight = 4
+++

This guide describes how to use the `kfctl` CLI to deploy Kubeflow 0.7 on an existing OpenShift 4.2 cluster.

## Prerequisites

### OpenShift 4 cluster

* You need to have access to an OpenShift 4 cluster as `cluster-admin` to be able to deploy Kubeflow.
* You can run a local cluster using [Code Ready Containers](https://code-ready.github.io/crc/), use https://try.openshift.com or bring your own cluster.
* You will need to login as a user with `cluster-admin` privileges to the cluster to be able to deploy Kubeflow.
* Install [`oc` command line tool](https://docs.openshift.com/container-platform/4.2/cli_reference/openshift_cli/getting-started-cli.html) to communicate with the cluster.

#### Code Ready Containers

If you are using Code Ready Containers, you will need to make sure you have enough resources configured for the VM:

Recommended: 

```
16GB memory
6 cpu
5G disk space
```

Minimal:

```
10GB memory
6 cpu
30G disk space (default for CRC)
```

## Installing Kubeflow

To install Kubeflow 0.7 on OpenShift 4.2 please follow the steps below:

1. Clone the [opendatahub/manifests](https://github.com/opendatahub-io/manifests) fork repo which defaults to the branch `v0.7.0-branch-openshift`

```
git clone https://github.com/opendatahub-io/manifests.git
cd manifests
```

2. Build the deployment configuration using the Openshift `KFDef` file and local downloaded manifests 

> At the time of writing this document there is Kubeflow [bug](https://github.com/kubeflow/kubeflow/issues/4678) which prevents downloading the manifests during a build process.

```
sed -i 's#uri: .*#uri: '$PWD'#' ./kfdef/kfctl_openshift.yaml
kfctl build --file=kfdef/kfctl_openshift.yaml
```

3. Apply the generated deployment configuration

```
kfctl apply --file=./kfdef/kfctl_openshift.yaml
```

4. Wait until all the pods are running

```
oc get pods
```

5. Get a URL and launch the Kubeflow portal

```
oc get routes -n istio-system istio-ingressgateway -o jsonpath='http://{.spec.host}/'
```
