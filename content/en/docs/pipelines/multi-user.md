+++
title = "Multi-user Isolation"
description = "Getting started with Kubeflow Pipelines multi-user isolation"
weight = 35
+++

Starting from to be released Kubeflow 1.1, Kubeflow Pipelines in full Kubeflow deployment supports multi-user isolation.

We are working on more documentation here.

## How to get Kubeflow Pipelines with multi-user support?

install Kubeflow 1.1 with supported platforms, right now GCP, AWS, IBM.


disclaimer: this is not meant for security separation.
> Note that the isolation support in Kubeflow doesn’t provide any hard security guarantees against malicious attempts by users to infiltrate other user’s profiles

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
