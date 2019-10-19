+++
title = "Delete using CLI"
description = "Deleting Kubeflow from GCP using the command line interface (CLI)"
weight = 6
+++

This page shows you how to use the CLI to delete a Kubeflow deployment on
Google Cloud Platform (GCP).

Run the following commands to delete your deployment and reclaim all GCP
resources:

```
# If you want to delete all the resources, including storage:
kfctl delete -f ${KF_DIR}/${KF_CONFIG_FILE} --delete_storage

# If you want to preserve storage, which contains metadata and information
# from Kubeflow Pipelines:
kfctl delete -f ${KF_DIR}/${KF_CONFIG_FILE}
```
The environment variables are as follows:

* `KF_DIR` is the path to the directory which holds your Kubeflow configuration 
  files. For example, `/opt/my-kubeflow/`.
* `KF_CONFIG_FILE` is the name of your Kubeflow configuration file. 
  For example, `kfctl_gcp_iap.yaml`. 
* For further details, see the guide to
  [deploying Kubeflow with the CLI](/docs/gke/deploy/deploy-cli).

You should consider preserving storage if you may want to relaunch
Kubeflow in the future and restore the data from your 
[pipelines](/docs/pipelines/pipelines-overview/).