+++
title = "Multi-user Isolation"
description = "Getting started with Kubeflow Pipelines multi-user isolation"
weight = 35
+++

Multi-user isolation for Kubeflow Pipelines is an integration to [Kubeflow multi-user isolation](/docs/components/multi-tenancy/).
You should read [Kubeflow multi-user isolation documentation](/docs/components/multi-tenancy/) first.

Note, Kubeflow Pipelines multi-user isolation is only supported in
[the full Kubeflow deployment](/docs/pipelines/installation/overview/#full-kubeflow-deployment)
starting from Kubeflow v1.1 and **only** in the following platforms:

* Google Cloud
* Amazon Web Services
* IBM Cloud

Also note that the isolation support in Kubeflow doesn’t provide any hard security
guarantees against malicious attempts by users to infiltrate other user’s profiles.

## How tos

* \[admin/user] add a new user to cluster
* \[user] share namespace with others?
* \[admin] grant the user GCP permissions
 
## How are KFP resources separated?

when you visit UI, namespace selector determines which resources are shown.
except pipelines

when using sdk, 
* <!-- this should be in GCP pipelines - auth doc --> how to authenticate to the public endpoint
* add namespace resource reference/namespace argument to api endpoints.

All features are supported.

Mention which resources are separated:
* experiments
* runs
* jobs
* external artifacts e.g. links in mlpipeline-ui-metadata.json
* tensorboard

Others not separated mentioned below

## What are current limitations?

* pipelines
* mlmd
* minio artifact storage
* in-cluster auth based on service account token or istio mTLS
