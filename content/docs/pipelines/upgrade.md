+++
title = "Upgrading and Reinstalling"
description = "How to upgrade or reinstall your Kubeflow Pipelines deployment"
weight = 50
+++

Starting from Kubeflow version 0.5, Kubeflow Pipelines persists the
pipeline data in a permanent storage volume. Kubeflow Pipelines therefore
supports the following capabilities:

* **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the storage to retrieve the original data in the new cluster.

Note that upgrade isn't currently supported, check [this issue](https://github.com/kubeflow/kubeflow/issues/3727)
for progress.

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
* If you are not deploying to GCP, you can specify your own preferred PV.

## Deploying Kubeflow

This section describes how to deploy Kubeflow in a way that ensures you can use
the Kubeflow Pipelines reinstallation capability.

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
        kfctl apply -V -f ${CONFIG_FILE}
        ```

        You should first edit the following files to specify your PVs:

        `${KF_DIR}/kustomize/minio/overlays/minioPd/params.env`
        ```
        ...
        minioPd=[YOUR-PRE-CREATED-MINIO-PV-NAME]
        ...
        ```

        `${KF_DIR}/kustomize/mysql/overlays/mysqlPd/params.env`
        ```
        ...
        mysqlPd=[YOUR-PRE-CREATED-MYSQL-PV-NAME]
        ...
        ```

  1. Then run the `apply` command as usual:

        ```
        kfctl apply -V -f ${CONFIG_FILE}
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

1. Warning, when you do `kfctl apply` or `kfctl build`, you should use a 
  different `${KF_NAME}` name from your existing `${KF_NAME}`. Otherwise, your 
  data in existing PDs will be deleted during `kfctl apply`.

1. **Before** running the following `apply` command:

    ```
    kfctl apply -V -f ${CONFIG_FILE}
    ```

    You should first:
    * Edit `${KF_DIR}/gcp_config/storage-kubeflow.yaml` to skip creating new storages:

      ```
      ...
      createPipelinePersistentStorage: false
      ...
      ```

    * Edit the following files to specify the persistent disks created
      in a previous deployment:

      `${KF_DIR}/kustomize/minio/overlays/minioPd/params.env`
      ```
      ...
      minioPd=[NAME-OF-ARTIFACT-STORAGE-DISK]
      ...
      ```

      `${KF_DIR}/kustomize/mysql/overlays/mysqlPd/params.env`
      ```
      ...
      mysqlPd=[NAME-OF-METADATA-STORAGE-DISK]
      ...
      ```

1. Then run the `apply` command:

    ```
    kfctl apply -V -f ${CONFIG_FILE}
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
    kfctl apply -V -f ${CONFIG_FILE}
    ```

    You should first edit the following files to specify your PVs:

    `${KF_DIR}/kustomize/minio/overlays/minioPd/params.env`
    ```
    ...
    minioPd=[YOUR-PRE-CREATED-MINIO-PV-NAME]
    ...
    ```

    `${KF_DIR}/kustomize/mysql/overlays/mysqlPd/params.env`
    ```
    ...
    mysqlPd=[YOUR-PRE-CREATED-MYSQL-PV-NAME]
    ...
    ```

1. Then run the `apply` command:

    ```
    kfctl apply -V -f ${CONFIG_FILE}
    ``` 
