+++
title = "How to Configure Early Stopping"
description = "Early Stopping overview for Katib Experiments"
weight = 50
+++

This guide shows how you can use [early stopping](https://en.wikipedia.org/wiki/Early_stopping)
to optimize cost for your Katib Experiments. Early stopping allows you to avoid overfitting when you
train your model during Katib Experiments. It also helps by saving computing resources and reducing
Experiment execution time by stopping the Experiment's Trials when the target metric(s) no
longer improves before the training process is complete.

The major advantage of using early stopping in Katib is that you don't
need to modify your
[training container package](/docs/components/katib/user-guides/hp-tuning/configure-experiment/#create-image-for-training-code).
All you have to do is make necessary changes to your Experiment's YAML file.

Early stopping works in the same way as Katib's
[metrics collector](/docs/components/katib/user-guides/metrics-collector). It analyses required
metrics from the `StdOut` or from the arbitrary output file and an early stopping algorithm makes
the decision if the Trial needs to be stopped. Currently, early stopping works only with
`StdOut` or `File` metrics collectors.

**Note**: Your training container must print training logs with the timestamp,
because early stopping algorithms need to know the sequence of reported metrics.
Check the
[`PyTorch` example](https://github.com/kubeflow/katib/blob/399340418a84b96804a9f304cea841b6497796f4/examples/v1beta1/trial-images/pytorch-mnist/mnist.py#L139-L142)
to learn how to add a date format to your logs.

## Configure the Experiment with early stopping

As a reference, you can use the YAML file of the
[early stopping example](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/early-stopping/median-stop.yaml).

1. Follow the
   [guide](/docs/components/katib/user-guides/hp-tuning/configure-experiment/#configuring-the-experiment)
   to configure your Katib Experiment.

2. Next, to apply early stopping for your Experiment, specify the `.spec.earlyStopping`
   parameter, similar to the `.spec.algorithm`.

   - `.earlyStopping.algorithmName` - the name of the early stopping algorithm.

   - `.earlyStopping.algorithmSettings`- the settings for the early stopping algorithm.

What happens is your Experiment's Suggestion produces new Trials. After that, the early stopping
algorithm generates early stopping rules for the created Trials. Once the Trial reaches all the rules,
it is stopped and the Trial status is changed to the `EarlyStopped`. Then, Katib calls the Suggestion again to
ask for the new Trials.

## Early Stopping Algorithms

Katib currently supports several algorithms for early stopping:

- [Median Stopping Rule](#median-stopping-rule)

More algorithms are under development.

### Median Stopping Rule

The early stopping algorithm name in Katib is `medianstop`.

The median stopping rule stops a pending Trial `X` at step `S` if the Trial's best objective value
by step `S` is worse than the median value of the running averages of all completed Trials objectives
reported up to step `S`.

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
        <td>Minimal number of successful Trials to compute median value</td>
        <td>3</td>
      </tr>
      <tr>
        <td>start_step</td>
        <td>Number of reported intermediate results before stopping the Trial</td>
        <td>4</td>
      </tr>
    </tbody>
  </table>
</div>

## Next steps

- How to use Katib Experiment Trial templates(/docs/components/katib/user-guides/trial-template).

- How to [restart your Experiment and use the resume policies](/docs/components/katib/user-guides/resume-experiment/).
