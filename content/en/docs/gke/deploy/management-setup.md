+++
title = "Management cluster setup"
description = "Instructions for setting up a management cluster on Google Cloud"
weight = 3
+++

This guide describes how to setup a management cluster which you will use to deploy one or more instances of Kubeflow.

The management cluster is used to run [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview). Cloud Config Connector is a Kubernetes addon that allows you to manage Google Cloud resources through Kubernetes.

While the management cluster can be deployed in the same project as your Kubeflow cluster, typically you will want to deploy
it in a separate project used for administering one or more Kubeflow instances.

Optionally, the cluster can be configured with [Anthos Config Managmenet](https://cloud.google.com/anthos-config-management/docs) 
to manage Google Cloud infrastructure using GitOps.

## FAQs

* Where is `kfctl`?

   `kfctl` is no longer being used to apply resources for Google Cloud, because required functionalities are now supported by generic tools including [Make](https://www.gnu.org/software/make/), [Kustomize](https://kustomize.io), [kpt](https://googlecontainertools.github.io/kpt/), and [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview).

* Why do we use an extra management cluster to manage Google Cloud resources?

   The management cluster is very lightweight cluster that runs [Cloud Config Connector](https://cloud.google.com/config-connector/docs/overview). Cloud Config Connector makes it easier to configure Google Cloud resources using YAML and Kustomize.

For a more detailed explanation of the changes affecting Kubeflow 1.1 on Google Cloud, read [kubeflow/gcp-blueprints #123](https://github.com/kubeflow/gcp-blueprints/issues/123).

## Install the required tools

1. Install gcloud components

   ```
   gcloud components install kpt anthoscli beta
   gcloud components update
   ```

1. Install [Kustomize v3.2.1](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv3.2.1).

    Note, Kubeflow is not compatible with later versions of Kustomize. Read [this GitHub issue](https://github.com/kubeflow/manifests/issues/538) for the latest status.

1. Install [yq](https://github.com/mikefarah/yq)

   ```
   GO111MODULE=on go get github.com/mikefarah/yq/v3
   ```

   * If you don't have [Go](https://golang.org) installed you can download
     a binary from [yq's GitHub releases](https://github.com/mikefarah/yq/releases).
 
## Setting up the management cluster


1. Fetch the management blueprint

   ```
   kpt pkg get https://github.com/kubeflow/gcp-blueprints.git/management@v1.1.0 ./
   ```

1. Fetch the upstream manifests

   ```
   cd ./management
   make get-pkg
   ```

1. Open up the **Makefile** at `./management/Makefile` and edit the `set-values` rule to set values for the name, project, and location of your management; when you are done the section should look like

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

1. Set the values

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
   * It will create the Google Cloud service account **${NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**

### Authorize CNRM for each project

In the last step we created the Google Cloud service account **${NAME}-cnrm-system@${PROJECT}.iam.gserviceaccount.com**
this is the service account that CNRM will use to create any Google Cloud resources. Consequently
you need to grant this Google Cloud service account sufficient privileges to create the desired
resources in one or more projects. 

The easiest way to do this is to grant the Google Cloud service account owner permissions on one or more projects

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
