+++
title = "Upgrade Kubeflow"
description = "Upgrading your Kubeflow installation on Google Cloud"
weight = 5
+++

## Before you start

This guide assumes the following settings:

- The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration
  files. For example, `/opt/my-kubeflow/`.

  ```bash
  export KF_DIR=<path to your Kubeflow application directory>
  ```

## General upgrade instructions

Both management cluster and Kubeflow cluster follow the same `instance` and `upstream` folder convention. To upgrade, you'll typically need to update packages in `upstream` to the new version and repeat the `make apply-<subcommand>` commands in their respective deployment process.

However, specific upgrades might need manual actions below.

## Upgrading management cluster

### From Kubeflow v1.1 to v1.2

1. The instructions below assume your current working directory is

    ```bash
    cd ${KF_DIR}/management
    ```

1.  Use your management cluster's kubectl context:

    ```bash
    # Look at all your contexts
    kubectl config get-contexts
    # Select your management cluster's context
    kubectl config use-context ${MGMTCTXT}
    # Verify the context connects to the cluster properly
    kubectl get namespace
    ```

    If you are using a different enviroment, you can always
    reconfigure the context by:

    ```bash
    make create-context
    ```

1.  Check your existing config connector version:
    ```bash
    # For Kubeflow v1.1, it should be 1.15.1
    $ kubectl get namespace cnrm-system -ojsonpath='{.metadata.annotations.cnrm\.cloud\.google\.com\/version}'
    1.15.1
    ```
1.  Uninstall the old config connector in the management cluster:
    ```bash
    kubectl delete sts,deploy,po,svc,roles,clusterroles,clusterrolebindings --all-namespaces -l cnrm.cloud.google.com/system=true --wait=true
    kubectl delete validatingwebhookconfiguration abandon-on-uninstall.cnrm.cloud.google.com --ignore-not-found --wait=true
    kubectl delete validatingwebhookconfiguration validating-webhook.cnrm.cloud.google.com --ignore-not-found --wait=true
    kubectl delete mutatingwebhookconfiguration mutating-webhook.cnrm.cloud.google.com --ignore-not-found --wait=true
    ```
    These commands uninstall the config connector without removing your resources.
1.  Replace your `./Makefile` with the version in Kubeflow `v1.2.0`: https://github.com/kubeflow/gcp-blueprints/blob/v1.2.0/management/Makefile.

    If you made any customizations in `./Makefile`, you should merge your changes with the upstream version. We've refactored the Makefile to move substantial commands into the upstream package, so hopefully future upgrades won't require a manual merge of the Makefile.
1.  Update `./upstream/management` package:
    ```bash
    make update
    ```
1.  Use kpt to set user values:
    ```bash
    kpt cfg set -R . name ${NAME}
    kpt cfg set -R . gcloud.core.project ${PROJECT}
    kpt cfg set -R . location ${LOCATION}
    ```
    Note, you can find out which setters exist and which values were previously set by:
    ```
    kpt cfg list-setters .
    ```
1.  Apply upgraded config connector:
    ```bash
    make apply-kcc
    ```
    Note, you can optionally also run `make apply-cluster`, but it should be the same as your existing management cluster.
1.  Check your config connector upgrade is successful:
    ```bash
    # For Kubeflow 1.2, it should be 1.29.0
    $ kubectl get namespace cnrm-system -ojsonpath='{.metadata.annotations.cnrm\.cloud\.google\.com\/version}'
    1.29.0
    ```
