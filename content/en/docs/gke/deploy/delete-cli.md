+++
title = "Delete using CLI"
description = "Deleting Kubeflow from GCP using the command line interface (CLI)"
weight = 6
+++


This page shows you how to delete a Kubeflow deployment on
Google Cloud Platform (GCP) using `kubectl`.

## Before you start

This guide assumes the following settings: 

* The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration 
  files. For example, `/opt/my-kubeflow/`.

  ```
  export KF_DIR=<path to your Kubeflow application directory>
  ``` 

## Deleting your deployment


1. To just delete the applications running in the Kubeflow namespace just delete that namespace

   ```
   kubectl delete namespace kubeflow
   ```

1. To delete the cluster and all GCP resources

```
cd ${KF_DIR}
make delete-gcp
```

