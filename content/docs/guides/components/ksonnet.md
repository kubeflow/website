+++
title = "ksonnet"
description = "ksonnet information related to Kubeflow"
weight = 10
toc = true
[menu]
[menu.docs]
  parent = "components"
  weight = 20
+++

Kubeflow makes use of [ksonnet] to help manage deployments.

## Installing ksonnet

Make sure you have the version of ksonnet specified in the 
[Kubeflow requirements](/docs/guides/requirements).

Follow the steps below to install ksonnet:

1. Follow the [ksonnet installation
   guide][ksonnet-installation], choosing the relevant options for your
   operating system. For example, if you're on Linux:

    * Set some variables for the ksonnet version:

        ```
        export KS_VER=0.12.0
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

## Creating a ksonnet application

This section shows you how to use ksonnet to deploy kubeflow into your existing cluster. The commands below find the cluster currently
used by `kubectl` and create the namespace `kubeflow`.


```
export KUBEFLOW_VERSION=0.2.2
export KUBEFLOW_KS_DIR=</path/to/store/your/ksonnet/application>
export KUBEFLOW_DEPLOY=false
curl https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/deploy.sh | bash
```

This will create a ksonnet application in ${KUBEFLOW_KS_DIR}. Refer to [deploy.sh](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/deploy.sh)
to see the individual commands run.

**Important**: The commands above will enable collection of **anonymous** user data to help us improve Kubeflow. Do disable usage collection you
can run the following commands

```
cd ${KUBEFLOW_KS_DIR}
ks param set kubeflow-core reportUsage false
```

You can now deploy Kubeflow as follows

```
cd ${KUBEFLOW_KS_DIR}
ks apply default
```

## Upgrading ksonnet

See the guide to [upgrading Kubeflow](/docs/guides/upgrade/).

## Why Kubeflow uses ksonnet

ksonnet makes it easier to manage complex deployments consisting of multiple components. It is designed to
work side by side with kubectl.

ksonnet allows us to generate Kubernetes manifests from parameterized templates. This makes it easy to customize Kubernetes manifests for your
particular use case. In the examples above we used this functionality to generate manifests for TfServing with a user supplied URI for the model.

One of the reasons we really like ksonnet is because it treats [environment](https://ksonnet.io/docs/concepts#environment) as in (dev, test, staging, prod) as a first class concept. For each environment we can easily deploy the same components but with slightly different parameters
to customize it for a particular environments. We think this maps really well to common workflows. For example, this feature makes it really
easy to run a job locally without GPUs for a small number of steps to make sure the code doesn't crash, and then easily move that to the
Cloud to run at scale with GPUs.

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
  (to serve a trained model), and `kubeflow-core` (for required helper
  resources).

* **Component:** A specific implementation of a prototype. You create a
  component supplying the empty parameters of a prototype. A component can
  directly generate standard Kubernetes YAML files, and can be deployed directly
  to a cluster. It can also hold different parameters for different
  environments.

Read more about the core ksonnet conceps in the
[ksonnet documentation](https://ksonnet.io/docs/concepts/).

[ksonnet]: https://ksonnet.io/
[ksonnet-installation]: https://ksonnet.io/#get-started
