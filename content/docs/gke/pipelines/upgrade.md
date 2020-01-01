+++
title = "Upgrading and Reinstalling"
description = "How to upgrade or reinstall your Pipelines deployment on Google Cloud Platform (GCP)"
weight = 50
+++

Starting from Kubeflow v0.5, Kubeflow Pipelines persists the
pipeline data in permanent storage volumes. Kubeflow Pipelines therefore
supports the following capabilities:

* **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the existing storage volumes to retrieve the original data in the new cluster.
  This guide tells you how to reinstall Kubeflow Pipelines data as part of a
  full Kubeflow deployment.

* **Upgrade (limited support):**

    The full Kubeflow deployment currently supports upgrading in **Alpha**
    status with limited support. Check the following sources for progress
    updates:

    * [Issue kubeflow/kubeflow #3727](https://github.com/kubeflow/kubeflow/issues/3727).
    * [Kubeflow upgrade guide](/docs/upgrading/upgrade/).

## Before you start

This guide tells you how to reinstall Kubeflow Pipelines data as part of a
full Kubeflow deployment on Google Kubernetes Engine (GKE). See the
[Kubeflow deployment guide](/docs/gke/deploy/).

Instead of the full Kubeflow deployment, you can use Kubeflow Pipelines 
Standalone or GCP Hosted ML Pipelines (Alpha), which support different options
for upgrading and reinstalling. See the [Kubeflow Pipelines installation
options](https://www.kubeflow.org/docs/pipelines/installation/overview/).

## Kubeflow Pipelines data storage

Kubeflow Pipelines creates and manages the following data related to your 
machine learning pipeline: 

* **Metadata:** Experiments, jobs, runs, etc. Kubeflow Pipelines 
  stores the pipeline metadata in a MySQL database.
* **Artifacts:** Pipeline packages, metrics, views, etc. Kubeflow Pipelines 
  stores the artifacts in a [Minio server](https://docs.minio.io/).

Kubeflow Pipelines uses the Kubernetes
[PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)
(PV) subsystem to provision the MySQL database and the Minio server.
On GCP, Kubeflow Pipelines creates a Compute Engine 
[Persistent Disk](https://cloud.google.com/persistent-disk/) (PD)
and mounts it as a PV. 

After [deploying Kubeflow on GCP](/docs/gke/deploy/), you can see two entries in
the [GCP Deployment Manager](https://console.cloud.google.com/dm/deployments),
one for the cluster deployment and one for the storage deployment:

<img src="/docs/images/pipelines-deployment-storage1.png" 
  alt="Deployment Manager showing the storage deployment entry"
  class="mt-3 mb-3 border border-info rounded">

The entry with the suffix `-storage` creates one PD for the metadata store and
one for the artifact store:

<img src="/docs/images/pipelines-deployment-storage2.png" 
  alt="Deployment Manager showing details of the storage deployment entry"
  class="mt-3 mb-3 border border-info rounded">

## Reinstalling Kubeflow Pipelines

You can delete a Kubeflow cluster and create a new one, specifying
your existing storage to retrieve the original data in the new cluster.

Notes:

* You must use command-line deployment. 
  You cannot reinstall Kubeflow Pipelines using the web interface.
* When you do `kfctl apply` or `kfctl build`, you should use a 
  different `${KF_NAME}` name from your existing `${KF_NAME}`. Otherwise,
  kfctl will delete your data in the existing PDs.

To reinstall Kubeflow Pipelines:

1. Follow the [command line deployment 
  instructions](/docs/gke/deploy/deploy-cli/), but **note the following
  changes in the procedure**.

1. Set a different `${KF_NAME}` name from your existing `${KF_NAME}`.

1. **Before** running the `kfctl apply` command:

    * Edit `${KF_DIR}/gcp_config/storage-kubeflow.yaml` and set the following
      flag to skip creating new storage:

      ```
      ...
      createPipelinePersistentStorage: false
      ...
      ```

    * Edit `${KF_DIR}/kustomize/minio/overlays/minioPd/params.env` and specify 
      the PD that your existing deployment uses for the Minio server:

        ```
        ...
        minioPd=[NAME-OF-ARTIFACT-STORAGE-DISK]
        ...
        ```

    * Edit `${KF_DIR}/kustomize/mysql/overlays/mysqlPd/params.env` and specify 
      the PD that your existing deployment uses for the MySQL database:

        ```
        ...
        mysqlPd=[NAME-OF-METADATA-STORAGE-DISK]
        ...
        ```

1. Run the `kfctl apply` command to deploy Kubeflow as usual:

    ```
    kfctl apply -V -f ${CONFIG_FILE}
    ``` 

You should now have a new Kubeflow deploymentthat uses the same pipelines data 
storage as your previous deployment. Follow the steps in the deployment guide
to [check your deployment](/docs/gke/deploy/deploy-cli/#check-your-deployment).
