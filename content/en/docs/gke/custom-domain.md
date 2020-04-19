+++
title = "Using Your Own Domain"
description = "Using a custom domain with Kubeflow on GKE"
weight = 30
+++

This guide describes how to use a custom domain with Kubeflow on Google Cloud
Platform (GCP).

## Before you start

This guide assumes you have already set up Kubeflow on GCP. If you haven't done
so, follow the guide to
[getting started with Kubeflow on GCP](/docs/gke/deploy/).

## Using your own domain

If you want to use your own domain instead of **${KF_NAME}.endpoints.${PROJECT}.cloud.goog**, follow these instructions after running `kfctl build`:

1. Replace `hostname` in `kustomize/iap-ingress/base/params.env` with your own domain.
    ```
    ...
    hostname=<enter your domain here>
    ingressName=envoy-ingress
    ipName=kf-test-ip
    oauthSecretName=kubeflow-oauth
    ...
    ```

1. Apply the changes.

    Using `kfctl`.

    ```
    kfctl apply -V -f ${CONFIG_FILE}
    ```

    Or using `kubectl`.

    ```
    kubectl apply -k kustomize/iap-ingress
    ```

1. Remove the `cloud-endpoints` component.
    ```
    kubectl delete -k kustomize/cloud-endpoints
    ```

    Delete the endpoint created by the `cloud-endpoints-controller`, if any.
    ```
    gcloud endpoints services delete ${KF_NAME}.endpoints.${PROJECT}.cloud.goog
    ```

1. Check Ingress to verify that your domain was properly configured.
    ```
    kubectl -n istio-system describe ingresses
    ```

1. Get the address of the static IP address created.
    ```
    IPNAME=${KF_NAME}-ip
    gcloud compute addresses describe ${IPNAME} --global --format="value(address)"
    ```

1. Use your DNS provider to map the fully qualified domain specified in the first step to the above IP address.
