+++
title = "Architecture"
description = "Reference documentation for the Kubeflow Model Registry"
weight = 100
+++

![Model Registry High Level Architecture](/docs/components/model-registry/reference/images/model-registry-overview.jpg)

{{% alert title="Note" color="warning" %}}
The Model Registry is a passive repository for metadata and is not meant to be a Control Plane. It does not perform any active orchestration or expose APIs to perform actions on underlying Kubernetes components.
{{% /alert %}}


Kubeflow Model Registry makes use of the Google community project [ML-Metadata](https://github.com/google/ml-metadata) as one of its core component. ML-Metadata provides a very extensible schema that is generic, similar to a key-value store, but also allows for the creation of logical schemas that can be queried as if they were physical schemas. Those can be manipulated using their bindings in the Python library. This model is extended to provide the metadata management service capabilities for Model Registry.

The Model Registry uses the ml-metadata project’s C++ server as-is to handle the storing of the metadata, while domain-specific Model Registry features are added as extensions (microservices). As part of these extensions, Model Registry provides:
- Python/Go extensions to support the Model Registry interaction
- an OpenAPI interface to expose the Model Registry API to the clients

## Components
- *[MLMD C++ Server](https://github.com/google/ml-metadata)*
  
  This is the metadata server from Google's ml-metadata project.  This component is hosted to communicate with a backend relational database that stores the actual metadata about the models. This server exposes a “gRPC” interface for its clients to communicate with. This server provides a very flexible schema model, where using this model one can define logical data models to fit the needs of different MLOps operations, for example, metadata during the training and experimentation, metadata about metrics or model versioning, etc. 

- *[OpenAPI/REST Server](https://github.com/kubeflow/model-registry)*
  
  This component exposes a higher-level REST API of the Model Registry. In contrast, the MLMD server exposes a lower level generic API over gRPC, whereas this REST server exposes a higher level API that is much closer to the domain model of Model Registry, like:
    - Register a Model
    - Version a Model
    - Get a catalog of models
    - Manage the deployment statutes of a model
      
  The REST API server converts its requests into one or more underlying gRPC requests on the MLMD Server.

- *[CLI (Python client, SDK)](https://github.com/kubeflow/model-registry/tree/main/clients/python)*
  
  CLI is also called MR Python client/SDK, a command line tool for interacting with Model Registry. This tool can be used by a user to execute operations such as retrieving the registered models, get model’s deployment status, model’s version etc. 

The model registry provides logical mappings from the high level [logical model](https://github.com/kubeflow/model-registry/blob/main/docs/logical_model.md) available through the OpenAPI/REST Server, to the underlying ml-metadata entities.

## See also

- Model Registry [project documentation](https://github.com/kubeflow/model-registry?tab=readme-ov-file#pre-requisites).