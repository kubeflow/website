+++
title = "Overview of Kubeflow Pipelines"
description = "Pipelines for end-to-end orchestration of ML workflows."
weight = 3
toc = true
bref = "Kubeflow Pipelines is a platform for building and deploying portable and scalable end-to-end ML workflows, based on containers."
aliases = ["/docs/guides/pipelines/"]

[menu.docs]
  parent = "pipelines"
  weight = 1
+++

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


## Getting started

Follow these guides to deploy Kubeflow Pipelines and build your first pipeline:

* [Deploy the Kubeflow Pipelines service to GKE](https://github.com/kubeflow/pipelines/wiki/Deploy-the-Kubeflow-Pipelines-Service).
* [Build a pipeline and run the pipeline samples](https://github.com/kubeflow/pipelines/wiki/Build-a-Pipeline).

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

![Job](/docs/images/job.png)

## The runtime execution graph of the pipeline

![Graph](/docs/images/run.png)

## Outputs from the pipeline

![Prediction Output](/docs/images/predict.png)
![Confusion Matrix Output](/docs/images/cm.png)
![ROC Output](/docs/images/roc.png)
