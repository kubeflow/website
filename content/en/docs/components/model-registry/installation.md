+++
title = "Installation"
description = "How to set up Model Registry"
weight = 30
+++

This section details how to set up and configure Model Registry on your Kubernetes cluster with Kubeflow.

## Prerequisites

These are the minimal requirements to install Model Registry:

- Kubernetes >= 1.27
- Kustomize >= 5.0.3 ([see more](https://github.com/kubeflow/manifests/issues/2388))

<a id="model-registry-install"></a>

## Installing Model Registry

Kubeflow Model registry may be installed as part of a Kubeflow Platform, or as a standalone component.
The best option for you will depend on your specific requirements.

### Installing on Kubeflow Platform

Kubeflow Model Registry is available as an opt-in alpha component in Kubeflow Platform 1.9+, see [Installing Kubeflow](/docs/started/installing-kubeflow/) to learn more about deploying the Kubeflow Platform.

These instructions assume that you've installed Kubeflow from the [manifests](https://github.com/kubeflow/manifests/), if you're using a distribution consult its documentation instead.

Clone the `model-registry` repository:

```sh
git clone --depth 1 -b v{{% model-registry/latest-version %}} https://github.com/kubeflow/model-registry.git
```

Switch to the `manifests/kustomize` for the remaining commands in this section:

```sh
cd model-registry/manifests/kustomize
```

Kubeflow Central Dashboard uses [Profiles](/docs/components/central-dash/profiles/) to handle user namespaces and permissions. By default, the manifests deploy the Model Registry in the `kubeflow` namespace, to install a compatible version of Model Registry for Kubeflow, you should instead deploy to your profile namespace. Use the following command the modify the manifests for your profile:

```sh
PROFILE_NAME=<your-profile>
for DIR in options/istio overlays/db ; do (cd $DIR; kustomize edit set namespace $PROFILE_NAME); done
```

{{% alert title="Note" color="info" %}}
> If you're not sure of the profile name, you can find it in the name space drop-down on the Kubeflow Dashboard.
{{% /alert %}}

Now apply the manifests:

```sh
kubectl apply -k overlays/db
kubectl apply -k options/istio
kubectl apply -k options/ui/overlays/istio
```

It may take a few minutes for the pods to be ready, you can check the status of the pods in your profile namespace:

```sh
kubectl get pods -n $PROFILE_NAME -w
```

Finally, configure a Model Registry link in the Kubeflow Dashboard:

```sh
kubectl get configmap centraldashboard-config -n kubeflow -o json | jq '.data.links |= (fromjson | .menuLinks += [{"icon": "assignment", "link": "/model-registry/", "text": "Model Registry", "type": "item"}] | tojson)' | kubectl apply -f - -n kubeflow
```

### Standalone installation

It is also possible to install Model Registry as a standalone deployment, separately from Kubeflow.

By default, the [manifests](https://github.com/kubeflow/model-registry/tree/v{{% model-registry/latest-version %}}/manifests/kustomize) deploy the Model Registry in the `kubeflow` namespace;
you must ensure the `kubeflow` namespace is available (for example: `kubectl create namespace kubeflow`)
or modify [the kustomization file](https://github.com/kubeflow/model-registry/blob/v{{% model-registry/latest-version %}}/manifests/kustomize/overlays/db/kustomization.yaml#L3) to your desired namespace.

See the list of available versions on the [GitHub releases](https://github.com/kubeflow/model-registry/releases) of the `kubeflow/model-registry` repository. To install a specific release of the Model Registry, modify the following commands with the desired `ref=<GIT_TAG>`.

Run the following command to install the `v{{% model-registry/latest-version %}}` release of Model Registry:

```shell
MODEL_REGISTRY_VERSION={{% model-registry/latest-version %}}
kubectl apply -k "https://github.com/kubeflow/model-registry/manifests/kustomize/overlays/db?ref=v${MODEL_REGISTRY_VERSION}"
```

If your Kubernetes cluster uses Istio, you MUST apply the Istio-compatibility manifests (e.g. when using a full Kubeflow Platform). However, these are NOT required for non-Istio clusters.

```shell
MODEL_REGISTRY_VERSION={{% model-registry/latest-version %}}
kubectl apply -k "https://github.com/kubeflow/model-registry/manifests/kustomize/options/istio?ref=v${MODEL_REGISTRY_VERSION}"
```

If you want Kserve to be able to support `model-registry://` URI formats, you must apply the cluster-scoped `CustomStorageContainer` CR.

```shell
MODEL_REGISTRY_VERSION={{% model-registry/latest-version %}}
kubectl apply -k "https://github.com/kubeflow/model-registry/manifests/kustomize/options/csi?ref=v${MODEL_REGISTRY_VERSION}"
```

## Check Model Registry setup

{{% alert title="Note" color="warning" %}}
> The commands and addresses in this section assume you've installed
> Model Registry in the `kubeflow` namespace. Adjust the commands appropriately
> if you installed into another namespace.
{{% /alert %}}

You can check the status of the Model Registry deployment with your Kubernetes tooling, or for example with:

```shell
kubectl wait --for=condition=available -n kubeflow deployment/model-registry-deployment --timeout=1m
kubectl logs -n kubeflow deployment/model-registry-deployment
```

Optionally, you can also manually forward the REST API container port of Model Registry and interact with the [REST API](reference/rest-api),
for example with:
```shell
kubectl port-forward svc/model-registry-service -n kubeflow 8081:8080
# in another terminal:
curl -X 'GET' \
  'http://localhost:8081/api/model_registry/v1alpha3/registered_models?pageSize=100&orderBy=ID&sortOrder=DESC' \
  -H 'accept: application/json' | jq
```

If you are not receiving a `2xx` response, it might be the case you are trying to consume a different version (`v1alphaX`) of the REST API than intended.

### Perform the check from within a Notebook

To check the connection to the Model Registry from a Notebook instead, start a Terminal from the Notebook environment, then you can dry-run the connection with the following command:

```
curl model-registry-service.kubeflow.svc.cluster.local:8080/api/model_registry/v1alpha3/registered_models
```

or, alternatively, with the following command:

```
wget -nv -O- model-registry-service.kubeflow.svc.cluster.local:8080/api/model_registry/v1alpha3/registered_models
```

If the command executes without any error, you will get a JSON response from Model Registry, indicating the connection and request was successful.

You can use the same commands in a Jupyter Notebook cell by prefixing the command with `!` (e.g.: `! curl ...`).

## Next steps

- Follow the [Getting Started](getting-started.md) guide to learn how to use Model Registry.
