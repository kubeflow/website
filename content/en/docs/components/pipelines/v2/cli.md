+++
title = "Command Line Interface"
description = "Interact with KFP via the CLI"
weight = 8
+++

<!-- TODO: Improve or standardize rendering of variables and placeholders -->
<!-- TODO: Standardize inline references to KFP CLI SDK -->

<!-- TODO: use /latest instead of /master when SDK goes GA -->
This section provides a summary of the available commands in the KFP CLI. For more comprehensive documentation about all the available commands in the KFP CLI, see [Command Line Interface][cli-reference-docs] in the [KFP SDK reference documentation][kfp-sdk-api-ref].

## Usage
The KFP CLI is installed with the KFP SDK as `kfp`.

### Check availability of KFP CLI

To check whether KFP CLI is installed in your environment, run the following command:

```shell
kfp --version
```

### General syntax

All commands in the KFP CLI use the following general syntax:

```shell
kfp [OPTIONS] COMMAND [ARGS]...
```

For example, to list all runs for a specific endpoint, run the following command:

```shell
kfp --endpoint http://my_kfp_endpoint.com run list
```

### Get help for a command

To get help for a specific command, use the argument `--help` directly in the command line. For example, to view guidance about the `kfp run` command, type the following command:

```shell
kfp run --help
```
## Main functons of the KFP CLI

You can use the KFP CLI to do the following:

* [Interact with KFP resources][(#cli_interact_with_kfp_resources)](https://github.com/sen-sam/website/edit/patch-1/content/en/docs/components/pipelines/v2/cli.md?pr=%2Fkubeflow%2Fwebsite%2Fpull%2F3392)

* [Compile pipelines](#cli_compile_pipelines)

* [Build containerized Python components](#cli_build_python_components)

### Interact with KFP resources

The majority of the KFP CLI commands let you create, read, update, or delete KFP resources from the KFP backend. All of these commands use the following general syntax:

```shell
kfp <resource_name> <action>
```

The `<resource_name>` argument can be one of the following:
* `run`
* `recurring-run`
* `pipeline`
* `experiment`

For all values of the `<resource_name>` argument, the `<action>` argument can be one of the following:
* `create`
* `list`
* `get`
* `delete`

Some resource names have additional resource-specific actions. The following table lists a few examples of resource-specific actions:

| Resource name | Additional resource-specific actions
|---------------|--------
| `run` | <ul><li>`archive`</li><li>`unarchive`</li></ul>
| `recurring-run` | <ul><li>`disable`</li><li>`enable`</li></ul>
| `experiment` | <ul><li>`archive`</li><li>`unarchive`</li></ul>
| `pipeline` |  | <ul><li>`create-version`</li><li>`list-versions`</li><li>`get-versions`</li><li>`delete-versions`</li></ul>

### Compile pipelines

You can use the `kfp dsl compile` command to compile pipelines or components defined in a Python file to IR YAML.

* To compile a pipeline definition defined in a Python file, run the following command.

  ```shell
  kfp dsl compile --py [PATH_TO_INPUT_PYTHON] --output [PATH_TO_OUTPUT_YAML] --function [PIPELINE_NAME]
  ```
  
  For example:
  
  ```shell
  kfp dsl compile --py path/to/pipeline.py --output path/to/output.yaml
  ```
  
  To compile a single pipeline or component from a Python file containing multiple pipeline or component definitions, use the `--function` argument.
  
  For example:
  
  ```shell
  kfp dsl compile --py path/to/pipeline.py --output path/to/output.yaml --function my_pipeline
  ```
  
  ```shell
  kfp dsl compile --py path/to/pipeline.py --output path/to/output.yaml --function my_component
  ```

* To specify pipeline parameters, use the `--pipeline-parameters` argument and provide the parameters as JSON.

  ```shell
  kfp dsl compile [PATH_TO_INPUT_PYTHON] --output [PATH_TO_OUTPUT_YAML] --pipeline-parameters [PIPELINE_PARAMETERS_JSON]
  ```

  For example:
  
  ```shell
  kfp dsl compile --py path/to/pipeline.py --output path/to/output.yaml --pipeline-parameters '{"param1": 2.0, "param2": "my_val"}'
  ```

### Build containerized Python components
<!-- TODO: Revisit the links after the refactoring is completed -->

You can author [containerized Python components][containerized-python-components] in the KFP SDK. This lets you use handle more source code with better code organization than the simpler [lightweight Python component][lightweight-python-component] authoring experience.

<!-- TODO(GA): remove --pre -->

#### Before you begin

Run the following command to install the KFP SDK with the additional Docker dependency:

```shell
pip install --pre kfp[all]
```

#### Build a containerized component

To build a containerized component, use the following convenience command in the KFP CLI. Using this command, you can build an image with all the source code found in `COMPONENTS_DIRECTORY`. The command uses the component found in the directory as the component runtime entrypoint.

```shell
kfp component build [OPTIONS] [COMPONENTS_DIRECTORY] [ARGS]...
```

For example:

```shell
kfp component build src/ --component-filepattern my_component --push-image
```

For more information about the arguments and flags supported by the `kfp component build` command, see [build](https://kubeflow-pipelines.readthedocs.io/en/master/source/cli.html#kfp-component-build) in the [KFP SDK API reference][kfp-sdk-api-ref]. For more information about creating containerized components, see [Authoring Python Containerized Components](/docs/components/pipelines/v2/author-a-pipeline/components/#2-containerized-python-components).

[cli-reference-docs]: https://kubeflow-pipelines.readthedocs.io/en/master/source/cli.html
[kfp-sdk-api-ref]: https://kubeflow-pipelines.readthedocs.io/en/master/index.html
[author-a-pipeline]: /docs/components/pipelines/v2/author-a-pipeline
[lightweight-python-component]: /docs/components/pipelines/v2/author-a-pipeline/components/#1-lighweight-python-function-based-components
[containerized-python-components]: /docs/components/pipelines/v2/author-a-pipeline/components/#2-containerized-python-components
