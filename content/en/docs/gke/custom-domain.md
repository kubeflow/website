+++
title = "Using Your Own Domain"
description = "Using a custom domain with Kubeflow on GKE"
weight = 30
                    
+++

## Before you start

This guide assumes you have already set up Kubeflow on GCP. If you haven't done
so, follow the guide to
[getting started with Kubeflow on GCP](/docs/gke/deploy/).

## Using your own domain

If you want to use your own domain instead of **${KF_NAME}.endpoints.${PROJECT}.cloud.goog**, follow these instructions after running `kfctl build`:

1. Remove the substitution `hostname` in the Kptfile.

    ```
    kpt cfg delete-subst instance hostname
    ```

1. Create a new setter `hostname` in the Kptfile.

    ```
    kpt cfg create-setter instance/ hostname --field "data.hostname" --value ""
    ```

1. Configure new setter with your own domain.

    ```
    kpt cfg set ./instance hostname <enter your domain here>
    ```

1. Apply the changes.

    ```
    make apply-kubeflow
    ```

1. Check Ingress to verify that your domain was properly configured.

    ```
    kubectl -n istio-system describe ingresses
    ```

1. Get the address of the static IP address created.

    ```
    IPNAME=${KF_NAME}-ip
    gcloud compute addresses describe ${IPNAME} --global
    ```

1. Use your DNS provider to map the fully qualified domain specified in the third step to the above IP address.
