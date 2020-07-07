+++
title = "Configuring Kubeflow with kfctl and kustomize"
description = "The basics of Kubeflow configuration with kfctl and kustomize"
weight = 10
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


{{% stable-status %}}

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
You need kustomize {{% kustomize-min-version %}} or later.

### The Kubeflow deployment process

Kfctl is the Kubeflow CLI that you can use to set up a Kubernetes cluster with 
Kubeflow installed, or to deploy Kubeflow to an existing Kubernetes cluster. 
See the [Kubeflow getting-started guide](/docs/started/getting-started/) for
installation instructions based on your deployment scenario.

The kfctl deployment process includes the following commands:

* `kfctl build` - (Optional) Creates configuration files defining the various
  resources in your deployment but does not deploy Kubeflow.
  You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* `kfctl apply` - Creates or updates the resources.
* `kfctl delete` - Deletes the resources.

### Specifying a configuration file when initializing your deployment

When you install Kubeflow, the deployment process uses one of a few possible
YAML configuration files to bootstrap the configuration. You can see all the
[configuration files on 
GitHub](https://github.com/kubeflow/manifests/tree/master/kfdef).

As an example, this guide uses the 
[kfctl_k8s_istio.yaml](https://github.com/kubeflow/manifests/blob/master/kfdef/kfctl_k8s_istio.yaml)
configuration. For more details about this configuration, see the
[kfctl_k8s_istio deployment guide](/docs/started/k8s/kfctl-k8s-istio/).

Typically, you specify the configuration file with a `-f <config-file>` 
parameter when you run `kfctl build` or `kfctl apply`. The following example
uses `kfctl build`:

```shell
# Set KF_NAME to the name of your Kubeflow deployment. You also use this
# value as directory name when creating your configuration directory.
# For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
export KF_NAME=<your choice of name for the Kubeflow deployment>

# Set the path to the base directory where you want to store one or more 
# Kubeflow deployments. For example, /opt/.
# Then set the Kubeflow application directory for this deployment.
export BASE_DIR=<path to a base directory>
export KF_DIR=${BASE_DIR}/${KF_NAME}

# Set the URI of the configuration file to use when deploying Kubeflow. 
# For example:
export CONFIG_URI="{{% config-uri-k8s-istio %}}"

# Create your Kubeflow configurations:
mkdir -p ${KF_DIR}
cd ${KF_DIR}
kfctl build -V -f ${CONFIG_URI}
```

Kfctl has now built the configuration files in your Kubeflow application
directory (see [below](#kubeflow-directory)) but has not yet deployed Kubeflow.
To complete the deployment, run `kfctl apply`. See the next section on 
[applying the configuration](#apply-config).

<a id="apply-config"></a>
### Applying the configuration to your Kubeflow cluster

When you first run `kfctl build` or `kfctl apply`, kfctl creates
a local version of the YAML configuration file,
which you can further customize if necessary.

Follow these steps to apply the configurations to your Kubeflow cluster:

1. Set an environment variable pointing to your local configuration file.
  For example, this guide uses the `{{% config-file-k8s-istio %}}` 
  configuration. If you chose a different configuration in the previous step, 
  you must change the file name to reflect your configuration:

    ```
    export CONFIG_FILE=${KF_DIR}/{{% config-file-k8s-istio %}}
    ```

1. Apply the configurations:

    ```
    kfctl apply -V -f ${CONFIG_FILE}
    ```

<a id="kubeflow-directory"><a/>
### Your Kubeflow directory layout

Your Kubeflow application directory is the directory where you choose to store 
your Kubeflow configurations during deployment. This guide refers to the
directory as `${KF_DIR}`. The directory contains the  following files and 
directories:

* **${CONFIG_FILE}** is a YAML file that stores your primary Kubeflow 
  configuration in the form of a `KfDef` Kubernetes object.

  * This file is a **copy** of the [GitHub-based configuration YAML 
    file](https://github.com/kubeflow/manifests/tree/master/kfdef) that
    you used when deploying Kubeflow.
  * When you first run `kfctl build` or `kfctl apply`, kfctl creates
    a local version of the configuration file at `${CONFIG_FILE}`,
    which you can further customize if necessary.
  * The YAML defines each Kubeflow application as a kustomize package.  

* **&lt;platform-name&gt;_config** is a directory that contains 
  configurations specific to your chosen platform or cloud provider. 
  For example, `gcp_config` or `aws_config`. This 
  directory may or may not be present, depending on your setup.

  * The directory is created when you run `kfctl build` or `kfctl apply`.
  * To customize these configurations, you can modify parameters
    in your `${CONFIG_FILE}`, and then run `kfctl apply` to apply
    the configuration to your Kubeflow cluster.

* **kustomize** is a directory that contains Kubeflow application manifests.
  That is, the directory contains the kustomize packages for the Kubeflow 
  applications that are included in your deployment.

  * The directory is created when you run `kfctl build` or `kfctl apply`.
  * To customize these configurations, you can modify parameters
    in your `${CONFIG_FILE}`, and then run `kfctl apply` to apply
    the configuration to your Kubeflow cluster.

### How your configuration is generated

The content of your `${CONFIG_FILE}` is the result of running kustomize 
on the base and overlay `kustomization.yaml` files in the 
[Kubeflow manifests](https://github.com/kubeflow/manifests/tree/master/kfdef). 
The overlays reflect the configuration file that you specify when running 
`kfctl build` or `kfctl apply`.

Below are some examples of configuration files:

* [kfctl_k8s_istio.yaml](https://github.com/kubeflow/manifests/blob/master/kfdef/kfctl_k8s_istio.yaml) 
  to install Kubeflow on an existing Kubernetes cluster.
* [kfctl_istio_dex.yaml](https://github.com/kubeflow/manifests/blob/master/kfdef/kfctl_istio_dex.yaml)
  to install Kubeflow on an existing Kubernetes cluster with Dex and Istio for
  authentication.
* [kfctl_gcp_iap.yaml](https://github.com/kubeflow/manifests/blob/master/kfdef/kfctl_gcp_iap.yaml)
  to create a Google Kubernetes Engine (GKE) cluster with Kubeflow using
  Cloud Identity-Aware Proxy (Cloud IAP) for access control.

The kustomize package manager in kfctl uses the information in your
`${CONFIG_FILE}` to traverse the directories under the 
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
        curl -s https://api.github.com/repos/kubernetes-sigs/kustomize/releases |\
        grep browser_download |\
        grep download/kustomize |\
        grep -m 1 $opsys |\
        cut -d '"' -f 4 |\
        xargs curl -O -L
        ```

    * Unzip the compressed file
        ```
        tar xzf ./kustomize_v*_${opsys}_amd64.tar.gz
        ```

    * Move the binary:

        ```
        mkdir -p ${HOME}/bin
        mv kustomize ${HOME}/bin/kustomize
        chmod u+x ${HOME}/bin/kustomize
        ```

1. Include the `kustomize` command in your path:

      ```
      export PATH=$PATH:${HOME}/bin
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
parameters in your `${CONFIG_FILE}` file. Then re-run `kfctl apply`.

For example, to modify settings for the Spartakus usage reporting tool within 
your Kubeflow deployment:

1. Edit the configuration file at `${CONFIG_FILE}`.

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

1. Regenerate and deploy your Kubeflow resources:

    ```
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_FILE}
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
