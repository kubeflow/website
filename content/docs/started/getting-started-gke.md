+++
title = "GKE for Kubeflow"
description = "Get Kubeflow running on GKE"
weight = 10
toc = true
bref = "The Kubeflow project is dedicated to making deployments of machine learning (ML) workflows on Kubernetes simple, portable and scalable. Our goal is not to recreate other services, but to provide a straightforward way to deploy best-of-breed open-source systems for ML to diverse infrastructures. Anywhere you are running Kubernetes, you should be able to run Kubeflow"

[menu.docs]
  parent = "started"
  weight = 3
+++

## Deploying Kubeflow On GKE

Instructions for optimizing Kubeflow for GKE.

These instructions take advantage of [Google Cloud Deployment Manager](https://cloud.google.com/deployment-manager/docs/)
to manage your GKE cluster and other GCP resources that you might want to use with Kubeflow.

The instructions also take advantage of IAP to provide secure authenticated access web-apps running as part of Kubeflow.

## Create the Kubeflow deployment

1. Make a copy of the [configs](https://github.com/kubeflow/kubeflow/tree/master/docs/gke/configs) directory. Its a
good idea to check this into source control to make it easy to version and rollback your configs.

1. Modify `cluster-kubeflow.yaml`

   1. Set the zone for your cluster
   1. Set `ipName` to a value that is unique with respect to your project.
      The ipName needs to be set in two places:

          1. Inside properties

             ```
             ...
             properties:
             ...
             ipName: your-ip-name
             ...
             ```

          1. Parameter ipName in component iap-ingress

             ```
             properties:
               bootstrapperConfig: |
                 app:
                   ...
                   parameters:
                     - component: iap-ingress
                       name: ipName
                       value: your-ip-name
                   ...
             ```

   1. Set parameter acmeEmail in bootstrapperConfig to your email address
   1. Set parameter hostname in bootstrapperConfig

         ```
            - component: iap-ingress
                name: hostname
                value: <name>.endpoints.<Project>.cloud.goog
         ```

      * Replace project with the id of your project
      * Replace name with a unique name for your deployment

   1. Change the initial number of nodes if desired

      * If you want GPUs set a non-zero number for number of GPU nodes.

   1. List any users (Google Accounts) or Google groups that should be able to access Kubeflow in the **users** section; e.g.

         ```
          users:
            - user:john@acme.com
            - group:data-scientists@acme.com
         ```

1. [Create an OAuth Client ID](#create-oauth-client-credentials)

1. Modify [env-kubeflow.sh](https://github.com/kubeflow/kubeflow/blob/master/docs/gke/configs/env-kubeflow.sh)

   * This file defines environment variables used in the commands below.
   * We recommend checking a modified version into source control so its easy to source and repeat the commands.
   * Make sure you have `CLIENT_ID` and `CLIENT_SECRET` in your environment separately. These credentials are
     sensitive and should not be checked into source control along with `env-kubeflow.sh`.

1. Run the [deploy.sh](https://github.com/kubeflow/kubeflow/blob/master/docs/gke/configs/deploy.sh) script:

    ```
    $ ./deploy.sh
    ```

1. Verify deployment

   * Check the bootstrapper is running without errors

     ```
     kubectl -n kubeflow-admin get pods
     NAME                      READY     STATUS    RESTARTS   AGE
     kubeflow-bootstrapper-0   1/1       Running   1          10m
     ```

   * Check resources deployed in namespace kubeflow

     ```
     kubectl -n kubeflow get  all
     ```

1. Kubeflow will be available at

    ```
    https://<hostname>/_gcp_gatekeeper/authenticate
    ```

1. Grant users IAP access

   * Users/Google groups listed in **users:** in the ${CONFIG_FILE} will be granted IAP access

   * To give access to additional users you have 2 options

     1. Update ${CONFIG_FILE} and issue an update

        ```
        gcloud deployment-manager --project=${PROJECT} deployments update ${DEPLOYMENT_NAME} --config=${CONFIG_FILE}
        ```

     1. Use gcloud to grant users access

        ```
        gcloud projects add-iam-policy-binding $PROJECT \
         --role roles/iap.httpsResourceAccessor \
         --member user:${USER_EMAIL}
        ```

### Create oauth client credentials

Create an OAuth Client ID to be used to identify IAP when requesting acces to user's email to verify their identity.

1. Set up your OAuth consent screen:

   * Configure the [consent screen](https://console.cloud.google.com/apis/credentials/consent).
   * Under Email address, select the address that you want to display as a public contact. You must use either your email address or a Google Group that you own.
   * In the Product name box, enter a suitable like save `kubeflow`
   * Click Save.

1. On the [Credentials](https://console.cloud.google.com/apis/credentials) Click Create credentials, and then click OAuth client ID.

   * Under Application type, select Web application. In the Name box enter a name, and in the Authorized redirect URIs box, enter

     ```
     https://<hostname>/_gcp_gatekeeper/authenticate
     ```

   * \<hostname\> should be the one you set for iap-ingress during previous steps. (format: <name>.endpoints.<Project>.cloud.goog)

1. After you enter the details, click Create.
Make note of the **client ID** and **client secret** that appear in the
OAuth client window because we
will need them later to enable IAP.

1. Create environment variable from the the OAuth client ID and secret:

      ```
      export CLIENT_ID=<CLIENT_ID from OAuth page>
      export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>
      ```

### Using Your Own Domain

If you want to use your own doman instead of **${name}.endpoints.${project}.cloud.goog** make these modifications to ${CONFIG_FILE} before you create the deployment.

1. Set parameter hostname in bootstrapperConfig to the fully qualified domain you will use
   e.g. `my-kubeflow.my-domain.com`
1. Remove the component `cloud-endpoints` by deleting the following lines

       ```
        - name: cloud-endpoints
          prototype: cloud-endpoints
       ```

1. Remove parameters for component `cloud-endpoints` by deleting the following lines.

       ```
        - component: cloud-endpoints
          name: secretName
          value: admin-gcp-sa
       ```

1. After you create the deployment you can get the address of the static ip created

       ```
       gcloud --project=${PROJECT} addresses describe --global ${IPNAME}
       ```

   * IPNAME - should be the value assigned to property **ipName** in ${CONFIG_FILE}

1. Use your DNS provider to map the fully qualified domain specified in the first step to the ip address reserved
   in GCP.

### Using GPUs

To Use GPUs

1. Set the property **gpu-pool-initialNodeCount** in ${CONFIG_FILE} to the desired number of GPU nodes

1. Follow the instructions in the previous section to create the deployment; if your deployment already exists you can update it as follows

   1. Set a new value for property **pool-version** in ${CONFIG_FILE}
   1. Update the deployment

         ```
         gcloud deployment-manager --project=${PROJECT} deployments update ${PROJECT} --config=${CONFIG_FILE}
         ```
   **Warning** These deletes the existing node pools and creates new ones. This means all processes currently running
   on your cluster will be restarted and temporarily unavailable

1. Run the command below to install the GPU drivers on the nodes.
   ```
   kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/nvidia-driver-installer/cos/daemonset-preloaded.yaml
   ```

## Copying your Kubeflow ksonnet application

To further customize your Kubeflow deployment you can copy the app to your local machine

```
kubectl cp kubeflow-admin/kubeflow-bootstrapper-0:/opt/bootstrap/default ~/my-kubeflow
```

We recommend checking in your deployment to source control.

## Deleting your deployment

To delete your deployment and reclaim all resources

```
gcloud deployment-manager --project=${PROJECT} deployments delete ${DEPLOYMENT_NAME}
gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
```
## Troubleshooting

Here are some tips for troubleshooting IAP.

 * Make sure you are using https

### 502 Server Error
A 502 usually means traffic isn't even making it to the envoy reverse proxy. And it
usually indicates the loadbalancer doesn't think any backends are healthy.

* In Cloud Console select Network Services -> Load Balancing
    * Click on the load balancer (the name should contain the name of the ingress)
    * The exact name can be found by looking at the `ingress.kubernetes.io/url-map` annotation on your ingress object
    * Click on your loadbalancer
    * This will show you the backend services associated with the load balancer
        * There is 1 backend service for each K8s service the ingress rule routes traffic too
        * The named port will correspond to the NodePort a service is using
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
