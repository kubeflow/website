+++
title = "Using Early Stopping"
description = "How to use early stopping in Katib experiments"
weight = 60
                    
+++

This page shows how you can use
[early stopping](https://en.wikipedia.org/wiki/Early_stopping) to improve your
Katib experiments.
Early stopping allows you avoid overfitting when you train your model
during Katib experiments.
It helps you to save computing resources and experiment execution time by
stopping experiment's trials before training process is complete.

The major advantage to use early stopping in Katib, that you don't need to modify
your [training container package](/docs/components/hyperparameter-tuning/experiment/#packaging-your-training-code-in-a-container-image).
All you have to do is to change your experiment YAML file.

Early stopping works in the same way as Katib's
[metrics collector](http://localhost:1313/docs/components/hyperparameter-tuning/experiment/#metrics-collector).
It analyses required metrics from `stdout` or from arbitrary output file and
early stopping algorithm makes decision if trial needs to be stopped. Currently, early stopping
works only with `StdOut` or `File` metrics collectors. **Note**: Your
training container must print training logs with the timestamp, because early
stopping algorithm needs to know sequence of reported metrics. See the
[example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/mxnet-mnist/mnist.py#L36)
how to add date format to your logs.

## Configure the experiment with early stopping

As a reference, you can use the YAML file of the
[early stopping example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/early-stopping/median-stop.yaml).

First of all, follow the [guide](/docs/components/hyperparameter-tuning/experiment/#configuring-the-experiment)
to configure your Katib experiment.
To apply early stopping on your experiment, specify `.spec.earlyStopping`
parameter, similar to `.spec.algorithm`. See the
[`EarlyStoppingSpec` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1beta1/common_types.go#L43-L58)

- `.earlyStopping.algorithmName` - is the name of the early stopping algorithm.

- `.earlyStopping.algorithmSettings`- is the settings for the early stopping algorithm.

Experiment's suggestion produces new trials. After that, early stopping
algorithm generates early stopping rules for the created trials.
Once trial reaches all the rules, it is stopped and trial status is
transferred to `EarlyStopped`.
After that, Katib calls the suggestion again to ask for the new trials.

Read more about Katib concepts
in [overview guide](/docs/components/hyperparameter-tuning/overview/#katib-concepts).

Follow the
[Katib configuration guide](/docs/components/hyperparameter-tuning/katib-config/#early-stopping-settings)
to see how you can specify your own image for the early stopping algorithm.

### Early stopping algorithms in detail

Katib currently supports one early stopping algorithm.
Here’s a list of the early stopping algorithms available in Katib.
The links lead to descriptions on this page:

- [Median Stopping Rule](#median-stopping-rule)

More algorithms are under development. You can add an early stopping algorithm
to Katib yourself. See the
[developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md) to contribute.

<a id="median-stopping-rule"></a>

### Median Stopping Rule

The early stopping algorithm name in Katib is `medianstop`.

The median stopping rule stops a pending trial `X` at step `S` if the trial's
best objective value by step `S` is worse than the median value of the running
averages of all completed trials' objectives reported up to step `S`.

To learn more about it, check [this paper](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46180.pdf).

Katib supports the following early stopping settings:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Setting Name</th>
        <th>Description</th>
        <th>Default Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>min_trials_required</td>
        <td>Minimal number of complete trials to compute median value</td>
        <td>3</td>
      </tr>
      <tr>
        <td>start_step</td>
        <td>Number of reported intermediate results before stopping the trials</td>
        <td>4</td>
      </tr>
    </tbody>
  </table>
</div>

### Submit early stopping experiment from the UI

You can use Katib UI to submit early stopping experiment.
Follow
[these steps](/docs/components/hyperparameter-tuning/experiment/#running-the-experiment-from-the-katib-ui)
to create experiment from the UI.

Once you reach early stopping section, select the appropriate values:

<img src="/docs/images/katib/katib-early-stopping-parameter.png"
  alt="UI form to deploy an early stopping Katib experiment"
  class="mt-3 mb-3 border border-info rounded">

### View the early stopping experiment results

You have to install [jq](https://stedolan.github.io/jq/download/),
to run bellow commands.

Check early stopped trials in your experiment:

```shell
kubectl get experiment <experiment-name>  -n <experiment-namespace> -o json | jq -r ".status"
```

The last part of the above command output looks similar to this:

```yaml
  . . .
  "earlyStoppedTrialList": [
    "median-stop-2ml8h96d",
    "median-stop-cgjkq8zn",
    "median-stop-pvn5p54p",
    "median-stop-sjc9tcgc"
  ],
  "startTime": "2020-11-05T03:03:43Z",
  "succeededTrialList": [
    "median-stop-2kmh57qf",
    "median-stop-7ccstz4z",
    "median-stop-7sqt7556",
    "median-stop-lgvhfch2",
    "median-stop-mkfjtwbj",
    "median-stop-nfmgqd7w",
    "median-stop-nsbxw5m9",
    "median-stop-nsmhg4p2",
    "median-stop-rp88xflk",
    "median-stop-xl7dlf5n",
    "median-stop-ztc58kwq"
  ],
  "trials": 15,
  "trialsEarlyStopped": 4,
  "trialsSucceeded": 11
}
```

If you check status for the early stopped trial:

```shell
kubectl get trial median-stop-2ml8h96d -n <experiment-namespace>
```

You see the `EarlyStopped` status for the trial:

```shell
NAME                   TYPE           STATUS   AGE
median-stop-2ml8h96d   EarlyStopped   True     15m
```

As well, you can see results on the Katib UI.
Check trial statuses on the experiment monitor page:

<img src="/docs/images/katib/katib-early-stopping-trials.png"
  alt="UI form to view trials"
  class="mt-3 mb-3 border border-info rounded">

If you click on the early stopped trial name, you see reported metrics before trial
is early stopped:

<img src="/docs/images/katib/katib-early-stopping-trial-info.png"
  alt="UI form to view trial info"
  class="mt-3 mb-3 border border-info rounded">

## Next steps

- TODO: Add link to resume Experiment

- Read about [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/) for each Katib component.
