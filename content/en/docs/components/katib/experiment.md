+++
title = "Running an Experiment"
description = "How to configure and run a hyperparameter tuning or neural architecture search experiment in Katib"
weight = 30
                    
+++

This guide describes how to configure and run a Katib experiment.
The experiment can perform hyperparameter tuning or a neural architecture search
(NAS) (**alpha**), depending on the configuration settings.

For an overview of the concepts involved, check the
[introduction to Katib](/docs/components/katib/overview/).

<a id="docker-image"></a>

## Packaging your training code in a container image

Katib and Kubeflow are Kubernetes-based systems. To use Katib, you must package
your training code in a Docker container image and make the image available
in a registry. Check the
[Docker documentation](https://docs.docker.com/develop/develop-images/baseimages/)
and the
[Kubernetes documentation](https://kubernetes.io/docs/concepts/containers/images/).

## Configuring the experiment

To create a hyperparameter tuning or NAS experiment in Katib, you define the
experiment in a YAML configuration file. The YAML file defines the range of
potential values (the search space) for the parameters that you want to
optimize, the objective metric to use when determining optimal values, the
search algorithm to use during optimization, and other configurations.

As a reference, you can use the YAML file of the
[random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/random-example.yaml).

The list below describes the fields in the YAML file for an experiment. The
Katib UI offers the corresponding fields. You can choose to configure and run
the experiment from the UI or from the command line.

### Configuration spec

These are the fields in the experiment configuration spec:

- **parameters**: The range of the hyperparameters or other parameters that you
  want to tune for your machine learning (ML) model. The parameters define the _search space_,
  also known as the _feasible set_ or the _solution space_.
  In this section of the spec, you define the name and the distribution
  (discrete or continuous) of every hyperparameter that you need to search.
  For example, you may provide a minimum and maximum value or a list
  of allowed values for each hyperparameter.
  Katib generates hyperparameter combinations in the range based on the
  hyperparameter tuning algorithm that you specify.
  Refer to the
  [`ParameterSpec` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L185-L206).

- **objective**: The metric that you want to optimize.
  The objective metric is also called the _target variable_.
  A common metric is the model's accuracy in the validation pass of the training
  job (_validation-accuracy_). You also specify whether you want Katib to
  maximize or minimize the metric.

  Katib uses the `objectiveMetricName` and `additionalMetricNames` to monitor
  how the hyperparameters work with the model.
  Katib records the value of the best `objectiveMetricName` metric (maximized
  or minimized based on `type`) and the corresponding hyperparameter set
  in the experiment's `.status.currentOptimalTrial.parameterAssignments`.
  If the `objectiveMetricName` metric for a set of hyperparameters reaches the
  `goal`, Katib stops trying more hyperparameter combinations.

  You can run the experiment without specifying the `goal`. In that case, Katib
  runs the experiment until the corresponding successful trials reach `maxTrialCount`.
  `maxTrialCount` parameter is described below.

  The default way to calculate the experiment's objective is:

  - When the objective `type` is `maximize`, Katib compares all maximum
    metric values.

  - When the objective `type` is `minimize`, Katib compares all minimum
    metric values.

  To change the default settings, define `metricStrategies` with various rules
  (`min`, `max` or `latest`) to extract values for each metric from the
  experiment's `objectiveMetricName` and `additionalMetricNames`.
  The experiment's objective value is calculated in
  accordance with the selected strategy.

  For example, you can set the parameters in your experiment as follows:

  ```yaml
  . . .
  objectiveMetricName: accuracy
  type: maximize
  metricStrategies:
    - name: accuracy
      value: latest
  . . .
  ```

  where the Katib controller is searching for the best maximum from the all
  latest reported `accuracy` metrics for each trial. Check the
  [metrics strategies example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/metric-strategy-example.yaml).
  The default strategy type for each metric is equal to the objective `type`.

  Refer to the
  [`ObjectiveSpec` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1beta1/common_types.go#L93).

- **parallelTrialCount**: The maximum number of hyperparameter sets that Katib
  should train in parallel. The default value is 3.

- **maxTrialCount**: The maximum number of trials to run.
  This is equivalent to the number of hyperparameter sets that Katib should
  generate to test the model. If the `maxTrialCount` value is **omitted**, your
  experiment will be running until the objective goal is reached or the experiment
  reaches a maximum number of failed trials.

- **maxFailedTrialCount**: The maximum number of failed trials before Katib
  should stop the experiment. This is equivalent to the number of failed
  hyperparameter sets that Katib should test.
  If the number of failed trials exceeds `maxFailedTrialCount`, Katib stops the
  experiment with a status of `Failed`.

- **algorithm**: The search algorithm that you want Katib to use to find the
  best hyperparameters or neural architecture configuration. Examples include
  random search, grid search, Bayesian optimization, and more.
  Check the [search algorithm details](#search-algorithms) below.

- **trialTemplate**: The template that defines the trial.
  You have to package your ML training code into a Docker image, as described
  [above](#docker-image). `trialTemplate.trialSpec` is your
  [unstructured](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured)
  template with model parameters, which are substituted from `trialTemplate.trialParameters`.
  For example, your training container can receive hyperparameters as command-line
  arguments or as environment variables. You have to set the name of your training
  container in `trialTemplate.primaryContainerName`.

  Katib dynamically supports any kind of
  [Kubernetes CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
  By default, you can use one of the following job types to train your model:

  - [Kubernetes `Job`](https://kubernetes.io/docs/concepts/workloads/controllers/job/)

  - [Kubeflow `TFJob`](/docs/components/training/tftraining/)

  - [Kubeflow `PyTorchJob`](/docs/components/training/pytorch/)

  - [Kubeflow `MPIJob`](/docs/components/training/mpi)

  - [Tekton `Pipeline`](https://github.com/tektoncd/pipeline)

  Refer to the
  [`TrialTemplate` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L208-L270).
  Follow the [trial template guide](/docs/components/katib/trial-template/)
  to understand how to specify `trialTemplate` parameters, save templates in
  `ConfigMaps` and support custom Kubernetes resources in Katib.

- **metricsCollectorSpec**: A specification of how to collect the metrics from
  each trial, such as the accuracy and loss metrics.
  Learn the [details of the metrics collector](#metrics-collector) below.
  The default metrics collector is `StdOut`.

- **nasConfig**: The configuration for a neural architecture search (NAS).
  **Note**: NAS is currently in **alpha** with limited support.
  You can specify the configurations of the neural network design that you want
  to optimize, including the number of layers in the network, the types of
  operations, and more.
  Refer to the
  [`NasConfig` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L296).

  - **graphConfig**: The graph config that defines structure for a
    directed acyclic graph of the neural network. You can specify the number of layers,
    `input_sizes` for the input layer and `output_sizes` for the output layer.
    Refer to the
    [`GraphConfig` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L301-L306).

  - **operations**: The range of operations that you want to tune for your ML model.
    For each neural network layer the NAS algorithm selects one of the operations
    to build a neural network. Each operation contains sets of **parameters** which
    are described above.
    Refer to the
    [`Operation` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L308-L312).

    You can find all NAS examples [here](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/nas).

- **resumePolicy**: The experiment resume policy. Can be one of
  `LongRunning`, `Never` or `FromVolume`. The default value is `LongRunning`.
  Refer to the
  [`ResumePolicy` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L58).
  To find out how to modify a running experiment and use various
  restart policies follow the
  [resume an experiment guide](/docs/components/katib/resume-experiment/).

_Background information about Katib's `Experiment`, `Suggestion` and `Trial`
type:_ In Kubernetes terminology, Katib's
[`Experiment` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L278),
[`Suggestion` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/suggestions/v1beta1/suggestion_types.go#L128) and
[`Trial` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/trials/v1beta1/trial_types.go#L129)
is a [custom resource (CR)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
The YAML file that you create for your experiment is the CR specification.

<a id="search-algorithms"></a>

### Search algorithms in detail

Katib currently supports several search algorithms.
Refer to the
[`AlgorithmSpec` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1beta1/common_types.go#L22-L39).

Here's a list of the search algorithms available in Katib:

- [Grid search](#grid-search)
- [Random search](#random-search)
- [Bayesian optimization](#bayesian)
- [Hyperband](#hyperband)
- [Tree of Parzen Estimators (TPE)](#tpe-search)
- [Covariance Matrix Adaptation Evolution Strategy (CMA-ES)](#cmaes)
- [Sobol's Quasirandom Sequence](#sobol)
- [Neural Architecture Search based on ENAS](#enas)
- [Differentiable Architecture Search (DARTS)](#darts)

More algorithms are under development.

You can add an algorithm to Katib yourself. Check the guide to
[adding a new algorithm](https://github.com/kubeflow/katib/blob/master/docs/new-algorithm-service.md)
and the
[developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md).

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

Random sampling is an alternative to grid search and is used when the number of
discrete variables to optimize is large and the time required for each
evaluation is long. When all parameters are discrete, random search performs
sampling without replacement. Random search is therefore the best algorithm to
use when combinatorial exploration is not possible. If the number of continuous
variables is high, you should use quasi random sampling instead.

Katib uses the [Hyperopt](http://hyperopt.github.io/hyperopt/),
[Goptuna](https://github.com/c-bata/goptuna) or [Chocolate](https://chocolate.readthedocs.io) optimization
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
Gaussian process regression to model the search space. This technique calculates
an estimate of the loss function and the uncertainty of that estimate at every
point in the search space. The method is suitable when the number of
dimensions in the search space is low. Since the method models both
the expected loss and the uncertainty, the search algorithm converges in a few
steps, making it a good choice when the time to
complete the evaluation of a parameter configuration is long.

Katib uses the
[Scikit-Optimize](https://github.com/scikit-optimize/scikit-optimize) or
[Chocolate](https://chocolate.readthedocs.io) optimization framework
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
          of the corresponding type. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
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
          system samples additional points at random. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>10</td>
      </tr>
      <tr>
        <td>acq_func</td>
        <td>[string, default=<code>&quot;gp_hedge&quot;</code>]: The function to
          minimize over the posterior distribution. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
          documentation</a>.</td>
        <td>gp_hedge</td>
      </tr>
      <tr>
        <td>acq_optimizer</td>
        <td>[string, “sampling” or “lbfgs”, default=“auto”]: The method to 
          minimize the acquisition function. The system updates the fit model
          with the optimal value obtained by optimizing <code>acq_func</code>
          with <code>acq_optimizer</code>. Learn more information in the
          <a href="https://scikit-optimize.github.io/stable/modules/generated/skopt.Optimizer.html#skopt.Optimizer">skopt
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

#### Hyperband

The algorithm name in Katib is `hyperband`.

Katib supports the [Hyperband](https://arxiv.org/pdf/1603.06560.pdf)
optimization framework.
Instead of using Bayesian optimization to select configurations, Hyperband
focuses on early stopping as a strategy for optimizing resource allocation and
thus for maximizing the number of configurations that it can evaluate.
Hyperband also focuses on the speed of the search.

<a id="tpe-search"></a>

#### Tree of Parzen Estimators (TPE)

The algorithm name in Katib is `tpe`.

Katib uses the [Hyperopt](http://hyperopt.github.io/hyperopt/) or
[Goptuna](https://github.com/c-bata/goptuna) optimization
framework for its TPE search.

This method provides a [forward and reverse gradient-based](https://arxiv.org/pdf/1703.01785.pdf)
search.

<a id="cmaes"></a>

#### Covariance Matrix Adaptation Evolution Strategy (CMA-ES)

The algorithm name in Katib is `cmaes`.

Katib uses the [Goptuna](https://github.com/c-bata/goptuna) optimization
framework for its CMA-ES search.

The [Covariance Matrix Adaptation Evolution Strategy](https://en.wikipedia.org/wiki/CMA-ES)
is a stochastic derivative-free numerical optimization algorithm for optimization
problems in continuous search spaces.
You can also use [IPOP-CMA-ES](https://sci2s.ugr.es/sites/default/files/files/TematicWebSites/EAMHCO/contributionsCEC05/auger05ARCMA.pdf) and [BIPOP-CMA-ES](https://hal.inria.fr/inria-00382093/document), variant algorithms for restarting optimization when converges to local minimum.

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
      <tr>
        <td>sigma</td>
        <td>[float]: Initial standard deviation of CMA-ES.</td>
        <td>0.001</td>
      </tr>
      <tr>
        <td>restart_strategy</td>
        <td>[string, "none", "ipop", or "bipop", default="none"]: Strategy for restarting CMA-ES optimization when converges to a local minimum.</td>
        <td>"ipop"</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="sobol"></a>

#### Sobol's Quasirandom Sequence

The algorithm name in Katib is `sobol`.

Katib uses the [Goptuna](https://github.com/c-bata/goptuna) optimization
framework for its Sobol's quasirandom search.

The [Sobol's quasirandom sequence](https://dl.acm.org/doi/10.1145/641876.641879)
is a low-discrepancy sequence. And it is known that Sobol's quasirandom sequence can
provide better uniformity properties.

Currently, Katib does not support no algorithm settings for Sobol.

<a id="enas"></a>

#### Neural Architecture Search based on ENAS

The algorithm name in Katib is `enas`.

{{% alert title="Alpha version" color="warning" %}}
Neural architecture search is currently in <b>alpha</b> with limited support.
The Kubeflow team is interested in any feedback you may have, in particular with
regards to usability of the feature. You can log issues and comments in
the [Katib issue tracker](https://github.com/kubeflow/katib/issues).
{{% /alert %}}

This NAS algorithm is ENAS-based. Currently, it doesn't support parameter sharing.

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
        <td>RL controller temperature for the sampling logits. Value must be > 0.
          Set value to "None" to disable it in the controller.</td>
      </tr>
      <tr>
        <td>controller_tanh_const</td>
        <td>float</td>
        <td>2.25</td>
        <td>RL controller tanh constant to prevent premature convergence.
          Value must be > 0. Set value to "None" to disable it in the controller.</td>
      </tr>
      <tr>
        <td>controller_entropy_weight</td>
        <td>float</td>
        <td>1e-5</td>
        <td>RL controller weight for entropy applying to reward. Value must be > 0.
          Set value to "None" to disable it in the controller.</td>
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
        <td>RL controller probability, which represents the prior belief of a
          skip connection being formed. Value must be > 0 and <= 1.</td>
      </tr>
      <tr>
        <td>controller_skip_weight</td>
        <td>float</td>
        <td>0.8</td>
        <td>RL controller weight of skip penalty loss. Value must be > 0.
          Set value to "None" to disable it in the controller.</td>
      </tr>
      <tr>
        <td>controller_train_steps</td>
        <td>int</td>
        <td>50</td>
        <td>Number of RL controller training steps after each candidate runs.
          Value must be >= 1.</td>
      </tr>
      <tr>
        <td>controller_log_every_steps</td>
        <td>int</td>
        <td>10</td>
        <td>Number of RL controller training steps before logging it. Value must be >= 1.</td>
      </tr>
    </tbody>
  </table>
</div>

For more information, check:

- Documentation in the Katib repository on the
  [Efficient Neural Architecture Search (ENAS)](https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/nas/enas).

- The ENAS example —
  [`enas-example-gpu.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/enas-example-gpu.yaml) —
  which attempts to show all possible operations. Due to the large search
  space, the example is not likely to generate a good result.

<a id="darts"></a>

#### Differentiable Architecture Search (DARTS)

The algorithm name in Katib is `darts`.

{{% alert title="Alpha version" color="warning" %}}
Neural architecture search is currently in <b>alpha</b> with limited support.
The Kubeflow team is interested in any feedback you may have, in particular with
regards to usability of the feature. You can log issues and comments in
the [Katib issue tracker](https://github.com/kubeflow/katib/issues).
{{% /alert %}}

Currently, you can't view results of this algorithm in the Katib UI and
you can run experiments only on a single GPU.

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
        <td>num_epochs</td>
        <td>int</td>
        <td>50</td>
        <td>Number of epochs to train model</td>
      </tr>
      <tr>
        <td>w_lr</td>
        <td>float</td>
        <td>0.025</td>
        <td>Initial learning rate for training model weights.
          This learning rate annealed down to <code>w_lr_min</code>
          following a cosine schedule without restart.</td>
      </tr>
      <tr>
        <td>w_lr_min</td>
        <td>float</td>
        <td>0.001</td>
        <td>Minimum learning rate for training model weights.</td>
      </tr>
      <tr>
        <td>w_momentum</td>
        <td>float</td>
        <td>0.9</td>
        <td>Momentum for training training model weights.</td>
      </tr>
      <tr>
        <td>w_weight_decay</td>
        <td>float</td>
        <td>3e-4</td>
        <td>Training model weight decay.</td>
      </tr>
      <tr>
        <td>w_grad_clip</td>
        <td>float</td>
        <td>5.0</td>
        <td>Max norm value for clipping gradient norm of training model weights.</td>
      </tr>
      <tr>
        <td>alpha_lr</td>
        <td>float</td>
        <td>3e-4</td>
        <td>Initial learning rate for alphas weights.</td>
      </tr>
      <tr>
        <td>alpha_weight_decay</td>
        <td>float</td>
        <td>1e-3</td>
        <td>Alphas weight decay.</td>
      </tr>
      <tr>
        <td>batch_size</td>
        <td>int</td>
        <td>128</td>
        <td>Batch size for dataset.</td>
      </tr>
      <tr>
        <td>num_workers</td>
        <td>int</td>
        <td>4</td>
        <td>Number of subprocesses to download the dataset.</td>
      </tr>
      <tr>
        <td>init_channels</td>
        <td>int</td>
        <td>16</td>
        <td>Initial number of channels.</td>
      </tr>
      <tr>
        <td>print_step</td>
        <td>int</td>
        <td>50</td>
        <td>Number of training or validation steps before logging it.</td>
      </tr>
      <tr>
        <td>num_nodes</td>
        <td>int</td>
        <td>4</td>
        <td>Number of DARTS nodes.</td>
      </tr>
      <tr>
        <td>stem_multiplier</td>
        <td>int</td>
        <td>3</td>
        <td>Multiplier for initial channels. It is used in the first stem cell.</td>
      </tr>
    </tbody>
  </table>
</div>

For more information, check:

- Documentation in the Katib repository on the
  [Differentiable Architecture Search](https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/nas/darts).

- The DARTS example —
  [`darts-example-gpu.yaml`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/nas/darts-example-gpu.yaml).

<a id="metrics-collector"></a>

### Metrics collector

In the `metricsCollectorSpec` section of the YAML configuration file, you can
define how Katib should collect the metrics from each trial, such as the
accuracy and loss metrics.
Refer to the
[`MetricsCollectorSpec` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1beta1/common_types.go#L155-L225)

Your training code can record the metrics into `stdout` or into arbitrary output
files. Katib collects the metrics using a _sidecar_ container. A sidecar is
a utility container that supports the main container in the Kubernetes Pod.

To define the metrics collector for your experiment:

1. Specify the collector type in the `.collector.kind` field.
   Katib's metrics collector supports the following collector types:

   - `StdOut`: Katib collects the metrics from the operating system's default
     output location (_standard output_). This is the default metrics collector.

   - `File`: Katib collects the metrics from an arbitrary file, which
     you specify in the `.source.fileSystemPath.path` field. Training container should log metrics to this file.
     Check the
     [file metrics collector example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/file-metricscollector-example.yaml#L15-L22).
     The default file path is `/var/log/katib/metrics.log`.

   - `TensorFlowEvent`: Katib collects the metrics from a directory path
     containing a [tf.Event](https://www.tensorflow.org/api_docs/python/tf/compat/v1/Event).
     You should specify the path in the `.source.fileSystemPath.path` field.
     Check the
     [TFJob example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/tfjob-example.yaml#L16-L22).
     The default directory path is `/var/log/katib/tfevent/`.

   - `Custom`: Specify this value if you need to use a custom way to collect
     metrics. You must define your custom metrics collector container
     in the `.collector.customCollector` field.
     Check the
     [custom metrics collector example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/custom-metricscollector-example.yaml#L15-L35).

   - `None`: Specify this value if you don't need to use Katib's metrics
     collector. For example, your training code may handle the persistent
     storage of its own metrics.

1. Write code in your training container to print or save to the file metrics in the format
   specified in the `.source.filter.metricsFormat`
   field. The default format is `([\w|-]+)\s*=\s*((-?\d+)(\.\d+)?)`.
   Each element is a regular expression with two subexpressions. The first
   matched expression is taken as the metric name. The second matched
   expression is taken as the metric value.

   For example, using the default metrics format and `StdOut` metrics collector,
   if the name of your objective metric is `loss` and the additional metrics are
   `recall` and `precision`, your training code should print the following output:

   ```shell
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

```shell
kubectl apply -f <your-path/your-experiment-config.yaml>
```

**Note:**

- If you deployed Katib as part of Kubeflow (your Kubeflow deployment
  should include Katib), you need to change Kubeflow namespace to your
  profile namespace.

- (Optional) Katib's experiments don't work with
  [Istio sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
  If you are running Kubeflow using Istio, you have to disable sidecar injection. To do that, specify this annotation:
  `sidecar.istio.io/inject: "false"` in your experiment's trial template. For
  examples on how to do it for `Job`, `TFJob` (TensorFlow) or
  `PyTorchJob` (PyTorch), refer to the
  [getting-started guide](/docs/components/katib/hyperparameter/#examples).

Run the following command to launch an experiment
using the random algorithm example:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/random-example.yaml
```

Check the experiment status:

```shell
kubectl -n kubeflow describe experiment <your-experiment-name>
```

For example, to check the status of the random algorithm example:

```shell
kubectl -n kubeflow describe experiment random-example
```

### Running the experiment from the Katib UI

Instead of using the command line, you can submit an experiment from the Katib
UI. The following steps assume you want to run a hyperparameter tuning
experiment. If you want to run a neural architecture search, access the **NAS**
section of the UI (instead of the **HP** section) and then follow a similar
sequence of steps.

To run a hyperparameter tuning experiment from the Katib UI:

1. Follow the getting-started guide to
   [access the Katib UI](/docs/components/katib/hyperparameter/#katib-ui).

1. Click **Hyperparameter Tuning** on the Katib home page.

1. Open the Katib menu panel on the left, then open the **HP** section and
   click **Submit**:

   <img src="/docs/components/katib/images/menu.png"
     alt="The Katib menu panel"
     class="mt-3 mb-3 border border-info rounded">

1. You should be able to view tabs offering you the following options:

   - **YAML file:** Choose this option to supply an entire YAML file containing
     the configuration for the experiment.

     <img src="/docs/components/katib/images/deploy-yaml.png"
       alt="UI tab to paste a YAML configuration file"
       class="mt-3 mb-3 border border-info rounded">

   - **Parameters:** Choose this option to enter the configuration values
     into a form.

     <img src="/docs/components/katib/images/deploy-parameters.png"
       alt="UI form to deploy a Katib experiment"
       class="mt-3 mb-3 border border-info rounded">

View the results of the experiment in the Katib UI:

1. Open the Katib menu panel on the left, then open the **HP** section and
   click **Monitor**:

   <img src="/docs/components/katib/images/menu.png"
     alt="The Katib menu panel"
     class="mt-3 mb-3 border border-info rounded">

1. You should be able to view the list of experiments:

   <img src="/docs/components/katib/images/experiment-list.png"
     alt="The random example in the list of Katib experiments"
     class="mt-3 mb-3 border border-info rounded">

1. Click the name of your experiment. For example, click **random-example**.

1. There should be a graph showing the level of validation and train accuracy
   for various combinations of the hyperparameter values (learning rate, number
   of layers, and optimizer):

   <img src="/docs/components/katib/images/random-example-graph.png"
     alt="Graph produced by the random example"
     class="mt-3 mb-3 border border-info rounded">

1. Below the graph is a list of trials that ran within the experiment:

   <img src="/docs/components/katib/images/random-example-trials.png"
     alt="Trials that ran during the experiment"
     class="mt-3 mb-3 border border-info rounded">

1. You can click on trial name to get metrics for the particular trial:

   <img src="/docs/components/katib/images/random-example-trial-info.png"
     alt="Trials that ran during the experiment"
     class="mt-3 mb-3 border border-info rounded">

## Next steps

- Learn how to run the
  [random algorithm and other Katib examples](/docs/components/katib/hyperparameter/#random-algorithm).

- How to
  [restart your experiment and use the resume policies](/docs/components/katib/resume-experiment/).

- Learn to configure your
  [trial templates](/docs/components/katib/trial-template/).

- For an overview of the concepts involved in hyperparameter tuning and
  neural architecture search, check the
  [introduction to Katib](/docs/components/katib/overview/).

- Boost your hyperparameter tuning experiment with
  the [early stopping guide](/docs/components/katib/early-stopping/)

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
