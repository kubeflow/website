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
cd ${KFAPP}
# If you want to delete all the resources, including storage:
kfctl delete all --delete_storage
# If you want to preserve storage, which contains metadata and information
# from Kubeflow Pipelines:
kfctl delete all
```
The environment variable `${KFAPP}` must contain the _name_ of the directory 
that contains your Kubeflow configurations. This directory was created when you
deployed Kubeflow.

* The name of the directory is the same as the name of your Kubeflow deployment.
  If you deployed Kubeflow [using the UI](/docs/gke/deploy/deploy-ui/), the 
  value of `${KFAPP}` is the value of the **Deployment name** field on the UI.
* If you deployed Kubeflow [using the CLI](/docs/gke/deploy/deploy-cli/), use 
  the same value as you used when you ran `kfctl build` or `kfctl apply`.

You should consider preserving storage if you may want to relaunch
Kubeflow in the future and restore the data from your 
[pipelines](/docs/pipelines/pipelines-overview/).