+++
title = "Using Early Stopping"
description = "How to use early stopping in Katib experiments"
weight = 60
                    
+++

This guide shows how you can use
[early stopping](https://en.wikipedia.org/wiki/Early_stopping) to improve your
Katib experiments. Early stopping allows you to avoid overfitting when you
train your model during Katib experiments. It also helps by saving computing
resources and reducing experiment execution time by stopping the experiment's
trials when the target metric(s) no longer improves before the training process
is complete.

The major advantage of using early stopping in Katib is that you don't
need to modify your
[training container package](/docs/components/katib/experiment/#packaging-your-training-code-in-a-container-image).
All you have to do is make necessary changes in your experiment's YAML file.

Early stopping works in the same way as Katib's
[metrics collector](/docs/components/katib/experiment/#metrics-collector).
It analyses required metrics from the `stdout` or from the arbitrary output file
and an early stopping algorithm makes the decision if the trial needs to be
stopped. Currently, early stopping works only with
`StdOut` or `File` metrics collectors.

**Note**: Your training container must print training logs with the timestamp,
because early stopping algorithms need to know the sequence of reported metrics.
Check the
[`MXNet` example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/mxnet-mnist/mnist.py#L36)
to learn how to add a date format to your logs.

## Configure the experiment with early stopping

As a reference, you can use the YAML file of the
[early stopping example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/early-stopping/median-stop.yaml).

1. Follow the
   [guide](/docs/components/katib/experiment/#configuring-the-experiment)
   to configure your Katib experiment.

2. Next, to apply early stopping for your experiment, specify the `.spec.earlyStopping`
   parameter, similar to the `.spec.algorithm`. Refer to the
   [`EarlyStoppingSpec` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/common/v1beta1/common_types.go#L41-L58)
   for more information.

   - `.earlyStopping.algorithmName` - the name of the early stopping algorithm.

   - `.earlyStopping.algorithmSettings`- the settings for the early stopping algorithm.

What happens is your experiment's suggestion produces new trials. After that,
the early stopping algorithm generates early stopping rules for the created
trials. Once the trial reaches all the rules, it is stopped and the trial status
is changed to the `EarlyStopped`. Then, Katib calls the suggestion again to
ask for the new trials.

Learn more about Katib concepts
in the [overview guide](/docs/components/katib/overview/#katib-concepts).

Follow the
[Katib configuration guide](/docs/components/katib/katib-config/#early-stopping-settings)
to specify your own image for the early stopping algorithm.

### Early stopping algorithms in detail

Here’s a list of the early stopping algorithms available in Katib:

- [Median Stopping Rule](#median-stopping-rule)

More algorithms are under development.

You can add an early stopping algorithm to Katib yourself. Check the
[developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md)
to contribute.

<a id="median-stopping-rule"></a>

### Median Stopping Rule

The early stopping algorithm name in Katib is `medianstop`.

The median stopping rule stops a pending trial `X` at step `S` if the trial's
best objective value by step `S` is worse than the median value of the running
averages of all completed trials' objectives reported up to step `S`.

To learn more about it, check
[Google Vizier: A Service for Black-Box Optimization](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46180.pdf).

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
        <td>Minimal number of successful trials to compute median value</td>
        <td>3</td>
      </tr>
      <tr>
        <td>start_step</td>
        <td>Number of reported intermediate results before stopping the trial</td>
        <td>4</td>
      </tr>
    </tbody>
  </table>
</div>

### Submit an early stopping experiment from the UI

You can use Katib UI to submit an early stopping experiment. Follow
[these steps](/docs/components/katib/experiment/#running-the-experiment-from-the-katib-ui)
to create an experiment from the UI.

Once you reach the early stopping section, select the appropriate values:

<img src="/docs/components/katib/images/early-stopping-parameter.png"
  alt="UI form to deploy an early stopping Katib experiment"
  class="mt-3 mb-3 border border-info rounded">

## View the early stopping experiment results

First, make sure you have [jq](https://stedolan.github.io/jq/download/)
installed.

Check the early stopped trials in your experiment:

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

Check the status of the early stopped trial by running this command:

```shell
kubectl get trial median-stop-2ml8h96d -n <experiment-namespace>
```

and you should be able to view `EarlyStopped` status for the trial:

```shell
NAME                   TYPE           STATUS   AGE
median-stop-2ml8h96d   EarlyStopped   True     15m
```

In addition, you can check your results on the Katib UI.
The trial statuses on the experiment monitor page should look as follows:

<img src="/docs/components/katib/images/early-stopping-trials.png"
  alt="UI form to view trials"
  class="mt-3 mb-3 border border-info rounded">

You can click on the early stopped trial name to get reported metrics before
this trial is early stopped:

<img src="/docs/components/katib/images/early-stopping-trial-info.png"
  alt="UI form to view trial info"
  class="mt-3 mb-3 border border-info rounded">

## Next steps

- Learn how to
  [configure and run your Katib experiments](/docs/components/katib/experiment/).

- How to
  [restart your experiment and use the resume policies](/docs/components/katib/resume-experiment/).

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
