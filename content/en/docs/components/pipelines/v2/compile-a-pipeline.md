+++
title = "Compile a Pipeline"
description = "Compile a pipeline definition to YAML"
weight = 5
+++

While pipelines and components are authored in Python, they can be compiled to intermediate representation (IR) YAML ([example][compiled-output-example]).

A YAML pipeline/component definition preserves a static representation of your pipeline/component. This YAML can be submitted to the KFP backend for execution or deserialized by the KFP SDK for integration into another pipeline.

## Compiling
First let's define a very simple pipeline:

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

Now we can compile the pipeline to the file `my_pipeline.yaml`:

```python
cmplr = compiler.Compiler()
cmplr.compile(my_pipeline, package_path='my_pipeline.yaml')
```

Just as a pipeline is a template for a multi-step workflow, a component is a template for a single-step workflow. We can also compile the component `addition_component` directly:

```python
cmplr.compile(addition_component, package_path='addition_component.yaml')
```

The `Compiler.compile` method accepts a few optional additional parameters:

**`pipeline_name`** (`string`)

Sets the name of the pipeline (or component). This is written to IR as the  `pipelineInfo.name` field. Will override the `name` passed to the `@dsl.pipeline` decorator.

The pipeline name, whether set through the decorator or the compiler, names your pipeline template. When you upload your pipeline, a pipeline context by this name will be created. The pipeline context enables the backend and the Dashboard to associate artifacts and executions created from runs of the same pipeline template. This allows you, for example, to compare metrics artifacts from multiple runs of the same training pipeline to find the best model.

**`pipeline_parameters`** (`Dict[str, Any]`)

A map of parameter names to argument values. This amounts to providing default values for pipeline or component parameters. These defaults can be overriden at pipeline submission time.

**`type_check`** (`bool`)

Whether to enable static type checking during compilation. For more information about type checking, see [Component I/O: Component interfaces and type checking][type-checking].

## IR YAML
When you compile a pipeline it is written to intermediate representation (IR) YAML. An IR YAML is an instance of the [`PipelineSpec`][pipeline-spec] protocol buffer message type, a platform-agnostic pipeline representation protocol.

IR YAML is considered an intermediate representation because the KFP backend compiles `PipelineSpec` to [Argo Workflow][argo-workflow] YAML as the final execution definition for execution on Kubernetes.

Unlike v1 component YAML, IR YAML is not intended to be written directly. For a KFP v2 authoring experience similar to the v1 component YAML authoring experience, see [Author a Pipeline: Custom Container Components][custom-container-component-authoring].

IR YAML contains 7 top-level fields:

**components**

The [`components`][components-schema] section is a map of component name to [`ComponentSpec`][component-spec] for all components used in the pipeline. `ComponentSpec` defines the interface (inputs and outputs) of a component. For primitive components, `ComponentSpec` contains a reference to the executor containing the component implementation. For pipelines used as components, `ComponentSpec` contains a [DagSpec][dag-spec] which includes references to its underlying primitive components.

[Example][components-example]

**deployment_spec**

The [`deployment_spec`][deployment-spec-schema] section contains a map of executor name to [`ExecutorSpec`][executor-spec]. `ExecutorSpec` contains the implementation for a primitive component.

[Example][deployment-spec-example]

**root**  
[`root`][root-schema] defines the steps of the outermost (root) pipeline definition. It is itself a [`ComponentSpec`][component-spec]. This is the pipeline executed when the YAML is submitted.

[Example][root-example]

**pipeline_info**  
[`pipeline_info`][pipeline-info-schema] contains pipeline metadata, including the pipeline name.

[Example][pipeline-info-example]  

**sdk_version**  
[`sdk_version`][sdk-version-schema] records which version of the KFP SDK compiled the pipeline.

[Example][sdk-version-example]  

**schema_version**  
[`schema_version`][schema-version-schema] records which version of the `PipelineSpec` schema is used for the IR YAML.

[Example][schema-version-example]

**default_pipeline_root**  
[`default_pipeline_root`][default-pipeline-root-schema] is the remote storage root path where the pipeline outputs will be written, such as a Google Cloud Storage URI (`gcs://my/path`).

[Example][default-pipeline-root-example]  


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