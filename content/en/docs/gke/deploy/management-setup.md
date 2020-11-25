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

For a more detailed explanation of the drastic changes happened in vKubeflow 1.1 on Google Cloud, read [kubeflow/gcp-blueprints #123](https://github.com/kubeflow/gcp-blueprints/issues/123).

## Install the required tools

1.  Install gcloud components

    ```bash
    gcloud components install kpt anthoscli beta
    gcloud components update
    ```

1.  Install [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/).

    **Note:** Starting from Kubeflow v1.2, we fixed the compatibility problem with Kustomize `v3.2.1+`, so you can now install any Kustomize `v3+`, including the latest Kustomize versions.

1.  Install [yq](https://github.com/mikefarah/yq#install).

## Setting up the management cluster

1.  Fetch the management blueprint to current directory

    ```bash
    kpt pkg get https://github.com/kubeflow/gcp-blueprints.git/management@v1.2.0 ./
    ```

1.  Fetch the upstream management package

    ```bash
    cd ./management
    make get-pkg
    ```

    Note, all the instructions below assume your current working directory is `./management`.

1.  Use kpt to set values for the name, project, and location of your management cluster:

    ```bash
    kpt cfg set -R . name ${NAME}
    kpt cfg set -R . gcloud.core.project ${PROJECT}
    kpt cfg set -R . location ${LOCATION}
    ```

    For the values you need to set for management cluster:

    - NAME is the cluster name of your management cluster. Management cluster
      should be a different cluster from your Kubeflow cluster.

      Note, NAME should

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

    Note, you can find out which setters exist in a package and which values were previously set by:

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

1.  Create a kubectl context for the management cluster, it will be called `${NAME}`:

    ```bash
    make create-context
    ```

1.  Install the Cloud Config Connector:

    ```bash
    make apply-kcc
    ```

    This step

    - installs Config Connector in your cluster
    - creates the Google Cloud service account **${NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**

    Optionally, you can verify the Config Connector installation before applying it by:

    ```bash
    make hydrate-kcc
    ```

    and look into `./build/cnrm-install-*` folders.

### Authorize Cloud Config Connector for each managed project

In the last step we created the Google Cloud service account **${NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**
this is the service account that Config Connector will use to create any Google Cloud resources. Consequently
you need to grant this Google Cloud service account sufficient privileges to create the desired
resources in one or more projects (called managed projects, read [more](https://github.com/kubeflow/gcp-blueprints/tree/master/management/instance/managed-project)).

The easiest way to do this is to grant the Google Cloud service account owner permissions on one or more projects.

1. Set the managed project

   ```bash
   kpt cfg set ./instance managed-project ${MANAGED-PROJECT}
   ```

1. Update the policy

   ```bash
   anthoscli apply -f ./instance/managed-project/iam.yaml
   ```

   Optionally, to restrict permissions you want to grant to this service account. You can edit `./instance/managed-project/iam.yaml` and specify more granular roles. Refer to [IAMPolicy Config Connector reference](https://cloud.google.com/config-connector/docs/reference/resource-docs/iam/iampolicy) for exact fields you can set.

## References

- [Cloud Config Connector Reference Documentation](https://cloud.google.com/config-connector/docs/reference/resources)
