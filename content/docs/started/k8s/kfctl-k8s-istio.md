+++
title = "Kubeflow Deployment with kfctl_k8s_istio"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster using kfctl_k8s_istio config"
weight = 2
+++

This configuration creates a vanilla deployment of Kubeflow with all its core components without any external dependencies. The deployment can be customized based on your environment needs.

**Maintainer and supporter: Kubeflow community**

### Before you start

This Kubeflow deployment requires a default StorageClass with a [dynamic volume provisioner](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/). Verify the `provisioner` field of your default StorageClass definition.
If you don't have a provisioner, ensure that you have configured volume provisioning in your Kubernetes cluster appropriately as mentioned [below](#provisioning-of-persistent-volumes-in-kubernetes).

<a id="prepare-environment"></a>
## Prepare your environment

Follow these steps to download the kfctl binary for the Kubeflow CLI and set
some handy environment variables:

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball:    
    ```
    tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
    ```

1. Create environment variables to make the deployment process easier:

    ```
    # The following command is optional. It adds the kfctl binary to your path.
    # If you don't add kfctl to your path, you must use the full path
    # each time you run kfctl.
    # Use only alphanumeric characters or - in the directory name.
    export PATH=$PATH:"<path-to-kfctl>"

    # Set KF_NAME to the name of your Kubeflow deployment. This also becomes the
    # name of the directory containing your configuration.
    # For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
    export KF_NAME=<your choice of name for the Kubeflow deployment>

    # Set the path to the base directory where you want to store one or more 
    # Kubeflow deployments. For example, /opt/.
    # Then set the Kubeflow application directory for this deployment.
    export BASE_DIR=<path to a base directory>
    export KF_DIR=${BASE_DIR}/${KF_NAME}

    # Set the configuration file to use when deploying Kubeflow.
    # The following configuration installs Istio by default. Comment out 
    # the Istio components in the config file to skip Istio installation. 
    # See https://github.com/kubeflow/kubeflow/pull/3663
    export CONFIG_URI="{{% config-uri-k8s-istio %}}"
   ```

Notes:

* **${KF_NAME}** - The name of your Kubeflow deployment.
  If you want a custom deployment name, specify that name here.
  For example,  `my-kubeflow` or `kf-test`.
  The value of KF_NAME must consist of lower case alphanumeric characters or
  '-', and must start and end with an alphanumeric character.
  The value of this variable cannot be greater than 25 characters. It must
  contain just a name, not a directory path.
  This value also becomes the name of the directory where your Kubeflow 
  configurations are stored, that is, the Kubeflow application directory. 

* **${KF_DIR}** - The full path to your Kubeflow application directory.

* **${CONFIG_URI}** - The GitHub address of the configuration YAML file that
  you want to use to deploy Kubeflow. The URI used in this guide is
  {{% config-uri-k8s-istio %}}.
  When you run `kfctl apply` or `kfctl build` (see the next step), kfctl creates
  a local version of the configuration YAML file which you can further
  customize if necessary.

<a id="set-up-and-deploy"></a>
## Set up and deploy Kubeflow

To set up and deploy Kubeflow using the **default settings**,
run the `kfctl apply` command:

```
mkdir -p ${KF_DIR}
cd ${KF_DIR}
kfctl apply -V -f ${CONFIG_URI}
```

Check the resources deployed in namespace `kubeflow`:

```
kubectl -n kubeflow get all
```

## Alternatively, set up your configuration for later deployment

If you want to customize your configuration before deploying Kubeflow, you can 
set up your configuration files first, then edit the configuration, then
deploy Kubeflow:

1. Run the `kfctl build` command to set up your configuration:

  ```
  mkdir -p ${KF_DIR}
  cd ${KF_DIR}
  kfctl build -V -f ${CONFIG_URI}
  ```

1. Edit the configuration files, as described in the guide to
  [customizing your Kubeflow deployment](/docs/other-guides/kustomize/).

1. Set an environment variable pointing to your local configuration file:

  ```
  export CONFIG_FILE=${KF_DIR}/kfctl_k8s_istio.yaml
  ```

1. Run the `kfctl apply` command to deploy Kubeflow:

  ```
  kfctl apply -V -f ${CONFIG_FILE}
  ```

### Access the Kubeflow user interface (UI)

After Kubeflow is deployed, the Kubeflow Dashboard can be accessed via `istio-ingressgateway` service. If loadbalancer is not available in your environment, NodePort or Port forwarding can be used to access the Kubeflow Dashboard.Refer [Ingress Gateway guide](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/).

### Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```bash
cd ${KF_DIR}
# If you want to delete all the resources, run:
kfctl delete -f ${CONFIG_FILE}
```

### Understanding the deployment process

The kfctl deployment process includes the following commands:

* `kfctl build` - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* `kfctl apply` - Creates or updates the resources.
* `kfctl delete` - Deletes the resources.

### Application layout

Your Kubeflow application directory **${KF_DIR}** contains the following files 
and directories:

* **${CONFIG_FILE}** is a YAML file that defines configurations related to your 
  Kubeflow deployment.

  * This file is a copy of the GitHub-based configuration YAML file that
    you used when deploying Kubeflow: {{% config-uri-k8s-istio %}}.
  * When you run `kfctl apply` or `kfctl build`, kfctl creates
    a local version of the configuration file, `${CONFIG_FILE}`,
    which you can further customize if necessary.
* **kustomize** is a directory that contains the kustomize packages for Kubeflow
  applications. See 
  [how Kubeflow uses kustomize](/docs/other-guides/kustomize/).

  * The directory is created when you run `kfctl build` or `kfctl apply`.
  * You can customize the Kubernetes resources by modifying the manifests and
    running `kfctl apply` again.

We recommend that you check in the contents of your `${KF_DIR}` directory
into source control.

### Provisioning of Persistent Volumes in Kubernetes

Note that you can skip this step if you have a dynamic volume provisioner already installed in your cluster.

If you don't have one:

* You can choose to create PVs manually after deployment of Kubeflow.
* Or install a dynamic volume provisioner like [Local Path Provisioner](https://github.com/rancher/local-path-provisioner#deployment). Ensure that the StorageClass used by this provisioner is the default StorageClass.

### Troubleshooting

#### Persistent Volume Claims are in Pending State

Check if PersistentVolumeClaims get `Bound` to PersistentVolumes.
   ```
   kubectl -n kubeflow get pvc

   ```

If the PersistentVolumeClaims (PVCs) are in `Pending` state after deployment and they are not bound to PersistentVolumes (PVs), you may have to either manually create PVs for each PVC in your Kubernetes Cluster or an alternative is to set up [dynamic volume provisioning](#provisioning-of-persistent-volumes-in-kubernetes) to create PVs on demand and redeploy Kubeflow after deleting existing PVCs.

### Next steps

* Run a [sample machine learning workflow](/docs/examples/kubeflow-samples/).
* Get started with [Kubeflow Pipelines](/docs/pipelines/pipelines-quickstart/).
