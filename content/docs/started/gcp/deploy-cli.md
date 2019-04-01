+++
title = "Deploy using CLI"
description = "Instructions for deploying Kubeflow with the CLI"
weight = 4
+++


If you prefer to have more control over the deployment process and 
configuration, you can use the `kfctl` command line tool instead of 
the UI to deploy Kubeflow.

Before installing Kubeflow on the command line:

  * Ensure you have installed 
    [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  * If you're using
    [Cloud Shell](https://cloud.google.com/shell/), enable 
    [boost mode](https://cloud.google.com/shell/docs/features#boost_mode).

Follow these steps to deploy Kubeflow:

1. Create user credentials. You only need to run this command once:
   
   ```
   gcloud auth application-default login
   ```

1. Create environment variables for your access control services:

    ```bash
    # If using IAP, create environment variables from the OAuth client ID and
    # secret that you obtained earlier:
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>

    # If using basic auth, create environment variables for username/password:
    export KUBEFLOW_USERNAME=<your username>
    export KUBEFLOW_PASSWORD=<your password>
    ```

1. Download a kfctl release from the [GitHub releases](https://github.com/kubeflow/kubeflow/releases/)

1. Unpack the tar ball

   ```
    tar -xvf kfctl_${TAG}_${PLATFORM}.tar.gz
   ```

    * For subsequent steps either add the binary kfctl to your path or else use the full path to the kfctl binary.

1. Run the following commands to set up and deploy Kubeflow:

    ```bash
    # This is optional - to make kfctl bin easier to use.
    export PATH=$PATH:${KUBEFLOW_SRC}/bootstrap/bin

    export KFAPP=<YOUR CHOICE OF APPLICATION DIRECTORY NAME>
    # Default will be using IAP.
    kfctl init ${KFAPP} --platform gcp --project ${PROJECT}
    # or if you want to use basic auth:
    kfctl init ${KFAPP} --platform gcp --project ${PROJECT} --use_basic_auth -V

    cd ${KFAPP}
    kfctl generate all -V
    kfctl apply all -V
    ```
   * **${KFAPP}** - the _name_ of a directory where you want kubeflow 
     configurations to be stored. This directory is created when you run init.
     The value of this variable cannot be greater than 25 characters. It must
     contain just the directory name, not the full path to the directory.
     The value of this variable becomes the name of your deployment.
     The contents of this directory are described in the next section.
   * **${PROJECT}** - the _name_ of the GCP project where you want kubeflow deployed to.
   * During `kfctl init` you need to choose to use either IAP or basic auth.
   * `kfctl generate all` will try to fetch user email address from your 
     credential. If it can't find a valid email address, you need to pass a
     valid email address with flag `--email <your email address>`. This email 
     address will be configured to be an admin of your kubeflow deployment.

1. Check the resources deployed in namespace `kubeflow`:

    ```
    kubectl -n kubeflow get  all
    ```
1. Storage will be a separete deployment. After `kfctl apply` you should notice
   there will be 2 deployments(clusters):
   * **{KFAPP}-storage**: This deployment has persistent volumes for your
     pipelines.
   * **{KFAPP}**: This deployment has all the components Kubeflow provides.

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
    # If you want to delete all the resources, including storage.
    kfctl delete all --delete_storage
    # If you want to preserve storage, which contains metadata and information
    # from mlpipeline.
    kfctl delete all
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

* **app.yaml** defines configurations related to your Kubeflow deployment.

  * The values are set when you run `kfctl init`.
  * The values are snapshotted inside **app.yaml** to make your app 
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
