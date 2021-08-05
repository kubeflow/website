+++
title = "Deploy Management cluster"
description = "Setting up a management cluster on Google Cloud"
weight = 4
+++

This guide describes how to setup a management cluster which you will use to deploy one or more instances of Kubeflow.

The management cluster is used to run [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview). Cloud Config Connector is a Kubernetes addon that allows you to manage Google Cloud resources through Kubernetes.

While the management cluster can be deployed in the same project as your Kubeflow cluster, typically you will want to deploy
it in a separate project used for administering one or more Kubeflow instances, because it will run with escalated permissions to create Google Cloud resources in the managed projects.

Optionally, the cluster can be configured with [Anthos Config Management](https://cloud.google.com/anthos-config-management/docs)
to manage Google Cloud infrastructure using GitOps.

## Deployment steps

### Install the required tools

1. [gcloud components](https://cloud.google.com/sdk/docs/components)

    ```bash
    gcloud components install kubectl kpt anthoscli beta
    gcloud components update
    # If the output said the Cloud SDK component manager is disabled for installation, copy the command from output and run it.
    ```

    kubectl `v1.18.19` works best with Kubeflow 1.3, you can install specific version by following instruction, for example: [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/). But latest patch version of kubectl from `v1.17` to `v1.19` works well too.

1. [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/).

    **Note:** Starting from Kubeflow v1.2, we fixed the compatibility problem with Kustomize `v3.2.1+`, so you can now install any Kustomize `v3+`, including the latest Kustomize versions.

    To deploy the latest version of Kustomize on a Linux or Mac machine, run the following commands:

    ```bash
    # Detect your OS and download corresponding latest Kustomize binary
    curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash

    # Add the kustomize package to your $PATH env variable
    sudo mv ./kustomize /usr/local/bin/kustomize
    ```

    Then, to verify the installation, run `kustomize version`. You should see `Version:kustomize/vX.Y.Z` in the output if you've successfully deployed Kustomize.

1. [yq v3](https://github.com/mikefarah/yq/releases/tag/3.4.1)

    Follow the instructions in the yq repository to
   [install yq v3](https://github.com/mikefarah/yq#install). For example:

    ```bash
    sudo wget https://github.com/mikefarah/yq/releases/download/3.4.1/yq_linux_amd64 -O /usr/bin/yq && sudo chmod +x /usr/bin/yq
    yq --version
    # yq version 3.4.1
    ```
   
   **Note:** The Kubeflow deployment process is not compatible with yq v4 or later. Learn more about the [changes from yq v3 to v4](https://mikefarah.gitbook.io/yq/upgrading-from-v3#navigating).

### Fetch kubeflow/gcp-blueprints package

The management cluster manifests live in GitHub repository [kubeflow/gcp-blueprints](https://github.com/kubeflow/gcp-blueprints), use the following commands to pull Kubeflow v1.3 manifests:

1. Clone the GitHub repository and check out the v1.3.1 tag:

    ```bash
    git clone https://github.com/kubeflow/gcp-blueprints.git 
    cd gcp-blueprints
    git checkout tags/v1.3.1 -b v1.3.1
    ```

    Alternatively, you can get the package by using `kpt`:

    ```bash
    # Check out Kubeflow v1.3.1 blueprints
    kpt pkg get https://github.com/kubeflow/gcp-blueprints.git@v1.3.1 gcp-blueprints
    cd gcp-blueprints
    ```


1. Go to `gcp-blueprints/management` directory for Management cluster configurations.

    ```bash
    cd management
    ```

### Configure Environment Variables

This guide assumes the following convention:

* The `${MGMT_PROJECT}` environment variable contains the Google Cloud project
  ID where management cluster is deployed to.
* The `${MGMT_DIR}` environment variable contains the path to
  your management directory, which holds your management cluster configuration
  files. For example, `~/gcp-blueprints/management/`. You can choose any path
  you would like for the directory `${MGMT_DIR}`.

  To continously manage the management cluster, you are recommended to check
  the management configuration directory into source control.
 * `${MGMT_NAME}` is the cluster name of your management cluster and the prefix for other Google Cloud resources created in the deployment process. Management cluster
   should be a different cluster from your Kubeflow cluster.

   Note, `${MGMT_NAME}` should
   * start with a lowercase letter
   * only contain lowercase letters, numbers and `-`
   * end with a number or a letter
   * contain no more than 18 characters
   
* The `${LOCATION}` environment variable contains the location of your management cluster.
  you can choose between regional or zonal, see [Available regions and zones](https://cloud.google.com/compute/docs/regions-zones#available).

Set these environment variables in your shell:

```bash
MGMT_PROJECT=<the project where you deploy your management cluster>
MGMT_DIR=<path to your management cluster configuration directory>
MGMT_NAME=<name of your management cluster>
LOCATION=<location of your management cluster>
```

Alternatively, you can also fill in the same content in `gcp-blueprints/management/env.sh`, and run:

```bash
source env.sh
```

### Configure kpt setter values

Use kpt to [set values](https://googlecontainertools.github.io/kpt/guides/consumer/set/) for the name, project, and location of your management cluster:

  ```bash
  kpt cfg set -R . name "${MGMT_NAME}"
  kpt cfg set -R . gcloud.core.project "${MGMT_PROJECT}"
  kpt cfg set -R . location "${LOCATION}"
  ```
  
Running `kpt cfg set` stores values you set in all `Kptfile` under `gcp-blueprints/management/`. The `-R` flag means `--recurse-subpackages`. It sets values recursively in all the nested subpackages in current directory `.` in one command. Commit the changes to source control to preserve your configuration.

You can learn more about `kpt cfg set` in [kpt documentation](https://googlecontainertools.github.io/kpt/reference/cfg/set/), or by running `kpt cfg set --help`.

Alternatively, you can run the following command for the same effect:

  ```bash
  bash kpt-set.sh
  ```

Note, you can find out which setters exist in a package and what their
current values are by running the following command:

  ```bash
  kpt cfg list-setters .
  ```

### Deploy Management Cluster

1. Deploy the management cluster by applying cluster resources:

    ```bash
    make apply-cluster
    ```

    Optionally, you can verify the management cluster spec before applying it by:

    ```bash
    make hydrate-cluster
    ```

    and look into `./build/cluster` folder.

1. Create a kubectl __context__ for the management cluster, it will be named `${MGMT_NAME}`:

    ```bash
    make create-context
    ```

1. Install the Cloud Config Connector:

    ```bash
    make apply-kcc
    ```

    This step:

    * Installs Config Connector in your cluster, and
    * Creates the Google Cloud service account **${MGMT_NAME}-cnrm-system@${MGMT_PROJECT}.iam.gserviceaccount.com**.

    Optionally, you can verify the Config Connector installation before applying it by:

    ```bash
    make hydrate-kcc
    ```

    and check `./build/cnrm-install-*` folders.

## Understanding the deployment process

This section gives you more details about the configuration and
deployment process, so that you can customize your management cluster if necessary.

### Management cluster folder layout

Your management cluster directory contains the following files and directories:

* **Makefile** is a file that defines rules to automate deployment process. You can refer to [GNU make documentation](https://www.gnu.org/software/make/manual/make.html#Introduction) for more introduction. The Makefile we provide is designed to be user maintainable. You are encouraged to read, edit and maintain it to suit your own deployment customization needs.

* **cluster** is a kustomize package defining all the Google Cloud resources needed using [gcloud beta anthos apply](https://cloud.google.com/sdk/gcloud/reference/beta/anthos/apply). It can apply some Google Cloud resource types using the same resource definition for Config Connector. You can edit this kustomize package in order to customize the Google Cloud resources for your purposes.

* **cnrm-install-\*** folders contain kustomize packages for Google Cloud services, iam policies and Kubernetes resources to install Config Connector following [Advanced installation options for Config Connector](https://cloud.google.com/config-connector/docs/how-to/advanced-install).

* **build** is a directory that will contain the hydrated manifests outputted by
  the `make` rules.


### Customizing the installation

Once you understand the folder layout, you can create [Kustomize](https://kustomize.io/) `overlays` folder in corresponding directory, for example `cnrm-install/iam`, so you can define patches in `overlays` folder. Then use overlays in `kustomization.yaml` file.

The following tips help you customize, verify and re-apply them to your cluster.

Some useful links for Kustomize:

* [patchesStrategicMerge](https://kubectl.docs.kubernetes.io/references/kustomize/patchesstrategicmerge/) let you patch any fields of an existing resource using a partial resource definition.
* Reference for all Kustomize features: https://kubectl.docs.kubernetes.io/references/kustomize/.

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


### FAQs

* Where is `kfctl`?

  `kfctl` is no longer being used to apply resources for Google Cloud, because required functionalities are now supported by generic tools including [Make](https://www.gnu.org/software/make/), [Kustomize](https://kustomize.io), [kpt](https://googlecontainertools.github.io/kpt/), and [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview).

* Why do we use an extra management cluster to manage Google Cloud resources?

  The management cluster is very lightweight cluster that runs [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview). Cloud Config Connector makes it easier to configure Google Cloud resources using YAML and Kustomize.

For a more detailed explanation of the drastic changes happened in Kubeflow v1.1 on Google Cloud, read [kubeflow/gcp-blueprints #123](https://github.com/kubeflow/gcp-blueprints/issues/123).

## Next steps
* [Deploy Kubeflow](/docs/distributions/gke/deploy/deploy-cli) using kubectl, kustomize and kpt.

