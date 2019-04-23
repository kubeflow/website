+++
title = "Creating Private Clusters"
description = "How to create private GKE clusters"
weight = 5
+++

This guide describes how to create private clusters with Kubeflow on Google 
Kubernetes Engine (GKE).

Creating a [private Kubernetes Engine cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters)
means the Kubernetes Engine nodes won't have public IP addresses. This can improve security by blocking unwanted outbound/inbound
access to nodes. Removing IP addresses means external services (including GitHub, PyPi, DockerHub etc...) won't be accessible
from the nodes. Google services (BigQuery, Cloud Storage, etc...) are still accessible.

Importantly this means you can continue to use your [Google Container Registry (GCR)](https://cloud.google.com/container-registry/docs/) to host your Docker images. Other Docker registries (for example DockerHub) will not be accessible. If you need to use Docker images
hosted outside Google Container Registry you can use the scripts provided by Kubeflow
to mirror them to your GCR registry.

## Before you start

Before installing Kubeflow ensure you have installed the following tools:
    
  * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  * [gcloud](https://cloud.google.com/sdk/)
  * [jsonnet](https://github.com/google/jsonnet/releases)

## Deploy Kubeflow with Private GKE

1. Set user credentials. You only need to run this command once:
   
    ```
    gcloud auth application-default login
    ```
1. Copy non-GCR hosted images to your GCR registry

   1. Clone the Kubeflow source 

       ```
       git clone https://github.com/kubeflow/kubeflow.git git_kubeflow      
       ```
   1. Use [Google Cloud Builder(GCB)](https://cloud.google.com/cloud-build/docs/) to replicate the images

       ```
       cd ~/git_kubeflow/scripts/gke
       PROJECT=<PROJECT> make copy-gcb
       ```

   * This is needed because your GKE nodes won't be able to pull images from non GCR
     registries because they don't have public internet addresses

1. Follow the [instructions](https://www.kubeflow.org/docs/gke/deploy/oauth-setup/) for creating an OAuth client

1. Create environment variables for IAP OAuth access

    ```bash
    export CLIENT_ID=<CLIENT_ID from OAuth page>
    export CLIENT_SECRET=<CLIENT_SECRET from OAuth page>
    ```

1. Download a `kfctl` release from the 
  [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/).

1. Unpack the tar ball:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```
   
   * **Optional** Add the kfctl binary to your path. 
   * If you don't add the kfctl binary to your path then in all subsequent
     steps you will need to replace `kfctl` with the full path to the binary.

1. Initialize the directory containing your Kubeflow deployment config files
    
    ```bash
    export PROJECT=<your GCP project>
    export KFAPP=<your choice of application directory name>
    # Default uses IAP.
    kfctl init ${KFAPP} --platform gcp --project ${PROJECT}

    cd ${KFAPP}
    kfctl generate all -V
    ```
   * **${KFAPP}** - the _name_ of a directory where you want Kubeflow 
     configurations to be stored. This directory is created when you run
     `kfctl init`. If you want a custom deployment name, specify that name here.
     The value of this variable becomes the name of your deployment.
     The value of this variable cannot be greater than 25 characters. It must
     contain just the directory name, not the full path to the directory.
     The content of this directory is described in the next section.
   * **${PROJECT}** - the _name_ of the GCP project where you want Kubeflow 
     deployed.
   * When you run `kfctl init` you need to choose to use either IAP or basic 
     authentication, as described below.
   * `kfctl generate all` attempts to fetch your email address from your 
     credential. If it can't find a valid email address, you need to pass a
     valid email address with flag `--email <your email address>`. This email 
     address becomes an administrator in the configuration of your Kubeflow 
     deployment.

1. Enable private clusters by editing `${KFAPP}/gcp_configs/cluster-kubeflow.yaml` and updating the following two parameters:

    ```
    privatecluster: true
    gkeApiVersion: v1beta1
    ```
1. Remove components which are not useful in private clusters:

    ```
    cd ${KFAPP}/ks_app
    ks component rm cert-manager
    ```
1. Create the deployment:

    ```
    cd ${KFAPP}
    kfctl apply platform
    ```

   * If you get an error **legacy networks not supported**, follow the 
     [troubleshooting guide]( /docs/gke/troubleshooting-gke/#legacy-networks-are-not-supported) to create a new network.

     * You will need to manually create the network as a work around for [kubeflow/kubeflow#3071](https://github.com/kubeflow/kubeflow/issues/3071)

       ```
       cd ${KFAPP}/gcp_configs
       gcloud --project=${PROJECT} deployment-manager deployments create ${KFAPP}-network --config=network.yaml
       ```

     * Then edit **gcp_config/cluster.jinja** to add a field **network** in your cluster
     
       ```
       cluster:
          name: {{ CLUSTER_NAME }}
          network: <name of the new network>
       ```
   
     * To get the name of the new network run
      
       ```
       gcloud --project=cloud-ml-dev compute networks list
       ``` 

       * The name will contain the value ${KFAPP}

1. Update iap-ingress component parameters:

    ```
    cd ${KFAPP}/ks_app    
    ks param set iap-ingress privateGKECluster true
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
        kubectl get ingress
        ```

    * Then create your Kubernetes secret

      ```
      kubectl create secret tls --namespace=kubeflow envoy-ingress-tls --cert=ca.pem --key=ca-key.pem
     ```

   * An alternative option is to upgrade to GKE 1.12 or later and use 
     [managed certificates](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs#migrating_to_google-managed_certificates_from_self-managed_certificates)

     * See [kubeflow/kubeflow#3079](https://github.com/kubeflow/kubeflow/issues/3079)

1. Update the various ksonnet components to use `gcr.io` images instead of Docker Hub images:

    ```
    cd ${KFAPP}/ks_app
    ${KUBEFLOW_SRC}/scripts/gke/use_gcr_for_all_images.sh
    ```

1. Apply all the Kubernetes resources:

    ```
    cd ${KFAPP}
    kfctl apply Kubernetes
    ```
1. Wait for Kubeflow to become accessible and then access it at

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
*  Setup [VPC Service Controls](https://cloud.google.com/vpc-service-controls/docs/) to
   restrict which GCP resources are accessible from your cluster
* See how to [delete](/docs/gke/deploy/delete-cli) your Kubeflow deployment 
  using the CLI.
* [Troubleshoot](/docs/gke/troubleshooting-gke) any issues you may
  find.