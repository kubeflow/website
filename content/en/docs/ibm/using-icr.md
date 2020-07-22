+++
title = "Using IBM Cloud Container Registry (ICR)"
description = "Instructions for using private images from ICR"
weight = 15
+++

This guide describe steps for use cases involving private container images by using IBM Cloud Container Registry (ICR).

## Prerequisites

* Install and configure the [IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-getting-started).
* Install the CLI plug-in for the IBM Cloud Container Registry by running the command `ibmcloud plugin install container-registry`.
* Create a namespace in ICR with command `ibmcloud cr namespace-add <my_namespace>`, replace `<my_namespace>` with your preferred name.

**Note**: the [ICR namespace](https://cloud.ibm.com/docs/Registry?topic=Registry-getting-started#gs_registry_namespace_add) is different from the Kubeflow Profile namespace. The ICR namespace is used to group container images stored in ICR while a [Kubeflow Profile](/docs/components/multi-tenancy/overview/) namespace is a grouping of all Kubernetes clusters onwed by a user.

## Image pull secret

An image pull secret is required to to pull container images from IBM Cloud Container Registry. You can use the default image pull secret set up by the cluster or use your account's IAM API key.

### Use default image pull secret

By default, the IBM Cloud Kubernetes cluster is set up to pull images from only your account's namespace in IBM Cloud Container Registry by using the secret `all-icr-io` in the `default` namespace. A cluster admin can copy this secret to any Kubernetes namespace used as Kubeflow profile. For example, run below command to copy the secret `all-icr-io` to the `anonymous` namespace:

```
kubectl get secret all-icr-io -n default -o yaml \
| sed 's/namespace: default/namespace: anonymous/g' \
| kubectl -n anonymous create -f -
```

Once this secret is ready in your Kubeflow profile, A data scientist can use this secret to pull container images from ICR.

See details and FAQs from the official guide [Setting up an image registry](https://cloud.ibm.com/docs/containers?topic=containers-registry).

### Use IAM API Key

You will need to use an IBM Cloud IAM API Key to work with ICR in below cases:
1. has no access to the default image pull secret `all-icr-io` from the `default` namespace.
1. need to access container images in other IBM Cloud accounts.
1. need customized IAM policy by using a separate IAM sevice id.

If you don't have an IBM Cloud IAM API Key, follow the official guide [Create an API Key](https://cloud.ibm.com/docs/account?topic=account-userapikey#create_user_key).

Once you got an IBM Cloud IAM API Key, retrieve your IBM Cloud IAM API key and save as `<ibm_cloud_iam_api_key>` and run following command with `<my_namespace>` set to your namespace to use with ICR to create an image pull secret:

```
kubectl -n <my_namespace> create secret docker-registry <secret_name> \
--docker-server=<registry_domain_name> \
--docker-username=iamapikey \
--docker-password=<ibm_cloud_iam_api_key> \
--docker-email=<docker_email>
```

**Notes**:
* replace `<secret_name>` with a unique name for the pull image secret, for example, `us-icr-io`.
* replace `<registry_domain_name>` with the image registry where your registry namespace is set up. Use regional domain name when container images are stored in specific region. E.g., use `us.icr.io` when using region `en-us` and `uk.icr.io` when using region `eu-gb`. See full list of regional domain names from [About IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_overview#registry_regions_local).
* replace `<docker_email>` with your docker email address or any fictional email address, such as `a@b.c`.

## Scenarios

### Uses container images from ICR in Kubeflow pipeline

The pull image secret may be set in Kubeflow Pipelines SDK's [`PipelineConf`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.PipelineConf). Refer to this [imagepullsecrets.py](https://github.com/kubeflow/pipelines/blob/ef381aafccf916482d16774cac3b8568d06dff9e/samples/core/imagepullsecrets/imagepullsecrets.py#L55) sample in Kubeflow Pipelines project for usage.

### Uses notebook images from ICR in Jupyter Notebooks

When a namespace is created for Kubeflow with its profile controller, a default service account `default-editor` is created in that namespace, Before creating a Notebook Server, run following command to patch the service account. Replace `<secret_name>` with the ICR pull image secret name and `<my_namespace>` with the Kubeflow profile namespace, respectively.

Replace `<my_namespace>` with your namespace then run below command to patch the service account `default-editor` with this image pull secret:
```SHELL
kubectl patch serviceaccount default-editor \
-p '{"imagePullSecrets": [{"name": "<secret-name>"}]}' \
-n <my_namespace>ijuih
```

Once the service account is patched, when you create the Notebook Server through Kubeflow dashboard, you should be able to choose a `Custom Image` then fill in a notebook image path from the ICR like this:

<img src="/docs/images/ibm/notebook-custom-image.png" 
    alt="Notebook Custom Image"
    class="mt-3 mb-3 border border-info rounded">
