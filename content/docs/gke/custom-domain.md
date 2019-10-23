+++
title = "Using Your Own Domain"
description = "Using a custom domain with Kubeflow on GKE"
weight = 3
+++

This guide describes how to use a custom domain with Kubeflow on Google Cloud 
Platform (GCP).

## Before you start

This guide assumes you have already set up Kubeflow on GCP. If you haven't done
so, follow the guide to 
[getting started with Kubeflow on GCP](/docs/gke/deploy/).

## Using your own domain

If you want to use your own domain instead of **${KF_NAME}.endpoints.${PROJECT}.cloud.goog**, follow these instructions:

1. Remove the `cloud-endpoints` component:

    ```
    cd ${KF_DIR}/kustomize
    kubectl delete -f cloud-endpoints.yaml
    ```

1. Set the domain for your ingress to be the fully qualified domain name:

    ```
    cd ${KF_DIR}/kustomize
    gvim iap-ingress.yaml    # Or basic-auth-ingress.yaml
    ```

   * Find and replace the value for the hostname:

     ```
     data:
       hostname: <enter your endpoint here>
     ```

   * Apply the changes:

     ```
     kubectl apply -f iap-ingress.yaml
     ```

1. Get the address of the static IP address created:

    ```
    IPNAME=${KF_NAME}-ip
    gcloud --project=${PROJECT} compute addresses describe --global ${IPNAME}
    ```

1. Use your DNS provider to map the fully qualified domain specified in the first step to the IP address reserved:
   in GCP.
