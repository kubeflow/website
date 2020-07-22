+++
title = "Using IBM Cloud Container Registry (ICR)"
description = "Instructions for using private images from ICR"
weight = 15
+++

This guide describe steps for use cases involving private container images by using IBM Cloud Container Registry (ICR).

## Prerequisites

* Install and configure the [IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-getting-started).
    * Install the CLI plug-in for the IBM Cloud Kubernetes by running the command `ibmcloud plugin install container-service`.
    * Install the CLI plug-in for the IBM Cloud Container Registry by running the command `ibmcloud plugin install container-registry`.
* Create a namespace in ICR as your own image repository if you don't have one. Replace `<my_namespace>` with your preferred namespace then run command `ibmcloud cr namespace-add <my_namespace>`.

## Image pull secret

It will need an image pull secret to pull container images from IBM Cloud Container Registry.

### Use default image pull secret

By default, the IBM Cloud Kubernetes cluster is set up to pull images from only your account's namespace in IBM Cloud Container Registry by using the secret `all-icr-io` in the `default` namespace. A cluster admin can copy this secret to any Kubernetes namespace used as Kubeflow profile. For example, run below command to copy the secret `all-icr-io` to the `anonymous` namespace:

```
kubectl get secret all-icr-io -n default -o yaml \
| sed 's/default/anonymous/g' \
| kubectl -n anonymous create -f -
```

Once this secret is ready in your Kubeflow profile, A data scientist can use this secret to pull container images from ICR.

See details and FAQs from the official guide [Setting up an image registry](https://cloud.ibm.com/docs/containers?topic=containers-registry).

### Use IAM API Key

You will need to use an IBM Cloud IAM API Key to work with ICR in below cases:
1. need to access container images in other IBM Cloud accounts.
1. need customized IAM policy by using a separate IAM sevice id.
1. has no access to the default image pull secret `all-icr-io` from the `default` namespace.

Please follow this official guide [Creating an image pull secret with different IAM API key credentials for more control or access to images in other IBM Cloud accounts](https://cloud.ibm.com/docs/containers?topic=containers-registry#other_registry_accounts) if you don't have an IBM Cloud IAM API Key.

Once you got an IBM Cloud IAM API Key, Replace `<my_namespace>` with your Kubernetes namespace and `<ibm_cloud_iam_apikey>` with the IBM Cloud IAM API Key you got, then run below command to create an image pull secret:

```
kubectl --namespace <my_namespace> create secret docker-registry us-icr-io \
--docker-server=us.icr.io \
--docker-username=iamapikey \
--docker-password=<ibm_cloud_iam_apikey> \
--docker-email=a@b.c
```

**Notes**:
* the `a@b.c` is a fiction email address, it's required to create a Kubernetes secret but is not used after creation.
* use regional domain name when container images are stored in specific region. E.g., `uk.icr.io` when using region `eu-gb`. see full list of regional domain names from [About IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_overview#registry_regions_local).

## Scenarios

### Uses container images from ICR in Kubeflow pipeline

Please checkout this sample python code [imagepullsecrets.py](https://github.com/kubeflow/pipelines/blob/ef381aafccf916482d16774cac3b8568d06dff9e/samples/core/imagepullsecrets/imagepullsecrets.py#L55)

### Uses notebook images from ICR in Jupyter Notebooks

Make sure you have an image pull secret (e.g., `all-icr-io`) in your namespace.

Replace `<my_namespace>` with your namespace then run below command to patch the service account `default-editor` with this image pull secret:
```SHELL
kubectl patch serviceaccount default-editor \
-p '{"imagePullSecrets": [{"name": "all-icr-io"}]}' \
-n <my_namespace>
```

Then you can select the option `Custom Image` then fill in container image path from ICR when creating new Notebook server.
