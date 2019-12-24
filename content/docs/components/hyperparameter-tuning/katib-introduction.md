+++
title = "Introduction to Katib"
description = "Overview of Katib for hyperparameter tuning and neural architecture search"
weight = 10
+++

Use Katib for automated tuning of your machine learning model's hyperparameters.

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

Automated hyperparameter tuning works by optimizing a single target variable, 
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

You can use the *neural architecture search* (NAS) technology in Katib to design 
your artificial neural network, with a goal of maximizing the predictive 
accuracy and performance of your model.

NAS is closely related to hyperparameter tuning. Both are subsets of automated 
machine learning (*AutoML*). While hyperparameter tuning
optimizes the model's hyperparameters, a NAS system optimizes the structure, 
weights, and hyperparameters of the model.

You can submit Katib jobs from the command line or from the UI.(Read more about
the Katib interfaces later on this page.) The following screenshot shows part of
the form for submitting a NAS job from the Katib UI:

<img src="/docs/images/katib-neural-architecture-search-ui.png" 
  alt="Submitting a neural architecture search from the Katib UI"
  class="mt-3 mb-3 border border-info rounded">

## The Katib project

Katib is a Kubernetes-based system for hyperparameter tuning and neural 
architecture search. Katib supports a number of deep-learning 
frameworks, including TensorFlow, MXNet, PyTorch, and others.

The [Katib project](https://github.com/kubeflow/katib) is open source. 
The [developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md)
is a good starting point for developers who want to contribute to the project.

## Katib components and interfaces

TODO

## Katib concepts

TODO


## Next steps

Follow the [getting-started 
guide](/docs/components/hyperparameter-tuning/hyperparameter/) to set up
Katib and run some hyperparameter tuning examples.
