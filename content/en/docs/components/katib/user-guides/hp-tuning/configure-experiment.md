+++
title = "How to Configure Experiment"
description = "Katib Experiment specification for hyperparameter tuning"
weight = 10
+++

This guide describes how to configure Katib Experiment for hyperparameter (HP) tuning.

## Create Image for Training Code

If you don't use `tune` API from Katib Python SDK, you must package your training code in a Docker
container image and make the image available in a registry. Check the
[Docker documentation](https://docs.docker.com/develop/develop-images/baseimages/) and the
[Kubernetes documentation](https://kubernetes.io/docs/concepts/containers/images/) to learn about it.

## Configuring the Experiment

You can configure your HP tuning job in Katib Experiment YAML file. The YAML file defines the range of
potential values (the search space) for the HPs that you want to optimize, the objective metric
to use when determining optimal values, the search algorithm to use during optimization,
and other configurations.

As a reference, you can use the YAML file of the
[random search algorithm example](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/hp-tuning/random.yaml).

The list below describes the fields in the YAML file for an Experiment.

- **objective**: The metric that you want to optimize in your hyperparameter tuning job. You should
  specify whether you want Katib to maximize or minimize the metric.

  Katib uses the `objectiveMetricName` and `additionalMetricNames` to monitor how the
  hyperparameters perform with the model. Katib records the value of the best `objectiveMetricName`
  metric (maximized or minimized based on `type`) and the corresponding hyperparameter set
  in the Experiment's `.status.currentOptimalTrial.parameterAssignments`. If the `objectiveMetricName`
  metric for a set of hyperparameters reaches the `goal`, Katib stops trying more hyperparameter combinations.

  You can run the Experiment without specifying the `goal`. In that case, Katib
  runs the Experiment until the corresponding successful Trials reach `maxTrialCount`.
  `maxTrialCount` parameter is described below.

  The default way to calculate the Experiment's objective is:

  - When the objective `type` is `maximize`, Katib compares all maximum metric values.

  - When the objective `type` is `minimize`, Katib compares all minimum metric values.

  To change this default setting, define `metricStrategies` with various rules
  (`min`, `max` or `latest`) to extract values for each metric from the Experiment's
  `objectiveMetricName` and `additionalMetricNames`. The Experiment's objective value is calculated in
  accordance with the selected strategy.

  For example, you can set the parameters in your Experiment as follows:

  ```yaml
  . . .
  objectiveMetricName: accuracy
  type: maximize
  metricStrategies:
    - name: accuracy
      value: latest
  . . .
  ```

  In that case, Katib controller searches for the best maximum from the all latest reported
  `accuracy` metrics for each Trial. Check the
  [metrics strategies example](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/metrics-collector/metrics-collection-strategy.yaml).

  The default strategy type for each metric is equal to the objective `type`.

- **algorithm**: The search algorithm that you want Katib to use to find the best HPs.
  Examples include random search, grid search, Bayesian optimization, and more.
  Check the [HP tuning algorithms](/docs/components/katib/user-guides/hp-tuning/configure-algorithm/)
  to learn how to configure them.

- **parallelTrialCount**: The maximum number of HP sets that Katib
  should train in parallel. The default value is 3.

- **maxTrialCount**: The maximum number of Trials to run. This is equivalent to the number o
  HP sets that Katib should generate to test the model. If the `maxTrialCount` value is
  **omitted**, your Experiment will be running until the objective goal is reached or the Experiment
  reaches a maximum number of failed Trials.

- **maxFailedTrialCount**: The maximum number of Trials allowed to fail. This is equivalent to the
  number of failed HP sets that Katib should test. Katib recognizes Trials with a status of
  `Failed` or `MetricsUnavailable` as `Failed` Trials, and if the number of failed Trials reaches
  `maxFailedTrialCount`, Katib stops the Experiment with a status of `Failed`.

- **parameters**: The range of the HPs that you want to tune for your machine learning (ML) model.
  The parameters define the _search space_, also known as the _feasible set_ or the _solution space_.
  In this section of the spec, you define the name, distribution, and type of HP: `int`, `double`, or
  `categorical`. Katib generates HP combinations in the range based on the HP tuning algorithm that
  you specify.

- **trialTemplate**: The template that defines the Trial. You have to package your ML training code
  into a Docker image, as described
  [above](#create-image-for-training-code). `trialTemplate.trialSpec` is your
  [unstructured](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured)
  template with model parameters, which are substituted from `trialTemplate.trialParameters`.
  For example, your training container can receive HPs as command-line arguments or as environment
  variables. You have to set the name of your training container in `trialTemplate.primaryContainerName`.

  Follow the [Trial template guide](/docs/components/katib/user-guides/trial-template/) to learn how
  to use any Kubernetes resource as Katib Trial and how to use ConfigMap for Trial templates.

### Running Katib Experiment with Istio

Katib Experiment from [this directory](https://github.com/kubeflow/katib/tree/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1)
doesn't work with [Istio sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection)
since Trials require access to the internet to download datasets. If you deploy Katib with
Kubeflow platform, you can disable Istio sidecar injection. Specify this annotation: `sidecar.istio.io/inject: "false"`
in your Experiment Trial's template to disable Istio sidecar injection:

```yaml
trialSpec:
  apiVersion: batch/v1
  kind: Job
  spec:
    template:
      metadata:
        annotations:
          "sidecar.istio.io/inject": "false"
```

If you use `PyTorchJob` or other Training Operator jobs in your Trial template check
[here](/docs/components/training/user-guides/tensorflow/#what-is-tfjob) how to set the annotation.

## Running the Experiment

You can create hyperparameter tuning Experiment using the
[YAML file for the random search example](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/hp-tuning/random.yaml).

The Experiment's Trials use PyTorch model to train an image classification model for the
FashionMNIST dataset. You can check [the training container source code](https://github.com/kubeflow/katib/tree/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/trial-images/pytorch-mnist). **Note:** Since this training container downloads FashionMNIST
dataset, you [need to disable Istio sidecar injection](#running-katib-experiment-with-istio)
if you deploy Katib with Kubeflow Platform.

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

Check information about the best Trial in `status.currentOptimalTrial` parameter. In addition,
`status` shows the Experiment's Trials with their current status. For example, run this command
to get information for the most optimal Trial:

```json
$ kubectl get experiment random -n kubeflow -o=jsonpath='{.status.currentOptimalTrial}'

{
  "bestTrialName": "random-hpsrsdqp",
  "observation": {
    "metrics": [
      {
        "latest": "0.11513",
        "max": "0.53415",
        "min": "0.01235",
        "name": "loss"
      }
    ]
  },
  "parameterAssignments": [
    {
      "name": "lr",
      "value": "0.024736875661534784",
    },
    {
      "name": "momentum",
      "value": "0.6612351235123"
    }
  ]
}
```

## Next steps

- Learn about [HP tuning algorithms](/docs/components/katib/user-guides/hp-tuning/configure-algorithm).

- How to configure [Katib Trial template](/docs/components/katib/user-guides/trial-template).

- Boost your hyperparameter tuning Experiment with
  the [early stopping guide](/docs/components/katib/user-guides/early-stopping/).
