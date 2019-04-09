+++
title = "DSL Overview"
description = "Introduction to the Kubeflow Pipelines domain-specific language (DSL)"
weight = 20
+++

The
[Kubeflow Pipelines DSL](https://github.com/kubeflow/pipelines/tree/master/sdk/python/kfp/dsl)
is a set of Python libraries that you can use to specify machine learning (ML)
workflows, including pipelines and their components. (If you're new to
pipelines, see the conceptual guides to [pipelines](/docs/pipelines/concepts/pipeline/)
and [components](/docs/pipelines/concepts/component/).)

The
[DSL compiler](https://github.com/kubeflow/pipelines/tree/master/sdk/python/kfp/compiler)
compiles your Python DSL code into a single static configuration (YAML)
that the Pipeline Service can process. The Pipeline Service, in turn, converts
the static configuration into a set of Kubernetes resources for execution.

## Installing the DSL

The DSL is part of the Kubeflow Pipelines software development kit (SDK),
which includes the DSL as well as Python libraries to interact with the Kubeflow
Pipeline APIs.

Follow the guide to 
[installing the Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## Introduction to main DSL functions and classes

This section introduces the DSL functions and classes that you use most often.
You can see all classes and functions in the
[Kubeflow Pipelines DSL](https://github.com/kubeflow/pipelines/tree/master/sdk/python/kfp/dsl).

### Pipelines

To create a pipeline, write your own pipeline function and use the DSL's
[`pipeline(name, description)` function](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline.py)
as a decorator.

Usage:

```python
@kfp.dsl.pipeline(
  name='My pipeline',
  description='My machine learning pipeline'
)
def my_pipeline(a: PipelineParam, b: PipelineParam):
  ...
```

**Note:** The
[`Pipeline()` class](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline.py)
is not useful for creating pipelines. Instead, you should define your pipeline
function and decorate it with `@kfp.dsl.pipeline` as described above. The class
is useful for getting a pipeline object and its operations when implementing a 
compiler.

### Components

To create a component for your pipeline, write your own component function and
use the DSL's
[`component(func)` function](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_component.py)
as a decorator.

Usage:

```python
@kfp.dsl.component
def my_component(my_param):
  ...
  return dsl.ContainerOp()
```

The above `component` decorator requires the function to return a `ContainerOp` 
instance. The main purpose of using this decorator is to enable 
[DSL static type checking](/docs/pipelines/sdk/static-type-checking).

### Pipeline parameters

The
[`PipelineParam(object)` class](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline_param.py)
represents a data type that you can pass between pipeline components.

You can use a `PipelineParam` object as an argument in your pipeline function.
The object is then a pipeline parameter that shows up in Kubeflow Pipelines UI.
A `PipelineParam` can also represent an intermediate value that you pass between 
components.

Usage as an argument in a pipeline function:

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

### Types

The
[types](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/types.py)
module contains a list of types defined by the Kubeflow Pipelines SDK. Types
include basic types like `String`, `Integer`, `Float`, and `Bool`, as well as
domain-specific types like `GCPProjectID` and `GCRPath`.

See the guide to 
[DSL static type checking](/docs/pipelines/sdk/static-type-checking).

## Next steps

* See how to
  [build a pipeline](/docs/pipelines/sdk/build-component/#create-a-python-class-for-your-component).
* Read about [writing recursive functions in the 
  DSL](/docs/pipelines/sdk/dsl-recursion).
