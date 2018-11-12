+++
title = "Troubleshooting Deployments on GKE"
description = "Help fixing problems on GKE and GCP"
weight = 3
toc = true
bref = "This guide helps diagnose and fix issues you may encounter with Kubeflow on Google Kubernetes Engine (GKE)."

[menu.docs]
  parent = "gke"
  weight = 6
+++

## Before you start

This guide covers troubleshooting specifically for 
[Kubeflow deployments on GKE](/docs/started/getting-started-gke).

For more help, try the 
[general Kubeflow troubleshooting guide](/docs/guides/troubleshooting).

## Troubleshooting Cloud IAP

Here are some tips for troubleshooting Cloud IAP.

 * Make sure you are using HTTPS

### 404 Page Not Found When Accessing Central Dashboard

This section provides troubleshooting information for 404s, page not found, being return by the central dashboard which is served at

   ```
   https://${KUBEFLOW_FQDN}/
   ```

* Since we were able to sign in this indicates the Ambassador reverse proxy is up and healthy we can confirm this is the case by running the following command

   ```
   kubectl -n ${NAMESPACE} get pods -l service=envoy

   NAME                     READY     STATUS    RESTARTS   AGE
   envoy-76774f8d5c-lx9bd   2/2       Running   2          4m
   envoy-76774f8d5c-ngjnr   2/2       Running   2          4m
   envoy-76774f8d5c-sg555   2/2       Running   2          4m
   ```

* Try other services to see if they're accessible e.g

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

## Cloud Filestore: legacy networks are not supported

Cloud Filestore tries to use the network named `default` by default. For older projects,
this will be a legacy network which is incompatible with Cloud Filestore. This will
manifest as an error like the following when deploying Cloud Filestore:

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
cp ${KUBEFLOW_REPO}/scripts/deployment_manager_configs/network.* \
   ${KFAPP}/gcp_config/
```

Edit `network.yaml `to set the name for the network.

Edit `gcfs.yaml` to use the name of the newly created network.

Apply the changes.

```
cd ${KFAPP}
${KUBEFLOW_REPO}/scripts/kfctl.sh apply platform
```

## CPU platform unavailable in requested zone

By default we set minCpuPlatform to `Intel Haswell` to make sure AVX2 is supported.
See [troubleshooting](/docs/guides/troubleshooting/) for more details.

If you encounter this `CPU platform unavailable` error (might manifest as
`Cluster is currently being created, deleted, updated or repaired and cannot be updated.`),
you can change the [zone](https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L31)
or change the [minCpuPlatform](https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deployment_manager_configs/cluster.jinja#L105).
See [here](https://cloud.google.com/compute/docs/regions-zones/#available)
for available zones and cpu platforms.
