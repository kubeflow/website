+++
title = "Compile a Pipeline"
description = "Compile pipelines and components to YAML"
weight = 7
+++

{{% kfp-v2-keywords %}}

To submit a pipeline for execution, you must compile it to YAML with the KFP SDK compiler:

```python
from kfp import dsl
from kfp import compiler

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

In this example, the compiler creates a file called `pipeline.yaml`, which contains a hermetic representation of your pipeline. The output is called intermediate representation (IR) YAML. You can view an example of IR YAML on [GitHub][compiled-output-example]. The contents of the file is the serialized [`PipelineSpec`][pipeline-spec] protocol buffer message and is not intended to be human-readable.

You can find human-readable information about the pipeline in the comments at the top of the compiled YAML:

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

You can also compile components, as opposed to pipelines, to IR YAML:

```python
@dsl.component
def comp(message: str) -> str:
    print(message)
    return message

compiler.Compiler().compile(comp, package_path='component.yaml')
```

## Compiler arguments

The [`Compiler.compile`][compiler-compile] method accepts the following arguments:

| Name | Type | Description |
|------|------|-------------|
| `pipeline_func` | `function` | _Required_<br/>Pipeline function constructed with the `@dsl.pipeline` or component constructed with the @dsl.component decorator.
| `package_path` | `string` | _Required_<br/>Output YAML file path. For example, `~/my_pipeline.yaml` or `~/my_component.yaml`.
| `pipeline_name` | `string` | _Optional_<br/>If specified, sets the name of the pipeline template in the `pipelineInfo.name` field in the compiled IR YAML output. Overrides the name of the pipeline or component specified by the `name` parameter in the `@dsl.pipeline` decorator.
| `pipeline_parameters` | `Dict[str, Any]` | _Optional_<br/>Map of parameter names to argument values. This lets you provide default values for pipeline or component parameters. You can override these default values during pipeline submission.
| `type_check` | `bool` | _Optional_<br/>Indicates whether static type checking is enabled during compilation.<br/>

## Type checking

By default, the DSL compiler statically type checks your pipeline to ensure type consistency between components that pass data between one another. Static type checking helps identify component I/O inconsistencies without having to run the pipeline, shortening development iterations.

Specifically, the type checker checks for type equality between the type of data a component input expects and the type of the data provided. See [Data Types][data-types] for more information about KFP data types.

For example, for parameters, a list input may only be passed to parameters with a `typing.List` annotation. Similarly, a float may only be passed to parameters with a `float` annotation.

Input data types and annotations must also match for artifacts, with one exception: the `Artifact` type is compatible with all other artifact types. In this sense, the `Artifact` type is both the default artifact type and an artifact "any" type.

As described in the following section, you can disable type checking.

## IR YAML

The IR YAML is an intermediate representation of a compiled pipeline or component. It is an instance of the [`PipelineSpec`][pipeline-spec] protocol buffer message type, which is a platform-agnostic pipeline representation protocol. It is considered an intermediate representation because the KFP backend compiles `PipelineSpec` to [Argo Workflow][argo-workflow] YAML as the final pipeline definition for execution.

Unlike the v1 component YAML, the IR YAML is not intended to be written directly.

While IR YAML is not intended to be easily human readable, you can still inspect it if you know a bit about its contents:

| Section | Description | Example |
|-------|-------------|---------|
| [`components`][components-schema] | This section is a map of the names of all components used in the pipeline to [`ComponentSpec`][component-spec]. `ComponentSpec` defines the interface, including inputs and outputs, of a component.<br/>For primitive components, `ComponentSpec` contains a reference to the executor containing the component implementation.<br/><br/>For pipelines used as components, `ComponentSpec` contains a [DagSpec][dag-spec] instance, which includes references to the underlying primitive components. | [View on Github][components-example]
| [`deployment_spec`][deployment-spec-schema] | This section contains a map of executor name to [`ExecutorSpec`][executor-spec]. `ExecutorSpec` contains the implementation for a primitive component. | [View on Github][deployment-spec-example]
| [`root`][root-schema] | This section defines the steps of the outermost pipeline definition, also called the pipeline root definition. The root definition is the workflow executed when you submit the IR YAML. It is an instance of [`ComponentSpec`][component-spec]. | [View on Github][root-example]
| [`pipeline_info`][pipeline-info-schema] <a id="kfp_iryaml_pipelineinfo"></a> | This section contains pipeline metadata, including the `pipelineInfo.name` field. This field contains the name of your pipeline template. When you upload your pipeline, a pipeline context name is created based on this template name. The pipeline context lets the backend and the dashboard associate artifacts and executions from pipeline runs using the pipeline template. You can use a pipeline context to determine the best model by comparing metrics and artifacts from multiple pipeline runs based on the same training pipeline. | [View on Github][pipeline-info-example]
| [`sdk_version`][sdk-version-schema] | This section records the version of the KFP SDK used to compile the pipeline. | [View on Github][sdk-version-example]
| [`schema_version`][schema-version-schema] | This section records the version of the `PipelineSpec` schema used for the IR YAML. | [View on Github][schema-version-example]
| [`default_pipeline_root`][default-pipeline-root-schema] | This section records the remote storage root path, such as a MinIO URI or Google Cloud Storage URI, where the pipeline output is written. | [View on Github][default-pipeline-root-example]

[pipeline-spec]: https://github.com/kubeflow/pipelines/blob/master/api/v2alpha1/pipeline_spec.proto#L50
[argo-workflow]: https://argoproj.github.io/argo-workflows/
[compiled-output-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml
[components-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L1-L21
[deployment-spec-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L23-L49
[root-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L52-L85
[pipeline-info-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L50-L51
[sdk-version-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L87
[schema-version-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L86
[default-pipeline-root-example]: https://github.com/kubeflow/pipelines/blob/984d8a039d2ff105ca6b21ab26be057b9552b51d/sdk/python/test_data/pipelines/two_step_pipeline.yaml#L22
[components-schema]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L74-L75
[deployment-spec-schema]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L56
[root-schema]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L77-L79
[pipeline-info-schema]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L51-L52
[sdk-version-schema]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L58-L59
[schema-version-schema]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L61-L62
[default-pipeline-root-schema]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L81-L82
[component-spec]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L85-L96
[executor-spec]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L788-L803
[dag-spec]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L98-L105
[data-types]: /docs/components/pipelines/v2/data-types
[compiler-compile]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/compiler.html#kfp.compiler.Compiler.compile
