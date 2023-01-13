+++
title = "Compile a Pipeline"
description = "Compile a pipeline definition to YAML"
weight = 5
+++

You can compile your pipeline or component to intermediate representation (IR) YAML.  The IR YAML definition preserves a static representation of the pipeline or component. You can submit the YAML definition to the KFP backend for execution, or deserialize it using the KFP SDK for integration into another pipeline.
([View an example on GitHub][compiled-output-example]).

**Note:** Pipelines as well as components are authored in Python. A pipeline is a template representing a multistep workflow, whereas a component is a template representing a single step workflow.

## Compile a pipeline

You can compile a pipeline or a template into IR YAML using the `Compiler.compile` method. To do this, follow these steps:

1.  Define a simple pipeline:

    ```python
    from kfp import compiler
    from kfp import dsl

    @dsl.component
    def addition_component(num1: int, num2: int) -> int:
      return num1 + num2

    @dsl.pipeline(name='addition-pipeline')
    def my_pipeline(a: int, b: int, c: int = 10):
      add_task_1 = addition_component(num1=a, num2=b)
      add_task_2 = addition_component(num1=add_task_1.output, num2=c)
    ```

1.  Compile the pipeline to the file `my_pipeline.yaml`:

    ```python
    cmplr = compiler.Compiler()
    cmplr.compile(my_pipeline, package_path='my_pipeline.yaml')
    ```

1.  Compile the component `addition_component` to the file `addition_component.yaml`:

    ```python
    cmplr.compile(addition_component, package_path='addition_component.yaml')
    ```

<!-- TODO: Replace <br> with MD line breaks -->

The `Compiler.compile` method accepts the following parameters:

| Name | Type | Description |
|------|------|-------------|
| `pipeline_func` | `function` | _Required_<br/>Pipeline function constructed with the @dsl.pipeline or component constructed with the @dsl.component decorator.
| `package_path` | `string` | _Required_<br/>Output YAML file path. For example, `~/my_pipeline.yaml` or `~/my_component.yaml`.
| `pipeline_name` | `string` | _Optional_<br/>If specified, sets the name of the pipeline template in the `pipelineInfo.name` field in the compiled IR YAML output. Overrides the name of the pipeline or component specified by the `name` parameter in the `@dsl.pipeline` decorator.
| `pipeline_parameters` | `Dict[str, Any]` | _Optional_<br/>Map of parameter names to argument values. This lets you provide default values for pipeline or component parameters. You can override these default values during pipeline submission.
| `type_check` | `bool` | _Optional_<br/>Indicates whether static type checking is enabled during compilation.<br/>For more information about type checking, see [Component I/O: Component interfaces and type checking][type-checking].

## IR YAML

The IR YAML is an intermediate representation of a compiled pipeline or component. It is an instance of the [`PipelineSpec`][pipeline-spec] protocol buffer message type, which is a platform-agnostic pipeline representation protocol. It is considered an intermediate representation because the KFP backend compiles `PipelineSpec` to [Argo Workflow][argo-workflow] YAML as the final pipeline definition for execution.

Unlike the v1 component YAML, the IR YAML is not intended to be written directly. To learn how to author pipelines and components in KFP v2 similar to authoring component YAML in KFP v1, see [Author a Pipeline: Custom Container Components][custom-container-component-authoring].

The compiled IR YAML file contains the following sections:

| Section | Description | Example |
|-------|-------------|---------|
| [`components`][components-schema] | This section is a map of the names of all components used in the pipeline to [`ComponentSpec`][component-spec]. `ComponentSpec` defines the interface, including inputs and outputs, of a component.<br/>For primitive components, `ComponentSpec` contains a reference to the executor containing the component implementation.<br/>For pipelines used as components, `ComponentSpec` contains a [DagSpec][dag-spec] instance, which includes references to the underlying primitive components. | [View on Github][components-example]
| [`deployment_spec`][deployment-spec-schema] | This section contains a map of executor name to [`ExecutorSpec`][executor-spec]. `ExecutorSpec` contains the implementation for a primitive component. | [View on Github][deployment-spec-example]
| [`root`][root-schema] | This section defines the steps of the outermost pipeline definition, also called the pipeline root definition. The root definition is the workflow executed when you submit the IR YAML. It is an instance of [`ComponentSpec`][component-spec]. | [View on Github][root-example]
| [`pipeline_info`][pipeline-info-schema] <a id="kfp_iryaml_pipelineinfo"></a> | This section contains pipeline metadata, including the `pipelineInfo.name` field. This field contains the name of your pipeline template. When you upload your pipeline, a pipeline context name is created based on this template name. The pipeline context lets the backend and the dashboard associate artifacts and executions from pipeline runs using the pipeline template. You can use a pipeline context to determine the best model by comparing metrics and artifacts from multiple pipeline runs based on the same training pipeline. | [View on Github][pipeline-info-example]  
| [`sdk_version`][sdk-version-schema] | This section records the version of the KFP SDK used to compile the pipeline. | [View on Github][sdk-version-example]
| [`schema_version`][schema-version-schema] | This section records the version of the `PipelineSpec` schema used for the IR YAML. | [View on Github][schema-version-example]
| [`default_pipeline_root`][default-pipeline-root-schema] | This section records the remote storage root path, such as a MiniIO URI or Google Cloud Storage URI, where the pipeline output is written. | [View on Github][default-pipeline-root-example]  


[pipeline-spec]: https://github.com/kubeflow/pipelines/blob/41b69fd90da812005965f2209b64fd1278f1cdc9/api/v2alpha1/pipeline_spec.proto#L50
[argo-workflow]: https://argoproj.github.io/argo-workflows/
[custom-container-component-authoring]: /docs/components/pipelines/v2/author-a-pipeline/components/#3-custom-container-components
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
[type-checking]: /docs/components/pipelines/v2/author-a-pipeline/component-io#component-interfaces-and-type-checking
