+++
title = "Create, use, pass, and track ML artifacts"
weight = 3
+++

{{% kfp-v2-keywords %}}

Most machine learning pipelines aim to create one or more machine learning artifacts, such as a model, dataset, evaluation metrics, etc.

KFP provides first-class support for creating machine learning artifacts via the [`dsl.Artifact`][dsl-artifact] class and other artifact subclasses. KFP maps these artifacts to their underlying [ML Metadata][ml-metadata] schema title, the canonical name for the artifact type.

In general, artifacts and their associated annotations serve several purposes:
* To provide logical groupings of component/pipeline input/output types
* To provide a convenient mechanism for writing to object storage via the task's local filesystem
* To enable [type checking][type-checking] of pipelines that create ML artifacts
* To make the contents of some artifact types easily observable via special UI rendering

The following `training_component` demonstrates usage of both input and output artifacts using the [traditional artifact syntax][traditional-artifact-syntax]:

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
1. Accepts an input dataset and declares an output model
2. Reads the input dataset's content from the local filesystem
3. Trains a model (omitted)
4. Saves the model as a component output
5. Sets some metadata about the saved model

As illustrated by `training_component`, artifacts are simply a thin wrapper around some artifact properties, including the `.path` from which the artifact can be read/written and the artifact's `.metadata`. The following sections describe these properties and other aspects of artifacts in detail.

### Artifact properties

To use create and consume artifacts from components, you'll use the available properties on [artifact instances](#artifact-types). Artifacts feature four properties:  
* `name`, the name of the artifact (cannot be overwritten on Vertex Pipelines).  
* `.uri`, the location of your artifact object. For input artifacts, this is where the object resides currently. For output artifacts, this is where you will write the artifact from within your component.  
* `.metadata`, additional key-value pairs about the artifact.  
* `.path`, a local path that corresponds to the artifact's `.uri`.

The artifact `.path` attribute is particularly helpful. When you write the contents of your artifact to the location provided by the artifact's `.path` attribute, the pipelines backend will handle copying the file at `.path` to the URI at `.uri` automatically, allowing you to create artifact files within a component by only interacting with the task's local filesystem.

As you will see more in the other examples in this section, each of these properties are accessible on artifacts inside components:

```python
from kfp import dsl
from kfp.dsl import Dataset
from kfp.dsl import Input

@dsl.component
def print_artifact_properties(dataset: Input[Dataset]):
    with open(dataset.path) as f:
        lines = f.readlines()
    
    print('Information about the artifact')
    print('Name:', dataset.name)
    print('URI:', dataset.uri)
    print('Path:', dataset.path)
    print('Metadata:', dataset.metadata)
    
    return len(lines)
```

Note that input artifacts should be treated as immutable. You should not try to modify the contents of the file at `.path` and any changes to the artifact's properties will not affect the artifact's metadata in [ML Metadata][ml-metadata].

### Artifacts in components

The KFP SDK supports two forms of artifact authoring syntax for components: traditional and Pythonic.

The **traditional artifact** authoring syntax is the original artifact authoring style provided by the KFP SDK. The traditional artifact authoring syntax is supported for both [Python Components][python-components] and [Container Components][container-components]. It is supported at runtime by the open source KFP backend and the Google Cloud Vertex Pipelines backend.

The **Pythonic artifact** authoring syntax provides an alterative artifact I/O syntax that is familiar to Python developers. The Pythonic artifact authoring syntax is supported for [Python Components][python-components] only. This syntax is not supported for [Container Components][container-components]. It is currently only supported at runtime by the Google Cloud Vertex Pipelines backend.

#### Traditional artifact syntax

When using the traditional artifact authoring syntax, all artifacts are provided to the component function as an input wrapped in an `Input` or `Output` type marker.

```python
def my_component(in_artifact: Input[Artifact], out_artifact: Output[Artifact]):
    ...
```

For _input artifacts_, you can read the artifact using its `.uri` or `.path` attribute.

For _output artifacts_, a pre-constructed output artifact will be passed into the component. You can update the output artifact's [properties](#artifact-properties) in place and write the artifact's contents to the artifact's `.path` or `.uri` attribute. You should not return the artifact instance from your component. For example:

```python
from kfp import dsl
from kfp.dsl import Dataset, Input, Model, Output

@dsl.component
def train_model(dataset: Input[Dataset], model: Output[Model]):
    with open(dataset.path) as f:
        dataset_lines = f.readlines()

    # train a model
    trained_model = ...
    
    trained_model.save(model.path)
    model.metadata['samples'] = len(dataset_lines)
```

#### **New** Pythonic artifact syntax

To use the Pythonic artifact authoring syntax, simply annotate your components with the artifact class as you would when writing normal Python.

```python
def my_component(in_artifact: Artifact) -> Artifact:
    ...
```

Inside the body of your component, you can read artifacts passed in as input (no change from the traditional artifact authoring syntax). For artifact outputs, you'll construct the artifact in your component code, then return the artifact as an output. For example:

```python
from kfp import dsl
from kfp.dsl import Dataset, Model

@dsl.component
def train_model(dataset: Dataset) -> Model:
    with open(dataset.path) as f:
        dataset_lines = f.readlines()

    # train a model
    trained_model = ...

    model_artifact = Model(uri=dsl.get_uri(), metadata={'samples': len(dataset_lines)})
    trained_model.save(model_artifact.path)
    
    return model_artifact
```

For a typical output artifact which is written to one or more files, the `dsl.get_uri` function can be used at runtime to obtain a unique object storage URI that corresponds to the current task. The optional `suffix` parameter is useful for avoiding path collisions when your component has multiple artifact outputs.

Multiple output artifacts should be specified similarly to [multiple output parameters][multiple-outputs]:

```python
from kfp import dsl
from kfp.dsl import Dataset, Model
from typing import NamedTuple

@dsl.component
def train_multiple_models(
    dataset: Dataset,
) -> NamedTuple('outputs', model1=Model, model2=Model):
    with open(dataset.path) as f:
        dataset_lines = f.readlines()

    # train a model
    trained_model1 = ...
    trained_model2 = ...
    
    model_artifact1 = Model(uri=dsl.get_uri(suffix='model1'), metadata={'samples': len(dataset_lines)})
    trained_model1.save(model_artifact1.path)
    
    model_artifact2 = Model(uri=dsl.get_uri(suffix='model2'), metadata={'samples': len(dataset_lines)})
    trained_model2.save(model_artifact2.path)
    
    outputs = NamedTuple('outputs', model1=Model, model2=Model)
    return outputs(model1=model_artifact1, model2=model_artifact2)
```

{{% oss-be-unsupported feature_name="The Pythonic artifact authoring syntax" %}}

### Artifacts in pipelines

Irrespective of whether your components use the Pythonic or traditional artifact authoring syntax, pipelines that use artifacts should be annotated with the [Pythonic artifact syntax][pythonic-artifact-syntax]:

```python
def my_pipeline(in_artifact: Artifact) -> Artifact:
    ...
```

See the following pipeline which accepts a `Dataset` as input and outputs a `Model`, surfaced from the inner component `train_model`:

```python
from kfp import dsl
from kfp.dsl import Dataset, Model

@dsl.pipeline
def augment_and_train(dataset: Dataset) -> Model:
    augment_task = augment_dataset(dataset=dataset)
    return train_model(dataset=augment_task.output).output
```

The [KFP SDK compiler][compiler] will type check artifact usage according to the rules described in [Type Checking][type-checking].

Please see [Pipeline Basics][pipelines] for comprehensive documentation on how to author a pipeline.


### Lists of artifacts

{{% oss-be-unsupported feature_name="`dsl.Collected` and lists of artifacts" gh_issue_link=https://github.com/kubeflow/pipelines/issues/6161 %}}

KFP supports input lists of artifacts, annotated as `List[Artifact]` or `Input[List[Artifact]]`. This is useful for collecting output artifacts from a loop of tasks using the [`dsl.ParallelFor`][dsl-parallelfor] and [`dsl.Collected`][dsl-collected] control flow objects.

Pipelines can also return an output list of artifacts by using a `-> List[Artifact]` return annotation and returning a [`dsl.Collected`][dsl-collected] instance. 

Both consuming an input list of artifacts and returning an output list of artifacts from a pipeline are described in [Pipeline Control Flow: Parallel looping][parallel-looping]. Creating output lists of artifacts from a single-step component is not currently supported.


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
| [`HTML`][dsl-html]                        | system.HTML                        |****
| [`Markdown`][dsl-markdown]                    | system.Markdown                    |


`Artifact`, `Dataset`, `Model`, and `Metrics` are the most generic and commonly used artifact types. `Artifact` is the default artifact base type and should be used in cases where the artifact type does not fit neatly into another artifact category. `Artifact` is also compatible with all other artifact types. In this sense, the `Artifact` type is also an artifact "any" type.

On the [KFP open source][oss-be] UI, `ClassificationMetrics`, `SlicedClassificationMetrics`, `HTML`, and `Markdown` provide special UI rendering to make the contents of the artifact easily observable.


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
[type-checking]: /docs/components/pipelines/user-guides/core-functions/compile-a-pipeline#type-checking
[oss-be]: /docs/components/pipelines/operator-guides/installation/
[pipelines]: /docs/components/pipelines/user-guides/components/compose-components-into-pipelines/
[container-components]: /docs/components/pipelines/user-guides/components/container-components
[python-components]: /docs/components/pipelines/user-guides/components/lightweight-python-components
[dsl-parallelfor]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.ParallelFor
[dsl-collected]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.Collected
[parallel-looping]: /docs/components/pipelines/user-guides/core-functions/control-flow/#parallel-looping-dslparallelfor
[traditional-artifact-syntax]: /docs/components/pipelines/user-guides/data-handling/artifacts/#traditional-artifact-syntax
[multiple-outputs]: /docs/components/pipelines/user-guides/data-handling/parameters/#multiple-output-parameters
[pythonic-artifact-syntax]: /docs/components/pipelines/user-guides/data-handling/artifacts/#new-pythonic-artifact-syntax