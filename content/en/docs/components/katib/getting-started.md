+++
title = "Getting Started"
description = "Get started with Katib"
weight = 30

mathjax = true
+++

This guide describes how to get started with Katib and run a few examples.

## Prerequisites

You need to install the following Katib components to run examples:

- Katib [installed](/docs/components/katib/installation/#installing-katib).
- Katib Python SDK [installed](/docs/components/katib/installation/#installing-katib-python-sdk).

## Getting Started with Katib Python SDK

You can run your first hyperparameter tuning Katib Experiment using Python SDK.

In the following example we are going to maximize a simple objective function:

<p>
$$
F(a,b) = 4a - b^2
$$
</p>

The bigger \(a\) and the lesser \(b\) value, the bigger the function value \(F\).

```python
# [1] Create an objective function.
def objective(parameters):
    # Import required packages.
    import time
    time.sleep(5)
    # Calculate objective function.
    result = 4 * int(parameters["a"]) - float(parameters["b"]) ** 2
    # Katib parses metrics in this format: <metric-name>=<metric-value>.
    print(f"result={result}")

import kubeflow.katib as katib

# [2] Create hyperparameter search space.
parameters = {
    "a": katib.search.int(min=10, max=20),
    "b": katib.search.double(min=0.1, max=0.2)
}

# [3] Create Katib Experiment with 12 Trials and 2 CPUs per Trial.
name = "tune-experiment"
katib.KatibClient().tune(
    name=name,
    objective=objective,
    parameters=parameters,
    objective_metric_name="result",
    max_trial_count=12,
    resources_per_trial={"cpu": "2"},
)

# [4] Wait until Katib Experiment is complete
katib.KatibClient().wait_for_experiment_condition(name=name)

# [5] Get the best hyperparameters.
print(katib.KatibClient().get_optimal_hyperparameters(name))
```

## Getting Started with Katib Experiment YAML

You can create hyperparameter tuning job by defining YAML configuration file for Katib Experiment.
This example uses the [YAML file for the random search example](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/hp-tuning/random.yaml).

The Experiment's Trials use PyTorch model to train an image classification model for the
FashionMNIST dataset. You can check [the training container source code](https://github.com/kubeflow/katib/tree/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/trial-images/pytorch-mnist).

**Note:** This Experiment doesn't work with
[Istio sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
If you deploy Katib with Kubeflow platform, you have to disable Istio sidecar injection. To do that,
specify this annotation: `sidecar.istio.io/inject: "false"` in your Experiment Trial's template:

```yaml
trialSpec:
  apiVersion: batch/v1
  kind: Job
  spec:
    template:
      metadata:
        "sidecar.istio.io/inject": "false"
```

If you use `TFJob` or other Training Operator jobs in your Trial template check
[here](/docs/components/training/user-guides/tensorflow/#what-is-tfjob) how to set the annotation.

Deploy the Experiment:

```shell
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/hp-tuning/random.yaml
```

This example randomly generates the following hyperparameters:

- `--lr`: Learning rate. Type: double.
- `--momentum`: Momentum for PyTorch optimizer. Type: double.

You can check the results of your Experiment in the `status` specification.

```yaml
$ kubectl -n kubeflow get experiment random -o yaml

apiVersion: kubeflow.org/v1beta1
kind: Experiment
metadata:
  ...
  name: random
  namespace: kubeflow
  ...
spec:
  ...
status:
  currentOptimalTrial:
    bestTrialName: random-hpsrsdqp
    observation:
      metrics:
        - latest: "0.11513"
          max: "0.53415"
          min: "0.01235"
          name: loss
    parameterAssignments:
      - name: lr
        value: "0.024736875661534784"
      - name: momentum
        value: "0.6612351235123"
  runningTrialList:
    - random-2dwxbwcg
    - random-6jd8hmnd
    - random-7gks8bmf
  startTime: "2021-10-07T21:12:06Z"
  succeededTrialList:
    - random-xhpcrt2p
    - random-hpsrsdqp
    - random-kddxqqg9
    - random-4lkr5cjp
  trials: 7
  trialsRunning: 3
  trialsSucceeded: 4
```

You can check information about the best Trial in `status.currentOptimalTrial`.

- `.currentOptimalTrial.bestTrialName` is the Trial name.

- `.currentOptimalTrial.observation.metrics` is the `max`, `min` and `latest` recorded values for objective
  and additional metrics.

- `.currentOptimalTrial.parameterAssignments` is the corresponding hyperparameter set.

In addition, `status` shows the Experiment's Trials with their current status.

## Next steps

- Learn how to configure [Katib Experiment parameters](/docs/components/katib/user-guides/hp-tuning/configure-experiment).

- Check more [Katib Examples](https://github.com/kubeflow/katib/tree/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1).
