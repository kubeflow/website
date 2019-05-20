+++
title = "Visualize Component Results on the Pipelines UI"
description = "Visualizing the results of your pipelines component"
weight = 8
+++

The Kubeflow Pipelines UI has built-in support for several types of 
visualizations, in order to provide rich performance evaluation and comparison. 
As a pipeline creator, you can use these visualizations by writing a JSON file 
to the component's local filesystem at any point during the pipeline execution. 

## Metadata for the output viewers

The pipeline component must write a JSON file specifying metadata for the
output viewer(s) that the component needs. The file name must be 
`/mlpipeline-ui-metadata.json`, and the file
must be written to the root level of the container filesystem.

The JSON specifies an array of `outputs`. Each `outputs` entry describes the
metadata for an output viewer. The JSON structure looks like this:

```
{
  "version": 1,
  "outputs": [
    {
      "type": "confusion_matrix",
      "format": "csv",
      "source": "dir1/matrix.csv",
      "schema": "dir1/schema.json",
      "predicted_col": "column1",
      "target_col": "column2"
    },
    {
      ...
    }
  ]
}
```

If the component writes such a file to its container filesystem, the Kubeflow 
Pipelines system extracts the file, and the UI uses the file to generate the 
specified viewer(s). The metadata specifies where the artifact data should be 
loaded from, and then the UI loads the data **into memory** and renders it. 
It's important to keep this data at a level that's manageable by the UI, for 
example by running a sampling step before exporting the file as an artifact.

You can specify the following metadata fields for each entry in the `outputs`
array:

| Field name      | Description |
| -------------   | ------------- |
| `format`        | The format of the artifact data; default is 'csv'. *Note:* The only format currently available is 'csv'. |
| `header`        | A list of strings to be used as headers for the artifact data. For example, in a table these strings are used in the first row. |
| `labels`        | A list of strings to be used as labels for artifact columns or rows. |
| `predicted_col` | Name of the predicted column. |
| `schema`        | A list of `{type, name}` objects that specify the schema of the artifact data. |
| `source`        | The full path to the data. This path can contain wildcards '*', in which case the UI concatenates the data from the matching source files. For some viewers, this field can contain inlined string data instead of a path. |
| `storage`       | Name of the storage provider; default is Google Cloud Storage ('gcs'). |
| `target_col`    | Name of the target column. |
| `type`          | Name of the viewer to be used to visualize the data. The list below shows the available types. |

The sections below describe the available viewer types and the required metadata 
fields for each type:

## Confusion matrix

**type:** `'confusion_matrix'`

**Metadata fields:**

- `source`
- `labels`
- `schema`
- `format`

Plots a confusion matrix visualization using the data from the given source 
path, and the schema to be able to parse the data. Labels provide the names of 
the classes to be plotted on the x and y axes.

## ROC curve

**type:** `'roc'`

**Metadata fields:**

- `source`
- `format`
- `schema`

Plots a ROC curve using the data from the given source path. It assumes the 
schema includes three columns with the following names: 

* fpr
* tpr
* thresholds

Hovering on the ROC curve shows the threshold value used for the cursor's 
closest fpr and tpr values.

## Table

**type:** `'table'`

**Metadata fields:**

- `source`
- `header`
- `format`

Builds an HTML table out of the data at the given source path, where the 
`header` field specifies the values to be shown in the first row of the table. 
The table supports pagination.

## Tensorboard

**type:** `'tensorboard'`

**Metadata Fields:**

- `source`

Adds a "Start Tensorboard" button to the output page. Clicking this button 
starts a Tensorboard Pod in the Kubernetes cluster, and switches the button to
 "Open Tensorboard." Clicking this button again opens up the Tensorboard 
 interface in a new tab, pointing it to the logdir data specified in the 
 `source` field.

It's important to point out that Tensorboard instances are not completely 
managed by the Kubeflow Pipelines UI. The "Start Tensorboard" is only a 
convenience feature to avoid interrupting the user's workflow when looking at 
pipeline runs. The user is responsible for recycling or deleting those Pods 
separately using their Kubernetes management tools.

## Web app

**type:** `'web-app'`

**Metadata fields:**

- `source`

In order to provide more flexibility rendering custom output, 
this viewer supports specifying an HTML file that is created by the component 
and is rendered in the outputs page as is. It's important to note that this file 
must be self-contained, with no references to other files in the filesystem. It 
can still have absolute references to files on the web, however. Content running 
inside this web app is isolated in an iframe, and cannot communicate with the 
Kubeflow Pipelines UI.

## Markdown

**type:** `'markdown'`

**Metadata fields:**

- `storage`
- `source`

Renders Markdown strings in the output. The Markdown data can either be read from
a file stored remotely, or can be embedded in the metadata field `source`, in
which case the `storage` field's value must be `'inline'`.

## Next steps

* See how to [export metrics from your 
  pipeline](/docs/pipelines/metrics/pipelines-metrics/).
