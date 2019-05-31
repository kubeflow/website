+++
title = "Configure Kubeflow Fairing with Access to GCP"
description = "Configuring your Kubeflow Fairing development environment to access Kubeflow on GKE"
weight = 20
+++

This guide describes how to configure your development environment with access
to Google Cloud Platform (GCP), so you can use Kubeflow Fairing to train or
deploy a model on Kubeflow on Google Kubernetes Engine (GKE).

If you have not installed Kubeflow Fairing, follow the guide to [installing
Kubeflow Fairing][fairing-install] before continuing.

## Using Kubeflow Fairing with Kubeflow notebooks

Kubeflow notebook servers that are built from one of the standard Jupyter
Docker images include Kubeflow Fairing and come preconfigured for using
Kubeflow Fairing to run training jobs on your Kubeflow cluster.

If your Kubeflow notebook server was built from a custom Jupyter Docker image,
follow the instruction in this guide to configure your notebooks environment
with access to your Kubeflow environment.

## Install and configure the Google Cloud SDK

Follow these instructions to set up the Google Cloud SDK in your local
development environment. If you are using Kubeflow notebooks on GKE, you do
not need to complete these steps. 

1.  To check if you have the Google Cloud SDK installed, run the following
    command:

    ```bash
    which gcloud
    ```

    The response should be something like this:

    ```bash
    /usr/bin/gcloud
    ```

    If you do not have the Google Cloud SDK installed, follow the guide to
    [installing the Google Cloud SDK][gcloud-install].

1.  Use `gcloud` to set a default project.

    ```bash
    export PROJECT_ID=<your-project-id>
    gcloud config set project $PROJECT_ID
    ```

1.  Kubeflow Fairing needs a service account to make API calls to GCP. The
    recommended way to provide Fairing with access to this
    service account is to set the `GOOGLE_APPLICATION_CREDENTIALS` environment
    variable. To check for the `GOOGLE_APPLICATION_CREDENTIALS` environment
    variable, run the following command:

    ```bash
    ls "$GOOGLE_APPLICATION_CREDENTIALS"
    ```

    The response should be something like this:

    ```bash
    /.../.../key.json
    ```

    If you do not have a service account, then create one and grant it access
    to the required roles.

    ```bash
    export SA_NAME=<your-sa-name>
    gcloud iam service-accounts create $SA_NAME
    gcloud projects add-iam-policy-binding $PROJECT_ID \ 
        --member serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
        --role 'roles/editor'
    ```

    Create a key for your service account.

    ```bash
    gcloud iam service-accounts keys create ~/key.json \
        --iam-account $SA_NAME@$PROJECT_ID.iam.gserviceaccount.com
    ```

    Create the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS=~/key.json
    ```

## Configure Docker with access to Container Registry

Authorize Docker to access your [GCP Container Registry][container-registry].

```bash
gcloud auth configure-docker
```

## Configure access to your Kubeflow cluster

Use the following instructions to update your `kubeconfig` with credentials
and endpoint information for your Kubeflow cluster. If you do not have a
Kubeflow cluster, follow the guide to [deploying Kubeflow on
GKE][kubeflow-gcp-install] to set one up.

1.  To find your cluster's name, run the following command to list the
    clusters in your project:

    ```bash
    gcloud container clusters list
    ```

1.  Update the following command with your cluster's name and GCP zone. Then,
    run the command to update your `kubeconfig` to provide it with credentials
    to access this cluster.

    ```bash
    export CLUSTER_NAME=kubeflow
    export ZONE=us-central1-a
    gcloud container clusters get-credentials $CLUSTER_NAME --region $ZONE
    ```

## Next steps

*  Follow the [GCP samples and tutorials][tutorials] to learn more about how to run
   training jobs remotely on GCP with Kubeflow Fairing. 

[gcloud-install]: https://cloud.google.com/sdk/docs/ 
[kubeflow-gcp-install]: /docs/gke/deploy/
[container-registry]: https://cloud.google.com/container-registry/
[fairing-install]: /docs/fairing/install-fairing/
[tutorials]: /docs/fairing/gcp/tutorials/
