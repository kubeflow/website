+++
title = "Deploy using kubectl and kpt"
description = "Instructions for using kubectl and kpt to deploy Kubeflow on Google Cloud Platform (GCP)"
weight = 4
+++

This guide describes how to use `kubectl` and [kpt](https://googlecontainertools.github.io/kpt/) to
deploy Kubeflow on GCP.

## Before you start

Before installing Kubeflow on the command line:


1. You must have created a management cluster and installed Config Connector. 

   * If you don't have a management cluster follow the [instructions](../management-setup/)

   * Your management cluster must have a namespace setup to administer the GCP project where
Kubeflow will be deployed. Follow the [instructions](../management-setup/) to create
one if you haven't already.

1. If you're using
  [Cloud Shell](https://cloud.google.com/shell/), enable 
  [boost mode](https://cloud.google.com/shell/docs/features#boost_mode).

1. Make sure that your GCP project meets the minimum requirements
  described in the [project setup guide](/docs/gke/deploy/project-setup/).

1. Follow the guide
  [setting up OAuth credentials](/docs/gke/deploy/oauth-setup/). 
  to create OAuth credentials for [Cloud Identity-Aware Proxy (Cloud 
  IAP)](https://cloud.google.com/iap/docs/).


### Install the required tools

1. Install [gcloud](https://cloud.google.com/sdk/).

1. Install gcloud components

   ```
   gcloud components install kpt anthoscli beta
   gcloud components update
   ```

1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
   
1. Install [yq](https://github.com/mikefarah/yq)

   ```
   GO111MODULE=on go get github.com/mikefarah/yq/v3
   ```

   * If you don't have go installed you can download
     a binary from [yq's GitHub releases](https://github.com/mikefarah/yq/releases).

1. Follow these [instructions](https://cloud.google.com/service-mesh/docs/archive/1.4/docs/gke-install-new-cluster#preparing_to_install_anthos_service_mesh) to
   install istioctl


<a id="prepare-environment"></a>
## Prepare your environment

1. Log in. You only need to run this command once:

    ```
    gcloud auth login
    ```

## Fetch packages using kpt

1. Fetch the blueprint

   ```
   kpt pkg get https://github.com/kubeflow/gcp-blueprints.git/kubeflow@v1.1-branch ./${KFDIR}
   ```

   * You can choose any name you would like for the directory ${KFDIR}

1. Change to the kubeflow directory

   ```
   cd ${KFDIR}
   ```

1. Fetch Kubeflow manifests

   ```
   make get-pkg
   ```

  * This generates an error like the one below but you can ignore it;

    ```  
    kpt pkg get https://github.com/jlewi/manifests.git@blueprints ./upstream
    fetching package / from https://github.com/jlewi/manifests to upstream/manifests
    Error: resources must be annotated with config.kubernetes.io/index to be written to files    
    ```
  
    * This is being tracked in [GoogleContainerTools/kpt#539](https://github.com/GoogleContainerTools/kpt/issues/539) 

## Configure Kubeflow

There are certain parameters that you must define in order to configure how and where
kubeflow is defined. These are described in the table below.

kpt setter | Description |
-----------|-------------|
mgmt-ctxt | This is the name of the KUBECONFIG context for the management cluster; this kubecontext will be used to create CNRM resources for your Kubeflow deployment. **The context must set the namespace to the namespace in your CNRM cluster where you are creating CNRM resources for the managed project.**|
gcloud.core.project| The project you want to deploy in |
location | The zone or region you want to deploy in |
gcloud.compute.region | The region you are deploying in |
gcloud.compute.zone | The zone to use for zonal resources; must be in gcloud.compute.region |

* Location can be a zone or a region depending on whether you want a regional cluster
  
  * Kubeflow pipelines currently doesn't work with regional deployments see [kubeflow/gcp-blueprints#6](https://github.com/kubeflow/gcp-blueprints/issues/6)

* The **Makefile** contains a rule `set-values` with appropriate `kpt cfg` commands to set the values
  of the parameters

* You need to edit the makefile to set the parameters to the desired values.

   * Note there are multiple invocations of `kpt cfg set` on different directories to
     work around [GoogleContainerTools/kpt#541](https://github.com/GoogleContainerTools/kpt/issues/541)      

* You need to configure the kubectl context provided in `mgmt-ctxt`.

  * Choose the management cluster context
    ```bash
    kubectl config use-context ${mgmt-ctxt}
    ```

  * Create a namespace in your management cluster for the managed project if you haven't done so.
    ```bash
    kubectl create namespace ${PROJECT}
    ```

  * Make the managed project's namespace default of the context:
    ```bash
    kubectl config set-context --current --namespace ${PROJECT}
    ```

* If you haven't previously created an OAuth client for IAP then follow
  the [directions](https://www.kubeflow.org/docs/gke/deploy/oauth-setup/) to setup
  your consent screen and oauth client. 

  * Unfortunately [GKE's BackendConfig](https://cloud.google.com/kubernetes-engine/docs/concepts/backendconfig)
    currently doesn't support creating [IAP OAuth clients programmatically](https://cloud.google.com/iap/docs/programmatic-oauth-clients).

*  Set environment variables with OAuth Client ID and Secret for IAP

   ```
   export CLIENT_ID=<Your CLIENT_ID>
   export CLIENT_SECRET=<Your CLIENT_SECRET>
   ```

* Invoke the make rule to set the kpt setters

  ```
  make set-values
  ```

<a id="set-up-and-deploy"></a>
## Deploy Kubeflow

To deploy kubeflow just run

   ```
   make apply
   ```

   * If resources can't be created because `webhook.cert-manager.io` is unavailable wait and
     then rerun `make apply`

     * This issue is being tracked in [kubeflow/manifests#1234](https://github.com/kubeflow/manifests/issues/1234)
    

## Check your deployment

Follow these steps to verify the deployment:

1. When the deployment finishes, check the resources installed in the namespace
   `kubeflow` in your new cluster.  To do this from the command line, first set 
   your `kubectl` credentials to point to the new cluster:

    ```
    gcloud container clusters get-credentials ${KF_NAME} --zone ${ZONE} --project ${PROJECT}
    ```

    Then see what's installed in the `kubeflow` namespace of your GKE cluster:

    ```
    kubectl -n kubeflow get all
    ```

## Access the Kubeflow user interface (UI)

Follow these steps to access the Kubeflow central dashboard:

1. Enter the following URI into your browser address bar. It can take 20
  minutes for the URI to become available:

    ```
    https://<KF_NAME>.endpoints.<project-id>.cloud.goog/
    ```

    You can run the following command to get the URI for your deployment:

    ```
    kubectl -n istio-system get ingress
    NAME            HOSTS                                                      ADDRESS         PORTS   AGE
    envoy-ingress   your-kubeflow-name.endpoints.your-gcp-project.cloud.goog   34.102.232.34   80      5d13h
    ```

    The following command sets an environment variable named `HOST` to the URI:

    ```
    export HOST=$(kubectl -n istio-system get ingress envoy-ingress -o=jsonpath={.spec.rules[0].host})
    ```

1. Follow the instructions on the UI to create a namespace. See the guide to 
  [creation of profiles](/docs/components/multi-tenancy/getting-started/#automatic-creation-of-profiles).

Notes:

* It can take 20 minutes for the URI to become available.
  Kubeflow needs to provision a signed SSL certificate and register a DNS 
  name.
* If you own or manage the domain or a subdomain with 
  [Cloud DNS](https://cloud.google.com/dns/docs/)
  then you can configure this process to be much faster.
  See [kubeflow/kubeflow#731](https://github.com/kubeflow/kubeflow/issues/731).


## Update Kubeflow

To update Kubeflow

1. Edit the Makefile and change `MANIFESTS_URL` to point at the version of Kubeflow manifests you
   want to use

   * Refer to the [kpt docs](https://googlecontainertools.github.io/kpt/reference/pkg/) for
     more info about supported dependencies

1. Update the local copies
   
   ```
   make update
   ```

1. Redeploy

   ```
   make apply
   ```

To evaluate the changes before deploying them you can run `make hydrate` and then compare the contents
of `.build` to what is currently deployed.

## Understanding the deployment process

This section gives you more details about the kfctl configuration and 
deployment process, so that you can customize your Kubeflow deployment if
necessary.

### Application layout

Your Kubeflow application directory **${KFDIR}** contains the following files and 
directories:

* **upstream** is a directory containing kustomize packages for deploying Kubeflow

  * This directory contains the upstream configurations on which your deployment
    is based
   
* **instance** is a directory that defines overlays that are applied to the upstream
  configurations in order to customize Kubeflow for your use case.

  * **gcp_config** is a kustomize package defining all the GCP resources needed for Kubeflow
    using [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview)

    * You can edit this kustomize package in order to customize the GCP resources for 
      your purposes

  * **kustomize** contains kustomize packages for the various Kubernetes applications
    to be installed on your Kubeflow cluster

* **.build** is a directory that will contain the hydrated manifests outputted by
  the `make` rules

### Source Control

It is recommended that you check in your entire **${KFDIR}** into source control.

Checking in **.build** is recommended so you can easily see differences in manifests before applying them.


### GCP service accounts

The kfctl deployment process creates three service accounts in your 
GCP project. These service accounts follow the [principle of least 
privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege). 
The service accounts are:

* `${KF_NAME}-admin` is used for some admin tasks like configuring the load 
  balancers. The principle is that this account is needed to deploy Kubeflow but 
  not needed to actually run jobs.
* `${KF_NAME}-user` is intended to be used by training jobs and models to access 
  GCP resources (Cloud Storage, BigQuery, etc.). This account has a much smaller 
  set of privileges compared to `admin`.
* `${KF_NAME}-vm` is used only for the virtual machine (VM) service account. This
  account has the minimal permissions needed to send metrics and logs to 
  [Stackdriver](https://cloud.google.com/stackdriver/).


## Next steps

* Run a full ML workflow on Kubeflow, using the
  [end-to-end MNIST tutorial](/docs/gke/gcp-e2e/) or the
  [GitHub issue summarization Pipelines
  example](https://github.com/kubeflow/examples/tree/master/github_issue_summarization/pipelines).
* See how to [delete](/docs/gke/deploy/delete-cli/) your Kubeflow deployment 
  using the CLI.
* See how to [customize](/docs/gke/customizing-gke/) your Kubeflow 
  deployment.
* See how to [upgrade Kubeflow](/docs/upgrading/upgrade/) and how to 
  [upgrade or reinstall a Kubeflow Pipelines 
  deployment](/docs/pipelines/upgrade/).
* [Troubleshoot](/docs/gke/troubleshooting-gke/) any issues you may
  find.
