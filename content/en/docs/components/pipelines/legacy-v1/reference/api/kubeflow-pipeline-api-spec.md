+++
title = "Pipelines API Reference (v1beta1)"
description = "API Reference for Kubeflow Pipelines API - v1beta1"
weight = 3
+++

{{% alert title="Old Version" color="warning" %}}
This page is about __Kubeflow Pipelines V1__, please see the [V2 documentation](/docs/components/pipelines) for the latest information.

Note, while the V2 backend is able to run pipelines submitted by the V1 SDK, we strongly recommend [migrating to the V2 SDK](/docs/components/pipelines/user-guides/migration).
For reference, the final release of the V1 SDK was [`kfp==1.8.22`](https://pypi.org/project/kfp/1.8.22/), and its reference documentation is [available here](https://kubeflow-pipelines.readthedocs.io/en/1.8.22/).
{{% /alert %}}

This document describes the API specification for the `v1beta1` Kubeflow Pipelines REST API.

## About the REST API

In most deployments of the [Kubeflow Platform](/docs/started/installing-kubeflow/#kubeflow-platform), the Kubeflow Pipelines REST API is available under the `/pipeline/` HTTP path.
For example, if you host Kubeflow at `https://kubeflow.example.com`, the API will be available at `https://kubeflow.example.com/pipeline/`.

{{% alert title="Tip" color="dark" %}}
We recommend using the [Kubeflow Pipelines Python SDK](/docs/components/pipelines/legacy-v1/reference/sdk/) as it provides a more user-friendly interface.
See the [Connect SDK to the API](/docs/components/pipelines/user-guides/core-functions/connect-api/) guide for more information.
{{% /alert %}}

### Authentication

How requests are authenticated and authorized will depend on the distribution you are using.
Typically, you will need to provide a token or cookie in the request headers.

Please refer to the documentation of your [Kubeflow distribution](/docs/started/installing-kubeflow/#kubeflow-platform) for more information.

### Example Usage

To use the API, you will need to send HTTP requests to the appropriate endpoints.

For example, to list pipeline runs in the `team-1` namespace, send a `GET` request to the following URL:

```
https://kubeflow.example.com/pipeline/apis/v1beta1/runs?resource_reference_key.type=NAMESPACE&resource_reference_key.id=team-1
```

## Swagger UI

The following [Swagger UI](https://github.com/swagger-api/swagger-ui) is automatically generated from the [`{{% pipelines/latest-version %}}`](https://github.com/kubeflow/pipelines/releases/tag/{{% pipelines/latest-version %}}) version of Kubeflow Pipelines for the [`v1beta1` REST API](https://github.com/kubeflow/pipelines/blob/{{% pipelines/latest-version %}}/backend/api/v1beta1/swagger/kfp_api_single_file.swagger.json).

{{% alert title="Note" color="info" %}}
The _try it out_ feature of Swagger UI does not work due to authentication and CORS, but it can help you construct the correct API calls.
{{% /alert %}}

{{< swaggerui-inline >}}
https://raw.githubusercontent.com/kubeflow/pipelines/{{% pipelines/latest-version %}}/backend/api/v1beta1/swagger/kfp_api_single_file.swagger.json
{{< /swaggerui-inline >}}
