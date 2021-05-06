+++
title = "Deploy Kubeflow cluster"
description = "Instructions for using kubectl and kpt to deploy Kubeflow on Google Cloud"
weight = 5
+++

This guide describes how to use `kubectl` and [kpt](https://googlecontainertools.github.io/kpt/) to
deploy Kubeflow on Google Cloud.

## Deployment steps

### Prerequisites

Before installing Kubeflow on the command line:

1. You must have created a management cluster and installed Config Connector.

   * If you don't have a management cluster follow the [instructions](/docs/distributions/gke/deploy/management-setup/)

   * Your management cluster will need a namespace setup to administer the Google Cloud project where Kubeflow will be deployed. This step will be included in later step of current page.

1. You need to use Linux or [Cloud Shell](https://cloud.google.com/shell/) for ASM installation. Currently ASM installation doesn't work on macOS because it [comes with an old version of bash](https://cloud.google.com/service-mesh/docs/scripted-install/asm-onboarding#installing_required_tools).

1. Make sure that your Google Cloud project meets the minimum requirements
  described in the [project setup guide](/docs/distributions/gke/deploy/project-setup/).

1. Follow the guide
  [setting up OAuth credentials](/docs/distributions/gke/deploy/oauth-setup/)
  to create OAuth credentials for [Cloud Identity-Aware Proxy (Cloud
  IAP)](https://cloud.google.com/iap/docs/).
    * Unfortunately [GKE's BackendConfig](https://cloud.google.com/kubernetes-engine/docs/concepts/backendconfig)
  currently doesn't support creating [IAP OAuth clients programmatically](https://cloud.google.com/iap/docs/programmatic-oauth-clients).


### Install the required tools

1. Install [gcloud](https://cloud.google.com/sdk/).

1. Install gcloud components

    ```bash
    gcloud components install kubectl kpt anthoscli beta
    gcloud components update
    ```

    kubectl `v1.18.19` works best with Kubeflow 1.3, you can install specific version by following instruction, for example: [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/). But latest patch version of kubectl from `v1.17` to `v1.19` works well too.

1. Install [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/).

    **Note:** Prior to Kubeflow v1.2, Kubeflow was compatible only with Kustomize `v3.2.1`. Starting from Kubeflow v1.2, you can now use any `v3` Kustomize version to install Kubeflow. Kustomize `v4` is not supported out of the box yet. [Official Version](https://github.com/kubeflow/manifests/tree/master#prerequisites)

    To deploy the latest version of Kustomize on a Linux or Mac machine, run the following commands:

    ```bash
    # Detect your OS and download corresponding latest Kustomize binary
    curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash

    # Add the kustomize package to your $PATH env variable
    sudo mv ./kustomize /usr/local/bin/kustomize
    ```

    Then, to verify the installation, run `kustomize version`. You should see `Version:kustomize/vX.Y.Z` in the output if you've successfully deployed Kustomize.

1. Use one of the following options to install
   [yq v3](https://github.com/mikefarah/yq).

   * If you have [Go](https://golang.org) installed, use the following command
     to install yq v3.

     ```bash
     GO111MODULE=on go get github.com/mikefarah/yq/v3
     ```
    
    * If you don't have [Go](https://golang.org) installed,  follow the
     instructions in the yq repository to
     [install yq v3](https://github.com/mikefarah/yq#install). For example:

        ```bash
        sudo wget https://github.com/mikefarah/yq/releases/download/3.4.1/yq_linux_amd64 -O /usr/bin/yq && sudo chmod +x /usr/bin/yq
        yq --version
        # yq version 3.4.1
        ```
   
   **Note:** The Kubeflow deployment process is not compatible with yq v4 or later.

1. Install jq https://stedolan.github.io/jq/, for example, we can run the following command on Ubuntu and Debian: 

    ```bash
    sudo apt install jq
    ```

### Fetch kubeflow/gcp-blueprints and upstream packages

1. If you have already installed Management cluster, you have `kubeflow/gcp-blueprints` locally. You just need to run `cd kubeflow` to access Kubeflow cluster manifests. Otherwise, you can run the following commands:

    ```bash
    # Check out Kubeflow v1.3.0 blueprints
    git clone https://github.com/kubeflow/gcp-blueprints.git 
    git checkout tags/v1.3.0
    ```

    Alternatively, you can get the package by using `kpt`:

    ```bash
    # Check out Kubeflow v1.3.0 blueprints
    kpt pkg get https://github.com/kubeflow/gcp-blueprints.git/v1.3.0 gcp-blueprints
    ```

1. Run the following command to pull upstream manifests from `kubeflow/manifests` repository.


    ```bash
    # Visit Kubeflow cluster related manifests
    cd gcp-blueprints/kubeflow

    bash ./pull_upstream.sh
    ```


### Environment Variables

Log in to gcloud. You only need to run this command once:

  ```bash
  gcloud auth login
  ```


1. This guide assumes the following environment variables:

    * `${KF_NAME}` contains the name of your Kubeflow cluster. 
      For example,  `my-kubeflow` or `kf-test`.
      The value of KF_NAME must only contain lower case alphanumeric characters, numbers or
      '-', and must start and end with an alphanumeric character.
      The value of this variable cannot be greater than 24 characters. It must
      contain just a name, not a directory path. Kubeflow name should be different from  your management cluster name.
    * `${KF_PROJECT}` contains the Google Cloud [project ID](https://cloud.google.com/resource-manager/docs/creating-managing-projects) where Kubeflow cluster will be deployed to.
    * `${KF_PROJECT_NUMBER}` contains the Google Cloud [project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects) where Kubeflow cluster will be deployed to.
    * `${KF_DIR}` contains the local kubeflow path where you pull `kubeflow/gcp-blueprints` repo. For example, `~/gcp-blueprints/kubeflow/`. 
    * `${MGMT_NAME}` contains the name of your management cluster created in [Management cluster setup](/docs/distributions/gke/deploy/management-setup/).
    * `${MGMTCTXT}` contains a kubectl context that connects
      to the `${KF_PROJECT}` namespace of the management cluster. By default, [Management
      cluster setup](../management-setup) creates a context named `${MGMT_NAME}` for you.

    * `${LOCATION}` contains the Compute Engine zone of your choice, see [available zones](https://cloud.google.com/compute/docs/regions-zones).
      * Currently, Kubeflow Pipelines doesn't work with regional deployments. For more, go to [kubeflow/gcp-blueprints#6](https://github.com/kubeflow/gcp-blueprints/issues/6).
      
      * For the default configuration, you need to choose a location that supports NVIDIA Tesla K80 Accelerators (`nvidia-tesla-k80`). 
        To see which accelerators are available in each zone, run the following command:
        ```
        gcloud compute accelerator-types list
        ```
    * `${ADMIN_EMAIL}` contains administrator's email address, for example: `xxx@gmail.com`
    * `${ASM_LABEL}` contains Anthos Service Mesh version, you don't need to change this value unless you want to upgrade this version. Note that upgrading ASM requires more manual steps than just changing this variable.

    Set these environment variables in your shell:

    ```bash
    export KF_NAME=<kubeflow-cluster-name>
    export KF_PROJECT=<gcp-project-id>
    export KF_PROJECT_NUMBER=$(gcloud projects describe "${KF_PROJECT}" --format='value(projectNumber)')
    export KF_DIR=<kubeflow-download-path>
    export MGMT_NAME=<management-cluster-name>
    export MGMTCTXT="${MGMT_NAME}"
    export LOCATION=<zone>
    export ADMIN_EMAIL=<administrator-full-email-address>
    export ASM_LABEL=asm-192-1
    ```

    Alternatively, you can also fill in the same content in `gcp-blueprints/kubeflow/env.sh`, then run:

    ```bash
    source env.sh
    ```

1. Set environment variables with OAuth Client ID and Secret for IAP:

   ```bash
   export CLIENT_ID=<Your CLIENT_ID>
   export CLIENT_SECRET=<Your CLIENT_SECRET>
   ```

    {{% alert title="Note" %}}
    Do not omit the `export` because scripts triggered by `make` need these
    environment variables.
    {{% /alert %}}

    {{% alert title="Note" %}}
    Do not check in these two envrionment variables configuration to source control, they are secrets.
    {{% /alert %}}
   

### Configure Kubeflow

#### kpt setter config
There are certain parameters that you must define in order to configure how and where
kubeflow is defined. These are described in the table below.

kpt setter | Description |
-----------|-------------|
mgmt-ctxt | This is the name of the KUBECONFIG context for the management cluster; this kubecontext will be used to create Config Connector resources for your Kubeflow deployment. **The context must set the namespace to the namespace in your management cluster where you are creating Config Connector resources for the managed project.**|
gcloud.core.project| The project you want to deploy in |
location | The zone or region you want to deploy in |
gcloud.compute.region | The region you are deploying in |
gcloud.compute.zone | The zone to use for zonal resources; must be in gcloud.compute.region |

Run the following commands to configure kpt setter for your Kubeflow cluster:

```bash
kpt cfg set -R .  gke.private false
kpt cfg set -R .  asm-label "${ASM_LABEL}"
kpt cfg set -R .  mgmt-ctxt "${MGMT_NAME}"

kpt cfg set -R .  name "${KF_NAME}"
kpt cfg set -R .  gcloud.core.project "${KF_PROJECT}"
kpt cfg set -R .  gcloud.project.projectNumber "${KF_PROJECT_NUMBER}"
kpt cfg set -R .  gcloud.compute.zone "${LOCATION}"
kpt cfg set -R .  location "${LOCATION}"
kpt cfg set -R .  email "${ADMIN_EMAIL}"
kpt cfg set -R .  log-firewalls false
```

Alternatively, you can run the following command for the same effect:

  ```bash
  bash ./kpt-set.sh
  ```

Note, you can find out which setters exist in a package and what their
current values are by running the following command:

  ```bash
  kpt cfg list-setters .
  ```

You can learn more about `kpt cfg set` in [kpt documentation](https://googlecontainertools.github.io/kpt/reference/cfg/set/), or by running `kpt cfg set --help`.

#### Management cluster config

You need to configure the kubectl context `${MGMTCTXT}`.

* Choose the management cluster context

  ```bash
  kubectl config use-context "${MGMTCTXT}"
  ```

* Create a namespace in your management cluster for the Kubeflow project if you haven't done so.

  ```bash
  kubectl create namespace "${KF_PROJECT}"
  ```


## Authorize Cloud Config Connector for each Kubeflow project

In the [Management cluster deployment](/docs/distributions/gke/deploy/management-setup/) we created the Google Cloud service account **${MGMT_NAME}-cnrm-system@${MGMT_PROJECT}.iam.gserviceaccount.com**
this is the service account that Config Connector will use to create any Google Cloud resources. If your Management cluster and Kubeflow cluster live in different projects, you need to grant this Google Cloud service account sufficient privileges to create the desired
resources in Kubeflow project.

The easiest way to do this is to grant the Google Cloud service account owner permissions on one or more projects.

1. Set the Management environment variable if you haven't:

    ```bash
    MGMT_DIR=<path to your management cluster configuration directory>
    MGMT_NAME=<name of your management cluster>
    MGMT_PROJECT=<the project where you deploy your management cluster>
    ```

1. Redirect to `managment` directory:

   ```bash
   cd "${MGMT_DIR}"
   kpt cfg set -R . name "${MGMT_NAME}"
   kpt cfg set -R . gcloud.core.project "${MGMT_PROJECT}"
   kpt cfg set -R . managed-project "${KF_PROJECT}"
   ```

1. Update the policy:

   ```bash
   gcloud beta anthos apply ./managed-project/iam.yaml
   ```

   Optionally, to restrict permissions you want to grant to this service account. You can edit `./managed-project/iam.yaml` and specify more granular roles. Refer to [IAMPolicy Config Connector reference](https://cloud.google.com/config-connector/docs/reference/resource-docs/iam/iampolicy) for exact fields you can set.

### Deploy Kubeflow

To deploy Kubeflow, run the following command:

```bash
make apply
```

* If resources can't be created because `webhook.cert-manager.io` is unavailable wait and
  then rerun `make apply`

  * This issue is being tracked in [kubeflow/manifests#1234](https://github.com/kubeflow/manifests/issues/1234)

* If resources can't be created with an error message like:

  ```bash
  error: unable to recognize ".build/application/app.k8s.io_v1beta1_application_application-controller-kubeflow.yaml": no matches for kind "Application" in version "app.k8s.io/v1beta1”
  ```

  This issue occurs when the CRD endpoint isn't established in the Kubernetes API server when the CRD's custom object is applied.
  This issue is expected and can happen multiple times for different kinds of resource. To resolve this issue, try running `make apply` again.

### Check your deployment

Follow these steps to verify the deployment:

1. When the deployment finishes, check the resources installed in the namespace
   `kubeflow` in your new cluster.  To do this from the command line, first set
   your `kubectl` credentials to point to the new cluster:

    ```bash
    gcloud container clusters get-credentials "${KF_NAME}" --zone "${ZONE}" --project "${KF_PROJECT}"
    ```

    Then, check what's installed in the `kubeflow` namespace of your GKE cluster:

    ```bash
    kubectl -n kubeflow get all
    ```

### Access the Kubeflow user interface (UI)

To access the Kubeflow central dashboard, follow these steps:

1. Use the following command to grant yourself the [IAP-secured Web App User](https://cloud.google.com/iap/docs/managing-access) role:

    ```bash
    gcloud projects add-iam-policy-binding "${KF_PROJECT}" --member=user:<EMAIL> --role=roles/iap.httpsResourceAccessor
    ```

    Note, you need the `IAP-secured Web App User` role even if you are already an owner or editor of the project. `IAP-secured Web App User` role is not implied by the `Project Owner` or `Project Editor` roles.

1. Enter the following URI into your browser address bar. It can take 20
  minutes for the URI to become available: `https://${KF_NAME}.endpoints.${KF_PROJECT}.cloud.goog/`

    You can run the following command to get the URI for your deployment:

    ```bash
    kubectl -n istio-system get ingress
    NAME            HOSTS                                                      ADDRESS         PORTS   AGE
    envoy-ingress   your-kubeflow-name.endpoints.your-gcp-project.cloud.goog   34.102.232.34   80      5d13h
    ```

    The following command sets an environment variable named `HOST` to the URI:

    ```bash
    export HOST=$(kubectl -n istio-system get ingress envoy-ingress -o=jsonpath={.spec.rules[0].host})
    ```

1. Follow the instructions on the UI to create a namespace. Refer to this guide on
  [creation of profiles](/docs/components/multi-tenancy/getting-started/#automatic-creation-of-profiles).

Notes:

* It can take 20 minutes for the URI to become available.
  Kubeflow needs to provision a signed SSL certificate and register a DNS
  name.
* If you own or manage the domain or a subdomain with
  [Cloud DNS](https://cloud.google.com/dns/docs/)
  then you can configure this process to be much faster.
  Check [kubeflow/kubeflow#731](https://github.com/kubeflow/kubeflow/issues/731).

## Understanding the deployment process

This section gives you more details about the kubectl, kustomize, config connector configuration and
deployment process, so that you can customize your Kubeflow deployment if necessary.

### Application layout

Your Kubeflow application directory **${KF_DIR}** contains the following files and
directories:

* **Makefile** is a file that defines rules to automate deployment process. You can refer to [GNU make documentation](https://www.gnu.org/software/make/manual/make.html#Introduction) for more introduction. The Makefile we provide is designed to be user maintainable. You are encouraged to read, edit and maintain it to suit your own deployment customization needs.

* **apps**, **common**, **contrib** are a series of independent components  directory containing kustomize packages for deploying Kubeflow components. The structure is to align with upstream [kubeflow/manifests](https://github.com/kubeflow/manifests).

  * `kubeflow/gcp-blueprints` only stores `kustomization.yaml` and `patches` for Google Cloud specific resources.

  * `./pull_upstream.sh` will pull `kubeflow/manifests` and store manifests in `upstream` folder of each component in this guide. `kubeflow/gcp-blueprints` repo doesn't store the copy of upstream manifests.

* **build** is a directory that will contain the hydrated manifests outputted by
  the `make` rules, each component will have its own **build** directory. You can customize the **build** path when calling `make` command.

### Source Control

It is recommended that you check in your entire local repository into source control.

Checking in **build** is recommended so you can easily see differences by `git diff` in manifests before applying them.

## Google Cloud service accounts

The kfctl deployment process creates three service accounts in your
Google Cloud project. These service accounts follow the [principle of least
privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege).
The service accounts are:

* `${KF_NAME}-admin` is used for some admin tasks like configuring the load
  balancers. The principle is that this account is needed to deploy Kubeflow but
  not needed to actually run jobs.
* `${KF_NAME}-user` is intended to be used by training jobs and models to access
  Google Cloud resources (Cloud Storage, BigQuery, etc.). This account has a much smaller
  set of privileges compared to `admin`.
* `${KF_NAME}-vm` is used only for the virtual machine (VM) service account. This
  account has the minimal permissions needed to send metrics and logs to
  [Stackdriver](https://cloud.google.com/stackdriver/).

## Upgrade Kubeflow

Refer to [Upgrading Kubeflow cluster](/docs/distributions/gke/deploy/upgrade#upgrading-kubeflow-cluster).

## Next steps

* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/distributions/gke/gcp-e2e/) or the
  [GitHub issue summarization Pipelines
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization/pipelines).
* Learn how to [delete your Kubeflow deployment using the CLI](/docs/distributions/gke/deploy/delete-cli/).
* To add users to Kubeflow, go to [a dedicated section in Customizing Kubeflow on GKE](/docs/distributions/gke/customizing-gke/#add-users-to-kubeflow).
* To taylor your Kubeflow deployment on GKE, go to [Customizing Kubeflow on GKE](/docs/distributions/gke/customizing-gke/).
* For troubleshooting Kubeflow deployments on GKE, go to the [Troubleshooting deployments](/docs/distributions/gke/troubleshooting-gke/) guide.
