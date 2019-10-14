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
[setup and deploy step](/docs/gke/deploy/deploy-cli/#set-up-and-deploy), run the
**build** command as described in that step. Now you can edit the
configuration files before deploying Kubeflow.

## Customizing an existing deployment

You can also customize an existing Kubeflow deployment. In that case, this 
guide assumes that you have already followed the guide to 
[deploying Kubeflow on GCP](/docs/gke/deploy/deploy-cli/) and have deployed
Kubeflow to a GKE cluster.

## Before you start

This guide assumes the following settings: 

* The `${KFAPP}` environment variable contains the name
  of your Kubeflow application directory, as described in the guide to
  [deploying Kubeflow on GCP](/docs/gke/deploy/deploy-cli/):

  ```
  export KFAPP=<your choice of application directory name>
  ```

* The `${CONFIG}` environment variable contains the path to a kfctl 
  configuration file, as described in the section on [preparing your environment 
  for deployment](/docs/gke/deploy/deploy-cli/#prepare-environment):

  ```
  export CONFIG="{{% config-uri-gcp-iap %}}"
  ```

    Or:

  ```
  export CONFIG="{{% config-uri-gcp-basic-auth %}}"
  ```

* All commands below start from the parent directory that contains your 
  `${KFAPP}` directory:

  ```
  cd <the parent directory of your KFAPP directory>
  ```

## Customizing GCP resources

To customize GCP resources, such as your Kubernetes Engine cluster, you can 
modify the Deployment Manager configuration settings in `${KFAPP}/gcp_config`.

After modifying your existing configuration, run the following command to apply
the changes:

```
cd ${KFAPP}
kfctl apply -V -f ${CONFIG}
```

Alternatively, you can use Deployment Manager directly:

```
cd ${KFAPP}/gcp_config
gcloud deployment-manager --project=${PROJECT} deployments update ${DEPLOYMENT_NAME} --config=cluster-kubeflow.yaml
```

  * **PROJECT** The ID of your GCP project. You can find the project ID in 
    your `${KFAPP}/app.yaml` file, as the value for the `project` key.
  * **DEPLOYMENT_NAME** The name of your Kubeflow application. You can find 
    the name in your `${KFAPP}/app.yaml` file, as the value for the 
    `metadata.name` key.

Some changes (such as the VM service account for Kubernetes Engine) can only be set at creation time; in this case you need
to tear down your deployment before recreating it:

```
cd ${KFAPP}
kfctl delete all
kfctl apply -V -f ${CONFIG}
```

## Customizing Kubernetes resources

You can use [kustomize](https://kustomize.io/) to customize Kubeflow.
To customize the Kubernetes resources running within the cluster, you can modify 
the kustomize manifests in `${KFAPP}/kustomize`.

For example, to modify settings for the Jupyter web app:

1. Open `${KFAPP}/kustomize/jupyter-web-app.yaml` in a text editor.
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
  cd ${KFAPP}
  kfctl apply -V -f ${CONFIG}
  ```

    Or use kubectl directly:
  ```
  cd ${KFAPP}/kustomize
  kubectl apply -f jupyter-web-app.yaml
  ```

## Common customizations

Add GPU nodes to your cluster:

  * Set gpu-pool-initialNodeCount [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/deployment/gke/deployment_manager_configs/cluster-kubeflow.yaml#L56).

Add Cloud TPUs to your cluster:

  * Set `enable_tpu:true` [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/deployment/gke/deployment_manager_configs/cluster-kubeflow.yaml#L78).

Add VMs with more CPUs or RAM:

  * Change the machineType.
  * There are two node pools:
      * one for CPU only machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L109).
      * one for GPU machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L149).
  * When making changes to the node pools you also need to bump the pool-version [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L37) before you update the deployment.

Add users to Kubeflow:

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
