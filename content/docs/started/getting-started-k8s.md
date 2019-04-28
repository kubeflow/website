+++
title = "Kubeflow on Kubernetes"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster"
weight = 4
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes
cluster.

If you are using a Kubernetes distribution or Cloud Provider which has specific
instructions for installing Kubeflow we recommend following those instructions.
Those instructions do additional Cloud specific setup to create a really great 
Kubeflow experience.

Before installing Kubeflow on the command line:

  * Ensure you have installed the following tools:
    
     * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)


## Deploy Kubeflow

Follow these steps to deploy Kubeflow:

1. Download a `kfctl` release from the 
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

1. Run the following commands to set up and deploy Kubeflow. The code below
  includes an option command to add the binary `kfctl` to your path. If you 
  don't add the binary to your path, you must use the full path to the `kfctl` 
  binary each time you run it.

    ```bash
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to kfctl in your kubeflow installation>

    export KFAPP=<your choice of application directory name>
    # Default uses IAP.
    kfctl init ${KFAPP}
    cd ${KFAPP}
    kfctl generate all -V
    kfctl apply all -V
    ```
   * **${KFAPP}** - the _name_ of a directory where you want Kubeflow 
     configurations to be stored. This directory is created when you run
     `kfctl init`. If you want a custom deployment name, specify that name here.
     The value of this variable becomes the name of your deployment.
     The value of this variable cannot be greater than 25 characters. It must
     contain just the directory name, not the full path to the directory.
     The content of this directory is described in the next section.

1. Check the resources deployed in namespace `kubeflow`:

    ```
    kubectl -n kubeflow get  all
    ```

## Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```
cd ${KFAPP}
# If you want to delete all the resources, including storage.
kfctl delete all --delete_storage
# If you want to preserve storage, which contains metadata and information
# from mlpipeline.
kfctl delete all
```

## Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time set up.
* **generate** - creates config files defining the various resources.
* **apply** - creates or updates the resources.
* **delete** - deletes the resources.

With the exception of `init`, all commands take an argument which describes the
set of resources to apply the command to; this argument can be one of the
following:

* **k8s** - all resources that run on Kubernetes.
* **all** - GCP and Kubernetes resources.

### App layout

Your Kubeflow app directory contains the following files and directories:

* **app.yaml** defines configurations related to your Kubeflow deployment.

  * The values are set when you run `kfctl init`.
  * The values are snapshotted inside **app.yaml** to make your app 
    self contained.

  * The directory is created when you run `kfctl generate platform`.
  * You can modify these configurations to customize your GCP infrastructure.

* **${KFAPP}/k8s_specs** is a directory that contains YAML specifications
  for some daemons deployed on your Kubernetes Engine cluster.

* **${KFAPP}/ks_app** is a directory that contains the 
  [ksonnet](https://ksonnet.io) application for Kubeflow.

  * The directory is created when you run `kfctl generate`.
  * You can use ksonnet to customize Kubeflow.