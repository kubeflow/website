+++
title = "Visualize Results in the Pipelines UI"
description = "Visualizing the results of your pipelines component"
weight = 80
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

This page shows you how to use the Kubeflow Pipelines UI to visualize output 
from a Kubeflow Pipelines component. 
For details about how to build a component, see the guide to 
[building your own component](/docs/pipelines/sdk/build-component/).

Kubeflow Pipelines provides a new method of generating visualizations. See the
guide to [Python Based Visualizations](/docs/pipelines/sdk/python-based-visualizations/).

## Introduction

The Kubeflow Pipelines UI offers built-in support for several types of 
visualizations, which you can use to provide rich performance evaluation and 
comparison data. To make use of this programmable UI, your pipeline component 
must write a JSON file to the component's local filesystem. You can do this at 
any point during the pipeline execution.

You can view the output visualizations in the following places on the Kubeflow
Pipelines UI:

* The **Run output** tab shows the visualizations for all pipeline steps in the
  selected run. To open the tab in the Kubeflow Pipelines UI:

  1. Click **Experiments** to see your current pipeline experiments.
  1. Click the *experiment name* of the experiment that you want to view.
  1. Click the *run name* of the run that you want to view.
  1. Click the **Run output** tab.

    <img src="/docs/images/taxi-tip-run-output.png" 
      alt="Output visualization from a pipeline run"
      class="mt-3 mb-3 border border-info rounded">

* The **Artifacts** tab shows the visualization for the selected pipeline step.
  To open the tab in the Kubeflow Pipelines UI:

  1. Click **Experiments** to see your current pipeline experiments.
  1. Click the *experiment name* of the experiment that you want to view.
  1. Click the *run name* of the run that you want to view.
  1. On the **Graph** tab, click the step representing the pipeline component 
    that you want to view. The step details slide into view, showing the
    **Artifacts** tab.

    <img src="/docs/images/taxi-tip-prediction-step-output-table.png" 
      alt="Table-based visualization from a pipeline component"
      class="mt-3 mb-3 border border-info rounded">

All screenshots and code snippets on this page come from a 
sample pipeline that you can run directly from the Kubeflow Pipelines UI.
See the [sample description and links below](#example-source).

## Writing out metadata for the output viewers

The pipeline component must write a JSON file specifying metadata for the
output viewer(s) that you want to use for visualizing the results. The component
must also export a file output artifact with an artifact name of `mlpipeline-ui-metadata`,
or else the Kubeflow Pipelines UI will not render the visualization. In other words,
the `.outputs.artifacts` setting for the generated pipeline component should show:
`- {name: mlpipeline-ui-metadata, path: /mlpipeline-ui-metadata.json}`.
The JSON filepath does not matter, although `/mlpipeline-ui-metadata.json`
is used for consistency in the examples below.

The JSON specifies an array of `outputs`. Each `outputs` entry describes the
metadata for an output viewer. The JSON structure looks like this:

```
{
  "version": 1,
  "outputs": [
    {
      "type": "confusion_matrix",
      "format": "csv",
      "source": "my-dir/my-matrix.csv",
      "schema": [
        {"name": "target", "type": "CATEGORY"},
        {"name": "predicted", "type": "CATEGORY"},
        {"name": "count", "type": "NUMBER"},
      ],
      "labels": "vocab"
    },
    {
      ...
    }
  ]
}
```

If the component writes such a file to its container filesystem, the Kubeflow
Pipelines system extracts the file, and the Kubeflow Pipelines UI uses the file
to generate the specified viewer(s). The metadata specifies where to load the
artifact data from. The Kubeflow Pipelines UI loads the data **into memory**
and renders it. *Note:* You should keep this data at a volume that's manageable
by the UI, for example by running a sampling step before exporting the file as
an artifact.

The table below shows the available metadata fields that you can specify in the 
`outputs` array. Each `outputs` entry must have a `type`. Depending on value of 
`type`, other fields may also be required as described in the list of output 
viewers later on the page.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Field name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>format</code></td>
        <td>The format of the artifact data. The default is <code>csv</code>. 
          <em>Note:</em> The only format currently available is 
          <code>csv</code>.
        </td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td>A list of strings to be used as headers for the artifact data. For 
          example, in a table these strings are used in the first row.</td>
      </tr>
      <tr>
        <td><code>labels</code></td>
        <td>A list of strings to be used as labels for artifact columns or 
          rows.</td>
      </tr>
      <tr>
        <td><code>predicted_col</code></td>
        <td>Name of the predicted column.</td>
      </tr>
      <tr>
        <td><code>schema</code></td>
        <td>A list of <code>{type, name}</code> objects that specify the schema 
          of the artifact data.</td>
      </tr>
      <tr>
        <td><code>source</code></td>
        <td><p>The full path to the data. The available locations
          include <code>http</code>, <code>https</code>, 
          <a href="https://aws.amazon.com/s3/">Amazon S3</a>, 
          <a href="https://docs.minio.io/">Minio</a>, and 
          <a href="https://cloud.google.com/storage/docs/">Google Cloud 
          Storage</a>.</p>
          <p>The path can contain wildcards ‘*’, in 
          which case the Kubeflow Pipelines UI concatenates the data from the 
          matching source files.</p>
          <p><code>source</code> can also contain inlined string data instead of
          a path when <code>storage='inline'</code>.</p>
          </td>
      </tr>
      <tr>
        <td><code>storage</code></td>
        <td><p>(Optional) When <code>storage</code> is <code>inline</code>, the value of
        <code>source</code> is parsed as inline data instead of a path. This applies
        to all types of outputs except <code>tensorboard</code>. See 
        <a href="#markdown">Markdown</a> or <a href="#web-app">Web app</a>
        below as examples.</p>
        <p><b>Be aware</b>, support for inline visualizations, other than
        markdown, was introduced in Kubeflow Pipelines 0.2.5. Before using these
        visualizations, [upgrade  your Kubeflow Pipelines cluster](/docs/pipelines/upgrade/)
        to version 0.2.5 or higher.</p>
        </td>
      </tr>
      <tr>
        <td><code>target_col</code></td>
        <td>Name of the target column.</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td>Name of the viewer to be used to visualize the data. The list 
          <a href="#output-types">below</a> shows the available types.</td>
      </tr>
    </tbody>
  </table>
</div>

<a id="output-types"></a>
## Available output viewers

The sections below describe the available viewer types and the **required** 
metadata fields for each type.

### Confusion matrix

**Type:** `confusion_matrix`

**Required metadata fields:**

- `format`
- `labels`
- `schema`
- `source`

**Optional metadata fields:**

- `storage`

The `confusion_matrix` viewer plots a confusion matrix visualization of the data
from the given `source` path, using the `schema` to parse the data. The `labels`
provide the names of the classes to be plotted on the x and y axes.

Specify `'storage': 'inline'` to embed raw content of the
confusion matrix CSV file as a string in `source` field directly.

**Example:**

```Python
  metadata = {
    'outputs' : [{
      'type': 'confusion_matrix',
      'format': 'csv',
      'schema': [
        {'name': 'target', 'type': 'CATEGORY'},
        {'name': 'predicted', 'type': 'CATEGORY'},
        {'name': 'count', 'type': 'NUMBER'},
      ],
      'source': <CONFUSION_MATRIX_CSV_FILE>,
      # Convert vocab to string because for bealean values we want "True|False" to match csv data.
      'labels': list(map(str, vocab)),
    }]
  }
  with file_io.FileIO('/mlpipeline-ui-metadata.json', 'w') as f:
    json.dump(metadata, f)
```

**Visualization on the Kubeflow Pipelines UI:**

<img src="/docs/images/taxi-tip-confusion-matrix-step-output.png" 
  alt="Confusion matrix visualization from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

<a id="type-markdown"></a>
### Markdown

**Type:** `markdown`

**Required metadata fields:**

- `source`

**Optional metadata fields:**

- `storage`

The `markdown` viewer renders Markdown strings on the Kubeflow Pipelines UI. 
The viewer can read the Markdown data from the following locations:

* A Markdown-formatted string embedded in the `source` field. The value of the
 `storage` field must be `inline`.
* Markdown code in a remote file, at a path specified in the `source` field.
  The `storage` field can be empty or contain any value except `inline`.

**Example:**
```Python
  metadata = {
    'outputs' : [
    # Markdown that is hardcoded inline
    {
      'storage': 'inline',
      'source': '# Inline Markdown\n[A link](https://www.kubeflow.org/)',
      'type': 'markdown',
    },
    # Markdown that is read from a file
    {
      'source': 'gs://your_project/your_bucket/your_markdown_file',
      'type': 'markdown',
    }]
  }
  with file_io.FileIO('/mlpipeline-ui-metadata.json', 'w') as f:
    json.dump(metadata, f)
```

**Visualization on the Kubeflow Pipelines UI:**

<img src="/docs/images/markdown-output.png" 
  alt="Markdown visualization from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

### ROC curve

**Type:** `roc`

**Required metadata fields:**

- `format`
- `schema`
- `source`

The `roc` viewer plots a receiver operating characteristic 
([ROC](https://en.wikipedia.org/wiki/Receiver_operating_characteristic))
curve using the data from the given source path. The Kubeflow Pipelines UI
assumes that the schema includes three columns with the following names:

* `fpr` (false positive rate)
* `tpr` (true positive rate)
* `thresholds`

**Optional metadata fields:**

- `storage`

When viewing the ROC curve, you can hover your cursor over the ROC curve to see 
the threshold value used for the cursor's closest `fpr` and `tpr` values.

Specify `'storage': 'inline'` to embed raw content of the ROC
curve CSV file as a string in `source` field directly.

**Example:**

```Python
  df_roc = pd.DataFrame({'fpr': fpr, 'tpr': tpr, 'thresholds': thresholds})
  roc_file = os.path.join(args.output, 'roc.csv')
  with file_io.FileIO(roc_file, 'w') as f:
    df_roc.to_csv(f, columns=['fpr', 'tpr', 'thresholds'], header=False, index=False)

  metadata = {
    'outputs': [{
      'type': 'roc',
      'format': 'csv',
      'schema': [
        {'name': 'fpr', 'type': 'NUMBER'},
        {'name': 'tpr', 'type': 'NUMBER'},
        {'name': 'thresholds', 'type': 'NUMBER'},
      ],
      'source': roc_file
    }]
  }
  with file_io.FileIO('/mlpipeline-ui-metadata.json', 'w') as f:
    json.dump(metadata, f)
```

**Visualization on the Kubeflow Pipelines UI:**

<img src="/docs/images/taxi-tip-roc-step-output.png" 
  alt="ROC curve visualization from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

### Table

**Type:** `table`

**Required metadata fields:**

- `format`
- `header`
- `source`

**Optional metadata fields:**

- `storage`

The `table` viewer builds an HTML table out of the data at the given `source`
path, where the `header` field specifies the values to be shown in the first row
of the table. The table supports pagination.

Specify `'storage': 'inline'` to embed CSV table content string
in `source` field directly.

**Example:**

```Python
  metadata = {
    'outputs' : [{
      'type': 'table',
      'storage': 'gcs',
      'format': 'csv',
      'header': [x['name'] for x in schema],
      'source': prediction_results
    }]
  }
  with open('/mlpipeline-ui-metadata.json', 'w') as f:
    json.dump(metadata, f)
```

**Visualization on the Kubeflow Pipelines UI:**

<img src="/docs/images/taxi-tip-prediction-step-output-table.png" 
  alt="Table-based visualization from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

### TensorBoard

**Type:** `tensorboard`

**Required metadata Fields:**

- `source`

The `tensorboard` viewer adds a **Start Tensorboard** button to the output page. 

When viewing the output page, you can:

* Click **Start Tensorboard** to start a 
  [TensorBoard](https://www.tensorflow.org/guide/summaries_and_tensorboard) Pod
  in your Kubeflow cluster. The button text switches to **Open Tensorboard**. 
* Click **Open Tensorboard** to open the TensorBoard interface in a new tab, 
  pointing to the logdir data specified in the `source` field.
* Click **Delete Tensorboard** to shutdown the Tensorboard instance.

**Note:** The Kubeflow Pipelines UI doesn't fully manage your TensorBoard 
instances. The "Start Tensorboard" button is a convenience feature so that
you don't have to interrupt your workflow when looking at pipeline runs. You're
responsible for recycling or deleting the TensorBoard Pods using your Kubernetes
management tools.

**Example:**

```Python
  metadata = {
    'outputs' : [{
      'type': 'tensorboard',
      'source': args.job_dir,
    }]
  }
  with open('/mlpipeline-ui-metadata.json', 'w') as f:
    json.dump(metadata, f)
```

**Visualization on the Kubeflow Pipelines UI:**

<img src="/docs/images/taxi-tip-training-step-output-tensorboard.png" 
  alt="TensorBoard option output from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

### Web app

**Type:** `web-app`

**Required metadata fields:**

- `source`

**Optional metadata fields:**

- `storage`

The `web-app` viewer provides flexibility for rendering custom output. You can
specify an HTML file that your component creates, and the Kubeflow Pipelines UI
renders that HTML in the output page. The HTML file must be self-contained, with
no references to other files in the filesystem. The HTML file can contain
absolute references to files on the web. Content running inside the web app is
sandboxed in an iframe and cannot communicate with the Kubeflow Pipelines UI.

Specify `'storage': 'inline'` to embed raw html in `source` field directly.

**Example:**

```Python
  static_html_path = os.path.join(output_dir, _OUTPUT_HTML_FILE)
  file_io.write_string_to_file(static_html_path, rendered_template)

  metadata = {
    'outputs' : [{
      'type': 'web-app',
      'storage': 'gcs',
      'source': static_html_path,
    }, {
      'type': 'web-app',
      'storage': 'inline',
      'source': '<h1>Hello, World!</h1>',
    }]
  }
  with file_io.FileIO('/mlpipeline-ui-metadata.json', 'w') as f:
    json.dump(metadata, f)
```

**Visualization on the Kubeflow Pipelines UI:**

<img src="/docs/images/taxi-tip-analysis-step-output-webapp-popped-out.png" 
  alt="Web app output from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

<a id="example-source"></a>
## Source of examples on this page

The above examples come from the *tax tip prediction* sample that is
pre-installed when you deploy Kubeflow. 

You can run the sample by selecting 
**[Sample] ML - TFX - Taxi Tip Prediction Model Trainer** from the 
Kubeflow Pipelines UI. For help getting started with the UI, follow the 
[Kubeflow Pipelines quickstart](/docs/pipelines/pipelines-quickstart/).

<!--- TODO: Will replace the tfx cab with tfx oss when it is ready.-->
The pipeline uses a number of prebuilt, reusable components, including:

* The [Confusion Matrix 
  component](https://github.com/kubeflow/pipelines/blob/master/components/local/confusion_matrix/src/confusion_matrix.py)
  which writes out the data for the `confusion_matrix` viewer.
* The [ROC 
  component](https://github.com/kubeflow/pipelines/blob/master/components/local/roc/src/roc.py)
  which writes out the data for the `roc` viewer.
* The [dnntrainer 
  component](https://github.com/kubeflow/pipelines/blob/master/components/kubeflow/dnntrainer/src/trainer/task.py)
  which writes out the data for the `tensorboard` viewer.
* The [tfma 
  component](https://github.com/kubeflow/pipelines/blob/master/components/dataflow/tfma/src/model_analysis.py)
  which writes out the data for the `web-app` viewer.
* The [dataflow predict 
  component](https://github.com/kubeflow/pipelines/blob/master/components/dataflow/predict/src/predict.py)
  which writes out the data for the `table` viewer.

## Usage in lightweight python components

For lightweight components, the syntax is slightly different. You can refer to
[the lightweight python component notebook example](https://github.com/kubeflow/pipelines/blob/master/samples/core/lightweight_component/lightweight_component.ipynb) to learn more about declaring output visualizations.

## Next step

See how to [export metrics from your 
pipeline](/docs/pipelines/metrics/pipelines-metrics/).
