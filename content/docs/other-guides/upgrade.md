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

1. Update your ksonnet application:

  1. We recommend checking your app into source control to back it up before 
     proceeding.
  1. Use the script 
     [upgrade_ks_app.py](https://github.com/kubeflow/kubeflow/tree/{{< params "githubbranch" >}}/scripts)
     to update your ksonnet app with the current version for the Kubeflow 
     packages.

     Note: ksonnet is working on support for this capability. 
     See https://github.com/ksonnet/ksonnet/issues/237
  
1. Update the actual deployment:

  1. Delete TFJobs v1alpha1 because Kubernetes can't deploy multiple versions of
     a CRD:

        ```
        kubectl delete crd tfjobs.kubeflow.org
        ```

  1. Redeploy Kubeflow:

        ```
        ks apply ${ENVIRONMENT} -c ${COMPONENT}
        ```

## Upgrading or reinstalling Kubeflow Pipelines

Read the [Kubeflow Pipelines upgrade guide](/docs/pipelines/upgrade/) to make 
use of the following capabilities:

* **Upgrade:** You can upgrade your Kubeflow Pipelines deployment to a
  later version without deleting and recreating the cluster.
* **Reinstall:** You can delete a cluster and create a new cluster, specifying
  the storage to retrieve the original data in the new cluster.
