+++
title = "Pipeline metrics"
description = "Log and visualize pipeline metrics."
weight = 3
toc = true

[menu.docs]
  parent = "pipelines"
  weight = 6
+++
This page is for component author to log metrics from the component. For details about how to build your own component, please see [Editing Build Your Own Component](/docs/guides/pipelines/build-component).
 
## Overview of Metrics
Kubeflow Pipeline supports scalar metrics logging. Component author can write a list of metrics to describe the performance of the model to a local file which will later be uploaded as run-time metrics by the pipeline agent. The uploaded metrics will be visualized in the experiment runs table in the pipeline UI.
 
## Log Metrics File
To enable metrics, component author needs to write a file `/mlpipeline-metrics.json`. For example:
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
 
## Visualize Metrics
To visualize metrics, open the experiment runs page in pipeline UI. The top 3 metrics will be displayed as columns for each run. Use the compare runs UI to display the full metrics.
 
![run metrics](/docs/images/metric.png)