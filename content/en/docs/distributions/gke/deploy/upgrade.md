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
  files. For example, `/opt/kubeflow-distribution/kubeflow/`.

## General upgrade instructions

Starting from Kubeflow v1.5, we have integrated with [Config Controller](https://cloud.google.com/anthos-config-management/docs/concepts/config-controller-overview). You don't need to manually upgrade Management cluster any more, since it managed by [Upgrade Config Controller](https://cloud.google.com/anthos-config-management/docs/how-to/config-controller-setup#upgrade).

Starting from Kubeflow v1.3, we have reworked on the structure of `GoogleCloudPlatform/kubeflow-distribution` repository. All resources are located in `kubeflow-distribution/management` directory. Upgrade to Management cluster v1.3 is not supported.

Before Kubeflow v1.3, both management cluster and Kubeflow cluster follow the same `instance` and `upstream` folder convention. To upgrade, you'll typically need to update packages in `upstream` to the new version and repeat the `make apply-<subcommand>` commands in their respective deployment process.

However, specific upgrades might need manual actions below.

## Upgrading management cluster

### Upgrading management cluster before 1.5

It is strongly recommended to use source control to keep a copy of your working repository for recording changes at each step.

Due to the refactoring of `kubeflow/manifests` repository, the way we depend on `GoogleCloudPlatform/kubeflow-distribution` has changed drastically. This section suits for upgrading from Kubeflow 1.3 to higher.


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
   
1. Merge the content from new Kubeflow version of `GoogleCloudPlatform/kubeflow-distribution`

   ```bash
   WORKING_BRANCH=<your-github-working-branch>
   VERSION_TAG=<targeted-kubeflow-version-tag-on-github>
   git checkout -b "${WORKING_BRANCH}"
   git remote add upstream https://github.com/GoogleCloudPlatform/kubeflow-distribution.git # This is one time only.
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

1. Replace your `./Makefile` with the version in Kubeflow `v1.2.0`: <https://github.com/GoogleCloudPlatform/kubeflow-distribution/blob/v1.2.0/management/Makefile>.

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

1. Merge the new version of `GoogleCloudPlatform/kubeflow-distribution` (example: v1.3.1), you don't need to do it again if you have already done so during management cluster upgrade.

   ```bash
   WORKING_BRANCH=<your-github-working-branch>
   VERSION_TAG=<targeted-kubeflow-version-tag-on-github>
   git checkout -b "${WORKING_BRANCH}"
   git remote add upstream https://github.com/GoogleCloudPlatform/kubeflow-distribution.git # This is one time only.
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

### Upgrade Kubeflow cluster to v1.6

Starting from Kubeflow v1.6.0:
* Component with deprecated API versions were upgraded to support GKE v1.22. If you would like to upgrade your GKE cluster, follow [GCP instructions](https://cloud.google.com/kubernetes-engine/docs/how-to/upgrading-a-cluster).
* ASM was upgraded to v1.14. Follow the instructions on how to [upgrade ASM (Anthos Service Mesh)](#upgrade-asm-anthos-service-mesh). If you want to use ASM version prior to 1.11, refer to [the legacy instructions](https://github.com/GoogleCloudPlatform/kubeflow-distribution/blob/master/kubeflow/common/asm/deprecated/README.md). 
* Knative was upgraded to v1.2. Follow [Knative instructions](https://knative.dev/docs/install/upgrade/upgrade-installation/) to check current version and see if the update includes any breaking changes.
* Cert-manager was upgraded to v1.5. To check your current version and see if the update includes any breaking changes, follow the [cert-manager instructions](https://cert-manager.io/docs/installation/upgrading/). 
* Deprecated kfserving component was removed. To upgrade to KServe, follow the [KServe Migration guide](https://github.com/kserve/kserve/tree/master/hack/kserve_migration).

### Upgrade Kubeflow cluster to v1.5

In Kubeflow v1.5.1 we use ASM v1.13. See [how to upgrade ASM](#upgrade-asm-anthos-service-mesh). To use ASM versions prior to 1.11, follow [the legacy instructions](https://github.com/GoogleCloudPlatform/kubeflow-distribution/blob/master/kubeflow/common/asm/deprecated/README.md).

Starting from Kubeflow v1.5, Kubeflow manifests have included KServe as an independent component from kfserving, Google Cloud distribution has switched over from kfserving to KServe for default installed components. If you want to upgrade Kubeflow while keeping kfsering, you can comment KServe and uncomment kfserving in `kubeflow-distribution/kubeflow/config.yaml` file. If you want to upgrade to KServe, follow the [KServe Migration guide](https://github.com/kserve/kserve/tree/master/hack/kserve_migration).

### Upgrade Kubeflow cluster to v1.3

Due to the refactoring of `kubeflow/manifests` repository, the way we depend on `GoogleCloudPlatform/kubeflow-distribution` has changed drastically. Upgrade to Kubeflow cluster v1.3 is not supported. And individual component upgrade has been deferred to its corresponding repository for support.

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

1. (Recommended) Replace your `./Makefile` with the version in Kubeflow `v1.2.0`: <https://github.com/GoogleCloudPlatform/kubeflow-distribution/blob/v1.2.0/kubeflow/Makefile>.

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

If you want to upgrade ASM instead of the Kubeflow components, refer to [kubeflow/common/asm/README.md](https://github.com/GoogleCloudPlatform/kubeflow-distribution/blob/master/kubeflow/common/asm/README.md) for the latest instructions on upgrading ASM. Detailed explanation is listed below. Note: if you are going to upgrade major or minor version of ASM, it is recommended to read [the official ASM upgrade documentation](https://cloud.google.com/service-mesh/docs/upgrade-path-old-versions-gke) before proceeding with the steps below.

### Install a new ASM workload

In order to use the new ASM version, we need to download the corresponding ASM configuration package and `asmcli` script. Get a list of available ASM packages and the corresponding `asmcli` scripts by running the following command:

```bash
curl https://storage.googleapis.com/csm-artifacts/asm/ASMCLI_VERSIONS
```

It should return a list of ASM versions that can be installed with asmcli script. To install older versions, refer to [the legacy instructions](https://github.com/GoogleCloudPlatform/kubeflow-distribution/blob/master/kubeflow/common/asm/deprecated/README.md). The returned list will have a format of `${ASM_PACKAGE_VERSION}:${ASMCLI_SCRIPT_VERSION}`. For example, in the following output:

```
...
1.13.2-asm.5+config2:asmcli_1.13.2-asm.5-config2
1.13.2-asm.5+config1:asmcli_1.13.2-asm.5-config1
1.13.2-asm.2+config2:asmcli_1.13.2-asm.2-config2
1.13.2-asm.2+config1:asmcli_1.13.2-asm.2-config1
1.13.1-asm.1+config1:asmcli_1.13.1-asm.1-config1
...
```
record 1.13.2-asm.5+config2:asmcli_1.13.2-asm.5-config2 corresponds to:

```bash
ASM_PACKAGE_VERSION=1.13.2-asm.5+config2
ASMCLI_SCRIPT_VERSION=asmcli_1.13.2-asm.5-config2
```

You need to set these two values in [kubeflow/asm/Makefile](https://github.com/GoogleCloudPlatform/kubeflow-distribution/blob/master/kubeflow/asm/Makefile). Then, run the following command in `kubeflow/asm` directory to install the new ASM. Note, the old ASM will not be uninstalled.

```bash
make apply
```

Once installed successfully, you can see istiod `Deployment` in your cluster with name in pattern `istiod-asm-VERSION-REVISION`. For example, `istiod-asm-1132-5` would correspond to ASM version 1.13.2-asm.5.


### Upgrade other Kubeflow components to use new ASM

There are multiple Kubeflow components with ASM namespace label, including user created namespaces. To upgrade them at once, change the following line in `kubeflow/env.sh` with the new ASM version `asm-VERSION-REVISION`, like `asm-1132-5`. 

```bash
export ASM_LABEL=asm-1132-5
```

Then run the following commands in `kubeflow/` directory to configure the environmental variables:

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

Refer to [Deploying and redeploying workloads](https://cloud.google.com/service-mesh/docs/unified-install/upgrade#deploying_and_redeploying_workloads) for the complete steps to adopt the new ASM version. As part of the instructions, you can run the following command to update namespaces' labels across the cluster:

```bash
make apply
```


### (Optional) Uninstall the old ASM workload 

Once you validated that new ASM installation and sidecar-injection for Kubeflow components are working as expected. You can **Complete the transition** to the new ASM or **Rollback** to the old ASM as instructed in [Deploy and Redeploy workloads](https://cloud.google.com/service-mesh/docs/unified-install/upgrade#deploying_and_redeploying_workloads).
