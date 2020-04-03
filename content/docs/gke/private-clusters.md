+++
title = "Securing Your Clusters"
description = "How to secure Kubeflow clusters using VPC service controls and private GKE"
weight = 70
+++

{{% alert title="Alpha version" color="warning" %}}
This feature is currently in **alpha** release status with limited support. The
Kubeflow team is interested in any feedback you may have, in particular with 
regards to usability of the feature. Note the following issues already reported:

* [Documentation on how to use Kubeflow with shared VPC](https://github.com/kubeflow/kubeflow/issues/3082)
* [Replicating Docker images to private Container Registry](https://github.com/kubeflow/kubeflow/issues/3210)
* [Installing Istio for Kubeflow on private GKE](https://github.com/kubeflow/kubeflow/issues/3650)
* [Profile-controller crashes on GKE private cluster](https://github.com/kubeflow/kubeflow/issues/4661)
* [kfctl should work with private GKE without public endpoint](https://github.com/kubeflow/kfctl/issues/158)
{{% /alert %}}

This guide describes how to secure Kubeflow using [VPC Service Controls](https://cloud.google.com/vpc-service-controls/docs/) and private GKE.

Together these two features signficantly increase security
and mitigate the risk of data exfiltration.

  * VPC Service Controls allow you to define a perimeter around
    Google Cloud Platform (GCP) services.
    
    Kubeflow uses VPC Service Controls to prevent applications
    running on GKE from writing data to GCP resources outside
    the perimeter.

  * Private GKE removes public IP addresses from GKE nodes making
    them inaccessible from the public internet.

    Kubeflow uses IAP to make Kubeflow web apps accessible
    from your browser.

VPC Service Controls allow you to restrict which Google services are accessible from your
GKE/Kubeflow clusters. This is an important part of security and in particular
mitigating the risks of data exfiltration.

For more information refer to the [VPC Service Control Docs](https://cloud.google.com/vpc-service-controls/docs/overview).

Creating a [private Kubernetes Engine cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters)
means the Kubernetes Engine nodes won't have public IP addresses. This can improve security by blocking unwanted outbound/inbound
access to nodes. Removing IP addresses means external services (such as GitHub, PyPi, and DockerHub) won't be accessible
from the nodes. Google services (such as BigQuery and Cloud Storage) are still accessible.

Importantly this means you can continue to use your [Google Container Registry (GCR)](https://cloud.google.com/container-registry/docs/) to host your Docker images. Other Docker registries (for example, DockerHub) will not be accessible. If you need to use Docker images
hosted outside GCR you can use the scripts provided by Kubeflow to mirror them to your GCR registry.


## Before you start

Before installing Kubeflow ensure you have installed the following tools:
    
  * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  * [gcloud](https://cloud.google.com/sdk/)


You will need to know your gcloud organization ID and project number; you can get them via gcloud.

```
export PROJECT=<your GCP project id>
export ORGANIZATION_NAME=<name of your organization>
export ORGANIZATION=$(gcloud organizations list --filter=DISPLAY_NAME=${ORGANIZATION_NAME} --format='value(name)')
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT} --format='value(projectNumber)')
```

  * Projects are identified by names, IDs, and numbers. For more info, see [Identifying projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects).

## Enable VPC Service Controls In Your Project


1. Enable VPC service controls:

    ```
    gcloud services enable accesscontextmanager.googleapis.com \
                           cloudresourcemanager.googleapis.com \
                           dns.googleapis.com  --project=${PROJECT}
    ```

1. Check if you have an access policy object already created:

    ```
    gcloud beta access-context-manager policies list \
        --organization=${ORGANIZATION}
    ```

    * An [access policy](https://cloud.google.com/vpc-service-controls/docs/overview#terminology) is a GCP resource object that defines service perimeters. There can be only one access policy object in an organization, and it is a child of the Organization resource.


1. If you don't have an access policy object, create one:

    ```
    gcloud beta access-context-manager policies create \
    --title "default" --organization=${ORGANIZATION}
    ```

1. Save the Access Policy Object ID as an environment variable so that it can be used in subsequent commands:

    ```
    export POLICYID=$(gcloud beta access-context-manager policies list --organization=${ORGANIZATION} --limit=1 --format='value(name)')
    ```
1. Create a service perimeter:

    ```
    gcloud beta access-context-manager perimeters create KubeflowZone \
        --title="Kubeflow Zone" --resources=projects/${PROJECT_NUMBER} \
        --restricted-services=bigquery.googleapis.com,containerregistry.googleapis.com,storage.googleapis.com \
        --project=${PROJECT} --policy=${POLICYID}
    ```  

    * Here we have created a service perimeter with the name KubeflowZone.

    * The perimeter is created in PROJECT_NUMBER and restricts access to GCS (storage.googleapis.com), BigQuery (bigquery.googleapis.com), and GCR (containerregistry.googleapis.com).

    * Placing GCS (Google Cloud Storage) and BigQuery in the perimeter means that access to GCS and BigQuery
      resources owned by this project is now restricted. By default, access from outside
      the perimeter will be blocked

    * More than one project can be added to the same perimeter

1. Create an access level to allow Google Container Builder to access resources inside the perimiter:

    * Create a members.yaml file with the following contents

       ```
       - members:      
         - serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com
         - user:<your email>
       ```

    * Google Container Builder is used to mirror Kubeflow images into the perimeter
    * Adding your email allows you to access the GCP services
      inside the perimeter from outside the cluster

       * This is convenient for building and pushing images and data
         from your local machine.

    * For more information refer to the [docs](https://cloud.google.com/access-context-manager/docs/create-access-level#members-example).

1. Create the access level:

    ```
    gcloud beta access-context-manager levels create kubeflow \
       --basic-level-spec=members.yaml \
       --policy=${POLICYID} \
       --title="Kubeflow ${PROJECT}"
    ```

     * The name for the level can't have any hyphens

1. Bind Access Level to a Service Perimeter:

    ```
    gcloud beta access-context-manager perimeters update KubeflowZone \
     --add-access-levels=kubeflow \
     --policy=${POLICYID}
    ```
1. Set up container registry for GKE private clusters (for more info see [instructions](https://cloud.google.com/vpc-service-controls/docs/set-up-gke)):

    1. Create a managed private zone

        ```
        export ZONE_NAME=kubeflow
        export NETWORK=<Network you are using for your cluster>
        gcloud beta dns managed-zones create ${ZONE_NAME} \
         --visibility=private \
         --networks=https://www.googleapis.com/compute/v1/projects/${PROJECT}/global/networks/${NETWORK} \
         --description="Kubeflow DNS" \
         --dns-name=gcr.io \
         --project=${PROJECT}
        ```

    1. Start a transaction

        ```
        gcloud dns record-sets transaction start \
         --zone=${ZONE_NAME} \
         --project=${PROJECT}
        ```

    1. Add a CNAME record for \*.gcr.io

        ```
        gcloud dns record-sets transaction add \
         --name=*.gcr.io. \
         --type=CNAME gcr.io. \
         --zone=${ZONE_NAME} \
         --ttl=300 \
         --project=${PROJECT}
       ```

    1. Add an A record for the restricted VIP

        ```      
         gcloud dns record-sets transaction add \
           --name=gcr.io. \
           --type=A 199.36.153.4 199.36.153.5 199.36.153.6 199.36.153.7 \
           --zone=${ZONE_NAME} \
           --ttl=300 \
           --project=${PROJECT}
        ```

    1. Commit the transaction

        ```
         gcloud dns record-sets transaction execute \
          --zone=${ZONE_NAME} \
          --project=${PROJECT}
        ```

## Deploy Kubeflow with Private GKE

1. Set user credentials. You only need to run this command once:
   
    ```
    gcloud auth application-default login
    ```
1. Copy non-GCR hosted images to your GCR registry:

    1. Clone the Kubeflow source 

        ```
        git clone https://github.com/kubeflow/kubeflow.git git_kubeflow      
        ```
    1. Use [Google Cloud Builder(GCB)](https://cloud.google.com/cloud-build/docs/) to replicate the images

        ```
        cd git_kubeflow/scripts/gke
        PROJECT=<PROJECT> make copy-gcb
        ```

      * This is needed because your GKE nodes won't be able to pull images from non GCR
        registries because they don't have public internet addresses


      * gcloud may return an error even though the job is
        submited successfully and will run successfully
        see [kubeflow/kubeflow#3105](https://github.com/kubeflow/kubeflow/issues/3105)

      * You can use the Cloud console to monitor your GCB job.

1. Follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/deploy-cli/).
  When you reach the 
  [setup and deploy step](/docs/gke/deploy/deploy-cli/#set-up-and-deploy), 
  **skip the `kfctl apply` command** and run the **`kfctl build`** command 
  instead, as described in that step. Now you can edit the configuration files
  before deploying Kubeflow. Retain the environment variables that you set
  during the setup, including `${KF_NAME}`, `${KF_DIR}`, and `${CONFIG_FILE}`.

1. Enable private clusters by editing `${KF_DIR}/gcp_config/cluster-kubeflow.yaml` and updating the following two parameters:

    ```
    privatecluster: true
    gkeApiVersion: v1beta1
    ```
1. Remove components which are not useful in private clusters:

   Open `${KF_DIR}/kfctl_gcp_iap.v1.0.0.yaml` and remove kustomizeConfig `cert-manager`, `cert-manager-crds`, and `cert-manager-kube-system-resources`.
1. Create the deployment:

    ```
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_FILE}
    ```

      * If you get an error **legacy networks not supported**, follow the 
        [troubleshooting guide]( /docs/gke/troubleshooting-gke/#legacy-networks-are-not-supported) to create a new network.

        * You will need to manually create the network as a work around for [kubeflow/kubeflow#3071](https://github.com/kubeflow/kubeflow/issues/3071)

            ```
            cd ${KF_DIR}/gcp_config
            gcloud --project=${PROJECT} deployment-manager deployments create ${KF_NAME}-network --config=network.yaml
            ```

        * Then edit `${KF_DIR}/gcp_config/cluster.jinja` to add a field **network** in your cluster
        
            ```
            cluster:
              name: {{ CLUSTER_NAME }}
              network: <name of the new network>
            ```
      
        * To get the name of the new network run
          
            ```
            gcloud --project=${PROJECT} compute networks list
            ``` 

          * The name will contain the value ${KF_NAME}

1. Update iap-ingress component parameters:

    ```
    cd ${KF_DIR}/kustomize
    gvim iap-ingress.yaml
    ```

      * Find and set the `privateGKECluster` parameter to true:

        ```
        privateGKECluster: "true"
        ```

      * Then apply your changes:

        ```
        kubectl apply -f iap-ingress.yaml
        ```

1. Obtain an HTTPS certificate for your ${FQDN} and create a Kubernetes secret with it. 

      * You can create a self signed cert using [kube-rsa](https://github.com/kelseyhightower/kube-rsa)

          ```
          go get github.com/kelseyhightower/kube-rsa
          kube-rsa ${FQDN}
          ```
          * The fully qualified domain is the host field specified for your ingress; 
            you can get it by running

            ```
            cd ${KF_DIR}/kustomize
            grep hostname: iap-ingress.yaml
            ```

        * Then create your Kubernetes secret

          ```
          kubectl create secret tls --namespace=kubeflow envoy-ingress-tls --cert=ca.pem --key=ca-key.pem
        ```

      * An alternative option is to upgrade to GKE 1.12 or later and use 
        [managed certificates](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs#migrating_to_google-managed_certificates_from_self-managed_certificates)

        * See [kubeflow/kubeflow#3079](https://github.com/kubeflow/kubeflow/issues/3079)

1. Update the various kustomize manifests to use `gcr.io` images instead of Docker Hub images.

1. Apply all the Kubernetes resources:

    ```
    cd ${KF_DIR}
    kfctl apply -V -f ${CONFIG_FILE}
    ```
1. Wait for Kubeflow to become accessible and then access it at this URL:

    ```
    https://${FQDN}/
    ```
      * ${FQDN} is the host associated with your ingress

        * You can get it by running `kubectl get ingress`

      * Follow the [instructions](/docs/gke/deploy/monitor-iap-setup/) to monitor the 
        deployment
  
      * It can take 10-20 minutes for the endpoint to become fully available

## Next steps

* Use [GKE Authorized Networks](https://cloud.google.com/kubernetes-engine/docs/how-to/authorized-networks) to restrict access to your GKE master
*  Learn more about [VPC Service Controls](https://cloud.google.com/vpc-service-controls/docs/)
* See how to [delete](/docs/gke/deploy/delete-cli) your Kubeflow deployment 
  using the CLI.
* [Troubleshoot](/docs/gke/troubleshooting-gke) any issues you may
  find.
