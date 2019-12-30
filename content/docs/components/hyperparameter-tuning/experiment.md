+++
title = "Running an experiment"
description = "How to configure and run a hyperparameter tuning or neural architecture search experiment in Katib"
weight = 30
+++

This page describes in detail how to configure and run a Katib experiment.
The experiment can perform hyperparameter tuning or a neural architecture search 
(NAS), depending on the configuration settings.

For an overview of the concepts involved, read the [introduction to 
Katib](/docs/components/hyperparameter-tuning/overview/).

<a id="docker-image"></a>
## Packaging your training code in a container image

Katib and Kubeflow are Kubernetes-based systems. To use Katib, you must package
your training code in a Docker container image and make the image available
in a registry. See the [Docker
documentation](https://docs.docker.com/develop/develop-images/baseimages/) and
the [Kubernetes 
documentation](https://kubernetes.io/docs/concepts/containers/images/).

## Configuring the experiment
 
To create a hyperparameter tuning or NAS experiment in Katib, you define the
experiment in a YAML configuration file. The YAML file defines the range of 
potential values (the feasible space) for the paramaters that you want to 
optimize, the objective metric to use when determining optimal values, the 
search algorithm to use during optimization, and other configurations.

See the [YAML file for the random algorithm 
example](https://github.com/kubeflow/katib/blob/master/examples/v1alpha3/random-example.yaml).

The list below describes the fields in the YAML file for an experiment. The
Katib UI offers the corresponding fields. You can choose to configure and run
the experiment from the UI or from the command line.

### Configuration spec

These are the fields in the experiment configuration spec:

* **parameters**: The range of the hyperparameters or other parameters that you 
  want to tune for your ML model. The parameters define the *search space*,
  also known as the *feasible set* or the *solution space*.
  In this section of the spec, you define the name and the distribution 
  (discrete or continuous) of every hyperparameter that you need to search.
  For example, you may provide a minimum and maximum value or a list
  of allowed values for each hyperparameter.
  Katib generates hyperparameter combinations in the range based on the
  hyperparameter tuning algorithm that you specify. See the [`ParameterSpec` 
  type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L142-L163).


* **objective**: The metric that you want to optimize. 
  The objective metric is also called the *target variable*. 
  A common metric is the model's accuracy in the validation pass of the training
  job (*validation-accuracy*). You also specify whether you want Katib to 
  maximize or minimize the metric.
  Katib uses the `objectiveMetricName` and `additionalMetricNames` to monitor
  how the hyperparameters work with the model. 
  Katib records the value of the best `objectiveMetricName` metric (maximized 
  or minimized based on `type`) and the corresponding hyperparameter set
  in `Experiment.status`. If the `objectiveMetricName` metric for a set of
  hyperparameters exceeds the `goal`, Katib stops trying more hyperparameter 
  combinations. See the [EarlyStoppingSetting 
  type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L40)
  and the [ObjectiveSpec 
  type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L47).

* **algorithm**: The search algorithm that you want Katib to use to find the
  best hyperparameters or neural architecture configuration. Examples include
  random search, grid search, Bayesian optimization, and more.
  See the [search algorithm details](#search-algorithms) below.
  
* **trialTemplate**: The template that defines the trial.
  You must package your ML training code into a Docker image, as described 
  [above](#docker-image). You must configure the model's
  hyperparameters either as command-line arguments or as environment variables,
  so that Katib can automatically set the values in each trial.

  You can use one of the following job types to train your model:

  * [Kubernetes Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)
    (non-distributed execution). 
  * [Kubeflow TFJob](/docs/guides/components/tftraining/) (distributed
    execution).
  * [Kubeflow PyTorchJob](/docs/guides/components/pytorch/) (distributed
    execution).
  
  See the [TrialTemplate 
  type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L165-L179).
  The template 
  uses the [Go template format](https://golang.org/pkg/text/template/).
  
  You can define the job in raw string format or you can use a 
  [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/).

* **parallelTrialCount**: The maximum number of hyperparameter sets that Katib
  should train in parallel.

* **maxTrialCount**: The maximum number of trials to run.
  This is equivalent to the number of hyperparameter sets that Kabit should
  generate to test the model.

* **maxFailedTrialCount**: The maximum number of failed trials before Katib
  should stop the experiment.
  This is equivalent to the number of failed hyperparameter sets that Kabit 
  should test.
  If the number of failed trials exceeds `maxFailedTrialCount`, Katib stops the
  experiment with a status of `Failed`.

* **metricsCollectorSpec**: A specification of how to collect the metrics from
  each trial, such as the accuracy and loss metrics.
  See the [details of the metrics collector](#metrics-collector) below.

* **nasConfig**: The configuration for a neural architecture search (NAS).
  You can specify the configurations of the neural network design that you want
  to optimize, including the number of layers in the network, the types of
  operations, and more.
  See the [NasConfig type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L205).
  As an example, see the YAML file for the
  [nasjob-example-RL](https://github.com/kubeflow/katib/blob/master/examples/v1alpha3/nasjob-example-RL.yaml).
  The example aims to show all the possible operations. Due to the large search 
  space, the example is not likely to generate a good result.

*Background information about Katib's `Experiment` type:* In Kubernetes 
terminology, Katib's
[`Experiment`](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L187)
type is a [custom resource 
(CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
The YAML file that you create for your experiment is the CRD specification.

<a id="search-algorithms"></a>
### Search algorithms in detail 
  
Katib currently supports the following search algorithms. The links in this list
lead to sections lower down on this page:

* [Grid search](#grid-search)
* [Random search](#random-search)
* [Hyperband](#hyperband)
* [Bayesian optimization](#bayesian)
* [Hyperopt TPE](#tpe-search)
* [NAS based on reinforcement learning](#nas)
  
See the [AlgorithmSpec
type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L23-L33).

TODO
More algorithms are under development. 
You can develop a new algorithm for Katib noninvasively 
(we will document the guideline about how to develop an algorithm for Katib soon). 

<a id="grid-search"></a>
#### Grid search

Grid sampling applies when all variables are discrete (as opposed to
continuous) and the number of possibilities is low. A grid search 
performs an exhaustive combinatorial search over all possibilities,
making the search process extremely long even for medium sized problems.

Katib uses the [Chocolate][https://chocolate.readthedocs.io] optimization
framework for its grid search.

The algorithm name in Katib is `grid`.

<a id="random-search"></a>
#### Random Search

Random sampling is an alternative to grid search when the number of discrete parameters to optimize and the time required for each evaluation is high. When all parameters are discrete, random search will perform sampling without replacement making it an algorithm of choice when combinatorial exploration is not possible. With continuous parameters, it is preferable to use quasi random sampling.

TODO [Hyperopt](http://hyperopt.github.io/hyperopt/)

Algorithm name in katib is `random`, and there are some algortihm settings that we support:

| Setting Name     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Example  |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| random_state     | [int]: Set random state to something other than None for reproducible results.                                                                                                                                                                                                                                                                                                                                                                                                    | 10       |

<a id="hyperband"></a>
#### Hyperband

TODO [Hyperband](https://arxiv.org/pdf/1603.06560.pdf)

<a id="bayesian"></a>
#### Bayesian optimization

TODO [Bayesian optimization](https://arxiv.org/pdf/1012.2599.pdf)
Bayes search models the search space using gaussian process regression, which allows to have an estimate of the loss function and the uncertainty on that estimate at every point of the search space. Modeling the search space suffers from the curse of dimensionality, which makes this method more suitable when the number of dimensions is low. Moreover, since it models both the expected loss and uncertainty, this search algorithm converges in few steps on superior configurations, making it a good choice when the time to complete the evaluation of a parameter configuration is high.

TODO [scikit-optimize](https://github.com/scikit-optimize/scikit-optimize)

> Scikit-Optimize, or skopt, is a simple and efficient library to minimize (very) expensive and noisy black-box functions. It implements several methods for sequential model-based optimization. skopt aims to be accessible and easy to use in many contexts.

Algorithm name in katib is `skopt-bayesian-optimization`, and there are some algortihm settings that we support:

| Setting Name     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Example  |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| base_estimator   |  ["GP", "RF", "ET", "GBRT" or sklearn regressor, default="GP"]:   Should inherit from `sklearn.base.RegressorMixin`. In addition, the `predict`   method, should have an optional `return_std` argument, which returns   `std(Y | x)` along with `E[Y | x]`. If base_estimator is one of   ["GP", "RF", "ET", "GBRT"], a default surrogate model of the corresponding   type is used corresponding to what is used in the minimize functions. More in [skopt document](https://scikit-optimize.github.io/#skopt.Optimizer) | GP       |
| n_initial_points |  [int, default=10]: Number of evaluations of `func` with initialization points  before approximating it with `base_estimator`. Points provided as `x0` count  as initialization points. If len(x0) < n_initial_points additional points  are sampled at random. More in [skopt document](https://scikit-optimize.github.io/#skopt.Optimizer)                                                                                                                                                                               | 10       |
| acq_func         |  [string, default=`"gp_hedge"`]: Function to minimize over the posterior distribution. More in [skopt document](https://scikit-optimize.github.io/#skopt.Optimizer)                                                                                                                                                                                                                                                                                                                                                        | gp_hedge |
| acq_optimizer    |  [string, "sampling" or "lbfgs", default="auto"]: Method to minimize the acquistion function.    The fit model is updated with the optimal value obtained by optimizing acq_func with acq_optimizer. More in [skopt document](https://scikit-optimize.github.io/#skopt.Optimizer)                                                                                                                                                                                                                                          | auto     |
| random_state     | [int]: Set random state to something other than None for reproducible results.                                                                                                                                                                                                                                                                                                                                                                                                    | 10       |

<a id="tpe-search"></a>
#### Hyperopt TPE

TODO [Hyperopt](http://hyperopt.github.io/hyperopt/)

[Hyperopt TPE](http://hyperopt.github.io/hyperopt/) (a [forward and reverse gradient-based]((https://arxiv.org/pdf/1703.01785.pdf))
  hyperparameter optimization technique

Algorithm name in katib is `tpe`.

<a id="nas"></a>
#### NAS using reinforcement learning

[NAS based on 
reinforcement learning](https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1alpha3/NAS_Reinforcement_Learning)

<a id="metrics-collector"></a>
### Metrics collector

TODO

Definition about how to collect the metrics (e.g. accuracy, loss).
When developing a model, developers are likely to print or record the metrics of the model into stdout or files during training. Now Katib can automatically collect the metrics by a sidecar container. The metrics collector for metrics print or record by stdout, file or [tfevent](https://www.tensorflow.org/api_docs/python/tf/Event) (specified by `collector` field, and metrics output specified by `source` field) are now available (more kinds of collectors will be available). 
See more about the struct definition as [here](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L74-L143)
 

Katib has a metrics collector to take metrics from each trial. Katib collects
metrics from stdout of each trial. Metrics should print in the following
format: `{metrics name}={value}`. For example, when your objective value name 
is `loss` and the metrics are `recall` and `precision`, your training container
should print like this:

```
epoch 1:
loss=0.3
recall=0.5
precision=0.4

epoch 2:
loss=0.2
recall=0.55
precision=0.5
```

Katib adds metrics collector sidecar container to training Pod to collect metrics
from training container when training job done.

## Running the experiment

You can run a Katib experiment from the command line or from the Katib UI.

### Running the experiment from the command line

You can use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)
to launch an experiment from the command line:

```
kubectl apply -f <your-path/your-experiment-config.yaml>
```

For example, run the following command to launch an experiment using the
random algorithm example:

```
kubectl apply -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/random-example.yaml
```

Check the experiment status:

```
kubectl -n kubeflow describe experiment <your-experiment-name>
```

For example, to check the status of the random algorithm example:

```
kubectl -n kubeflow describe experiment random-example
```

### Running the experiment from the Katib UI

Instead of using the command line, you can submit an experiment from the Katib 
UI. The following steps assume you want to run a hyperparameter tuning 
experiment. If you want to run a neural architecture search, access the **NAS** 
section of the UI (instead of the **HP** section) and then follow a similar 
sequence of steps.

To run a hyperparameter tuning experiment from the Katib UI:

1. Follow the getting-started guide to [access the Katib
  UI](/docs/components/hyperparameter-tuning/hyperparameter/#katib-ui).
1. Click **Hyperparameter Tuning** on the Katib home page.
1. Open the Katib menu panel on the left, then open the **HP** section and
  click **Submit**:

    <img src="/docs/images/katib-menu.png" 
      alt="The Katib menu panel"
      class="mt-3 mb-3 border border-info rounded">

1. Click on the right-hand panel to close the menu panel. You should see
  tabs offering you the following options:
  
  * **YAML file:** Choose this option to supply an entire YAML file containing
    the configuration for the experiment.

        <img src="/docs/images/katib-deploy-yaml.png" 
          alt="UI tab to paste a YAML configuration file"
          class="mt-3 mb-3 border border-info rounded">

  * **Parameters:** Choose this option to enter the configuration values
    into a form.

        <img src="/docs/images/katib-deploy-form.png" 
          alt="UI form to deploy a Katib experiment"
          class="mt-3 mb-3 border border-info rounded">

View the results of the experiment in the Katib UI:

1. Open the Katib menu panel on the left, then open the **HP** section and
  click **Monitor**:

    <img src="/docs/images/katib-menu.png" 
      alt="The Katib menu panel"
      class="mt-3 mb-3 border border-info rounded">

1. Click on the right-hand panel to close the menu panel. You should see
  the list of experiments:

    <img src="/docs/images/katib-experiments.png" 
      alt="The random example in the list of Katib experiments"
      class="mt-3 mb-3 border border-info rounded">

1. Click the name of your experiment. For example, click **random-example**.
1. You should see a graph showing the level of accuracy for various 
  combinations of the hyperparameter values. For example, the graph below
  shows learning rate, number of layers, and optimizer:

    <img src="/docs/images/katib-random-example-graph.png" 
      alt="Graph produced by the random example"
      class="mt-3 mb-3 border border-info rounded">

1. Below the graph is a list of trials that ran within the experiment.
  Click a trial name to see the trial data.

## Next steps

* See how to run the random algorithm and other [Katib
  examples](/docs/components/hyperparameter-tuning/hyperparameter/#random-algorithm)
  in the getting-started guide.

* For an overview of the concepts involved in hyperparameter tuning and
  neural architecture search, read the [introduction to 
  Katib](/docs/components/hyperparameter-tuning/overview/).
