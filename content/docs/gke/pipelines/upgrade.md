+++
title = "Upgrading and Reinstalling"
description = "How to upgrade or reinstall your Pipelines deployment on Google Cloud Platform (GCP)"
weight = 50
+++

Starting from Kubeflow version 0.5, Kubeflow Pipelines persists the
pipeline data in a permanent storage volume. Kubeflow Pipelines therefore
supports the following capabilities:

* **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the storage to retrieve the original data in the new cluster.

* **Upgrading:** Limited support: 

    The full Kubeflow deployment doesn't currently support upgrading. Check the
    following sources for progress:

    * [Issue kubeflow/kubeflow #3727](https://github.com/kubeflow/kubeflow/issues/3727).
    * [Kubeflow upgrade guide](/docs/upgrading/upgrade/).

    You can use the [Kubeflow Pipelines Standalone 
    deployment](/docs/pipelines/installation/standalone-deployment/), which does
    support upgrading.

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

On GCP, Kubeflow Pipelines creates a Compute Engine 
[Persistent Disk](https://cloud.google.com/persistent-disk/) (PD)
and mounts it as a PV. 

## Deploying Kubeflow

Follow the guide to [deploying Kubeflow on
GCP](/docs/gke/deploy/). 

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

## Reinstalling Kubeflow Pipelines

You can delete a Kubeflow cluster and create a new one, specifying
your existing storage to retrieve the original data in the new cluster.

**Notes:** 

* You must use command line deployment. You cannot reinstall
  Kubeflow Pipelines using the web interface.
* When you do `kfctl apply` or `kfctl build`, you should use a 
  different `${KF_NAME}` name from your existing `${KF_NAME}`. Otherwise, your 
  data in the existing PDs will be deleted during `kfctl apply`.

To reinstall Kubeflow Pipelines, follow the [command line deployment 
instructions](/docs/gke/deploy/deploy-cli/), but note the following
changes in the procedure:

1. Set a different `${KF_NAME}` name from your existing `${KF_NAME}`.

1. **Before** running the following `apply` command:

    ```
    kfctl apply -V -f ${CONFIG_FILE}
    ```

    You should first:
    * Edit `${KF_DIR}/gcp_config/storage-kubeflow.yaml` to skip creating new storage:

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
