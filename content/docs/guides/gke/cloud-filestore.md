+++
title = "Using Cloud Filestore"
description = "Using Cloud Filestore with Kubeflow"
weight = 3
toc = true
bref = "This guide describes how to set up and use Cloud Filestore with Kubeflow on Google Cloud Platform (GCP)."

[menu.docs]
  parent = "gke"
  weight = 4
+++

## About Cloud Filestore

[Cloud File Store](https://cloud.google.com/filestore/docs/) is a fully managed NFS offering.
Cloud Filestore is very useful for creating a shared filesystem that can be mounted into pods such as Jupyter.

## Before you start

This guide assumes you have already set up Kubeflow on GCP. If you haven't done
so, follow the guide to 
[getting started with Kubeflow on Kubernetes Engine](/docs/started/getting-started-gke).

## Create a Cloud Filestore instance

Follow these instructions to create a Cloud Filestore instance; if you already have a Cloud Filestore instance you want to
use you can skip this section.

Copy the Cloud Filestore deployment manager configs to the `gcp_config` directory:

```
cp ${KUBEFLOW_SRC}/scripts/gke/deployment_manager_configs/gcfs.yaml \
   ${KFAPP}/gcp_config/
```

Edit `gcfs.yaml` to match your desired configuration:

  * Set zone
  * Set name
  * Set the value of parent to include your project e.g.

    ```
    projects/${PROJECT}/locations/${ZONE}
    ```

Using [yq](https://github.com/kislyuk/yq):

```
cd ${KFAPP}
. env.sh
yq -r ".resources[0].properties.instanceId=\"${DEPLOYMENT_NAME}\"" ${KFAPP}/gcp_config/gcfs.yaml > ${KFAPP}/gcp_config/gcfs.yaml.new
mv ${KFAPP}/gcp_config/gcfs.yaml.new ${KFAPP}/gcp_config/gcfs.yaml
```

Apply the changes:

```
cd ${KFAPP}
${KUBEFLOW_SRC}/scripts/kfctl.sh apply platform
```

If you get an error **legacy networks are not supported** follow the instructions
in the [troubleshooting guide](/docs/guides/troubleshooting).

## Configure Kubeflow to mount the Cloud Filestore volume

Configure Kubeflow to mount Cloud Filestore as a volume:

```
cd ${KFAPP}/ks_app
ks generate google-cloud-filestore-pv google-cloud-filestore-pv --name="kubeflow-gcfs" \
   --storageCapacity="${GCFS_STORAGE}" \
   --serverIP="${GCFS_INSTANCE_IP_ADDRESS}"
ks param set jupyterhub disks "kubeflow-gcfs"
```

  * **GCFS_STORAGE** The size of the Cloud Filestore persistent volume claim
  * **GCFS_INSTANCE_IP_ADDRESS** The ip address of your Cloud Filestore instance; you can obtain this with `gcloud`:

     ```
     gcloud --project=${PROJECT} beta filestore instances list
     ```

Apply the changes:

```
cd ${KFAPP}
${KUBEFLOW_SRC}/scripts/kfctl.sh apply k8s
```
