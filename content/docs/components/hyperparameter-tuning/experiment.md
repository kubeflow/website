+++
title = "Configuring an experiment"
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

Experiment configuration:

* **parameters**:
  This field defines the *search space*, which is the range of the 
  hyperparameters that you want to tune for your ML model. Other names for 
  search space include *feasible set* and *solution space*.
  In this field you define the name and the distribution (discrete valued or 
  continuous valued) of every hyperparameter that you need to search.
  For example, you may provide a *minimum* and *maximum* value or a *list* 
  of allowable values for each hyperparameter.
  Katib generates hyperparameter combinations in the range based on the
  hyperparameter tuning algorithm that you specify. See the [`ParameterSpec` 
  type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L142-L163).


* **objective**: The metric that you want to optimize. 
  The objective metric is also called the *target variable*. 
  A common metric is the model's accuracy in the validation pass of the training
  job (*validation-accuracy*). You also specify whether you want Katib to 
  *maximize* or *minimize* the metric.
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

* **algorithm**: The search algorithm that Katib should use to find the
  best hyperparameters or neural architecture configuration. Examples include
  random search, grid search, Bayesian optimization, and more.
  See the [search algorithm details](#search-algorithms) below.
  
* **trialTemplate**:
  TODO
  The template used to define the trial.
  Your model should be packaged by image, 
  and your model's hyperparameters must be configurable by arguments (in this case) or environment variable so that Katib can automatically set the values in each trial to verify the hyperparameters performance. You can train your model by including your model image in [Kubernetes Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)(in this case), [Kubeflow TFJob](https://www.kubeflow.org/docs/guides/components/tftraining/) or [Kubeflow PyTorchJob](https://www.kubeflow.org/docs/guides/components/pytorch/) (for the latter two job, you should also install corresponding component). You can define the job by raw string way (in this case), but also can refer it in a [configmap](https://cloud.google.com/kubernetes-engine/docs/concepts/configmap). See more about the struct definition as [here](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L165-L179)


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

* **nasConfig**:

<a id="search-algorithms"></a>
## Search algorithms in detail 
  
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




## Running the experiment

TODO Decide how much detail to give here. Alternative is to refer them to the examples in the getting-started guide.

TODO See the examples in the Katib getting-started doc [[[my doc on website]]]. The examples provide YAML files that you can use to run TODO.

Run the following command to launch an experiment using the random algorithm
example:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/random-example.yaml
```

This example embeds the hyperparameters as arguments. You can embed
hyperparameters in another way (for example, using environment variables) 
by using the template defined in the `TrialTemplate.GoTemplate.RawTemplate`
section of the YAML file. The template uses the 
[Go template format](https://golang.org/pkg/text/template/).

TODO Alternatively, submit the job from the UI...

1. Open the Katib UI as described [above](#katib-ui).
1. Click **Hyperparameter Tuning** on the Katib home page.
1. Open the Katib drop-down menu on the left, then open the **HP** section and
  click **Monitor**:

    <img src="/docs/images/katib-menu.png" 
      alt="The Katib drop-down menu"
      class="mt-3 mb-3 border border-info rounded">


Check the experiment status:

```
kubectl -n kubeflow describe experiment random-example
```

The output of the above command should look similar to this:

```
Name:         random-example
Namespace:    kubeflow
Labels:       controller-tools.k8s.io=1.0
Annotations:  <none>
API Version:  kubeflow.org/v1alpha3
Kind:         Experiment
Metadata:
  Creation Timestamp:  2019-12-22T22:53:25Z
  Finalizers:
    update-prometheus-metrics
  Generation:        2
  Resource Version:  720692
  Self Link:         /apis/kubeflow.org/v1alpha3/namespaces/kubeflow/experiments/random-example
  UID:               dc6bc15a-250d-11ea-8cae-42010a80010f
Spec:
  Algorithm:
    Algorithm Name:        random
    Algorithm Settings:    <nil>
  Max Failed Trial Count:  3
  Max Trial Count:         12
  Metrics Collector Spec:
    Collector:
      Kind:  StdOut
  Objective:
    Additional Metric Names:
      accuracy
    Goal:                   0.99
    Objective Metric Name:  Validation-accuracy
    Type:                   maximize
  Parallel Trial Count:     3
  Parameters:
    Feasible Space:
      Max:           0.03
      Min:           0.01
    Name:            --lr
    Parameter Type:  double
    Feasible Space:
      Max:           5
      Min:           2
    Name:            --num-layers
    Parameter Type:  int
    Feasible Space:
      List:
        sgd
        adam
        ftrl
    Name:            --optimizer
    Parameter Type:  categorical
  Trial Template:
    Go Template:
      Raw Template:  apiVersion: batch/v1
kind: Job
metadata:
  name: {{.Trial}}
  namespace: {{.NameSpace}}
spec:
  template:
    spec:
      containers:
      - name: {{.Trial}}
        image: docker.io/kubeflowkatib/mxnet-mnist-example
        command:
        - "python"
        - "/mxnet/example/image-classification/train_mnist.py"
        - "--batch-size=64"
        {{- with .HyperParameters}}
        {{- range .}}
        - "{{.Name}}={{.Value}}"
        {{- end}}
        {{- end}}
      restartPolicy: Never
Status:
  Conditions:
    Last Transition Time:  2019-12-22T22:53:25Z
    Last Update Time:      2019-12-22T22:53:25Z
    Message:               Experiment is created
    Reason:                ExperimentCreated
    Status:                True
    Type:                  Created
    Last Transition Time:  2019-12-22T22:55:10Z
    Last Update Time:      2019-12-22T22:55:10Z
    Message:               Experiment is running
    Reason:                ExperimentRunning
    Status:                True
    Type:                  Running
  Current Optimal Trial:
    Observation:
      Metrics:
        Name:   Validation-accuracy
        Value:  0.981091
    Parameter Assignments:
      Name:          --lr
      Value:         0.025139701133432946
      Name:          --num-layers
      Value:         4
      Name:          --optimizer
      Value:         sgd
  Start Time:        2019-12-22T22:53:25Z
  Trials:            12
  Trials Running:    2
  Trials Succeeded:  10
Events:              <none>
```

When the last value in `Status.Conditions.Type` is `Succeeded`, the experiment
is complete.

TODO Alternatively, view the results of the experiment in the Katib UI:


## Next steps

* See [how to run the random algorithm 
  example](/docs/components/hyperparameter-tuning/hyperparameter/#random-algorithm).)

* See [how to access the Katib
  UI](/docs/components/hyperparameter-tuning/hyperparameter/#accessing-the-katib-ui).

* Learn more about experiments in Katib: In Kubernetes terminology, Katib's
  [`Experiment`](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1alpha3/experiment_types.go#L187)
  type is a [custom resource 
  (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

* Learn more about hyperparameter tuning algorithms on 
  [Wikipedia](https://en.wikipedia.org/wiki/Hyperparameter_optimization).
