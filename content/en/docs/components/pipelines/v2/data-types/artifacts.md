+++
title = "Artifacts"
description = "Create, use, pass, and track ML artifacts"
weight = 2
+++

{{% kfp-v2-keywords %}}

Most machine learning pipelines aim to create one or more machine learning artifacts, such as a model, dataset, evaluation metrics, etc.

KFP provides first-class support for creating machine learning artifacts via the [`dsl.Artifact`][dsl-artifact] class and other artifact subclasses. KFP maps these artifacts to their underlying [ML Metadata][ml-metadata] schema title, the canonical name for the artifact type.

In general, artifacts and their associated annotations serve several purposes:
* To provide logical groupings of component/pipeline input/output types
* To provide a convenient mechanism for writing to object storage via the task's local filesystem
* To enable [type checking][type-checking] of pipelines that create ML artifacts
* To make the contents of some artifact types easily observable via special UI rendering

The following `training_component` demonstrates standard usage of both input and output artifacts:

```python
from kfp.dsl import Input, Output, Dataset, Model

@dsl.component
def training_component(dataset: Input[Dataset], model: Output[Model]):
    """Trains an output Model on an input Dataset."""
    with open(dataset.path) as f:
        contents = f.read()

    # ... train tf_model model on contents of dataset ...

    tf_model.save(model.path)
    tf_model.metadata['framework'] = 'tensorflow'
```

This `training_component` does the following:
1. Accepts an input dataset
2. Reads the input dataset's content from the local filesystem
3. Trains a model (omitted)
4. Saves the model as a component output
5. Sets some metadata about the saved model

As illustrated by `training_component`, artifacts are simply a thin wrapper around some artifact properties, including the `.path` from which the artifact can be read/written and the artifact's `.metadata`. The following sections describe these properties and other aspects of artifacts in detail.

### Artifact types

The artifact annotation indicates the type of the artifact. KFP provides several artifact types within the DSL:

| DSL object                    | Artifact schema title              |
| ----------------------------- | ---------------------------------- |
| [`Artifact`][dsl-artifact]                    | system.Artifact                    |
| [`Dataset`][dsl-dataset]                     | system.Dataset                     |
| [`Model`][dsl-model]                       | system.Model                       |
| [`Metrics`][dsl-metrics]                     | system.Metrics                     |
| [`ClassificationMetrics`][dsl-classificationmetrics]       | system.ClassificationMetrics       |
| [`SlicedClassificationMetrics`][dsl-slicedclassificationmetrics] | system.SlicedClassificationMetrics |
| [`HTML`][dsl-html]                        | system.HTML                        |
| [`Markdown`][dsl-markdown]                    | system.Markdown                    |


`Artifact`, `Dataset`, `Model`, and `Metrics` are the most generic and commonly used artifact types. `Artifact` is the default artifact base type and should be used in cases where the artifact type does not fit neatly into another artifact category. `Artifact` is also compatible with all other artifact types. In this sense, the `Artifact` type is also an artifact "any" type.

On the [KFP open source][oss-be] UI, `ClassificationMetrics`, `SlicedClassificationMetrics`, `HTML`, and `Markdown` provide special UI rendering to make the contents of the artifact easily observable.

<!-- TODO: describe strongly-typed schemas -->

### Declaring Input/Output artifacts

In _components_, an artifact annotation must always be wrapped in an `Input` or `Output` type marker to indicate the artifact's I/O type. This is required, as it would otherwise be ambiguous whether an artifact is an input or output since input and output artifacts are both declared via Python function parameters.

In _pipelines_, input artifact annotations should be wrapped in an `Input` type marker and, unlike in components, output artifacts should be provided as a return annotation as shown in `concat_pipeline`'s `Dataset` output:

```python
from kfp import dsl
from kfp.dsl import Dataset, Input, Output

@dsl.component
def concat_component(
    dataset1: Input[Dataset],
    dataset2: Input[Dataset],
    out_dataset: Output[Dataset],
):
    with open(dataset1.path) as f:
        contents1 = f.read()
    with open(dataset2.path) as f:
        contents2 = f.read()
    with open(out_dataset.path, 'w') as f:
        f.write(contents1 + contents2)

@dsl.pipeline
def concat_pipeline(
    d1: Input[Dataset],
    d2: Input[Dataset],
) -> Dataset:
    return concat_component(
        dataset1=d1,
        dataset2=d2
    ).output['out_dataset']
```

You can specify multiple pipeline artifact outputs, just as you would for parameters. This is shown by `concat_pipeline2`'s outputs `intermediate_dataset` and `final_dataset`:

```python
from typing import NamedTuple
from kfp import dsl
from kfp.dsl import Dataset, Input

@dsl.pipeline
def concat_pipeline2(
    d1: Input[Dataset],
    d2: Input[Dataset],
    d3: Input[Dataset],
) -> NamedTuple('Outputs',
                intermediate_dataset=Dataset,
                final_dataset=Dataset):
    Outputs = NamedTuple('Outputs',
                         intermediate_dataset=Dataset,
                         final_dataset=Dataset)
    concat1 = concat_component(
        dataset1=d1,
        dataset2=d2
    )
    concat2 = concat_component(
        dataset1=concat1.outputs['out_dataset'],
        dataset2=d3
    )
    return Outputs(intermediate_dataset=concat1.outputs['out_dataset'],
                   final_dataset=concat2.outputs['out_dataset'])
```

The [KFP SDK compiler][compiler] will type check artifact usage according to the rules described in [Type Checking][type-checking].

### Using output artifacts

When you use an input or output annotation in a component, your component effectively makes a request at runtime for a URI path to the artifact.

For output artifacts, the artifact being created does not yet exist (your component is going to create it!). To make it easy for components to create artifacts, the KFP backend provides a unique system-generated URI where the component should write the output artifact. For both input and output artifacts, the URI is a path within the cloud object storage bucket specified as the pipeline root. The URI uniquely identifies the output by its name, producer task, and pipeline. The system-generated URI is accessible as an attribute on the `.uri` attribute of the artifact instance automatically passed to the component at runtime:

<!-- TODO: need to document pipeline_root and link here -->

```python
from kfp import dsl
from kfp.dsl import Model
from kfp.dsl import Output

@dsl.component
def print_artifact(model: Output[Model]):
    print('URI:', model.uri)
```

Note that you will never pass an output artifact to a component directly when composing your pipeline. For example, in `concat_pipeline2` above, we do not pass `out_dataset` to the `concat_component`. The output artifact will be passed to the component automatically with the correct system-generated URI at runtime.

While you can write output artifacts directly to the URI, KFP provides an even easier mechanism via the artifact's `.path` attribute:

```python
from kfp import dsl
from kfp.dsl import Model
from kfp.dsl import Output

@dsl.component
def print_and_create_artifact(model: Output[Model]):
    print('path:', model.path)
    with open(model.path, 'w') as f:
        f.write('my model!')
```

After the task executes, KFP handles copying the file at `.path` to the URI at `.uri` automatically, allowing you to create artifact files by only interacting with the local filesystem. This approach works when the output artifact is stored as a file or directory.

For cases where the output artifact is not easily represented by a file (for example, the output is a container image containing a model), you should override the system-generated `.uri` by setting it on the artifact directly, then write the output to that location. KFP will store the updated URI in ML Metadata. The artifact's `.path` attribute will not be useful.

### Using input artifacts

For input artifacts, the artifact URI already exists since the artifact has already been created. KFP handles passing the correct URI to your component based on the data exchange established in your pipeline. As for output artifacts, KFP handles copying the existing file at `.uri` to the path at `.path` so that your component can read it from the local filesystem.

Input artifacts should be treated as immutable. You should not try to modify the contents of the file at `.path` and any changes to `.metadata` will not affect the artifact's metadata in [ML Metadata][ml-metadata].

### Artifact name and metadata

In addition to `.uri` and `.path`, artifacts also have a `.name` and `.metadata`.


```python
from kfp import dsl
from kfp.dsl import Dataset
from kfp.dsl import Input

@dsl.component
def count_rows(dataset: Input[Dataset]) -> int:
    with open(dataset.path) as f:
        lines = f.readlines()
    
    print('Information about the artifact:')
    print('Name:', dataset.name)
    print('URI:', dataset.uri)
    print('Path:', dataset.path)
    print('Metadata:', dataset.metadata)
    
    return len(lines)
```

In KFP artifacts can have metadata, which can be accessed in a component via the artifact's `.metadata` attribute. Metadata is useful for recording information about the artifact such as which ML framework generated the artifact, what its downstream uses are, etc. For output artifacts, metadata can be set directly on the `.metadata` dictionary, as shown for `model` in the preceding `training_component`.


[ml-metadata]: https://github.com/google/ml-metadata
[compiler]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/compiler.html#kfp.compiler.Compiler
[dsl-artifact]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Artifact
[dsl-dataset]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Dataset
[dsl-model]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Model
[dsl-metrics]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Metrics
[dsl-classificationmetrics]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.ClassificationMetrics
[dsl-slicedclassificationmetrics]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.SlicedClassificationMetrics
[dsl-html]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.HTML
[dsl-markdown]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Markdown
[type-checking]: /docs/components/pipelines/v2/compile-a-pipeline#type-checking
[oss-be]: /docs/components/pipelines/v2/installation/
