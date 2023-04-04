+++
title = "Run a Pipeline"
description = "Execute a pipeline on the KFP backend"
weight = 8
+++

{{% kfp-v2-keywords %}}

The KFP offers three ways to run a pipeline.

## 1. Run from the KFP Dashboard
The first and easiest way to run a pipeline is by submitting it via the KFP dashboard.

To submit a pipeline to the KFP Dashboard:

1. [Compile the pipeline][compile-a-pipeline] to IR YAML.

2.  From the Dashboard, select "+ Upload pipeline".

<img src="/docs/images/pipelines/submit-a-pipeline-on-dashboard.png" 
  alt="Upload pipeline button"
  class="mt-3 mb-3 border border-info rounded">

3. Upload the pipeline IR YAML to "Upload a file", populate the upload pipeline form, and click "Create".

<img src="/docs/images/pipelines/upload-a-pipeline.png" 
  alt="Upload pipeline screen"
  class="mt-3 mb-3 border border-info rounded">

4. From the Runs tab, select "+ Create run":

<img src="/docs/images/pipelines/create-run.png" 
  alt="Create run button"
  class="mt-3 mb-3 border border-info rounded">

5. Choose the pipeline you uploaded, provide a name, any run parameters, and click "Start".
<img src="/docs/images/pipelines/start-a-run.png" 
  alt="Start a run screen"
  class="mt-3 mb-3 border border-info rounded">


## 2. Run from the KFP SDK client
You may also programatically submit pipeline runs from the KFP SDK client. The client supports two ways of submitting runs: from IR YAML or from a Python pipeline function. For either approach, start by instantiating a `Client` using the `host` URL of your KFP instance:

```python
from kfp.client import Client
client = Client(host='<YOUR_HOST_URL>')
```

To submit IR YAML for execution use the `.create_run_from_pipeline_package` method:

```python
client.create_run_from_pipeline_package('pipeline.yaml', arguments={'param': 'a', 'other_param': 2})
```

To submit a Python pipeline function for execution use the `.create_run_from_pipeline_func` convenience method, which wraps compilation and run submission into one method:

```python
client.create_run_from_pipeline_func('pipeline.yaml', arguments={'param': 'a', 'other_param': 2})
```

See the [KFP SDK Client reference documentation][kfp-sdk-api-ref-client] for a detailed description of the `Client` constructor and method parameters.

## 3. Run from the KFP SDK CLI
The `kfp run create` command allows you to submit a pipeline from the command line. `kfp run create --help` shows that this command takes the form:

```shell
kfp run create [OPTIONS] [ARGS]...
```

For example, the following command submits the `path/to/pipeline.yaml` IR YAML to the KFP backend:

```shell
kfp run create --experiment-name my-experiment --package-file path/to/pipeline.yaml
```

For more information about the `kfp run create` command, see the [KFP Command Line Interface reference documentation][kfp-run-create-reference-docs]. For more information on the KFP CLI generally see [Command Line Interface user docs][kfp-cli].

[compile-a-pipeline]: /docs/components/pipelines/v2/compile-a-pipeline
[kfp-sdk-api-ref-client]: https://kubeflow-pipelines.readthedocs.io/en/master/source/client.html
[kfp-cli]: /docs/components/pipelines/v2/cli/
[kfp-run-create-reference-docs]: https://kubeflow-pipelines.readthedocs.io/en/master/source/cli.html#kfp-run-create