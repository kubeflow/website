+++
title = "Kubernetes Engine for Kubeflow"
description = "Get Kubeflow running on Google Cloud Platform"
weight = 3
+++

This guide is a quickstart to deploying Kubeflow on Google Kubernetes Engine 
(GKE).

## Advantages of Kubeflow on GKE

Running Kubeflow on [GKE](https://cloud.google.com/kubernetes-engine/docs)
brings the following advantages:

  * You use
    [Deployment Manager](https://cloud.google.com/deployment-manager/docs/) to
    declaratively manage all non-Kubernetes resources (including the GKE 
    cluster). Deployment Manager is easy to customize for your particular use
    case.
  * You can take advantage of GKE autoscaling to scale your cluster horizontally 
    and vertically to meet the demands of machine learning (ML) workloads with 
    large resource requirements.
  * [Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/) 
    makes it easy to securely connect to Jupyter and other
    web apps running as part of Kubeflow.
  * [Stackdriver](https://cloud.google.com/logging/docs/) makes it easy to 
    persist logs to aid in debugging and troubleshooting
  * You can use GPUs and [TPUs](https://cloud.google.com/tpu/) to accelerate 
    your workload.

## Prerequisites

Ensure that the following APIs are enabled on your Google Cloud Platform (GCP)
account:

  * [Compute Engine](https://console.cloud.google.com/apis/library/compute.googleapis.com)
  * [GKE](https://console.cloud.google.com/apis/library/container.googleapis.com)
  * [Identity and Access Management (IAM)](https://console.cloud.google.com/apis/library/iam.googleapis.com)
  * [Deployment Manager](https://console.cloud.google.com/apis/library/deploymentmanager.googleapis.com)

You do not need a running GKE cluster. The deployment process will create a
cluster for you.

## Create OAuth client credentials

Create an OAuth client ID to be used to identify Cloud IAP when requesting 
access to a user's email account. Kubeflow uses the email address to verify the
user's identity.

1. Set up your OAuth [consent screen](https://console.cloud.google.com/apis/credentials/consent):
   * In the **Application name** box, enter the name of your application.
     The example below uses the name "Kubeflow".
   * Under **Support email**, select the email address that you want to display 
     as a public contact. You must use either your email address or a Google 
     Group that you own.
   * If you see **Authorized domains**, enter

        ```
        <project>.cloud.goog
        ```
        * where \<project\> is your Google Cloud Platform (GCP) project ID.
        * If you are using your own domain, such as **acme.com**, you should add 
          that as well
        * The **Authorized domains** option appears only for certain project 
          configurations. If you don't see the option, then there's nothing you 
          need to set.        
   * Click **Save**.
   * Here's an example of the completed form:   
    <img src="/docs/images/consent-screen.png" 
      alt="OAuth consent screen"
      class="mt-3 mb-3 p-3 border border-info rounded">

1. On the [credentials tab](https://console.cloud.google.com/apis/credentials):
   * Click **Create credentials**, and then click **OAuth client ID**.
   * Under **Application type**, select **Web application**.
   * In the **Name** box enter any name for your OAuth client ID. This is *not*
     the name of your application nor the name of your Kubeflow deployment. It's
     just a way to help you identify the OAuth client ID.
   * In the **Authorized redirect URIs** box, enter the following:

        ```
        https://<deployment_name>.endpoints.<project>.cloud.goog/_gcp_gatekeeper/authenticate
        ```
        * `<deployment_name>` must be the name of your Kubeflow deployment. It 
          must have the same value as the deployment name used in the next step 
          when you deploy Kubeflow from the UI or by running the deployment
          script. **Deployment name must be 4-20 characters long.**
          The default value for the deployment name is the `KFAPP` value 
          used when initializing your Kubeflow app, but you can configure this 
          with the environment variable `DEPLOYMENT_NAME`.
        * `<project>` is your GCP project. It must have the same value as used 
           in the next step when you deploy Kubeflow from the UI or by running 
           the deployment script.
    * Here's an example of the completed form:
      <img src="/docs/images/oauth-credential.png" 
        alt="OAuth credentials"
        class="mt-3 mb-3 p-3 border border-info rounded">

1. Press **Enter/Return** to add the URI. Check that the URI now appears as
  a confirmed item under **Authorized redirect URIs**. (It should no longer be
  editable.)
1. Make note of the **client ID** and **client secret** that appear in the OAuth
  client window. You need them later to enable Cloud IAP.

## Deploy Kubeflow on GKE using the UI

The simplest way to deploy Kubeflow is to use the Kubeflow deployment
web interface:

1. Open [https://deploy.kubeflow.cloud/](https://deploy.kubeflow.cloud/#/deploy)
  in your web browser.
1. Sign in using a GCP account that has administrator privileges for your 
  GCP project.
1. Complete the form, following the instructions on the left side of the form.
  In particular, ensure that you enter the same **deployment name** as you used
  when creating the OAuth client ID.
1. Click **Create Deployment**.

Here's a partial screenshot of the deployment UI, showing all the fields in the 
form:

<img src="/docs/images/kubeflow-deployment.png" 
  alt="Kubeflow deployment UI"
  class="mt-3 mb-3 border border-info rounded">

Kubeflow will be available at the following URI:

```
https://<deployment_name>.endpoints.<project>.cloud.goog/
```

It can take 10-15 minutes for the URI to become available. You can watch
for updates in the information box on the deployment UI. If the deployment
takes longer than expected, try accessing the above URI anyway.

### Deleting your Kubeflow deployment

To delete your Kubeflow deployment and reclaim all related resources, using the
GCP Console:

1. Open the [Deployment Manager in the GCP
   Console](https://console.cloud.google.com/dm/deployments) for your project.
   Deployment Manager lists all the available deployments
   in your project. Make sure that the selected project is the same as the one
   you used for your Kubeflow deployment. 
   <img src="/docs/images/deployments.png"
   alt="Deployment Manager in GCP Console"
   class="mt-3 mb-3 border border-info rounded">

1. Select your Kubeflow deployment with the deployment name you used at the
   time of creation and click the **Delete** button at the top.
   <img src="/docs/images/delete-deployment.png"
   alt="Deleting Kubeflow deployment in GCP Console"
   class="mt-3 mb-3 border border-info rounded">

This action should delete any running nodes in your deployment, delete service
accounts that were created for the deployment, and reclaim all resources.

## Deploy Kubeflow on GKE using the command line

If you prefer to have more control over the deployment process and 
configuration, you can use the command line instead of the UI to deploy 
Kubeflow.

Before installing Kubeflow on the command line:

  * Ensure you have installed ksonnet version 
    {{% ksonnet-min-version %}} or later. See the
    [ksonnet component guide](/docs/components/ksonnet) for help with
    installing ksonnet.
  * Ensure you have installed [pyyaml](https://pyyaml.org/).
  * If you're using
    [Cloud Shell](https://cloud.google.com/shell/), enable 
    [boost mode](https://cloud.google.com/shell/docs/features#boost_mode).

Follow these steps to deploy Kubeflow:

1. Create environment variables from the OAuth client ID and secret that you
  obtained earlier:

    ```
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>
    ```

1. Run the following commands to download `kfctl.sh`:

    ```
    export KUBEFLOW_SRC=<FULL PATH TO YOUR CHOICE OF DOWNLOAD DIRECTORY>
    mkdir ${KUBEFLOW_SRC}
    cd ${KUBEFLOW_SRC}
    export KUBEFLOW_TAG={{% kf-stable-tag %}}
    curl https://raw.githubusercontent.com/kubeflow/kubeflow/${KUBEFLOW_TAG}/scripts/download.sh | bash
     ```
   * **KUBEFLOW_SRC** - A directory where you want to download the source to.
     This value must include the full path to the directory.
   * **KUBEFLOW_TAG** - A tag corresponding to the Kubeflow version to check 
     out, such as `master` for the latest code.
   * **Note:** You can also just clone the 
     [Kubeflow repository](https://github.com/kubeflow/kubeflow) using `git`.

1. Run the following scripts to set up and deploy Kubeflow:

    ```
    export KFAPP=<YOUR CHOICE OF APPLICATION DIRECTORY NAME>
    ${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform gcp --project ${PROJECT}
    cd ${KFAPP}
    ${KUBEFLOW_SRC}/scripts/kfctl.sh generate platform
    ${KUBEFLOW_SRC}/scripts/kfctl.sh apply platform
    ${KUBEFLOW_SRC}/scripts/kfctl.sh generate k8s
    ${KUBEFLOW_SRC}/scripts/kfctl.sh apply k8s
    ```
   * **${KFAPP}** - the _name_ of a directory where you want kubeflow 
     configurations to be stored. This directory is created when you run init.
     The value of this variable cannot be greater than 25 characters. It must
     contain just the directory name, not the full path to the directory.
     The value of this variable becomes the name of your deployment.
     The contents of this directory are described in the next section.

1. Check the resources deployed in namespace `kubeflow`:

    ```
    kubectl -n kubeflow get  all
    ```

1. Kubeflow will be available at the following URI:

    ```
    https://<deployment_name>.endpoints.<project>.cloud.goog/
    ```
   * It can take 10-15 minutes for the URI to become available.
     Kubeflow needs to provision a signed SSL certificate and register a DNS 
     name.
   * If you own/manage the domain or a subdomain with 
     [Cloud DNS](https://cloud.google.com/dns/docs/)
     then you can configure this process to be much faster.
     See [kubeflow/kubeflow#731](https://github.com/kubeflow/kubeflow/issues/731).
   * While you wait you can access Kubeflow services by using `kubectl proxy` 
     and `kubectl port-forward` to connect to services in the cluster.

1. We recommend that you check in the contents of your **${KFAPP}** directory
  into source control.
1. To delete your deployment and reclaim all resources:

    ```
    cd ${KFAPP}
    ${KUBEFLOW_SRC}/scripts/kfctl.sh delete all
    ```

## Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time setup.
* **generate** - creates config files defining the various resources.
* **apply** - creates or updates the resources.
* **delete** - deletes the resources.

With the exception of `init`, all commands take an argument which describes the
set of resources to apply the command to; this argument can be one of the
following:

* **platform** - all GCP resources; that is, anything that doesn't run on 
  Kubernetes.
* **k8s** - all resources that run on Kubernetes.
* **all** - GCP and Kubernetes resources.

### App layout

Your Kubeflow app directory contains the following files and directories:

* **env.sh** defines several environment variables related to your Kubeflow
  deployment.

  * The values are set when you run `init`.
  * The values are snapshotted inside **env.sh** to make your app 
    self contained.

* **${KFAPP}/gcp_config** is a directory that contains 
  [Deployment Manager configuration files](https://cloud.google.com/deployment-manager/docs/configuration/) 
  defining your GCP infrastructure.

  * The directory is created when you run `kfctl.sh generate platform`.
  * You can modify these configurations to customize your GCP infrastructure.

* **${KFAPP}/k8s_specs** is a directory that contains YAML specifications
  for some daemons deployed on your Kubernetes Engine cluster.

* **${KFAPP}/ks_app** is a directory that contains the 
  [ksonnet](https://ksonnet.io) application for Kubeflow.

  * The directory is created when you run `kfctl.sh generate k8s`.
  * You can use ksonnet to customize Kubeflow.

### GCP service accounts

Creating a deployment using `kfctl.sh` creates three service accounts in your 
GCP project. These service accounts are created using the principle of least 
privilege. The three service accounts are:

* `${KFAPP}-admin` is used for some admin tasks like configuring the load 
  balancers. The principle is that this account is needed to deploy Kubeflow but 
  not needed to actually run jobs.
* `${KFAPP}-user` is intended to be used by training jobs and models to access 
  GCP resources (Cloud Storate, BigQuery, etc.). This account has a much smaller 
  set of privileges compared to `admin`.
* `${KFAPP}-vm` is used only for the virtual machine (VM) service account. This
  account has minimal permissions, needed to send metrics and logs to 
  [Stackdriver](https://cloud.google.com/stackdriver/).

## Next steps

* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/gke/gcp-e2e/) or the
  [GitHub issue sumarization 
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization).
* See how to [customize](/docs/gke/customizing-gke) your Kubeflow 
  deployment on GKE.
* See how to [upgrade Kubeflow](/docs/other-guides/upgrade/) and how to 
  [upgrade or reinstall a Kubeflow Pipelines 
  deployment](/docs/pipelines/upgrade/).
* [Troubleshoot](/docs/gke/troubleshooting-gke) any issues you may
  find.
