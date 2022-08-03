+++
title = "Building components using your own container"
description = "Bring user-controlled container into component authoring in KFP v2"
weight = 50
+++

Container-based components make it easier to use the pre-existed container to build a KFP component. 
The user will control the container entrypoint and is able to define the component by specifying their container, commands, and args in a `ContainerSpec` object. 


## Before you begin

1. Run the following command to install the Kubeflow Pipelines SDK v1.6.2 or higher. If you run this command in a Jupyter
   notebook, restart the kernel after installing the SDK. 


```python
$ pip install --upgrade kfp
```

2. Import the `kfp`, and `kfp.dsl` packages.


```python
import kfp
from kfp.dsl import (
    container_component,
    ContainerSpec,
    Input,
    Output,
)
```

3. Create an instance of the [`kfp.Client` class][kfp-client] following steps in [connecting to Kubeflow Pipelines using the SDK client][connect-api].

[kfp-client]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html#kfp.Client
[connect-api]: https://www.kubeflow.org/docs/components/pipelines/sdk/connect-api
<!-- TODO: verify the link to connect-api -->


```python
client = kfp.Client() # change arguments accordingly
```

For more information about the Kubeflow Pipelines SDK, see the [SDK reference guide][sdk-ref].

[sdk-ref]: https://kubeflow-pipelines.readthedocs.io/en/stable/index.html

## Getting started with Container-based components

1. This section demonstrates how to get started building container-based components by creating a simple hello world component.

Define your component’s code as a python function that returns a `dsl.ContainerSpec` object to specify the container image and the commands to be run in the container and wrap the function into a `@container_component` decorator. The decorator will compose a `ComponentSpec` object using the `ContainerSpec` to be compiled for execution.
  <!-- TODO: add hyperlink to source code of ContainerSpec  -->

```python

```

2. 

3.

## Building a container-based component


## Example container-based components

