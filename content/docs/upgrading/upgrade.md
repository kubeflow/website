+++
title = "Upgrading a Kubeflow Deployment"
description = "Upgrading your deployment to a later version of Kubeflow"
weight = 30
+++

Upgrading your Kubeflow deployment is supported if your deployment is v0.7.0 or later.

Prerequisites:

* Download the latest kfctl binary from the
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

* Ensure that your kubeflow namespace is annotated with the following label:
```
  labels:
    control-plane: kubeflow
```
* You must have a local Kubeflow application directory matching your current
   deployment.

Upgrade instructions:

1. Create an upgrade spec in the parent directory of the Kubeflow application. An example is provided
[here](https://github.com/kubeflow/manifests/blob/v0.7-branch/kfdef/kfctl_upgrade_gcp_iap_0.7.1.yaml).

```yaml
apiVersion: kfupgrade.apps.kubeflow.org/v1alpha1
kind: KfUpgrade
metadata:
  name: kf-upgrade-v0.7.1
spec:
  currentKfDef:
    # Replace with the name of your Kubeflow app
    name: kubeflow-app
    version: v0.7.0
  newKfDef:
    # Replace with the name of your kubeflow app
    name: kubeflow-app
    version: v0.7.1
  # Replace this with the path to the KfDef that you are upgrading to
  baseConfigPath: https://raw.githubusercontent.com/kubeflow/manifests/v0.7-branch/kfdef/kfctl_gcp_iap.0.7.1.yaml
```
1. Run the upgrade command:

```
kfctl apply -f ${UPGRADE_SPEC} -V
```

1. Alternatively you can run a build command first:
```
kfctl build -f ${UPGRADE_SPEC} -V
```
This will create a new Kubeflow application in the same directory (the name
should be a 7-character long hash value). You can examine and change the
kustomize parameter values.

1. Then apply the update:
```
kfctl apply -f ${UPGRADE_SPEC} -V
```


### Upgrades from Earlier Versions of Kubeflow

For earlier versions, Kubeflow makes no promises of backwards compatibility or 
upgradeability. Nonetheless, here are some instructions for updating your deployment:

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
