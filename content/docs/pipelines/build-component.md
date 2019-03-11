+++
title = "Build Components and Pipelines"
description = "Building your own components for Kubeflow Pipelines."
weight = 6
+++

This page describes how to create a component for Kubeflow Pipelines and how
to combine components into a pipeline. For an easier start, experiment with 
[the Kubeflow Pipelines samples](/docs/pipelines/build-pipeline).

## Overview of pipelines and components

A _pipeline_ is a description of an ML workflow, including all of the components 
in the workflow and how they combine in the form of a graph. (See the
screenshot below showing an example of a pipeline graph.) The pipeline
includes the definition of the inputs (parameters) required to run the pipeline 
and the inputs and outputs of each component.

Pipeline _components_ are implementations of pipeline tasks. Each task 
takes one or more 
[artifacts](/docs/pipelines/pipelines-concepts#step-output-artifacts) as
input and may produce one or more
[artifacts](/docs/pipelines/pipelines-concepts#step-output-artifacts) as 
output.

Each task usually includes two parts:

``Client code``
  The code that talks to endpoints to submit jobs. For example, code to talk to 
  the Google Dataproc API to submit a Spark job.

``Runtime code``
  The code that does the actual job and usually runs in the cluster. For 
  example, Spark code that transforms raw data into preprocessed data.

Note the naming convention for client code and runtime code&mdash;for a task 
named "mytask":

* The `mytask.py` program contains the client code.
* The `mytask` directory contains all the runtime code.

A component consists of an interface (inputs/outputs), the implementation 
(a Docker container image and command-line arguments) and metadata 
(name, description).

Components can be instantiated inside the `pipeline` function to create tasks.

There are multiple ways to author components:

* Wrap an existing Docker container image using `ContainerOp`, as described 
  below.
* Create a 
  [lightweight python component](/docs/pipelines/lightweight-python-components) 
  from a Python function.
* Build a new Docker container image from a Python function.

## Before you start

Set up your environment:

* Install [Docker](https://www.docker.com/get-docker).
* Install the [Kubeflow Pipelines SDK](/docs/pipelines/install-sdk).

## Create a container for each component

In most cases, you must create a container image that includes your 
program. See the  
[container building examples](https://github.com/kubeflow/pipelines/blob/master/components). 
(In the directory, go to any subdirectory and then go to the `containers` directory.)

If your component creates some outputs to be fed as inputs to the downstream 
components, each output must be a string and must be written to a separate local 
text file by the container image. For example, if a trainer component needs to 
output the trained model path, it writes the path into a  local file 
`/output.txt`. In the Python class that defines your pipeline 
(see [below](#define-pipeline)), you can 
specify how to map the content of local files to component outputs.

<!---[TODO]: Add how to produce UI metadata.--->

## Create a Python class for your component

You need a Python class to describe the interactions with the Docker container
image  that contains your pipeline component. For example, the following
Python class describes a component that creates confusion matrix data from 
prediction results:

```python
class ConfusionMatrixOp(kfp.dsl.ContainerOp):

  def __init__(self, name, predictions, output_path):
    super(ConfusionMatrixOp, self).__init__(
      name=name,
      image='gcr.io/project-id/ml-pipeline-local-confusion-matrix:v1',
      command=['python', '/ml/confusion_matrix.py'],
      arguments=[
        '--output', '%s/{{workflow.name}}/confusionmatrix' % output_path,
        '--predictions', predictions
     ],
     file_outputs={'label': '/output.txt'})

```

Note:

* Each component must inherit from `kfp.dsl.ContainerOp`.
* If you have already defined ENTRYPOINT in the container image, you don’t need 
  to provide `command` unless you want to override the entry point.
* In the `init` arguments, you can include Python native types (such as str, 
  int) and `kfp.dsl.PipelineParam` types. Each `kfp.dsl.PipelineParam` 
  represents a parameter whose value is usually only known at run time. It can 
  be a pipeline parameter for which the user provides a value at pipeline run
  time, or it can be an output from an upstream component. 
  In the above example, `predictions` and `output_path` are 
  `kfp.dsl.PipelineParam` types.
* Although the value of each `PipelineParam` is only available at run time, you 
  can still use the parameters inline in the `arguments` (note the “%s”). 
  At run time the argument contains the value of the parameter.
* `file_outputs` lists a map between labels and local file paths. In the above 
  example, the content of `/output.txt` is gathered as a string output of the 
  operator. To reference the output in code:

    ```python
    op = ConfusionMatrixOp(...)
    op.outputs['label']
    ```

If there is only one output then you can also use `op.output`.

<a id="define-pipeline"></a>
## Create your pipeline as a Python function

You must identify each pipeline as a Python function. For example:

```python
@kfp.dsl.pipeline(
  name='TFX Trainer',
  description='A trainer that does end-to-end training for TFX models.'
)
def train(
    output_path,
    train_data=kfp.dsl.PipelineParam('train-data',
        value='gs://ml-pipeline-playground/tfx/taxi-cab-classification/train.csv'),
    eval_data=kfp.dsl.PipelineParam('eval-data',
        value='gs://ml-pipeline-playground/tfx/taxi-cab-classification/eval.csv'),
    schema=kfp.dsl.PipelineParam('schema',
        value='gs://ml-pipeline-playground/tfx/taxi-cab-classification/schema.json'),
    target=kfp.dsl.PipelineParam('target', value='tips'),
    learning_rate=kfp.dsl.PipelineParam('learning-rate', value=0.1),
    hidden_layer_size=kfp.dsl.PipelineParam('hidden-layer-size', value='100,50'),
    steps=kfp.dsl.PipelineParam('steps', value=1000),
    slice_columns=kfp.dsl.PipelineParam('slice-columns', value='trip_start_hour'),
    true_class=kfp.dsl.PipelineParam('true-class', value='true'),
    need_analysis=kfp.dsl.PipelineParam('need-analysis', value='true'),
)
```

Note:

* **@kfp.dsl.pipeline** is a required decoration including the `name` and 
  `description` properties.
* Input arguments show up as pipeline parameters on the Kubeflow Pipelines UI. 
  As a Python rule, positional arguments appear first, followed by keyword 
  arguments.
* Each function argument is of type `kfp.dsl.PipelineParam`. The default values 
  should all be of that type. The default values show up in the Kubeflow 
  Pipelines UI but the user can override them.


See [an example](https://github.com/kubeflow/pipelines/blob/master/samples/xgboost-spark/xgboost-training-cm.py).

## More information

* You can build lightweight components from Python functions. See the guide to 
  [lightweight python 
  components](/docs/pipelines/lightweight-python-components).
* See how to 
  [export metrics from your pipeline](/docs/pipelines/pipelines-metrics).
