+++
title = "Pipeline Parameters"
description = "Passing data between pipeline components"
weight = 35
+++

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