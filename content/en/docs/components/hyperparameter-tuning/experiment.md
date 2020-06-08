+++
title = "Running an experiment"
description = "How to configure and run a hyperparameter tuning or neural architecture search experiment in Katib"
weight = 30
+++

This page describes in detail how to configure and run a Katib experiment.
The experiment can perform hyperparameter tuning or a neural architecture search 
(NAS) (**alpha**), depending on the configuration settings.

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
potential values (the search space) for the parameters that you want to 
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
  type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L166-L187).


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
  hyperparameters reaches the `goal`, Katib stops trying more hyperparameter 
  combinations. See the [`ObjectiveSpec` 
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
      (does not support distributed execution). 
    * [Kubeflow TFJob](/docs/guides/components/tftraining/) (supports 
      distributed execution).
    * [Kubeflow PyTorchJob](/docs/guides/components/pytorch/) (supports 
      distributed execution).
    
    See the [`TrialTemplate` 
    type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L189-L203).
    The template 
    uses the [Go template format](https://golang.org/pkg/text/template/).
    
    You can define the job in raw string format or you can use a 
    [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/). 
    [Here](https://github.com/kubeflow/katib/blob/master/manifests/v1alpha3/katib-controller/trialTemplateConfigmapLabeled.yaml) is an example how to create ConfigMap with trial templates.

* **parallelTrialCount**: The maximum number of hyperparameter sets that Katib
  should train in parallel.

* **maxTrialCount**: The maximum number of trials to run.
  This is equivalent to the number of hyperparameter sets that Katib should
  generate to test the model.

* **maxFailedTrialCount**: The maximum number of failed trials before Katib
  should stop the experiment.
  This is equivalent to the number of failed hyperparameter sets that Katib 
  should test.
  If the number of failed trials exceeds `maxFailedTrialCount`, Katib stops the
  experiment with a status of `Failed`.

* **metricsCollectorSpec**: A specification of how to collect the metrics from
  each trial, such as the accuracy and loss metrics.
  See the [details of the metrics collector](#metrics-collector) below.

* **nasConfig**: The configuration for a neural architecture search (NAS).
  Note: NAS is currently in **alpha** with limited support.
  You can specify the configurations of the neural network design that you want
  to optimize, including the number of layers in the network, the types of
  operations, and more.
  See the [`NasConfig` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L229).

* **operations**: The range of operations that you want to tune for your ML model. 
  For each neural network layer NAS algorithm selects one of the operation to build neural network. 
  Each operation has sets of **parameters** which described above. See the [`Operation` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L241-L245).

    You can find all NAS examples [here](https://github.com/kubeflow/katib/tree/master/examples/v1alpha3/nas).

*Background information about Katib's `Experiment` type:* In Kubernetes 
terminology, Katib's
[`Experiment` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L211) is a [custom resource 
(CR)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
The YAML file that you create for your experiment is the CR specification.

<a id="search-algorithms"></a>
### Search algorithms in detail 
  
Katib currently supports several search algorithms. See the [`AlgorithmSpec`
type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L23-L33).

Here's a list of the search algorithms available in Katib. The links lead to
descriptions on this page:

* [Grid search](#grid-search)
* [Random search](#random-search)
* [Bayesian optimization](#bayesian)
* [HYPERBAND](#hyperband)
* [Hyperopt TPE](#tpe-search)
* [Efficient Neural Architecture Search (ENAS)](#enas)

More algorithms are under development. You can add an algorithm to Katib
yourself. See the guide to [adding a new
algorithm](https://github.com/kubeflow/katib/blob/master/docs/new-algorithm-service.md) and the [developer 
guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md).

<a id="grid-search"></a>
#### Grid search

The algorithm name in Katib is `grid`.

Grid sampling is useful when all variables are discrete (as opposed to
continuous) and the number of possibilities is low. A grid search 
performs an exhaustive combinatorial search over all possibilities,
making the search process extremely long even for medium sized problems.

Katib uses the [Chocolate](https://chocolate.readthedocs.io) optimization
framework for its grid search.

<a id="random-search"></a>
#### Random search

The algorithm name in Katib is `random`.

Random sampling is an alternative to grid search, useful when the number of 
discrete variables to optimize is large and the time required for each 
evaluation is long. When all parameters are discrete, random search performs
sampling without replacement. Random search is therefore the best algorithm to
use when combinatorial exploration is not possible. If the number of continuous
variables is high, you should use quasi random sampling instead.

Katib uses the [hyperopt](http://hyperopt.github.io/hyperopt/) optimization
framework for its random search.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="bayesian"></a>
#### Bayesian optimization

The algorithm name in Katib is `bayesianoptimization`.

The [Bayesian optimization](https://arxiv.org/pdf/1012.2599.pdf) method uses
gaussian process regression to model the search space. This technique calculates
an estimate of the loss function and the uncertainty of that estimate at every
point in the search space. The method is suitable when the number of 
dimensions in the search space is low. Since the method models both 
the expected loss and the uncertainty, the search algorithm converges in a few 
steps, making it a good choice when the time to 
complete the evaluation of a parameter configuration is long.

Katib uses the 
[Scikit-Optimize](https://github.com/scikit-optimize/scikit-optimize) library
for its Bayesian search. Scikit-Optimize is also known as `skopt`.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting Name</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>base_estimator</td>
        <td>[“GP”, “RF”, “ET”, “GBRT” or sklearn regressor, default=“GP”]: 
          Should inherit from <code>sklearn.base.RegressorMixin</code>.
          The <code>predict</code> method should have an optional 
          <code>return_std</code> argument, which returns 
          <code>std(Y | x)</code> along with <code>E[Y | x]</code>. If 
          <code>base_estimator</code> is one of 
          [“GP”, “RF”, “ET”, “GBRT”], the system uses a default surrogate model
          of the corresponding type. See more information in the
          <a href="https://scikit-optimize.github.io/#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>GP</td>
      </tr>
      <tr>
        <td>n_initial_points</td>
        <td>[int, default=10]: Number of evaluations of <code>func</code> with 
          initialization points before approximating it with 
          <code>base_estimator</code>. Points provided as <code>x0</code> count
          as initialization points. 
          If <code>len(x0) &lt; n_initial_points</code>, the
          system samples additional points at random. See more information in the
          <a href="https://scikit-optimize.github.io/#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>10</td>
      </tr>
      <tr>
        <td>acq_func</td>
        <td>[string, default=<code>&quot;gp_hedge&quot;</code>]: The function to
          minimize over the posterior distribution. See more information in the
          <a href="https://scikit-optimize.github.io/#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>gp_hedge</td>
      </tr>
      <tr>
        <td>acq_optimizer</td>
        <td>[string, “sampling” or “lbfgs”, default=“auto”]: The method to 
          minimize the acquisition function. The system updates the fit model
          with the optimal value obtained by optimizing <code>acq_func</code>
          with <code>acq_optimizer</code>. See more information in the
          <a href="https://scikit-optimize.github.io/#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>auto</td>
      </tr>
      <tr>
        <td>random_state</td>
        <td>[int]: Set <code>random_state</code> to something other than None
          for reproducible results.</td>
        <td>10</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="hyperband"></a>
#### HYPERBAND

The algorithm name in Katib is `hyperband`.

Katib supports the [HYPERBAND](https://arxiv.org/pdf/1603.06560.pdf) 
optimization framework.
Instead of using Bayesian optimization to select configurations, HYPERBAND
focuses on early stopping as a strategy for optimizing resource allocation and
thus for maximizing the number of configurations that it can evaluate.
HYPERBAND also focuses on the speed of the search.

<a id="tpe-search"></a>
#### Hyperopt TPE

The algorithm name in Katib is `tpe`.

Katib uses the Tree of Parzen Estimators (TPE) algorithm in
[hyperopt](http://hyperopt.github.io/hyperopt/). This method provides a 
[forward and reverse gradient-based](https://arxiv.org/pdf/1703.01785.pdf)
search.

<a id="enas"></a>
#### Efficient Neural Architecture Search 

{{% alert title="Alpha version" color="warning" %}}
Neural architecture search is currently in <b>alpha</b> with limited support. 
The Kubeflow team is interested in any feedback you may have, in particular with 
regards to usability of the feature. You can log issues and comments in
the [Katib issue tracker](https://github.com/kubeflow/katib/issues).
{{% /alert %}}

The algorithm name in Katib is `enas`.

Katib supports the following algorithm settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting Name</th>
        <th>Type</th>
        <th>Default value</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>controller_hidden_size</td>
        <td>int</td>
        <td>64</td>
        <td>RL controller lstm hidden size. Value must be >= 1.</td>
      </tr>
      <tr>
        <td>controller_temperature</td>
        <td>float</td>
        <td>5.0</td>
        <td>RL controller temperature for the sampling logits. Value must be > 0. Set value to "None"
          to disable it in controller.</td>
      </tr>
      <tr>
        <td>controller_tanh_const</td>
        <td>float</td>
        <td>2.25</td>
        <td>RL controller tanh constant to prevent premature convergence. Value must be > 0.
          Set value to "None" to disable it in controller.</td>
      </tr>
      <tr>
        <td>controller_entropy_weight</td>
        <td>float</td>
        <td>1e-5</td>
        <td>RL controller weight for entropy applying to reward. Value must be > 0.
          Set value to "None" to disable it in controller.</td>
      </tr>
      <tr>
        <td>controller_baseline_decay</td>
        <td>float</td>
        <td>0.999</td>
        <td>RL controller baseline factor. Value must be > 0 and <= 1.</td>
      </tr>
      <tr>
        <td>controller_learning_rate</td>
        <td>float</td>
        <td>5e-5</td>
        <td>RL controller learning rate for Adam optimizer. Value must be > 0 and <= 1.</td>
      </tr>
      <tr>
        <td>controller_skip_target</td>
        <td>float</td>
        <td>0.4</td>
        <td>RL controller probability, which represents the prior belief of a skip connection 
          being formed. Value must be > 0 and <= 1.</td>
      </tr>
      <tr>
        <td>controller_skip_weight</td>
        <td>float</td>
        <td>0.8</td>
        <td>RL controller weight of skip penalty loss. Value must be > 0.
          Set value to "None" to disable it in controller.</td>
      </tr>
      <tr>
        <td>controller_train_steps</td>
        <td>int</td>
        <td>50</td>
        <td>Number of RL controller training steps after each candidate run. Value must be >= 1.</td>
      </tr>
      <tr>
        <td>controller_log_every_steps</td>
        <td>int</td>
        <td>10</td>
        <td>Number of training RL controller steps before logging it. Value must be >= 1.</td>
      </tr>
    </tbody>
  </table>
</div>

For more information, see:

* Information in the Katib repository on [Efficient Neural Architecture Search](https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1alpha3/nas/enas).
* As a ENAS example, see the YAML file for the 
[enas-example-gpu](https://github.com/kubeflow/katib/blob/master/examples/v1alpha3/nas/enas-example-gpu.yaml).
The example aims to show all the possible operations. Due to the large search 
space, the example is not likely to generate a good result.

<a id="metrics-collector"></a>
### Metrics collector

In the `metricsCollectorSpec` section of the YAML configuration file, you can
define how Katib should collect the metrics from each trial, such as the 
accuracy and loss metrics. See the [`MetricsCollectorSpec` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L81-L150)

Your training code can record the metrics into `stdout` or into arbitrary output
files. Katib collects the metrics using a *sidecar* container. A sidecar is
a utility container that supports the main container in the Kubernetes Pod.

To define the metrics collector for your experiment:

1. Specify the collector type in the `collector` field.
  Katib's metrics collector supports the following collector types:

    * `StdOut`: Katib collects the metrics from the operating system's default
      output location (*standard output*).
    * `File`: Katib collects the metrics from an arbitrary file, which
      you specify in the `source` field.
    * `TensorFlowEvent`: Katib collects the metrics from a directory path
      containing a 
      [tf.Event](https://www.tensorflow.org/api_docs/python/tf/compat/v1/Event). You
      should specify the path in the `source` field.
    * `Custom`: Specify this value if you need to use custom way to collect
      metrics. You must define your custom metrics collector container
      in the `collector.customCollector` field.
    * `None`: Specify this value if you don't need to use Katib's metrics
      collector. For example, your training code may handle the persistent
      storage of its own metrics.

1. Specify the metrics output location in the `source` field. See [const](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L123-L143) for default values.

1. Write code in your training container to print metrics in the format
   specified in the `metricsCollectorSpec.source.filter.metricsFormat`
   field. The default format is `([\w|-]+)\s*=\s*((-?\d+)(\.\d+)?)`.
   Each element is a regular expression with two subexpressions. The first
   matched expression is taken as the metric name. The second matched
   expression is taken as the metric value.

    For example, using the default metrics format, if the name of your objective metric
    is `loss` and the metrics are `recall` and `precision`, your training code should
    print the following output:

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

* For a detailed instruction of the Katib Configuration file, 
  read the [Katib config page](/docs/components/hyperparameter-tuning/katib-config/).

* See how you can change installation of Katib component in the [environment variables guide](/docs/components/hyperparameter-tuning/env-variables/).
