+++
title = "Deploy using CLI"
description = "Instructions for using the CLI to deploy Kubeflow on Google Cloud Platform (GCP)"
weight = 4
+++

This guide describes how to use the `kfctl` command line interface (CLI) to
deploy Kubeflow on GCP. The command line deployment gives you more control over
the deployment process and configuration than you get if you use the deployment 
UI. If you're looking for a simpler deployment procedure, see how to deploy 
Kubeflow [using the deployment UI](/docs/gke/deploy/deploy-ui).

## Before you start

Before installing Kubeflow on the command line:

1. Ensure you have installed the following tools:
  
  * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
  * [gcloud](https://cloud.google.com/sdk/). If you already have `gcloud`
    installed, run `gcloud components update` to
     get the latest version of all your installed Cloud SDK components.

1. If you're using
  [Cloud Shell](https://cloud.google.com/shell/), enable 
  [boost mode](https://cloud.google.com/shell/docs/features#boost_mode).

1. If you want to use [Cloud Identity-Aware Proxy (Cloud 
  IAP)](https://cloud.google.com/iap/docs/) for access control, follow the guide
  to [setting up OAuth credentials](/docs/gke/deploy/oauth-setup/). 
  Cloud IAP is recommended for production deployments or deployments with 
  access to sensitive data. Alternatively, you can use basic authentication 
  with a username and password.

<a id="prepare-environment"></a>
## Prepare your environment

Follow these steps to download kfctl (the Kubeflow installer) and set some handy
environment variables:


1. Download a kfctl release from the 
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

1. Create user credentials. You only need to run this command once:
   
    ```
    gcloud auth application-default login
    ```

1. Create environment variables to make the deployment process easier:

    ```
    # Set your GCP project ID and the zone where you want to create 
    # the Kubeflow deployment:
    export PROJECT=<your GCP project ID>
    gcloud config set project ${PROJECT}
    export ZONE=<your GCP zone>
    gcloud config set compute/zone ${ZONE}

    # Use the following kfctl configuration file for authentication with 
    # Cloud IAP (recommended):
    export CONFIG="{{% config-uri-gcp-iap %}}"
    # If using Cloud IAP for authentication, create environment variables
    # from the OAuth client ID and secret that you obtained earlier:
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>

    # Alternatively, use the following kfctl configuration if you want to use 
    # basic authentication:
    export CONFIG="{{% config-uri-gcp-basic-auth %}}"
    # If using basic authentication, create environment variables
    # for username and password:
    export KUBEFLOW_USERNAME=<your username>
    export KUBEFLOW_PASSWORD=<your password>

    # Set KFAPP to the name of your Kubeflow application. This will be the
    # name of the application directory too. See the detailed
    # description in the text below this code snippet.
    # For example, your app name can be  'kubeflow-test' or 'kfw-test'.
    export KFAPP=<your choice of application directory name>

    # The following command is optional. It adds the kfctl binary to your path.
    # If you don't add kfctl to your path, you must use the full path
    # each time you run kfctl.
    export PATH=$PATH:<path to your kfctl file>
    ```

<a id="set-up-and-deploy"></a>
## Set up and deploy Kubeflow

To set up and deploy Kubeflow using the **default settings**,
run the **apply** command:

```
mkdir ${KFAPP}
cd ${KFAPP}
kfctl apply -V -f ${CONFIG}
```

Alternatively, you can set up your configuration files without deploying 
Kubeflow, so that you can customize the configuration before deployment:

1. Run the **build** command to set up your configuration:

  ```
  mkdir ${KFAPP}
  cd ${KFAPP}
  kfctl build -V -f ${CONFIG}
  ```

1. Edit the configuration files, as described in the guide to
  [customizing your Kubeflow deployment](/docs/gke/customizing-gke).
1. When you have finished editing the configuration, run the **apply**
  command to deploy Kubeflow:

  ```
  kfctl apply -V -f ${CONFIG}
  ```

Notes:

* **${KFAPP}** - The _name_ of a directory where you want Kubeflow 
  configurations to be stored. 
  If you want a custom deployment name, specify that name here.
  The value of this variable becomes the name of your deployment.
  The value of KFAPP must consist of lower case alphanumeric characters or
  '-', and must start and end with an alphanumeric character.
  For example,  `kubeflow-test` or `kfw-test`.
  The value of this variable cannot be greater than 25 characters. It must
  contain just the directory name, not the full path to the directory.
  The content of this directory is described in the next section.
* **${PROJECT}** - The project ID of the GCP project where you want Kubeflow 
  deployed.
* **${ZONE}** - The GCP zone where you want to create the Kubeflow deployment.
  You can see a list of zones in the 
  [Compute Engine documentation](https://cloud.google.com/compute/docs/regions-zones/#available).
  If you plan to use accelerators, make sure to pick a zone that supports the 
  type you want.
* `kfctl apply` attempts to fetch your email address from your 
  credential. If it can't find a valid email address, you must use the
  flag `--email <your email address>` to pass a valid email address. This email 
  address becomes an administrator in the configuration of your Kubeflow 
  deployment.

## Check your deployment

Follow these steps to verify the deployment:

1. The deployment process creates a separate deployment for your data storage. 
   After running `kfctl apply` you should notice two new 
   [deployments](https://console.cloud.google.com/dm/deployments):
   * **{KFAPP}-storage**: This deployment has persistent volumes for your
     pipelines.
   * **{KFAPP}**: This deployment has all the components of Kubeflow, including 
     a [GKE cluster](https://console.cloud.google.com/kubernetes/list) 
     named **${KFAPP}** with Kubeflow installed.

1. When the deployment finishes, check the resources installed in the namespace
   `kubeflow` in your new cluster.  To do this from the command line, first set 
   your `kubectl` credentials to point to the new cluster:

    ```
    gcloud container clusters get-credentials ${KFAPP} --zone ${ZONE} --project ${PROJECT}
    ```

    Then see what's installed in the `kubeflow` namespace of your GKE cluster:

    ```
    kubectl -n kubeflow get all
    ```

## Access the Kubeflow user interface (UI)

Access the Kubeflow central dashboard at the following URI when it becomes
available:

```
https://<KFAPP>.endpoints.<project-id>.cloud.goog/
```

It can take 20 minutes for the URI to become available.
Kubeflow needs to provision a signed SSL certificate and register a DNS 
name.

If you own/manage the domain or a subdomain with 
[Cloud DNS](https://cloud.google.com/dns/docs/)
then you can configure this process to be much faster.
See [kubeflow/kubeflow#731](https://github.com/kubeflow/kubeflow/issues/731).

## Understanding the deployment process

The `kfctl` deployment process includes the following commands:

* **build** - (Optional) Creates configuration files defining the various 
  resources in your deployment. You only need to run `kfctl build` if you want 
  to edit the resources before running `kfctl apply`. See the guide to
  [customizing your Kubeflow deployment](/docs/gke/customizing-gke).
* **apply** - Creates or updates the resources.
* **delete** - Deletes the resources.

### App layout

Your Kubeflow app directory **${KFAPP}** contains the following files and 
directories:

* **app.yaml** defines configurations related to your Kubeflow deployment.

  * The values are set when you run `kfctl build` or `kfctl apply`.
  * The values are snapshotted inside **app.yaml** to make your app 
    self contained.

* **gcp_config** is a directory that contains 
  [Deployment Manager configuration files](https://cloud.google.com/deployment-manager/docs/configuration/) 
  defining your GCP infrastructure.

  * The directory is created when you run `kfctl build` or `kfctl apply`.
  * You can modify these configurations to customize your GCP infrastructure.
    After modifying a configuration, run `kfctl apply` again.

* **kustomize** is a directory that contains the kustomize packages for Kubeflow 
  applications. See 
  [how Kubeflow uses kustomize](/docs/other-guides/kustomize/).

  * The directory is created when you run `kfctl build` or `kfctl apply`.
  * You can customize the Kubernetes resources by modifying the manifests and 
    running `kfctl apply` again.

We recommend that you check in the contents of your **${KFAPP}** directory
into source control.

### GCP service accounts

Creating a deployment using `kfctl` creates three service accounts in your 
GCP project. These service accounts are created using the [principle of least 
privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege). 
The three service accounts are:

* `${KFAPP}-admin` is used for some admin tasks like configuring the load 
  balancers. The principle is that this account is needed to deploy Kubeflow but 
  not needed to actually run jobs.
* `${KFAPP}-user` is intended to be used by training jobs and models to access 
  GCP resources (Cloud Storage, BigQuery, etc.). This account has a much smaller 
  set of privileges compared to `admin`.
* `${KFAPP}-vm` is used only for the virtual machine (VM) service account. This
  account has the minimal permissions needed to send metrics and logs to 
  [Stackdriver](https://cloud.google.com/stackdriver/).

## Next steps

* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/gke/gcp-e2e/) or the
  [GitHub issue summarization 
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization).
* See how to [delete](/docs/gke/deploy/delete-cli) your Kubeflow deployment 
  using the CLI.
* See how to [customize](/docs/gke/customizing-gke) your Kubeflow 
  deployment.
* See how to [upgrade Kubeflow](/docs/upgrading/upgrade/) and how to 
  [upgrade or reinstall a Kubeflow Pipelines 
  deployment](/docs/pipelines/upgrade/).
* [Troubleshoot](/docs/gke/troubleshooting-gke) any issues you may
  find.
