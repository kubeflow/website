+++
title = "Upgrade Kubeflow"
description = "Upgrading your Kubeflow installation on Google Cloud"
weight = 5
+++

## Before you start

To better understand upgrade process, you should read the following sections first:

* [Understanding the deployment process for management cluster](../management-setup#understanding-the-deployment-process)
* [Understanding the deployment process for Kubeflow cluster](../deploy-cli#understanding-the-deployment-process)

This guide assumes the following settings:

* The `${MGMT_DIR}` and `${MGMT_NAME}` environment variables
  are the same as in [Management cluster setup](../management-setup#environment-variables).
* The `${KF_DIR}` and `${KF_NAME}` environment variables
  are the same as in [Deploy using kubectl and kpt](../deploy-cli#environment-variables).

## General upgrade instructions

Both management cluster and Kubeflow cluster follow the same `instance` and `upstream` folder convention. To upgrade, you'll typically need to update packages in `upstream` to the new version and repeat the `make apply-<subcommand>` commands in their respective deployment process.

However, specific upgrades might need manual actions below.

## Upgrading management cluster

### Upgrade management cluster from v1.1 to v1.2

1. The instructions below assume that your current working directory is

   ```bash
   cd "${MGMT_DIR}"
   ```

1. Use your management cluster's kubectl context:

   ```bash
   # Look at all your contexts
   kubectl config get-contexts
   # Select your management cluster's context
   kubectl config use-context "${MGMT_NAME}"
   # Verify the context connects to the cluster properly
   kubectl get namespace
   ```

   If you are using a different enviroment, you can always
   reconfigure the context by:

   ```bash
   make create-context
   ```

1. Check your existing config connector version:

   ```bash
   # For Kubeflow v1.1, it should be 1.15.1
   $ kubectl get namespace cnrm-system -ojsonpath='{.metadata.annotations.cnrm\.cloud\.google\.com\/version}'
   1.15.1
   ```

1. Uninstall the old config connector in the management cluster:

   ```bash
   kubectl delete sts,deploy,po,svc,roles,clusterroles,clusterrolebindings --all-namespaces -l cnrm.cloud.google.com/system=true --wait=true
   kubectl delete validatingwebhookconfiguration abandon-on-uninstall.cnrm.cloud.google.com --ignore-not-found --wait=true
   kubectl delete validatingwebhookconfiguration validating-webhook.cnrm.cloud.google.com --ignore-not-found --wait=true
   kubectl delete mutatingwebhookconfiguration mutating-webhook.cnrm.cloud.google.com --ignore-not-found --wait=true
   ```

   These commands uninstall the config connector without removing your resources.

1. Replace your `./Makefile` with the version in Kubeflow `v1.2.0`: <https://github.com/kubeflow/gcp-blueprints/blob/v1.2.0/management/Makefile>.

   If you made any customizations in `./Makefile`, you should merge your changes with the upstream version. We've refactored the Makefile to move substantial commands into the upstream package, so hopefully future upgrades won't require a manual merge of the Makefile.

1. Update `./upstream/management` package:

   ```bash
   make update
   ```

1. Use kpt to set user values:

   ```bash
   kpt cfg set -R . name ${NAME}
   kpt cfg set -R . gcloud.core.project ${PROJECT}
   kpt cfg set -R . location ${LOCATION}
   ```

   Note, you can find out which setters exist in a package and what there current values are by:

   ```bash
   kpt cfg list-setters .
   ```

1. Apply upgraded config connector:

   ```bash
   make apply-kcc
   ```

   Note, you can optionally also run `make apply-cluster`, but it should be the same as your existing management cluster.

1. Check that your config connector upgrade is successful:

   ```bash
   # For Kubeflow v1.2, it should be 1.29.0
   $ kubectl get namespace cnrm-system -ojsonpath='{.metadata.annotations.cnrm\.cloud\.google\.com\/version}'
   1.29.0
   ```

## Upgrading Kubeflow cluster

**DISCLAIMERS**:

* The upgrade process depends on each Kubeflow application to handle the upgrade properly. There's no guarantee on data completeness unless the application provides such a guarantee.
* You are recommended to back up your data before an upgrade.
* Upgrading Kubeflow cluster can be a disruptive process, please schedule some downtime and communicate with your users.

To upgrade from specific versions of Kubeflow, you may need to take certain manual actions — refer to specific sections in the guidelines below.

General instructions for upgrading Kubeflow:

1. The instructions below assume that:

    * Your current working directory is:

      ```bash
      cd ${KF_DIR}
      ```

    * Your kubectl uses a context that connects to your Kubeflow cluster

      ```bash
      # List your existing contexts
      kubectl config get-contexts
      # Use the context that connects to your Kubeflow cluster
      kubectl config use-context ${KF_NAME}
      ```

1. Edit the Makefile at `./Makefile` and change `MANIFESTS_URL` to point at the version of Kubeflow manifests you want to use

    * Refer to the [kpt docs](https://googlecontainertools.github.io/kpt/reference/pkg/) for more info about supported dependencies

1. Update the local copies:

    ```bash
    make update
    ```

1. Redeploy:

    ```bash
    make apply
    ```

    To evaluate the changes before deploying them you can run `make hydrate` and then compare the contents
    of `.build` to what is currently deployed.

### Upgrade Kubeflow cluster from v1.1 to v1.2

1. The instructions below assume

    * Your current working directory is:

      ```bash
      cd ${KF_DIR}
      ```

    * Your kubectl uses a context that connects to your Kubeflow cluster:

      ```bash
      # List your existing contexts
      kubectl config get-contexts
      # Use the context that connects to your Kubeflow cluster
      kubectl config use-context ${KF_NAME}
      ```

1. (Recommended) Replace your `./Makefile` with the version in Kubeflow `v1.2.0`: <https://github.com/kubeflow/gcp-blueprints/blob/v1.2.0/kubeflow/Makefile>.

    If you made any customizations in `./Makefile`, you should merge your changes with the upstream version.

    This step is recommended, because we introduced usability improvements and fixed compatibility for newer Kustomize versions (while still being compatible with Kustomize v3.2.1) to the Makefile. However, the deployment process is backward-compatible, so this is recommended, but not required.

1. Update `./upstream/manifests` package:

    ```bash
    make update
    ```

1. Before applying new resources, you need to delete some immutable resources that were updated in this release:

    ```bash
    kubectl delete statefulset kfserving-controller-manager -n kubeflow --wait
    kubectl delete crds experiments.kubeflow.org suggestions.kubeflow.org trials.kubeflow.org
    ```

    **WARNING**: This step **deletes** all Katib running resources.

    Refer to [a github comment in the v1.2 release issue](https://github.com/kubeflow/kubeflow/issues/5371#issuecomment-731359384) for more details.

1. Redeploy:

    ```bash
    make apply
    ```

    To evaluate the changes before deploying them you can:

    1. Run `make hydrate`.
    1. Compare the contents
    of `.build` with a historic version with tools like `git diff`.
