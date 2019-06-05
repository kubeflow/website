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
  
    * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
    * [gcloud](https://cloud.google.com/sdk/)

1. If you're using
  [Cloud Shell](https://cloud.google.com/shell/), enable 
  [boost mode](https://cloud.google.com/shell/docs/features#boost_mode).

1. If you want to use [Cloud Identity-Aware Proxy (Cloud 
  IAP)](https://cloud.google.com/iap/docs/) for access control, follow the guide
  to [setting up OAuth credentials](/docs/gke/deploy/oauth-setup/). 
  Cloud IAP is recommended for production deployments or deployments with 
  access to sensitive data. Alternatively, you can use basic authentication 
  with a username and password.

## Deploy Kubeflow

Follow these steps to deploy Kubeflow:

1. Create user credentials. You only need to run this command once:
   
    ```
    gcloud auth application-default login
    ```

1. Create environment variables for your access control services:

    ```bash
    # If using Cloud IAP, create environment variables from the
    # OAuth client ID and secret that you obtained earlier:
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>

    # If using basic authentication, create environment variables for
    # username and password:
    export KUBEFLOW_USERNAME=<your username>
    export KUBEFLOW_PASSWORD=<your password>
    ```

1. Download a `kfctl` release from the 
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

1. Run the following commands to set up and deploy Kubeflow. The code below
  includes an optional command to add the binary `kfctl` to your path. If you 
  don't add the binary to your path, you must use the full path to the `kfctl` 
  binary each time you run it.

    ```bash
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to kfctl in your kubeflow installation>
    export ZONE=<your target zone> #where the deployment will be created

    export PROJECT=<your GCP project>
    # The value of KFAPP must consist of lower case alphanumeric characters or '-', and must start and end with an alphanumeric character (e.g. 'kubeflow-test',  or 'kfc-test'
    export KFAPP=<your choice of application directory name>
    # Default uses Cloud IAP:
    kfctl init ${KFAPP} --platform gcp --project ${PROJECT}
    # Alternatively, use this command if you want to use basic authentication:
    kfctl init ${KFAPP} --platform gcp --project ${PROJECT} --use_basic_auth -V
    
    cd ${KFAPP}
    kfctl generate all -V --zone ${ZONE}
    kfctl apply all -V
    ```
   * **${KFAPP}** - the _name_ of a directory where you want Kubeflow 
     configurations to be stored. This directory is created when you run
     `kfctl init`. If you want a custom deployment name, specify that name here.
     The value of this variable becomes the name of your deployment.
     The value of this variable cannot be greater than 25 characters. It must
     contain just the directory name, not the full path to the directory.
     The content of this directory is described in the next section.
   * **${PROJECT}** - the _name_ of the GCP project where you want Kubeflow 
     deployed.
   * When you run `kfctl init` you need to choose to use either IAP or basic 
     authentication, as described below.
   * `kfctl generate all` attempts to fetch your email address from your 
     credential. If it can't find a valid email address, you need to pass a
     valid email address with flag `--email <your email address>`. This email 
     address becomes an administrator in the configuration of your Kubeflow 
     deployment.

1. Check the resources deployed in namespace `kubeflow`:

    ```
    kubectl -n kubeflow get  all
    ```

1. The process creates a separate deployment for your data storage. After 
   running `kfctl apply` you should notice 2 deployments (clusters):
   * **{KFAPP}-storage**: This deployment has persistent volumes for your
     pipelines.
   * **{KFAPP}**: This deployment has all the components of Kubeflow.

1. Kubeflow will be available at the following URI:

    ```
    https://<deployment_name>.endpoints.<project>.cloud.goog/
    ```
   * It can take 20 minutes for the URI to become available.
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

## Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time set up.
* **generate** - creates configuration files defining the various resources.
* **apply** - creates or updates the resources.
* **delete** - deletes the resources.

With the exception of `init`, all commands take an argument which describes the
set of resources to apply the command to. This argument can be one of the
following:

* **platform** - all GCP resources; that is, anything that doesn't run on 
  Kubernetes.
* **k8s** - all resources that run on Kubernetes.
* **all** - GCP and Kubernetes resources.

### App layout

Your Kubeflow app directory contains the following files and directories:

* **app.yaml** defines configurations related to your Kubeflow deployment.

  * The values are set when you run `kfctl init`.
  * The values are snapshotted inside **app.yaml** to make your app 
    self contained.

* **${KFAPP}/gcp_config** is a directory that contains 
  [Deployment Manager configuration files](https://cloud.google.com/deployment-manager/docs/configuration/) 
  defining your GCP infrastructure.

  * The directory is created when you run `kfctl generate platform`.
  * You can modify these configurations to customize your GCP infrastructure.

* **${KFAPP}/k8s_specs** is a directory that contains YAML specifications
  for some daemons deployed on your Kubernetes Engine cluster.

* **${KFAPP}/ks_app** is a directory that contains the 
  [ksonnet](https://ksonnet.io) application for Kubeflow.

  * The directory is created when you run `kfctl generate`.
  * You can use ksonnet to customize Kubeflow.

### GCP service accounts

Creating a deployment using `kfctl` creates three service accounts in your 
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
  [GitHub issue summarization 
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization).
* See how to [delete](/docs/gke/deploy/delete-cli) your Kubeflow deployment 
  using the CLI.
* See how to [customize](/docs/gke/customizing-gke) your Kubeflow 
  deployment.
* See how to [upgrade Kubeflow](/docs/other-guides/upgrade/) and how to 
  [upgrade or reinstall a Kubeflow Pipelines 
  deployment](/docs/pipelines/upgrade/).
* [Troubleshoot](/docs/gke/troubleshooting-gke) any issues you may
  find.
