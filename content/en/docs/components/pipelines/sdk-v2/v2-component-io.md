+++
title = "Kubeflow Pipelines v2 Component I/O"
description = "Differences between artifacts and parameters, and how to migrate an existing pipeline to be v2 compatible."
weight = 20
+++

{{% beta-status
  feedbacklink="https://github.com/kubeflow/pipelines/issues" %}}

## Artifacts and Parameters

The Kubeflow Pipelines SDK v2 makes a distinction between inputs and outputs that are _parameters_ and those that are _artifacts_.

* Parameters represent values.
  They are inputs or outputs of type `str`, `int`, `float`, `bool`, `dict`, or `list` that typically are used to change the behavior of a pipeline. 
  Parameters are stored in ML Metadata, thus you can query ML Metadata for the values of parameters.
  Input parameters are always passed by value, which means that they are inserted into the command used to execute the component. 

* Artifacts represent references to objects--most commonly files--that are produced during pipeline executions.
  Examples of artifacts include `Model`, `Datasets`, `Metrics`, and so on.
  Regardless of the types of artifacts, all artifacts have a `name`, a `uri`, and optionally some `metadata`.
  Most commonly, the `uri` of an artifact is a cloud storage URI such as a Google Cloud Storage URI, or an Amazon Web Services S3 URI. 
  The `name`, `uri`, and `metadata` of artifacts are stored in ML Metadata, but not the contents referenced by the `uri`.
  Input artifacts are always passed by reference, i.e. the `uri` of an artifact or a JSON object containing the `name`, `uri`, and `metadata` of an artifact.

Whether an input/output is a parameter or an artifact is decided by its type annotation. Inputs/outputs typed as `str`, `int`, `float`, `bool`, `dict`, or `list` are parameters, while everything else are artifacts. Kubeflow Pipelines SDK v2 defines a list of system artifact types including `Model`, `Dataset`, `Metrics`, `ClassificationMetrics`, `SlicedClassificationMetrics`, `HTML`, `Markdown`, and the generic `Artifact`. All unknown types including non-type are treated the same as the generic `Artifact` type.

Artifacts and parameters cannot be passed to each other. By default, when compiling a pipeline with option `type_check=True`, only inputs and outputs with the exact same type can be connected together with the exception that the generic `Artifact` type is compatible with any artifact types.

## Migrating from v1 components

### Review and update inputs/outputs types.

In Kubeflow Pipelines SDK v1, type annotations for inputs/outputs are optional, and when there is no type annotation on an input/output, it is treated as compatible with any type, hence the input/output can be connected to any outputs/inputs regardless of their types. This is no longer the case in v2. 
As mentioned above, type annotation in v2 is the sole decision factor on whether an input/output is an artifact or a parameter. Component authors should first decide the category for each input/output, and then explicitly type annotate them accordingly.

### Review and update inputs/outputs placeholders if applicable.

For components defined via YAML, inputs/outputs are referenced by placeholders in the container command line arguments. 

In Kubeflow Pipelines SDK v1, there are three types of input/output placeholders:

*   `{inputValue: <input-name>}`:
    This placeholder is replaced with the value of the specified input.
    This is useful for small pieces of input data, such as numbers or small
    strings.

*   `{inputPath: <input-name>}`:
    This placeholder is replaced with the path to this input as a file.
    Your component can read the contents of that input at that path during
    the pipeline run.

*   `{outputPath: <output-name>}`:
    This placeholder is replaced with the path where your program writes
    this output's data. This lets the Kubeflow Pipelines system read the
    contents of the file and store it as the value of the specified output.

In Kubeflow Pipelines SDK v2, we introduced two additional input/output placeholders:

*   `{inputUri: <input-name>}`:
    This placeholder is replaced with the URI to this input. In case the
    URI is a cloud storage URI, Your component can read the contents of
    that input through the corresponding cloud storage client during the
    pipeline run.

*   `{outputUri: <output-name>}`:
    This placeholder is replaced with URI where your program writes this
    output's data. This lets the Kubeflow Pipelines system read the contents
    of the file and store it as the value of the specified output.

For the five input/output placeholders, there are rules on which placeholders are valid for artifacts and which are valid for parameters. Specifically,

*  Placeholders for parameters

   * For input parameters, the valid placeholder is `{inputValue: <input-name>}`.

   * For output parameters, the valid placeholder is `{outputPath: <output-name>}`.

*  Placeholders for artifacts

   * For input artifacts, the valid placeholders are `{inputPath: <input-name>}`
   and `{inputUri: <input-name>}`.

   * For output artifacts, the only valid placeholders are `{outputPath: <output-name>}`
   and `{outputUri: <output-name>}`.

Misuse of input/output placeholders results in compilation errors. When there is a type-placeholder mismatch error, most often it is due to the input/output is mis-typed. You should review if the input/output
is meant to be a parameter or an artifact and type it accordingly. In case when the type is intended, you need to update the placeholder for the input/output. Changing input/output placeholders often requires
updating the code of the component as well. For instance, changing from `{inputValue: <input-name>}` to `{inputPath: <input_name>}` means your component code will not receive the actual value of the input but a file path where the value is in the file. In this case, a file read logic should be added to the component code.

### Use v2 `@component` decorator for Python function-based components.

For Python function-based components created via `create_component_from_func` or `func_to_container_op`, we recommend migrating to using the new `@component` decorator available from `kfp.v2.dsl` package.

```python
from kfp.v2.dsl import component, Input, Output, OutputPath, Dataset, Model

@component
def train(
    # Use Input[T] to get a metadata-rich handle to the input artifact of type `Dataset`.
    dataset: Input[Dataset],
    # Use Output[T] to get a metadata-rich handle to the output artifact of type `Dataset`.
    model: Output[Model],
    # An input parameter of type int.
    num_steps: int,
    # An output parameter of type str.
    output_message_path: OutputPath(str),
):
    """Dummy Training step."""

    with open(dataset.path, 'r') as input_file:
        dataset_contents = input_file.read()

    with open(model.path, 'w') as output_file:
        for i in range(num_steps):
            output_file.write('Step {}\n{}\n=====\n'.format(i, line))

    # Model artifact has a `.metadata` dictionary
    # to store arbitrary metadata for the output artifact.
    model.metadata['accuracy'] = 0.9

    with open(output_message_path, 'w') as output_file:
        output_file.write('Model trained successfully.')
```

Using v2 `@component` decorator, input and output artifacts should be annotated with `Input[T]` and `Output[T]`, respectively. And `T` is the class [`Artifact`](https://github.com/kubeflow/pipelines/blob/7875b68654a69ca761cb0ba4a920a30925a0e94b/sdk/python/kfp/v2/components/types/artifact_types.py#L27) or a subclass of it. You can access the properties and methods defined for the specific artifact class, such as `dataset.path` or `model.metadata` as shown in the above example.

Note that `Input[T]` and `Output[T]` should not be applied on input/output parameters. Input parameters need to be type annotated using one of the parameter types mentioned earlier. Output parameters should be type annotated with `OutputPath(T)` or via the function return type, just like how it can be specified in v1 lightweight function components.

