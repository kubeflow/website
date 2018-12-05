+++
title = "Kubernetes Engine for Kubeflow"
description = "Get Kubeflow running on Google Cloud Platform"
weight = 10
toc = true
bref = "This guide is a quickstart to deploying Kubeflow on Google Kubernetes Engine (GKE)."

[menu.docs]
  parent = "started"
  weight = 3
+++

## Advantages of Kubeflow on GKE

Running Kubeflow on [GKE](https://cloud.google.com/kubernetes-engine/docs)
brings the following advantages:

  * We use [Deployment Manager](https://cloud.google.com/deployment-manager/docs/) to
    declaratively manage all non K8s resources (including the Kubernetes Engine cluster), which is easy to customize for your particular use case
  * You can take advantage of Kubernetes Engine autoscaling to scale your cluster horizontally and vertically
    to meet the demands of ML workloads with large resource requirements
  * [Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/) makes it easy to securely connect to Jupyter and other
    web apps running as part of Kubeflow
  * [Stackdriver](https://cloud.google.com/logging/docs/) makes it easy to persist logs to aid in debugging
    and troubleshooting
  * GPUs and [TPUs](https://cloud.google.com/tpu/) can be used to accelerate your work

## Prerequisites

  * Ensure [ksonnet](https://ksonnet.io/#get-started) version meets Kubeflow [requirements](/docs/guides/requirements)
  * Enable [boost mode](https://cloud.google.com/shell/docs/features#boost_mode) to deploy using the [cloud shell](https://cloud.google.com/shell/)
  * Ensure the following APIs are enabled:
    * [Compute Engine](https://console.cloud.google.com/apis/library/compute.googleapis.com)
    * [Kubernetes Engine](https://console.cloud.google.com/apis/library/container.googleapis.com)
    * [Identity and Access Management (IAM)](https://console.cloud.google.com/apis/library/iam.googleapis.com)
    * [Deployment Manager](https://console.cloud.google.com/apis/library/deploymentmanager.googleapis.com)


You do not need a running GKE cluster. A cluster will be created when you execute the command `kfctl.sh apply platform`.

## Create oauth client credentials

Create an OAuth client ID to be used to identify Cloud IAP when requesting access to user's email to verify their identity.

1. Set up your OAuth consent screen:
   * Configure the [consent screen](https://console.cloud.google.com/apis/credentials/consent).
   * Under **Email address**, select the address that you want to display as a public contact. You must use either your email address or a Google Group that you own.
   * In the **Product name** box, enter a suitable name like `kubeflow`.
   * If you see **Authorized domains**, enter

        ```
        <project>.cloud.goog
        ```
        * where \<project\> is your Google Cloud Platform (GCP) project ID.
        * If you are using your own domain e.g. **acme.com** you should add that as well
        * The **Authorized domains** option appears only for certain project configurations. If you don't see the option, then there's nothing you need to set.        
   * Click Save.
   * Here's a screenshot
   
     ![consent-screen](/docs/images/consent-screen.png)
1. On the [Credentials](https://console.cloud.google.com/apis/credentials) screen:
   * Click **Create credentials**, and then click **OAuth client ID**.
   * Under **Application type**, select **Web application**.
   * In the **Name** box enter any name.
   * In the **Authorized redirect URIs** box, enter the following:

        ```
        https://<name>.endpoints.<project>.cloud.goog/_gcp_gatekeeper/authenticate
        ```
        * `<name>` and `<project>` must have the same values as set in the next
          step when you run the deployment script.
        * The deployment default for `<name>` is the `KFAPP` value used when initializing your Kubeflow app, but you can configure this with the environment variable `DEPLOYMENT_NAME`.
        * `<project>` is your GCP project.
    * Here's what the form should look like

      ![oauth-credential](/docs/images/oauth-credential.png)

1. Click **Create**.
1. Make note of the **client ID** and **client secret** that appear in the OAuth
  client window. You need them later to enable Cloud IAP.
1. Create environment variables from the OAuth client ID and secret:

    ```
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>
    ```

## Deploy Kubeflow on GKE using the UI

1. Open [https://deploy.kubeflow.cloud/](https://deploy.kubeflow.cloud/#/deploy) in your web browser.
1. Sign in using a GCP account with admin privileges for your GCP project.
1. Complete the form.
1. Click **Create Deployment**.

## Deploy Kubeflow on GKE using the command line

Run the following steps to deploy Kubeflow:

1. Run the following script to download `kfctl.sh`:

    ```
    mkdir ${KUBEFLOW_SRC}
    cd ${KUBEFLOW_SRC}
    export KUBEFLOW_TAG={{% kf-stable-tag %}}
    curl https://raw.githubusercontent.com/kubeflow/kubeflow/${KUBEFLOW_TAG}/scripts/download.sh | bash
     ```
   * **KUBEFLOW_SRC** a directory where you want to download the source to
   * **KUBEFLOW_TAG** a tag corresponding to the version to checkout such as `master` for latest code.
   * **Note** you can also just clone the repository using git.
1. Run the following scripts to set up and deploy Kubeflow:

    ```
    ${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform gcp --project ${PROJECT}
    cd ${KFAPP}
    ${KUBEFLOW_SRC}/scripts/kfctl.sh generate platform
    ${KUBEFLOW_SRC}/scripts/kfctl.sh apply platform
    ${KUBEFLOW_SRC}/scripts/kfctl.sh generate k8s
    ${KUBEFLOW_SRC}/scripts/kfctl.sh apply k8s
    ```
   * **${KFAPP}** the _name_ of a directory where you want kubeflow configurations to be stored. This directory will be created when you run init.
      * The contents of this directory are described in the next section.
1. Check resources deployed in namespace `kubeflow`:

    ```
    kubectl -n kubeflow get  all
    ```
1. Kubeflow will be available at the following URI:

    ```
    https://<name>.endpoints.<project>.cloud.goog/
    ```
   * It can take 10-15 minutes for the endpoint to become available.
     * Kubeflow needs to provision a signed SSL certificate and register a DNS name.
   * If you own/manage the domain or a subdomain with [Cloud DNS](https://cloud.google.com/dns/docs/)
     then you can configure this process to be much faster.
     * See [kubeflow/kubeflow#731](https://github.com/kubeflow/kubeflow/issues/731).
   * While you wait you can access Kubeflow services by using `kubectl proxy` and `kubectl port-forward` to connect to services in the cluster.
1. We recommend checking in the contents of **${KFAPP}** into source control.
1. To delete your deployment and reclaim all resources:

    ```
    cd ${KFAPP}
    ${KUBEFLOW_SRC}/scripts/kfctl.sh delete all
    ```

## Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time setup.
* **generate** - Creates config files defining the different resources.
* **apply** - Create or update the resources.
* **delete** - Delete the resources.

With the exception of `init`, all commands take an argument which describes the
set of resources to apply the command to; this argument can be one of the
following:

* **platform** - All GCP resources; that is, anything that doesn't run on Kubernetes.
* **k8s** - All resources that run on Kubernetes.
* **all** - GCP and Kubernetes resources.

### App layout

Your Kubeflow app directory contains the following files and directories:

* **env.sh** defines several environment variables related to your Kubeflow deployment.

  * The values are set when you run `init`.
  * The values are snapshotted inside **env.sh** to make your app self contained.

* **${KFAPP}/gcp_config** is a directory that contains [Deployment Manager config Files](https://cloud.google.com/deployment-manager/docs/configuration/) defining your GCP infrastructure.

  * The directory is created when you run `kfctl.sh generate platform`.
  * You can modify these configs to customize your GCP infrastructure.

* **${KFAPP}/k8s_specs** is a directory that contains YAML specs for some daemons deployed on your Kubernetes Engine cluster.

* **${KFAPP}/ks_app** is a directory that contains the ksonnet application for Kubeflow.

  * The directory is created when you run `kfctl.sh generate k8s`.
  * You can use ksonnet to customize Kubeflow.

### GCP service accounts

Creating a deployment using `kfctl.sh` creates three service accounts in the GCP project. These service accounts are created using the principle of least privilege. The three service accounts are:

* `${KFAPP}-admin`
* `${KFAPP}-user`
* `${KFAPP}-vm`

`${KFAPP}-admin` is used for some admin tasks like configuring the load balancers. The idea here is that it's needed to deploy Kubeflow but not needed to actually run jobs.

`${KFAPP}-user` is intended to be used by training jobs and models to access GCP resources (GCS, BigQuery, etc...). It has a much smaller set of privileges compared to admin.

`${KFAPP}-vm` is used only for the VM service account. It has minimal permissions to send metrics and logs to Stackdriver.

## Next steps

See how to [customize](/docs/guides/gke/customizing-gke) or 
[troubleshoot](/docs/guides/gke/troubleshooting-gke) your Kubeflow deployment on
GKE.
