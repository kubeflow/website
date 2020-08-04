+++
title = "Authenticating Pipelines to GCP"
description = "Authentication and authorization to Google Cloud Platform (GCP) in Pipelines"
weight = 50
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

This page describes authentication for Kubeflow Pipelines to GCP.
Available options listed below have different tradeoffs. You should choose the one that fits your use-case.

* [Compute Engine default service account](#compute-engine-default-service-account) is easy to set up, but overgrants permission if enabled access to "cloud-platform" scope. Therefore, it is not suitable for a shared GCP project.
* [Workload Identity](#workload-identity) takes more efforts to set up, but allows fine-grained permission control. It is recommended for production use-cases.
* [Google service account keys stored as Kubernetes secrets](#google-service-account-keys-stored-as-kubernetes-secrets) is the legacy approach and no longer recommended in GKE. However, it's the only option to use GCP APIs when your cluster is an [anthos](https://cloud.google.com/anthos) or on-prem cluster.

{{% alert color="warning" %}}
<p>NOTE: AI Platform Pipelines only supports Compute Engine default service account out of the box. If you want custom configurations, recommend using Pipelines Standalone instead. For details, please refer to <a href="https://cloud.google.com/ai-platform/pipelines/docs">AI Platform Pipelines documentation</a>.</p>
{{% /alert %}}

## Before you begin
[Installation Options for Kubeflow Pipelines](/docs/pipelines/installation/overview/) introduces options to install Pipelines. Be aware that authentication support and cluster setup instructions will vary depending on the option you installed Kubeflow Pipelines with.

## Compute Engine default service account

This is good for trying out Kubeflow Pipelines, because it is easy to set up, but does not support permission separation for workloads in the cluster.

{{% alert color="warning" %}}
<p>NOTE: Using pipelines with Compute Engine default service account is not supported in Full Kubeflow deployment.</p>
{{% /alert %}}

### Cluster setup to use Compute Engine default service account

By default, your GKE nodes use [Compute Engine default service account](https://cloud.google.com/compute/docs/access/service-accounts#default_service_account). If you allowed `cloud-platform` scope when creating the cluster,
Kubeflow Pipelines can authenticate to GCP and manage resources in your project without further configuration.

Use one of the following options to create a GKE cluster that uses the Compute Engine default service account:

* If you followed instructions in [Setting up AI Platform Pipelines](https://cloud.google.com/ai-platform/pipelines/docs/setting-up) and checked `Allow access to the following Cloud APIs`, your cluster is already using Compute Engine default service account.
* In Google Cloud Console UI, you can enable it in `Create a Kubernetes cluster -> default-pool -> Security -> Accesss Scopes -> Allow full access to all Cloud APIs` like the following:
<img src="/docs/images/pipelines/gke-allow-full-access.png">
* Using `gcloud` CLI, you can enable it with `--scopes cloud-platform` like the following:
```bash
gcloud container clusters create cluster-name \
  --scopes cloud-platform
```

Please refer to [gcloud container clusters create command documentation](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create#--scopes) for other available options.

### Authoring pipelines to use default service account

Pipelines don't need any specific changes to authenticate to GCP, it will use the default service account transparently.

However, you must update existing pipelines that use the [use_gcp_secret kfp sdk operator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret). Remove the `use_gcp_secret` usage to let your pipeline authenticate to Google Cloud using the default service account.

## Securing the cluster with fine-grained GCP permission control

### Workload Identity

> Workload Identity is the recommended way for your GKE applications to consume services provided by Google APIs. You accomplish this by configuring a [Kubernetes service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) to act as a [Google service account](https://cloud.google.com/iam/docs/service-accounts). Any Pods running as the Kubernetes service account then use the Google service account to authenticate to cloud services.

Referenced from [Workload Identity Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). Please read this doc for:

* A detailed introduction to Workload Identity.
* Instructions to enable it on your cluster.
* Whether its limitations affect your adoption.

#### Terminology

This document distinguishes between [Kubernetes service accounts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) (KSAs) and [Google service accounts](https://cloud.google.com/iam/docs/service-accounts) (GSAs). KSAs are Kubernetes resources, while GSAs are specific to Google Cloud. Other documentation usually refers to both of them as just "service accounts".

#### Authoring pipelines to use Workload Identity

Pipelines don't need any specific changes to authenticate to Google Cloud. With Workload Identity, pipelines run as the Google service account that is bound to the KSA.

However, existing pipelines that use [use_gcp_secret kfp sdk operator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret) need to remove the `use_gcp_secret` usage to use the bound GSA.
You can also continue to use `use_gcp_secret` in a cluster with Workload Identity enabled and `use_gcp_secret` will take precedence for those workloads.

#### Cluster setup to use Workload Identity for Pipelines Standalone

##### 1. Create your cluster with Workload Identity enabled

* In Google Cloud Console UI, you can enable Workload Identity in `Create a Kubernetes cluster -> Security -> Enable Workload Identity` like the following:
<img src="/docs/images/pipelines/gke-enable-workload-identity.png">

* Using `gcloud` CLI, you can enable it with:
```bash
gcloud beta container clusters create cluster-name \
  --release-channel regular \
  --workload-pool=project-id.svc.id.goog
```

References:

* [Enable Workload Identity on a new cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#enable_workload_identity_on_a_new_cluster)

* [Enable Workload Identity on an existing cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#enable_workload_identity_on_an_existing_cluster)

##### 2. Deploy Kubeflow Pipelines
Deploy via [Pipelines Standalone](/docs/pipelines/installation/overview/#kubeflow-pipelines-standalone) as usual.

##### 3. Bind Workload Identities for KSAs used by Kubeflow Pipelines

The following helper bash scripts bind Workload Identities for KSAs used by Kubeflow Pipelines:

* [gcp-workload-identity-setup.sh](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/gcp-workload-identity-setup.sh) helps you create GSAs and bind them to KSAs used by pipelines workloads. This script provides an interactive command line dialog with explanation messages.
* [wi-utils.sh](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/wi-utils.sh) alternatively provides minimal utility bash functions that let you customize your setup. The minimal utilities make it easy to read and use programmatically.

For example, to get a default setup using `gcp-workload-identity-setup.sh`, you can
```
$ curl -O https://raw.githubusercontent.com/kubeflow/pipelines/master/manifests/kustomize/gcp-workload-identity-setup.sh
$ chmod +x ./gcp-workload-identity-setup.sh
$ ./gcp-workload-identity-setup.sh
# This prints the command's usage example and introduction.
# Then you can run the command with required parameters.
# Command output will tell you which GSAs and Workload Identity bindings have been
# created.
```

##### 4. Configure IAM permissions of used GSAs

If you used `gcp-workload-identity-setup.sh` to bind Workload Identities for your cluster, you can simply add the following IAM bindings:
* Give GSA `<cluster-name>-kfp-system@<project-id>.iam.gserviceaccount.com` `Storage Object Viewer` role to let UI load data in GCS in the same project.
* Give GSA `<cluster-name>-kfp-user@<project-id>.iam.gserviceaccount.com` any permissions your pipelines need. For quick tryouts, you can give it `Project Editor` role for all permissions.

If you configured bindings by yourself, here are GCP permission requirements for KFP KSAs:
* Pipelines use `pipeline-runner` KSA. Configure IAM permissions of the GSA bound to this KSA to allow pipelines use GCP APIs.
* Pipelines UI uses `ml-pipeline-ui` KSA. Pipelines Visualization Server uses `ml-pipeline-visualizationserver` KSA. If you need to view artifacts and visualizations stored in Google Cloud Storage (GCS) from pipelines UI, you should add Storage Object Viewer permission (or the minimal required permission) to their bound GSAs.

#### Cluster setup to use Workload Identity for Full Kubeflow

Public Kubeflow v1.0.1 release hasn't been configured out of box. [The fix](https://github.com/kubeflow/manifests/pull/969) has been merged, but not yet released publically.
After the fix is released, if you deployed Kubeflow following the GCP instructions Workload Identity will have already been configured properly for Kubeflow Pipelines.

If you want to use Workload Identity with pipelines on Kubeflow v1.0.1 or before, I recommend running the following commands to patch your deployment:
```
export NAMESPACE=kubeflow # Replace with your kubeflow's namespace if it's been customized.
kubectl patch deployment -n ${NAMESPACE} ml-pipeline --patch '{"spec": {"template": {"spec": {"containers": [{"name": "ml-pipeline-api-server", "env": [{"name": "DEFAULTPIPELINERUNNERSERVICEACCOUNT", "value": "kf-user"}]}]}}}}'
kubectl patch clusterrolebinding -n ${NAMESPACE} pipeline-runner --patch '{"subjects": [{"kind": "ServiceAccount", "name": "kf-user", "namespace": "'$NAMESPACE'"}]}'
```

Pipelines use `kf-user` KSA by default which is different from Kubeflow Standalone.

### Google service account keys stored as Kubernetes secrets

It is recommended to use Workload Identity for easier and secure management, but you can also choose to use GSA keys.

#### Authoring pipelines to use GSA keys

Each pipeline step describes a 
container that is run independently. If you want to grant access for a single step to use
 one of your service accounts, you can use 
[`kfp.gcp.use_gcp_secret()`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret).
Examples for how to use this function can be found in the 
[Kubeflow examples repo](https://github.com/kubeflow/examples/blob/871895c54402f68685c8e227c954d86a81c0575f/pipelines/mnist-pipelines/mnist_pipeline.py#L97).

#### Cluster setup to use use_gcp_secret for Full Kubeflow

You don't need to do anything. Full Kubeflow deployment has already deployed the `user-gcp-sa` secret for you.

#### Cluster setup to use use_gcp_secret for Pipelines Standalone

Pipelines Standalone require your manual setup for the `user-gcp-sa` secret used by `use_gcp_secret`.

Instructions to set up the secret:

1. First download the GCE VM service account token (refer to [GCP documentation](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys) for more information):

    ```
    gcloud iam service-accounts keys create application_default_credentials.json \
      --iam-account [SA-NAME]@[PROJECT-ID].iam.gserviceaccount.com
    ```

1. Run:
    ```
    kubectl create secret -n [your-namespace] generic user-gcp-sa \
      --from-file=user-gcp-sa.json=application_default_credentials.json
    ```
