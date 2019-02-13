+++
title = "ksonnet"
description = "Information about ksonnet as used in Kubeflow"
weight = 20
+++

Kubeflow makes use of [ksonnet](https://ksonnet.io/) to help manage deployments.

## Installing ksonnet

Make sure you have the minimum required version of ksonnet:
{{% ksonnet-min-version %}} or later.

Follow the steps below to install ksonnet:

1. Follow the [ksonnet installation
   guide](https://ksonnet.io/get-started/), choosing the relevant options for
   your operating system. For example, if you're on Linux:

    * Set some variables for the ksonnet version:

        ```
        export KS_VER={{% ksonnet-min-version %}}
        export KS_PKG=ks_${KS_VER}_linux_amd64
        ```

    * Download the ksonnet package:

        ```
        wget -O /tmp/${KS_PKG}.tar.gz https://github.com/ksonnet/ksonnet/releases/download/v${KS_VER}/${KS_PKG}.tar.gz \
          --no-check-certificate
        ```

    * Unpack the file:

        ```
        mkdir -p ${HOME}/bin
        tar -xvf /tmp/$KS_PKG.tar.gz -C ${HOME}/bin
        ```

1. Add the `ks` command to your path:

      ```
      export PATH=$PATH:${HOME}/bin/$KS_PKG
      ```

## Deploying Kubeflow

After installing ksonnet, you can follow the 
[Kubeflow getting-started guide](/docs/started/getting-started) to deploy
Kubeflow.

## Upgrading ksonnet

See the guide to [upgrading Kubeflow](/docs/other-guides/upgrade/).

## Why Kubeflow uses ksonnet

ksonnet makes it easier to manage complex deployments consisting of multiple
components. ksonnet is designed to work side by side with `kubectl`.

ksonnet allows you to generate Kubernetes manifests from parameterized
templates. This makes it easy to customize Kubernetes manifests for your
particular use case.

ksonnet treats [environment](https://ksonnet.io/docs/concepts#environment)
as a first class concept. For example, you can define separate
environments for your development, test, staging, and production deployments.
For each environment, you can use ksonnet to deploy the same components 
with slightly different parameters to customize the deployment for a particular 
environment. For example, this feature makes it easy to run a job locally 
without GPUs for a small number of steps to make sure the code doesn't crash, 
then move the deployment to the cloud to run at scale with GPUs.

## More about ksonnet

ksonnet acts as a layer on top of `kubectl`. While Kubernetes is typically
managed with static YAML files, ksonnet adds a further abstraction that is
closer to the objects in object-oriented programming.

With ksonnet, you manage your resources as *prototypes* with empty parameters.
Then you instantiate the prototypes into *components* by defining values for the
parameters. This system makes it easier to deploy slightly different resources
to different clusters at the same time. In this way you can maintain different
environments for staging and production, for example. You can export your
ksonnet components as standard Kubernetes YAML files with `ks show`, or you can
deploy (_apply_) the components directly to the cluster with `ks apply`.

Some useful ksonnet concepts:

* **Environment:** A unique location to deploy to. An environment includes:

    * A unique name.
    * The address of your Kubernetes cluster.
    * The cluster’s namespace.
    * The version of the Kubernetes API.

    Environments can support different settings, so you can deploy slightly
    different components to different clusters.

* **Prototype:** An object that describes a set of Kubernetes resources and
  associated parameters in an abstract way. Kubeflow includes prototypes for
  `tf-job` (to run a TensorFlow training job), `tf-serving`
  (to serve a trained model), and a few others.

* **Component:** A specific implementation of a prototype. You create a
  component supplying the empty parameters of a prototype. A component can
  directly generate standard Kubernetes YAML files, and can be deployed directly
  to a cluster. It can also hold different parameters for different
  environments.

Read more about the core ksonnet concepts in the
[ksonnet documentation](https://ksonnet.io/docs/concepts/).
