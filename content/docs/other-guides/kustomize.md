+++
title = "Configuring Kubeflow with kustomize"
description = "The basics of Kubeflow configuration with kustomize"
weight = 10
+++

Kubeflow makes use of [kustomize](https://kustomize.io/) to help customize YAML
configurations. 

With kustomize, you can traverse a Kubernetes manifest to add, remove or update 
configuration options without forking. A _manifest_ is a YAML file containing a 
description of all the components that you want to deploy.

## Overview of kfctl and kustomize

This section describes how Kubeflow's command-line interface (CLI), kfctl, works 
with kustomize to configure your Kubeflow deployment.

### The Kubeflow installation process

kfctl is Kubeflow's CLI that you can use to set up a Kubernetes cluster with 
Kubeflow installed, or to deploy Kubeflow to an existing Kubernetes cluster. 
See the [Kubeflow getting-started guide](/docs/started/getting-started/) for
installation instructions based on your deployment scenario.

The deployment process consists of three steps, _init_, _generate_, and 
_apply_, so that you can modify your configuration before actually deploying 
Kubeflow.

* `kfctl init` - one time set up.
* `kfctl generate` - creates config files defining the various resources.
* `kfctl apply` - creates or updates the resources.

### Your Kubeflow directory layout

Your Kubeflow app directory, `${KFAPP}`, is the directory where you've stored 
your Kubeflow configurations during deployment. The directory contains the 
following files and directories:

* **app.yaml** stores your primary Kubeflow configuration in the form of a
  `KfDef` Kubernetes object.

  * The values are set when you run `kfctl init`.
  * The values are snapshotted inside `app.yaml` to make your app 
    self contained.
  * The YAML defines each Kubeflow application as a kustomize package.  

* **<platform-name>_config** is a directory that contains 
  configurations specific to your chosen platform or cloud provider. This 
  directory may or may not be present, depending on your setup.

  * The directory is created when you run `kfctl generate platform`.
  * You can modify these configurations to customize your infrastructure.

* **kustomize** is a directory that contains Kubeflow application manifests.
  In other words, it contains the kustomize packages for the Kubeflow 
  applications that are included in your deployment.

  * The directory is created when you run `kfctl generate`.
  * You can customize the Kubernetes resources by modifying the manifests and 
    running `kfctl apply` again.

### How your configuration is generated

The content of your `app.yaml` is the result of running kustomize 
on the base and overlay `kustomization.yaml` files in the 
[Kubeflow config](https://github.com/kubeflow/kubeflow/tree/master/bootstrap/config) directory. The overlays reflect the options that you choose when calling 
`kfctl init`.

Below are some examples of `KfDef` configuration files:

* [kfctl_k8s_istio.yaml](https://github.com/kubeflow/kubeflow/blob/master/bootstrap/config/kfctl_k8s_istio.yaml) 
  to install Kubeflow on an existing Kubernetes cluster.
* [kfctl_gcp_basic_auth.yaml](https://github.com/kubeflow/kubeflow/blob/master/bootstrap/config/kfctl_gcp_basic_auth.yaml) 
  to set up a Google Kubernetes Engine (GKE) cluster with Kubeflow using basic
  authentication.

The kustomize package manager in kfctl uses the information in your
`app.yaml` to traverse the directories under the 
[Kubeflow manifests](https://github.com/kubeflow/manifests) and to 
create kustomize build targets based on the manifests.

## Installing kustomize

Make sure that you have the minimum required version of kustomize:
<b>{{% kustomize-min-version %}}</b> or later.

1. Follow the [kustomize installation
   guide](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/INSTALL.md),
   choosing the relevant options for your operating system. For example, if
   you're on Linux:

    * Set some variables for the operating system:

        ```
        export opsys=linux
        ```

    * Download the kustomize binary:

        ```
        curl -s https://api.github.com/repos/kubernetes-sigs/kustomize/releases/latest |\
        grep browser_download |\
        grep $opsys |\
        cut -d '"' -f 4 |\
        xargs curl -O -L
        ```

    * Move the binary:

        ```
        mkdir -p ${HOME}/bin
        mv kustomize_*_${opsys}_amd64 ${HOME}/bin/kustomize
        chmod u+x ${HOME}/bin/kustomize
        ```

1. Include the `kustomize` command in your path:

      ```
      export PATH=$PATH:${HOME}/bin/kustomize
      ```

## Modifying configuration before deployment

kustomize lets you customize raw, template-free YAML files for multiple
purposes, leaving the original YAML untouched and usable as is.

You can use the following command to build and apply kustomize directories:

```
kustomize build <kustomization_directory> | kubectl apply -f -
```

The [Kubeflow manifests repo](https://github.com/kubeflow/manifests) contains
kustomize build targets, each with a `base` directory. You can use kustomize to
generate YAML output and pass it to kfctl. You can also make
changes to the kustomize targets in the manifests repo as needed. 

## Modifying the configuration of an existing deployment

To customize the Kubeflow resources running within the cluster, you can modify
the kustomize manifests in `${KFAPP}/kustomize`, where `KFAPP` is the directory 
where you stored your Kubeflow configurations during deployment. Then run
'kfctl apply`.

For example, to modify settings for the Jupyter web app:

1. Edit the configuration file at `${KFAPP}/kustomize/jupyter-web-app.yaml`.

1. Find and replace the parameter values:

    ```
    apiVersion: v1
    data:
    ROK_SECRET_NAME: secret-rok-{username}
    UI: default
    clusterDomain: cluster.local
    policy: Always
    prefix: jupyter
    kind: ConfigMap
    metadata:
    labels:
        app: jupyter-web-app
        kustomize.component: jupyter-web-app
    name: jupyter-web-app-parameters
    namespace: kubeflow
    ```

1. Redeploy using `kfctl`:

    ```
    cd ${KFAPP}
    kfctl apply k8s
    ```

    Alternatively, you can redeploy using kubectl directly:

    ```
    cd ${KFAPP}/kustomize
    kubectl apply -f jupyter-web-app.yaml
    ```

### More examples

For more usage examples, see the guide to [customizing Kubeflow on 
GKE](https://www.kubeflow.org/docs/gke/customizing-gke/).

## More about kustomize

Below are some useful kustomize terms (from the 
[kustomize glossary](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/glossary.md)):

* **kustomization:** Refers to a `kustomization.yaml` file, or more generally to
  a directory containing the `kustomization.yaml` file and all the relative file 
  paths that the YAML file references.

* **resource:** Any valid YAML file that defines an object with a kind and a
metadata/name field.

* **patch:** General instructions to modify a resource.

* **base:** A combination of a kustomization and resource(s). Bases can be
referred to by other kustomizations.

* **overlay:** A combination of a kustomization that refers to a base, and a
patch. An overlay may have multiple bases.

* **variant:** The outcome of applying an overlay to a base.

Read more about kustomize in the
[kustomize documentation](https://github.com/kubernetes-sigs/kustomize/tree/master/docs).
