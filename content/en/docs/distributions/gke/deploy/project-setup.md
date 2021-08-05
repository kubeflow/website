+++
title = "Set up Project"
description = "Creating a Google Cloud project for your Kubeflow deployment"
weight = 2
+++

In order to create GKE cluster and deploy Kubeflow on it, you need to set up a Google Cloud project
and enable necessary APIs for the deployment.

## Set up project and API scopes

Follow these steps to set up your Google Cloud project:

1. Select or create a project on the 
  [Google Cloud Console](https://console.cloud.google.com/cloud-resource-manager). If you plan to use different Google Cloud projects for __Management Cluster__ and __Kubeflow Clusters__: create __one Management project__ for Management Cluster, and create __one or more Kubeflow projects__ for Kubeflow Clusters.


1. Make sure that you have the 
  [Owner role](https://cloud.google.com/iam/docs/understanding-roles#primitive_role_definitions)
  for the project in Cloud IAM (Identity and Access Management).
  The deployment process creates various service accounts with
  appropriate roles in order to enable seamless integration with
  Google Cloud services. This process requires that you have the 
  owner role for the project in order to deploy Kubeflow.

1. Make sure that billing is enabled for your project. Refer to
  [Enable billing for a project](https://cloud.google.com/billing/docs/how-to/modify-project).

1. Open following pages on the Google Cloud Console and ensure that the 
  specified APIs are enabled for all projects:

    * [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com)
    * [Kubernetes Engine API](https://console.cloud.google.com/apis/library/container.googleapis.com)
    * [Identity and Access Management (IAM) API](https://console.cloud.google.com/apis/library/iam.googleapis.com)
    * [Service Management API](https://console.cloud.google.com/apis/api/servicemanagement.googleapis.com)
    * [Cloud Resource Manager API](https://console.developers.google.com/apis/library/cloudresourcemanager.googleapis.com)
    * [AI Platform Training & Prediction API](https://console.developers.google.com/apis/library/ml.googleapis.com)
    * [Cloud Identity-Aware Proxy API](https://console.cloud.google.com/apis/library/iap.googleapis.com)
    * [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com) (It's required if you plan to use [Fairing](https://www.kubeflow.org/docs/external-add-ons/fairing/) in your Kubeflow cluster)
    * [Cloud SQL Admin API](https://console.cloud.google.com/apis/library/sqladmin.googleapis.com)

    You can also enable these APIs by running the following command in Cloud Shell:
    ```bash
    gcloud services enable \
      compute.googleapis.com \
      container.googleapis.com \
      iam.googleapis.com \
      servicemanagement.googleapis.com \
      cloudresourcemanager.googleapis.com \
      ml.googleapis.com \
      iap.googleapis.com \
      sqladmin.googleapis.com \
      meshconfig.googleapis.com 

    # Cloud Build API is optional, you need it if using Fairing.
    # gcloud services enable cloudbuild.googleapis.com
    ```

1. If you are using the
  [Google Cloud Free Program](https://cloud.google.com/free/docs/gcp-free-tier) or the
  12-month trial period with $300 credit, note that the free tier does not offer enough
  resources for default full Kubeflow installation. You need to 
  [upgrade to a paid account](https://cloud.google.com/free/docs/gcp-free-tier#how-to-upgrade).
  
    For more information, see the following issues: 

    * [kubeflow/website #1065](https://github.com/kubeflow/website/issues/1065)
      reports the problem.
    * [kubeflow/kubeflow #3936](https://github.com/kubeflow/kubeflow/issues/3936)
      requests a Kubeflow configuration to work with a free trial project.

    Read the Google Cloud [Resource quotas](https://cloud.google.com/compute/quotas)
    to understand quotas on resource usage that Compute Engine enforces, and 
    to learn how to check and increase your quotas.

  
1. Initialize your project to prepare it for Anthos Service Mesh installation:

    ```bash
    PROJECT_ID=<YOUR_PROJECT_ID>
    ```

    ```bash
    curl --request POST \
      --header "Authorization: Bearer $(gcloud auth print-access-token)" \
      --data '' \
      https://meshconfig.googleapis.com/v1alpha1/projects/${PROJECT_ID}:initialize
    ```

    Refer to [Anthos Service Mesh documentation](https://cloud.google.com/service-mesh/docs/archive/1.4/docs/gke-install-new-cluster#setting_credentials_and_permissions) for details.

    If you encounter a `Workload Identity Pool does not exist` error, refer to the following issue:

    * [kubeflow/website #2121](https://github.com/kubeflow/website/issues/2121)
    describes that creating and then removing a temporary Kubernetes cluster may
    be needed for projects that haven't had a cluster set up beforehand.

You do not need a running GKE cluster. The deployment process creates a
cluster for you.

## Next steps

* [Set up an OAuth credential](/docs/distributions/gke/deploy/oauth-setup) to use 
  [Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/docs/).
  Cloud IAP is recommended for production deployments or deployments with access 
  to sensitive data.
* [Set up Management Cluster](/docs/distributions/gke/deploy/management-setup) to deploy and manage Kubeflow clusters.
* [Deploy Kubeflow](/docs/distributions/gke/deploy/deploy-cli) using kubectl, kustomize and kpt.
