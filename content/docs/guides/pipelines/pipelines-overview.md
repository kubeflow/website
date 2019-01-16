+++
title = "Overview of Kubeflow Pipelines"
description = "Overview of Kubeflow Pipelines"
weight = 1
+++

Kubeflow Pipelines is a platform for building and deploying portable, 
scalable machine learning (ML) workflows based on Docker containers.

## Quickstart

Run your first pipeline by following the 
[pipelines quickstart guide](/docs/guides/pipelines/pipelines-quickstart).

## What is Kubeflow Pipelines?

The Kubeflow Pipelines platform consists of:

* A user interface (UI) for managing and tracking experiments, jobs, and runs.
* An engine for scheduling multi-step ML workflows.
* An SDK for defining and manipulating pipelines and components.
* Notebooks for interacting with the system using the SDK.

The following are the goals of Kubeflow Pipelines:

* End-to-end orchestration: enabling and simplifying the orchestration of
  machine learning pipelines.
* Easy experimentation: making it easy for you to try numerous ideas and 
  techniques and manage your various trials/experiments.
* Easy re-use: enabling you to re-use components and pipelines to quickly 
  create end-to-end solutions without having to rebuild each time.

In 
[Kubeflow v0.1.3](https://github.com/kubeflow/pipelines/releases/tag/0.1.3)
and later, Kubeflow Pipelines is one of the Kubeflow core components. It's 
automatically deployed during Kubeflow deployment. You can try it currently 
with a Kubeflow deployment on GKE. See the 
[GKE setup guide](/docs/started/getting-started-gke/).

{{% pipelines-compatibility %}}

## What is a pipeline?

A _pipeline_ is a description of an ML workflow, including all of the components 
in the workflow and how they combine in the form of a graph. (See the
screenshot below showing an example of a pipeline graph.) The pipeline
includes the definition of the inputs (parameters) required to run the pipeline 
and the inputs and outputs of each component.

A pipeline is the main shareable artifact in the Kubeflow Pipelines platform. 
After developing your pipeline, you can upload and share it on the 
Kubeflow Pipelines UI.

A _pipeline component_ is a self-contained set of user code, packaged as a 
[Docker image](https://docs.docker.com/get-started/), that 
performs one step in the pipeline. For example, a component can be responsible
for data preprocessing, data transformation, model training, and so on.

## Example of a pipeline

The screenshots and code below show the `xgboost-training-cm.py` pipeline, which
creates an XGBoost model using structured data in CSV format. You can see the
source code and other information about the pipeline on 
[GitHub](https://github.com/kubeflow/pipelines/tree/master/samples/xgboost-spark).

### The runtime execution graph of the pipeline

The screenshot below shows the example pipeline's runtime execution graph in the
Kubeflow Pipelines UI:

<img src="/docs/images/pipelines-xgboost-graph.png" 
  alt="XGBoost results on the pipelines UI"
  class="mt-3 mb-3 border border-info rounded">

### The Python code that represents the pipeline

Below is an extract from the Python code that defines the 
`xgboost-training-cm.py` pipeline. You can see the full code on 
[GitHub](https://github.com/kubeflow/pipelines/tree/master/samples/xgboost-spark).

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
):
  delete_cluster_op = DeleteClusterOp('delete-cluster', project, region).apply(gcp.use_gcp_secret('user-gcp-sa'))
  with dsl.ExitHandler(exit_op=delete_cluster_op):
    create_cluster_op = CreateClusterOp('create-cluster', project, region, output).apply(gcp.use_gcp_secret('user-gcp-sa'))

    analyze_op = AnalyzeOp('analyze', project, region, create_cluster_op.output, schema,
                           train_data, '%s/{{workflow.name}}/analysis' % output).apply(gcp.use_gcp_secret('user-gcp-sa'))

    transform_op = TransformOp('transform', project, region, create_cluster_op.output,
                               train_data, eval_data, target, analyze_op.output,
                               '%s/{{workflow.name}}/transform' % output).apply(gcp.use_gcp_secret('user-gcp-sa'))

    train_op = TrainerOp('train', project, region, create_cluster_op.output, transform_op.outputs['train'],
                         transform_op.outputs['eval'], target, analyze_op.output, workers,
                         rounds, '%s/{{workflow.name}}/model' % output).apply(gcp.use_gcp_secret('user-gcp-sa'))

    predict_op = PredictOp('predict', project, region, create_cluster_op.output, transform_op.outputs['eval'],
                           train_op.output, target, analyze_op.output, '%s/{{workflow.name}}/predict' % output).apply(gcp.use_gcp_secret('user-gcp-sa'))

    confusion_matrix_op = ConfusionMatrixOp('confusion-matrix', predict_op.output,
                                            '%s/{{workflow.name}}/confusionmatrix' % output).apply(gcp.use_gcp_secret('user-gcp-sa'))

    roc_op = RocOp('roc', predict_op.output, true_label, '%s/{{workflow.name}}/roc' % output).apply(gcp.use_gcp_secret('user-gcp-sa'))
```

### Pipeline data on the Kubeflow Pipelines UI

The screenshot below shows Kubeflow Pipelines UI for kicking off a run of
the pipeline. The UI form derives its data from
the pipeline definition in your code, including the parameters that you must
supply in order to run the pipeline and any default values that you have 
defined. The arrows on the screenshot indicate the 
parameters that do not have useful default values in this particular example: 

<img src="/docs/images/pipelines-start-xgboost-run.png" 
  alt="Starting the XGBoost run on the pipelines UI"
  class="mt-3 mb-3 border border-info rounded">

### Outputs from the pipeline

The following screenshots show examples of the pipeline output visible on
the Kubeflow Pipelines UI.

Prediction results:

<img src="/docs/images/predict.png" 
  alt="Prediction output"
  class="mt-3 mb-3 p-3 border border-info rounded">

Confusion matrix:

<img src="/docs/images/cm.png" 
  alt="Confusion matrix"
  class="mt-3 mb-3 p-3 border border-info rounded">

Receiver operating characteristics (ROC) curve:

<img src="/docs/images/roc.png" 
  alt="ROC"
  class="mt-3 mb-3 p-3 border border-info rounded">

## Next steps

* Follow the 
  [pipelines quickstart guide](/docs/guides/pipelines/pipelines-quickstart) to 
  deploy Kubeflow pipelines and run a sample pipeline directly from the 
  Kubeflow Pipelines UI.
* Follow the full guide to
  [building a pipeline](/docs/guides/pipelines/build-pipeline).