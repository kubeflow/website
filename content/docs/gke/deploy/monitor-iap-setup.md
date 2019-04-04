+++
title = "Monitor IAP Setup"
description = "Instructions for monitoring and troubleshooting IAP"
weight = 5
+++

Using identity aware proxy (IAP) is the recommended solution for accessing your Kubeflow 
deployment from outside the cluster.

This is a step to step guide to ensuring your IAP secured endpoint comes up and
debugging problems when it doesn't.

While it requires some effort, the end result is well worth it

 * Users can easily login in using their GCP accounts
 * You rely on Google's security expertise to protect your sensitive workloads


1. The first step is to ensure the ingress and GCB loadbalancer is created
  
     ```
     kubectl -n kubeflow describe ingress

     Name:             envoy-ingress
     Namespace:        kubeflow
     Address:          35.244.132.160
     Default backend:  default-http-backend:80 (10.20.0.10:8080)
     ...
     ```

     * If the address isn't set then there was a problem creating the loadbalancer

     * If there are any problems creating the loadbalancer they will be reported as Kubernetes events that show up
       when you run describe

     * The most common error is running out of GCP quota

     * If you run out of GCP quota you will either need to increase the quota on your project for that resource
       or else delete some existing resources.


1. Verify that a signed SSL certificate could be generated using [Let's Encrypt](https://letsencrypt.org/)

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

     * The most recent condition should be **Certificate issued successfully**
     * It can take around 10 minutes to provision a certificate after the GCP loadbalancer is created
     * The most common error is hitting Let's Encrypt quota issues
       
       * The easiest fix to quota issues is to pick a different hostname by recreating and redeploying Kubeflow with a different
         name 

       * For example if you ran 

         ```
         kfctl init myapp --project=myproject --platform=gcp
         ```

       * Rerun kfctl with a different name that you had not previously used

         ```
         kfctl init myapp-unique --project=myproject --platform=gcp
         ```

1. Wait for the load balancer to report the backends as healthy

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

    * Both backends should be reported as healthy

    * It can take several minutes for the load balancer to consider the backend healthy

    * The service with port **${NODE_PORT}** is the one we care about most since that is the one handling Kubeflow traffic

    * If the backend is unhealthy check the status of the envoy podss

      ```
      kubectl -n kubeflow get pods -l service=envoy
      NAME                     READY     STATUS    RESTARTS   AGE
      envoy-69bf97959c-29dnw   2/2       Running   2          1d
      envoy-69bf97959c-5w5rl   2/2       Running   3          1d
      envoy-69bf97959c-9cjtg   2/2       Running   3          1d
      ```

      	* The backends should have status Running

      	* A small number of restarts is expected since the envoy containers need to be restarted as part of their configuration process


     * If the pods are crash looping look at the logs to try to figure out why

       ```
       kubectl -n kubeflow logs ${POD}
       ```

1. Now that the certificate exists the ingress should report that it is serving on https as well

       ```
       kubectl -n kubeflow get ingress
       NAME            HOSTS                                                        ADDRESS          PORTS     AGE
       envoy-ingress   mykubeflow.endpoints.myproject.cloud.goog   35.244.132.159   80, 443   1d
       ```

     * If you don't see 443 look at the ingress events using `kubectl describe` to see if there are any errors


1. Try accessing IAP at the full qualified domain name in your web browser

     ```
     https://${FQDN}     
     ```

     * If you get SSL errors this typically means your SSL certificate is still propogating wait a bit and try again

       * SSL propogation could take up to 10 minutes

1. After logging in if you get an error **Error: redirect_uri_mismatch** this means the OAuth authorized redirect 
     URIs does not include your domain

  	 * The full error message will look like the following include the relevant links

  	   ```
  	   The redirect URI in the request, https://mykubeflow.endpoints.myproject.cloud.goog/_gcp_gatekeeper/authenticate, does not match the ones authorized for the OAuth client. 
  	   To update the authorized redirect URIs, visit: https://console.developers.google.com/apis/credentials/oauthclient/22222222222-7meeee7a9a76jvg54j0g2lv8lrsb4l8g.apps.googleusercontent.com?project=22222222222
  	   ```

  	 * Follow the link in the error message to navigate to the OAuth credential being used and add the redirect URI listed in the error
  	   message to the list of authorized URIs
