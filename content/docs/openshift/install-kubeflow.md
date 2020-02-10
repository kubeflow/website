+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow from the command line"
weight = 4
+++

This guide describes how to use the `kfctl` CLI to deploy Kubeflow 0.7 on an existing OpenShift 4.2 cluster.

## Prerequisites

### OpenShift 4 cluster

* You need to have access to an OpenShift 4 cluster as `cluster-admin` to be able to deploy Kubeflow.
* You can use [Code Ready Containers](https://code-ready.github.io/crc/) (CRC) to run a local cluster, use [try.openshift.com](https://try.openshift.com) to create a new cluster or use an existing cluster.
* Install [`oc` command-line tool](https://docs.openshift.com/container-platform/4.2/cli_reference/openshift_cli/getting-started-cli.html) to communicate with the cluster.

#### Code Ready Containers

If you are using Code Ready Containers, you need to make sure you have enough resources configured for the VM:

Recommended: 

```
16 GB memory
6 CPU
45 GB disk space
```

Minimal:

```
10 GB memory
6 CPU
30 GB disk space (default for CRC)
```

## Installing Kubeflow

Use the following steps to install Kubeflow 0.7 on OpenShift 4.2.

1. Clone the [opendatahub/manifests]
(https://github.com/opendatahub-io/manifests) repository. This repository defaults to the `v0.7.0-branch-openshift` branch.

    ```
    git clone https://github.com/opendatahub-io/manifests.git
    cd manifests
    ```

1. Build the deployment configuration using the OpenShift KFDef file and local downloaded manifests.

    > At the time this document was written, [Kubeflow issue #4678](https://github.com/kubeflow/kubeflow/issues/4678) prevents downloading the manifests during a build process.

    ```
    sed -i 's#uri: .*#uri: '$PWD'#' ./kfdef/kfctl_openshift.yaml
    kfctl build --file=kfdef/kfctl_openshift.yaml
    ```

1. Apply the generated deployment configuration.

    ```
    kfctl apply --file=./kfdef/kfctl_openshift.yaml
    ```

1. Wait until all the pods are running.

    ```
    oc get pods
    ```

1. The command below looks up the URL of Kubeflow user interface assigned by the OpenShift cluster. You can open the printed URL in your broser to access the Kubeflow user interface.

    ```
    oc get routes -n istio-system istio-ingressgateway -o jsonpath='http://{.spec.host}/'
    ```

## Next steps

* Learn about the [changes made](https://developers.redhat.com/blog/2020/02/10/installing-kubeflow-v0-7-on-openshift-4-2/) to Kubeflow manifests to enable deployment on OpenShift
* See how to [upgrade Kubeflow](/docs/upgrading/upgrade/) and how to 
  [upgrade or reinstall a Kubeflow Pipelines deployment](/docs/pipelines/upgrade/).
* See how to [uninstall](/docs/openshift/uninstall-kubeflow) your Kubeflow deployment 
  using the CLI.
