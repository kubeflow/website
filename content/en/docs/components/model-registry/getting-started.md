+++
title = "Getting started"
description = "Getting started with Model Registry using examples"
weight = 20
+++

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkubeflow%2Fmodel-registry.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkubeflow%2Fmodel-registry?ref=badge_shield&issueType=license)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/9937/badge)](https://www.bestpractices.dev/projects/9937)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/kubeflow/model-registry/badge)](https://scorecard.dev/viewer/?uri=github.com/kubeflow/model-registry)

This guide shows how to get started with Model Registry and run a few examples using the
command line or Python clients.

For an overview of the logical model of model registry, check the [Model Registry logical model](https://github.com/kubeflow/model-registry/blob/main/docs/logical_model.md).
The logical model is exposed via the Model Registry [REST API](reference/rest-api).

## Prerequisites

To follow along the examples in this guide, you will need a Kubeflow installation and the Model Registry installed:

- [Kubeflow](/docs/started/installing-kubeflow/)
- [Model Registry](/docs/components/model-registry/installation/)
- Python >= 3.9

<!-- TODO: list python client as a requirement -->

## Setup

To use Model Registry on a notebook you should first install the Python client:

```raw
!pip install model-registry=="{{% model-registry/latest-version %}}"
!pip install kserve=="0.13"
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
    "iris",
    "gs://kfserving-examples/models/sklearn/1.0/model",
    model_format_name="sklearn",
    model_format_version="1",
    version="v1",
    description="Iris scikit-learn model",
    metadata={
        "accuracy": 3.14,
        "license": "BSD 3-Clause License",
    }
)
```

## Retrieving metadata

Continuing on the previous example, you can use the following methods to retrieve the metadata associated with a given Model Artifact:

```python
model = registry.get_registered_model("iris")
print("Registered Model:", model, "with ID", model.id)

version = registry.get_model_version("iris", "v1")
print("Model Version:", version, "with ID", version.id)

art = registry.get_model_artifact("iris", "v1")
print("Model Artifact:", art, "with ID", art.id)
```

These can be used to create a KServe inference endpoint.

## Deploy an inference endpoint

Normally you would need to provide your deployment metadata manually resulting in an error-prone process, especially
when such data has to be gathered from several sources.
Using Model Registry ensures simplified access to accurate metadata, and enables you to automate deployment based on the Model Registry values, as also shown in the examples below.

Note: the provided examples uses the Model Registry Python client and KServe Python SDK. You can analogously make use of the Model Registry REST APIs, and your own Add-on SDK as needed.

### Using Model Registry metadata

You can use the retrieved metadata from the previous step with the KServe Python SDK to create an inference endpoint, for example:

```python
from kubernetes import client
import kserve

isvc = kserve.V1beta1InferenceService(
    api_version=kserve.constants.KSERVE_GROUP + "/v1beta1",
    kind=kserve.constants.KSERVE_KIND,
    metadata=client.V1ObjectMeta(
        name="iris-model",
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
            )
        )
    ),
)
ks_client = kserve.KServeClient()
ks_client.create(isvc)
```

An inference endpoint is now created, using the artifact metadata retrieved from the Model Registry (previous step),
specifying the serving runtime to be used to serve the model, and references to the original entities in Model Registry.

### Using Model Registry Custom Storage Initializer

The Model Registry Custom Storage Initializer (CSI) is a custom implementation of the KServe Storage Initializer that allows you to use Model Registry metadata to download and deploy models (see [Installation instructions](installation.md)). You can create an InferenceService that references the model and version in the Model Registry:

```python
from kubernetes import client
import kserve

isvc = kserve.V1beta1InferenceService(
    api_version=kserve.constants.KSERVE_GROUP + "/v1beta1",
    kind=kserve.constants.KSERVE_KIND,
    metadata=client.V1ObjectMeta(
        name="iris-model",
        namespace=kserve.utils.get_default_target_namespace(),
        labels={
            "modelregistry/registered-model-id": model.id,
            "modelregistry/model-version-id": version.id,
        },
    ),
    spec=kserve.V1beta1InferenceServiceSpec(
        predictor=kserve.V1beta1PredictorSpec(
            model=kserve.V1beta1ModelSpec(
                storage_uri="model-registry://iris/v1", # The protocol is model-registry://{modelName}/{modelVersion}
                model_format=kserve.V1beta1ModelFormat(
                    name=art.model_format_name, version=art.model_format_version
                ),
            )
        )
    ),
)
ks_client = kserve.KServeClient()
ks_client.create(isvc)
```
Alternatively, you can create the same InferenceService using a YAML manifest:

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: iris-model
  namespace: kubeflow-user-example-com  # Replace if different from kserve.utils.get_default_target_namespace()
  labels:
    modelregistry/registered-model-id: "MODEL_ID"    # Replace with actual model.id value
    modelregistry/model-version-id: "VERSION_ID"      # Replace with actual version.id value
spec:
  predictor:
    model:
      storageUri: "model-registry://iris/v1"  # protocol format: model-registry://{modelName}/{modelVersion}
      modelFormat:
        name: "sklearn"          # Replace if needed with art.model_format_name from model registry (typically one of https://kserve.github.io/website/latest/modelserving/v1beta1/serving_runtime)
        version: "1"    # Replace if needed with art.model_format_version from model registry
```

The InferenceService is now created, the CSI retrieves the latest artifact data associated with the model version from the Model Registry, and then downloads the model from its URI.

## Using the Model Registry UI

In addition to the command line and Python clients, you can also use the Model Registry UI to manage your models. The UI provides an intuitive interface for registering, updating, and querying models and their metadata.

   <img src="/docs/components/model-registry/images/model-registry-ui-main.png"
   alt="Model Registry Overview"
   class="mt-3 mb-3 border rounded">

To access the Model Registry UI, navigate to the Kubeflow central dashboard and select the Model Registry component. From there, you can perform various actions such as:

- Registering new models
- Viewing registered models and their versions
- Updating model metadata
- Deleting models

For detailed instructions on using the Model Registry UI, refer to the [Model Registry UI documentation](https://github.com/kubeflow/model-registry/blob/main/clients/ui/README.md).

## Next steps

- Get involved:
  - [Model Registry working group](https://www.kubeflow.org/docs/about/community/#kubeflow-community-meetings)
  - [GitHub repository](https://github.com/kubeflow/model-registry)
- Share your feedback:
  - [File an issue](https://github.com/kubeflow/model-registry/issues/new/choose)
