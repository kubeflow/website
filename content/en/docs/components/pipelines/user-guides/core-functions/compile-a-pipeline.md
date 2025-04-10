+++
title = "Compile a Pipeline"
description = "Define and compile a basic pipeline using the KFP SDK."
weight = 101
+++

{{% kfp-v2-keywords %}}

## Overview

To [submit a pipeline for execution](/docs/components/pipelines/user-guides/core-functions/run-a-pipeline/), you must compile it to YAML with the KFP SDK compiler.

In the following example, the compiler creates a file called `pipeline.yaml`, which contains a hermetic representation of your pipeline.
The output is called an [Intermediate Representation (IR) YAML][ir-yaml], which is a serialized [`PipelineSpec`][pipeline-spec] protocol buffer message.

```python
from kfp import compiler, dsl

@dsl.component
def comp(message: str) -> str:
    print(message)
    return message

@dsl.pipeline
def my_pipeline(message: str) -> str:
    """My ML pipeline."""
    return comp(message=message).output

compiler.Compiler().compile(my_pipeline, package_path='pipeline.yaml')
```

Because components are actually pipelines, you may also compile them to IR YAML:

```python
@dsl.component
def comp(message: str) -> str:
    print(message)
    return message

compiler.Compiler().compile(comp, package_path='component.yaml')
```

You can view an [example of IR YAML][compiled-output-example] on GitHub. 
The contents of the file are not intended to be human-readable, however the comments at the top of the file provide a summary of the pipeline:

```yaml
# PIPELINE DEFINITION
# Name: my-pipeline
# Description: My ML pipeline.
# Inputs:
#    message: str
# Outputs:
#    Output: str
...
```

## Type checking

By default, the DSL compiler statically type checks your pipeline to ensure type consistency between components that pass data between one another. 
Static type checking helps identify component I/O inconsistencies without having to run the pipeline, shortening development iterations.

Specifically, the type checker checks for type equality between the type of data a component input expects and the type of the data provided. 
See [Data Types][data-types] for more information about KFP data types.

For example, for parameters, a list input may only be passed to parameters with a `typing.List` annotation. 
Similarly, a float may only be passed to parameters with a `float` annotation.

Input data types and annotations must also match for artifacts, with one exception: the `Artifact` type is compatible with all other artifact types. 
In this sense, the `Artifact` type is both the default artifact type and an artifact "any" type.

As described in the following section, you can disable type checking.

## Compiler arguments

The [`Compiler.compile`][compiler-compile] method accepts the following arguments:

| Name | Type | Description |
|------|------|-------------|
| `pipeline_func` | `function` | _Required_<br/>Pipeline function constructed with the `@dsl.pipeline` or component constructed with the @dsl.component decorator.
| `package_path` | `string` | _Required_<br/>Output YAML file path. For example, `~/my_pipeline.yaml` or `~/my_component.yaml`.
| `pipeline_name` | `string` | _Optional_<br/>If specified, sets the name of the pipeline template in the `pipelineInfo.name` field in the compiled IR YAML output. Overrides the name of the pipeline or component specified by the `name` parameter in the `@dsl.pipeline` decorator.
| `pipeline_parameters` | `Dict[str, Any]` | _Optional_<br/>Map of parameter names to argument values. This lets you provide default values for pipeline or component parameters. You can override these default values during pipeline submission.
| `type_check` | `bool` | _Optional_<br/>Indicates whether static type checking is enabled during compilation.<br/>


[pipeline-spec]: https://github.com/kubeflow/pipelines/blob/master/api/v2alpha1/pipeline_spec.proto#L50
[ir-yaml]: /docs/components/pipelines/concepts/ir-yaml
[compiled-output-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml
[components-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L1-L21
[data-types]: /docs/components/pipelines/user-guides/data-handling/data-types
[compiler-compile]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/compiler.html#kfp.compiler.Compiler.compile
