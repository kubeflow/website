+++
title = "Management cluster setup"
description = "Setting up a management cluster on Google Cloud"
weight = 3
+++

This guide describes how to setup a management cluster which you will use to deploy one or more instances of Kubeflow.

The management cluster is used to run [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview). Cloud Config Connector is a Kubernetes addon that allows you to manage Google Cloud resources through Kubernetes.

While the management cluster can be deployed in the same project as your Kubeflow cluster, typically you will want to deploy
it in a separate project used for administering one or more Kubeflow instances, because it will run with escalated permissions to create Google Cloud resources in the managed projects.

Optionally, the cluster can be configured with [Anthos Config Management](https://cloud.google.com/anthos-config-management/docs)
to manage Google Cloud infrastructure using GitOps.

## FAQs

- Where is `kfctl`?

  `kfctl` is no longer being used to apply resources for Google Cloud, because required functionalities are now supported by generic tools including [Make](https://www.gnu.org/software/make/), [Kustomize](https://kustomize.io), [kpt](https://googlecontainertools.github.io/kpt/), and [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview).

- Why do we use an extra management cluster to manage Google Cloud resources?

  The management cluster is very lightweight cluster that runs [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview). Cloud Config Connector makes it easier to configure Google Cloud resources using YAML and Kustomize.

For a more detailed explanation of the drastic changes happened in Kubeflow v1.1 on Google Cloud, read [kubeflow/gcp-blueprints #123](https://github.com/kubeflow/gcp-blueprints/issues/123).

## Install the required tools

1.  Install gcloud components

    ```bash
    gcloud components install kpt anthoscli beta
    gcloud components update
    ```

1.  Install [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/).

    **Note:** Starting from Kubeflow v1.2, we fixed the compatibility problem with Kustomize `v3.2.1+`, so you can now install any Kustomize `v3+`, including the latest Kustomize versions.

    To deploy the latest version of Kustomize on a Linux or Mac machine, run the following commands:

    ```bash
    # Detect your OS and download corresponding latest Kustomize binary
    curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash

    # We need to add the kustomize package to your $PATH env variable
    sudo mv ./kustomize /usr/local/bin/kustomize
    ```

    Then, to verify the installation, run `kustomize version`. You should see `Version:kustomize/vX.Y.Z` in the output if you've successfully deployed Kustomize.

1.  Install [yq](https://github.com/mikefarah/yq#install).

## Setting up a management cluster

This guide assumes the following convention:

- The `${MGMT_DIR}` environment variable contains the path to
  your management directory, which holds your management cluster configuration
  files. For example, `~/kf-deployments/management/`. You can choose any path you would like for the directory `${MGMT_DIR}`.

  You are recommended to check the management directory in source control.

- The `${MGMT_NAME}` environment variable contains the name of your management cluster.

However, the environment variables are used purely for command illustration purpose. No tools will assume they actually exists in your terminal environment.

To deploy a management cluster:

1.  Fetch the management blueprint to current directory

    ```bash
    kpt pkg get https://github.com/kubeflow/gcp-blueprints.git/management@v1.2.0 "${MGMT_DIR}"
    ```

1.  Change to the Kubeflow directory

    ```bash
    cd "${MGMT_DIR}"
    ```

    Note, all the instructions below assume your current working directory is `${MGMT_DIR}`.

1.  Fetch the upstream management package

    ```bash
    make get-pkg
    ```

1.  Use kpt to set values for the name, project, and location of your management cluster:

    ```bash
    kpt cfg set -R . name "${MGMT_NAME}"
    kpt cfg set -R . gcloud.core.project "${PROJECT}"
    kpt cfg set -R . location "${LOCATION}"
    ```

    For the values you need to set for management cluster:

    - MGMT_NAME is the cluster name of your management cluster and prefix for other Google Cloud resources created in the deployment process. Management cluster
      should be a different cluster from your Kubeflow cluster.

      Note, MGMT_NAME should

      - start with a lowercase letter
      - only contain lowercase letters, numbers and `-`
      - end with a number or a letter
      - contain no more than 18 characters

    - LOCATION is the management cluster's location, you can choose between regional or zonal.
    - PROJECT is the Google Cloud project where you will create this management cluster.

    Running `kpt cfg set` stores values you set in `./instance/Kptfile` and
    `./upstream/management/Kptfile`. Commit the changes to source control to
    preserve your configuration.

    We have two packages with setters: `./instance` and `./upstream/management`.
    The `-R` flag means `--recurse-subpackages`. It sets values recursively in all the
    nested subpackages in current directory `.` in one command.

    You can learn more about `kpt cfg set` in [kpt documentation](https://googlecontainertools.github.io/kpt/reference/cfg/set/), or by running `kpt cfg set --help`.

    Note, you can find out which setters exist in a package and what there current values are by:

    ```bash
    kpt cfg list-setters .
    ```

1.  Create or apply the management cluster:

    ```bash
    make apply-cluster
    ```

    Optionally, you can verify the management cluster spec before applying it by:

    ```bash
    make hydrate-cluster
    ```

    and look into `./build/cluster` folder.

1.  Create a kubectl context for the management cluster, it will be named `${MGMT_NAME}`:

    ```bash
    make create-context
    ```

1.  Install the Cloud Config Connector:

    ```bash
    make apply-kcc
    ```

    This step:

    - Installs Config Connector in your cluster; and
    - Creates the Google Cloud service account **${MGMT_NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**.

    Optionally, you can verify the Config Connector installation before applying it by:

    ```bash
    make hydrate-kcc
    ```

    and check `./build/cnrm-install-*` folders.

### Authorize Cloud Config Connector for each managed project

In the last step we created the Google Cloud service account **${MGMT_NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**
this is the service account that Config Connector will use to create any Google Cloud resources. Consequently
you need to grant this Google Cloud service account sufficient privileges to create the desired
resources in one or more projects (called managed projects, read [more](https://github.com/kubeflow/gcp-blueprints/tree/master/management/instance/managed-project)).

The easiest way to do this is to grant the Google Cloud service account owner permissions on one or more projects.

1. Set the managed project:

   ```bash
   kpt cfg set ./instance managed-project "${MANAGED_PROJECT}"
   ```

1. Update the policy:

   ```bash
   gcloud beta anthos apply -f ./instance/managed-project/iam.yaml
   ```

   Optionally, to restrict permissions you want to grant to this service account. You can edit `./instance/managed-project/iam.yaml` and specify more granular roles. Refer to [IAMPolicy Config Connector reference](https://cloud.google.com/config-connector/docs/reference/resource-docs/iam/iampolicy) for exact fields you can set.

## Understanding the deployment process

This section gives you more details about the configuration and
deployment process, so that you can customize your management cluster if necessary.

### Management cluster folder layout

Your management cluster directory contains the following files and directories:

- **Makefile** is a file that defines rules to automate deployment process. You can refer to [GNU make documentation](https://www.gnu.org/software/make/manual/make.html#Introduction) for more introduction. The Makefile we provide is designed to be user maintainable. You are encouraged to read, edit and maintain it to suit your own deployment customization needs.

- **upstream** is a directory containing kustomize packages for deploying your management cluster

  - This directory contains the upstream configurations on which your deployment is based on.

- **instance** is a directory that defines user overlays that are applied to the upstream
  configurations in order to customize management cluster for your use case.

  - **cluster** is a kustomize package defining all the Google Cloud resources needed using [gcloud beta anthos apply](https://cloud.google.com/sdk/gcloud/reference/beta/anthos/apply). It can apply some Google Cloud resource types using the same resource definition for Config Connector.

      - You can edit this kustomize package in order to customize the Google Cloud resources for
      your purposes

  - **cnrm-install-\*** folders contain kustomize packages for Google Cloud services, iam policies and Kubernetes resources to install Config Connector following [Advanced installation options for Config Connector](https://cloud.google.com/config-connector/docs/how-to/advanced-install).

- **build** is a directory that will contain the hydrated manifests outputted by
  the `make` rules

## Layout rationale

We explicitly separate **upstream** and **instance** folders, so that in most upgrades, you should be able to just re-fetch **upstream** folder and get all the upgrades without needing to change your customizations in **instance** folder.

## Customizing the installation

Once you understand the folder layout, it's clearer that to declaratively customize any resources declared in `./upstream` folder,
you can edit [Kustomize](https://kustomize.io/) overlays in `./instance` folder.

The following tips help you customize, verify and re-apply them to your cluster.

Some useful links for Kustomize:

- [patchesStrategicMerge](https://kubectl.docs.kubernetes.io/references/kustomize/patchesstrategicmerge/) let you patch any fields of an existing resource using a partial resource definition.
- Reference for all Kustomize features: https://kubectl.docs.kubernetes.io/references/kustomize/.

To get detailed reference for Google Cloud resources, refer to
[Config Connector resources reference](https://cloud.google.com/config-connector/docs/reference/overview).

To verify whether hydrated resources match your expectation:

```bash
make hydrate-cluster
# or
make hydrate-kcc
```

and refer to hydrated resources in `./build/*`.

To apply your customizations:

```bash
make apply-cluster
# or
make apply-kcc
```

Note that, some fields in some resources may be immutable. You may need to
manually delete them before applying again.
