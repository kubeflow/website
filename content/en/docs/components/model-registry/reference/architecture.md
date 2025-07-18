+++
title = "Architecture"
description = "Reference documentation for the Kubeflow Model Registry"
weight = 100
+++

<img src="/docs/components/model-registry/reference/images/model-registry-overview.jpg"
  alt="Model Registry High Level Architecture"
  class="mt-3 mb-3 border rounded">

{{% alert title="Note" color="warning" %}}
The Model Registry is a passive repository for metadata and is not meant to be a Control Plane. It does not perform any active orchestration or expose APIs to perform actions on underlying Kubernetes components.
{{% /alert %}}


Kubeflow Model Registry stores metadata in a backend RDBMS that leverages an extensible ER model inspired by the Google community project [ML-Metadata](https://github.com/google/ml-metadata). This provides a very extensible schema that, while being generic (similar to a key-value store), additionally allows for the creation of logical schemas that can be queried as if they were physical schemas.
This schema is extended to provide the metadata management service capabilities specifically for the Model Registry, as explained in detail in the [logical model](https://github.com/kubeflow/model-registry/blob/main/docs/logical_model.md).

Model Registry provides:
- an OpenAPI interface to expose the Model Registry API to clients
- Python/Go extensions to support Model Registry interactions

## Components

- *[OpenAPI/REST Server](https://github.com/kubeflow/model-registry)*
  
  This component exposes a high-level REST API of the Model Registry.
  The REST API offers end-user capabilities focused on the domain model of the Model Registry, such as:
    - Register a Model
    - Version a Model
    - Get a catalog of models
    - Manage the deployment statuses of a model

  The REST API server converts its requests into one or more operations to the backend RDBMS.

- *[CLI (Python client, SDK)](https://github.com/kubeflow/model-registry/tree/main/clients/python)*
  
  CLI is also called MR Python client/SDK, a command line tool for interacting with Model Registry. This tool can be used by a user to execute operations such as retrieving the registered models, get model’s deployment status, model’s version etc. 

The model registry provides logical mappings from the high level [logical model](https://github.com/kubeflow/model-registry/blob/main/docs/logical_model.md) available through the OpenAPI/REST Server, to the underlying ml-metadata entities.

## See also

- Model Registry [project documentation](https://github.com/kubeflow/model-registry?tab=readme-ov-file#documentation-links).
