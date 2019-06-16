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

If you're new to Kubeflow Pipelines, see the conceptual guides to 
[pipelines](/docs/pipelines/concepts/pipeline/)
and [components](/docs/pipelines/concepts/component/).

## SDK packages

The SDK includes the following packages:

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
components, and provides links to further information.

### TODO VARIOUS WAYS OF BUILDING WITH SDK

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