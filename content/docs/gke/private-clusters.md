+++
title = "Creating Private Clusters"
description = "How to create private GKE clusters"
weight = 5
+++

This guide describes how to create private clusters with Kubeflow on Google 
Kubernetes Engine (GKE).

## Before you start

This guide assumes you have already set up Kubeflow with GKE. If you haven't done
so, follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/).

## Private clusters

Creating a [private Kubernetes Engine cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters)
means the Kubernetes Engine nodes won't have public IP addresses. This can improve security by blocking unwanted outbound/inbound
access to nodes. Removing IP addresses means external services (including GitHub, PyPi, DockerHub etc...) won't be accessible
from the nodes. Google services (for example, Container Registry) are still accessible.

1. Enable private clusters in `${KFAPP}/gcp_configs/cluster-kubeflow.yaml` by updating the following two parameters:

    ```
    privatecluster: true
    gkeApiVersion: v1beta1
    ```
1. Create the deployment:

    ```
    cd ${KFAPP}
    kfctl apply platform
    ```

1. To set up ingress to the cluster, it is recommended to use your custom domain instead of Cloud Endpoints. cert-manager cannot be used to create HTTPS certificates because cert-manager needs to talk to LetsEncrypt to get the certificate and that is not possible in a private cluster setting. Obtain the HTTPS certificates for your ${FQDN} and create a k8s secret with it. Assuming your cert and key are present in files named tls.crt and tls.key, create a secret using the following command:

    ```
    kubectl create secret generic --namespace=${NAMESPACE} envoy-ingress-tls --from-file=tls.crt=tls.crt --from-file=tls.key=tls.key
    ```

1. Update iap-ingress component parameters:

    ```
    cd ${KFAPP}/ks_app
    ks param set iap-ingress hostname ${FQDN}
    ks param set iap-ingress privateGKECluster true
    ```

1. Create an A record in your DNS management service to point ${FQDN} to the static IP address which was created by deployment manager. It can be found in `gcloud compute addresses list`.

1. Update the various ksonnet components to use `gcr.io` images instead of dockerhub images:

    ```
    cd ${KFAPP}/ks_app
    ${KUBEFLOW_SRC}/scripts/gke/use_gcr_for_all_images.sh
    ```

1. Remove components which are not useful in private clusters:

    ```
    cd ${KFAPP}/ks_app
    ks component rm cloud-endpoints
    ks component rm cert-manager
    ```

1. Apply all the k8s resources:

    ```
    cd ${KFAPP}
    kfctl apply k8s
    ```
