+++
title = "Build Lightweight Python Components"
description = "Building your own lightweight pipelines components from Python."
weight = 7
+++

Lightweight Python components do not require you to build a new container image
for every code change. They're intended for fast iteration in a notebook 
environment.

Advantages over container components:

* Faster iteration: No need to build new container image after every change 
  (building images takes some time).
* Easier authoring: Components can be created in a local environment. Docker and 
  Kubernetes are not required.

## Building a lightweight Python component

To build a component, define a stand-alone Python function and then call 
`kfp.components.func_to_container_op(func)` to convert the function to a 
component that can be used in a pipeline.

There are several requirements for the component function:

* The function must be stand-alone.

  * It should not use any code declared outside the function definition.
  * Any imports should be added inside the main component function.
  * Any helper functions should also be defined inside the main component 
    function.

* The function can only import packages that are available in the base image.

  * If you need to import a package that's not available in the default base 
    image you can try to find a container image that already includes the 
    required packages. (As a workaround you can use the `subprocess` module 
    to run `pip install` for the required package.)

* If the function operates on numbers, the parameters must have type hints. 
  Supported types are `int`, `float`, `bool`. All other arguments are passed as 
  strings.
* To build a component with multiple output values, use Python's 
  [typing.NamedTuple](https://docs.python.org/3/library/typing.html#typing.NamedTuple) 
  type hint syntax: 
  
    ```
    NamedTuple('MyFunctionOutputs', [('output_name_1', type), ('output_name_2', float)])
    ``` 
    
    The `NamedTuple` class is already imported, so that it can be used in the 
    function declaration.

## Tutorials

See the notebook on 
[lightweight Python component basics](https://github.com/kubeflow/pipelines/blob/master/samples/notebooks/Lightweight%20Python%20components%20-%20basics.ipynb) 
for an example of creating lightweight Python components and using them in a 
pipeline.