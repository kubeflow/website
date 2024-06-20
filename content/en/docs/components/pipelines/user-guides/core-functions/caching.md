+++
title = "Use Caching"
description = "How to use caching in Kubeflow Pipelines."
weight = 5
+++

Kubeflow Pipelines support caching to eliminate redundant executions and improve
the efficiency of your pipeline runs. This page provides an overview of caching
in KFP and how to use it in your pipelines.

## Overview

Caching in KFP is a feature that allows you to cache the results of a component
execution and reuse them in subsequent runs. When caching is enabled for a
component, KFP will reuse the component's outputs if the component
is executed again with the same inputs and parameters (and the output is still
available).

Caching is particularly useful when you have components that take a long time to
execute or when you have components that are executed multiple times with the
same inputs and parameters.

If a task's results are retrieved from cache, its representation in the UI will
be marked with a green "arrow from cloud" icon.

## How to use caching

Caching is enabled by default for all components in KFP. You can disable caching
for a component by calling `.set_caching_options(False)` on a task object.

```python
from kfp import dsl

@dsl.component
def say_hello(name: str) -> str:
    hello_text = f'Hello, {name}!'
    print(hello_text)
    return hello_text

@dsl.pipeline
def hello_pipeline(recipient: str = 'World!') -> str:
    hello_task = say_hello(name=recipient)
    hello_task.set_caching_options(False)
    return hello_task.output
```

You can also enable or disable caching for all components in a pipeline by
setting the argument `caching` when submitting a pipeline for execution.
This will override the caching settings for all components in the pipeline.

```python
from kfp.client import Client

client = Client()
client.create_run_from_pipeline_func(
    hello_pipeline,
    enable_caching=True,  # overrides the above disableing of caching
)
```
