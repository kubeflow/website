+++
title = "Customizing Kubeflow on GKE"
description = "Tailoring a GKE deployment of Kubeflow"
weight = 2
+++

This guide describes how to customize your deployment of Kubeflow on Google 
Kubernetes Engine (GKE) in Google Cloud Platform (GCP).

## Before you start

This guide assumes you have already set up Kubeflow with GKE. If you haven't done
so, follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/).

## Customizing Kubeflow

You can use [kustomize](https://kustomize.io/) to customize Kubeflow.

The deployment process is divided into two steps, **generate** and **apply**, so that you can
modify your deployment before actually deploying.

To customize GCP resources (such as your Kubernetes Engine cluster), you can modify the deployment manager configs in **${KFAPP}/gcp_config**.

Many changes can be applied to an existing configuration in which case you can run:

```
cd ${KFAPP}
kfctl apply platform
```

or using Deployment Manager directly:

```
cd ${KFAPP}/gcp_config
gcloud deployment-manager --project=${PROJECT} deployments update ${DEPLOYMENT_NAME} --config=cluster-kubeflow.yaml
```

  * **PROJECT** Name of your GCP project. You could find it in `${KFAPP}/app.yaml`.
  * **DEPLOYMENT_NAME** Name of your Kubeflow app. You could also find it in `${KFAPP}/app.yaml`. 
    In specific, `.metadata.name`

Some changes (such as the VM service account for Kubernetes Engine) can only be set at creation time; in this case you need
to tear down your deployment before recreating it:

```
cd ${KFAPP}
kfctl delete all
kfctl apply all
```

To customize the Kubeflow resources running within the cluster you can modify the kustomize manifests in **${KFAPP}/kustomize**.
For example, to change the storage class for Jupyter:

```
cd ${KF_APP}/kustomize
gvim jupyter.yaml
```

Find and replace the value for `STORAGE_CLASS`. You can then redeploy using `kfctl`:

```
cd ${KFAPP}
kfctl apply k8s
```

or using kubectl directly:
```
cd ${KFAPP}/kustomize
kubectl apply -f jupyter.yaml
```

## Common customizations

Add GPU nodes to your cluster:

  * Set gpu-pool-initialNodeCount [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/deployment/gke/deployment_manager_configs/cluster-kubeflow.yaml#L40).

Add Cloud TPUs to your cluster:

  * Set `enable_tpu:true` [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/deployment/gke/deployment_manager_configs/cluster-kubeflow.yaml#L52).

Add VMs with more CPUs or RAM:

  * Change the machineType.
  * There are two node pools:
      * one for CPU only machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L96).
      * one for GPU machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L96).
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
