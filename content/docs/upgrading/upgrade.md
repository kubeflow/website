+++
title = "Upgrading a Kubeflow Deployment"
description = "Upgrading your deployment to a later version of Kubeflow"
weight = 30
+++

## Upgrading from Kubeflow v0.7.0 or later
Upgrading your Kubeflow deployment is supported if your deployment is v0.7.0 or later.

### Prerequisites

* Download the latest kfctl binary from the
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

* Ensure that your Kubeflow namespace is annotated with the
  `control-plane: kubeflow` label. You can verify this by doing:
  ```
  kubectl get namespace $NAMESPACE -o yaml > ns.yaml
  ```

    Examine the contents of the file. You should see something like:
    ```yaml
    metadata:
      labels:
        control-plane: kubeflow
        katib-metricscollector-injection: enabled
    ```

    If the label is not present, you can manually add it to the file, then do
    ```
    kubectl apply -f ns.yaml
    ```
    to update the existing namespace.

* You must have a local Kubeflow application directory matching your current
deployment. We'll call this `${KF_DIR}`.
    * This should be present if you deployed Kubeflow using the kfctl tool.
    * If you deployed Kubeflow using some other method (e.g. the 
      [Deployment UI](/docs/gke/deploy/deploy-ui/)),
      you will need to first create a local deployment directory.


### Upgrade instructions

1. Create an upgrade specification in the parent directory of your `${KF_DIR}`. For example, to upgrade
a v0.7.0 deployment to v0.7.1, use
[this specification](https://github.com/kubeflow/manifests/blob/v0.7-branch/kfdef/kfctl_upgrade_gcp_iap_0.7.1.yaml).
Your directory structure should look like:
    ```
    ${PARENT_DIR}
    |----${KF_DIR}
    |----kfctl_upgrade_spec.yaml

    ```

1. Modify the configuration for your deployment:
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


1. Run the `apply` command to upgrade your deployment:

    ```
    kfctl apply -f ${UPGRADE_SPEC} -V
    ```

    1. Alternatively you can run a build command first:
        ```
        kfctl build -f ${UPGRADE_SPEC} -V
        ```
        This command will create a new Kubeflow application in the same directory, with a name
        in the form of a 7-character long hash value. The directory structure should look like:
        ```
        ${PARENT_DIR}
        |----${KF_DIR}
        |----${UPGRADE_DIR}
        |----kfctl_upgrade_spec.yaml

        ```
        You can examine and change the kustomize parameter values in
        `${UPGRADE_DIR}`.

    1. Then run the `apply` command:
        ```
        kfctl apply -f ${UPGRADE_SPEC} -V
        ```

### Upgrades from earlier versions of Kubeflow

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
