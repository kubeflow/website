+++
title = "Getting started"
description = "Create your first pipeline"
weight = 2
+++

{{% kfp-v2-keywords %}}

To get started with the tutorials, pip install `kfp` v2:

```sh
pip install kfp
```

Here is a simple pipeline that prints a greeting:

```python
from kfp import dsl

@dsl.component
def say_hello(name: str) -> str:
    hello_text = f'Hello, {name}!'
    print(hello_text)
    return hello_text

@dsl.pipeline
def hello_pipeline(recipient: str) -> str:
    hello_task = say_hello(name=recipient)
    return hello_task.output
```

You can [compile the pipeline][compile-a-pipeline] to YAML with the KFP SDK DSL [`Compiler`][compiler]:

```python
from kfp import compiler

compiler.Compiler().compile(hello_pipeline, 'pipeline.yaml')
```

The [`dsl.component`][dsl-component] and [`dsl.pipeline`][dsl-pipeline] decorators turn your type-annotated Python functions into components and pipelines, respectively. The KFP SDK compiler compiles the domain-specific language (DSL) objects to a self-contained pipeline [YAML file][ir-yaml].

You can submit the YAML file to a KFP-conformant backend for execution. If you have already deployed a [KFP open source backend instance][installation] and obtained the endpoint for your deployment, you can submit the pipeline for execution using the KFP SDK [`Client`][client]. The following submits the pipeline for execution with the argument `recipient='World'`:

```python
from kfp.client import Client

client = Client(host='<MY-KFP-ENDPOINT>')
run = client.create_run_from_pipeline_package(
    'pipeline.yaml',
    arguments={
        'recipient': 'World',
    },
)
```

The client will print a link to view the pipeline execution graph and logs in the UI. In this case, the pipeline has one task that prints and returns `'Hello, World!'`.

## Next steps

* Learn more about [Connecting the Pipelines SDK to Kubeflow Pipelines](/docs/components/pipelines/user-guides/core-functions/connect-api/).