+++
title = "How to Configure Metrics Collector"
description = "Overview of Katib metrics collector and how to configure it"
weight = 40
+++

This guide describes how Katib metrics collector works.

## Metrics Collector

In the `metricsCollectorSpec` section of the Experiment YAML configuration file, you can
define how Katib should collect the metrics from each Trial, such as the accuracy and loss metrics.

Your training code can record the metrics into `StdOut` or into arbitrary output files. Katib
collects the metrics using a _sidecar_ container. A sidecar is a utility container that supports
the main container in the Kubernetes Pod.

To define the metrics collector for your Experiment:

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

   - `None`: Specify this value if you don't need to use Katib's metrics collector. For example,
     your training code may handle the persistent storage of its own metrics.

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
