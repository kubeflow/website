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

Install the seldon package

```
ks pkg install kubeflow/seldon
```
Generate the core components

```
ks generate seldon seldon
```
Seldon allows complex runtime graphs for model inference to be deployed. For an example end-to-end integration see the [kubeflow-seldon example](https://github.com/kubeflow/example-seldon). For more details see the [seldon-core documentation](https://github.com/SeldonIO/seldon-core).


