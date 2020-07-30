+++
title = "Upgrading a Kubeflow Deployment"
description = "Upgrading your deployment to a later version of Kubeflow"
weight = 30
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

## Upgrading from Kubeflow v0.7.0 or later

{{% alpha-status 
  feedbacklink="https://github.com/kubeflow/kubeflow/issues" %}}

Upgrading your Kubeflow deployment is supported if your deployment is v0.7.0 or later.

### Prerequisites

* Download the latest kfctl binary from the
  [Kubeflow releases page](https://github.com/kubeflow/kfctl/releases/tag/{{% kf-latest-version %}}).

* Ensure that your Kubeflow namespace is annotated with the
  `control-plane: kubeflow` label. You can verify this by doing:
  ```
  kubectl get namespace $NAMESPACE -o yaml
  ```

    You should see something like:
    ```
    metadata:
      labels:
        control-plane: kubeflow
    ```

    If the label is not present, you can patch the namespace by doing
    ```
    kubectl label namespace $NAMESPACE control-plane=kubeflow
    ```

* You must have a local Kubeflow application directory matching your current
deployment. We'll call this `${KF_DIR}`.
    * This should be present if you deployed Kubeflow using the kfctl tool.
    * If you deployed Kubeflow using some other method (e.g. the 
      [Deployment UI](/docs/gke/deploy/deploy-ui/)),
      you will need to first create a local deployment directory:
      1. Follow the instructions for [environment preparations](/docs/gke/deploy/deploy-cli/#prepare-your-environment).
          * Make sure that the `${PROJECT}`, `${ZONE}`, and `${KF_NAME}`
            variables match exactly with your deployment.
          * For `${CONFIG_URI}`, use the appropriate [YAML configuration 
            file](/docs/started/getting-started/#configuration-quick-reference).
      1. Create your local deployment files:
          ```
          mkdir -p ${KF_DIR}
          cd ${KF_DIR}
          kfctl build -V -f ${CONFIG_URI}
          ```


### Upgrade instructions

Prepare your upgrade specification:

1. Create an upgrade specification in the *parent directory* of your `${KF_DIR}`
  directory. Base your upgrade specification on one of the
  specifications supplied in the
  [kubeflow/manifests repository](https://github.com/kubeflow/manifests).
  For example, to upgrade a v0.7.0 deployment to v0.7.1 on GCP, use
  the [`kfctl_upgrade_gcp_iap_0.7.1.yaml` 
  specification](https://github.com/kubeflow/manifests/blob/v0.7-branch/kfdef/kfctl_upgrade_gcp_iap_0.7.1.yaml).
  Your directory structure should look like this:
    ```
    your-parent-directory
    |----${KF_DIR}
    |----<your-upgrade-specification.yaml>
    ```

1. For convenience, set the environment variable `${UPGRADE_SPEC}` to the name
  of your upgrade specification:
    ```
    export UPGRADE_SPEC=<your-upgrade-specification.yaml>
    ```

1. Modify the contents of the upgrade specification to suit your deployment:
    ```
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
  
If you don't need to change any kustomize parameter values in your configuration, run the `apply`
command now to upgrade your deployment:

```
kfctl apply -f ${UPGRADE_SPEC} -V
```

Alternatively you can follow these steps to change the configuration before applying the upgrade:

1. Run a `build` command:
    ```
    kfctl build -f ${UPGRADE_SPEC} -V
    ```
    The above command creates a new Kubeflow application under the same parent 
    directory as your `${KF_DIR}`. The new Kubeflow application has a name
    in the form of a 7-character long hash value. The directory structure should 
    look like this, where `${UPGRADE_DIR}` indicates the new Kubeflow
    application:
    ```
    your-parent-directory
    |----${KF_DIR}
    |----${UPGRADE_DIR}
    |----<your-upgrade-specification.yaml>
    ```
    You can examine and change the kustomize parameter values in the
    `${UPGRADE_DIR}` directory.

1. Run the `apply` command to upgrade the deployment:
    ```
    kfctl apply -f ${UPGRADE_SPEC} -V
    ```


## Upgrades from earlier versions of Kubeflow

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
  page](https://github.com/kubeflow/kfctl/releases/tag/{{% kf-latest-version %}}).

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
    `${KF_DIR}/{{% config-file-k8s-istio %}}` or `${KF_DIR}/kfctl_istio_dex.yaml`
  
1. Re-apply any customizations that you need.

1. Update the deployment:

     ```
     kfctl apply -V -f ${CONFIG_FILE}
     ```

## Upgrading Kubeflow Pipelines

See the [Kubeflow Pipelines upgrade guide](/docs/pipelines/upgrade/).
