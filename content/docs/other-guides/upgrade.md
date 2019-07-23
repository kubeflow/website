+++
title = "Upgrading Kubeflow Deployments"
description = "Upgrading your Kubeflow deployment"
weight = 30
+++

Until version 1.0 Kubeflow makes no promises of backwards compatibility or 
upgradeability. Nonetheless, here are some instructions for updating your 
deployments.

## Upgrading Kubeflow

Updating your deployment is a two step process:

1. Update your kustomize manifests:

  1. We recommend checking your local packages into source control to back it up before 
     proceeding.
  1. Use `kfctl` to download the desired version of Kubeflow. For example:

       ```
       export KUBEFLOW_VERSION={{% kf-latest-version %}}
       export KFAPP="<the name of your Kubeflow application directory>"
       kfctl init ${KFAPP} --version=${KUBEFLOW_VERSION} --package-manager=kustomize@${KUBEFLOW_VERSION}
       ```

     Note that this will overwrite your previous manifest files.
  
1. Update the actual deployment:

     ```
     cd ${KFAPP}
     kfctl generate all -V --zone ${ZONE}
     kfctl apply -V all
     ```

## Upgrading or reinstalling Kubeflow Pipelines

Read the [Kubeflow Pipelines upgrade guide](/docs/pipelines/upgrade/) to make 
use of the following capabilities:

* **Upgrade:** You can upgrade your Kubeflow Pipelines deployment to a
  later version without deleting and recreating the cluster.
* **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the storage to retrieve the original data in the new cluster.
