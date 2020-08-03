+++
title = "Securing Your Clusters"
description = "How to secure Kubeflow clusters using VPC service controls and private GKE"
weight = 70
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

{{% alert title="Alpha" color="warning" %}}
This feature is currently in **alpha** release status with limited support. The
Kubeflow team is interested in any feedback you may have, in particular with 
regards to usability of the feature. Note the following issues already reported:

* [Documentation on how to use Kubeflow with private GKE and VPC service controls](https://github.com/kubeflow/website/issues/1705)
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
    export PROJECT=<Your project>
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

## Set up container registry for GKE private clusters:

Follow the step belows to configure your GCR registry to be accessible from your secured clusters.
For more info see [instructions](https://cloud.google.com/vpc-service-controls/docs/set-up-gke).

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

## Mirror Kubeflow Application Images

Since private GKE can only access gcr.io, we need to mirror all images outside gcr.io for Kubeflow applications. We will use the `kfctl` tool to accomplish this.


1. Set your user credentials. You only need to run this command once:
   
    ```
    gcloud auth application-default login
    ```

1. Inside your `${KFAPP}` directory create a local configuration file `mirror.yaml`  based on this [template](https://github.com/kubeflow/manifests/blob/master/experimental/mirror-images/gcp_template.yaml)

    1. Change destination to your project gcr registry.

1. Generate pipeline files to mirror images by running
    
    ```
    cd ${KFAPP}
    ./kfctl alpha mirror build mirror.yaml -V -o pipeline.yaml --gcb
    ```

    * If you want to use Tekton rather than Google Cloud Build(GCB) drop `--gcb` to emit a Tekton pipeline
    * The instructions below assume you are using GCB

1. Edit the couldbuild.yaml file

    1. In the `images` section add

         ```
          - <registry domain>/<project_id>/docker.io/istio/proxy_init:1.1.6
         ```
     
        * Replace `<registry domain>/<project_id>` with your registry      

    1. Under `steps` section add

          ```
            - args:
            - build
            - -t
            - <registry domain>/<project id>/docker.io/istio/proxy_init:1.1.6
            - --build-arg=INPUT_IMAGE=docker.io/istio/proxy_init:1.1.6
            - .
            name: gcr.io/cloud-builders/docker
            waitFor:
            - '-'  
          ```

    1. Remove the mirroring of cos-nvidia-installer:fixed image. You don’t need it to be replicated because this image is privately available through GKE internal repo.

          1. Remove the images from the `images` section
          1. Remove it from the `steps` section

1. Create a cloud build job to do the mirroring

   ```
    gcloud builds submit --async gs://kubeflow-examples/image-replicate/replicate-context.tar.gz --project <project_id> --config cloudbuild.yaml
   ```

1. Update your manifests to use the mirror'd images

   ```
   kfctl alpha mirror overwrite -i pipeline.yaml
   ```

1. Edit file “kustomize/istio-install/base/istio-noauth.yaml”: 

   1. Replace `docker.io/istio/proxy_init:1.16` to `gcr.io/<project_id>/docker.io/istio/proxy_init:1.16`
   1. Replace `docker.io/istio/proxyv2:1.1.6` to `gcr.io/<project_id>/docker.io/istio/proxyv2:1.1.6`

## Deploy Kubeflow with Private GKE

{{% alert title="Coming Soon" color="warning" %}}
You can follow the issue: [Documentation on how to use Kubeflow with private GKE and VPC service controls](https://github.com/kubeflow/website/issues/1705)
{{% /alert %}}

## Next steps

* Use [GKE Authorized Networks](https://cloud.google.com/kubernetes-engine/docs/how-to/authorized-networks) to restrict access to your GKE master
*  Learn more about [VPC Service Controls](https://cloud.google.com/vpc-service-controls/docs/)
* See how to [delete](/docs/gke/deploy/delete-cli) your Kubeflow deployment 
  using the CLI.
* [Troubleshoot](/docs/gke/troubleshooting-gke) any issues you may
  find.
