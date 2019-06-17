+++
title = "Overview of the Pipelines SDK"
description = "Introduction to building components and pipelines"
weight = 2
+++

The [Kubeflow Pipelines 
SDK](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.html)
provides a set of Python packages that you can use to specify and run your 
machine learning (ML) workflows. A *pipeline* is a description of an ML 
workflow, including all of the *components* that make up the steps in the 
workflow and how the components interact with each other. 

## SDK packages

The Kubeflow Pipelines SDK includes the following packages:

* [`kfp.compiler`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html)
  includes classes and methods for building Docker container images for your
  pipeline components. Methods in this package include, but are not limited
  to, the following:

  * `kfp.compiler.Compiler.compile` compiles your Python DSL code into a single 
    static configuration (in YAML format) that the Kubeflow Pipelines service
    can process. The Kubeflow Pipelines service converts the static 
    configuration into a set of Kubernetes resources for execution.

  * `kfp.compiler.build_docker_image` builds a container image based on a 
    Dockerfile and pushes the image to a URI. In the parameters, you provide the 
    path to a Dockerfile containing the image specification, and the URI for the 
    target image (for example, a container registry).

  * `kfp.compiler.build_python_component` builds a container image for a
    pipeline component based on a Python function, and pushes the image to a 
    URI. In the parameters, you provide the Python function that does the work 
    of the pipeline component, a Docker image to use as a base image, 
    and the URI for the target image (for example, a container registry).

* [`kfp.components`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html)
  includes classes and methods for interacting with pipeline components. 
  Methods in this package include, but are not limited to, the following:

  * `kfp.components.func_to_container_op` converts a Python function to a 
    pipeline component and returns factory function.
    You can then call the factory function to construct an instance of a 
    pipeline task
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)) 
    that runs the original function in a container.

  * `kfp.components.load_component_from_file` loads a pipeline component from
    a file and returns a factory function.
    You can then call the factory function to construct an instance of a 
    pipeline task 
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)) 
    that runs the component container image.

  * `kfp.components.load_component_from_url` loads a pipeline component from
    a URL and returns a factory function.
    You can then call the factory function to construct an instance of a 
    pipeline task 
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)) 
    that runs the component container image.

* [`kfp.dsl`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html)
  contains the domain-specific language (DSL) that you can use to define and
  interact with pipelines and components. 
  Methods, classes, and modules in this package include, but are not limited to, 
  the following:

  * `kfp.dsl.ContainerOp` represents a pipeline task (op) implemented by a 
    container image.
  * `kfp.dsl.PipelineParam` represents a pipeline parameter that you can pass
    from one pipeline component to another. See more details 
    [below](#pipeline-param).
  * `kfp.dsl.component` is a decorator for DSL functions that returns a
    pipeline component
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)).
  * `kfp.dsl.pipeline` is a decorator for Python functions that returns a
    pipeline.
  * `kfp.dsl.python_component` is a decorator for Python functions that adds
    pipeline component metadata to the function object.
  * `kfp.dsl.types` contains a list of types defined by the Kubeflow Pipelines 
    SDK. See more details [below](#types).

* [`kfp.Client`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html)
  contains the Python client libraries for the [Kubeflow Pipelines 
  API](/docs/pipelines/reference/api/kubeflow-pipeline-api-spec/).
  Methods in this package include, but are not limited to, the following:

  * `kfp.Client.create_experiment` creates a pipeline 
    [experiment](/docs/pipelines/concepts/experiment/) and returns an
    experiment object.
  * `kfp.Client.run_pipeline` runs a pipeline and returns a run object.

* [`kfp.notebook`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.notebook.html)
  TODO CURRENTLY EMPTY ON READ THE DOCS

* [KFP extension modules](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html)
  include classes and functions for specific platforms on which you can use
  Kubeflow Pipelines. Examples include utility functions for on premises,
  Google Cloud Platform (GCP), Amazon Web Services (AWS), and Microsoft Azure.

## Installing the SDK

Follow the guide to 
[installing the Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## Building pipelines and components

This section summarizes the ways you can use the SDK to build pipelines and 
components, and provides links to further information. The diagrams provide a
conceptual guide to the relationship between the following concepts:

* Your Python code
* A pipeline component
* A Docker container image
* A pipeline

<a id="standard-component-in-app"></a>
### Building components and pipeline within your application code

This section describes how to create a pipeline component *inside* your
Python application, as part of the application. The DSL code for creating a
component therefore runs inside your Docker container.

<img src="/docs/images/pipelines-sdk-within-app.svg" 
  alt="Building components within your application code"
  class="mt-3 mb-3 border border-info rounded">

Below is a more detailed explanation of the above diagram:

1. Write your code in a Python function. For example, write code to transform 
  data or train a model.

    ```python
    def my_python_func(a: str, b: int) -> str:
      ...
    ```

1. Use the 
  [`kfp.dsl.python_component`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.python_component)
  decorator to convert your Python function into 
  a pipeline component. To use the decorator, you can add the 
  `@dsl.python_component` annotation to your function:

    ```python
    @dsl.python_component(
      name='my awesome component',
      description='Come, Let's play',
      base_image='tensorflow/tensorflow:1.11.0-py3',
    )
    def my_python_func(a: str, b: int) -> str:
      ...
    ```

1. Use 
  [`kfp.compiler.build_python_component`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.build_python_component)
  to create a container image for the component.

    TODO: EXAMPLE FROM SAMPLES and include my_python_func

1. Write a pipeline function using the Kubeflow Pipelines DSL to define the 
  pipeline and include all the pipeline components. Use the 
  [`kfp.dsl.pipeline`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.pipeline)
  decorator to build a pipeline from your pipeline function, by adding 
  the `@dsl.pipeline` annotation to your pipeline function:

    ```python
    @kfp.dsl.pipeline(
      name='My pipeline',
      description='My machine learning pipeline'
    )
    def my_pipeline(a: PipelineParam, b: PipelineParam):
      ...
    ```

1. Compile the pipeline to generate a compressed YAML definition of the 
  pipeline. The Kubeflow Pipelines service converts the static configuration 
  into a set of Kubernetes resources for execution.
  
    To compile the pipeline, you can choose one of the following 
    options:

    * Use the 
      [`kfp.compiler.Compiler.compile`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.Compiler) 
      method.

        TODO: Example

    * Use the `dsl-compile` command on the command line.

        TODO: Example

1. Upload the pipeline to the Kubeflow Pipelines UI, share the pipeline in
  a shared repository, or use the Kubeflow Pipelines SDK to run the pipeline:

    ```python
    kfp.Client.create_experiment
    kfp.Client.run_pipeline
    ```

    TODO:EXPAND THE ABOVE EXAMPLE

<a id="lightweight-component"></a>
### Building lightweight components and pipeline

TODO

<a id="standard-component-outside-app"></a>
### Creating components outside your application code

This section describes how to create a component and a pipeline *outside* your
Python application, by creating components from existing containerized
applications.

TODO

TODO: INCORPORATE THIS EXAMPLE FROM THE ORIGINAL DSL OVERVIEW:

```python
@kfp.dsl.component
def my_component(my_param):
  ...
  return dsl.ContainerOp()
```

The above `component` decorator requires the function to return a `ContainerOp` 
instance. The main purpose of using this decorator is to enable 
[DSL static type checking](/docs/pipelines/sdk/static-type-checking).

### Using prebuilt, reusable components in your pipeline

TODO

## DSL techniques

This section describes specific techniques for using the Kubeflow Pipelines
DSL. 

<a id="pipeline-param"></a>
### Pipeline parameters

The [`kfp.dsl.PipelineParam` 
class](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.PipelineParam)
represents a data type that you can pass between pipeline components.

You can use a `PipelineParam` object as an argument in your pipeline function.
The object is then a pipeline parameter that shows up in Kubeflow Pipelines UI.
A `PipelineParam` can also represent an intermediate value that you pass between 
components.

The following code sample shows how to use `PipelineParam` objects as
arguments in a pipeline function:

```python
@kfp.dsl.pipeline(
  name='My pipeline',
  description='My machine learning pipeline'
)
def my_pipeline(
    my_num = dsl.PipelineParam(name='num-foos', value=1000),
    my_name = dsl.PipelineParam(name='my-name', value='some text'),
    my_url = dsl.PipelineParam(name='foo-url', value='http://example.com')):
  ...
```

The DSL supports auto-conversion from string to `PipelineParam`. You can
therefore write the same function like this:

```python
@kfp.dsl.pipeline(
  name='My pipeline',
  description='My machine learning pipeline'
)
def my_pipeline(
    my_num='1000', 
    my_name='some text', 
    my_url='http://example.com'):
  ...
```

See more about `PipelineParam` objects in the guide to [building a 
component](/docs/pipelines/sdk/build-component/#create-a-python-class-for-your-component).

<a id="types"></a>
### Types

The [`kfp.dsl.types` 
module](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.types.html)
contains a list of types defined by the Kubeflow Pipelines SDK. Types
include basic types like `String`, `Integer`, `Float`, and `Bool`, as well as
domain-specific types like `GCPProjectID` and `GCRPath`.

See the guide to 
[DSL static type checking](/docs/pipelines/sdk/static-type-checking).

## Next steps

* See how to
  [build a pipeline](/docs/pipelines/sdk/build-component/#create-a-python-class-for-your-component).
* Build a [reusable component](/docs/pipelines/sdk/component-development/) for
  sharing in multiple pipelines.
* Read about [writing recursive functions in the 
  DSL](/docs/pipelines/sdk/dsl-recursion).