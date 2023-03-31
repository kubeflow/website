+++
title = "Pipeline Basics"
description = "Compose components into pipelines"
weight = 1
+++

While components have three authoring approaches, pipelines have one authoring approach: they are defined with a pipeline function decorated with the [`@dsl.pipeline`][dsl-pipeline] decorator. Take the following pipeline, `pythagorean`, which implements the Pythagorean theorem as a pipeline via simple arithmetic components:

```python
from kfp import dsl

@dsl.component
def square(x: float) -> float:
    return x ** 2

@dsl.component
def add(x: float, y: float) -> float:
    return x + y

@dsl.component
def square_root(x: float) -> float:
    return x ** .5

@dsl.pipeline
def pythagorean(a: float, b: float) -> float:
    a_sq_task = square(x=a)
    b_sq_task = square(x=b)
    sum_task = add(x=a_sq_task.output, y=b_sq_task.output)
    return square_root(x=sum_task.output).output
```

Although a KFP pipeline decoratored with the `@dsl.pipeline` decorator looks like a normal Python function, it is actually an expression of pipeline topology and [control flow][control-flow] semantics, constructed using the [KFP domain-specific language][dsl-reference-docs] (DSL).

A pipeline definition has four parts:

1. The pipeline decorator
2. Inputs and outputs declared in the function signature
3. Data passing and task dependencies
4. Task configurations
5. Pipeline control flow

This section covers the first four parts. [Control flow][control-flow] is covered in the next section.

### The pipeline decorator

KFP pipelines are defined inside functions decorated with the `@dsl.pipeline` decorator. The decorator takes three optional arguments:

* `name` is the name of your pipeline. If not provided, the name defaults to a sanitized version of the pipeline function name.
* `description` is a description of the pipeline.
* `pipeline_root` is the root path of the remote storage destination within which the tasks in your pipeline will create outputs. `pipeline_root` may also be set or overridden by pipeline submission clients.

You can modify the definition of `pythagorean` to use these arguments:

```python
@dsl.pipeline(name='pythagorean-theorem-pipeline',
              description='Solve for the length of a hypotenuse of a triangle with sides length `a` and `b`.',
              pipeline_root='gs://my-pipelines-bucket')
def pythagorean(a: float, b: float) -> float:
    ...
```

### Pipeline inputs and outputs

Like [components][components], pipeline inputs and outputs are defined by the parameters and annotations in the pipeline function signature.

In the preceding example, `pythagorean` accepts inputs `a` and `b`, each typed `float`, and creates one `float` output.

Pipeline inputs are declaried via function input parameters/annotations and pipeline outputs are declared via function output annotations. Pipeline outputs will _never be declared via pipeline function input parameters_, unlike for components that use [output artifacts][output-artifacts] or [Container Components that use `dsl.OutputPath`][container-component-outputs].

For more information on how to declare pipeline function inputs and outputs, see [Data Types][data-types].

### Data passing and task dependencies

When you call a component in a pipeline definition, it constructs a [`PipelineTask`][pipelinetask] instance. You can pass data between tasks using the `PipelineTask`'s `.output` and `.outputs` attributes.

For a task with a single unnamed output indicated by a single return annotation, access the output using `PipelineTask.output`. This the case for the components `square`, `add`, and `square_root`, which each have one unnamed output.

For tasks with multiple outputs or named outputs, access the output using `PipelineTask.output['<output-key>']`. Using named output parameters is described in more detail in [Data Types: Parameters][parameters-namedtuple].

In the absence of data exchange, tasks will run in parallel for efficient pipeline executions. This is the case for `a_sq_task` and `b_sq_task` which do not exchange data.

When tasks exchange data, an execution ordering is established between those tasks. This is to ensure that upstream tasks create their outputs before downstream tasks attempt to consume those outputs. For example, in `pythagorean`, the backend will execute `a_sq_task` and `b_sq_task` before it executes `sum_task`. Similarly, it will execute `sum_task` before it executes the final task created from the `square_root` component.

In some cases, you may wish to establish execution ordering in the absence of data exchange. In these cases, you can call one task's `.after()` method on another task. For example, while `a_sq_task` and `b_sq_task` do not exchange data, we can specify `a_sq_task` to run before `b_sq_task`:

```python
@dsl.pipeline
def pythagorean(a: float, b: float) -> float:
    a_sq_task = square(x=a)
    b_sq_task = square(x=b)
    b_sq_task.after(a_sq_task)
    ...
```

### Task configurations

The KFP SDK exposes several platform-agnostic task-level configurations via task methods. Platform-agnostic configurations are those that are expected to exhibit similar execution behavior on all KFP-conformant backends, such as the [open source KFP backend][oss-be] or [Google Cloud Vertex AI Pipelines][vertex-pipelines].

All platform-agnostic task-level configurations are set using [`PipelineTask`][pipelinetask] methods. Take the following environment variable example:

```python
from kfp import dsl

@dsl.component
def print_env_var():
    import os
    print(os.environ.get('MY_ENV_VAR'))

@dsl.pipeline()
def my_pipeline():
    task = print_env_var()
    task.set_env_variable('MY_ENV_VAR', 'hello')
```

When executed, the `print_env_var` component should print `'hello'`.

Task-level configuration methods can also be chained:

```python
print_env_var().set_env_variable('MY_ENV_VAR', 'hello').set_env_variable('OTHER_VAR', 'world')
```

The KFP SDK provides the following task methods for setting task-level configurations:

* `.add_accelerator_type`
* `.set_accelerator_limit`
* `.set_cpu_limit`
* `.set_memory_limit`
* `.set_env_variable`
* `.set_caching_options`
* `.set_display_name`
* `.set_retry`
* `.ignore_upstream_failure`

See the [`PipelineTask` reference documentation][pipelinetask] for more information about these methods.

### Pipelines as components

Pipelines can themselves be used as components in other pipelines, just as you would use any other single-step component in a pipeline. For example, we could easily recompose the preceding `pythagorean` pipeline to use an inner helper pipeline `square_and_sum`:

```python
@dsl.pipeline
def square_and_sum(a: float, b: float) -> float:
    a_sq_task = square(x=a)
    b_sq_task = square(x=b)
    return add(x=a_sq_task.output, y=b_sq_task.output).output


@dsl.pipeline
def pythagorean(a: float = 1.2, b: float = 1.2) -> float:
    sq_and_sum_task = square_and_sum(a=a, b=b)
    return square_root(x=sq_and_sum_task.output).output
```

<!-- TODO: make this reference more precise throughout -->
[dsl-reference-docs]: https://kubeflow-pipelines.readthedocs.io/en/master/source/dsl.html
[dsl-pipeline]: https://kubeflow-pipelines.readthedocs.io/en/master/source/dsl.html#kfp.dsl.pipeline
[control-flow]: /docs/components/pipelines/v2/pipelines/control-flow
[components]: /docs/components/pipelines/v2/components
[pipelinetask]: https://kubeflow-pipelines.readthedocs.io/en/master/source/dsl.html#kfp.dsl.PipelineTask
[vertex-pipelines]: https://cloud.google.com/vertex-ai/docs/pipelines/introduction
[oss-be]: /docs/components/pipelines/v2/installation/
[data-types]: /docs/components/pipelines/v2/data-types
[output-artifacts]: /docs/components/pipelines/v2/data-types/artifacts#using-output-artifacts
[container-component-outputs]: /docs/components/pipelines/v2/components/container-components#create-component-outputs
[parameters-namedtuple]: /docs/components/pipelines/v2/data-types/parameters#multiple-output-parameters
