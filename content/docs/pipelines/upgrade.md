+++
title = "Upgrading and Reinstalling"
description = "How to upgrade or reinstall your Kubeflow Pipelines deployment"
weight = 50
+++

Starting from Kubeflow v0.5, Kubeflow Pipelines persists the
pipeline data in permanent storage volumes. Kubeflow Pipelines therefore
supports the following capabilities:

* **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the existing storage volumes to retrieve the original data in the new cluster.

* **Upgrade (limited support):**

    The full Kubeflow deployment currently supports upgrading in **Alpha**
    status with limited support. Check the following sources for progress
    updates:

    * [Issue kubeflow/kubeflow #3727](https://github.com/kubeflow/kubeflow/issues/3727).
    * [Kubeflow upgrade guide](/docs/upgrading/upgrade/).

## Before you start

This guide tells you how to reinstall Kubeflow Pipelines as part of a
full Kubeflow deployment. This guide therefore assumes that you want to use one 
of the options in the [Kubeflow deployment 
guide](/docs/started/getting-started/) to deploy Kubeflow Pipelines with 
Kubeflow.

Note the following alternatives:

* Instead of the full Kubeflow deployment, you can use Kubeflow Pipelines 
  Standalone, which does support upgrading. See how to upgrade the
  [Kubeflow Pipelines Standalone
  deployment](/docs/pipelines/installation/standalone-deployment/#upgrade).

* If you're using Kubeflow Pipelines on Google Cloud Platform (GCP), see how to
  [upgrade or reinstall Kubeflow Pipelines on 
  GCP](/docs/gke/pipelines/upgrade/).

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
You can specify your own preferred PV.

## Deploying Kubeflow

This section describes how to deploy Kubeflow in a way that ensures you can use
the Kubeflow Pipelines reinstallation capability.

* If you don't need custom storage and are happy with the default PVs that
  Kubeflow provides, you can follow the Kubeflow
  [deployment guide](/docs/started/getting-started/)
  without doing anything extra. The deployment process uses the Kubernetes 
  default
  [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/#the-storageclass-resource)
  to provision the PVs for you. 

* If you want to specify a custom PV:

  1. Create your Kubernetes cluster if you don't already have one. 
     See the [Kubernetes documentation](https://kubernetes.io/docs/setup/).

  1. Create two PVs in your Kubernetes cluster with your preferred storage type. 
     See the
     [Kubernetes guide to PVs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes).  

  1. Follow the Kubeflow
     [deployment guide](/docs/started/getting-started/),
     but **note the following changes to the standard procedure**.

  1. **Before** running the `kfctl apply` command:

      * Edit `${KF_DIR}/kustomize/minio/overlays/minioPd/params.env` and specify
        the PV for the Minio server:
        
        ```
        ...
        minioPd=[YOUR-PRE-CREATED-MINIO-PV-NAME]
        ...
        ```

      * Edit `${KF_DIR}/kustomize/mysql/overlays/mysqlPd/params.env` and specify
        the PV for the MySQL database:

        ```
        ...
        mysqlPd=[YOUR-PRE-CREATED-MYSQL-PV-NAME]
        ...
        ```

  1. Run the `kfctl apply` command to deploy Kubeflow as usual:

        ```
        kfctl apply -V -f ${CONFIG_FILE}
        ``` 

## Reinstalling Kubeflow Pipelines

You can delete a Kubeflow cluster and create a new one, specifying
your existing storage to retrieve the original data in the new cluster.

Notes:

* You must use command-line deployment. 
  You cannot reinstall Kubeflow Pipelines using the web interface.
* When you do `kfctl apply` or `kfctl build`, you should use a different 
  deployment name from your existing deployment name. Using a different name
  ensures that your data is safe in case of a deployment failure. This guide 
  defines the deployment name in the ${KF_NAME} environment variable. 
* The reinstallation steps are the same as for a standard Kubeflow installation, 
  except that you must use the same PV definitions as in your previous 
  deployment to create the PV in the new cluster.

To reinstall Kubeflow Pipelines:

1. Create two PVs in your Kubernetes cluster, using the same PV definitions as
   in your previous deployment. See the
   [Kubernetes guide to PVs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes).  

1. Follow the Kubeflow
   [deployment guide](/docs/started/getting-started/),
   but **note the following changes to the standard procedure**.

1. Set a different `${KF_NAME}` name from your existing `${KF_NAME}`.

1. **Before** running the `kfctl apply` command:

  * Edit `${KF_DIR}/kustomize/minio/overlays/minioPd/params.env` and specify
    the PV for the Minio server:
      
    ```
    ...
    minioPd=[YOUR-PRE-CREATED-MINIO-PV-NAME]
    ...
    ```

  * Edit `${KF_DIR}/kustomize/mysql/overlays/mysqlPd/params.env`and specify
    the PV for the MySQL database:

    ```
    ...
    mysqlPd=[YOUR-PRE-CREATED-MYSQL-PV-NAME]
    ...
    ```

1. Run the `kfctl apply` command to deploy Kubeflow as usual:

    ```
    kfctl apply -V -f ${CONFIG_FILE}
    ``` 

You should now have a new Kubeflow deployment that uses the same pipelines data 
storage as your previous deployment. Follow any remaining steps in the 
[Kubeflow deployment guide](/docs/started/getting-started/)
to check your deployment, depending on the deployment option you chose.
