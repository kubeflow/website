+++
title = "Run a Pipeline"
description = "Run a pipeline"
weight = 6
+++

You can run a pipeline in three ways:

* [Run a pipeline from the KFP Dashboard](#run_from_dashboard)

* [Run a pipeline from the KFP SDK client](#run_from_sdk_client)

* [Run a pipeline from the KFP SDK CLI](#run_from_sdk_cli)

<!-- TODO: Create a pipeline under an existing pipeline from the KFP Dashboard #} -->

## Run a pipeline from the KFP Dashboard <a id="run_from_dashboard"></a>

You can run a pipeline by submitting it to the KFP Dashboard. This is the easiest way to run a pipeline.

To submit a pipeline to the KFP Dashboard:

1. [Compile the pipeline][compile-a-pipeline] to IR YAML.

1. On the KFP Dashboard, click **+ Upload pipeline**.

    <img src="/docs/images/pipelines/submit-a-pipeline-on-dashboard.png" alt="Upload pipeline button" class="mt-3 mb-3 border border-info rounded">

1. On the **Upload Pipeline or Pipeline Version** page, perform the following steps:

   a. Select the **Create a new pipeline** option.
   
   b. Click **Upload a file** to upload the compiled IR YAML definition of your pipeline.
   
      Note: To create a new pipeline based on an existing pipeline, select the **Create a new pipeline version under an existing pipeline** option. If you select this option, you can select a pipeline template.
      
      <img src="/docs/images/pipelines/upload-a-pipeline.png"  alt="Upload pipeline screen" class="mt-3 mb-3 border border-info rounded">

1. Complete the other fields on the page and then click **Create**.

1. Click the **Runs** tab and then click **+ Create run**.

    <img src="/docs/images/pipelines/create-run.png" alt="Create run button" class="mt-3 mb-3 border border-info rounded">

1. In the **Pipeline** field, click **Choose** to select the pipeline you uploaded.

1. Specify any additional run parameters and click **Start**.

    <img src="/docs/images/pipelines/start-a-run.png" alt="Start a run screen" class="mt-3 mb-3 border border-info rounded">

## Run a pipeline from the KFP SDK client <a id="run_from_sdk_client"></a>

You can programmatically submit a pipeline run from the KFP SDK client in two ways:

* Submit an IR YAML
* Submit a Python pipeline function for execution

To submit an IR YAML for execution:

1. Instantiate a `Client` by specifying the `host` URL of your KFP instance:
    ```python
    from kfp.client import Client
    client = Client(host='<YOUR_HOST_URL>')
    ```
    For more information about the `Client` constructor and method parameters, see the  [kfp.client][kfp-sdk-api-ref-client] in the [KFP SDK API reference][kfp-sdk-api-ref].

1. Use the `.create_run_from_pipeline_package` method:

    ```python
    client.create_run_from_pipeline_package('pipeline.yaml', arguments={'param': 'a', 'other_param': 2})
    ```

To submit a Python pipeline function for execution:

1. Instantiate a `Client` by specifying the `host` URL of your KFP instance:
    ```python
    from kfp.client import Client
    client = Client(host='<YOUR_HOST_URL>')
    ```

1. Use the `.create_run_from_pipeline_func` convenience method. This wraps the compilation and run submission into one method.

    ```python
    client.create_run_from_pipeline_func('pipeline.yaml', arguments={'param': 'a', 'other_param': 2})
    ```

## Run a pipeline from the KFP SDK CLI <a id="run_from_sdk_cli">

You can submit a pipeline from the KFP SDK CLI using the `kfp run create` command. To run this command, use the following syntax:

```shell
kfp run create [OPTIONS] [ARGS]...
```

For example, run the following command to submit the IR YAML file at `path/to/pipeline.yaml` to the KFP backend:

```shell
kfp run create --experiment-name my-experiment --package-file path/to/pipeline.yaml param="a" other_param=2
```

For more information about the `kfp run create` command, see [run create][kfp-run-create-reference-docs] in the [KFP SDK API reference][kfp-sdk-api-ref]. For more information on the available commands in the KFP CLI, see [Command Line Interface][kfp-cli] in the [KFP SDK API reference][kfp-sdk-api-ref].

[compile-a-pipeline]: /docs/components/pipelines/v2/compile-a-pipeline/
[kfp-sdk-api-ref-client]: https://kubeflow-pipelines.readthedocs.io/en/master/source/client.html
[kfp-sdk-api-ref]: https://kubeflow-pipelines.readthedocs.io/en/master/index.html
[kfp-cli]: /docs/components/pipelines/v2/cli/
[kfp-run-create-reference-docs]: https://kubeflow-pipelines.readthedocs.io/en/master/source/cli.html#kfp-run-create
