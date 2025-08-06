+++
title = "Model Catalog REST API"
description = "API Reference for Model Catalog (a Kubeflow Model Registry component)"
weight = 310
+++

This document describes the API specification for the Model Catalog REST API.

## About the Model Catalog

The Model Catalog Service provides a **read-only discovery service** for ML models across multiple catalog sources. It acts as a federated metadata aggregation layer, allowing users to search and discover models from various external catalogs through a unified REST API.

For more information on Model Catalog, check the [component documentation](https://github.com/kubeflow/model-registry/blob/v{{% model-registry/latest-version %}}/catalog/README.md).

## Swagger UI

The following [Swagger UI](https://github.com/swagger-api/swagger-ui) is automatically generated from the [`{{% model-registry/latest-version %}}`](https://github.com/kubeflow/model-registry/releases/tag/v{{% model-registry/latest-version %}}) version of the Model Catalog [REST API](https://github.com/kubeflow/model-registry/blob/v{{% model-registry/latest-version %}}/api/openapi/catalog.yaml).

{{% alert title="Note" color="info" %}}
The _try it out_ feature of Swagger UI does not work due to authentication and CORS, but it can help you construct the correct API calls.
{{% /alert %}}

{{< swaggerui-inline component_name="Kubeflow Model Registry" default_input_url="https://kubeflow.example.com/" >}}
https://raw.githubusercontent.com/kubeflow/model-registry/refs/tags/v{{% model-registry/latest-version %}}/api/openapi/catalog.yaml
{{< /swaggerui-inline >}}
