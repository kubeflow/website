+++
title = "Getting Started"
description = "Get started with Katib"
weight = 30

mathjax = true
+++

This guide describes how to get started with Katib and run a few examples.

## Prerequisites

You need to install the following Katib components to run examples:

- Katib control plane [installed](/docs/components/katib/installation/#installing-control-plane).
- Katib Python SDK [installed](/docs/components/katib/installation/#installing-python-sdk).

## Getting Started with Katib Python SDK

### Adding Namespace Label for the Metrics Collector Injection

Before running your hyperparameter tuning Katib Experiment with Python SDK, 
ensure the namespace label `katib.kubeflow.org/metrics-collector-injection: enabled` 
is present. This label enables the sidecar container injection to collect metrics during the experiment.

You can configure the namespace using the following YAML:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <your-namespace>
  labels:
    katib.kubeflow.org/metrics-collector-injection: enabled
```

Or you can add the label to an existing namespace using the following command:

```bash
kubectl label namespace <your-namespace> katib.kubeflow.org/metrics-collector-injection=enabled
```

### A Simple Example

You can run your first hyperparameter tuning Katib Experiment using Python SDK.

In the following example we are going to maximize a simple objective function:

<p>
$$
F(a,b) = 4a - b^2
$$
</p>

The bigger \(a\) and the lesser \(b\) value, the bigger the function value \(F\).

If you install Katib standalone, make sure that you
[configure local `kubeconfig`](https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#programmatic-access-to-the-api)
to access your Kubernetes cluster where you installed Katib control plane.

If you install Katib as part of Kubeflow Platform, you can open a new
[Kubeflow Notebook](/docs/components/notebooks/quickstart-guide/) to run this script.

**Note**. If you use Katib within Kubeflow Platform to run this example, you need to use this
namespace: `KatibClient(namespace="kubeflow-user-example-com")`.

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
katib_client = katib.KatibClient(namespace="kubeflow")

name = "tune-experiment"
katib_client.tune(
    name=name,
    objective=objective,
    parameters=parameters,
    objective_metric_name="result",
    max_trial_count=12,
    resources_per_trial={"cpu": "2"},
)

# [4] Wait until Katib Experiment is complete
katib_client.wait_for_experiment_condition(name=name)

# [5] Get the best hyperparameters.
print(katib_client.get_optimal_hyperparameters(name))
```

You should get similar output for the most optimal Trial, hyperparameters, and observation metrics:

```json
{
  "best_trial_name": "tune-experiment-nmggpxx2",
  "parameter_assignments": [
    {
      "name": "a",
      "value": "19"
    },
    {
      "name": "b",
      "value": "0.13546396192975868"
    }
  ],
  "observation": {
    "metrics": [
      {
        "latest": "75.98164951501829",
        "max": "75.98164951501829",
        "min": "75.98164951501829",
        "name": "result"
      }
    ]
  }
}
```

In [the Katib UI](/docs/components/katib/user-guides/katib-ui/) you should see list of all
completed Trials with results:

<img src="/docs/components/katib/images/getting-started-example.png"
  alt="Getting Started Example"
  class="mt-3 mb-3">

## Next steps

- Check [the Katib UI guide](/docs/components/katib/user-guides/katib-ui/) to get more information
  about your Katib Experiments.

- Run Katib hyperparameter tuning [Experiment using YAML](/docs/components/katib/user-guides/hp-tuning/configure-experiment/#running-the-experiment).

- Learn how to configure [Katib Experiment parameters](/docs/components/katib/user-guides/hp-tuning/configure-experiment).

- Check more [Katib Examples](https://github.com/kubeflow/katib/tree/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1).
