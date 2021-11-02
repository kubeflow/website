+++
title = "Customize Kubeflow on GKE"
description = "Tailoring a GKE deployment of Kubeflow"
weight = 20
+++

This guide describes how to customize your deployment of Kubeflow on Google 
Kubernetes Engine (GKE) on Google Cloud.

## Before you start

The variables defined in this page can be found in [gcp-blueprint/kubeflow/env.sh](https://github.com/kubeflow/gcp-blueprints/blob/master/kubeflow/env.sh). They are the same value as you set based on your [Kubeflow deployment](/docs/distributions/gke/deploy/deploy-cli/#environment-variables). 

## Customizing Kubeflow before deployment

The Kubeflow deployment process is divided into two steps, **hydrate** and 
**apply**, so that you can modify your configuration before deploying your 
Kubeflow cluster.

Follow the guide to [deploying Kubeflow on Google Cloud](/docs/gke/deploy/deploy-cli/). You can add your patches in corresponding component folder, and include those patches in `kustomization.yaml` file. Learn more about the usage of [kustomize](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/). You can also find the existing kustomization in [kubeflow/gcp-blueprints](https://github.com/kubeflow/gcp-blueprints) as example. After adding the patches, you can run `make hydrate` to validate the resulting resources. Finally, you can run `make apply` to deploy the customized Kubeflow.


## Customizing an existing deployment

You can also customize an existing Kubeflow deployment. In that case, this 
guide assumes that you have already followed the guide to 
[deploying Kubeflow on Google Cloud](/docs/gke/deploy/deploy-cli/) and have deployed
Kubeflow to a GKE cluster.

## Before you start

This guide assumes the following settings: 

* The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration 
  files. For example, `/opt/gcp-blueprints/kubeflow/`.

  ```
  export KF_DIR=<path to your Kubeflow application directory>
  cd "${KF_DIR}"
  ``` 

* Make sure your environment variables are set up for the Kubeflow cluster you want to customize. For further background about the settings, see the guide to
  [deploying Kubeflow with the CLI](/docs/gke/deploy/deploy-cli).


## Customizing Google Cloud resources

To customize Google Cloud resources, such as your Kubernetes Engine cluster, you can 
modify the Deployment settings starting in `${KF_DIR}/common/cnrm`.

This folder contains multiple dependencies on sibling directories for Google Cloud resources. So you can start from here by reviewing `kustomization.yaml`. Depends on the type of Google Cloud resources you want to customize, you can add patches in corresponding directory. 

1. Make sure you checkin the existing resources in `/build` folder to source control.

1. Add the patches in corresponding directory, and update `kustomization.yaml` to include patches.

1. Run `make hydrate` to build new resources in `/build` folder.

1. Carefully examine the result resources in `/build` folder. If the customization is addition only, you can run `make apply` to directly patch the resources.

1. It is possible that you are modifying immutable resources. In this case, you will need to delete existing resource and applying new resources. Note that this might mean lost of your service and data, please execute carefully. General approach to delete and deploy Google Cloud resources:

    1. Revert to old resources in `/build` using source control.

    1. Carefully delete the resource you need to delete by using `kubectl delete`.

    1. Rebuild and apply new Google Cloud resources

      ```bash
      cd common/cnrm
      NAME=$(NAME) KFCTXT=$(KFCTXT) LOCATION=$(LOCATION) PROJECT=$(PROJECT) make apply
      ```


## Customizing Kubeflow resources

You can use [kustomize](https://kustomize.io/) to customize Kubeflow. 
Make sure that you have the minimum required version of kustomize:
<b>{{% kustomize-min-version %}}</b> or later. For more information about
kustomize in Kubeflow, see
[how Kubeflow uses kustomize](/docs/methods/kfctl/kustomize/).

To customize the Kubernetes resources running within the cluster, you can modify 
the kustomize manifests in corresponding component under `${KF_DIR}`.

For example, to modify settings for the Jupyter web app:

1. Open `${KF_DIR}/apps/jupyter/jupyter-web-app/kustomization.yaml` in a text editor.

1. Review the file's inclusion of `deployment-patch.yaml`, and add your modification to `deployment-patch.yaml` based on the original content in `${KF_DIR}/apps/jupyter/jupyter-web-app/upstream/base/deployment.yaml`. For example: change `volumeMounts`'s `mountPath` if you need to customize it.

1. Verify the output resources in `/build` folder using `Makefile`"

    ```bash
    cd "${KF_DIR}"
    make hydrate
    ```

1. Redeploy Kubeflow using `Makefile`:

    ```bash
    cd "${KF_DIR}"
    make apply
    ```

## Common customizations

### Add users to Kubeflow

You must grant each user the minimal permission scope that allows them to 
connect to the Kubernetes cluster.

For Google Cloud, you should grant the following Cloud Identity and Access Management (IAM) roles.

In the following commands, replace `[PROJECT]` with your Google Cloud project and replace `[EMAIL]` with the user's email address:

* To access the Kubernetes cluster, the user needs the [Kubernetes Engine 
  Cluster Viewer](https://cloud.google.com/kubernetes-engine/docs/how-to/iam)
  role:

    ```
    gcloud projects add-iam-policy-binding [PROJECT] --member=user:[EMAIL] --role=roles/container.clusterViewer
    ```

* To access the Kubeflow UI through IAP, the user needs the
  [IAP-secured Web App User](https://cloud.google.com/iap/docs/managing-access)
  role:

    ```
    gcloud projects add-iam-policy-binding [PROJECT] --member=user:[EMAIL] --role=roles/iap.httpsResourceAccessor
    ```

    Note, you need to grant the user `IAP-secured Web App User` role even if the user is already an owner or editor of the project. `IAP-secured Web App User` role is not implied by the `Project Owner` or `Project Editor` roles.

* To be able to run `gcloud container clusters get-credentials` and see logs in Cloud Logging
  (formerly Stackdriver), the user needs viewer access on the project:

    ```
    gcloud projects add-iam-policy-binding [PROJECT] --member=user:[EMAIL] --role=roles/viewer
    ```

Alternatively, you can also grant these roles on the [IAM page in the Cloud Console](https://console.cloud.google.com/iam-admin/iam). Make sure you are in the same project as your Kubeflow deployment.

<a id="gpu-config"></a>
### Add GPU nodes to your cluster

To add GPU accelerators to your Kubeflow cluster, you have the following
options:

* Pick a Google Cloud zone that provides NVIDIA Tesla K80 Accelerators 
  (`nvidia-tesla-k80`).
* Or disable node-autoprovisioning in your Kubeflow cluster.
* Or change your node-autoprovisioning configuration.

To see which accelerators are available in each zone, run the following
command:

```bash
gcloud compute accelerator-types list
```
 
Create the [ContainerNodePool](https://cloud.google.com/config-connector/docs/reference/resource-docs/container/containernodepool) resource adopting GPU, for exmaple, create a new file `containernodepool-gpu.yaml` file and fulfill the value `KUBEFLOW-NAME`, `KF-PROJECT`, `LOCATION` based on your [Kubeflow deployment](/docs/distributions/gke/deploy/deploy-cli/#environment-variables):

```
apiVersion: container.cnrm.cloud.google.com/v1beta1
kind: ContainerNodePool
metadata:
  labels:
    kf-name: KF_NAME # kpt-set: ${name}
  name: containernodepool-gpu
  namespace: KF_PROJECT # kpt-set: ${gcloud.core.project}
spec:
  location: LOCATION # kpt-set: ${location}
  initialNodeCount: 1
  autoscaling:
    minNodeCount: 0
    maxNodeCount: 5
  nodeConfig:
    machineType: n1-standard-4
    diskSizeGb: 100
    diskType: pd-standard
    preemptible: true
    oauthScopes:
    - "https://www.googleapis.com/auth/logging.write"
    - "https://www.googleapis.com/auth/monitoring"
    - "https://www.googleapis.com/auth/devstorage.read_only"
    guestAccelerator:
    - type: "nvidia-tesla-k80"
      count: 1
    metadata:
      disable-legacy-endpoints: "true"
  management:
    autoRepair: true
    autoUpgrade: true
  clusterRef:
    name: KF_NAME # kpt-set: ${name}
    namespace: KF_PROJECT # kpt-set: ${gcloud.core.project}
```

Note that the `metadata:name` must be unique in your Kubeflow project. Because the management cluster uses this as ID and your Google Cloud project as a namespace to identify a node pool.

Apply the node pool patch file above by running:

```bash
kubectl --context="${MGMTCTXT}" --namespace="${KF_PROJECT}" apply -f <path-to-gpu-nodepool-file>
```

After adding GPU nodes to your cluster, you need to install NVIDIA's device drivers to the nodes. Google provides a DaemonSet that automatically installs the drivers for you.
To deploy the installation DaemonSet, run the following command:

```bash
kubectl --context="${KF_NAME}" apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/master/nvidia-driver-installer/cos/daemonset-preloaded.yaml
```


To disable node-autoprovisioning, edit `${KF_DIR}/common/cluster/upstream/cluster.yaml` to set
[`enabled`](https://github.com/kubeflow/gcp-blueprints/blob/v1.3.0/kubeflow/common/cluster/upstream/cluster.yaml#L30) 
to `false`:

```
    ...
    clusterAutoscaling:
      enabled: false
      autoProvisioningDefaults:
    ...
```


### Add Cloud TPUs to your cluster

Note: The following instruction should be used when creating GKE cluster, because the TPU enablement flag `enableTpu` is immutable once cluster is created. You need to create new cluster if existing cluster doesn't have TPU enabled.

Set [`enableTpu:true`](https://cloud.google.com/config-connector/docs/reference/resource-docs/container/containercluster)
in `${KF_DIR}/common/cluster/upstream/cluster.yaml` and enable alias IP (VPC-native traffic routing):

```
apiVersion: container.cnrm.cloud.google.com/v1beta1
kind: ContainerCluster
...
spec:
  ...
  enableTpu: true
  networkingMode: VPC_NATIVE
  networkRef:
    name: containercluster-dep-vpcnative
  subnetworkRef:
    name: containercluster-dep-vpcnative
  ipAllocationPolicy:
    servicesSecondaryRangeName: servicesrange
    clusterSecondaryRangeName: clusterrange
  ...
...
---
apiVersion: compute.cnrm.cloud.google.com/v1beta1
kind: ComputeNetwork
metadata:
  name: containercluster-dep-vpcnative
spec:
  routingMode: REGIONAL
  autoCreateSubnetworks: false
---
apiVersion: compute.cnrm.cloud.google.com/v1beta1
kind: ComputeSubnetwork
metadata:
  name: containercluster-dep-vpcnative
spec:
  ipCidrRange: 10.2.0.0/16
  region: us-west1
  networkRef:
    name: containercluster-dep-vpcnative
  secondaryIpRange:
  - rangeName: servicesrange
    ipCidrRange: 10.3.0.0/16
  - rangeName: clusterrange
    ipCidrRange: 10.4.0.0/16

```

You can learn more at [Creating a new cluster with Cloud TPU support](https://cloud.google.com/tpu/docs/kubernetes-engine-setup#new-cluster), and view an example [Vpc Native Container Cluster](https://cloud.google.com/config-connector/docs/reference/resource-docs/container/containercluster) config connector yaml file.

## More customizations

Refer to the navigation panel on the left of these docs for more customizations,
including [using your own domain](/docs/distributions/gke/custom-domain), 
[setting up Cloud Filestore](/docs/distributions/gke/cloud-filestore), and more.
