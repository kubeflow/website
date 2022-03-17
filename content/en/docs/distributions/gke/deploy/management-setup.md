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
    gcloud components install kubectl kustomize kpt anthoscli beta
    gcloud components update
    # If the output said the Cloud SDK component manager is disabled for installation, copy the command from output and run it.
    ```

    You can install specific version of kubectl by following instruction (Example: [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)). Latest patch version of kubectl from `v1.17` to `v1.19` works well too.

    Note: Starting from Kubeflow 1.4, it requires `kpt v1.0.0-beta.6` or above to operate in `kubeflow/gcp-blueprints` repository. gcloud hasn't caught up with this kpt version yet, [install kpt](https://kpt.dev/installation/) separately from https://github.com/GoogleContainerTools/kpt/tags for now. Note that kpt requires docker to be installed.


### Fetch kubeflow/gcp-blueprints package

The management cluster manifests live in GitHub repository [kubeflow/gcp-blueprints](https://github.com/kubeflow/gcp-blueprints), use the following commands to pull Kubeflow manifests:

1. Clone the GitHub repository and check out the v{{% gke/latest-version %}} tag:

    ```bash
    git clone https://github.com/kubeflow/gcp-blueprints.git 
    cd gcp-blueprints
    git checkout tags/v{{% gke/latest-version %}} -b v{{% gke/latest-version %}}
    ```

    Alternatively, you can get the package by using `kpt`:

    ```bash
    # Check out Kubeflow v{{% gke/latest-version %}} blueprints
    kpt pkg get https://github.com/kubeflow/gcp-blueprints.git@v{{% gke/latest-version %}} gcp-blueprints
    cd gcp-blueprints
    ```


1. Go to `gcp-blueprints/management` directory for Management cluster configurations.

    ```bash
    cd management
    ```

{{% alert title="Tip" color="info" %}}
  To continuously manage the management cluster, you are recommended to check
  the management configuration directory into source control. For example, `MGMT_DIR=~/gcp-blueprints/management/`.
{{% /alert %}}

### Configure Environment Variables

Fill in environment variables in `gcp-blueprints/management/env.sh` as followed:

```bash
MGMT_PROJECT=<the project where you deploy your management cluster>
MGMT_NAME=<name of your management cluster>
LOCATION=<location of your management cluster, use either us-central1 or us-east1>
```

And run:

```bash
source env.sh
```

This guide assumes the following convention:

* The `${MGMT_PROJECT}` environment variable contains the Google Cloud project
  ID where management cluster is deployed to.
* `${MGMT_NAME}` is the cluster name of your management cluster and the prefix for other Google Cloud resources created in the deployment process. Management cluster
  should be a different cluster from your Kubeflow cluster.

   Note, `${MGMT_NAME}` should
   * start with a lowercase letter
   * only contain lowercase letters, numbers and `-`
   * end with a number or a letter
   * contain no more than 18 characters
   
* The `${LOCATION}` environment variable contains the location of your management cluster.
  you can choose between regional or zonal, see [Available regions and zones](https://cloud.google.com/compute/docs/regions-zones#available).


### Configure kpt setter values

Use kpt to [set values](https://catalog.kpt.dev/apply-setters/v0.2/) for the name, project, and location of your management cluster. Run the following command:

  ```bash
  bash kpt-set.sh
  ```

Note, you can find out which setters exist in a package and what their
current values are by running the following command:

  ```bash
  kpt fn eval -i list-setters:v0.1 ./manifests
  ```

### Prerequisite for Config Controller

In order to deploy Google Cloud Services like Kubernetes resources, we need to create a management cluster with Config Controller installed. Follow [Before you begin](https://cloud.google.com/anthos-config-management/docs/how-to/config-controller-setup#before_you_begin) to create default network if not existed. Make sure to use `${MGMT_PROJECT}` for PROJECT_ID.

### Deploy Management Cluster

1. Deploy the management cluster by applying cluster resources:

    ```bash
    make create-cluster
    ```

1. Create a kubectl __context__ for the management cluster, it will be named `${MGMT_NAME}`:

    ```bash
    make create-context
    ```

1. Grant permission to Config Controller service account:

    ```bash
    make grant-owner-permission
    ```

    Config Controller has created a default service account, this step grants owner permission to this service account in order to 
    allow Config Controller to manage Google Cloud resources. Refer to [Config Controller setup](https://cloud.google.com/anthos-config-management/docs/how-to/config-controller-setup#set_up).


## Understanding the deployment process

This section gives you more details about the configuration and
deployment process, so that you can customize your management cluster if necessary.

### Config Controller

Management cluster is a tool for managing Google Cloud services like KRM, for example: GKE container cluster, MySQL database, etc. 
And you can use one Managment cluster for multiple Kubeflow clusters, across multiple Google Cloud projects.
This capability is offered by [Config Connector](https://cloud.google.com/config-connector/docs/how-to/getting-started). 

Starting with Kubeflow 1.5, we leveraged the managed version of Config Connector, which is called [Config Controller](https://cloud.google.com/anthos-config-management/docs/concepts/config-controller-overview). 
Therefore, The Management cluster is the Config Controller cluster deployed using [Config Controller setup](https://cloud.google.com/anthos-config-management/docs/how-to/config-controller-setup) process.
Note that you can create only one Management cluster within a Google Cloud project, and you usually need just one Management cluster.



### Management cluster layout

Inside the Config Controller, we manange Google Cloud resources in namespace mode. That means one namespace is responsible to manage Google Cloud resources deployed to the Google Cloud project with the same name. Your management cluster contains following namespaces:

1. config-control
1. namespace with the same name as your Kubeflow clusters' Google Cloud project name

`config-control` is the default namespace which is installed while creating Management cluster, you have granted the default service account (like `service-<management-project-id>@gcp-sa-yakima.iam.gserviceaccount.com`)
within this project to manage Config Connector. It is the prerequisite for managing resources in other Google Cloud projects.

`namespace with the same name as your Kubeflow clusters' Google Cloud project name` is the resource pool for Kubeflow cluster's Google Cloud project.
For each Kubeflow Google Cloud project, you will have service account with pattern `kcc-<kf-project-name>@<management-project-name>.iam.gserviceaccount.com` in `config-control` namespace, and it needs to have owner permission to `${KF_PROJECT}`, you will perform this step during [Deploy Kubeflow cluster](/docs/gke/deploy/deploy-cli/). After setup, your Google Cloud resources in Kubeflow cluster project will be deployed to the namespace with name `${KF_PROJECT}` in the management cluster.

Your management cluster directory contains the following file:

* **Makefile** is a file that defines rules to automate deployment process. You can refer to [GNU make documentation](https://www.gnu.org/software/make/manual/make.html#Introduction) for more introduction. The Makefile we provide is designed to be user maintainable. You are encouraged to read, edit and maintain it to suit your own deployment customization needs.

### Debug

If you encounter issue creating Google Cloud resources using Config Controller. You can list resources in the `${KF_PROJECT}` namespace of management cluster to learn about the detail.
Learn more with [Monitoring your resources](https://cloud.google.com/config-connector/docs/how-to/monitoring-your-resources)

```bash
kubectl --context=${MGMT_NAME} get all -n ${KF_PROJECT}

# If you want to check the service account creation status
kubectl --context=${MGMT_NAME} get IAMServiceAccount -n ${KF_PROJECT}
kubectl --context=${MGMT_NAME} get IAMServiceAccount <service-account-name> -n ${KF_PROJECT} -oyaml
```


### FAQs

* Where is `kfctl`?

  `kfctl` is no longer being used to apply resources for Google Cloud, because required functionalities are now supported by generic tools including [Make](https://www.gnu.org/software/make/), [Kustomize](https://kustomize.io), [kpt](https://googlecontainertools.github.io/kpt/), and [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview).

* Why do we use an extra management cluster to manage Google Cloud resources?

  The management cluster is very lightweight cluster that runs [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview). Cloud Config Connector makes it easier to configure Google Cloud resources using YAML and Kustomize.

For a more detailed explanation of the drastic changes happened in Kubeflow v1.1 on Google Cloud, read [kubeflow/gcp-blueprints #123](https://github.com/kubeflow/gcp-blueprints/issues/123).

## Next steps
* [Deploy Kubeflow](/docs/distributions/gke/deploy/deploy-cli) using kubectl, kustomize and kpt.

