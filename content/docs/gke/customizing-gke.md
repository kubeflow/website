+++
title = "Customizing Kubeflow on GKE"
description = "Tailoring a GKE deployment of Kubeflow"
weight = 2
+++

This guide describes how to customize your deployment of Kubeflow on Google 
Kubernetes Engine (GKE) in Google Cloud Platform (GCP).

## Customizing Kubeflow before deployment

The Kubeflow deployment process is divided into two steps, **build** and 
**apply**, so that you can modify your configuration before deploying your 
Kubeflow cluster.

Follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/deploy-cli/).
When you reach the 
[setup and deploy step](/docs/gke/deploy/deploy-cli/#set-up-and-deploy),
**skip the `kfctl apply` command** and run the **`kfctl build`** command 
instead, as  described in that step. Now you can edit the configuration files 
before deploying Kubeflow.

## Customizing an existing deployment

You can also customize an existing Kubeflow deployment. In that case, this 
guide assumes that you have already followed the guide to 
[deploying Kubeflow on GCP](/docs/gke/deploy/deploy-cli/) and have deployed
Kubeflow to a GKE cluster.

## Before you start

This guide assumes the following settings: 

* The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration 
  files. For example, `/opt/my-kubeflow/`.

  ```
  export KF_DIR=<path to your Kubeflow application directory>
  ``` 

* The `${CONFIG_FILE}` environment variable contains the path to your 
  Kubeflow configuration file.

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-gcp-iap %}}
  ```

    Or:

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-gcp-basic-auth %}}
  ```

* The `${KF_NAME}` environment variable contains the name of your Kubeflow 
  deployment. You can find the name in your
  `${CONFIG_FILE}` configuration file, as the value for the `metadata.name` key.

  ```
  export KF_NAME=<the name of your Kubeflow deployment>
  ```

* The `${PROJECT}` environment variable contains the ID of your GCP project. 
  You can find the project ID in your
  `${CONFIG_FILE}` configuration file, as the value for the `project` key.

  ```
  export PROJECT=<your GCP project ID>
  ```

* For further background about the above settings, see the guide to
  [deploying Kubeflow with the CLI](/docs/gke/deploy/deploy-cli).

## Customizing GCP resources

To customize GCP resources, such as your Kubernetes Engine cluster, you can 
modify the Deployment Manager configuration settings in `${KF_DIR}/gcp_config`.

After modifying your existing configuration, run the following command to apply
the changes:

```
cd ${KF_DIR}
kfctl apply -V -f ${CONFIG_FILE}
```

Alternatively, you can use Deployment Manager directly:

```
cd ${KF_DIR}/gcp_config
gcloud deployment-manager --project=${PROJECT} deployments update ${KF_NAME} --config=cluster-kubeflow.yaml
```

Some changes (such as the VM service account for Kubernetes Engine) can only be set at creation time; in this case you need
to tear down your deployment before recreating it:

```
cd ${KF_DIR}
kfctl delete -f ${CONFIG_FILE}
kfctl apply -V -f ${CONFIG_FILE}
```

## Customizing Kubernetes resources

You can use [kustomize](https://kustomize.io/) to customize Kubeflow.
To customize the Kubernetes resources running within the cluster, you can modify 
the kustomize manifests in `${KF_DIR}/kustomize`.

For example, to modify settings for the Jupyter web app:

1. Open `${KF_DIR}/kustomize/jupyter-web-app.yaml` in a text editor.
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

1. Redeploy Kubeflow using kfctl:

  ```
  cd ${KF_DIR}
  kfctl apply -V -f ${CONFIG_FILE}
  ```

    Or use kubectl directly:
  ```
  cd ${KF_DIR}/kustomize
  kubectl apply -f jupyter-web-app.yaml
  ```

## Common customizations

<a id="gpu-config"></a>
### Add GPU nodes to your cluster

To add GPU accelerators to your Kubeflow cluster, you have the following
options:

* Pick a GCP zone that provides NVIDIA Tesla K80 Accelerators 
  (`nvidia-tesla-k80`).
* Or disable node-autoprovisioning in your Kubeflow cluster.
* Or change your node-autoprovisioning configuration.

To see which accelerators are available in each zone, run the following
command:

```
gcloud compute accelerator-types list
```
 
To disable node-autoprovisioning, run `kfctl build` as described above.
Then edit `${KF_DIR}/gcp_config/cluster-kubeflow.yaml` and set 
[`enabled`](https://github.com/kubeflow/manifests/blob/4d2939d6c1a5fd862610382fde130cad33bfef75/gcp/deployment_manager_configs/cluster-kubeflow.yaml#L73) 
to `false`:

```
    ...
    gpu-type: nvidia-tesla-k80
    autoprovisioning-config:
      enabled: false
    ...
```

You must also set 
[`gpu-pool-initialNodeCount`](https://github.com/kubeflow/manifests/blob/4d2939d6c1a5fd862610382fde130cad33bfef75/gcp/deployment_manager_configs/cluster-kubeflow.yaml#L58).

### Add Cloud TPUs to your cluster

Set [`enable_tpu:true`](https://github.com/kubeflow/manifests/blob/4d2939d6c1a5fd862610382fde130cad33bfef75/gcp/deployment_manager_configs/cluster-kubeflow.yaml#L80)
in `${KF_DIR}/gcp_config/cluster-kubeflow.yaml`.

### Add VMs with more CPUs or RAM

  * Change the machineType.
  * There are two node pools:
      * one for CPU only machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L109).
      * one for GPU machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L149).
  * When making changes to the node pools you also need to bump the pool-version [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L37) before you update the deployment.

### Add users to Kubeflow

  * To grant users access to Kubeflow, add the “IAP-secured Web App User” role on the [IAM page in the GCP console](https://console.cloud.google.com/iam-admin/iam). Make sure you are in the same project as your Kubeflow deployment.

  * You can confirm the update by inspecting the IAM policy for your project:
```
gcloud projects get-iam-policy ${PROJECT}
```
  * In the output from the above command, users able to access Kubeflow have the following role: `roles/iap.httpsResourceAccessor`.

## More customizations

Refer to the navigation panel on the left of these docs for more customizations,
including [using your own domain](/docs/gke/custom-domain), 
[setting up Cloud Filestore](/docs/gke/cloud-filestore), and more.
