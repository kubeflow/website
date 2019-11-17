+++
title = "Troubleshooting Deployments on GKE"
description = "Help fixing problems on GKE and GCP"
weight = 6
+++

This guide helps diagnose and fix issues you may encounter with Kubeflow on 
Google Kubernetes Engine (GKE) and Google Cloud Platform (GCP).

## Before you start

This guide covers troubleshooting specifically for 
[Kubeflow deployments on GCP](/docs/gke/deploy/).

For more help, try the 
[general Kubeflow troubleshooting guide](/docs/other-guides/troubleshooting).

This guide assumes the following settings: 

* The `${KF_DIR}` environment variable contains the path to
  your Kubeflow application directory, which holds your Kubeflow configuration 
  files. For example, `/opt/my-kubeflow/`.

  ```
  export KF_DIR=<path to your Kubeflow application directory>
  ``` 

* The `${CONFIG_FILE}` environment variable contains the path to your 
  Kubeflow configuration file.

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-gcp-iap %}}
  ```

    Or:

  ```
  export CONFIG_FILE=${KF_DIR}/{{% config-file-gcp-basic-auth %}}
  ```

* The `${KF_NAME}` environment variable contains the name of your Kubeflow 
  deployment. You can find the name in your `${CONFIG_FILE}` 
  configuration file, as the value for the `metadata.name` key.

  ```
  export KF_NAME=<the name of your Kubeflow deployment>
  ```

* The `${PROJECT}` environment variable contains the ID of your GCP project. 
  You can find the project ID in 
  your `${CONFIG_FILE}` configuration file, as the value for the `project` key.

  ```
  export PROJECT=<your GCP project ID>
  ```

* The `${ZONE}` environment variable contains the GCP zone where your
  Kubeflow resources are deployed.

  ```
  export ZONE=<your GCP zone>
  ```

* For further background about the above settings, see the guide to
  [deploying Kubeflow with the CLI](/docs/gke/deploy/deploy-cli).

## Troubleshooting Kubeflow deployment on GCP

Here are some tips for troubleshooting GCP.

* Make sure you are a GCP project owner.
* Make sure you are using HTTPS.
* Check project [quota page](https://console.cloud.google.com/iam-admin/quotas) to see if any service's current usage reached quota limit, increase them as needed.
* Check [deployment manager page](https://console.cloud.google.com/deployments) and see if there’s a failed deployment.
* Check if endpoint is up: do [DNS lookup](https://mxtoolbox.com/DNSLookup.aspx) against your Cloud Identity-Aware Proxy (Cloud IAP) URL and see if it resolves to the correct IP address.
* Check if certificate succeeded: `kubectl describe certificates -n istio-system` should give you certificate status.
* Check ingress status: `kubectl describe ingress -n istio-system`
* Check if [endpoint entry](https://console.cloud.google.com/endpoints) is created. There should be one entry with name `<deployment>.endpoints.<project>.cloud.goog`
  * If endpoint entry doesn't exist, check `kubectl describe cloudendpoint -n istio-system`
* If using IAP: make sure you [added](/docs/gke/deploy/oauth-setup/) `https://<deployment>.endpoints.<project>.cloud.goog/_gcp_gatekeeper/authenticate`
as an authorized redirect URI for the OAUTH credentials used to create the deployment.
* If using IAP: see the guide to 
  [monitoring your Cloud IAP setup](/docs/gke/deploy/monitor-iap-setup/).
* See the sections below for troubleshooting specific problems.
* Please [report a bug](https://github.com/kubeflow/kubeflow/issues/new?template=bug_report.md) if you can't resolve the problem by following the above steps.

### DNS name not registered

This section provides troubleshooting information for problems creating a DNS entry for your [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/). The ingress is a K8s resource
that creates a GCP loadbalancer to enable http(s) access to Kubeflow web services from outside
the cluster. This section assumes
you are using [Cloud Endpoints](https://cloud.google.com/endpoints/) and a DNS name of the following pattern

```
https://${KF_NAME}.endpoints.${PROJECT}.cloud.goog
```

Symptoms:

  * When you access the the URL in Chrome you get the error: **server IP address could not be found**
  * nslookup for the domain name doesn't return the IP address associated with the ingress

    ```
    nslookup ${KF_NAME}.endpoints.${PROJECT}.cloud.goog
    Server:   127.0.0.1
    Address:  127.0.0.1#53

    ** server can't find ${KF_NAME}.endpoints.${PROJECT}.cloud.goog: NXDOMAIN
    ```

Troubleshooting

1. Check the `cloudendpoints` resource

   ```
   kubectl get cloudendpoints -o yaml ${KF_NAME}
   kubectl describe cloudendpoints ${KF_NAME}
   ```

   * Check if there are errors indicating problems creating the endpoint

1. The status of the `cloudendpoints` object will contain the cloud operation used to register the operation

   * For example

     ```
      status:
        config: ""
        configMapHash: ""
        configSubmit: operations/serviceConfigs.jlewi-1218-001.endpoints.cloud-ml-dev.cloud.goog:43fe6c6f-eb9c-41d0-ac85-b547fc3e6e38
        endpoint: jlewi-1218-001.endpoints.cloud-ml-dev.cloud.goog
        ingressIP: 35.227.243.83
        jwtAudiences: null
        lastAppliedSig: 4f3b903a06a683b380bf1aac1deca72792472429
        observedGeneration: 1
        stateCurrent: ENDPOINT_SUBMIT_PENDING

     ```

  * You can check the status of the operation by running:

    ```
    gcloud --project=${PROJECT} endpoints operations describe ${OPERATION}
    ```

    * Operation is everything after `operations/` in the `configSubmit` field

### 404 Page Not Found When Accessing Central Dashboard

This section provides troubleshooting information for 404s, page not found, being return by the central dashboard which is served at

   ```
   https://${KUBEFLOW_FQDN}/
   ```

   * ***KUBEFLOW_FQDN*** is your project's OAuth web app URI domain name `<name>.endpoints.<project>.cloud.goog`
   * Since we were able to sign in this indicates the Ambassador reverse proxy is up and healthy we can confirm this is the case by running the following command

   ```
   kubectl -n ${NAMESPACE} get pods -l service=envoy

   NAME                     READY     STATUS    RESTARTS   AGE
   envoy-76774f8d5c-lx9bd   2/2       Running   2          4m
   envoy-76774f8d5c-ngjnr   2/2       Running   2          4m
   envoy-76774f8d5c-sg555   2/2       Running   2          4m
   ```

* Try other services to see if they're accessible for example

   ```
   https://${KUBEFLOW_FQDN}/whoami
   https://${KUBEFLOW_FQDN}/tfjobs/ui
   https://${KUBEFLOW_FQDN}/hub
   ```

 * If other services are accessible then we know its a problem specific to the central dashboard and not ingress
 * Check that the centraldashboard is running

    ```
    kubectl get pods -l app=centraldashboard
    NAME                                READY     STATUS    RESTARTS   AGE
    centraldashboard-6665fc46cb-592br   1/1       Running   0          7h
    ```

 * Check a service for the central dashboard exists

    ```
    kubectl get service -o yaml centraldashboard
    ```

 * Check that an Ambassador route is properly defined

    ```
    kubectl get service centraldashboard -o jsonpath='{.metadata.annotations.getambassador\.io/config}'

    apiVersion: ambassador/v0
      kind:  Mapping
      name: centralui-mapping
      prefix: /
      rewrite: /
      service: centraldashboard.kubeflow,
    ```

 * Check the logs of Ambassador for errors. See if there are errors like the following indicating
   an error parsing the route.If you are using the new Stackdriver Kubernetes monitoring you can use the following filter in the [stackdriver console](https://console.cloud.google.com/logs/viewer)

    ```
     resource.type="k8s_container"
     resource.labels.location=${ZONE}
     resource.labels.cluster_name=${CLUSTER}
     metadata.userLabels.service="ambassador"
    "could not parse YAML"
    ```

### 502 Server Error
A 502 usually means traffic isn't even making it to the envoy reverse proxy. And it
usually indicates the loadbalancer doesn't think any backends are healthy.

* In Cloud Console select Network Services -> Load Balancing
    * Click on the load balancer (the name should contain the name of the ingress)
    * The exact name can be found by looking at the `ingress.kubernetes.io/url-map` annotation on your ingress object
       ```
       URLMAP=$(kubectl --namespace=${NAMESPACE} get ingress envoy-ingress -o jsonpath='{.metadata.annotations.ingress\.kubernetes\.io/url-map}')
       echo ${URLMAP}
       ```
    * Click on your loadbalancer
    * This will show you the backend services associated with the load balancer
        * There is 1 backend service for each K8s service the ingress rule routes traffic too
        * The named port will correspond to the NodePort a service is using

          ```
          NODE_PORT=$(kubectl --namespace=${NAMESPACE} get svc envoy -o jsonpath='{.spec.ports[0].nodePort}')
          BACKEND_NAME=$(gcloud compute --project=${PROJECT} backend-services list --filter=name~k8s-be-${NODE_PORT}- --format='value(name)')
          gcloud compute --project=${PROJECT} backend-services get-health --global ${BACKEND_NAME}
          ```
    * Make sure the load balancer reports the backends as healthy
        * If the backends aren't reported as healthy check that the pods associated with the K8s service are up and running
        * Check that health checks are properly configured
          * Click on the health check associated with the backend service for envoy
          * Check that the path is /healthz and corresponds to the path of the readiness probe on the envoy pods
          * See [K8s docs](https://github.com/kubernetes/contrib/blob/{{< params "githubbranch" >}}/ingress/controllers/gce/examples/health_checks/README.md#limitations) for important information about how health checks are determined from readiness probes.

        * Check firewall rules to ensure traffic isn't blocked from the GCP loadbalancer
            * The firewall rule should be added automatically by the ingress but its possible it got deleted if you have some automatic firewall policy enforcement. You can recreate the firewall rule if needed with a rule like this

               ```
               gcloud compute firewall-rules create $NAME \
              --project $PROJECT \
              --allow tcp:$PORT \
              --target-tags $NODE_TAG \
              --source-ranges 130.211.0.0/22,35.191.0.0/16
               ```

           * To get the node tag

              ```
              # From the Kubernetes Engine cluster get the name of the managed instance group
              gcloud --project=$PROJECT container clusters --zone=$ZONE describe $CLUSTER
              # Get the template associated with the MIG
              gcloud --project=kubeflow-rl compute instance-groups managed describe --zone=${ZONE} ${MIG_NAME}
              # Get the instance tags from the template
              gcloud --project=kubeflow-rl compute instance-templates describe ${TEMPLATE_NAME}

              ```

              For more info [see GCP HTTP health check docs](https://cloud.google.com/compute/docs/load-balancing/health-checks)

  * In Stackdriver Logging look at the Cloud Http Load Balancer logs

    * Logs are labeled with the forwarding rule
    * The forwarding rules are available via the annotations on the ingress
      ```
      ingress.kubernetes.io/forwarding-rule
      ingress.kubernetes.io/https-forwarding-rule
      ```

  * Verify that requests are being properly routed within the cluster
  * Connect to one of the envoy proxies

        ```
        kubectl exec -ti `kubectl get pods --selector=service=envoy -o jsonpath='{.items[0].metadata.name}'` /bin/bash
        ```

  * Install curl in the pod
  ```
  apt-get update && apt-get install -y curl
  ```

  * Verify access to the whoami app
  ```
  curl -L -s -i http://envoy:8080/noiap/whoami
  ```
  * If this doesn't return a 200 OK response; then there is a problem with the K8s resources
      * Check the pods are running
      * Check services are pointing at the points (look at the endpoints for the various services)

### Problems with SSL certificate from Let's Encrypt

See the guide to 
[monitoring your Cloud IAP setup](/docs/gke/deploy/monitor-iap-setup/).

## Envoy pods crash-looping: root cause is backend quota exceeded

If your logs show the 
[Envoy](https://istio.io/docs/concepts/what-is-istio/#envoy) pods crash-looping, 
the root cause may be that you have exceeded your quota for some 
backend services such as loadbalancers. 
This is particularly likely if you have multiple, differently named deployments 
in the same GCP project using [Cloud IAP](https://cloud.google.com/iap/).

### The error

The error looks like this for the pod's Envoy container:

```
kubectl logs -n kubeflow envoy-79ff8d86b-z2snp envoy
[2019-01-22 00:19:44.400][1][info][main] external/envoy/source/server/server.cc:184] initializing epoch 0 (hot restart version=9.200.16384.127.options=capacity=16384, num_slots=8209 hash=228984379728933363)
[2019-01-22 00:19:44.400][1][critical][main] external/envoy/source/server/server.cc:71] error initializing configuration '/etc/envoy/envoy-config.json': unable to read file: /etc/envoy/envoy-config.json
```

And the Cloud IAP container shows a message like this:

```
Waiting for backend id PROJECT=<your-project> NAMESPACE=kubeflow SERVICE=envoy filter=name~k8s-be-30352-...
```

### Diagnosing the cause

You can verify the cause of the problem by entering the following command:

```
kubectl -n istio-system describe ingress
```

Look for something like this in the output:

```
Events:
  Type     Reason  Age                  From                     Message
  ----     ------  ----                 ----                     -------
  Warning  Sync    14m (x193 over 19h)  loadbalancer-controller  Error during sync: googleapi: Error 403: Quota 'BACKEND_SERVICES' exceeded. Limit: 5.0 globally., quotaExceeded
```

### Fixing the problem

If you have any redundant Kubeflow deployments, you can delete them using
the [Deployment Manager](https://cloud.google.com/deployment-manager/docs/).

Alternatively, you can request more backend services quota on the GCP Console.

1. Go to the [quota settings for backend services on the GCP 
  Console](https://console.cloud.google.com/iam-admin/quotas?metric=Backend%20services).
1. Click **EDIT QUOTAS**. A quota editing form opens on the right of the
  screen.
1. Follow the form instructions to apply for more quota.


## Legacy networks are not supported

Cloud Filestore and GKE try to use the network named `default` by default. For older projects,
this will be a legacy network which is incompatible with Cloud Filestore and newer GKE features
like private clusters. This will
manifest as the error **"default is invalid; legacy networks are not supported"** when
deploying Kubeflow.

Here's an example error when deploying Cloud Filestore:

```
ERROR: (gcloud.deployment-manager.deployments.update) Error in Operation [operation-1533189457517-5726d7cfd19c9-e1b0b0b5-58ca11b8]: errors:
- code: RESOURCE_ERROR
  location: /deployments/jl-0801-b-gcfs/resources/filestore
  message: '{"ResourceType":"gcp-types/file-v1beta1:projects.locations.instances","ResourceErrorCode":"400","ResourceErrorMessage":{"code":400,"message":"network
    default is invalid; legacy networks are not supported.","status":"INVALID_ARGUMENT","statusMessage":"Bad
    Request","requestPath":"https://file.googleapis.com/v1beta1/projects/cloud-ml-dev/locations/us-central1-a/instances","httpMethod":"POST"}}'

```

To fix this we can create a new network:

```
cd ${KF_DIR}
cp .cache/master/deployment/gke/deployment_manager_configs/network.* \
   ./gcp_config/
```

Edit `network.yaml `to set the name for the network.

Edit `gcfs.yaml` to use the name of the newly created network.

Apply the changes.

```
cd ${KF_DIR}
kfctl apply -V -f ${CONFIG}
```

## CPU platform unavailable in requested zone

By default we set minCpuPlatform to `Intel Haswell` to make sure AVX2 is supported.
See [troubleshooting](/docs/other-guides/troubleshooting/) for more details.

If you encounter this `CPU platform unavailable` error (might manifest as
`Cluster is currently being created, deleted, updated or repaired and cannot be updated.`),
you can change the [zone](https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L31)
or change the [minCpuPlatform](https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deployment_manager_configs/cluster.jinja#L105).
See [here](https://cloud.google.com/compute/docs/regions-zones/#available)
for available zones and cpu platforms.

## Changing the OAuth client used by IAP

If you need to change the OAuth client used by IAP you can run the following commands
to replace the Kubernetes secret containing the ID and secret.

```
kubectl -n kubeflow delete secret kubeflow-oauth
kubectl -n kubeflow create secret generic kubeflow-oauth \
       --from-literal=CLIENT_ID=${CLIENT_ID} \
       --from-literal=CLIENT_SECRET=${CLIENT_SECRET}
```
