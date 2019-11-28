+++
title = "Upgrading a Kubeflow Deployment"
description = "Upgrading your deployment to a later version of Kubeflow"
weight = 30
+++

Until version 1.0, Kubeflow makes no promises of backwards compatibility or 
upgradeability. There is **no clean upgrade path** to the latest version of 
Kubeflow ({{% kf-latest-version %}}).

Nonetheless, here are some instructions for updating your deployment:

1. Check your Kubeflow configuration directory (`${KF_DIR}`) into source control
  as a backup.

1. Delete your existing Kubeflow cluster:

  ```  
  kfctl delete -V 
  ```

    

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
    The `${CONFIG_FILE}` environment variable must contain the path to the 
    Kubeflow configuration file in your `${KF_DIR}` directory. For example,
    `${KF_DIR}/{{% config-file-k8s-istio %}}` or `${KF_DIR}/kfctl_existing_arrikto.yaml`
  
1. Re-apply any customizations that you need.

1. Update the deployment:

     ```
     kfctl apply -V -f ${CONFIG_FILE}
     ```

## Upgrading Kubeflow Pipelines

See the [Kubeflow Pipelines upgrade guide](/docs/pipelines/upgrade/).
