+++
title = "Build Components and Pipelines"
description = "Building your own component and adding it to a pipeline"
weight = 30
+++

This page describes how to create a component for Kubeflow Pipelines and how
to combine components into a pipeline. For an easier start, experiment with 
[the Kubeflow Pipelines samples](/docs/pipelines/tutorials/build-pipeline/).

## Overview of pipelines and components

A _pipeline_ is a description of a machine learning (ML) workflow, including all
of the components of the workflow and how they work together. The pipeline
includes the definition of the inputs (parameters) required to run the pipeline 
and the inputs and outputs of each component.

A pipeline _component_ is an implementation of a pipeline task. A component
represents a step in the workflow. Each component takes one or more inputs and
may produce one or more outputs. A component consists of an interface
(inputs/outputs), the implementation (a Docker container image and command-line
arguments) and metadata (name, description).

For more information, see the conceptual guides to 
[pipelines](/docs/pipelines/concepts/pipeline/)
and [components](/docs/pipelines/concepts/component/).

## Before you start

Set up your environment:

* Install [Docker](https://www.docker.com/get-docker).
* Install the [Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

The examples on this page come from the 
[XGBoost Spark pipeline sample](https://github.com/kubeflow/pipelines/tree/master/samples/xgboost-spark) 
in the Kubeflow Pipelines sample repository.

## Create a container image for each component

This section assumes that you have already created a program to perform the
task required in a particular step of your ML workflow. For example, if the
task is to train an ML model, then you must have a program that does the
training, such as the program that 
[trains an XGBoost model](https://github.com/kubeflow/pipelines/blob/master/components/dataproc/train/src/train.py).

Create a [Docker](https://docs.docker.com/get-started/) container image that 
packages your program. See the 
[Docker file](https://github.com/kubeflow/pipelines/blob/master/components/dataproc/train/Dockerfile)
for the example XGBoost model training program mentioned above. You can also
examine the generic
[`build_image.sh`](https://github.com/kubeflow/pipelines/blob/master/components/build_image.sh)
script in the Kubeflow Pipelines repository of reusable components.

Your component can create outputs that the downstream components can use as
inputs. Each output must be a string and the container image must write each 
output to a separate local text file. For example, if a training component needs 
to output the path of the trained model, the component writes the path into a 
local file, such as `/output.txt`. In the Python class that defines your 
pipeline (see [below](#define-pipeline)) you can 
specify how to map the content of local files to component outputs.

## Create a Python class for your component

Define a Python class to describe the interactions with the Docker container
image that contains your pipeline component. For example, the following
Python class describes a component that trains an XGBoost model:

```python
def dataproc_train_op(
    project,
    region,
    cluster_name,
    train_data,
    eval_data,
    target,
    analysis,
    workers,
    rounds,
    output,
    is_classification=True
):
    if is_classification:
      config='gs://ml-pipeline-playground/trainconfcla.json'
    else:
      config='gs://ml-pipeline-playground/trainconfreg.json'

    return dsl.ContainerOp(
        name='Dataproc - Train XGBoost model',
        image='gcr.io/ml-pipeline/ml-pipeline-dataproc-train:ac833a084b32324b56ca56e9109e05cde02816a4',
        arguments=[
            '--project', project,
            '--region', region,
            '--cluster', cluster_name,
            '--train', train_data,
            '--eval', eval_data,
            '--analysis', analysis,
            '--target', target,
            '--package', 'gs://ml-pipeline-playground/xgboost4j-example-0.8-SNAPSHOT-jar-with-dependencies.jar',
            '--workers', workers,
            '--rounds', rounds,
            '--conf', config,
            '--output', output,
        ],
        file_outputs={
            'output': '/output.txt',
        }
    )

```

The above class is an extract from the
[XGBoost Spark pipeline sample](https://github.com/kubeflow/pipelines/blob/master/samples/xgboost-spark/xgboost-training-cm.py).

Note:

* Each component must inherit from 
  [`dsl.ContainerOp`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_container_op.py).
* In the `init` arguments, you can include Python native types (such as `str` 
  and `int`) and
  [`dsl.PipelineParam`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline_param.py) 
  types. Each `dsl.PipelineParam` represents a parameter whose value is usually 
  only known at run time. The parameter can be a one for which the user provides 
  a value at pipeline run time, or it can be an output from an upstream 
  component. 
* Although the value of each `dsl.PipelineParam` is only available at run time,
  you can still use the parameters inline in the `arguments` by using `%s`
  variable substitution. At run time the argument contains the value of the 
  parameter. For an example of this technique in operation, see the 
  [taxi cab classification pipeline](https://github.com/kubeflow/pipelines/blob/master/samples/tfx/taxi-cab-classification-pipeline.py). 
* `file_outputs` is a mapping between labels and local file paths. In the above 
  example, the content of `/output.txt` contains the string output of the 
  component. To reference the output in code:

    ```python
    op = dataproc_train_op(...)
    op.outputs['label']
    ```

    If there is only one output then you can also use `op.output`.

<a id="define-pipeline"></a>
## Define your pipeline as a Python function

You must describe each pipeline as a Python function. For example:

```python
@dsl.pipeline(
  name='XGBoost Trainer',
  description='A trainer that does end-to-end distributed training for XGBoost models.'
)
def xgb_train_pipeline(
    output,
    project,
    region='us-central1',
    train_data='gs://ml-pipeline-playground/sfpd/train.csv',
    eval_data='gs://ml-pipeline-playground/sfpd/eval.csv',
    schema='gs://ml-pipeline-playground/sfpd/schema.json',
    target='resolution',
    rounds=200,
    workers=2,
    true_label='ACTION',
)
```

Note:

* **@dsl.pipeline** is a required decoration including the `name` and 
  `description` properties.
* Input arguments show up as pipeline parameters on the Kubeflow Pipelines UI. 
  As a Python rule, positional arguments appear first, followed by keyword 
  arguments.
* Each function argument is of type 
  [`dsl.PipelineParam`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline_param.py). 
  The default values should all be of that type. The default values show up in 
  the Kubeflow Pipelines UI but the user can override them.


See the full code in the
[XGBoost Spark pipeline sample](https://github.com/kubeflow/pipelines/blob/master/samples/xgboost-spark/xgboost-training-cm.py).

## Compile the pipeline

After defining the pipeline in Python as described above, you must compile the 
pipeline to an intermediate representation before you can submit it to the 
Kubeflow Pipelines service. The intermediate representation is a workflow 
specification in the form of a YAML file compressed into a 
`.tar.gz` file.

Use the `dsl-compile` command to compile your pipeline:

```bash
dsl-compile --py [path/to/python/file] --output [path/to/output/tar.gz]
```

## Deploy the pipeline

Upload the generated `.tar.gz` file through the Kubeflow Pipelines UI. See the
guide to [getting started with the UI](/docs/pipelines/pipelines-quickstart).

## Next steps

* Build a [reusable component](/docs/pipelines/sdk/component-development/) for
  sharing in multiple pipelines.
* Learn more about the 
  [Kubeflow Pipelines domain-specific language (DSL)](/docs/pipelines/sdk/dsl-overview/),
  a set of Python libraries that you can use to specify ML pipelines.
* See how to [export metrics from your 
  pipeline](/docs/pipelines/metrics/pipelines-metrics/).
* Visualize the output of your component by
  [adding metadata for an output 
  viewer](/docs/pipelines/metrics/output-viewer/).
* For quick iteration, 
  [build lightweight components](/docs/pipelines/sdk/lightweight-python-components/)
  directly from Python functions.
