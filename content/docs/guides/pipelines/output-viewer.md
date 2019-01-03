+++
title = "Use an Output Viewer"
description = "Using output viewers for pipelines components."
weight = 8
+++

The Kubeflow Pipelines UI has built-in support for several types of 
visualizations, in order to provide rich performance evaluation and comparison. 
Components can use these visualizations by writing a JSON file 
to their local filesystem at any point during their execution. 

## Metadata for the output viewers

The pipeline component must write a JSON file specifying metadata for the
output viewers. The file name must be `/metadata.json`, and the file
must be written to the root level of the container filesystem.

The JSON specifies an array of outputs, each of which describes metadata for an 
output viewer. The JSON structure looks like this:

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

If the component writes such a file to its container filesystem, Kubeflow 
Pipelines extracts the file, and the UI uses the file to generate the 
specified viewer(s). The metadata specifies where the artifact data should be 
loaded from, and then the UI loads the data **into memory** and renders it. 
It's important to keep this data at a level that's manageable by the UI, for 
example by running a sampling step before exporting the file as an artifact.

These are the metadata fields that you can specify:

| Field name      | Description |
| -------------   | ------------- |
| `format`        | Specifies the format of the artifact data, default is 'csv'. *NOTE* The only format supported as of now is 'csv'. |
| `header`        | A list of strings that are used as the header of the artifact data. |
| `labels`        | A list of strings that are used to label artifact columns/rows. |
| `predicted_col` | Name of the predicted column. |
| `schema`        | A list of {type, name} objects that specify the schema of the artifact data. |
| `source`        | Full path to data. This can contain wildcards '*', in which case the data is concatenated before it's displayed by the UI. |
| `storage`       | Storage provider service name, default is 'gcs'. |
| `target_col`    | Name of the target column. |
| `type`          | Name of the viewer, one of the ones below. |

Below are the supported viewer types and the required metadata fields for each
type:

## Confusion matrix

**Metadata fields:**

- `source`
- `labels`
- `schema`
- `format`

Plots a confusion matrix visualization using the data from the given source 
path, and the schema to be able to parse the data. Labels provide the names of 
the classes to be plotted on the x and y axes.

## ROC curve

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

**Metadata fields:**

- `source`
- `header`
- `format`

Builds an HTML table out of the data at the given source path, where the 
`header` field specifies what shows up in the first row of the table. The table 
supports pagination.

## Tensorboard

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

**Metadata fields:**

- `source`

In order to provide more flexibility rendering custom output, 
this viewer supports specifying an HTML file that is created by the component 
and is rendered in the outputs page as is. It's important to note that this file 
must be self-contained, with no references to other files in the filesystem. It 
can still have absolute references to files on the web, however. Content running 
inside this web app is isolated in an iframe, and cannot communicate with the 
Kubeflow Pipelines UI.
