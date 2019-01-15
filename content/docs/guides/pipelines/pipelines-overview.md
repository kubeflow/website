+++
title = "Overview of Kubeflow Pipelines"
description = "Overview of Kubeflow Pipelines"
weight = 1
+++

Kubeflow Pipelines is a platform for building and deploying portable and 
scalable end-to-end ML workflows, based on containers.

## What is Kubeflow Pipelines?

The Kubeflow Pipelines platform consists of:

* User interface for managing and tracking experiments, jobs, and runs
* Engine for scheduling multi-step ML workflows
* SDK for defining and manipulating pipelines and components
* Notebooks for interacting with the system using the SDK

The following are the goals of Kubeflow Pipelines:

* End-to-end orchestration: enabling and simplifying the orchestration of
  machine learning pipelines.
* Easy experimentation: making it easy for you to try numerous ideas and 
  techniques and manage your various trials/experiments.
* Easy re-use: enabling you to re-use components and pipelines to quickly 
  cobble together end-to-end solutions, without having to rebuild each time.

Starting from 
[Kubeflow v0.1.3](https://github.com/kubeflow/pipelines/releases/tag/0.1.3), 
Kubeflow Pipelines becomes one of the Kubeflow core components. It's 
automatically deployed during Kubeflow deployment. You can try it currently 
with a Kubeflow deployment on GKE. See the 
[GKE setup guide](/docs/started/getting-started-gke/).

Note: Due to 
[kubeflow/pipelines#345](https://github.com/kubeflow/pipelines/issues/345) and 
[kubeflow/pipelines#337](https://github.com/kubeflow/pipelines/issues/337), 
Kubeflow Pipelines depends on GCP services and some of the functionality is
currently not supported by non-GKE clusters.

## Getting started

Run your first pipeline:

* Follow the 
  [pipelines quickstart guide](/docs/guides/pipelines/pipelines-quickstart) to 
  run a sample pipeline directly from the Kubeflow Pipelines UI.
* Alternatively, follow the full guides to 
  [deploy Kubeflow on GKE](/docs/guides/pipelines/deploy-pipelines-service) and
  [build a pipeline](/docs/guides/pipelines/build-pipeline).

## The Python code to represent a pipeline workflow graph

Below is an example of the Python code that defines a pipeline:

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
  delete_cluster_op = DeleteClusterOp('delete-cluster', project, region)
  with dsl.ExitHandler(exit_op=delete_cluster_op):
    create_cluster_op = CreateClusterOp('create-cluster', project, region, output)

    analyze_op = AnalyzeOp('analyze', project, region, create_cluster_op.output,
                           schema, train_data,
                           '%s/{{workflow.name}}/analysis' % output)

    transform_op = TransformOp('transform', project, region,
                               create_cluster_op.output, train_data, eval_data,
                               target, analyze_op.output,
                               '%s/{{workflow.name}}/transform' % output)

    train_op = TrainerOp('train', project, region, create_cluster_op.output,
                         transform_op.outputs['train'],transform_op.outputs['eval'],
                         target, analyze_op.output, workers,
                         rounds, '%s/{{workflow.name}}/model' % output)

    predict_op = PredictOp('predict', project, region, create_cluster_op.output,
                           transform_op.outputs['eval'], train_op.output, target,
                           analyze_op.output,
                           '%s/{{workflow.name}}/predict' % output)

    cm_op = ConfusionMatrixOp('confusion-matrix',
                              predict_op.output,
                              '%s/{{workflow.name}}/confusionmatrix' % output)

    roc_op = RocOp('roc', predict_op.output, true_label,
                   '%s/{{workflow.name}}/roc' % output)
```

## The above pipeline after you've uploaded it

<img src="/docs/images/job.png" 
  alt="Job"
  class="mt-3 mb-3 p-3 border border-info rounded">

## The runtime execution graph of the pipeline

<img src="/docs/images/run.png" 
  alt="Graph"
  class="mt-3 mb-3 p-3 border border-info rounded">

## Outputs from the pipeline

<img src="/docs/images/predict.png" 
  alt="Prediction output"
  class="mt-3 mb-3 p-3 border border-info rounded">

<img src="/docs/images/cm.png" 
  alt="Confusion matrix"
  class="mt-3 mb-3 p-3 border border-info rounded">

<img src="/docs/images/roc.png" 
  alt="ROC"
  class="mt-3 mb-3 p-3 border border-info rounded">
