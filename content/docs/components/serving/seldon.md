+++
title = "Seldon Serving"
description = "Model serving using Seldon"
weight = 40
+++

{{% stable-status %}}

Seldon comes installed with Kubeflow. The [Seldon documentation site](https://docs.seldon.io/projects/seldon-core/en/latest/) provides full documentation for running Seldon inference.

If you have a saved model in a PersistentVolume (PV), Google Cloud Storage bucket or Amazon S3 Storage you can use one of the [prepackaged model servers provided by Seldon](https://docs.seldon.io/projects/seldon-core/en/latest/servers/overview.html).

Seldon also provides [language specific model wrappers](https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/README.html) to wrap your inference code for it to run in Seldon.

## Kubeflow specifics

You need to ensure the namespace where your models will be served has:

* An Istio gateway named kubeflow-gateway
* A label set as `serving.kubeflow.org/inferenceservice=enabled`

Example:

Label the namespace for serving:

```
kubectl label namespace my-namespace serving.kubeflow.org/inferenceservice=enabled
```

Create a gateway call kubeflow-gateway in namespace `my-namespace`:

```
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

## Examples

* [Kubeflow Seldon E2E Pipeline](https://docs.seldon.io/projects/seldon-core/en/latest/examples/kubeflow_seldon_e2e_pipeline.html)

Seldon provides a [large set of example notebooks](https://docs.seldon.io/projects/seldon-core/en/latest/examples/notebooks.html) showing how to run inference code for a wide range of machine learning toolkits.
