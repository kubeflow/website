+++
title = "Using Cloud Filestore"
description = "Using Cloud Filestore with Kubeflow"
weight = 4
+++

This guide describes how to set up and use Cloud Filestore with Kubeflow on 
Google Cloud Platform (GCP).

## About Cloud Filestore

[Cloud File Store](https://cloud.google.com/filestore/docs/) is a fully managed NFS offering.
Cloud Filestore is very useful for creating a shared filesystem that can be mounted into pods such as Jupyter.

## Before you start

This guide assumes you have already set up Kubeflow on GCP. If you haven't done
so, follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/).

The instructions below assume that the `${KFAPP}` environment variable contains 
the *name* (not the full path) of the directory containing your Kubeflow 
configurations. See the
[Kubeflow deployment guide](/docs/gke/deploy/deploy-cli/) for details of this
directory.

## Create a Cloud Filestore instance

Follow these instructions to create a Cloud Filestore instance; if you already have a Cloud Filestore instance you want to
use you can skip this section.

Copy the Cloud Filestore deployment manager configs to the `gcp_config` directory:

```
cd /<path-to-kubeflow-deployment>/${KFAPP}
cp .cache/${VERSION}/deployment/gke/deployment_manager_configs/gcfs.yaml \
   ./gcp_config/
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
cd /<path-to-kubeflow-deployment>/${KFAPP}
. env.sh
yq -r ".resources[0].properties.instanceId=\"${DEPLOYMENT_NAME}\"" gcp_config/gcfs.yaml > gcp_config/gcfs.yaml.new
mv gcp_config/gcfs.yaml.new gcp_config/gcfs.yaml
```

Apply the changes:

<!-- 
  TODO(https://github.com/kubeflow/kubeflow/issues/3265): When this is fixed we
  should be able to just rerun kfctl apply platform rather than running gcloud
-->

```
cd /<path-to-kubeflow-deployment>/${KFAPP}/gcp_config
gcloud --project=${PROJECT} deployment-manager deployments create ${KFAPP-NAME}-nfs --config=gcfs.yaml
```

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
