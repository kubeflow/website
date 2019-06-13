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

Kubeflow uses the [Let's Encrypt](https://letsencrypt.org/) service to provide 
an SSL certificate for the Kubeflow UI.

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
     kubectl -n kubeflow describe ingress

     Name:             envoy-ingress
     Namespace:        kubeflow
     Address:          35.244.132.160
     Default backend:  default-http-backend:80 (10.20.0.10:8080)
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

       Any problems with creating the load balancer are reported as Kubernetes 
       events in the results of the above `describe` command.

     * If the address isn't set then there was a problem creating the load 
       balancer.

     * The `CREATE` event indicates the load balancer was successfully 
       created on the specified IP address.

     * The most common error is running out of GCP quota. To fix this problem,
       you must either increase the quota for the relevant resource on your GCP 
       project or delete some existing resources.


1. Verify that a signed SSL certificate was generated from 
  [Let's Encrypt](https://letsencrypt.org/):

      ```
      kubectl -n kubeflow get certificate envoy-ingress-tls  -o yaml

      apiVersion: certmanager.k8s.io/v1alpha1
      kind: Certificate
      metadata:
        annotations:
          ksonnet.io/managed: '{"pristine":"H4sIAAAAAAAA/6yRsW7zMAyE9/8xONv+463w2qlLhg5dggyMRDuCJVIQ6RSB4XcvlDQdCnRqN0EHfjzerYA5vFHRIAwDOCqWkHGi0s1P2gX5f+kx5jP20MAc2MMAz1QsjMGhETSQyNCjIQwrRDxR1PqaVZjJKsBJysLEBgMEzG3gqZAqbA0wJoIBiC9yffy3FhXukmZ0VZ+XE41R3uuIZnJ1Abo6uoITHsMEw2EFLwkDKwwHmMf2klCNSsu7viP2WQKbdg9U60LrKUe5JmLrXJTFd5PIBMcGzmZ511f6w+s3j7Btx60BJykJ7+9H/GJlA561Yv7Ae1BdqLzSeGvhs7C4VNzLTYKv2COZErtyzdbmIv4WL7lCtv+pl2379wEAAP//AQAA///uHVhQMgIAAA=="}'
          kubecfg.ksonnet.io/garbage-collect-tag: gc-tag
        creationTimestamp: 2019-04-02T22:49:43Z
        generation: 1
        labels:
          app.kubernetes.io/deploy-manager: ksonnet
          ksonnet.io/component: iap-ingress
        name: envoy-ingress-tls
        namespace: kubeflow
        resourceVersion: "4803"
        selfLink: /apis/certmanager.k8s.io/v1alpha1/namespaces/kubeflow/certificates/envoy-ingress-tls
        uid: 9b137b29-5599-11e9-a223-42010a8e020c
      spec:
        acme:
          config:
          - domains:
            - mykubeflow.endpoints.myproject.cloud.goog
            http01:
              ingress: envoy-ingress
        commonName: kf-vmaster-n01.endpoints.kubeflow-ci-deployment.cloud.goog
        dnsNames:
        - mykubeflow.endpoints.myproject.cloud.goog
        issuerRef:
          kind: ClusterIssuer
          name: letsencrypt-prod
        secretName: envoy-ingress-tls
      status:
        acme:
          order:
            url: https://acme-v02.api.letsencrypt.org/acme/order/54483154/382580193
        conditions:
        - lastTransitionTime: 2019-04-02T23:00:28Z
          message: Certificate issued successfully
          reason: CertIssued
          status: "True"
          type: Ready
        - lastTransitionTime: null
          message: Order validated
          reason: OrderValidated
          status: "False"
          type: ValidateFailed
      ```

    It can take around 10 minutes to provision a certificate after the 
    creation of the load balancer.

    The most recent condition should be `Certificate issued successfully`.

    The most common error is running out of [Let's Encrypt 
    quota](https://letsencrypt.org/docs/rate-limits/).
    Let's Encrypt enforces a quota of 5 duplicate certificates per week.
      
    The easiest fix to quota issues is to pick a different hostname by 
    recreating and redeploying Kubeflow with a different
    name. 

    For example if you originally ran the following `kfctl init` command:

    ```
    kfctl init myapp --project=myproject --platform=gcp
    ```

    Then rerun `kfctl init` with a different name that you haven't used
    before:

    ```
    kfctl init myapp-unique --project=myproject --platform=gcp
    ```

1. Wait for the load balancer to report the back ends as healthy:

     ```
     NODE_PORT=$(kubectl --namespace=${NAMESPACE} get svc envoy -o jsonpath='{.spec.ports[0].nodePort}')
     BACKEND_NAME=$(gcloud compute --project=${PROJECT} backend-services list --filter=name~k8s-be-${NODE_PORT}- --format='value(name)')
     gcloud compute --project=${PROJECT} backend-services get-health --global ${BACKEND_NAME}

     https://www.googleapis.com/compute/v1/projects/kubeflow-ci-deployment/zones/us-east1-b/instanceGroups/k8s-ig--686aad7559e1cf0e
     status:
        healthStatus:
        - healthState: HEALTHY
          instance: https://www.googleapis.com/compute/v1/projects/kubeflow-ci-deployment/zones/us-east1-b/instances/gke-kf-vmaster-n01-kf-vmaster-n01-cpu-66360615-xjrc
          ipAddress: 10.142.0.8
          port: 32694
        - healthState: HEALTHY
          instance: https://www.googleapis.com/compute/v1/projects/kubeflow-ci-deployment/zones/us-east1-b/instances/gke-kf-vmaster-n01-kf-vmaster-n01-cpu-66360615-gmmx
          ipAddress: 10.142.0.13
          port: 32694
        kind: compute#backendServiceGroupHealth
     ```

    Both back ends should be reported as healthy.
    It can take several minutes for the load balancer to consider the back ends 
    healthy.

    The service with port `${NODE_PORT}` is the one that handles Kubeflow 
    traffic.

    If a back end is unhealthy check the status of the Envoy pods:

    ```
    kubectl -n kubeflow get pods -l service=envoy
    NAME                     READY     STATUS    RESTARTS   AGE
    envoy-69bf97959c-29dnw   2/2       Running   2          1d
    envoy-69bf97959c-5w5rl   2/2       Running   3          1d
    envoy-69bf97959c-9cjtg   2/2       Running   3          1d
    ```

    * The back ends should have status `Running`.

    * A small number of restarts is expected since the configuration process
      restarts the Envoy containers.

    * If the pods are crash looping look at the logs to try to figure out why.

        ```
        kubectl -n kubeflow logs ${POD}
        ```

        Refer to the [troubleshooting 
        guide](/docs/gke/troubleshooting-gke/#envoy-pods-crash-looping-root-cause-is-backend-quota-exceeded)
        for common problems, including exceeded quota.

1. Now that the certificate exists, the Ingress resource should report that it 
  is serving on HTTPS:

    ```
    kubectl -n kubeflow get ingress
    NAME            HOSTS                                                        ADDRESS          PORTS     AGE
    envoy-ingress   mykubeflow.endpoints.myproject.cloud.goog   35.244.132.159   80, 443   1d
    ```

    If you don't see port 443, look at the Ingress events using 
    `kubectl describe` to see if there are any errors.


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

1. If you get an error `Error: redirect_uri_mismatch` after logging in, this 
  means the list of OAuth authorized redirect URIs does not include your domain.

    The full error message looks like the following example and includes the 
    relevant links:

    ```
    The redirect URI in the request, https://mykubeflow.endpoints.myproject.cloud.goog/_gcp_gatekeeper/authenticate, does not match the ones authorized for the OAuth client. 
    To update the authorized redirect URIs, visit: https://console.developers.google.com/apis/credentials/oauthclient/22222222222-7meeee7a9a76jvg54j0g2lv8lrsb4l8g.apps.googleusercontent.com?project=22222222222
    ```

    Follow the link in the error message to find the OAuth credential being used
    and add the redirect URI listed in the error message to the list of 
    authorized URIs. For more information, read the guide to 
    [setting up OAuth for Cloud IAP](/docs/gke/deploy/oauth-setup/).

## Expiry of the SSL certificate from Let's Encrypt

Kubeflow runs an agent in your cluster to renew the Let's Encrypt certificate
automatically. You don't need to take any action.
For more information, see the [Let's Encrypt 
documentation](https://letsencrypt.org/docs/integration-guide/).

For questions and support about the certificate, visit 
[Let's Encrypt support](https://community.letsencrypt.org/).