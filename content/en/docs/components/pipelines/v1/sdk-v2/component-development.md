+++
title = "Building Components"
description = "A tutorial on how to use the Pipelines SDK v2 to create components and use them in a pipeline"
weight = 40
+++

<!-- no index to improve relative search ranking of KFP SDK v2 docs over KFP SDK v1 v2-namepsace docs -->
{{% no-index %}}

A pipeline component is a self-contained set of code that performs one step in
your ML workflow. This document describes the concepts required to build
components, and demonstrates how to get started building components.

**Note:** This guide demonstrates how to build components using the Pipelines SDK v2.
Currently, Kubeflow Pipelines v2 is in development. You can use this guide to start
building and running pipelines that are compatible with the Pipelines SDK v2.

[Learn more about Pipelines SDK v2][kfpv2].

[kfpv2]: https://www.kubeflow.org/docs/components/pipelines/sdk-v2/v2-compatibility/

## Before you begin

Run the following command to install the Kubeflow Pipelines SDK v1.8.

```bash
pip install kfp==1.8
```

For more information about the Kubeflow Pipelines SDK, see the [SDK reference guide][sdk-ref].

[sdk-ref]: https://kubeflow-pipelines.readthedocs.io/en/stable/index.html

## Understanding pipeline components

Pipeline components are self-contained sets of code that perform one step in
your ML workflow, such as preprocessing data or training a model. To create a
component, you must _build the component's implementation_ and _define the
component specification_.

Your component's implementation includes the component's executable code and
the Docker container image that the code runs in.  [Learn more about designing
a pipeline component](#design).

Once you have built your component's implementation, you can define your
component's interface as a component specification. A component specification
defines:

*   The component's inputs and outputs.
*   The container image that your component's code runs in, the command to use
    to run your component's code, and the command-line arguments to pass to
    your component's code.
*   The component's metadata, such as the name and description.

[Learn more about creating a component specification](#component-spec).

If your component's code is implemented as a Python function, use the
Kubeflow Pipelines SDK to package your function as a component. [Learn more
about building Python function-based components][python-function-components].

[python-function-components]: https://www.kubeflow.org/docs/pipelines/sdk/python-function-components/

<a name="design"></a>
## Designing a pipeline component

When Kubeflow Pipelines executes a component, a container image is started in a
Kubernetes Pod. Your component's inputs and the paths to your components outputs
are passed in as command-line arguments.

When you design your component's code, consider the following:

*   Which inputs and outputs are _parameters_ and which are _artifacts_? 
    Component inputs and outputs are classified as either _parameters_ or
    _artifacts_, depending on their data type and how they are passed to
    components as inputs. All outputs are returned as files, using the the
    paths that Kubeflow Pipelines provides.
    

    _Parameters_ typically represent settings that affect the behavior of your pipeline.
    Parameters are passed into your component by value, and can be of any of
    the following types: `int`, `float`, `str`, `bool`, `dict`, or `list`. Since parameters are
    passed by value, the quantity of data passed in a parameter must be appropriate
    to pass as a command-line argument.

    _Artifacts_ represent large or complex data structures like datasets or models, and
    are passed into components as a reference to a file path. 

    If you have large amounts of string data to pass to your component, such as a JSON
    file, annotate that input or output as a type of [`Artifact`][kfp-artifact], such
    as [`Dataset`][kfp-artifact], to let Kubeflow Pipelines know to pass this to
    your component as a file.  

    In addition to the artifact’s data, you can also read and write the artifact's
    metadata. For output artifacts, you can record metadata as key-value pairs, such
    as the accuracy of a trained model. For input artifacts, you can read the
    artifact's metadata &mdash; for example, you could use metadata to decide if a
    model is accurate enough to deploy for predictions.

*   To return an output from your component, the output's data must be stored as a file.
    When you define your component, you let Kubeflow Pipelines know what outputs your
    component produces. When your pipeline runs, Kubeflow Pipelines passes the
    paths that you use to store your component's outputs as inputs to your component.
*   Outputs are typically written to a single file. In some cases, you may need to
    return a directory of files as an output. In this case, create a directory at the
    output path and write the output files to that location. In both cases, it may be
    necessary to create parent directories if they do not exist.
*   Your component's goal may be to create a dataset in an external service,
    such as a BigQuery table. In this case, it may make sense for the component
    to output an identifier for the produced data, such as a table name,
    instead of the data itself. We recommend that you limit this pattern to
    cases where the data must be put into an external system instead of keeping it
    inside the Kubeflow Pipelines system.
*   Since your inputs and output paths are passed in as command-line
    arguments, your component's code must be able to read inputs from the
    command line. If your component is built with Python, libraries such as
    [argparse](https://docs.python.org/3/library/argparse.html) and
    [absl.flags](https://abseil.io/docs/python/guides/flags) make it easier to
    read your component's inputs.
*   Your component's code can be implemented in any language, so long as it can
    run in a container image.

The following is an example program written using Python3. This program reads a
given number of lines from an input file and writes those lines to an output
file. This means that this function accepts three command-line parameters: 

*   The path to the input file.
*   The number of lines to read.
*   The path to the output file. 

```python
#!/usr/bin/env python3
import argparse
from pathlib import Path

# Function doing the actual work (Outputs first N lines from a text file)
def do_work(input1_file, output1_file, param1):
  for x, line in enumerate(input1_file):
    if x >= param1:
      break
    _ = output1_file.write(line)
  
# Defining and parsing the command-line arguments
parser = argparse.ArgumentParser(description='My program description')
# Paths must be passed in, not hardcoded
parser.add_argument('--input1-path', type=str,
  help='Path of the local file containing the Input 1 data.')
parser.add_argument('--output1-path', type=str,
  help='Path of the local file where the Output 1 data should be written.')
parser.add_argument('--param1', type=int, default=100,
  help='The number of lines to read from the input and write to the output.')
args = parser.parse_args()

# Creating the directory where the output file is created (the directory
# may or may not exist).
Path(args.output1_path).parent.mkdir(parents=True, exist_ok=True)

with open(args.input1_path, 'r') as input1_file:
    with open(args.output1_path, 'w') as output1_file:
        do_work(input1_file, output1_file, args.param1)
```

If this program is saved as `program.py`, the command-line invocation of this
program is:

```bash
python3 program.py --input1-path <path-to-the-input-file> \
  --param1 <number-of-lines-to-read> \
  --output1-path <path-to-write-the-output-to> 
```

## Containerize your component's code

For Kubeflow Pipelines to run your component, your component must be packaged
as a [Docker][docker] container image and published to a container registry
that your Kubernetes cluster can access. The steps to create a container image
are not specific to Kubeflow Pipelines. To make things easier for you, this
section provides some guidelines on standard container creation.

1.  Create a [Dockerfile][dockerfile] for your container. A Dockerfile
    specifies:

    *   The base container image. For example, the operating system that your
        code runs on.
    *   Any dependencies that need to be installed for your code to run. 
    *   Files to copy into the container, such as the runnable code for this
        component.

    The following is an example Dockerfile.

    ```
    FROM python:3.7
    RUN python3 -m pip install keras
    COPY ./src /pipelines/component/src
    ```
    
    In this example:

    *   The base container image is [`python:3.7`][python37].
    *   The `keras` Python package is installed in the container image.
    *   Files in your `./src` directory are copied into
        `/pipelines/component/src` in the container image.
  
1.  Create a script named `build_image.sh ` that uses Docker to build your
    container image and push your container image to a container registry.
    Your Kubernetes cluster must be able to access your container registry
    to run your component. Examples of container registries include [Google
    Container Registry][google-container-registry] and 
    [Docker Hub][docker-hub].

    The following example builds a container image, pushes it to a container
    registry, and outputs the strict image name. It is a best practice to use
    the strict image name in your component specification to ensure that you
    are using the expected version of a container image in each component
    execution.

    ```bash
    #!/bin/bash -e
    image_name=gcr.io/my-org/my-image
    image_tag=latest
    full_image_name=${image_name}:${image_tag}

    cd "$(dirname "$0")" 
    docker build -t "${full_image_name}" .
    docker push "$full_image_name"

    # Output the strict image name, which contains the sha256 image digest
    docker inspect --format="{{index .RepoDigests 0}}" "${full_image_name}"
    ``` 

    In the preceding example: 

    *   The `image_name` specifies the full name of your container image in the
        container registry.
    *   The `image_tag` specifies that this image should be tagged as
        **latest**.

    Save this file and run the following to make this script executable.

    ```bash
    chmod +x build_image.sh
    ```

1.  Run your `build_image.sh` script to build your container image and push it
    to a container registry.

1.  [Use `docker run` to test your container image locally][docker-run]. If
    necessary, revise your application and Dockerfile until your application
    works as expected in the container.

[python37]: https://hub.docker.com/_/python
[docker]: https://docs.docker.com/get-started/
[dockerfile]: https://docs.docker.com/engine/reference/builder/
[google-container-registry]: https://cloud.google.com/container-registry/docs/
[docker-hub]: https://hub.docker.com/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/

<a name="component-spec"></a>
## Creating a component specification

To create a component from your containerized program, you must create a
component specification that defines the component's interface and
implementation. The following sections provide an overview of how to create a
component specification by demonstrating how to define the component's
implementation, interface, and metadata.

To learn more about defining a component specification, see the 
[component specification reference guide][component-spec].

[component-spec]: /docs/components/pipelines/reference/component-spec/

### Define your component's implementation

The following example creates a component specification YAML and defines the
component's implementation. 

1.  Create a file named `component.yaml` and open it in a text editor.
1.  Create your component's implementation section and specify the strict name
    of your container image. The strict image name is provided when you run
    your `build_image.sh` script.

    ```yaml
    implementation:
      container:
        # The strict name of a container image that you've pushed to a container registry.
        image: gcr.io/my-org/my-image@sha256:a172..752f
    ```

1.  Define a `command` for your component's implementation. This field
    specifies the command-line arguments that are used to run your program in
    the container. 

    ```yaml
    implementation:
      container:
        image: gcr.io/my-org/my-image@sha256:a172..752f
        # command is a list of strings (command-line arguments). 
        # The YAML language has two syntaxes for lists and you can use either of them. 
        # Here we use the "flow syntax" - comma-separated strings inside square brackets.
        command: [
          python3, 
          # Path of the program inside the container
          /pipelines/component/src/program.py,
          --input1-path,
          {inputPath: input_1},
          --param1, 
          {inputValue: parameter_1},
          --output1-path, 
          {outputPath: output_1},
        ]
    ```

    The `command` is formatted as a list of strings. Each string in the
    `command` is a command-line argument or a placeholder. At runtime,
    placeholders are replaced with an input or output. In the preceding
    example, two inputs and one output path are passed into a Python script at
    `/pipelines/component/src/program.py`.

    There are three types of input/output placeholders:

    *   `{inputValue: <input-name>}`:
        This placeholder is replaced with the value of the specified input.
        This is useful for small pieces of input data, such as numbers or small
        strings.

    *   `{inputPath: <input-name>}`:
        This placeholder is replaced with the path to this input as a file.
        Your component can read the contents of that input at that path during
        the pipeline run.

    *   `{outputPath: <output-name>}`:
        This placeholder is replaced with the path where your program writes
        this output's data. This lets the Kubeflow Pipelines system read the
        contents of the file and store it as the value of the specified output.
 
    The `<input-name>` name must match the name of an input in the `inputs`
    section of your component specification. The `<output-name>` name must
    match the name of an output in the `outputs` section of your component
    specification.  

### Define your component's interface

The following examples demonstrate how to specify your component's interface. 

1.  To define an input in your `component.yaml`, add an item to the
    `inputs` list with the following attributes:

    *   `name`: Human-readable name of this input. Each input's name must be
        unique.
    *   `description`: (Optional.) Human-readable description of the input.
    *   `default`: (Optional.) Specifies the default value for this input.
    *   `type`: Specifies the input’s type. Learn more about the
        [types defined in the Kubeflow Pipelines SDK][dsl-types] and [how type
        checking works in pipelines and components][dsl-type-checking].
    *   `optional`: Specifies if this input is optional. The value of this
        attribute is of type `Bool`, and defaults to **False**.

    In this example, the Python program has two inputs: 

    *   `input_1` contains `String` data.
    *   `Parameter 1` contains an `Integer`.

    ```yaml
    inputs:
    - {name: input_1, type: String, description: 'Data for input_1'}
    - {name: parameter_1, type: Integer, default: '100', description: 'Number of lines to copy'}
    ```

    Note: `input_1` and `parameter_1` do not specify any details about how they
    are stored or how much data they contain. Consider using naming conventions
    to indicate if inputs are expected to be artifacts or parameters. 

1.  After your component finishes its task, the component's outputs are passed
    to your pipeline as paths. At runtime, Kubeflow Pipelines creates a
    path for each of your component's outputs. These paths are passed as inputs
    to your component's implementation.

    To define an output in your component specification YAML, add an item to
    the `outputs` list with the following attributes:

    *   `name`: Human-readable name of this output. Each output's name must be
        unique.
    *   `description`: (Optional.) Human-readable description of the output.
    *   `type`: Specifies the output's type. Learn more about the
        [types defined in the Kubeflow Pipelines SDK][dsl-types] and [how type
        checking works in pipelines and components][dsl-type-checking].

    In this example, the Python program returns one output. The output is named
    `output_1` and it contains `String` data.

    ```yaml
    outputs:
    - {name: output_1, type: String, description: 'output_1 data.'}
    ```

    Note: Consider using naming conventions to indicate if this output is
    expected to be small enough to pass by value. You should limit the amount
    of data that is passed by value to 200 KB per pipeline run.

1.  After you define your component's interface, the `component.yaml` should be
    something like the following:

    ```yaml
    inputs:
    - {name: input_1, type: String, description: 'Data for input_1'}
    - {name: parameter_1, type: Integer, default: '100', description: 'Number of lines to copy'}
    
    outputs:
    - {name: output_1, type: String, description: 'output_1 data.'}

    implementation:
      container:
        image: gcr.io/my-org/my-image@sha256:a172..752f
        # command is a list of strings (command-line arguments). 
        # The YAML language has two syntaxes for lists and you can use either of them. 
        # Here we use the "flow syntax" - comma-separated strings inside square brackets.
        command: [
          python3, 
          # Path of the program inside the container
          /pipelines/component/src/program.py,
          --input1-path,
          {inputPath: input_1},
          --param1, 
          {inputValue: parameter_1},
          --output1-path, 
          {outputPath: output_1},
        ]
    ```

[dsl-types]: https://github.com/kubeflow/pipelines/blob/sdk/release-1.8/sdk/python/kfp/dsl/types.py
[dsl-type-checking]: https://www.kubeflow.org/docs/components/pipelines/sdk/static-type-checking/

### Specify your component's metadata

To define your component's metadata, add the `name` and `description`
fields to your `component.yaml`

```yaml
name: Get Lines
description: Gets the specified number of lines from the input file.

inputs:
- {name: input_1, type: String, description: 'Data for input_1'}
- {name: parameter_1, type: Integer, default: '100', description: 'Number of lines to copy'}

outputs:
- {name: output_1, type: String, description: 'output_1 data.'}

implementation:
  container:
    image: gcr.io/my-org/my-image@sha256:a172..752f
    # command is a list of strings (command-line arguments). 
    # The YAML language has two syntaxes for lists and you can use either of them. 
    # Here we use the "flow syntax" - comma-separated strings inside square brackets.
    command: [
      python3, 
      # Path of the program inside the container
      /pipelines/component/src/program.py,
      --input1-path,
      {inputPath: input_1},
      --param1, 
      {inputValue: parameter_1},
      --output1-path, 
      {outputPath: output_1},
    ]
```

## Using your component in a pipeline

You can use the Kubeflow Pipelines SDK to load your component using methods
such as the following:

*   [`kfp.components.load_component_from_file`][kfp-load-comp-file]: 
    Use this method to load your component from a `component.yaml` path.
*   [`kfp.components.load_component_from_url`][kfp-load-comp-url]:
    Use this method to load a `component.yaml` from a URL.
*   [`kfp.components.load_component_from_text`][kfp-load-comp-text]:
    Use this method to load your component specification YAML from a string.
    This method is useful for rapidly iterating on your component
    specification.

These functions create a factory function that you can use to create
[`ContainerOp`][kfp-containerop] instances to use as steps in your pipeline.
This factory function's input arguments include your component's inputs and
the paths to your component's outputs. The function signature may be modified
in the following ways to ensure that it is valid and Pythonic.

*   Inputs with default values will come after the inputs without default
    values and outputs.
*   Input and output names are converted to Pythonic names (spaces and symbols
    are replaced with underscores and letters are converted to lowercase). For
    example, an input named `Input 1` is converted to `input_1`. 

The following example demonstrates how to load the text of your component
specification and run it in a single-step pipeline. Before you run this
example, update the component specification to use the component
specification you defined in the previous sections.

```python
import kfp
import kfp.components as comp

create_step_get_lines = comp.load_component_from_text("""
name: Get Lines
description: Gets the specified number of lines from the input file.

inputs:
- {name: input_1, type: String, description: 'Data for input_1'}
- {name: parameter_1, type: Integer, default: '100', description: 'Number of lines to copy'}

outputs:
- {name: output_1, type: String, description: 'output_1 data.'}

implementation:
  container:
    image: gcr.io/my-org/my-image@sha256:a172..752f
    # command is a list of strings (command-line arguments). 
    # The YAML language has two syntaxes for lists and you can use either of them. 
    # Here we use the "flow syntax" - comma-separated strings inside square brackets.
    command: [
      python3, 
      # Path of the program inside the container
      /pipelines/component/src/program.py,
      --input1-path,
      {inputPath: input_1},
      --param1, 
      {inputValue: parameter_1},
      --output1-path, 
      {outputPath: output_1},
    ]""")

# create_step_get_lines is a "factory function" that accepts the arguments
# for the component's inputs and output paths and returns a pipeline step
# (ContainerOp instance).
#
# To inspect the get_lines_op function in Jupyter Notebook, enter 
# "get_lines_op(" in a cell and press Shift+Tab.
# You can also get help by entering `help(get_lines_op)`, `get_lines_op?`,
# or `get_lines_op??`.

# Define your pipeline
@dsl.pipeline(
    pipeline_root='gs://my-pipeline-root/example-pipeline',
    name="example-pipeline",
) 
def my_pipeline():
    get_lines_step = create_step_get_lines(
        # Input name "Input 1" is converted to pythonic parameter name "input_1"
        input_1='one\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten',
        parameter_1='5',
    )

# If you run this command on a Jupyter notebook running on Kubeflow,
# you can exclude the host parameter.
# client = kfp.Client()
client = kfp.Client(host='<your-kubeflow-pipelines-host-name>')

# Compile, upload, and submit this pipeline for execution.
client.create_run_from_pipeline_func(my_pipeline, arguments={},
    mode=kfp.dsl.PipelineExecutionMode.V2_COMPATIBLE)
```

[kfp-load-comp-file]: https://kubeflow-pipelines.readthedocs.io/en/stable/source/components.html#kfp.components.load_component_from_file
[kfp-load-comp-url]: https://kubeflow-pipelines.readthedocs.io/en/stable/source/components.html#kfp.components.load_component_from_url
[kfp-load-comp-text]: https://kubeflow-pipelines.readthedocs.io/en/stable/source/components.html#kfp.components.load_component_from_text
[kfp-containerop]: https://kubeflow-pipelines.readthedocs.io/en/stable/source/dsl.html#kfp.dsl.ContainerOp

## Organizing the component files

This section provides a recommended way to organize a component's files. There
is no requirement that you must organize the files in this way. However, using 
the standard organization makes it possible to reuse the same scripts for
testing, image building, and component versioning.

```
components/<component group>/<component name>/

    src/*            # Component source code files
    tests/*          # Unit tests
    run_tests.sh     # Small script that runs the tests
    README.md        # Documentation. If multiple files are needed, move to docs/.

    Dockerfile       # Dockerfile to build the component container image
    build_image.sh   # Small script that runs docker build and docker push

    component.yaml   # Component definition in YAML format
```

See this [sample component][org-sample] for a real-life component example.

[org-sample]: https://github.com/kubeflow/pipelines/tree/sdk/release-1.8/components/sample/keras/train_classifier

## Next steps

* Consolidate what you've learned by reading the
  [best practices](/docs/components/pipelines/sdk/best-practices) for designing and
  writing components.
* For quick iteration,
  [build lightweight Python function-based components](/docs/components/pipelines/sdk-v2/python-function-components/)
  directly from Python functions.
* Use SDK APIs to visualize pipeline result, follow 
  [Visualize Results in the Pipelines UI](/docs/components/pipelines/sdk/output-viewer/#v2-visualization)
  for various visualization types.
* See how to [export metrics from your
  pipeline](/docs/components/pipelines/sdk/pipelines-metrics/).
* Visualize the output of your component by
  [adding metadata for an output
  viewer](/docs/components/pipelines/sdk/output-viewer/).
* Explore the [reusable components and other shared
  resources](/docs/examples/shared-resources/).


[kfp-artifact]: https://github.com/kubeflow/pipelines/blob/sdk/release-1.8/sdk/python/kfp/dsl/io_types.py
