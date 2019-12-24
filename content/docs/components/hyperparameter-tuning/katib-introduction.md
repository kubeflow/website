+++
title = "Introduction to Katib"
description = "Overview of Katib for hyperparameter tuning and neural architecture search"
weight = 10
+++

Use Katib for automated tuning of your machine learning (ML) model's 
hyperparameters.

This page introduces the concepts of hyperparameter tuning, neural
architecture search, and the Katib system as a component of Kubeflow.

## Hyperparameters and hyperparameter tuning

*Hyperparameters* are the variables that control the model training process. 
For example: 

* Learning rate.
* Number of layers in a deep neural network.
* Number of nodes in each layer.

Hyperparameter values are not *learned*. In other words, in contrast to the 
node weights and other training *parameters*, the model training process does 
not adjust the hyperparameter values.

*Hyperparameter tuning* is the process of optimizing the hyperparameter values
to maximize the predictive accuracy of the model. If you don't use Katib or a 
similar system for hyperparameter tuning, you need run many training jobs 
yourself, manually adjusting the hyperparameters to find the optimal values.

Automated hyperparameter tuning works by optimizing a target variable, 
also called the *objective metric*, that you specify in the configuration for 
the hyperparameter tuning job. A common metric is the model's accuracy
in the validation pass of the training job (*validation-accuracy*). You also 
specify whether you want the hyperparameter tuning job to *maximize* or 
*minimize* the metric.

For example, the following graph from Katib shows the level of accuracy
for various combinations of hyperparameter values (learning rate, number of 
layers, and optimizer):

<img src="/docs/images/katib-random-example-graph.png" 
  alt="Graph produced by the random example"
  class="mt-3 mb-3 border border-info rounded">

*(To run the example that produced this graph, follow the [getting-started 
guide](/docs/components/hyperparameter-tuning/hyperparameter/).)*

Katib runs several training jobs (known as *trials*) within each
hyperparameter tuning job (*experiment*). Each trial tests a different set of 
hyperparameter configurations. At the end of the experiment, Katib outputs 
the optimized values for the hyperparameters.

## Neural architecture search

You can use *neural architecture search* (NAS) technology to design 
your artificial neural network, with a goal of maximizing the predictive 
accuracy and performance of your model.

NAS is closely related to hyperparameter tuning. Both are subsets of automated 
machine learning (*AutoML*). While hyperparameter tuning
optimizes the model's hyperparameters, a NAS system optimizes the model's
structure, node weights, and hyperparameters.

NAS technology in general uses various techniques to find the optimal neural
network design. The NAS in Katib is based on *reinforcement learning*.

You can submit Katib NAS jobs from the command line or from the UI. (Read more 
about the Katib interfaces later on this page.) The following screenshot shows
part of the form for submitting a NAS job from the Katib UI:

<img src="/docs/images/katib-neural-architecture-search-ui.png" 
  alt="Submitting a neural architecture search from the Katib UI"
  class="mt-3 mb-3 border border-info rounded">

## The Katib project

Katib is a Kubernetes-based system for hyperparameter tuning and neural 
architecture search. Katib supports a number of ML frameworks, including 
TensorFlow, MXNet, PyTorch, XGBoost, and others.

The [Katib project](https://github.com/kubeflow/katib) is open source. 
The [developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md)
is a good starting point for developers who want to contribute to the project.

## Katib interfaces

You can use the following interaces to interact with Katib:

* A web UI that you can use to submit experiments and to monitor your results.
  See the [getting-started 
  guide](/docs/components/hyperparameter-tuning/hyperparameter/#accessing-the-katib-ui)
  for information on how to access the UI.
  The Katib home page within Kubeflow looks like this:

    <img src="/docs/images/katib-home.png" 
      alt="The Katib home page within the Kubeflow UI"
      class="mt-3 mb-3 border border-info rounded">

* A REST API. See the [API reference on 
  GitHub](https://github.com/kubeflow/katib/blob/master/pkg/apis/manager/v1alpha3/gen-doc/api.md).

* Command-line interfaces (CLIs):

  * **Kfctl** is the Kubeflow CLI that you can use to install and configure 
    Kubeflow. Read about kfctl in the guide to 
    [configuring Kubeflow](/docs/other-guides/kustomize/).

  * The Kubernetes CLI, **kubectl**, is useful for running commands against your
    Kubeflow cluster. Read about kubectl in the [Kubernetes 
    documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

## Katib concepts

This section describes the terms used in Katib.

### Search space or feasible set

The *search space* is the set of all possible hyperparameter values that the
hyperparameter tuning job should consider for optimization. Other names for
search space include *feasible set* and *solution space*.

To specify the search space, you provide configuration settings 
for the Katib job. For example, you may provide the names of the 
hyperparameters that you want to optimize. For each hyperparameter, you may
provide a *minimum* and *maximum* value or a *list* of allowable values.

### Experiment

An *experiment* is a single optimization run, or tuning run, over the search 
space. 

You specify configuration settings to define the experiment:

* **Objective**: What you want to optimize. This is the objective metric, also
  called the target variable. A common metric is the model's accuracy
  in the validation pass of the training job (*validation-accuracy*). You also 
  specify whether you want the hyperparameter tuning job to *maximize* or 
  *minimize* the metric.

* **Search space**: The hyperparameters that you want to optimize, and the
  constraints for each hyperparameter. For example, you may provide the
  names of the hyperparameters that you want to optimize. For each
  hyperparameter, you may provide a *minimum* and *maximum* value or a *list* 
  of allowable values.

* **Search algorithm**: The algorithm to use when searching for the optimal
  hyperparameter values.

For details of how to define your experiment, see the guide to [defining an 
experiment](/docs/components/hyperparameter-tuning/experiment/).

### Suggestion

A *suggestion* is a set of hyperparameter values that the hyperparameter
tuning process has proposed. Katib creates a trial to evaluate the suggested
set of values.

### Trial

A *trial* is one iteration of the hyperparameter tuning process. A trial
corresponds to one worker job instance with a list of parameter assignments
(corresponding to a suggestion).

Each experiment runs several trials.

### Worker job

The *worker job* is the process that runs to evaluate a trial and calculate
its objective value.

The worker job can be one of the following types, thus supporting multiple 
frameworks:

* [Kubernetes Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)
 (non-distributed execution). 
* [Kubeflow TFJob](/docs/guides/components/tftraining/) (distributed execution).
* [Kubeflow PyTorchJob](/docs/guides/components/pytorch/) (distributed execution).

## Next steps

Follow the [getting-started 
guide](/docs/components/hyperparameter-tuning/hyperparameter/) to set up
Katib and run some hyperparameter tuning examples.
