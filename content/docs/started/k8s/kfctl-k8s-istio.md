+++
title = "Kubeflow Deployment with kfctl_k8s_istio"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster using kfctl_k8s_istio config"
weight = 2
+++

This config creates a vanilla deployment of Kubeflow with all its core components without any external dependencies. The deployment can be customized based on your environment needs.

**Maintainer and supporter: Kubeflow community**

### Deploy Kubeflow

This Kubeflow deployment requires a default StorageClass with a [dynamic volume provisioner](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/). Verify the `provisioner` field of your default StorageClass definition.
If you don't have a provisioner, ensure that you have configured volume provisioning in your Kubernetes cluster appropriately as mentioned [below](#provisioning-of-persistent-volumes-in-kubernetes).

Follow these steps to deploy Kubeflow:

1. Download the latest `kfctl` release from the [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/) and unpack it:
    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```
    
    Script to download and unpack for Linux/MacOS:
    ```
    opsys=linux # darwin for Mac
    
    curl -s https://api.github.com/repos/kubeflow/kubeflow/releases/latest |\
        grep browser_download |\
        grep $opsys |\
        cut -d '"' -f 4 |\
        xargs curl -O -L && \
        tar -zvxf kfctl_*_${opsys}.tar.gz 
    ```

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary `kfctl` to your path. If you don't add the binary to your path, you must use the full path to the `kfctl` binary each time you run it.

   ```bash
   # Add kfctl to PATH, to make the kfctl binary easier to use.
   export PATH=$PATH:"<path to kfctl>"
   export KFAPP="<your choice of application directory name>"
   # Installs istio by default. Comment out istio components in the config file to skip istio installation. See https://github.com/kubeflow/kubeflow/pull/3663
   export CONFIG="https://raw.githubusercontent.com/kubeflow/kubeflow/{{% kf-latest-version %}}/bootstrap/config/kfctl_k8s_istio.yaml"

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


Check the resources deployed in namespace `kubeflow`:

   ```
   kubectl -n kubeflow get  all

   ```

### Access Kubeflow Dashboard

Once Kubeflow is deployed, the Kubeflow Dashboard can be accessed via `istio-ingressgateway` service. If loadbalancer is not available in your environment, NodePort or Port forwarding can be used to access the Kubeflow Dashboard.Refer [Ingress Gateway guide](https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/).

### Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```bash
cd ${KFAPP}
# If you want to delete all the resources, run:
kfctl delete all -V
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
* Get started with [Kubeflow Pipelines](/docs/pipelines/pipelines-quickstart/)
