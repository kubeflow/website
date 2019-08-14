+++
title = "Seldon Serving"
description = "Model serving using Seldon"
weight = 40
+++

## Serve a model using Seldon

Seldon comes installed with Kubeflow.

The documentation for using Seldon can be found [here](https://docs.seldon.io/projects/seldon-core/en/latest/).

If you have a saved model on a PVC, Google Bucket or AWS S3 you can use one of the prepacked servers as discussed [here](https://docs.seldon.io/projects/seldon-core/en/latest/servers/overview.html).

Seldon also provides language specific wrappers to wrap your inference code for it to run in Seldon as discussed [here](https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/README.html).

### Kubeflow Specifics

  * By default Seldon is configured to use the istio Gateway `kubeflow-gateway` and will add Virtual Services for the Seldon resources you create.
  * The endpoints to serve predictions requests are discussed [here](https://docs.seldon.io/projects/seldon-core/en/latest/workflow/serving.html#istio)



