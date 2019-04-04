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

You can use ksonnet to customize Kubeflow.

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

To customize the Kubeflow resources running within the cluster you can modify the ksonnet app in **${KFAPP}/ks_app**.
For example, to mount additional physical volumes (PVs) in Jupyter:

```
cd ${KF_APP}/ks_app
ks param set jupyterhub disks "kubeflow-gcfs"
```

You can then redeploy using `kfctl`:

```
cd ${KFAPP}
kfctl apply k8s
```

or using ksonnet directly:
```
cd ${KFAPP}/ks_app
ks apply default
```

## Common customizations

Add GPU nodes to your cluster:

  * Set gpu-pool-initialNodeCount [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/deployment/gke/deployment_manager_configs/cluster-kubeflow.yaml#L40).

Add Cloud TPUs to your cluster:

  * Set `enable_tpu:true` [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/deployment/gke/deployment_manager_configs/cluster-kubeflow.yaml#L52).

To use VMs with more CPUs or RAM:

  * Change the machineType.
  * There are two node pools:
      * one for CPU only machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L96).
      * one for GPU machines [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster.jinja#L96).
  * When making changes to the node pools you also need to bump the pool-version [here](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L37) before you update the deployment.

To grant additional users IAM permissions to access Kubeflow:

  * Add users by editing [cluster-kubeflow.yaml](https://github.com/kubeflow/kubeflow/blob/{{< params "githubbranch" >}}/deployment/gke/deployment_manager_configs/cluster-kubeflow.yaml#L74).


By default, this file will be located at `${KUBEFLOW_SRC}/kubeflow/gcp_config/cluster-kubeflow.yaml` after your first deployment. After making changes to the file, you'll need to apply them:

```
cd ${KFAPP}
kfctl apply all
```

For more information please refer to the [Deployment Manager docs](https://cloud.google.com/deployment-manager/docs/).

## More customizations

Refer to the navigation panel on the left of these docs for more customizations,
including [using your own domain](/docs/gke/custom-domain), 
[setting up Cloud Filestore](/docs/gke/cloud-filestore), and more.
