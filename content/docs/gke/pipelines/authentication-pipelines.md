+++
title = "Authenticating Pipelines to GCP"
description = "Authentication and authorization to Google Cloud Platform (GCP) in Pipelines"
weight = 50
+++

This page describes authentication for Kubeflow Pipelines to GCP.

## Before you begin
[Installation Options for Kubeflow Pipelines](/docs/pipelines/installation/overview/) introduces options to install Pipelines. Be aware that authentication support and cluster setup instructions will vary depending on the option you installed Kubeflow Pipelines with.

The following sections list options to authenticate pipelines to GCP. You should choose the one that fits your requirements the most.

A quick recommendation comparing these options:

* [Compute engine default service account](#compute-engine-default-service-account) is easy to set up, but not secure for sharing project.
* [Workload Identity](#workload-identity) is harder to set up, but has good security.
* [Google service account keys stored as Kubernetes secrets](#google-service-account-keys-stored-as-kubernetes-secrets) is the legacy approach that we no longer recommend.

## Compute Engine default service account

This is good for trying out Kubeflow Pipelines, because it is easy to set up, but not secure.

### Cluster setup to use Compute Engine default service account

By default, your GKE nodes use [Compute Engine default service account](https://cloud.google.com/compute/docs/access/service-accounts#default_service_account). If you allowed cloud-platform scope when creating the cluster,
Kubeflow Pipelines can authenticate to GCP and manage resources in your project without further setup.

Here are ways to enable it when creating the cluster:

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

However, existing pipelines that use [use_gcp_secret kfp sdk operator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret) need to remove the `use_gcp_secret` usage to use the default service account.

## Securing the cluster with fine-grained GCP permission control

### Workload Identity

> Workload Identity is the recommended way for your GKE applications to consume services provided by Google APIs. You accomplish this by configuring a [Kubernetes service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) to act as a [Google service account](https://cloud.google.com/iam/docs/service-accounts). Any Pods running as the Kubernetes service account then use the Google service account to authenticate to cloud services.

Referenced from [Workload Identity Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). Please read this doc for:

* Detailed introduction about Workload Identity.
* Instructions to enable it on your cluster.
* Whether its limitations affect your adoption.

#### Terminology

This document distinguishes between [Kubernetes service accounts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) (KSAs) and [Google service accounts](https://cloud.google.com/iam/docs/service-accounts) (GSAs). KSAs are Kubernetes resources, while GSAs are specific to Google Cloud. Other documentation usually refers to both of them as just "service accounts".

#### Authoring pipelines to use Workload Identity

Pipelines don't need any specific changes to authenticate to GCP, it will use the GSA bound to the KSA it uses transparently.

However, existing pipelines that use [use_gcp_secret kfp sdk operator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret) need to remove the `use_gcp_secret` usage to use the bound GSA.
You can also continue to use `use_gcp_secret` in a cluster with Workload Identity enabled, but pipeline steps with `use_gcp_secret` will use the GSA corresponding to the secret provided.

#### Cluster setup to use Workload Identity for Pipelines Standalone or GCP Hosted ML pipelines

##### 1. Create your cluster with Workload Identity enabled

* In Google Cloud Console UI, you can enable it in `Create a Kubernetes cluster -> Security -> Enable Workload Identity` like the following:
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
Deploy via [Pipelines Standalone](/docs/pipelines/installation/overview/#kubeflow-pipelines-standalone) or [GCP hosted ML pipelines](/docs/pipelines/installation/overview#gcp-hosted-ml-pipelines) as usual.

Note, for GCP hosted ML pipelines additionally, you need to patch `proxy-agent` to work with workload identity:
```
kubectl patch deployment proxy-agent --patch '{"spec": {"template": {"spec": {"hostNetwork": true}}}}'
```

##### 3. Bind Workload Identities for KSAs used by Kubeflow Pipelines

The following helper bash scripts bind Workload Identities for KSAs used by Kubeflow Pipelines:

* [gcp-workload-identity-setup.sh](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/gcp-workload-identity-setup.sh) helps you create GSAs and bind them to KSAs used by pipelines workloads. This script provides an interactive command line dialog with explanation messages.
* [wi-utils.sh](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/wi-utils.sh) alternatively provides minimal utility bash functions that let you customize your setup. The minimal utilities make it easy to read and use programmatically.

##### 4. Configure IAM permissions of used GSAs

* Pipelines use `pipeline-runner` KSA. Configure IAM permissions of the GSA bound to this KSA to allow pipelines use GCP APIs.

* Pipelines UI uses `ml-pipeline-ui` KSA. Pipelines Visualization Server uses `ml-pipeline-visualizationserver` KSA. If you need to view visualizations stored in Google Cloud Storage (GCS) from pipelines UI, you should add Storage Object Viewer permission (or the minimal required permission) to their bound GSA.

#### Cluster setup to use Workload Identity for Full Kubeflow

Since Kubeflow 1.0, if you deployed Kubeflow following the GCP instructions Workload Identity has already been set up correctly for Kubeflow Pipelines.

Pipelines use `kf-user` KSA by default which is different from Kubeflow Standalone. You can also choose to use a different default KSA by overriding deployment like [this overlay](https://github.com/kubeflow/manifests/blob/a8d473a2431bd7afb88834f62751b021c4269817/pipeline/api-service/overlays/use-kf-user/deployment.yaml#L12).

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

#### Cluster setup to use use_gcp_secret for Pipelines Standalone and Hosted GCP ML Pipelines

Pipelines Standalone and Hosted GCP ML Pipelines require you to manually set up the `user-gcp-sa` secret used by `use_gcp_secret`. 

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
