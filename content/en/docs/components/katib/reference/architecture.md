+++
title = "Katib Architecture"
description = "How does Katib work?"
weight = 10
+++

This page describes Katib concepts and architectures.

## Hyperparameter Tuning

_Hyperparameters_ are the variables that control the model training process. They include:

- The learning rate.
- The number of layers in a neural network.
- The number of training epochs.

Hyperparameter values are not _learned_. In other words, in contrast to the
model weights and biases the model training process does not adjust the hyperparameter values.

_Hyperparameter tuning_ is the process of optimizing the hyperparameter values to maximize the
predictive accuracy of the model. If you don't use Katib or a similar system for hyperparameter
tuning, you need to run many training jobs yourself, manually adjusting the hyperparameters
to find the optimal values.

You can improve your hyperparameter tuning Experiments by using
[early stopping](https://en.wikipedia.org/wiki/Early_stopping) techniques.
Follow the [early stopping guide](/docs/components/katib/user-guides/early-stopping/) for the details.

## Katib Architecture for Hyperparameter Tuning

This diagram shows how Katib performs Hyperparameter tuning:

<img src="/docs/components/katib/images/katib-architecture.drawio.svg"
  alt="Katib Overview"
  class="mt-3 mb-3">

First of all, users need to write ML training code which will be evaluated on every Katib Trial
with different hyperparameters. Then, using Katib Python SDK users should set the objective, search
space, search algorithm, Trial resources, and create the Katib Experiment.

Katib implements the following
[Kubernetes Custom Resource Definitions (CRDs)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
to tune Hyperparameters.

### Experiment

An _Experiment_ is a single tuning run, also called an optimization run.

You specify configuration settings to define the Experiment. The following are the main configurations:

- **Objective**: What you want to optimize. This is the objective metric, also called the target
  variable. A common metric is the model's accuracy in the validation pass of the training job
  (e.g. validation accuracy). You also specify whether you want the hyperparameter tuning job
  to _maximize_ or _minimize_ the metric.

- **Search space**: The set of all possible hyperparameter values that the hyperparameter tuning job
  should consider for optimization, and the constraints for each hyperparameter. Other names for
  search space include _feasible set_ and _solution space_. For example, you may provide the
  names of the hyperparameters that you want to optimize. For each hyperparameter, you may
  provide a _minimum_ and _maximum_ value or a _list_ of allowable values.

- **Search algorithm**: The algorithm to use when searching for the optimal hyperparameter values.
  For example, Bayesian Optimization or Random Search.

For details of how to define your Experiment, follow [this guide](/docs/components/katib/user-guides/hp-tuning/configure-experiment/)

### Suggestion

A _Suggestion_ is a set of hyperparameter values that the hyperparameter tuning process has proposed.
Katib creates a Trial to evaluate the suggested set of values.

### Trial

A _Trial_ is one iteration of the hyperparameter tuning process. A Trial corresponds to one
worker job instance with a list of parameter assignments. The list of parameter assignments
corresponds to a Suggestion.

Each Experiment runs several Trials. The Experiment runs the Trials until it
reaches either the objective or the configured maximum number of Trials.

### Worker

The _Worker_ is the process that runs to evaluate a Trial and calculate its objective value.

The Worker can be any type of Kubernetes resource or
[Kubernetes CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
Follow the [Trial template guide](/docs/components/katib/user-guides/trial-template/)
to check how to support your own Kubernetes resource in Katib.

## Neural Architecture Search

{{% alert title="Alpha version" color="warning" %}}
NAS is currently in <b>alpha</b> with limited support. The Kubeflow team is
interested in any feedback you may have, in particular with regards to usability
of the feature. You can log issues and comments in
the [Katib issue tracker](https://github.com/kubeflow/katib/issues).
{{% /alert %}}

In addition to hyperparameter tuning, Katib offers a _neural architecture
search_ feature. You can use the NAS to design your artificial neural network, with a goal of
maximizing the predictive accuracy and performance of your model.

NAS is closely related to hyperparameter tuning. Both are subsets of AutoML. While hyperparameter
tuning optimizes the model's hyperparameters, a NAS system optimizes the model's structure,
node weights and hyperparameters.

NAS technology in general uses various techniques to find the optimal neural network design.

Learn more about various NAS algorithms in
[Differentiable Architecture Search](/docs/components/katib/reference/nas-algorithms/#differentiable-architecture-search-darts)
and [Efficient Neural Architecture Search](/docs/components/katib/reference/nas-algorithms/#efficient-neural-architecture-search-enas)
guides.

## Katib Control Plane Components

Katib has the following components on the control plane to run Experiments:

- `katib-controller` - the controller to manage Katib Kubernetes CRDs:
  [`Experiment`](#experiment),
  [`Suggestion`](#suggestion),
  [`Trial`](#trial).

  - (Optional) If certificate generator is enabled in
    [Katib Config](/docs/components/katib/user-guides/katib-config/), Katib controller deployment will create
    self-signed certificate for the Katib webhooks. Learn more about the cert generator in the
    [developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md#katib-cert-generator).

- `katib-ui` - the Katib user interface.

- `katib-db-manager` - the gRPC API server to control Katib DB interface.

- `katib-mysql` - the MySQL DB backend to store Katib Experiments metrics.
