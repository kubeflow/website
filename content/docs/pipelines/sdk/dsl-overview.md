+++
title = "DSL Overview"
description = "Introduction to the Kubeflow Pipelines domain-specific language (DSL)"
weight = 50
+++

The
[Kubeflow Pipelines DSL](https://github.com/kubeflow/pipelines/tree/master/sdk/python/kfp/dsl)
is a set of Python libraries that you can use to specify machine learning (ML)
workflows, including [pipelines](/docs/pipelines/concepts/pipeline/) and their
[components](/docs/pipelines/concepts/component/).

The
[DSL compiler](https://github.com/kubeflow/pipelines/tree/master/sdk/python/kfp/compiler)
compiles your Python DSL code into a single static configuration (YAML)
that the Pipeline Service can process. The Pipeline Service, in turn, converts
the static configuration into a set of Kubernetes resources for execution.

## Installing the DSL

The DSL is part of the Kubeflow Pipelines software development toolkit (SDK),
which includes the DSL as well as Python libraries to interact with the Kubeflow
Pipeline APIs.

Follow the guide to 
[installing the Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## Introduction to main DSL functions and classes

This section introduces the DSL functions and classes that you use most often.
You can see all classes and functions in the
[Kubeflow Pipelines SDK](https://github.com/kubeflow/pipelines/tree/master/sdk/python/kfp/dsl).

### Pipelines

Use the
[`pipeline(name, description)` function](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline.py)
as a decorator for your pipeline functions.

Usage:

```python
@pipeline(
  name='My pipeline',
  description='My machine learning pipeline'
)
def my_pipeline(a: PipelineParam, b: PipelineParam):
  ...
```

**Note:** The
[`Pipeline()` class](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline.py)
is not useful for creating pipelines. Instead, you should define your pipeline
function and decorate it with `@pipeline` as described above. This class
is useful for getting a pipeline object and its operations when implementing a 
compiler.

### Pipeline parameters

The
[`PipelineParam(object)` class](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline_param.py)
represents a data type that you can pass between pipeline components.

You can use a `PipelineParam` object as a pipeline function argument. The object
is then a pipeline parameter that shows up in Kubeflow Pipelines UI. The object
can also represent an intermediate value passed between components.

Usage:

```python
@pipeline(
  name='My pipeline',
  description='My machine learning pipeline'
)
def my_pipeline(
    my_num = dsl.PipelineParam(name='num-foos', value=1000),
    my_name = dsl.PipelineParam(name='my-name', value='some text'),
    my_url = dsl.PipelineParam(name='foo-url', value='http://example.com')):
  ...
```

See more about pipeline parameters in the guide to
[building a component](/docs/pipelines/sdk/build-component/#create-a-python-class-for-your-component).

