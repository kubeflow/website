+++
title = "Using Cloud Filestore"
description = "Using Cloud Filestore with Kubeflow"
weight = 60

This guide describes how to set up and use Cloud Filestore with Kubeflow on 
Google Cloud (GCP).

## About Cloud Filestore

[Cloud File Store](https://cloud.google.com/filestore/docs/) is a fully managed NFS offering.
Cloud Filestore is very useful for creating a shared filesystem that can be mounted into pods such as Jupyter.

## Before you start

This guide assumes you have already set up Kubeflow on GCP. If you haven't done
so, follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/).

This guide assumes the following settings: 

* The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration 
  files. For example, `/opt/my-kubeflow/`.

  ```
  export KF_DIR=<path to your Kubeflow application directory>
  ``` 

* The `${KF_NAME}` environment variable contains the name of your Kubeflow 
  deployment. You can find the name in your `${CONFIG_FILE}` 
  configuration file, as the value for the `metadata.name` key.

  ```
  export KF_NAME=<the name of your Kubeflow deployment>
  ```

* The `${PROJECT}` environment variable contains the ID of your GCP project. 

  ```
  export PROJECT=<your GCP project ID>
  ```

* The `${ZONE}` environment variable contains the GCP zone where your
  Kubeflow resources are deployed.

  ```
  export ZONE=<your GCP zone>
  ```

* For further background about the above settings, see the guide to
  [deploying Kubeflow with the CLI](/docs/gke/deploy/deploy-cli).

## Create a Cloud Filestore instance

Follow these instructions to create a Cloud Filestore instance; if you already have a Cloud Filestore instance you want to
use you can skip this section.

1. Create a file called `gcfs.yaml` under `${KF_DIR}/common/cnrm` or the location you want to store the file.

    ```
    # Modify this instance to create a GCFS file store.
    # 1. Change the zone to the desired zone
    # 2. Change the instanceId to the desired id
    # 3. Change network if needed 
    # 4. Change the capacity if desired.
    resources:
    - name: filestore
      type: gcp-types/file-v1beta1:projects.locations.instances
      properties:
        parent: projects/${PROJECT}/locations/${ZONE}
        # Any name of the instance would do
        instanceId: ${KF_NAME}
        tier: STANDARD
        description: Filestore for Kubeflow
        networks:
        - network: default
        fileShares:
        - name: kubeflow
          capacityGb: 1024

    ```

2. Edit `gcfs.yaml` to match your desired configuration:

    * Set zone
    * Set name
    * Set the value of parent to include your project e.g.

      ```
      projects/${PROJECT}/locations/${ZONE}
      ```

3. Apply the configuration to filestore deployment `${KF_NAME}-nfs`

    ```
    cd ${KF_DIR}/common/cnrm
    gcloud --project=${PROJECT} deployment-manager deployments create ${KF_NAME}-nfs --config=gcfs.yaml
    ```

    You might need to enable Filestore API following the terminal output if you haven't enabled it already.

If you get an error **legacy networks are not supported** follow the instructions
in the [troubleshooting guide](/docs/other-guides/troubleshooting).

## Create a PV and PVC to mount the filestore.

Create a PVC for Cloud Filestore instance.

Run the following command to get the ip address of the cloud file store instance

```
gcloud --project=${PROJECT} filestore instances list
```

The output will be something like the following and give you the IP address of your instance.

```
INSTANCE_NAME          ZONE        TIER      CAPACITY_GB  FILE_SHARE_NAME  IP_ADDRESS     STATE  CREATE_TIME
mykubeflow-nfs  us-east1-d  STANDARD  1024         kubeflow         10.20.148.194  READY  2019-05-15T01:23:53

```

Now follow the instructions [Accessing Fileshares from Google Kubernetes](https://cloud.google.com/filestore/docs/accessing-fileshares) to create a PV and PVC.

## Using the PVC

### With Jupyter

In the UI to create a jupyter notebook you can specify the PVC as an extra data volume.
