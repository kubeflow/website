+++
title = "Upgrading a Kubeflow Deployment"
description = "Upgrading your deployment to a later version of Kubeflow"
weight = 30
+++

Until version 1.0, Kubeflow makes no promises of backwards compatibility or 
upgradeability. Nonetheless, here are some instructions for updating your 
deployments.

## Upgrading Kubeflow

Follow these steps to upgrade your Kubeflow deployment:

1. Check your local ${CONFIG_FILE} into source control as backup.

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball:

  ```
  tar -xvf kfctl_<release tag>_<platform>.tar.gz
  ```

1. Update your kustomize manifests:

  ```
  export CONFIG_FILE=<the path to your Kubeflow config file>
  kfctl build -V -f ${CONFIG_FILE}
  ```

  Note that this will overwrite your previous manifest files.
  
1. Re-apply any customizations that you need.

1. Update the deployment:

     ```
     kfctl apply -V -f ${CONFIG_FILE}
     ```

## Upgrading Kubeflow Pipelines

See the [Kubeflow Pipelines upgrade guide](/docs/pipelines/upgrade/).
