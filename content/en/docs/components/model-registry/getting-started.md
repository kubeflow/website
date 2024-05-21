+++
title = "Getting started"
description = "Getting started with Model Registry using examples"
weight = 30

+++

This guide shows how to get started with Model Registry and run a few examples using the
command line or Python clients.

At this time, the Model Registry does not include a web-based User Interface (UI), therefore this documentation focuses on backend services and APIs.

For an overview of the logical model of model registry, check the
[Model Registry logical model](https://github.com/kubeflow/model-registry/blob/main/docs/logical_model.md).
The logical model is exposed via the Model Registry [REST API](https://editor.swagger.io/?url=https://raw.githubusercontent.com/kubeflow/model-registry/main/api/openapi/model-registry.yaml).

## Prerequisites

To follow along the examples in this guide, you will need a Kubeflow installation and the Model Registry installed:

- Kubeflow [installed](/docs/started/installing-kubeflow/)
- Model Registry [installed](/docs/components/model-registry/installation/)
- Python >= 3.9, < 3.11

## Example: track Model Artifacts from a Notebook

This section details a step by step example on using Model Registry from a Notebook, installing and creating a client instance, indexing metadata, and retrieving metadata.

### Install Model Registry Python client

You can install the Model Registry python client in a Notebook, for instance with:

```
!pip install model-registry
```

Note: depending on your Python and Notebook environment, you might need to fine-tune the dependencies of: `ml-metadata`, `protobuf`, `grpcio`, or `tensorflow` if used.

You can now create a client instance pointing to your deployed Model Registry from the previous steps.

```python
from model_registry import ModelRegistry

registry = ModelRegistry(server_address="model-registry-service.kubeflow.svc.cluster.local", port=9090, author="your name")
```

You now have a Model Registry client instance: `registry`.

### Register a Model Artifact metadata

You can use the `register_model` method to index a model's artifacts and its metadata, for instance:

```python
registeredmodel_name = "mnist"
version_name = "v0.1"
rm = registry.register_model(registeredmodel_name,
                                "https://github.com/tarilabs/demo20231212/raw/main/v1.nb20231206162408/mnist.onnx",
                                model_format_name="onnx",
                                model_format_version="1",
                                version=version_name,
                                description="lorem ipsum mnist",
                                metadata={
                                    "accuracy": 3.14,
                                    "license": "apache-2.0",
                                }
                                )
```

For more information on indexing metadata in the Model Registry, refer to the pydoc documentation of the Model Registry Python client.

### Retrieve a given Model Artifact metadata

Continuing on the previous example, you can use the following methods to retrieve the metadata associated with a given Model Artifact:

```python
print("RegisteredModel:")
print(registry.get_registered_model(registeredmodel_name))

print("ModelVersion:")
print(registry.get_model_version(registeredmodel_name, version_name))

print("ModelArtifact:")
print(registry.get_model_artifact(registeredmodel_name, version_name))
```

## Example add-on: deploy inference endpoint using Model Registry metadata 

This section details a step by step example on using Model Registry to retrieve indexed ML artifacts metadata, and using that metadata to create an inference endpoint deployment.

Without Model Registry, you would need to fill this information manually and potentially from several sources, resulting in a not-trivial, manual process.
Using Model Registry ensures simplified access to accurate metadata, and enables you to automate deployment based on the Model Registry values, as also shown in the example below.

Note: the provided example uses the Model Registry Python client and KServe Python SDK. You can analogously make use of the Model Registry REST APIs, and your own Add-on SDK as needed.

### Retrieve a given Model Artifact metadata

You can use the Model Registry Python client to retrieve the needed ML artifact metadata, for example:

```python
from model_registry import ModelRegistry

registry = ModelRegistry(server_address="model-registry-service.kubeflow.svc.cluster.local", port=9090, author="mmortari")

lookup_name = "mnist"
lookup_version="v20231206163028"

print("RegisteredModel:")
registered_model = registry.get_registered_model(lookup_name)
print(registered_model)
print("ModelVersion:")
model_version = registry.get_model_version(lookup_name, lookup_version)
print(model_version)
print("ModelArtifact:")
model_artifact = registry.get_model_artifact(lookup_name, lookup_version)
print(model_artifact)

storage_uri = model_artifact.uri
model_format_name = model_artifact.model_format_name
model_format_version = model_artifact.model_format_version
```

These metadata values can be used to create a KServe modelmesh inference endpoint.

### Create an inference endpoint using the retrieved metadata

You can use the retrieved metadata from the previous step with the KServe Python SDK to create an inference endpoint, for example:

```python
from kubernetes import client 
from kserve import KServeClient
from kserve import constants
from kserve import utils
from kserve import V1beta1InferenceService
from kserve import V1beta1InferenceServiceSpec
from kserve import V1beta1PredictorSpec
from kserve import V1beta1SKLearnSpec
from kserve import V1beta1ModelSpec
from kserve import V1beta1ModelFormat

namespace = utils.get_default_target_namespace()
name='mnist'
kserve_version='v1beta1'
api_version = constants.KSERVE_GROUP + '/' + kserve_version

isvc = V1beta1InferenceService(api_version=api_version,
                               kind=constants.KSERVE_KIND,
                               metadata=client.V1ObjectMeta(
                                   name=name, namespace=namespace,
                                   labels={'modelregistry/registered-model-id': registered_model.id, 'modelregistry/model-version-id': model_version.id}
                               ),
                               spec=V1beta1InferenceServiceSpec(
                               predictor=V1beta1PredictorSpec(
                                 model=V1beta1ModelSpec(
                                     storage_uri=storage_uri,
                                     model_format=V1beta1ModelFormat(name=model_format_name, version=model_format_version),
                                     runtime="kserve-ovms",
                                     protocol_version='v2'
                                 )
                               )))
KServe = KServeClient()
KServe.create(isvc)
```

An inference endpoint is now created, using the artifact metadata retrieved from the Model Registry (previous step),
specifying the serving runtime to be used to serve the model, and references to the original entities in Model Registry.

## Next steps

- Get involved:
  - Model Registry working group: https://www.kubeflow.org/docs/about/community/#kubeflow-community-calendars
  - https://github.com/kubeflow/model-registry
- Feedback: {{% alpha-status feedbacklink="https://github.com/kubeflow/model-registry" %}}

