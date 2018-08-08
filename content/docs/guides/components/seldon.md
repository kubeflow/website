+++
title = "Seldon Serving"
description = "Seldon Serving"
weight = 10
toc = true
bref= "Model serving using Seldon"
[menu]
[menu.docs]
  parent = "components"
  weight = 40
+++

## Serve a model using Seldon
[Seldon-core](https://github.com/SeldonIO/seldon-core) provides deployment for any machine learning runtime that can be [packaged in a Docker container](https://github.com/SeldonIO/seldon-core/blob/master/docs/wrappers/readme.md).

Install the seldon package:

```
ks pkg install kubeflow/seldon
```
Generate the core components for v1alpha2 of Seldon's CRD:

```
ks generate seldon seldon
```

If you wish to use Seldon's previous v1alpha1 version of its CRD you need to set the ```seldonVersion``` parameter to one in the 0.1.x range, for example:

```
ks param set seldon seldonVersion 0.1.8
ks generate seldon seldon
```

### Seldon Deployment Graphs

Seldon allows complex runtime graphs for model inference to be deployed. Some example prototypes have been provided to help you get started. Follow the [Seldon docs](https://github.com/SeldonIO/seldon-core/blob/master/docs/wrappers/readme.md) to wrap your model code into an image that can be managed by Seldon. In the examples below we will use a model image ```seldonio/mock_classifier``` ; replace this with your actual model image. You will also need to choose between the v1alpha2 and v1alpha1 prototype examples depending on which version of Seldon you generated above. The following prototypes are available:

 * **A single model to serve**.
    * ```ks generate seldon-serve-simple-<seldonVersion> mymodel --image <image>```
    * Example: ```ks generate seldon-serve-simple-v1alpha2 mymodel --image seldonio/mock_classifier:1.0```
 * **An A-B test between two models**.
    * ```ks generate seldon-abtest-<seldonVersion> myabtest --imageA <imageA> --imageB <imageB>```
    * Example: ```ks generate seldon-abtest-v1alpha2 myabtest --imageA seldonio/mock_classifier:1.0 --imageB seldonio/mock_classifier:1.0```
 * **A multi-armed bandit between two models**. Allowing you to dynamically push traffic to the best model in real time. For more details see an [e-greedy algorithm example](https://github.com/SeldonIO/seldon-core/blob/master/notebooks/epsilon_greedy_gcp.ipynb).
    * ```ks generate seldon-mab-<seldonVersion> mymab --imageA <imageA> --imageB <imageB>```
    * Example: ```ks generate seldon-mab-v1alpha2 mymab --imageA seldonio/mock_classifier:1.0 --imageB seldonio/mock_classifier:1.0```
 * **An outlier detector for a single model**. See more details on the [default Mahalanobis outlier detection algorithm](https://github.com/SeldonIO/seldon-core/blob/master/examples/transformers/outlier_mahalanobis/outlier_documentation.ipynb).
    * ```ks generate seldon-outlier-detector-v1alpha2 myout --image <image>```
    * Example: ```ks generate seldon-outlier-detector-v1alpha2 myout --image seldonio/mock_classifier:1.0```

### Endpoints

Seldon exposes your prediction graph via REST and gRPC endpoints. Within Kubeflow these will be available via the Ambassador reverse proxy or via Seldon's OAuth API gateway if you installed it (set the ```withApife``` parameter to 'true' in the seldon component).

Assuming Ambassador is exposed at ```<ambassadorEndpoint>``` and with a Seldon deployment name ```<deploymentName>```:

 * A REST endpoint will be exposed at : ```http://<ambassadorEndpoint>/seldon/<deploymentName>/api/v0.1/predictions```
 * A gRPC endpoint will be exposed at ```<ambassadorEndpoint>``` and you should send metadata in your request with key ```seldon``` and value ```<deploymentName>```.

[Example Jupyter notebooks](https://github.com/SeldonIO/seldon-core#quick-start) are provided in Seldon's docs that show code that can be used as a basis to test the endpoints.

### Next Steps with Seldon

  * Seldon provides a set of generic building blocks so users can create their own components to place in their runtime inference graphs. Aside from models, there are Routers (e.g., A-B tests, Multi-Armed Bandits), Combiners (e.g., Ensemblers) and  Transformers (e.g., feature normalisation, outlier detection). To understand more [consult the Seldon docs](https://github.com/SeldonIO/seldon-core/blob/master/docs/reference/internal-api.md).
  * To understand how to upgrade your Seldon manifest's from v1alpha1 to v1alpha2 follow [this guide](https://github.com/SeldonIO/seldon-core/blob/master/docs/v1alpha2_update.md).
  * For an example end-to-end integration see the [kubeflow-seldon example](https://github.com/kubeflow/example-seldon).
  * For more details and example on the above see the [Seldon documentation](https://github.com/SeldonIO/seldon-core).


