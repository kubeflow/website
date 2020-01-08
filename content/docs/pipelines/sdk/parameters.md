+++
title = "Pipeline Parameters"
description = "Passing data between pipeline components"
weight = 70
+++

The [`kfp.dsl.PipelineParam` 
class](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.PipelineParam)
represents a reference to future data that will be passed to the pipeline or produced by a task.

You pipeline function should have parameters, so that they can later be configured in the Kubeflow Pipelines UI.

When your pipeline function is called, each function argument will be a `PipelineParam` object.
You can pass those objects to the components as arguments to instantiate them and create tasks.
A `PipelineParam` can also represent an intermediate value that you pass between pipeline tasks.
Each task has outputs and you can get references to them from the `task.outputs[<output_name>]` dictionary.
The task output references can again be passed to other components as arguments.

In most cases you do not need to construct `PipelineParam` objects manually.

The following code sample shows how to define pipeline with parameters:

```python
@kfp.dsl.pipeline(
  name='My pipeline',
  description='My machine learning pipeline'
)
def my_pipeline(
    my_num: int = 1000, 
    my_name: str = 'some text', 
    my_url: str = 'http://example.com'
):
  ...
```

See more in the guide to [building a 
component](/docs/pipelines/sdk/build-component/#create-a-python-class-for-your-component).
