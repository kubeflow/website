+++
title = "Upgrade Kubeflow"
description = "Upgrading your Kubeflow installation on Google Cloud"
weight = 6

+++

## Before you start

To better understand upgrade process, you should read the following sections first:

* [Understanding the deployment process for management cluster](/docs/distributions/gke/deploy/management-setup#understanding-the-deployment-process)
* [Understanding the deployment process for Kubeflow cluster](/docs/distributions/gke/deploy/deploy-cli#understanding-the-deployment-process)

This guide assumes the following settings:

* The `${MGMT_DIR}` and `${MGMT_NAME}` environment variables
  are the same as in [Management cluster setup](/docs/distributions/gke/deploy/management-setup#configure-environment-variables).
* The `${KF_NAME}`, `${CLIENT_ID}` and `${CLIENT_SECRET}` environment variables
  are the same as in [Deploy using kubectl and kpt](/docs/distributions/gke/deploy/deploy-cli#environment-variables).
* The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration 
  files. For example, `/opt/gcp-blueprints/kubeflow/`.

## General upgrade instructions

Starting from Kubeflow v1.3, we have reworked on the structure of `kubeflow/gcp-blueprints` repository. All resources are located in `gcp-blueprints/management` directory. Upgrade to Management cluster v1.3 is not supported.

Before Kubeflow v1.3, both management cluster and Kubeflow cluster follow the same `instance` and `upstream` folder convention. To upgrade, you'll typically need to update packages in `upstream` to the new version and repeat the `make apply-<subcommand>` commands in their respective deployment process.

However, specific upgrades might need manual actions below.

## Upgrading management cluster

### General instruction for upgrading management cluster

It is strongly recommended to use source control to keep a copy of your working repository for recording changes at each step.

Due to the refactoring of `kubeflow/manifests` repository, the way we depend on `kubeflow/gcp-blueprints` has changed drastically. This section suits for upgrading from Kubeflow 1.3 to higher.


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

   If you are using a different environment, you can always
   reconfigure the context by:

   ```bash
   make create-context
   ```

1. Check your existing config connector version:

   ```bash
   # For Kubeflow v1.3, it should be 1.46.0
   $ kubectl get namespace cnrm-system -ojsonpath='{.metadata.annotations.cnrm\.cloud\.google\.com\/version}'
   1.46.0
   ```
   
1. Merge the content from new Kubeflow version of `kubeflow/gcp-blueprints`

   ```bash
   WORKING_BRANCH=<your-github-working-branch>
   VERSION_TAG=<targeted-kubeflow-version-tag-on-github>
   git checkout -b "${WORKING_BRANCH}"
   git remote add upstream https://github.com/kubeflow/gcp-blueprints.git # This is one time only.
   git fetch upstream 
   git merge "${VERSION_TAG}"
   ```

1. Make sure your build directory (`./build` by default) is checked in to source control (git).

1. Run the following command to hydrate Config Connector resources:

   ```bash
   make hydrate-kcc
   ```

1. Compare the difference on your source control tracking after making hydration change. If they are addition or modification only, proceed to next step. If it includes deletion, you need to use `kubectl delete` to manually clean up the deleted resource for cleanup.

1. After confirmation, run the following command to apply new changes:

   ```bash
   make apply-kcc
   ```

1. Check version has been upgraded after applying new Config Connector resource:

   ```bash
   $ kubectl get namespace cnrm-system -ojsonpath='{.metadata.annotations.cnrm\.cloud\.google\.com\/version}'
   ```

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

   If you are using a different environment, you can always
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
   kpt cfg set -R . name ${MGMT_NAME}
   kpt cfg set -R . gcloud.core.project ${MGMT_PROJECT}
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

{{% alert title="DISCLAIMERS" color="warning" %}}
<div>The upgrade process depends on each Kubeflow application to handle the upgrade properly. There's no guarantee on data completeness unless the application provides such a guarantee.</div>
<div>You are recommended to back up your data before an upgrade.</div>
<div>Upgrading Kubeflow cluster can be a disruptive process, please schedule some downtime and communicate with your users.</div>
{{% /alert %}}


To upgrade from specific versions of Kubeflow, you may need to take certain manual actions — refer to specific sections in the guidelines below.

### General instructions for upgrading Kubeflow cluster

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

1. Merge the new version of `kubeflow/gcp-blueprints` (example: v1.3.1), you don't need to do it again if you have already done so during management cluster upgrade.

   ```bash
   WORKING_BRANCH=<your-github-working-branch>
   VERSION_TAG=<targeted-kubeflow-version-tag-on-github>
   git checkout -b "${WORKING_BRANCH}"
   git remote add upstream https://github.com/kubeflow/gcp-blueprints.git # This is one time only.
   git fetch upstream 
   git merge "${VERSION_TAG}"
   ```

1. Change the `KUBEFLOW_MANIFESTS_VERSION` in `./pull-upstream.sh` with the targeted kubeflow version same as `$VERSION_TAG`. Run the following commands to pull new changes from upstream `kubeflow/manifests`.

   ```bash
   bash ./pull-upstream.sh
   ```

1. (Optional) If you only want to upgrade some of Kubeflow components, you can comment non-upgrade components in `kubeflow/config.yaml` file. Commands below will only apply the remaining components.

1. Make sure you have checked in `build` folders for each component. The following command will change them so you can compare for difference.

    ```bash
    make hydrate
    ```

1. Once you confirm the changes are ready to apply, run the following command to upgrade Kubeflow cluster:

    ```bash
    make apply
    ```

{{% alert title="Note" %}}
Kubeflow on Google Cloud doesn't guarantee the upgrade for each Kubeflow component always works with the general upgrade guide here. Please refer to corresponding repository in [Kubeflow org](https://github.com/kubeflow) for upgrade support.
{{% /alert %}}

### Upgrade Kubeflow cluster to v1.3

Due to the refactoring of `kubeflow/manifests` repository, the way we depend on `kubeflow/gcp-blueprints` has changed drastically. Upgrade to Kubeflow cluster v1.3 is not supported. And individual component upgrade has been deferred to its corresponding repository for support.

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


## Upgrade ASM (Anthos Service Mesh)

If you want to upgrade ASM instead of the Kubeflow components, refer to [kubeflow/common/asm/Makefile](https://github.com/kubeflow/gcp-blueprints/blob/master/kubeflow/common/asm/Makefile) for the latest instruction on upgrading ASM. Detailed explanation is also listed below. Note: If you are going to upgrade minor version or major version of ASM, it is best to read [official ASM upgrade documentation](https://cloud.google.com/service-mesh/docs/upgrade-path-old-versions-gke) first, before performing the steps below. Patch version upgrade can refer to steps below directly.

### Install new ASM workload

In order to use the new ASM version, we need to download new ASM configuration package and `install_asm` script. Identify the target ASM package and script by listing the stable versions of such combination:

```bash
curl https://storage.googleapis.com/csm-artifacts/asm/STABLE_VERSIONS
```

You will see output similar to

```
...
1.9.3-asm.2+config2:install_asm_1.9.3-asm.2-config2
1.9.3-asm.2+config2:asm_vm_1.9.3-asm.2-config2
1.9.3-asm.2+config1:install_asm_1.9.3-asm.2-config1
1.9.3-asm.2+config1:asm_vm_1.9.3-asm.2-config1
1.9.2-asm.1+config4:install_asm_1.9.2-asm.1-config4
1.9.2-asm.1+config4:asm_vm_1.9.2-asm.1-config4
...
```

Taking the first line as example, you can split this line by `:`, use the first half for ASM configuration package version, and the second half for `install_asm` script version. Therefore, assigning these two values to `${ASM_PACKAGE_VERSION}` and `${INSTALL_ASM_SCRIPT_VERSION}` in [kubeflow/asm/Makefile](https://github.com/kubeflow/gcp-blueprints/blob/master/kubeflow/asm/Makefile) like below:

```
ASM_PACKAGE_VERSION=1.9.3-asm.2+config2
INSTALL_ASM_SCRIPT_VERSION=install_asm_1.9.3-asm.2-config2
```

Then run following command under path `kubeflow/asm` to install new ASM, the old ASM will not be uninstalled:

```bash
make apply
```

Once installed successfully, you can see istiod `Deployment` in your cluster with name in pattern `istiod-asm-VERSION-REVISION`, for example: `istiod-asm-193-2`.


### Upgrade other Kubeflow components to use new ASM

There are multiple Kubeflow components with ASM namespace label, including user created namespaces. To upgrade them at once, change the following line in `kubeflow/env.sh` with targeted ASM version `asm-VERSION-REVISION`, like `asm-193-2`. 

```
export ASM_LABEL=asm-193-2
```

Then run following commands under `kubeflow/` path to configure environment variables:

```bash
source env.sh
```

Run the following command to configure kpt setter:
```bash
bash kpt-set.sh
```

Examine the change using source control after running the following command:

```bash
make hydrate
```

Refer to [Deploying and redeploying workloads](https://cloud.google.com/service-mesh/docs/scripted-install/gke-upgrade#deploying_and_redeploying_workloads) for the complete steps to adopt new ASM version. As part of the above instruction, you can run following command to update namespaces' labels across the cluster:

```bash
make apply
```


### (Optional) Uninstall old ASM workload 

Once you validated that new ASM installation and sidecar-injection for Kubeflow components are working as expected. You can follow the `Complete the transition` at 
[Deploying and redeploying workloads](https://cloud.google.com/service-mesh/docs/scripted-install/gke-upgrade#deploying_and_redeploying_workloads) to remove the old ASM deployments. 
