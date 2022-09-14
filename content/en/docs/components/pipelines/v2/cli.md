+++
title = "Command Line Interface"
description = "Interact with KFP via the CLI"
weight = 8
+++

<!-- TODO: use /latest instead of /master when SDK goes GA -->
This section provides a high-level summary of the KFP command line interface (CLI). For more detailed API documentation, see the [KFP CLI reference][cli-reference-docs].

## Usage
The KFP CLI is installed with the KFP SDK as `kfp`.

You can check that the KFP CLI is installed in your environment by running:

```shell
kfp --version
```

All commands assume the general structure:

```shell
kfp [OPTIONS] COMMAND [ARGS]...
```

For example, to list all runs for a specific endpoint:

```shell
kfp --endpoint http://my_kfp_endpoint.com run list
```

You can get help for a particular command directly on the command line using `--help`:

```shell
kfp run --help
```

The KFP CLI serves three main functions:
1. Interacting with KFP resources
2. Compiling pipelines
3. Building Python-based containerized components

## Interact with KFP resources
The majority of the KFP CLI commands involve creating, reading, updating, or deleting KFP resources via the KFP backend. All of these commands take a common structure:

```shell
kfp <resource_name> <action>
```

`<resource_name>` can be one of the following:
* `run`
* `recurring-run`
* `pipeline`
* `experiment`

All resources support the following actions:
* `create`
* `list`
* `get`
* `delete`

Some resources have resource-specific actions, including:
* For `run`:
  * `archive`
  * `unarchive`

* For `recurring-run`:
  * `disable`
  * `enable`

* For `experiment`
  * `archive`
  * `unarchive`

* For `pipeline`:
  * `create-version`
  * `list-versions`
  * `get-versions`
  * `delete-versions`


## Compile pipelines
The KFP supports compiling a pipeline defined in a Python file to YAML using the `kfp dsl compile` command:

```shell
kfp dsl compile --py path/to/pipeline.py --output path/to/output.yaml
```

To compile a pipeline from a Python file containing multiple pipeline definitions or to compile a component, provide a `--function` argument:

```shell
kfp dsl compile --py path/to/pipeline.py --output path/to/output.yaml --function my_component
```

The CLI compiler also accepts a `--pipeline-parameters` argument as JSON:
```shell
kfp dsl compile --py path/to/pipeline.py --output path/to/output.yaml --pipeline-parameters '{"param1": 2.0, "param2": "my_val"}'
```

## Build KFP containerized Python components
The KFP SDK support authoring [containerized Python components][containerized-python-components], allowing the use of more and better-organized source code than does the simpler [lightweight Python component][lightweight-python-component] authoring experience.

The KFP CLI provides a convenience command for streamlining the process of building a containerized component:

```shell
kfp component build [OPTIONS] COMPONENTS_DIRECTORY [ARGS]...
```

This command builds an image with all the source code found in `COMPONENTS_DIRECTORY` and uses the component found in the directory as the component runtime entrypoint.

```shell
kfp component build src/ --component-filepattern my_component --push-image
```

For detailed information about all arguments/flags, see [CLI reference documentation](https://kubeflow-pipelines.readthedocs.io/en/master/source/cli.html#kfp-component-build). For information about creating containerized components, see [Authoring Python Containerized Components][/docs/components/pipelines/author-a-pipeline/components/#2-containerized-python-components].

<!-- TODO(GA): remove --pre -->
Note: To use this command you'll need to install the KFP SDK with the additional Docker dependency: `pip install --pre kfp[all]`.

[cli-reference-docs]: https://kubeflow-pipelines.readthedocs.io/en/master/source/cli.html
[author-a-pipeline]: /docs/components/pipelines/author-a-pipeline
[lightweight-python-component]: /docs/components/pipelines/author-a-pipeline/components/#1-lighweight-python-function-based-components
[containerized-python-components]: /docs/components/pipelines/author-a-pipeline/components/#2-containerized-python-components