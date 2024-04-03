+++
title = "Getting Started"
description = "How to set up Model Registry and run examples"
weight = 20

+++

This guide shows how to get started with Model Registry and run a few examples using the
command line or Python clients.

At this time, there is not yet an UI for Model Registry; therefore, this documentation focus on backend services and APIs.

For an overview of the logical model of model registry, check the
[Model Registry logical model](https://github.com/kubeflow/model-registry/blob/main/docs/logical_model.md).
The logical model is exposed via the Model Registry [REST API](https://editor.swagger.io/?url=https://raw.githubusercontent.com/kubeflow/model-registry/main/api/openapi/model-registry.yaml).

## Model Registry setup

This section details how to set up and configure Model Registry on your Kubernetes cluster with Kubeflow.

### Prerequisites

These are the minimal requirements to install Model Registry:

- Kubernetes >= 1.27
- Kustomize >= 5.0.3 ([see more](https://github.com/kubeflow/manifests/issues/2388))

<a id="model-registry-install"></a>

### Installing Model Registry

You can skip this step if you have already installed Kubeflow >=1.9. Your Kubeflow
deployment includes Model Registry ([see tracker issue](https://github.com/kubeflow/manifests/issues/2631)).

To install Model Registry as part of Kubeflow, follow the
[Kubeflow installation guide](/docs/started/installing-kubeflow/).

If you want to install Model Registry separately from Kubeflow, or to get a later version
of Model Registry, you can use one of the following Model Registry manifests.
Remember to substitute the relevant release (e.g. `v0.1.2`), modify `ref=main` to `ref=v0.1.2`.

The following steps show how to install Model Registry using a default Kubeflow >=1.8 installation.

```shell
kubectl apply -k "https://github.com/kubeflow/model-registry/tree/main/manifests/kustomize/overlays/db?ref=main"
```

As the default installation provides an Istio mesh, apply the necessary manifests:

```shell
kubectl apply -k "https://github.com/kubeflow/model-registry/tree/main/manifests/kustomize/options/istio?ref=main"
```

### Check Model Registry setup

You can check the status of the Model Registry deployment with your Kubernetes tooling, or for example with:

```shell
kubectl wait --for=condition=available -n kubeflow deployment/model-registry-deployment --timeout=1m
kubectl logs -n kubeflow deployment/model-registry-deployment
```

Optionally, you can also manually forward the REST API container port of Model Registry and interact with the [REST API](https://editor.swagger.io/?url=https://raw.githubusercontent.com/kubeflow/model-registry/main/api/openapi/model-registry.yaml),
for example with:
```shell
kubectl port-forward svc/model-registry-service -n kubeflow 8081:8080
# in another terminal:
curl -X 'GET' \
  'http://localhost:8081/api/model_registry/v1alpha2/registered_models?pageSize=100&orderBy=ID&sortOrder=DESC' \
  -H 'accept: application/json' | jq
```

If you are not receiving a `2xx` response, it might be the case you are trying to consume a different version (`v1alphaX`) of the REST API than intended.

## Example: index Model Artifacts from a Notebook

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

You can use the `register_model` method to index a model artifacts and its metadata, for instance:

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

You can reference the pydoc documentation for additional information on indexing metadata on Model Registry, using the Model Registry Python client.

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
                                   name=name, namespace=namespace, annotations={'sidecar.istio.io/inject':'false', 'serving.kserve.io/deploymentMode': 'ModelMesh'},
                                   labels={'modelregistry/registered-model-id': registered_model.id, 'modelregistry/model-version-id': model_version.id}
                               ),
                               spec=V1beta1InferenceServiceSpec(
                               predictor=V1beta1PredictorSpec(
                                 model=V1beta1ModelSpec(
                                     storage_uri=storage_uri,
                                     model_format=V1beta1ModelFormat(name=model_format_name, version=model_format_version),
                                     protocol_version='v2'
                                 )
                               )))
KServe = KServeClient()
KServe.create(isvc)
```

An inference endpoint is now created using the artifact metadata retrieved from the Model Registry.

## Next steps

- Get involved:
  - Model Registry working group: https://www.kubeflow.org/docs/about/community/#kubeflow-community-calendars
  - https://github.com/kubeflow/model-registry
- Feedback: {{% alpha-status feedbacklink="https://github.com/kubeflow/model-registry" %}}

