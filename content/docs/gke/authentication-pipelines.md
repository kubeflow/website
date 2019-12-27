+++
title = "Authenticating Pipelines to GCP"
description = "Authentication and authorization to Google Cloud Platform (GCP) in Pipelines"
weight = 50
+++

This page describes authentication for Kubeflow Pipelines to GCP.

## Before you begin
[Installation Options for Kubeflow Pipelines](/docs/pipelines/installation/overview/) introduces options to install Pipelines. Be aware that authentication support and cluster setup instructions will vary depending on the option you installed Kubeflow Pipelines with.

## Securing the cluster with fine-grained GCP permission control

### Workload Identity

{{% alert color="warning" %}}
<p>NOTE: Using pipelines with workload identity is currently only supported in Kubeflow Pipelines Standalone.</p>
{{% /alert %}}

> Workload identity is the recommended way for your GKE applications to consume services provided by Google APIs. You accomplish this by configuring a [Kubernetes service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) to act as a [Google service account](https://cloud.google.com/iam/docs/service-accounts). Any Pods running as the Kubernetes service account then use the Google service account to authenticate to cloud services.

Referenced from [Workload Identity Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). Please read this doc for:

* Detailed introduction about workload identity.
* Instructions to enable it on your cluster.
* Whether its limitations affect your adoption.

#### Terminology

This document distinguishes between [Kubernetes service accounts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) (KSAs) and [Google service accounts](https://cloud.google.com/iam/docs/service-accounts) (GSAs). KSAs are Kubernetes resources, while GSAs are specific to Google Cloud. Other documentation usually refers to both of them as just "service accounts".

#### Authoring pipelines to use workload identity

Pipelines don't need any change to authenticate to GCP, it will use the GSA bound to `pipeline-runner` KSA transparently.

However, existing pipelines that use [use_gcp_secret kfp sdk operator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret) need to remove `use_gcp_secret` usage to use the bound GSA.
You can also continue to use `use_gcp_secret` in a cluster with workload identity enabled, but pipeline steps with `use_gcp_secret` will use the GSA corresponding to the secret provided.

#### Cluster setup to use workload identity for Pipelines Standalone

**After you enabled workload identity**, you need to bind workload identities for KSAs used by [Pipelines Standalone](/docs/pipelines/installation/overview/#kubeflow-pipelines-standalone).
We provide some helper scripts you can reference to set up workload identity bindings for pipelines workloads.
[This user-friendly bash script](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/gcp-workload-identity-setup.sh) helps you create GSAs and bind them to KSAs used by pipelines workloads.
[Another bash script](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/wi-utils.sh) provides minimal utility bash functions that let you customize your setup.

Pipelines use `pipeline-runner` KSA, you can configure IAM permissions of the GSA bound to this KSA to allow pipelines use GCP APIs.

Pipelines UI uses `ml-pipeline-ui` KSA. If you need to view visualizations stored in Google Cloud Storage (GCS) from pipelines UI, you should add Storage Object Viewer permission to its bound GSA.

### Google service account keys stored as Kubernetes secrets

* For [Pipelines Standalone](/docs/pipelines/installation/overview/#kubeflow-pipelines-standalone), it is recommended to use workload identity for easier management, but you can also choose to use GSA keys.
* For [Kubeflow full deployment](/docs/pipelines/installation/overview#full-kubeflow-deployment) and [GCP hosted ML pipelines](/docs/pipelines/installation/overview#gcp-hosted-ml-pipelines), using GSA keys is the only supported option now.

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
