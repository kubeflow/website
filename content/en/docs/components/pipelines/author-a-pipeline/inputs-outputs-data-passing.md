+++
title = "Component I/O"
description = "Use parameter/artifact inputs and outputs"
weight = 3                 
+++

Components may accept inputs and create outputs. Inputs and outputs can be one of two types: parameters or artifacts. The following matrix describes possible component inputs and outputs:

|        | Parameter        | Artifact
| ------ | ---------------- | --------------- |
| Input  | Input Parameter  | Input Artifact  |
| Output | Output Parameter | Output Artifact |

Throughout the remainder of this section, we will use the following example dataset creation pipeline to understand the behavior and usage of input and output parameters and artifacts:

```python
from kfp import dsl
from kfp.dsl import Input, Output, Dataset


@dsl.container_component
def create_dataset(
    initial_text: str,
    output_dataset: Output[Dataset],
):
    """Create a dataset containing the string `initial_text`.""" 
    return dsl.ContainerSpec(
        image='alpine',
        command=['sh', '-c', 'mkdir --parents $(dirname "$1") && echo "$0" > "$1"',],
        args=[initial_text, output_dataset.path])


@dsl.component
def augment_dataset(
    existing_dataset: Input[Dataset],
    resulting_dataset: Output[Dataset],
    text: str,
    num: int = 10,
) -> int:
    """Append `text` `num` times to an existing dataset, then write it as a new dataset."""
    additional_data = ' '.join(text for _ in range(num))

    with open(existing_dataset.path, 'r') as f:
        existing_dataset_text = f.read()

    resulting_dataset_text = existing_dataset_text + ' ' + additional_data

    with open(resulting_dataset.path, 'w') as f:
        f.write(resulting_dataset_text)

    return len(resulting_dataset_text)


@dsl.pipeline()
def my_pipeline(initial_text: str = 'initial dataset text'):
    create_task = create_dataset(initial_text=initial_text)
    augment_dataset(
        existing_dataset=create_task.outputs['output_dataset'],
        text='additional text')
```

This pipeline uses a container component `create_dataset` to construct an initial `Dataset` artifact containing `initial_text`. Then, the downstream lightweight Python component `augment_dataset` appends `text` repeated `num` times to the dataset and saves it as a new dataset.

## Inputs
Component inputs are specified by the component function's signature. This applies for all authoring approaches: [lightweight Python components][lightweight-python-component], [containerized Python components][containerized-python-component], and [container components][container-component].

Ultimately, each authoring style creates a component definitied by an `image`, `command`, and `args`. When you use an input, it is represented as a placeholder in the `command` or `args` and is interpolated at component runtime.

There is one additional type of input, the struct `PipelineTaskFinalStatus`, which allows access to the metadata of one task from within another via a system-provided value at runtime. This input is a special case, as it is neither a typical parameter nor an artifact and it is only usable in `dsl.ExitHandler` exit tasks. Use of this input is covered in [Authoring: Pipelines][pipelines].

### Input parameters
Input parameters are declared when you use a `str`, `int`, `float`, `bool`, `dict` or `list` type annotation. The data passed to parameters typed with `dict` or `list` may only container JSON-serializable Python primitives. `Union` types are not permitted.

In the example `create_dataset` component, `initial_text` is an input parameter. In `augment_dataset`, `text` and `num` are input parameters.

Input parameters may have default values. For example, `augment_dataset`'s `num` parameter has a default value of `10`.

Within a component function body, use input parameters just as you would in a normal Python function.

### Input artifacts
Input artifacts are defined when you use an `Input[<ArtifactClass>]` annotation. For more information about artifacts, see [Artifacts][artifacts].

At component runtime, input artifacts are copied to the local filesystem by the executing backend. This abstracts away the need for the component author to know where artifacts are stored in remote storage and allows component authors to only interact with the local filesystem when implementing a component that uses an artifact. All artifacts implement a `.path` method, which can be used to access the local path where the artifact file has been copied.

Let's see how this works in practice. In our example pipeline, `augment_dataset` specifies the input `existing_dataset: Input[Dataset]`. In the pipeline definition, we pass the output dataset from `create_dataset` to this parameter. When the `augument_dataset` component runs, the executing backend copies the `output_dataset` artifact file to the container filesystem and passes in an instance of `Dataset` as an argument to `existing_dataset`. The `Dataset` instance has a `.path` handle to its location in the container filesystem, allowing the component to read it:

```python
with open(existing_dataset.path, 'r') as f:
    existing_dataset_text = f.read()
```

## Outputs
Like inputs, component outputs are also specified by the component function's signature. Depending on the component authoring approach and the type of output (parameter or artifact), outputs may be specified by the function return type annotation (e.g., `-> int`), the type annotation generic `Output[]`, or the type annotation class `OutputPath`. Uses for each are explained in the sections to follow.

For all output types and authoring styles, outputs from a component are persisted to a remote file store, such as [Minio][minio], [Google Cloud Storage][gcs], or [AWS S3][aws-s3], that way they outlast the ephemeral container that creates them and can be picked up for use by a downstream task.

### Output parameters
Output parameters are declared in different ways depending on the authoring approach.

#### Python components
For lightweight Python components and containerized Python components, output parameters are declared by the Python component function return type annotation (e.g., `-> int`). Like parameter inputs, return type annotations may be `str`, `int`, `float`, `bool`, `dict` or `list`. 

In our example, `augment_dataset` has a one integer output.

You may also specify multiple output parameters by using these annotations within a `typing.NamedTuple` as follows:

```python
from typing import NamedTuple
from kfp import dsl

@dsl.component
def my_component() -> NamedTuple('Outputs', [('name', str), ('id', int)]):
    from typing import NamedTuple

    output = NamedTuple('Outputs', [('name', str), ('id', int)])
    return output('my_dataset', 123)
```



#### Container components
For container components, output parameters are declared via an `OutputPath` annotation, which is a class that takes a type as its only argument (e.g., `OutputPath(int)`). At runtime, the backend will pass a filepath string to parameters with this annotation. This string indicating where in the container filesystem the component should write this parameter output. The backend will copy the file specified by this path to remote storage after component execution.

While the lightweight component executor handles writing the output parameters to the correct local filepath, container component authors must implement this in the container component logic.

For example, the following very simple `create_text_output_parameter` component creates the output parameter string `"some text"` by using an `OutputPath(str)` annotation and writing the parameter to the path in the variable `output_string_path`:

```python
from kfp import dsl
from kfp.dsl import OutputPath

@dsl.container_component
def create_text_output_parameter(output_string_path: OutputPath(str)):
    return dsl.ContainerSpec(
        image='alpine',
        command=[
            'sh', '-c',
            'mkdir --parents $(dirname "$0") && echo "some text" > "$0"'
        ],
        args=[output_string])
```

### Output artifacts
Output artifacts are declared when you use an `Output[<ArtifactClass>]` annotation. For more information about artifacts, see [Artifacts][artifacts].

Output artifacts are treated inversely to input artifacts at component runtime: instead of being _copied to the container_ from remote storage, they are _copied to remote storage_ from the `.path` location in the container's filesystem after the component executes. This abstracts away the need for the component author to know where artifacts are stored in remote storage and allows component authors to only interact with the local filesystem when implementing a component that creates an artifact. As with using an artifact input, component authors should write artifacts to `.path`:

```python
with open(resulting_dataset.path, 'w') as f:
    f.write(resulting_dataset_text)
```

## Passing data between tasks

To instantiate a component as a task, you must pass to it any required inputs. Required inputs include all input parameters without default values and all input artifacts.

Output parameters (e.g., `OutputPath`) and output artifacts (e.g., `Output[<ArtifactClass>]`) should not be passed explicitly by the pipeline author; they will be passed at component runtime by the executing backend. This allows component internals to know where output parameters and artifacts should be written in the container filesystem in order to be copied to remote storage by the backend.

Task inputs may come from one of three different places: a static variable, a pipeline parameter, or an upstream task output. Let's walk through each, using the following `identity` component to help illustrate each approach:

```python
@dsl.component
def identity(x: int) -> int:
    return x
```

### From a static variable

To provide static data as an input to a component, simply pass it as you would when using a normal function:

```python
@dsl.pipeline()
def my_pipeline():
    task = identity(x=10)
```

Note: Input artifacts cannot be passed as static variables; they must always be passed from an upstream task or an [`importer` component][importer-component].

### From a pipeline input
To pass data from a pipeline input to an inner task, simply pass the variable name as you normally would when calling one function within another:

```python
@dsl.pipeline()
def my_pipeline(pipeline_var_x: int):
    task = identity(x=pipeline_var_x)
```

<!-- TODO(pipeline as task): add pipeline-level artifact input/output -->

### From a task output
Tasks provide references to their outputs in order to support passing data between tasks in a pipeline.

In nearly all cases, outputs are accessed via `.outputs['<parameter>']`, where `'<parameter>'` is the parameter name or named tuple field name from the task that produced the output which you wish to access. The `.outputs['<parameter>']` access pattern is used to access `Output[]` artifacts, `OutputPath` output parameters, and `NamedTuple` output parameters.

The only exception to this access pattern is when you wish to access a single return value from a lightweight Python component, which can be accessed through the task's `.output` attribute.

The following two subsections demonstrate this for parameters then artifacts.

#### Passing parameters from task to task

Let's introduce two more components for sake of demonstrating passing parameters between components:
```python
from typing import NamedTuple

@dsl.component
def named_tuple(an_id: int) -> NamedTuple('Outputs', [('name', str), ('id', int)]):
    """Lightweight Python component with a NamedTuple output."""
    from typing import NamedTuple
    outputs = NamedTuple('Outputs', [('name', str), ('id', int)])
    return outputs('my_dataset', an_id)

@dsl.container_component
def identity_container(integer: int, output_int: OutputPath(int)):
    """Container component that creates an integer output parameter."""
    return dsl.ContainerSpec(
        image='alpine',
        command=[
            'sh', '-c',
            'mkdir --parents $(dirname "$0") && echo "$1" > "$0"'
        ],
        args=[output_int, integer])
```

Using the new `named_tuple` and `identity_container` components with our original `identity` component, the following pipeline shows the full range of task-to-task data passing styles:

```python
@dsl.pipeline()
def my_pipeline(pipeline_parameter_id: int):
    named_tuple_task = named_tuple(an_id=pipeline_parameter_id)
    
    # access a named tuple parameter output via .outputs['<parameter>']
    identity_container_task = identity_container(integer=named_tuple_task.outputs['id'])
    
    # access an OutputPath parameter output via .outputs['<parameter>']
    identity_task_1 = identity(x=identity_container_task.outputs['output_int'])
    
    # access a lightweight component return value via .output
    identity_task_2 = identity(x=identity_task_1.output)
```

#### Passing artifacts from task to task
Artifacts may only be annotated via `Input[<ArtifactClass>]`/`Output[<ArtifactClass>]` annotations and may only be accessed via the `.outputs['<parameter>']` syntax. This makes passing them between tasks somewhat simpler than for parameters.

The pipeline below demonstrates passing an artifact between tasks using an artifact producer and an artifact consumer:

```python
from kfp import dsl
from kfp.dsl import Artifact, Input

@dsl.component
def producer(output_artifact: Output[Artifact]):
    with open(output_artifact, 'w') as f:
        f.write('my artifact')

@dsl.component
def consumer(input_artifact: Input[Artifact]):
    with open(input_artifact, 'r') as f:
        print(f.read())

@dsl.pipeline()
def my_pipeline():
    producer_task = producer()
    consumer(input_artifact=producer_task.outputs['output_artifact'])
```

## Special input values
There are a few special input values that may be used to access pipeline or task metadata within a component. These values can passed to input parameters typed with `str`. For example, the following `print_op` component can obtain the pipeline job name at component runtime by using the `dsl.PIPELINE_JOB_NAME_PLACEHOLDER`:

```python
from kfp dsl

@dsl.pipeline()
def my_pipeline():
    print_op(text=dsl.PIPELINE_JOB_NAME_PLACEHOLDER)
```

There several placeholders that may be used in this style, including:
* `dsl.PIPELINE_JOB_NAME_PLACEHOLDER`
* `dsl.PIPELINE_JOB_RESOURCE_NAME_PLACEHOLDER`
* `dsl.PIPELINE_JOB_ID_PLACEHOLDER`
* `dsl.PIPELINE_TASK_NAME_PLACEHOLDER`
* `dsl.PIPELINE_TASK_ID_PLACEHOLDER`


## Placeholders
In general, each of the three component authoring styles handle the injection of placeholders into your container `command` and `args`, allowing the component author to not have to worry about them. However, there are two types of placeholders you may wish to use directly: `ConcatPlaceholder` and `IfPresentPlaceholder`. These placeholders may only be used when authoring [container components][container-component] via the `@dsl.container_component` decorator.

### ConcatPlaceholder

When you provide a container `command` or container `args` as a list of strings, each element in the list is concatenated using a space separator, then issued to the container. Concatenating an one input to another string without a space separator requires special handling provided by the `ConcatPlaceholder`.

`ConcatPlaceholder` takes one argument, `items` which may be a list of any combination of static strings, parameter inputs, or other instances of `ConcatPlaceholder` or `IfPresentPlaceholder`. At runtime, these strings will be concatenated together without a separator.

For example, you can use `ConcatPlaceholder` to concatenate a file path prefix, suffix, and extension:

```python
from kfp import dsl

@dsl.container_component
def concatenator(prefix: str, suffix: str):
    return dsl.ContainerSpec(
        image='alpine',
        command=[
            'my_program.sh'
        ],
        args=['--input', dsl.ConcatPlaceholder([prefix, suffix, '.txt'])]
    )
```

### IfPresentPlaceholder
`IfPresentPlaceholder` is used to conditionally provide command line arguments. The `IfPresentPlaceholder` takes three arguments: `input_name`, `then`, and optionally `else_`. This placeholder is easiest to understand through an example:

```python
@dsl.container_component
def hello_someone(optional_name: str = None):
    return dsl.ContainerSpec(
        image='python:3.7',
        command=[
            'echo', 'hello',
            dsl.IfPresentPlaceholder(
                input_name='optional_name', then=[optional_name])
        ])
```

If the `hello_someone` component is passed `'world'` as an argument for `optional_name`, the component will print `hello world`. If not, it will only print `hello`.

The third parameter `else_` can be used to provide a default value to fall back to if `input_name` is not provided.

Arguments to `then` and `else_` may be a list of any combination of static strings, parameter inputs, or other instances of `ConcatPlaceholder` or `IfPresentPlaceholder`.

## Component interfaces and type checking
The KFP SDK compiler has the ability to use the type annotations you provide to type check your pipeline definition for mismatches between input and output types. The type checking logic is simple yet handy, particularly for complex pipelines. The type checking logic is:

* Parameter outputs may only be passed to parameter inputs. Artifact outputs may only be passed to artifact inputs.
* A parameter output type (`int`, `str`, etc.) must match the annotation of the parameter input to which it is passed.
* An artifact output type (`Dataset`, `Model`, etc.) must match the artifact input type to which it is passed _or_ either of the two artifact annotations must use the generic KFP `Artifact` class.


[components]: /docs/components/pipelines/author-a-pipeline/components.md
[pipelines]: /docs/components/pipelines/author-a-pipeline/pipelines
[lightweight-python-component]: /
[container-component]: /
[containerized-python-component]: /
[containerized-python-component]: /
[minio]: https://min.io/
[gcs]: https://cloud.google.com/storage
[aws-s3]: https://aws.amazon.com/s3/
[importer-component]: /
[artifacts]: /docs/components/pipelines/author-a-pipeline/artifacts