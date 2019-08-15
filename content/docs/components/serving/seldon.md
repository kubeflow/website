+++
title = "Seldon Serving"
description = "Model serving using Seldon"
weight = 40
+++

## Serve a model using Seldon

Seldon comes installed with Kubeflow. Full documentation for running Seldon inference is provided within the [Seldon documentation site](https://docs.seldon.io/projects/seldon-core/en/latest/).

If you have a saved model in a PersistentVolume (PV), Google Cloud Storage bucket or Amazon S3 Storage you can use one of the [prepackaged model servers provided by Seldon](https://docs.seldon.io/projects/seldon-core/en/latest/servers/overview.html).

Seldon also provides [language specific model wrappers](https://docs.seldon.io/projects/seldon-core/en/latest/wrappers/README.html) to wrap your inference code for it to run in Seldon.

### Kubeflow Specifics

  * By default Seldon is configured to use the istio Gateway `kubeflow-gateway` and will add Virtual Services for the Seldon resources you create which [expose Seldon paths to the Kubeflow istio gateway](https://docs.seldon.io/projects/seldon-core/en/latest/workflow/serving.html#istio).

### Examples

   * [Kubeflow Seldon E2E Pipeline](https://docs.seldon.io/projects/seldon-core/en/latest/examples/kubeflow_seldon_e2e_pipeline.html)

Seldon provides a [large set of example notebooks](https://docs.seldon.io/projects/seldon-core/en/latest/examples/notebooks.html) showing how to run inference code for a wide range of machine learning toolkits.


