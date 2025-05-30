+++
title = "REST API (v1alpha3)"
description = "API Reference for Kubeflow Model Registry API - v1alpha3"
weight = 300
+++

This document describes the API specification for the `v1alpha3` Kubeflow Model Registry REST API.

## About the REST API

In most deployments of the [Kubeflow Platform](/docs/started/installing-kubeflow/#kubeflow-platform), the Kubeflow Model Registry REST API is available under the `/api/model_registry/` HTTP path.

For example, if you host Kubeflow at `https://kubeflow.example.com`, the API will be available at `https://kubeflow.example.com/api/model_registry/`.

{{% alert title="Tip" color="info" %}}
We recommend using the [Model Registry Python Client](python-client.md) as it provides a more user-friendly interface.
{{% /alert %}}

### Authentication

How requests are authenticated and authorized will depend on the distribution you are using.
Typically, you will need to provide a token or cookie in the request headers.

Please refer to the documentation of your [Kubeflow distribution](/docs/started/installing-kubeflow/#kubeflow-platform) for more information.

### Example Usage

To use the API, you will need to send HTTP requests to the appropriate endpoints.

For example, to list all Artifact entities, send a `GET` request to the following URL:

```
https://kubeflow.example.com/api/model_registry/v1alpha3/artifacts?pageSize=100&orderBy=ID
```

## Swagger UI

The following [Swagger UI](https://github.com/swagger-api/swagger-ui) is automatically generated from the [`{{% model-registry/latest-version %}}`](https://github.com/kubeflow/model-registry/releases/tag/v{{% model-registry/latest-version %}}) version of Kubeflow Model Registry for the [`v1alpha3` REST API](https://github.com/kubeflow/model-registry/blob/v{{% model-registry/latest-version %}}/api/openapi/model-registry.yaml).

{{% alert title="Note" color="info" %}}
The _try it out_ feature of Swagger UI does not work due to authentication and CORS, but it can help you construct the correct API calls.
{{% /alert %}}

{{< swaggerui-inline component_name="Kubeflow Model Registry" default_input_url="https://kubeflow.example.com/" >}}
https://raw.githubusercontent.com/kubeflow/model-registry/refs/tags/v{{% model-registry/latest-version %}}/api/openapi/model-registry.yaml
{{< /swaggerui-inline >}}
