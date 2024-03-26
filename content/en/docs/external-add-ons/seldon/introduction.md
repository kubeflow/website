+++
title = "Introduction"
description = "A brief introduction to Seldon Core"
weight = 1
+++

## What is Seldon Core?

Seldon Core is an open source platform for deploying machine learning models on Kubernetes. 
It is designed to help productionize your models and make it easier to deploy them on Kubernetes clusters.

### Kubeflow Integration

Seldon Core is integrated and commonly used with Kubeflow.
For example, Seldon Core is often used to deploy models that have been trained with Kubeflow Pipelines.

## Installation

### Install from Kubeflow

You can install Seldon Core as part of Kubeflow, please see [Seldon Core in the `kubeflow/manifests`](https://github.com/kubeflow/manifests/tree/master/contrib/seldon) repository.

### Install from Seldon

You can also install Seldon Core directly from Seldon, please see the [Seldon Core documentation](https://docs.seldon.io/projects/seldon-core/en/latest/workflow/install.html).

## Usage

If you have a saved model in a PersistentVolume (PV), Google Cloud Storage bucket or Amazon S3 Storage you can use one of the [prepackaged model servers provided by Seldon Core](https://docs.seldon.io/projects/seldon-core/en/latest/servers/overview.html).

Seldon Core also provides [language specific model wrappers](https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/language_wrappers.html) to wrap your inference code for it to run in Seldon Core.

### Example: Deploying a model with Seldon Core

Create a new namespace:

```bash
kubectl create ns seldon
```

Label that namespace so you can run inference tasks in it:

```bash
kubectl label namespace seldon serving.kubeflow.org/inferenceservice=enabled
```

Create an example `SeldonDeployment` with a dummy model:

```bash
cat <<EOF | kubectl create -n seldon -f -
apiVersion: machinelearning.seldon.io/v1
kind: SeldonDeployment
metadata:
  name: seldon-model
spec:
  name: test-deployment
  predictors:
  - componentSpecs:
    - spec:
        containers:
        - image: seldonio/mock_classifier_rest:1.3
          name: classifier
    graph:
      children: []
      endpoint:
        type: REST
      name: classifier
      type: MODEL
    name: example
    replicas: 1
EOF
```

Wait for state to become available:

```bash
kubectl get sdep seldon-model -n seldon -o jsonpath='{.status.state}\n'
```

Port forward to the Istio gateway:

```bash
kubectl port-forward $(kubectl get pods -l istio=ingressgateway -n istio-system -o jsonpath='{.items[0].metadata.name}') -n istio-system 8004:80
```

Send a prediction request:

```bash
curl -s -d '{"data": {"ndarray":[[1.0, 2.0, 5.0]]}}' \
  -X POST http://localhost:8004/seldon/seldon/seldon-model/api/v1.0/predictions \
  -H "Content-Type: application/json"
```

You should see a response:

```json
{
  "meta": {
    "puid": "i2e1i8nq3lnttadd5i14gtu11j",
    "tags": {
    },
    "routing": {
    },
    "requestPath": {
      "classifier": "seldonio/mock_classifier_rest:1.3"
    },
    "metrics": []
  },
  "data": {
    "names": ["proba"],
    "ndarray": [[0.43782349911420193]]
  }
}
```

## Further documentation

* [Seldon Core documentation](https://docs.seldon.io/projects/seldon-core/en/latest/)
* [Example notebooks](https://docs.seldon.io/projects/seldon-core/en/latest/examples/notebooks.html)
* [GitHub repository](https://github.com/SeldonIO/seldon-core)
* [Community](https://docs.seldon.io/projects/seldon-core/en/latest/developer/community.html)
