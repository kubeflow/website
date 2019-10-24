+++
title = "Delete using CLI"
description = "Deleting Kubeflow from GCP using the command line interface (CLI)"
weight = 6
+++

This page shows you how to use the CLI to delete a Kubeflow deployment on
Google Cloud Platform (GCP).

## Before you start

This guide assumes the following settings: 

* The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration 
  files. For example, `/opt/my-kubeflow/`.

  ```
  export KF_DIR=<path to your Kubeflow application directory>
  ``` 

* The `${CONFIG_FILE}` environment variable contains the path to your 
  Kubeflow configuration file.

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-gcp-iap %}}
  ```

    Or:

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-gcp-basic-auth %}}
  ```

For further background about the above settings, see the guide to
[deploying Kubeflow with the CLI](/docs/gke/deploy/deploy-cli).

## Deleting your deployment

Run the following commands to delete your deployment and reclaim all GCP
resources:

```
# If you want to delete all the resources, including storage:
kfctl delete -f ${CONFIG_FILE} --delete_storage

# If you want to preserve storage, which contains metadata and information
# from Kubeflow Pipelines:
kfctl delete -f ${CONFIG_FILE}
```

You should consider preserving storage if you may want to relaunch
Kubeflow in the future and restore the data from your 
[pipelines](/docs/pipelines/pipelines-overview/).