+++
title = "Connecting to Kubeflow Pipelines on Google Cloud using the SDK"
description = "How to connect to different Kubeflow Pipelines installations on Google Cloud using the Kubeflow Pipelines SDK"
weight = 20
+++

This guide describes how to connect to your Kubeflow Pipelines cluster on Google
Cloud using [the Kubeflow Pipelines SDK](/docs/pipelines/building-pipelines/pipelines-sdk/sdk-overview/).

## Before you begin

- You need a Kubeflow Pipelines deployment on Google Cloud using one of the [installation options](/docs/pipelines/installation/overview/).
- [Install the Kubeflow Pipelines SDK](/docs/pipelines/building-pipelines/pipelines-sdk/install-sdk/).

## How SDK connects to Kubeflow Pipelines API

Kubeflow Pipelines includes an API service named `ml-pipeline-ui`. The
`ml-pipeline-ui` API service is deployed in the same Kubernetes namespace you
deployed Kubeflow Pipielines in.

The Kubeflow Pipelines SDK can send REST API requests to this API service, but
the SDK needs to know the hostname to connect to the API service.

If the hostname can be accessed without authentication, it's very simple to
connect to it. For example, you can use `kubectl port-forward` to access it via
localhost:

```bash
# The Kubeflow Pipelines API service and the UI is available at
# http://localhost:3000 without authentication check.
$ kubectl port-forward svc/ml-pipeline-ui 3000:80 --namespace kubeflow
# Change the namespace if you deployed Kubeflow Pipelines in a different
# namespace.
```

```python
import kfp
client = kfp.Client(host='http://localhost:3000')
```

When deploying Kubeflow Pipelines on Google Cloud, a public endpoint for this
API service is auto-configured for you, but this public endpoint has security
checks to protect your cluster from unauthorized access.

The following sections introduce how to authenticate your SDK requests to connect
to Kubeflow Pipelines via the public endpoint.

## Connecting to Kubeflow Pipelines standalone or AI Platform Pipelines

Refer to [Connecting to AI Platform Pipelines using the Kubeflow Pipelines SDK](https://cloud.google.com/ai-platform/pipelines/docs/connecting-with-sdk) for
both Kubeflow Pipelines standalone and AI Platform Pipelines.

Kubeflow Pipelines standalone deployments also show up in [AI Platform Pipelines](https://console.cloud.google.com/ai-platform/pipelines/clusters). They have the
name "pipeline" by default, but you can customize the name by overriding
[the `appName` parameter in `params.env`](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/base/params.env#L1) when [deploying Kubeflow Pipelines standalone](/docs/pipelines/installation/standalone-deployment/).

## Connecting to Kubeflow Pipelines in a full Kubeflow deployment

A full Kubeflow deployment on Google Cloud uses an [Identity-Aware Proxy (IAP)](https://cloud.google.com/iap/docs) to manage access to the public Kubeflow endpoint. The steps
below let you connect to Kubeflow Pipelines in a full Kubeflow deployment with
authentication through IAP.

1.  Find out your IAP OAuth 2.0 client ID.

    You or your cluster admin followed [Set up OAuth for Cloud IAP](https://www.kubeflow.org/docs/gke/deploy/oauth-setup/)
    to deploy your full Kubeflow deployment on GCP. You need the OAuth client
    ID created in that step.

    You can browse all of your existing OAuth client IDs [in the Credentials page of Google Cloud Console](https://console.cloud.google.com/apis/credentials).

1.  Create another SDK OAuth Client ID for authenticating Kubeflow Pipelines SDK users.
    Follow [the steps to set up a client ID to authenticate from a desktop app](https://cloud.google.com/iap/docs/authentication-howto#authenticating_from_a_desktop_app). Take
    a note of the **client ID** and **client secret**. This client ID and secret can
    be shared among all SDK users, because a separate login step is still needed below.

1.  To connect to Kubeflow Pipelines public endpoint, initiate SDK client like the following:

    ```python
    import kfp
    client = kfp.Client(host='https://<KF_NAME>.endpoints.<PROJECT>.cloud.goog/pipeline',
        client_id='<AAAAAAAAAAAAAAAAAAAAAA>.apps.googleusercontent.com',
        other_client_id='<BBBBBBBBBBBBBBBBBBB>.apps.googleusercontent.com',
        other_client_secret='<CCCCCCCCCCCCCCCCCCCC>')
    ```

    - Pass your **IAP** OAuth client ID found in **step 1** to `client_id` argument.
    - Pass your **SDK** OAuth client ID and secret created in **step 2** to `other_client_id`
      and `other_client_secret` arguments.

1.  When you init the SDK client for the first time, you will be asked to log in.
    The Kubeflow Pipelines SDK stores obtained credentials in `$HOME/.config/kfp/credentials.json`. You do not need to log in again unless you manually delete the credentials file.

        To use the SDK from cron tasks where you cannot log in manually, you can copy the credentials file in `$HOME/.config/kfp/credentials.json` to another machine.
        However, you should keep the credentials safe and never expose it to
        third parties.

1.  After login, you can use the client.
    ```python
    print(client.list_pipelines())
    ```

## Troubleshooting

- Error "Failed to authorize with API resource references: there is no user identity header" when using SDK methods.

  Direct access to the API service without authentication works for Kubeflow
  Pipelines standalone, AI Platform Pipelines, and Kubeflow 1.0 or earlier.

  However, it fails authorization checks for Kubeflow Pipelines with multi-user
  isolation in the full Kubeflow deployment starting from Kubeflow 1.1.
  Multi-user isolation requires all API access to authenticate as a user. Refer to [Kubeflow Pipelines Multi-user isolation documentation](/docs/pipelines/multi-user/#in-cluster-request-authentication)
  for more details.
