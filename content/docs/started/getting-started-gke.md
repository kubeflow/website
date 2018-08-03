+++
title = "GKE for Kubeflow"
description = "Get Kubeflow running on GKE"
weight = 10
toc = true
bref = "The Kubeflow project is dedicated to making deployments of machine learning (ML) workflows on Kubernetes simple, portable and scalable. Our goal is not to recreate other services, but to provide a straightforward way to deploy best-of-breed open-source systems for ML to diverse infrastructures. Anywhere you are running Kubernetes, you should be able to run Kubeflow."

[menu.docs]
  parent = "started"
  weight = 3
+++

## Deploying Kubeflow On GKE

Instructions for optimizing and deploying Kubeflow on GKE.

Running Kubeflow on GKE comes with the following advantages:

  * We use [Google Cloud Deployment Manager](https://cloud.google.com/deployment-manager/docs/) to 
    declaratively manage all non K8s resources (including the GKE cluster), which is easy to customize for your particular use case
  * You can take advantage of GKE autoscaling to scale your cluster horizontally and vertically
    to meet the demands of ML workloads with large resource requirements
  * [Identity Aware Proxy(IAP)](https://cloud.google.com/iap/) makes it easy to securely connect to Jupyter and other
    web apps running as part of Kubeflow
  * [Stackdriver](https://cloud.google.com/logging/docs/) makes it easy to persist logs to aid in debugging
    and troubleshooting
  * GPUs and [TPUs](https://cloud.google.com/tpu/) can be used to accelerate your work


### Create oauth client credentials

Create an OAuth Client ID to be used to identify IAP when requesting access to user's email to verify their identity.

1. Set up your OAuth consent screen:
   * Configure the [consent screen](https://console.cloud.google.com/apis/credentials/consent).
   * Under **Email address**, select the address that you want to display as a public contact. You must use either your email address or a Google Group that you own.
   * In the **Product name** box, enter a suitable name like `kubeflow`.
   * Under **Authorized domains**, enter

     ```
     <project>.cloud.goog
     ```
       
     where \<project\> is your GCP project id.

   * Click Save.
1. On the [Credentials](https://console.cloud.google.com/apis/credentials) screen:
   * Click **Create credentials**, and then click **OAuth client ID**.
   * Under **Application type**, select **Web application**.
   * In the **Name** box enter any name.
   * In the **Authorized redirect URIs** box, enter

     ```
     https://<hostname>/_gcp_gatekeeper/authenticate
     ```
   * \<hostname\> will be used later for iap-ingress, and should be in the format

     ```
     <name>.endpoints.<project>.cloud.goog
     ```
   * \<name\> and \<project\> will be set in the next step when you run [deploy.sh](https://github.com/kubeflow/kubeflow/blob/master/scripts/gke/deploy.sh)
      * deploy.sh uses **kubeflow** by default as \<name\> but you can configure this with the environment variable **DEPLOYMENT_NAME**
      * Project will use the default project for **gcloud** but this can be overwritten using the environment variable **PROJECT**
1. After you enter the details, click Create. 
      * Make note of the **client ID** and **client secret** that appear in the OAuth client window because we will need them later to enable IAP.
1. Create environment variable from the the OAuth client ID and secret:

    ```
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>
    ```

### Create the Kubeflow deployment

Run the following steps to deploy Kubeflow.

1. Run the deploy script to create GCP and K8s resources

     ```
     export KUBEFLOW_VERSION=0.2.2
     curl https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/gke/deploy.sh | bash
     ```
   * Basic settings (e.g. the zone) can be configured using environment variables. Refer to the [script](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/gke/deploy.sh) to see a complete list.
   * More advanced customization can be performed by updating the deployment manager or ksonnet configuration and updating the deployment and K8s resources. This is described in more detail in the following section.
1. Check resources deployed in namespace kubeflow

    ```
    kubectl -n kubeflow get  all
    ```
1. Kubeflow will be available at

    ```
    https://<name>.endpoints.<Project>.cloud.goog/
    ```
   * It can take 10-15 minutes for the endpoint to become available
     * Kubeflow needs to provision a signed SSL certificate and register a DNS name
   * If you own/manage the domain or a subdomain with [Cloud DNS](https://cloud.google.com/dns/docs/)
     then you can configure this process to be much faster.
     * See [kubeflow/kubeflow#731](https://github.com/kubeflow/kubeflow/issues/731)
   * While you wait you can access Kubeflow services by using `kubectl proxy` & `kubectl port-forward` to connect to services in the cluster.
1. The deployment script will create the following directories containing your configuration.    
   * **{DEPLOYMENT_NAME}_deployment_manager_configs** - Configuration for deployment manager
     * **Important** This directory will contain json files containing secrets for your service accounts. 
       **Checking your keys into source control is not advised**.
   * **{DEPLOYMENT_NAME}_ks-app** - Ksonnet application


## Customizing Kubeflow

The setup process makes it easy to customize GCP or Kubeflow for your particular use case. 
Under the hood [deploy.sh](https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/gke/deploy.sh)

  1. Creates all GCP resources using deployment manager
  1. Creates K8s resources using kubectl/ksonnet

This makes it easy to change your configuration by updating the config files and reapplying them.

Deployment manager uses [YAML files](https://github.com/kubeflow/kubeflow/tree/v0.2-branch/scripts/gke/deployment_manager_configs)
to define your GCP infrastructure. [deploy.sh](https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/gke/deploy.sh) creates a copy of these files in *${DEPLOYMENT_NAME}_deployment_manager_config* 

You can modify these files and then update your deployment.


```
CONFIG_FILE=${DEPLOYMENT_NAME}_deployment_manager_config/cluster-kubeflow.yaml
gcloud deployment-manager --project=${PROJECT} deployments update ${DEPLOYMENT_NAME} --config=${CONFIG_FILE}
```

### Common Customizations

Add GPU nodes to your cluster

  * Set gpu-pool-initialNodeCount [here](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L40) 

To use VMs with more CPUs or RAM 

  * Change the machineType 
  * There are two node pools 
      * one for CPU only machines [here](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/gke/deployment_manager_configs/cluster.jinja#L96)
      * one for GPU machines [here](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/gke/deployment_manager_configs/cluster.jinja#L96)
  * When making changes to the node pools you also need to bump the pool-version [here](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L37) before you update the deployment

To grant additional users IAM permissions to access Kubeflow

  * Add the users [here](https://github.com/kubeflow/kubeflow/blob/v0.2-branch/scripts/gke/deployment_manager_configs/cluster-kubeflow.yaml#L61)


After making the changes you need to update your deployment. 

For more information please refer to the [deployment manager docs](https://cloud.google.com/deployment-manager/docs/).

### Using Your Own Domain

If you want to use your own doman instead of **${name}.endpoints.${project}.cloud.goog** follow these instructions. 

1. Modify your ksonnet application to remove the `cloud-endpoints` component

    ```
    cd ${DEPLOYMENT_NAME}_ks_app
    ks delete default -c cloud-endpoints
    ks component rm cloud-endpoints
    ```

1. Set the domain for your ingress to be the fully qualified domain name

    ```
    ks param set iap-ingress hostname ${FQDN}
    ks apply default -c iap-ingress
    ```

1. Get the address of the static ip created 

    ```
    IPNAME=${DEPLOYMENT_NAME}-ip
    gcloud --project=${PROJECT} addresses describe --global ${IPNAME}
    ```

1. Use your DNS provider to map the fully qualified domain specified in the first step to the ip address reserved
   in GCP.

## Deleting your deployment

To delete your deployment and reclaim all resources

```
gcloud deployment-manager --project=${PROJECT} deployments delete ${DEPLOYMENT_NAME}
gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
```
## Troubleshooting

Here are some tips for troubleshooting IAP.

 * Make sure you are using https

### 404 Page Not Found

If get a 404 when navigating to 

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

* Try other services to see if their accessible e.g
  
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
          gcloud compute --project=${PROJECT} backend-services get-health --global ${BACKEND_ID}
          ```
    * Make sure the load balancer reports the backends as healthy
        * If the backends aren't reported as healthy check that the pods associated with the K8s service are up and running
        * Check that health checks are properly configured
          * Click on the health check associated with the backend service for envoy
          * Check that the path is /healthz and corresponds to the path of the readiness probe on the envoy pods
          * See [K8s docs](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/gce/examples/health_checks/README.md#limitations) for important information about how health checks are determined from readiness probes.

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
              # From the GKE cluster get the name of the managed instance group
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

  * Installl curl in the pod
  ```
  apt-get update && apt-get install -y curl
  ```

  * Verify access to the whoami app
  ```
  curl -L -s -i curl -L -s -i http://envoy:8080/noiap/whoami
  ```
  * If this doesn't return a 200 OK response; then there is a problem with the K8s resources
      * Check the pods are running
      * Check services are pointing at the points (look at the endpoints for the various services)
