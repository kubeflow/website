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

These are the fields in the configuration spec for an experiment:

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
  
* **trialTemplate**:
  TODO
  The template used to define the trial.
  Your model should be packaged by image, 
  and your model's hyperparameters must be configurable by arguments (in this case) or environment variable so that Katib can automatically set the values in each trial to verify the hyperparameters performance. You can train your model by including your model image in [Kubernetes Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)(in this case), [Kubeflow TFJob](https://www.kubeflow.org/docs/guides/components/tftraining/) or [Kubeflow PyTorchJob](https://www.kubeflow.org/docs/guides/components/pytorch/) (for the latter two job, you should also install corresponding component). You can define the job by raw string way (in this case), but also can refer it in a [configmap](https://cloud.google.com/kubernetes-engine/docs/concepts/configmap). See more about the struct definition as [here](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L165-L179)
  This example embeds the hyperparameters as arguments. You can embed
  hyperparameters in another way (for example, using environment variables) 
  by using the template defined in the `TrialTemplate.GoTemplate.RawTemplate`
  section of the YAML file. The template uses the 
  [Go template format](https://golang.org/pkg/text/template/).

* **parallelTrialCount**: 
  TODO
  This fields specifies how many sets of hyperparameter to be tested in parallel at most.


* **maxTrialCount**: 
  TODO
  It specifies how many sets of hyperparameter can be generated to test the model at most.


* **maxFailedTrialCount**: 
  TODO
  Some sets of hyperparameter corresponding jobs maybe fail somehow. If the failed count of hyperparameter set exceeds `maxFailedTrialCount`, the hyperparameter tuning for the model will be stopped with `Failed` status.

* **metricsCollectorSpec**: 
  TODO
  Metrics Collection: Definition about how to collect the metrics (e.g. accuracy, loss).
  When developing a model, developers are likely to print or record the metrics of the model into stdout or files during training. Now Katib can automatically collect the metrics by a sidecar container. The metrics collector for metrics print or record by stdout, file or [tfevent](https://www.tensorflow.org/api_docs/python/tf/Event) (specified by `collector` field, and metrics output specified by `source` field) are now available (more kinds of collectors will be available). See more about the struct definition as [here](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L74-L143)
  See the [details of the metrics collector](#metrics-collector) below.

* **nasConfig**:
  TODO

*Background information: In Kubernetes terminology, Katib's
[`Experiment`](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L187)
type is a [custom resource 
(CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

<a id="search-algorithms"></a>
### Search algorithms in detail 
  
Katib currently supports the following search algorithms:

* Random search
* Grid search
* [Hyperband](https://arxiv.org/pdf/1603.06560.pdf)
* [Bayesian optimization](https://arxiv.org/pdf/1012.2599.pdf)
* [Hyperopt TPE](http://hyperopt.github.io/hyperopt/) (a [forward and reverse gradient-based]((https://arxiv.org/pdf/1703.01785.pdf))
  hyperparameter optimization technique
* [NAS based on reinforcement learning](https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1alpha3/NAS_Reinforcement_Learning)
  
See the [AlgorithmSpec
type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1alpha3/common_types.go#L23-L33).
  
TODO
More algorithms are under development. 
You can develop a new algorithm for Katib noninvasively 
(we will document the guideline about how to develop an algorithm for Katib soon). 

<a id="metrics-collector"></a>
### Metrics collector

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
