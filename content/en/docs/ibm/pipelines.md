+++
title = "Pipelines on IBM Cloud Kubernetes Service (IKS)"
description = "Instructions for using Kubeflow Pipelines on IBM Cloud Kubernetes Servuce (IKS)"
weight = 50
+++

## Authenticating Kubeflow Pipelines with the SDK

**Notes**:
* Python package `kfp` v1.0.0 is required.
* This feature is available with multi-user, auth-enabled Kubeflow installation deployed from the manifest [https://raw.githubusercontent.com/kubeflow/manifests/v1.1-branch/kfdef/kfctl_ibm_dex_multi_user.v1.1.0.yaml](https://raw.githubusercontent.com/kubeflow/manifests/v1.1-branch/kfdef/kfctl_ibm_dex_multi_user.v1.1.0.yaml).
* Since it transports sensitive information like session cookie value over edge network, we highly recommend enabling HTTPS for the public endpoint of Kubeflow.

It requires authentication via the public endpoint of Kubeflow deployment when using the Kubeflow Pipelines multi-user feature with Pipelines SDK. Below variables need to be provided, no matter coming from an in-cluster Jupyter notebook or a remote machine:
1. `KUBEFLOW_PUBLIC_ENDPOINT_URL` - Kubeflow public endpoint URL. You can obtain it from command `ibmcloud ks nlb-dns ls --cluster <your-cluster-name>`.
1. `SESSION_COOKIE` - A session cookie starts with `authservice_session=`. You can obtain it from your browser after authenticated from Kubeflow UI. Notice that this session cookie expires in 24 hours, so you need to obtain it again after cookie expired.
1. `KUBEFLOW_PROFILE_NAME` - Your Kubeflow profile name

Once you obtain above information, it can use the following Python code to list all your Piplines experiments:
```Python
import kfp

KUBEFLOW_PUBLIC_ENDPOINT_URL = 'https://xxxx.<region-name>.containers.appdomain.cloud'
# this session cookie looks like "authservice_session=xxxxxxx"
SESSION_COOKIE = 'authservice_session=xxxxxxx'
KUBEFLOW_PROFILE_NAME = '<your-profile-name>'

client = kfp.Client(
    host=f'{KUBEFLOW_PUBLIC_ENDPOINT_URL}/pipeline',
    cookies=SESSION_COOKIE
)

experiments = client.list_experiments(namespace=KUBEFLOW_PROFILE_NAME)
```

Pipelines components like experiments and runs are isolated by Kubeflow profiles. A Kubeflow user can only see Pipelines experiments and runs belonging to this user's Kubeflow profile.