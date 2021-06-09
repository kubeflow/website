+++
title = "Introduction to MLRun"
description = "Overview of MLRun for pipeline orchestration management"
weight = 10
                    
+++


MLRun is a generic and convenient mechanism for data scientists and software developers to build, run, and monitor machine learning (ML) tasks and pipelines on a scalable cluster while automatically tracking executed code, metadata, inputs, and outputs. MLRun integrates with the [Nuclio](https://nuclio.io) serverless project and with [Kubeflow Pipelines](https://github.com/kubeflow/pipelines).

MLRun features a Python package `mlrun`, a command-line interface `mlrun`, and a graphical user interface (the MLRun dashboard).

You can use MLRun to do the following:

**Create workflows in Kubeflow pipelines**

Natively integrate with Kubeflow Pipelines to compose, deploy and manage end-to-end machine learning workflows with UI and a set of services.

**Run jobs via various frameworks**

Run experiments with different frameworks such as dask, Horovod, spark or python

**Support AutoML**

Run multiple experiments in parallel, each using a different combination of algorithm functions and parameter sets (hyper-parameters) to automatically select the best result.

**Experiment Tracking**

Describe and track code, metadata, inputs and outputs of machine learning related tasks (executions) and re-use results with a generic and easy-to-use mechanism.

**Online and Offline Feature Store**

Maintain the same set of features in the training and inferencing (real-time) stages with MLRun's unified feature store.

[Read more detailed documentation here](https://docs.mlrun.org/en/latest/)
