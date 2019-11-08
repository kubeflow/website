+++
title = "Monitor Cloud IAP Setup"
description = "Instructions for monitoring and troubleshooting Cloud IAP"
weight = 5
+++

[Cloud Identity-Aware Proxy (Cloud IAP)](https://cloud.google.com/iap/docs/) is 
the recommended solution for accessing your Kubeflow 
deployment from outside the cluster, when running Kubeflow on Google Cloud
Platform (GCP).

This document is a step-by-step guide to ensuring that your IAP-secured endpoint
is available, and to debugging problems that may cause the endpoint to be
unavailable. 

## Introduction

When deploying Kubeflow using the [deployment UI](/docs/gke/deploy/deploy-ui/) 
or the [command-line interface](/docs/gke/deploy/deploy-cli/),
you choose the authentication method you want to use. One of the options is
Cloud IAP. This document assumes that you have already deployed Kubeflow.

Kubeflow uses the [Google-managed certificate](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs)
to provide an SSL certificate for the Kubeflow UI.

Cloud IAP gives you the following benefits:

 * Users can log in in using their GCP accounts.
 * You benefit from Google's security expertise to protect your sensitive 
   workloads.

## Monitoring your Cloud IAP setup

Follow these instructions to monitor your Cloud IAP setup and troubleshoot any
problems:

1. Examine the
  [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) 
  and Google Cloud Build (GCB) load balancer to make sure it is available:
  
     ```
     kubectl -n istio-system describe ingress

     Name:             envoy-ingress
     Namespace:        kubeflow
     Address:          35.244.132.160
     Default backend:  default-http-backend:80 (10.20.0.10:8080)
     Annotations:
     ...
     Events:
        Type     Reason     Age                 From                     Message
        ----     ------     ----                ----                     -------
        Normal   ADD        12m                 loadbalancer-controller  kubeflow/envoy-ingress
        Warning  Translate  12m (x10 over 12m)  loadbalancer-controller  error while evaluating the ingress spec: could not find service "kubeflow/envoy"
        Warning  Translate  12m (x2 over 12m)   loadbalancer-controller  error while evaluating the ingress spec: error getting BackendConfig for port "8080" on service "kubeflow/envoy", err: no BackendConfig for service port exists.
        Warning  Sync       12m                 loadbalancer-controller  Error during sync: Error running backend syncing routine: received errors when updating backend service: googleapi: Error 400: The resource 'projects/code-search-demo/global/backendServices/k8s-be-32230--bee2fc38fcd6383f' is not ready, resourceNotReady
      googleapi: Error 400: The resource 'projects/code-search-demo/global/backendServices/k8s-be-32230--bee2fc38fcd6383f' is not ready, resourceNotReady
        Normal  CREATE  11m  loadbalancer-controller  ip: 35.244.132.160
     ...
     ```

    There should be an annotation indicating that we are using managed certificate:

    ```
    annotation:
      networking.gke.io/managed-certificates: gke-certificate
    ```

    Any problems with creating the load balancer are reported as Kubernetes
    events in the results of the above `describe` command.

     * If the address isn't set then there was a problem creating the load 
       balancer.

     * The `CREATE` event indicates the load balancer was successfully 
       created on the specified IP address.

     * The most common error is running out of GCP quota. To fix this problem,
       you must either increase the quota for the relevant resource on your GCP 
       project or delete some existing resources.


1. Verify that a managed certificate resource is generated:
   
     ```
     kubectl describe -n istio-system managedcertificate gke-certificate
     ```

     The status field should have information about the current status of Certificate.
     Eventually, certificate status should be `Active`.

1. Wait for the load balancer to report the back ends as healthy:

     ```
     kubectl describe -n istio-system ingress envoy-ingress

     ...
     Annotations:
      kubernetes.io/ingress.global-static-ip-name:  kubeflow-ip
      kubernetes.io/tls-acme:                       true
      certmanager.k8s.io/issuer:                    letsencrypt-prod
      ingress.kubernetes.io/backends:               {"k8s-be-31380--5e1566252944dfdb":"HEALTHY","k8s-be-32133--5e1566252944dfdb":"HEALTHY"}
     ...
     ```

    Both backends should be reported as healthy.
    It can take several minutes for the load balancer to consider the back ends 
    healthy.

    The service with port `31380` is the one that handles Kubeflow 
    traffic. (31380 is the default port of the service `istio-ingressgateway`.)

    If the backend is unhealthy, check the pods in `istio-system`:
    * `kubectl get pods -n istio-system`
    * The `istio-ingressgateway-XX` pods should be running
    * Check the logs of `backend-updater-0`, `ingress-bootstrap-XX`, `iap-enabler-XX` to see if there is any error


1. Try accessing Cloud IAP at the fully qualified domain name in your web 
  browser:

    ```
    https://<your-fully-qualified-domain-name>     
    ```

    If you get SSL errors when you log in, this typically means that your SSL 
    certificate is still propagating. Wait a few minutes and try again. SSL 
    propagation can take up to 10 minutes.

    If you do not see a login prompt and you get a 404 error, the configuration
    of Cloud IAP is not yet complete. Keep retrying for up to 10 minutes.
