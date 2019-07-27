+++
title = "Kubeflow on Kubernetes"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster"
weight = 4
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes cluster.

If you are using a Kubernetes distribution or Cloud Provider which has specific instructions for installing Kubeflow we recommend following those instructions. Those instructions do additional Cloud specific setup to create a really great Kubeflow experience.

For installing Kubeflow on an existing Kubernetes Cluster,

### Deploy Kubeflow

If you are deploying Kubeflow on a multi-node cluster, you can follow this [guide](/docs/use-cases/kubeflow-on-multinode-cluster) to set up your system to use a remote NFS filesystem in cluster nodes.

Follow these steps to deploy Kubeflow:

1. Download a `kfctl` release from the [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/) and unpack it:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary `kfctl` to your path. If you don't add the binary to your path, you must use the full path to the `kfctl` binary each time you run it.

   ```bash
   # Add kfctl to PATH, to make the kfctl binary easier to use.
   export PATH=$PATH:"<path to kfctl>"
   export KFAPP="<your choice of application directory name>"
   # Installs istio by default. Comment out istio components in the config file to skip istio installation. See https://github.com/kubeflow/kubeflow/pull/3663
   export CONFIG="https://raw.githubusercontent.com/kubeflow/kubeflow/master/bootstrap/config/kfctl_k8s_istio.yaml"

   kfctl init ${KFAPP} --config=${CONFIG} -V
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

1. Once Kubeflow is deployed, the Kubeflow Dashboard can be accessed via `Istio IngressGateway`. Refer [Ingress Gateway guide](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/)

### Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```bash
cd ${KFAPP}
# If you want to delete all the resources, run:
kfctl delete all
```

### Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time set up.
* **generate** - creates config files defining the various resources.
* **apply** - creates or updates the resources.
* **delete** - deletes the resources.

With the exception of `init`, all commands take an argument which describes the
set of resources to apply the command to; this argument can be one of the
following:

* **k8s** - all resources that run on Kubernetes.
* **all** - platform and Kubernetes resources.

#### App layout

Your Kubeflow app directory contains the following files and directories:

* **${KFAPP}/app.yaml** defines configurations related to your Kubeflow deployment.
* **${KFAPP}/kustomize**: contains the YAML manifests that will be deployed.

### Next steps

* Follow the instructions to [connect to the Kubeflow web 
  UIs](/docs/other-guides/accessing-uis/), where you can manage various 
  aspects of your Kubeflow deployment.
* Run a [sample machine learning workflow](/docs/examples/resources/).
* Get started with [Kubeflow Pipelines](/docs/pipelines/pipelines-quickstart/)
