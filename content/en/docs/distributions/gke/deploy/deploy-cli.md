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
    gcloud components install kubectl kustomize kpt anthoscli beta
    gcloud components update
    ```

    You can install specific version of kubectl by following instruction (Example: [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)). Latest patch version of kubectl from `v1.17` to `v1.19` works well too.

    Note: Starting from Kubeflow 1.4, it requires `kpt v1.0.0-beta.6` or above to operate in `kubeflow/gcp-blueprints` repository. gcloud hasn't caught up with this kpt version yet, [install kpt](https://kpt.dev/installation/) separately from https://github.com/GoogleContainerTools/kpt/tags for now. Note that kpt requires docker to be installed.

    Note: You also need to [install required tools](https://cloud.google.com/service-mesh/v1.10/docs/scripted-install/asm-onboarding#installing_required_tools) for ASM installation tool `install_asm`.

### Fetch kubeflow/gcp-blueprints and upstream packages

1. If you have already installed Management cluster, you have `kubeflow/gcp-blueprints` locally. You just need to run `cd kubeflow` to access Kubeflow cluster manifests. Otherwise, you can run the following commands:

    ```bash
    # Check out Kubeflow v{{% gke/latest-version %}} blueprints
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

1. Run the following command to pull upstream manifests from `kubeflow/manifests` repository.


    ```bash
    # Visit Kubeflow cluster related manifests
    cd kubeflow

    bash ./pull-upstream.sh
    ```


### Environment Variables

Log in to gcloud. You only need to run this command once:

  ```bash
  gcloud auth login
  ```


1. Review and fill all the environment variables in `gcp-blueprints/kubeflow/env.sh`, they will be used by `kpt` later on, and some of them will be used in this deployment guide. Review the comment in `env.sh` for the explanation for each environment variable. After defining these environment variables, run:

    ```bash
    source env.sh
    ```

1. Set environment variables with OAuth Client ID and Secret for IAP:

   ```bash
   export CLIENT_ID=<Your CLIENT_ID>
   export CLIENT_SECRET=<Your CLIENT_SECRET>
   ```

    {{% alert title="Note" %}}Do not omit the <b>export</b> because scripts triggered by <b>make</b> need these environment variables. Do not check in these two environment variables configuration to source control, they are secrets.{{% /alert %}}
   
#### kpt setter config

Run the following commands to configure kpt setter for your Kubeflow cluster:

  ```bash
  bash ./kpt-set.sh
  ```

Everytime you change environment variables, make sure you run the command above to apply
kpt setter change to all packages. Otherwise, kustomize build will not be able to pick up 
new changes.

Note, you can find out which setters exist in a package and their
current values by running the following commands:

  ```bash
  kpt fn eval -i list-setters:v0.1 ./apps
  kpt fn eval -i list-setters:v0.1 ./common
  ```

You can learn more about `list-setters` in [kpt documentation](https://catalog.kpt.dev/list-setters/v0.1/).

#### Authorize Cloud Config Connector for each Kubeflow project

In the [Management cluster deployment](/docs/distributions/gke/deploy/management-setup/) we created the Google Cloud service account **serviceAccount:kcc-${KF_PROJECT}@${MGMT_PROJECT}.iam.gserviceaccount.com**
this is the service account that Config Connector will use to create any Google Cloud resources in `${KF_PROJECT}`. You need to grant this Google Cloud service account sufficient privileges to create the desired resources in Kubeflow project. 
You only need to perform steps below once for each Kubeflow project, but make sure to do it even when KF_PROJECT and MGMT_PROJECT are the same project.

The easiest way to do this is to grant the Google Cloud service account owner permissions on one or more projects.

1. Set the Management environment variable if you haven't:

    ```bash
    MGMT_PROJECT=<the project where you deploy your management cluster>
    MGMT_NAME=<the kubectl context name for management cluster>
    ```
1. Apply ConfigConnectorContext for `${KF_PROJECT}` in management cluster:

    ```bash
    make apply-kcc
    ```


### Configure Kubeflow

Make sure you are using KF_PROJECT in the gcloud CLI tool:

  ```bash
  gcloud config set project ${KF_PROJECT}
  ```



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
    gcloud container clusters get-credentials "${KF_NAME}" --zone "${REGION}" --project "${KF_PROJECT}"
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
  [creation of profiles](/docs/components/multi-tenancy/getting-started/#automatic-profile-creation).

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

Your Kubeflow application directory `gcp-blueprints/kubeflow` contains the following files and
directories:

* **Makefile** is a file that defines rules to automate deployment process. You can refer to [GNU make documentation](https://www.gnu.org/software/make/manual/make.html#Introduction) for more introduction. The Makefile we provide is designed to be user maintainable. You are encouraged to read, edit and maintain it to suit your own deployment customization needs.

* **apps**, **common**, **contrib** are a series of independent components  directory containing kustomize packages for deploying Kubeflow components. The structure is to align with upstream [kubeflow/manifests](https://github.com/kubeflow/manifests).

  * [kubeflow/gcp-blueprints](https://github.com/kubeflow/gcp-blueprints) repository only stores `kustomization.yaml` and `patches` for Google Cloud specific resources.

  * `./pull_upstream.sh` will pull `kubeflow/manifests` and store manifests in `upstream` folder of each component in this guide. [kubeflow/gcp-blueprints](https://github.com/kubeflow/gcp-blueprints) repository doesn't store the copy of upstream manifests.

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
  [end-to-end MNIST tutorial](https://github.com/kubeflow/examples/blob/master/mnist/mnist_gcp.ipynb) or the
  [GitHub issue summarization Pipelines
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization/pipelines).
* Learn how to [delete your Kubeflow deployment using the CLI](/docs/distributions/gke/deploy/delete-cli/).
* To add users to Kubeflow, go to [a dedicated section in Customizing Kubeflow on GKE](/docs/distributions/gke/customizing-gke/#add-users-to-kubeflow).
* To taylor your Kubeflow deployment on GKE, go to [Customizing Kubeflow on GKE](/docs/distributions/gke/customizing-gke/).
* For troubleshooting Kubeflow deployments on GKE, go to the [Troubleshooting deployments](/docs/distributions/gke/troubleshooting-gke/) guide.
