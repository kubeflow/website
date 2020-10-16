+++
title = "Building Python function-based components"
description = "Building your own lightweight pipelines components using Python"
weight = 50
                    
+++

<a href="">Run in Google Colab</a> <a href="">View source on GitHub</a>

A Kubeflow Pipelines component is a self-contained set of code that performs one step in your
ML workflow. A pipeline component is composed of:

*   The component code, which implements the logic needed to perform a step in your ML workflow.
*   A component specification, which defines the component's metadata (it's name and description),
    interface (the component's inputs and outputs), and implementation (the Docker container image
    to run, how to pass inputs to your component code, and how to get the component's outputs).

Python function-based components make it easier to iterate quickly by letting you build your
component code as a Python function and generating the [component specification][component-spec] for you.
This document describes how to build Python function-based components and use them in your pipeline.

[component-spec]: https://www.kubeflow.org/docs/pipelines/reference/component-spec/

## Before you begin

1. Run the following command to install the Kubeflow Pipelines SDK.


```python
!pip3 install kfp --upgrade
```

2. Import the `kfp` and `kfp.components` packages.


```python
import kfp
import kfp.components as comp
```

3. Create an instance of the [`kfp.Client` class][kfp-client].

[kfp-client]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html#kfp.Client


```python
# If you run this command on a Jupyter notebook running on Kubeflow, you can exclude the host parameter.
# client = kfp.Client()
client = kfp.Client(host='<your-kubeflow-pipelines-host-name>')
```

For more information about the Kubeflow Pipelines SDK, see the [SDK reference guide][sdk-ref].

[sdk-ref]: https://kubeflow-pipelines.readthedocs.io/en/latest/index.html

## Getting started with Python function-based components

This section demonstrates how to get started building Python function-based components by walking
through the process of creating a simple component.

Define your component's code as a [stand-alone python function](#stand-alone).


```python
def add(a: float, b: float) -> float:
  '''Calculates sum of two arguments'''
  return a + b
```

In this example the function adds two floats and returns the sum of the two arguments.

Next, use `kfp.components.create_component_from_func` to generate the component specification YAML and return a
factory function that you can use to create [`kfp.dsl.ContainerOp`][container-op] class instances for your pipeline.
The component specification YAML is a reusable and shareable definition of your component.

[container-op]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp


```python
add_op = comp.create_component_from_func(add, output_component_file='add_component.yaml')
```

Finally, create and run your pipeline.


```python
import kfp.dsl as dsl
@dsl.pipeline(
  name='Addition pipeline',
  description='An example pipeline that performs addition calculations.'
)
def add_pipeline(
  a='a',
  b='7',
):
  # Passes a pipeline parameter and a constant value to the `add_op` factory function.
  first_add_task = add_op(a, 4)
  # Passes an output reference from `first_add_task` and a pipeline parameter to the
  # `add_op` factory function. For operations with a single return value, the output
  # reference can be accessed as `task.output` or `task.outputs['output_name']`.
  second_add_task = add_op(add_task.output, b)
    
  # Specify argument values for your pipeline run.
  arguments = {'a': '7', 'b': '8'}
    
  # Create a pipeline run, using the client you initialized in a prior step.
  client.create_run_from_pipeline_func(calc_pipeline, arguments=arguments)
```

[Learn more about creating and running pipelines][build-pipelines].

[build-pipelines]: https://www.kubeflow.org/docs/pipelines/sdk/build-component/

## Building Python function-based components

Use the following instructions to build a Python function-based component:

<a name="stand-alone"></a>

1.  Define a stand-alone Python function. This function must meet the following requirements:

    *   It should not use any code declared outside of the function definition.
    *   Import statements must be added inside the function. [Learn more about using and installing
        Python packages in your component](#packages).
    *   Helper functions must be defined inside this function.
    *   If the function accepts numeric values as parameters, the parameters must have type hints.
        Supported types are `int`, `float`, and `bool`. Otherwise, parameters are passed as strings.
    *   If your component returns multiple outputs, annotate your function with the
        [`typing.NamedTuple`][named-tuple-hint] type hint and use the [`collections.namedtuple`][named-tuple]
        function return your function's outputs as a new subclass of tuple.
        
        You can also return metadata and metrics from your function. 
        
        *  Metadata helps you visualize pipeline results.
           [Learn more about visualizing pipeline metadata][kfp-visualize].
        *  Metrics help you compare compare pipeline runs.
           [Learn more about using pipeline metrics][kfp-metrics].
        
[named-tuple-hint]: https://docs.python.org/3/library/typing.html#typing.NamedTuple
[named-tuple]: https://docs.python.org/3/library/collections.html#collections.namedtuple
[kfp-visualize]: https://www.kubeflow.org/docs/pipelines/sdk/output-viewer/
[kfp-metrics]: https://www.kubeflow.org/docs/pipelines/sdk/pipelines-metrics/


```python
from typing import NamedTuple
def multiple_return_values_example(a: float, b:float) -> NamedTuple(
  'ExampleOutputs',
  [
    ('sum', float),
    ('product', float),
    ('mlpipeline_ui_metadata', 'UI_metadata'),
    ('mlpipeline_metrics', 'Metrics')
  ]):
  """Example function that demonstrates how to return multiple values."""  
  sum_value = a + b
  product_value = a * b

  # Export a sample tensorboard
  metadata = {
    'outputs' : [{
      'type': 'tensorboard',
      'source': 'gs://ml-pipeline-dataset/tensorboard-train',
    }]
  }

  # Export two metrics
  metrics = {
    'metrics': [
      {
        'name': 'sum',
        'numberValue':  float(sum_value),
      },{
        'name': 'product',
        'numberValue':  float(product_value),
      }
    ]  
  }
  
  from collections import namedtuple
  example_output = namedtuple('ExampleOutputs', ['sum', 'product', 'mlpipeline_ui_metadata', 'mlpipeline_metrics'])
  return example_output(sum_value, product_value, metadata, metrics)
```

2.  (Optional.) If your function has complex dependencies, choose or build a container image for your
    Python function to run in. [Learn more about selecting or building your component's container
    image](#containers).
    
3.  Call [`kfp.components.create_component_from_func(func)`][create-component-from-func] to convert
    your function into a pipeline component.
    
    *   **func**: The Python function to convert.
    *   **base_image**: (Optional.) Specify the Docker container image to run this function in.
        [Learn more about selecting or building a container image](#containers).  
    *   **output_component_file**: (Optional.) Writes your component defintion to a file. You can
        use this file to share the component with colleagues or reuse it in different pipelines.
    *   **packages_to_install**: (Optional.) A list of versioned Python packages to install before
        running your function. 
    
<a name="packages"></a>
### Using and installing Python packages

When Kubeflow Pipelines runs your pipeline, each component runs within a Docker container image on a
Kubernetes Pod. To load the packages that your Python function depends on, one of the following must
be true:

*   The package must be installed on the container image.
*   The package must be defined using the `packages_to_install` parameter of the
    [`kfp.components.create_component_from_func(func)`][create-component-from-func] function.
*   Your function must install the package. For example, your function can use the
    [`subprocess` module][subprocess] to run a command like `pip install` that installs a package.

<a name="containers"></a>
### Selecting or building a container image

Currently, if you do not specify a container image, your Python-function based component uses the
[`python:3.7` container image][python37]. If your function has complex dependencies, you may benefit
from using a container image that has your dependencies preinstalled, or building a custom container
image. Preinstalling your dependencies reduces the amount of time that your component runs in, since
your component does not need to download and install packages each time it runs.

Many frameworks, such as [TensorFlow][tf-docker] and [PyTorch][pytorch-docker], and cloud service
providers offer prebuilt container images that have common dependencies installed.

If a prebuilt container is not available, you can build a custom container image with your Python
function's dependencies. For more information about building a custom container, read the
[Dockerfile reference guide in the Docker documentation][dockerfile].

If you build or select a container image, instead of using the default container image, the container
image must use Python 3.5 or later.

[python37]: https://hub.docker.com/layers/python/library/python/3.7/images/sha256-7eef781ed825f3b95c99f03f4189a8e30e718726e8490651fa1b941c6c815ad1?context=explore
[create-component-from-func]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html#kfp.components.create_component_from_func
[subprocess]: https://docs.python.org/3/library/subprocess.html
[tf-docker]: https://www.tensorflow.org/install/docker
[pytorch-docker]: https://hub.docker.com/r/pytorch/pytorch/tags
[dockerfile]: https://docs.docker.com/engine/reference/builder/

## Example Python function-based component

This section demonstrates how to build a Python function-based component that uses imports,
helper functions, and produces multiple outputs.

First, define your function.  


```python
from typing import NamedTuple

def my_divmod(
  dividend: float,
  divisor:float) -> NamedTuple(
    'MyDivmodOutput',
    [
      ('quotient', float),
      ('remainder', float),
      ('mlpipeline_ui_metadata', 'UI_metadata'),
      ('mlpipeline_metrics', 'Metrics')
    ]):
    '''Divides two numbers and calculate  the quotient and remainder'''
    
    # Import the numpy package inside the component function
    import numpy as np

    # Define a helper function
    def divmod_helper(dividend, divisor):
        return np.divmod(dividend, divisor)

    (quotient, remainder) = divmod_helper(dividend, divisor)

    from tensorflow.python.lib.io import file_io
    import json
    
    # Export a sample tensorboard
    metadata = {
      'outputs' : [{
        'type': 'tensorboard',
        'source': 'gs://ml-pipeline-dataset/tensorboard-train',
      }]
    }

    # Export two metrics
    metrics = {
      'metrics': [{
          'name': 'quotient',
          'numberValue':  float(quotient),
        },{
          'name': 'remainder',
          'numberValue':  float(remainder),
        }]}

    from collections import namedtuple
    divmod_output = namedtuple('MyDivmodOutput', ['quotient', 'remainder', 'mlpipeline_ui_metadata', 'mlpipeline_metrics'])
    return divmod_output(quotient, remainder, json.dumps(metadata), json.dumps(metrics))
```

Test your function by running it directly, or by building unit tests.


```python
my_divmod(100, 7)
```

This should return a result like the following:

```
MyDivmodOutput(quotient=14, remainder=2, mlpipeline_ui_metadata='{"outputs": [{"type": "tensorboard", "source": "gs://ml-pipeline-dataset/tensorboard-train"}]}', mlpipeline_metrics='{"metrics": [{"name": "quotient", "numberValue": 14.0}, {"name": "remainder", "numberValue": 2.0}]}')
```

Next, use `kfp.components.create_component_from_func` to return a factory function that you can use to create
[`kfp.dsl.ContainerOp`][container-op] class instances for your pipeline. This example also specifies the base container
image to run this function in.

[container-op]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp


```python
divmod_op = comp.func_to_container_op(my_divmod, base_image='tensorflow/tensorflow:1.11.0-py3')
```

Then define your pipeline. This example uses the `divmod_op` factory function and the `add_op`
factory function from and earlier example.


```python
import kfp.dsl as dsl
@dsl.pipeline(
   name='Calculation pipeline',
   description='An example pipeline that performs arithmetic calculations.'
)
def calc_pipeline(
   a='a',
   b='7',
   c='17',
):
    # Passes a pipeline parameter and a constant value as operation arguments.
    add_task = add_op(a, 4) # The add_op factory function returns a dsl.ContainerOp class instance. 
    
    # Passes the output of the add_task and a pipeline parameter as operation arguments.
    # For an operation with a single return value, the output reference are accessed using `task.output` or `task.outputs['output_name']`.
    divmod_task = divmod_op(add_task.output, b)

    # For an operation with a multiple return values, output references are accessed as `task.outputs['output_name']`.
    result_task = add_op(divmod_task.outputs['quotient'], c)
```

Finally, create and run your pipeline.


```python
# Specify pipeline argument values
arguments = {'a': '7', 'b': '8'}

# Submit a pipeline run
client.create_run_from_pipeline_func(calc_pipeline, arguments=arguments)
```

[Learn more about creating and running pipelines][build-pipelines].

[build-pipelines]: https://www.kubeflow.org/docs/pipelines/sdk/build-component/