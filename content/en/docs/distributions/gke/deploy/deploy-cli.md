+++
title = "Deploy using kubectl and kpt"
description = "Instructions for using kubectl and kpt to deploy Kubeflow on Google Cloud"
weight = 4
+++

This guide describes how to use `kubectl` and [kpt](https://googlecontainertools.github.io/kpt/) to
deploy Kubeflow on Google Cloud.

## Before you start

Before installing Kubeflow on the command line:

1. You must have created a management cluster and installed Config Connector.

   * If you don't have a management cluster follow the [instructions](../management-setup/)

   * Your management cluster must have a namespace setup to administer the Google Cloud project where
Kubeflow will be deployed. Follow the [instructions](../management-setup/) to create
one if you haven't already.

1. If you're using
  [Cloud Shell](https://cloud.google.com/shell/), enable
  [boost mode](https://cloud.google.com/shell/docs/features#boost_mode).

1. Make sure that your Google Cloud project meets the minimum requirements
  described in the [project setup guide](/docs/gke/deploy/project-setup/).

1. Follow the guide
  [setting up OAuth credentials](/docs/gke/deploy/oauth-setup/)
  to create OAuth credentials for [Cloud Identity-Aware Proxy (Cloud
  IAP)](https://cloud.google.com/iap/docs/).

Refer to
[Understanding the deployment process](#understanding-the-deployment-process) for more information on the kfctl configuration and deployment process.

### Environment Variables

This guide assumes the following settings:

* The `${MGMT_NAME}` environment variable contains the name of your management cluster created in [Management cluster setup](../management-setup).
* The `${MGMTCTXT}` environment variable contains a kubectl context that connects
  to the `${KF_PROJECT}` namespace of the management cluster. By default, [Management
  cluster setup](../management-setup) creates a context named `${MGMT_NAME}` for you.
* The `${KF_NAME}` environment variable contains the name of your Kubeflow cluster.
* The `${KF_PROJECT}` environment variable contains the Google Cloud project ID where Kubeflow cluster will be deployed to.
* The `${KF_DIR}` environment variable contains the path where you want to
put your Kubeflow application directory, which holds your Kubeflow configuration
files. For example, `~/kf-deployments/my-kubeflow/`. You can choose any path you
would like for the directory `${KF_DIR}`.

  To continously manage the Kubeflow cluster, you are recommended to check
  the Kubeflow configuration directory into source control.

Set these environment variables in your shell:

```bash
KF_NAME=<name of your Kubeflow cluster>
KF_PROJECT=<the project where you deploy your Kubeflow cluster>
KF_DIR=<path to your Kubeflow configuration directory>
MGMT_NAME=<name of your management cluster>
MGMTCTXT="${MGMT_NAME}"
```

However, the environment variables are used purely for command illustration
purpose. No tools will assume they actually exists in your terminal environment.

### Install the required tools

1. Install [gcloud](https://cloud.google.com/sdk/).

1. Install gcloud components

    ```bash
    gcloud components install kubectl kpt anthoscli beta
    gcloud components update
    ```

1. Install [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/).

    **Note:** Prior to Kubeflow v1.2, Kubeflow was compatible only with Kustomize `v3.2.1`. Starting from Kubeflow v1.2, you can now use any `v3` Kustomize version to install Kubeflow. Kustomize `v4` is not supported out of the box yet. [Official Version](https://github.com/kubeflow/manifests/tree/master#prerequisites)

    To deploy the latest version of Kustomize on a Linux or Mac machine, run the following commands:

    ```bash
    # Detect your OS and download the corresponding latest Kustomize binary
    curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  > install_kustomize.sh
    bash ./install_kustomize.sh 3.2.0
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
     [install yq v3](https://github.com/mikefarah/yq#install).
   
   **Note:** The Kubeflow deployment process is not compatible with yq v4 or later.

1. Follow the instructions from [Preparing to install Anthos Service Mesh](https://cloud.google.com/service-mesh/docs/archive/1.4/docs/gke-install-new-cluster#preparing_to_install_anthos_service_mesh) to install `istioctl`.

    Note, the `istioctl` downloaded from above instructions is specific to Anthos Service Mesh. It is different from the `istioctl` you can download on <https://istio.io/>.

## Prepare your environment

1. Log in. You only need to run this command once:

    ```bash
    gcloud auth login
    ```

## Fetch packages using kpt

1. Fetch the Kubeflow package

   ```bash
   kpt pkg get https://github.com/kubeflow/gcp-blueprints.git/kubeflow@v1.2.0 "${KF_DIR}"
   ```

1. Change to the Kubeflow directory

   ```bash
   cd "${KF_DIR}/kubeflow"
   ```

   Note, all the instructions below assume your current working directory is `${KF_DIR}/kubeflow`.

1. Fetch Kubeflow manifests

   ```bash
   make get-pkg
   ```

## Configure Kubeflow

* **${KF_NAME}** - The name of your Kubeflow deployment.
  If you want a custom deployment name, specify that name here.
  For example,  `my-kubeflow` or `kf-test`.
  The value of KF_NAME must consist of lower case alphanumeric characters or
  '-', and must start and end with an alphanumeric character.
  The value of this variable cannot be greater than 25 characters. It must
  contain just a name, not a directory path.
  You also use this value as directory name when creating the directory where 
  your Kubeflow  configurations are stored, that is, the Kubeflow application 
  directory. 
  
* **${KF_DIR}** - The full path to your Kubeflow application directory.


There are certain parameters that you must define in order to configure how and where
kubeflow is defined. These are described in the table below.

kpt setter | Description |
-----------|-------------|
mgmt-ctxt | This is the name of the KUBECONFIG context for the management cluster; this kubecontext will be used to create Config Connector resources for your Kubeflow deployment. **The context must set the namespace to the namespace in your management cluster where you are creating Config Connector resources for the managed project.**|
gcloud.core.project| The project you want to deploy in |
location | The zone or region you want to deploy in |
gcloud.compute.region | The region you are deploying in |
gcloud.compute.zone | The zone to use for zonal resources; must be in gcloud.compute.region |

* `${KF_NAME}` is the cluster name of your Kubeflow cluster and prefix for other Google Cloud resources created in the deployment process. Kubeflow cluster
  should be a different cluster from your management cluster.

  Note, `${KF_NAME}` should
  * start with a lowercase letter
  * only contain lowercase letters, numbers and `-`
  * end with a number or a letter
  * contain no more than 24 characters

* Location can be a zone or a region depending on whether you want a regional cluster

  * Currently, Kubeflow Pipelines doesn't work with regional deployments. For more, go to [kubeflow/gcp-blueprints#6](https://github.com/kubeflow/gcp-blueprints/issues/6).
  
  * For the default configuration, you need to choose a location that supports NVIDIA Tesla K80 Accelerators (`nvidia-tesla-k80`). 
    To see which accelerators are available in each zone, run the following command:
    ```
    gcloud compute accelerator-types list
    ```

* The **Makefile** at `${KF_DIR}/Makefile` contains a rule `set-values` with appropriate `kpt cfg` commands to set the values
  of the parameters

* You need to edit the makefile at `${KF_DIR}/Makefile` to set the parameters to the desired values.

  * The management cluster deployment instructions creates a kubectl context
    named `${MGMT_NAME}` for you. You can use it as `${MGMTCTXT}`:

    ```bash
    kpt cfg set ./instance mgmt-ctxt <YOUR_MANAGEMENT_CTXT>
    ```

  * Note there are multiple invocations of `kpt cfg set` on different directories to
     work around [GoogleContainerTools/kpt#541](https://github.com/GoogleContainerTools/kpt/issues/541)

* You need to configure the kubectl context `${MGMTCTXT}`.

  * Choose the management cluster context

    ```bash
    kubectl config use-context "${MGMTCTXT}"
    ```

  * Create a namespace in your management cluster for the managed project if you haven't done so.

    ```bash
    kubectl create namespace "${KF_PROJECT}"
    ```

    where `${KF_PROJECT}` is your `${MANAGED_PROJECT}` mentioned in the [Authorize Cloud Config Connector for each managed project
](../management-setup/#authorize-cloud-config-connector-for-each-managed-project) step.

  * Make the Kubeflow project's namespace default of the `${MGMTCTXT}` context:

    ```bash
    kubectl config set-context --current --namespace "${KF_PROJECT}"
    ```

* If you haven't previously created an OAuth client for IAP then follow
  the [directions](https://www.kubeflow.org/docs/gke/deploy/oauth-setup/) to setup
  your consent screen and oauth client.

  * Unfortunately [GKE's BackendConfig](https://cloud.google.com/kubernetes-engine/docs/concepts/backendconfig)
    currently doesn't support creating [IAP OAuth clients programmatically](https://cloud.google.com/iap/docs/programmatic-oauth-clients).

* Set environment variables with OAuth Client ID and Secret for IAP:

   ```bash
   export CLIENT_ID=<Your CLIENT_ID>
   export CLIENT_SECRET=<Your CLIENT_SECRET>
   ```

   Note, do not omit the `export` because scripts triggered by `make` need these
   environment variables.

* Invoke the make rule to set the kpt setters:

  ```bash
  make set-values
  ```

## Deploy Kubeflow

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

## Check your deployment

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

## Access the Kubeflow user interface (UI)

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

## Upgrade Kubeflow

Refer to [Upgrading Kubeflow cluster](/docs/gke/deploy/upgrade#upgrading-kubeflow-cluster).

## Understanding the deployment process

This section gives you more details about the kfctl configuration and
deployment process, so that you can customize your Kubeflow deployment if
necessary.

### Application layout

Your Kubeflow application directory **${KF_DIR}** contains the following files and
directories:

* **Makefile** is a file that defines rules to automate deployment process. You can refer to [GNU make documentation](https://www.gnu.org/software/make/manual/make.html#Introduction) for more introduction. The Makefile we provide is designed to be user maintainable. You are encouraged to read, edit and maintain it to suit your own deployment customization needs.

* **upstream** is a directory containing kustomize packages for deploying Kubeflow

  * This directory contains the upstream configurations on which your deployment
    is based

* **instance** is a directory that defines overlays that are applied to the upstream
  configurations in order to customize Kubeflow for your use case.

  * **gcp_config** is a kustomize package defining all the Google Cloud resources needed for Kubeflow
    using [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview)

    * You can edit this kustomize package in order to customize the Google Cloud resources for
      your purposes

  * **kustomize** contains kustomize packages for the various Kubernetes applications
    to be installed on your Kubeflow cluster

* **.build** is a directory that will contain the hydrated manifests outputted by
  the `make` rules

### Source Control

It is recommended that you check in your entire **${KF_DIR}** into source control.

Checking in **.build** is recommended so you can easily see differences in manifests before applying them.

### Google Cloud service accounts

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

## Next steps

* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/gke/gcp-e2e/) or the
  [GitHub issue summarization Pipelines
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization/pipelines).
* Learn how to [delete your Kubeflow deployment using the CLI](/docs/gke/deploy/delete-cli/).
* To add users to Kubeflow, go to [a dedicated section in Customizing Kubeflow on GKE](/docs/gke/customizing-gke/#add-users-to-kubeflow).
* To taylor your Kubeflow deployment on GKE, go to [Customizing Kubeflow on GKE](/docs/gke/customizing-gke/).
* For troubleshooting Kubeflow deployments on GKE, go to the [Troubleshooting deployments](/docs/gke/troubleshooting-gke/) guide.
