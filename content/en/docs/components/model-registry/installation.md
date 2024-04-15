+++
title = "Installation"
description = "How to set up Model Registry"
weight = 20

+++

This section details how to set up and configure Model Registry on your Kubernetes cluster with Kubeflow.

## Prerequisites

These are the minimal requirements to install Model Registry:

- Kubernetes >= 1.27
- Kustomize >= 5.0.3 ([see more](https://github.com/kubeflow/manifests/issues/2388))

<a id="model-registry-install"></a>

## Installing Model Registry

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

## Check Model Registry setup

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
  'http://localhost:8081/api/model_registry/v1alpha3/registered_models?pageSize=100&orderBy=ID&sortOrder=DESC' \
  -H 'accept: application/json' | jq
```

If you are not receiving a `2xx` response, it might be the case you are trying to consume a different version (`v1alphaX`) of the REST API than intended.

## Next steps

- Run some examples following the [getting started guide](/docs/components/model-registry/getting-started/)
