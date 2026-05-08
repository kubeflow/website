+++
title = "Catalog REST API"
description = "API Reference for Kubeflow Hub Catalog"
weight = 310
+++

This document describes the API specification for the Catalog REST API.

## About the Model Catalog

The Catalog Service provides a **read-only discovery service** for ML models and MCP servers across multiple catalog sources. It acts as a federated metadata aggregation layer, allowing users to search and discover models from various external catalogs through a unified REST API.

For more information on Model Catalog, check the [component documentation](https://github.com/kubeflow/hub/blob/v{{% hub/latest-version %}}/catalog/README.md).

## Swagger UI

The following [Swagger UI](https://github.com/swagger-api/swagger-ui) is automatically generated from the [`{{% hub/latest-version %}}`](https://github.com/kubeflow/hub/releases/tag/v{{% hub/latest-version %}}) version of the Model Catalog [REST API](https://github.com/kubeflow/hub/blob/v{{% hub/latest-version %}}/api/openapi/catalog.yaml).

{{% alert title="Note" color="info" %}}
The _try it out_ feature of Swagger UI does not work due to authentication and CORS, but it can help you construct the correct API calls.
{{% /alert %}}

{{< swaggerui-inline component_name="Kubeflow Hub" default_input_url="https://kubeflow.example.com/" >}}
https://raw.githubusercontent.com/kubeflow/hub/refs/tags/v{{% hub/latest-version %}}/api/openapi/catalog.yaml
{{< /swaggerui-inline >}}
