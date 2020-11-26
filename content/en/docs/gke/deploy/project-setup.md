+++
title = "Set up a Google Cloud Project"
description = "Creating a Google Cloud Platform (GCP) project for your Kubeflow deployment"
weight = 1
+++

Follow these steps to set up your GCP project:

1. Select or create a project on the 
  [GCP Console](https://console.cloud.google.com/cloud-resource-manager).


1. Make sure that you have the 
  [owner role](https://cloud.google.com/iam/docs/understanding-roles#primitive_role_definitions)
  for the project in Cloud IAM (Identity and Access Management).
  The deployment process creates various service accounts with
  appropriate roles in order to enable seamless integration with
  GCP services. This process requires that you have the 
  owner role for the project in order to deploy Kubeflow.

1. Make sure that billing is enabled for your project. Refer to the guide to
  [modifying a project's billing 
  settings](https://cloud.google.com/billing/docs/how-to/modify-project).

1. Go to the following pages on the GCP Console and ensure that the 
  specified APIs are enabled:

    * [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com)
    * [Kubernetes Engine API](https://console.cloud.google.com/apis/library/container.googleapis.com)
    * [Identity and Access Management (IAM) API](https://console.cloud.google.com/apis/library/iam.googleapis.com)
    * [Service Management API](https://console.cloud.google.com/apis/api/servicemanagement.googleapis.com)
    * [Cloud Resource Manager API](https://console.developers.google.com/apis/library/cloudresourcemanager.googleapis.com)
    * [AI Platform Training & Prediction API](https://console.developers.google.com/apis/library/ml.googleapis.com)
    * [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com) (It's required if you plan to use [Fairing](https://www.kubeflow.org/docs/components/fairing/) in your Kubeflow cluster)

    You can also enable these APIs by running the following command in Cloud Shell:
    ```
    gcloud services enable \
      compute.googleapis.com \
      container.googleapis.com \
      iam.googleapis.com \
      servicemanagement.googleapis.com \
      cloudresourcemanager.googleapis.com \
      ml.googleapis.com

    # Cloud Build API is optional, you need it if using Fairing.
    # gcloud services enable cloudbuild.googleapis.com
    ```

1. If you are using the 
  [GCP Free Tier](https://cloud.google.com/free/docs/gcp-free-tier) or the
  12-month trial period with $300 credit, note that you can't run the default
  GCP installation of Kubeflow, because the free tier does not offer enough
  resources. You need to 
  [upgrade to a paid account](https://cloud.google.com/free/docs/gcp-free-tier#how-to-upgrade).
  
    For more information, see the following issues: 

    * [kubeflow/website #1065](https://github.com/kubeflow/website/issues/1065)
      reports the problem.
    * [kubeflow/kubeflow #3936](https://github.com/kubeflow/kubeflow/issues/3936)
      requests a Kubeflow configuration to work with a free trial project.

1. Read the GCP guide to [resource quotas](https://cloud.google.com/compute/quotas)
  to understand the quotas on resource usage that Compute Engine enforces, and 
  to learn how to check your quota and how to request an increase in quota.
  
1. Initialize your project to ready it for Anthos Service Mesh installation.

    ```
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

* [Set up an OAuth credential](/docs/gke/deploy/oauth-setup) to use 
  [Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/docs/).
  Cloud IAP is recommended for production deployments or deployments with access 
  to sensitive data.
* Follow the [instructions](/docs/gke/deploy/deploy-cli) to deploy Kubeflow using kubectl, kustomize and kpt.
