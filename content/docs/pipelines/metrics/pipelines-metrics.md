+++
title = "Pipeline Metrics"
description = "Export and visualize pipeline metrics"
weight = 9
+++
This page shows you how to export metrics from the component. For details about 
how to build a component, see the guide to 
[building your own component](/docs/pipelines/sdk/build-component/).
 
## Overview of metrics

Kubeflow Pipelines supports the export of scalar metrics. You can write a list
of metrics to a local file to describe the performance of the model. The
pipeline agent uploads the local file as your run-time metrics. You can view the
uploaded metrics as a visualization in the experiment runs page in the Kubeflow
Pipelines UI.
 
## Export the metrics file

To enable metrics, your program must to write a file `/mlpipeline-metrics.json`.
For example:

```Python
  accuracy = accuracy_score(df['target'], df['predicted'])
  metrics = {
    'metrics': [{
      'name': 'accuracy-score', # The name of the metric. Visualized as the column name in the runs table.
      'numberValue':  accuracy, # The value of the metric. Must be a numeric value.
      'format': "PERCENTAGE",   # The optional format of the metric. Supported values are "RAW" (displayed in raw format) and "PERCENTAGE" (displayed in percentage format).
    }]
  }
  with file_io.FileIO('/mlpipeline-metrics.json', 'w') as f:
    json.dump(metrics, f)
```
See the 
[full example](https://github.com/kubeflow/pipelines/blob/master/components/local/confusion_matrix/src/confusion_matrix.py#L90).

There are several conventions for the metrics file:

* The file path must be `/mlpipeline-metrics.json`.
* The name must follow the pattern `^[a-z]([-a-z0-9]{0,62}[a-z0-9])?$`.
* The format can only be `PERCENTAGE`, `RAW` or not set.
* `numberValue` must be a numeric value.

## Visualize the metrics

To see a visualization of the metrics, open the **Experiments** page in the
Kubeflow Pipelines UI, and select an experiment. The UI shows the top three
metrics as columns for each run. The following example shows two metrics,
**accuracy-score** and **roc-auc-score**. Click **Compare runs** to display the 
full metrics.

<img src="/docs/images/metric.png" 
  alt="Run metrics"
  class="mt-3 mb-3 border border-info rounded">
