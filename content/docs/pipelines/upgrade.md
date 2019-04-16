+++
title = "Upgrading and Reinstalling"
description = "How to upgrade or reinstall your Kubeflow Pipelines deployment"
weight = 70
+++

Starting from Kubeflow version 0.5, Kubeflow Pipelines persists the
pipeline data in a permanent storage volume. Kubeflow Pipelines therefore
supports the following capabilities:

* **Upgrade:** You can upgrade your Kubeflow Pipelines deployment to a
  later version without deleting and recreating the cluster.
* **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the storage to retrieve the original data in the new cluster.

## Context

Kubeflow Pipelines creates and manages the following data related to your 
machine learning pipeline: 

* **Metadata:** Experiments, jobs, runs, etc. Kubeflow Pipelines 
  stores the pipeline metadata in a MySQL database.
* **Artifacts:** Pipeline packages, metrics, views, etc. Kubeflow Pipelines 
  stores the artifacts in a [Minio server](https://docs.minio.io/).

The MySQL database and the Minio server are both backed by the Kubernetes
[PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)
(PV) subsystem. 

* If you are deploying to Google Cloud Platform (GCP), Kubeflow Pipelines 
  creates a Compute Engine 
  [Persistent Disk](https://cloud.google.com/persistent-disk/) (PD)
  and mounts it as a PV. 
* If you are not deploying to GCP, you can specify your own prefered PV.

## Deploying Kubeflow

This section describes how to deploy Kubeflow in a way that ensures you can use
the Kubeflow Pipelines upgrade/installation capability.

### Deploying Kubeflow on GCP 

Follow the guide to [deploying Kubeflow on
GCP](/docs/gke/deploy/). You don't need to do anything extra. 

When the deployment has finished, you can see two entries in the GCP 
Deployment Manager, one for deploying the cluster and one for
deploying the storage:

<img src="/docs/images/pipelines-deployment-storage1.png" 
  alt="Deployment Manager showing the storage deployment entry"
  class="mt-3 mb-3 border border-info rounded">

The entry suffixed with `-storage` creates one PD for the metadata store and one
for the artifact store:

<img src="/docs/images/pipelines-deployment-storage2.png" 
  alt="Deployment Manager showing details of the storage deployment entry"
  class="mt-3 mb-3 border border-info rounded">

### Deploying Kubeflow in other environments (non-GCP) 

The steps below assume that you already have a Kubernetes cluster set up.

* If you don't need custom storage and are happy with the default PVs that
  Kubeflow provides, you can follow the Kubeflow
  [quick start](/docs/started/getting-started/#kubeflow-quick-start)
  without doing anything extra. The deployment script uses the Kubernetes 
  default
  [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/#the-storageclass-resource)
  to provision the PVs for you. 

* If you want to specify a custom PV:

  1. Create two PVs in your Kubernetes cluster with your preferred storage type. 
     See the
     [Kubernetes guide to PVs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes).  

  1. Follow the Kubeflow
     [quick start](/docs/started/getting-started/#kubeflow-quick-start),
     but note the following change to the standard procedure:

        **Before** running the `apply` command:

        ```
        kfctl apply all -V
        ```

        You must run the following commands to specify your PVs:

        ```
        cd ks_app
        ks param set pipeline mysqlPvName [YOUR-PRE-CREATED-MYSQL-PV-NAME]
        ks param set pipeline minioPvName [YOUR-PRE-CREATED-MINIO-PV-NAME]
        ```

  1. Then run the `apply` command as usual:

        ```
        kfctl apply k8s
        ``` 

## Upgrading your Kubeflow Pipelines deployment

To upgrade your Kubeflow Pipelines deployment to the latest version, run the following script in the 
Kubeflow application directory. That is, in the same directory where you 
performed the original deployment, represented in the deployment guide as
`${KFAPP}`:

```
cd ${KFAPP}
${KUBEFLOW_SRC}/scripts/upgrade_kfp.sh
```
Alternatively, you can upgrade to a specific version of Kubeflow Pipelines by specifying the version tag. You can find the version tag in the Kubeflow Pipelines [release page](https://github.com/kubeflow/pipelines/releases). For example, to upgrade to v0.1.12
```
${KUBEFLOW_SRC}/scripts/upgrade_kfp.sh a1afdd6c4b297b56dd103a8bb939ddeae67c2c92
```

If you used the web interface
([https://deploy.kubeflow.cloud/#/deploy](https://deploy.kubeflow.cloud/#/deploy))
to deploy Kubeflow, you must first clone the Kubeflow application directory 
from your project's 
[Cloud Source Repository](https://cloud.google.com/sdk/gcloud/reference/source/repos/clone), 
then proceed with the upgrade:

```
export PROJECT=[YOUR-GCP-PROJECT]
export CLOUD_SRC_REPO=${PROJECT}-kubeflow-config
gcloud source repos clone ${CLOUD_SRC_REPO} --project=${PROJECT}
kubectl create clusterrolebinding admin-binding --clusterrole=cluster-admin --user=[YOUR-EMAIL-ADDRESS]
${KUBEFLOW_SRC}/scripts/upgrade_kfp.sh 
```

## Reinstalling Kubeflow Pipelines

You can delete a Kubeflow cluster and create a new one, specifying
your existing storage to retrieve the original data in the new cluster.

**Note:** You must use command line deployment. You cannot reinstall
Kubeflow Pipelines using the web interface.

### Reinstalling Kubeflow Pipelines on GCP

To reinstall Kubeflow Pipelines, follow the [command line deployment 
instructions](/docs/gke/deploy/deploy-cli/), but note the following
change in the procedure:

1. **Before** running the following `apply` command:

    ```
    kfctl apply all -V
    ```

    You must edit `gcp_config/storage-kubeflow.yaml`:

    ```
    ...
    createPipelinePersistentStorage: false
    ...
    ```

    Also run the following command to specify the persistent disk created 
    in a previous deployment:

    ```
    cd ks_app
    ks param set pipeline mysqlPd [NAME-OF-METADATA-STORAGE-DISK]
    ks param set pipeline minioPd [NAME-OF-ARTIFACT-STORAGE-DISK]
    cd ..
    ```

1. Then run the `apply` command:

    ```
    kfctl apply all -V
    ``` 

### Reinstalling Kubeflow in other environments (non-GCP) 

The steps are the same as for any non-GCP installation, except that you
must use the same PV definitions as in your previous deployment to create the
PV in the new cluster.

1. Create two PVs in your Kubernetes cluster, using the same PV definitions as
   in your previous deployment. See the
   [Kubernetes guide to PVs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes).  

1. Follow the Kubeflow
   [quick start](/docs/started/getting-started/#kubeflow-quick-start),
   but note the following change to the standard procedure:

    **Before** running the `apply` command:

    ```
    kfctl apply k8s
    ```

    You must run the following commands to specify your PVs:

    ```
    cd ks_app
    ks param set pipeline mysqlPvName [YOUR-PRE-CREATED-MYSQL-PV-NAME]
    ks param set pipeline minioPvName [YOUR-PRE-CREATED-MINIO-PV-NAME]
    ```

1. Then run the `apply` command:

    ```
    kfctl apply k8s
    ``` 
