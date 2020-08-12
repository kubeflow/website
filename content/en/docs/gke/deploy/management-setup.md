+++
title = "Management cluster setup"
description = "Instructions for setting up a management cluster on (GCP)"
weight = 3
+++

This guide describes how to setup a management cluster which you will use to deploy one or more instances of Kubeflow.

While the management cluster can be deployed in the same project as your Kubeflow cluster, typically you will want to deploy
it in a separate project used for administering one or more Kubeflow instances.

The management cluster is used to run [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview).

Optionally, the cluster can be configured with [Anthos Config Managmenet](https://cloud.google.com/anthos-config-management/docs) 
to manage GCP infrastructure using GitOps.

## Install the required tools

1. Install gcloud components

   ```
   gcloud components install kpt anthoscli beta
   gcloud components update
   ```

## Setting up the management cluster


1. Fetch the management blueprint

   ```
   kpt pkg get https://github.com/kubeflow/gcp-blueprints.git/management@master ./
   ```

1. Fetch the upstream manifests

   ```
   cd ./management
   make get-pkg
   ```

  * This generates an error like the one below but you can ignore it;

    ```  
    kpt pkg get https://github.com/jlewi/manifests.git@blueprints ./upstream
    fetching package / from https://github.com/jlewi/manifests to upstream/manifests
    Error: resources must be annotated with config.kubernetes.io/index to be written to files    
    ```
  
    * This is being tracked in [GoogleContainerTools/kpt#539](https://github.com/GoogleContainerTools/kpt/issues/539) 

1. Open up the **Makefile** and edit the `set-values` rule to set values for the name, project, and location of your management; when you are done the section should look like

   ```  
    set-values: 
    kpt cfg set ./instance name NAME
    kpt cfg set ./instance location LOCATION
    kpt cfg set ./instance gcloud.core.project PROJECT
  
    kpt cfg set ./upstream/management name NAME
    kpt cfg set ./upstream/management location LOCATION
    kpt cfg set ./upstream/management gcloud.core.project PROJECT

   ```

   * Where **NAME**, **LOCATION**, **PROJECT** should be the actual values for your deployment

   Then, run:
   
   ```
   make set-values
   ```

1. Hydrate and apply the manifests to create the cluster

   ```
   make apply
   ```

1. Create a kubeconfig context for the cluster

   ```
   make create-ctxt
   ```

1. Install CNRM

   ```
   make apply-kcc
   ```

   * This will install CNRM in your cluster
   * It will create the GCP service account **${NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**

### Authorize CNRM for each project

In the last step we created the GCP service account **${NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**
this is the service account that CNRM will use to create any GCP resources. Consequently
you need to grant this GCP service account sufficient privileges to create the desired
resources in one or more projects. 

The easiest way to do this is to grant the GCP service account owner permissions on one or more projects

1. Set the managed project

   ```
   kpt cfg set ./instance managed-project ${MANAGED-PROJECT}
   ```

1. Update the policy

   ```
   anthoscli apply -f ./instance/managed-project/iam.yaml 
   ```

## References

[CNRM Reference Documentation](https://cloud.google.com/config-connector/docs/reference/resources) 
