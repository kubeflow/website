+++
title = "How to Configure Metrics Collector"
description = "Overview of Katib metrics collector and how to configure it"
weight = 40
+++

This guide describes how Katib metrics collector works.

## Overview

There are two ways to collect metrics:

1. Pull-based: collects the metrics using a _sidecar_ container. A sidecar is a utility container that supports
the main container in the Kubernetes Pod.

2. Push-based: users push the metrics directly to Katib DB in the training scripts.

In the `metricsCollectorSpec` section of the Experiment YAML configuration file, you can
define how Katib should collect the metrics from each Trial, such as the accuracy and loss metrics.

## Pull-based Metrics Collector

Your training code can record the metrics into `StdOut` or into arbitrary output files. 

To define the pull-based metrics collector for your Experiment:

1. Specify the collector type in the `.collector.kind` field.
   Katib's metrics collector supports the following collector types:

   - `StdOut`: Katib collects the metrics from the operating system's default
     output location (_standard output_). This is the default metrics collector.

   - `File`: Katib collects the metrics from an arbitrary file, which
     you specify in the `.source.fileSystemPath.path` field. Training container
     should log metrics to this file in `TEXT` or `JSON` format. If you select `JSON` format,
     metrics must be line-separated by `epoch` or `step` as follows, and the key for timestamp must
     be `timestamp`:

     ```
     {"epoch": 0, "foo": "bar", "fizz": "buzz", "timestamp": "2021-12-02T14:27:51"}
     {"epoch": 1, "foo": "bar", "fizz": "buzz", "timestamp": "2021-12-02T14:27:52"}
     {"epoch": 2, "foo": "bar", "fizz": "buzz", "timestamp": "2021-12-02T14:27:53"}
     {"epoch": 3, "foo": "bar", "fizz": "buzz", "timestamp": "2021-12-02T14:27:54"}
     ```

     Check the file metrics collector example for [`TEXT`](https://github.com/kubeflow/katib/blob/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1/metrics-collector/file-metrics-collector.yaml#L14-L24)
     and [`JSON`](https://github.com/kubeflow/katib/blob/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1/metrics-collector/file-metrics-collector-with-json-format.yaml#L14-L22)
     format. Also, the default file path is `/var/log/katib/metrics.log`, and the default file format is `TEXT`.

   - `TensorFlowEvent`: Katib collects the metrics from a directory path
     containing a [tf.Event](https://www.tensorflow.org/api_docs/python/tf/compat/v1/Event).
     You should specify the path in the `.source.fileSystemPath.path` field. Check the
     [TFJob example](https://github.com/kubeflow/katib/blob/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1/kubeflow-training-operator/tfjob-mnist-with-summaries.yaml#L17-L23).
     The default directory path is `/var/log/katib/tfevent/`.

   - `Custom`: Specify this value if you need to use a custom way to collect
     metrics. You must define your custom metrics collector container
     in the `.collector.customCollector` field. Check the
     [custom metrics collector example](https://github.com/kubeflow/katib/blob/ea46a7f2b73b2d316b6b7619f99eb440ede1909b/examples/v1beta1/metrics-collector/custom-metrics-collector.yaml#L14-L36).

2. Write code in your training container to print or save to the file metrics in the format
   specified in the `.source.filter.metricsFormat` field. The default metrics format value is:

   ```
   ([\w|-]+)\s*=\s*([+-]?\d*(\.\d+)?([Ee][+-]?\d+)?)
   ```

   Each element is a regular expression with two sub-expressions. The first matched expression is
   taken as the metric name. The second matched expression is taken as the metric value.

   For example, using the default metrics format and `StdOut` metrics collector,
   if the name of your objective metric is `loss` and the additional metrics are
   `recall` and `precision`, your training code should print the following output:

   ```shell
   epoch 1:
   loss=3.0e-02
   recall=0.5
   precision=.4

   epoch 2:
   loss=1.3e-02
   recall=0.55
   precision=.5
   ```

## Push-based Metrics Collector

Your training code needs to call [`report_metrics`](https://github.com/kubeflow/katib/blob/master/sdk/python/v1beta1/kubeflow/katib/api/report_metrics.py#L26) function in Python SDK to record metrics.

To define the push-based metrics collector for your Experiment, you have two options:

- YAML File

    1. Specify the collector type `Push` in the `.collector.kind` field.

    2. Write code in your training container to call `report_metrics` to report metrics.

- [`tune`](https://github.com/kubeflow/katib/blob/master/sdk/python/v1beta1/kubeflow/katib/api/katib_client.py#L166) function

    Use tune function and specify the `metrics_collector_config` field. You can reference to the following example:

    ```
    import kubeflow.katib as katib

    # Step 1. Create an objective function with push-based metrics collection.
    def objective(parameters):
      # Import required packages.
      import time
      import kubeflow.katib as katib
      time.sleep(5)
      # Calculate objective function.
      result = 4 * int(parameters["a"]) - float(parameters["b"]) ** 2
      # Push metrics to Katib DB.
      katib.report_metrics({"result": result})

    # Step 2. Create HyperParameter search space.
    parameters = {
      "a": katib.search.int(min=10, max=20),
      "b": katib.search.double(min=0.1, max=0.2)
    }

    # Step 3. Create Katib Experiment with 4 Trials and 2 CPUs per Trial.
    # We choose to install the latest changes of Python SDK because `report_metrics` has not been supported yet. 
    # Thus, the base image must have `git` command to download the package.
    katib_client = katib.KatibClient(namespace="kubeflow")
    name = "tune-experiment"
    katib_client.tune(
      name=name,
      objective=objective,
      parameters=parameters,
      base_image="electronicwaste/push-metrics-collector:v0.0.9", # python:3.11-slim + git
      objective_metric_name="result",
      max_trial_count=4,
      resources_per_trial={"cpu": "2"},
      packages_to_install=["git+https://github.com/kubeflow/katib.git@master#subdirectory=sdk/python/v1beta1"],
      # packages_to_install=["kubeflow-katib==0.18.0"],
      metrics_collector_config={"kind": "Push"},
    )

    # Step 4. Wait until Katib Experiment is complete
    katib_client.wait_for_experiment_condition(name=name)

    # Step 5. Get the best HyperParameters.
    print(katib_client.get_optimal_hyperparameters(name))
    ```
