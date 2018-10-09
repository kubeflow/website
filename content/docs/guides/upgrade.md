+++
title = "Upgrading Kubeflow Deployments"
description = "Upgrading Kubeflow"
weight = 10
toc = true
[menu.docs]
  parent = "guides"
  weight = 30
+++

Until 1.0 Kubeflow makes no promises of backwards compatibility or upgradeability. Nonetheless, here are some
instructions for updating your deployments.

Updating your deployments is a two step process

1. Updating your ksonnet application

  1. We recommend checking your app into source control to back it up before proceeding
  1. Use the script (upgrade_ks_app.py)[https://github.com/kubeflow/kubeflow/tree/{{< params "githubbranch" >}}/scripts)
     to update your ksonnet app with the current version for the Kubeflow packages
  1. Note: ksonnet is working on support for this see https://github.com/ksonnet/ksonnet/issues/237
  
1. Updating the actual deployment

  1. Delete TFJobs v1alpha1 because K8s can't deploy multiple versions of a CRD

     ```
     kubectl delete crd tfjobs.kubeflow.org
     ```

  1. Redeploy kubeflow

     ```
     ks apply ${ENVIRONMENT} -c ${COMPONENT}
     ```


