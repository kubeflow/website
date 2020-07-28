+++
title = "Seldon Core Serving"
description = "Model serving using Seldon"
weight = 40
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


{{% stable-status %}}

Seldon Core comes installed with Kubeflow. The [Seldon Core documentation site](https://docs.seldon.io/projects/seldon-core/en/latest/) provides full documentation for running Seldon Core inference.

Seldon presently requires a Kubernetes cluster version >= 1.12 and <= 1.17.

If you have a saved model in a PersistentVolume (PV), Google Cloud Storage bucket or Amazon S3 Storage you can use one of the [prepackaged model servers provided by Seldon Core](https://docs.seldon.io/projects/seldon-core/en/latest/servers/overview.html).

Seldon Core also provides [language specific model wrappers](https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/language_wrappers.html) to wrap your inference code for it to run in Seldon Core.

## Kubeflow specifics

You need to ensure the namespace where your models will be served has:

* An Istio gateway named kubeflow-gateway
* A label set as `serving.kubeflow.org/inferenceservice=enabled`

The following example applies the label `my-namespace` to the namespace for serving:

```
kubectl label namespace my-namespace serving.kubeflow.org/inferenceservice=enabled
```

Create a gateway called `kubeflow-gateway` in namespace `my-namespace`:

```
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: kubeflow-gateway
  namespace: my-namespace
spec:
  selector:
    istio: ingressgateway
  servers:
  - hosts:
    - '*'
    port:
      name: http
      number: 80
      protocol: HTTP
```

Save the above resource and apply it with `kubectl`.

## Simple example


Create a new namespace:

```
kubectl create ns testseldon
```

Label that namespace so you can run inference tasks in it:

```
kubectl label namespace testseldon serving.kubeflow.org/inferenceservice=enabled
```

Create an Istio gateway in that namespace named `kubeflow-gateway`:

```
cat <<EOF | kubectl create -f -
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: kubeflow-gateway
  namespace: testseldon
spec:
  selector:
    istio: ingressgateway
  servers:
  - hosts:
    - '*'
    port:
      name: http
      number: 80
      protocol: HTTP
EOF
```

Create an example `SeldonDeployment` with a dummy model:


```
cat <<EOF | kubectl create -n testseldon -f -
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

```
kubectl get sdep seldon-model -n testseldon -o jsonpath='{.status.state}\n'
```

Port forward to the Istio gateway:

```
kubectl port-forward $(kubectl get pods -l istio=ingressgateway -n istio-system -o jsonpath='{.items[0].metadata.name}') -n istio-system 8004:80
```

Send a prediction request:

```
curl -s -d '{"data": {"ndarray":[[1.0, 2.0, 5.0]]}}'    -X POST http://localhost:8004/seldon/testseldon/seldon-model/api/v1.0/predictions    -H "Content-Type: application/json"
```

You should see a response:

```
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
