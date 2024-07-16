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

- [Kubeflow](/docs/started/installing-kubeflow/)
- [Model Registry](/docs/components/model-registry/installation/)
- Python >= 3.9

<!-- TODO: list python client as a requirement -->

## Setup

To use Model Registry on a notebook you should first install the Python client:

```raw
!pip install --pre model-registry=="0.2.3a1"
```

Note that depending on your environment there might be conflicting dependency versions for packages that depend on
`pydantic`.

You can get a client pointing to your deployed Model Registry from the previous steps:

```python
from model_registry import ModelRegistry

registry = ModelRegistry(
    server_address="http://model-registry-service.kubeflow.svc.cluster.local",
    port=8080,
    author="your name",
    is_secure=False
)
```

<!-- TODO: missing link -->
For more information on client setup and capabilities, refer to the Model Registry Python client documentation.

## Register metadata

You can use the `register_model` method to index a model's artifacts and its metadata, for instance:

```python
rm = registry.register_model(
    "mnist",
    "https://github.com/tarilabs/demo20231212/raw/main/v1.nb20231206162408/mnist.onnx",
    model_format_name="onnx",
    model_format_version="1",
    version="v0.1",
    description="lorem ipsum mnist",
    metadata={
        "accuracy": 3.14,
        "license": "apache-2.0",
    }
)
```

## Retrieving metadata

Continuing on the previous example, you can use the following methods to retrieve the metadata associated with a given Model Artifact:

```python
model = registry.get_registered_model("mnist")
print("Registered Model:", model, "with ID", model.id)

version = registry.get_model_version("mnist", "v0.1")
print("Model Version:", version, "with ID", version.id)

art = registry.get_model_artifact("mnist", "v0.1")
print("Model Artifact:", art, "with ID", art.id)
```

These can be used to create a KServe inference endpoint.

## Deploy an inference endpoint

Normally you would need to provide your deployment metadata manually resulting in an error-prone process, especially
when such data has to be gathered from several sources.
Using Model Registry ensures simplified access to accurate metadata, and enables you to automate deployment based on the Model Registry values, as also shown in the example below.

Note: the provided example uses the Model Registry Python client and KServe Python SDK. You can analogously make use of the Model Registry REST APIs, and your own Add-on SDK as needed.

You can use the retrieved metadata from the previous step with the KServe Python SDK to create an inference endpoint, for example:

```python
from kubernetes import client
import kserve

isvc = kserve.V1beta1InferenceService(
    api_version=kserve.constants.KSERVE_GROUP + "/v1beta1",
    kind=kserve.constants.KSERVE_KIND,
    metadata=client.V1ObjectMeta(
        name="mnist",
        namespace=kserve.utils.get_default_target_namespace(),
        labels={
            "modelregistry/registered-model-id": model.id,
            "modelregistry/model-version-id": version.id,
        },
    ),
    spec=kserve.V1beta1InferenceServiceSpec(
        predictor=kserve.V1beta1PredictorSpec(
            model=kserve.V1beta1ModelSpec(
                storage_uri=art.uri,
                model_format=kserve.V1beta1ModelFormat(
                    name=art.model_format_name, version=art.model_format_version
                ),
                runtime="kserve-ovms",
                protocol_version="v2",
            )
        )
    ),
)
ks_client = kserve.KServeClient()
ks_client.create(isvc)
```

An inference endpoint is now created, using the artifact metadata retrieved from the Model Registry (previous step),
specifying the serving runtime to be used to serve the model, and references to the original entities in Model Registry.

## Next steps

- Get involved:
  - Model Registry working group: https://www.kubeflow.org/docs/about/community/#kubeflow-community-calendars
  - https://github.com/kubeflow/model-registry
- Feedback: {{% alpha-status feedbacklink="https://github.com/kubeflow/model-registry" %}}

