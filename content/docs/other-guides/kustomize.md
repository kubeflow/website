+++
title = "Configuring Kubeflow with kfctl and kustomize"
description = "The basics of Kubeflow configuration with kfctl and kustomize"
weight = 10
+++

Kfctl is the Kubeflow command-line interface (CLI) that you can use to
install and configure Kubeflow.

Kubeflow makes use of [kustomize](https://kustomize.io/) to help customize YAML
configurations. With kustomize, you can traverse a Kubernetes manifest to add, 
remove, or update configuration options without forking the manifest. A 
_manifest_ is a YAML file containing a description of the applications that you 
want to include in your Kubeflow deployment.

## Overview of kfctl and kustomize

This section describes how kfctl works with kustomize to set up your 
Kubeflow deployment.

### The Kubeflow installation process

Kfctl is the Kubeflow CLI that you can use to set up a Kubernetes cluster with 
Kubeflow installed, or to deploy Kubeflow to an existing Kubernetes cluster. 
See the [Kubeflow getting-started guide](/docs/started/getting-started/) for
installation instructions based on your deployment scenario.

The deployment process consists of three steps, _init_, _generate_, and 
_apply_, so that you can modify your configuration before actually deploying 
Kubeflow.

* `kfctl init` - one time set up.
* `kfctl generate` - creates config files defining the various resources.
* `kfctl apply` - creates or updates the resources.

### Specifying a configuration file when initializing your deployment

When you install Kubeflow, the deployment process uses one of a few possible
YAML configuration files to bootstrap the configuration.

Typically, you specify the configuration file with a `--config` parameter
when you run `kfctl init`. For example:

```
export KFAPP="<your choice of application directory name>"
export CONFIG="https://raw.githubusercontent.com/kubeflow/kubeflow/{{% kf-latest-version %}}/bootstrap/config/kfctl_existing_arrikto.yaml"
kfctl init ${KFAPP} --config=${CONFIG} -V
```

*For details of the above deployment, see the guide to deployment using the 
[kfctl_existing_arrikto configuration](/docs/started/k8s/kfctl-existing-arrikto/).*

Some deployment processes use a default config file and you don't need to
add the `--config` argument. For example, the 
Google Cloud Platform (GCP) initialization command looks like this:

```
export PROJECT="<your GCP project ID>"
export KFAPP="<your choice of application directory name>"
kfctl init ${KFAPP} --platform gcp --project ${PROJECT}
```

*For details of the above deployment, see the guide to deployment 
[on GCP using the CLI](/docs/gke/deploy/deploy-cli/).*

### Your Kubeflow directory layout

Your Kubeflow app directory is the directory where you choose to store 
your Kubeflow configurations during deployment. This guide refers to the
directory as `${KFAPP}`. The directory contains the  following files and 
directories:

* **app.yaml** stores your primary Kubeflow configuration in the form of a
  `KfDef` Kubernetes object.

  * The values are set when you run `kfctl init`.
  * The values are snapshotted inside `app.yaml` to make your app 
    self contained.
  * The YAML defines each Kubeflow application as a kustomize package.  

* **[platform-name]_config** is a directory that contains 
  configurations specific to your chosen platform or cloud provider. This 
  directory may or may not be present, depending on your setup.

  * The directory is created when you run `kfctl generate platform`.
  * To customize these configurations, you can modify parameters in the `KfDef`
    object in your `app.yaml` file, and then re-run `kfctl generate` and 
    `kfctl apply`.

* **kustomize** is a directory that contains Kubeflow application manifests.
  That is, the directory contains the kustomize packages for the Kubeflow 
  applications that are included in your deployment.

  * The directory is created when you run `kfctl generate`.
  * To customize these configurations, you can modify parameters in the `KfDef`
    object in your `app.yaml` file, and then re-run `kfctl generate` and 
    `kfctl apply`.

### How your configuration is generated

The content of your `app.yaml` is the result of running kustomize 
on the base and overlay `kustomization.yaml` files in the 
[Kubeflow config](https://github.com/kubeflow/kubeflow/tree/master/bootstrap/config) 
directory. The overlays reflect the options that you choose when calling 
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

Kustomize lets you customize raw, template-free YAML files for multiple
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
parameters in the `KfDef` object in your `${KFAPP}/app.yaml` file, where 
`KFAPP` is the directory where you stored your Kubeflow configurations during 
deployment. Then re-run `kfctl generate` and `kfctl apply`.

For example, to modify settings for the Spartakus usage reporting tool within 
your Kubeflow deployment:

1. Edit the configuration file at `${KFAPP}/app.yaml`.

1. Find and replace the parameter values for `spartakus` to suit your
  requirements:

        - kustomizeConfig:
            parameters:
            - initRequired: true
                name: usageId
                value: <randomly-generated-id>
            - initRequired: true
                name: reportUsage
                value: "true"
            repoRef:
                name: manifests
                path: common/spartakus
            name: spartakus

1. Due to 
  [Kubeflow issue #3810](https://github.com/kubeflow/kubeflow/issues/3810),
  you currently need to tear down your Kubeflow cluster before applying the
  configuration change. This command **deletes all your Kubeflow resources**:

    ```
    cd ${KFAPP}
    kfctl delete all -V
    ```


1. Regenerate and deploy your Kubeflow resources:

    ```
    cd ${KFAPP}
    kfctl generate all -V
    kfctl apply all -V
    ```


### More examples

For examples of customizing your deployment, see the guide to [customizing 
Kubeflow on GKE](/docs/gke/customizing-gke/).

For information about how Kubeflow uses Spartakus, see the guide to
[usage reporting](/docs/other-guides/usage-reporting/).

## More about kustomize

Below are some useful kustomize terms, from the 
[kustomize glossary](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/glossary.md):

* **base:** A combination of a kustomization and resource(s). Bases can be
  referred to by other kustomizations.

* **kustomization:** Refers to a `kustomization.yaml` file, or more generally to
  a directory containing the `kustomization.yaml` file and all the relative file 
  paths that the YAML file references.

* **overlay:** A combination of a kustomization that refers to a base, and a
  patch. An overlay may have multiple bases.

* **patch:** General instructions to modify a resource.

* **resource:** Any valid YAML file that defines an object with a kind and a
  metadata/name field.

* **target:** The argument to `kustomize build`. For example, 
  `kustomize build $TARGET`. A target must be a path or a URL to a 
  kustomization. A target can be a base or an overlay.

* **variant:** The outcome of applying an overlay to a base.

Read more about kustomize in the
[kustomize documentation](https://github.com/kubernetes-sigs/kustomize/tree/master/docs).
