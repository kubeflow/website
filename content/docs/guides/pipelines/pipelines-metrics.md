+++
title = "Pipeline metrics"
description = "Export and visualize pipeline metrics."
weight = 9
+++
This page shows you how to export metrics from the component. For details about how to build a component, see the guide to [building your own component](/docs/guides/pipelines/build-component).
 
## Overview of metrics

Kubeflow Pipelines supports scalar metrics exporting. You can write a list of metrics to describe the performance of the model to a local file which will later be uploaded as run-time metrics by the pipeline agent. The uploaded metrics will be visualized in the experiment runs table in the pipeline UI.
 
## Export metrics file

To enable metrics, you need to write a file `/mlpipeline-metrics.json`. For example:
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
See the [full example](https://github.com/kubeflow/pipelines/blob/master/components/local/confusion_matrix/src/confusion_matrix.py#L78).
 
## Visualize metrics

To see a visualization of the metrics, open the **Experiment runs** page in the pipeline UI. The top 3 metrics are displayed as columns for each run. Use the **Compare runs** UI to display the full metrics.

<img src="/docs/images/metric.png" 
  alt="Run metrics"
  class="mt-3 mb-3 p-3 border border-info rounded">