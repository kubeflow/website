+++
title = "Using Your Own Domain"
description = "Using a custom domain with Kubeflow on GKE"
weight = 3
toc = true
bref = "This guide describes how to use a custom domain with Kubeflow on Google Cloud Platform (GCP)."

[menu.docs]
  parent = "GKE"
  weight = 3
+++

## Before you start

This guide assumes you have already set up Kubeflow on GCP. If you haven't done
so, follow the guide to 
[getting started with Kubeflow on Kubernetes Engine](/docs/started/getting-started-gke).

## Using your own domain

If you want to use your own domain instead of **${name}.endpoints.${project}.cloud.goog**, follow these instructions:

1. Modify your ksonnet application to remove the `cloud-endpoints` component:

    ```
    cd ${KFAPP}/ks_app
    ks delete default -c cloud-endpoints
    ks component rm cloud-endpoints
    ```

1. Set the domain for your ingress to be the fully qualified domain name:

    ```
    ks param set iap-ingress hostname ${FQDN}
    ks apply default -c iap-ingress
    ```

1. Get the address of the static IP address created:

    ```
    IPNAME=${DEPLOYMENT_NAME}-ip
    gcloud --project=${PROJECT} addresses describe --global ${IPNAME}
    ```

1. Use your DNS provider to map the fully qualified domain specified in the first step to the IP address reserved:
   in GCP.