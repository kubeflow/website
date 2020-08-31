+++
title = "Create Reusable Components"
description = "A detailed tutorial on creating components that you can use in various pipelines"
weight = 40
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

This page describes how to author a reusable component that you can
load and use as part of a pipeline.

If you're new to
pipelines, see the conceptual guides to [pipelines](/docs/pipelines/concepts/pipeline/)
and [components](/docs/pipelines/concepts/component/).

This tutorial describes the manual way of writing a full component program (in any language) and a component definition for it.
For quickly building component from a python function see [Build component from Python function](/docs/pipelines/sdk/lightweight-python-components/) and [Data Passing in Python components](https://github.com/kubeflow/pipelines/blob/master/samples/tutorials/Data%20passing%20in%20python%20components.ipynb).

## Summary

Below is a summary of the steps involved in creating and using a component:

1.  Write the program that contains your component's logic. The program must
    use files and command-line arguments to pass data to and from the component.
1.  Containerize the program.
1.  Write a component specification in YAML format that describes the
    component for the Kubeflow Pipelines system.
1.  Use the Kubeflow Pipelines SDK to load your component, use it in a pipeline and run that pipeline.

The rest of this page gives some explanation about input and output data, 
followed by detailed descriptions of the above steps.

## Components and data passing

The concept of component is very similar to the concept of a function.
Every component can have inputs and outputs (which must be declared in the component specification).
The component code takes the data passed to its inputs and produces the data for its outputs.
A pipeline then connects component instances together by passing data from outputs of some components to inputs of other components.
That's very similar to how a function calls other functions and passes the results between them.
The Pipelines system handles the actual data passing while the components are responsible for consuming the input data and producing the output data.

## Passing the data to and from the containerized program

When creating a component you need to think about how the component
will communicate with upstream and downstream components. That is, how it will consume
the input data and produce the output data.

### Producing data

To output any piece of data, the component program must write the output data to some location and inform the system
about that location so that the system can pass the data between steps.
The program should accept the paths for the output data as command-line arguments. That is, you should not hardcode the paths.

#### Advanced: Producing data in an external system

In some scenarios, the goal of the component is to create some data object in an external service (for example a BigQuery table).
In this case the component program should do that and then output some identifier of the produced data location (for example BigQuery table name) instead of the data itself.
This scenario should be limited to cases where the data must be put into external system instead of keeping it inside the Kubeflow Pipelines system.
The class of components where this behavior is common is exporters (for example "upload data to GCS").
Note that the Pipelines system cannot provide consistency and reproducibility guarantees for the data outside of its control.

### Consuming data

There are two main ways a command-line program usually consumes data:

* Small pieces of data are usually passed as command-line arguments: `program.py --param1 100`.
* Bigger data or binary data is usually stored in files and then the file paths are passed to the program: `program.py --data1 /inputs/data1.txt`. The system needs to be aware about the need to put some data into files and pass their paths to the program.

## Writing the program code

This section describes an example program that has two inputs (for small and 
large pieces of data) and one output. The programming language in this example
is Python 3.

### program.py

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
parser.add_argument('--input1-path', type=str, help='Path of the local file containing the Input 1 data.') # Paths should be passed in, not hardcoded
parser.add_argument('--param1', type=int, default=100, help='Parameter 1.')
parser.add_argument('--output1-path', type=str, help='Path of the local file where the Output 1 data should be written.') # Paths should be passed in, not hardcoded
args = parser.parse_args()

# Creating the directory where the output file will be created (the directory may or may not exist).
Path(args.output1_path).parent.mkdir(parents=True, exist_ok=True)

with open(args.input1_path, 'r') as input1_file:
    with open(args.output1_path, 'w') as output1_file:
        do_work(input1_file, output1_file, args.param1)
```

The command line invocation of this program is:

```
python3 program.py --input1-path <local file path to Input 1 data> \
                   --param1 <value of Param1 input> \
                   --output1-path <local file path for the Output 1 data>
```

## Writing a Dockerfile to containerize your application

You need a [Docker](https://docs.docker.com/get-started/) container image that 
packages your program.

The instructions on creating container images are not specific to Kubeflow
Pipelines. To make things easier for you, this section provides some guidelines
on standard container creation. You can use any procedure
of your choice to create the Docker containers.

Your [Dockerfile](https://docs.docker.com/engine/reference/builder/) must
contain all program code, including the wrapper, and the dependencies (operating
system packages, Python packages etc).  

Ensure you have write access to a container registry where you can push
the container image. Examples include 
[Google Container Registry](https://cloud.google.com/container-registry/docs/) 
and [Docker Hub](https://hub.docker.com/).

Think of a name for your container image. This guide uses the name
`gcr.io/my-org/my-image'.

### Example Dockerfile

```
FROM python:3.7
RUN python3 -m pip install keras
COPY ./src /pipelines/component/src
```

Create a `build_image.sh` script (see example below) to build the container
image based on the Dockerfile and push the container image to some container
repository.

Run the `build_image.sh` script to build the container image based on the Dockerfile
and push it to your chosen container repository. 

Best practice: After pushing the image, get the strict image name with digest,
and use the strict image name for reproducibility.

### Example build_image.sh:

```bash
#!/bin/bash -e
image_name=gcr.io/my-org/my-image # Specify the image name here
image_tag=latest
full_image_name=${image_name}:${image_tag}

cd "$(dirname "$0")" 
docker build -t "${full_image_name}" .
docker push "$full_image_name"

# Output the strict image name (which contains the sha256 image digest)
docker inspect --format="{{index .RepoDigests 0}}" "${full_image_name}"
```

Make your script executable:

```
chmod +x build_image.sh
```

## Writing your component definition file

To create a component from your containerized program you need to write component specification in YAML format that describes the
component for the Kubeflow Pipelines system.

For the complete definition of a Kubeflow Pipelines component, see the
[component specification](/docs/pipelines/reference/component-spec/).
However, for this tutorial you don't need to know the full schema of the 
component specification. The tutorial provides enough information for the 
relevant the components.

Start writing the component definition (`component.yaml`) by specifying your
container image in the component's implementation section:

```
implementation:
  container:
    image: gcr.io/my-org/my-image@sha256:a172..752f # Name of a container image that you've pushed to a container repo.
```

Complete the component's implementation section based on your program:  
 
```
implementation:
  container:
    image: gcr.io/my-org/my-image@sha256:a172..752f
    # command is a list of strings (command-line arguments). 
    # The YAML language has two syntaxes for lists and you can use either of them. 
    # Here we use the "flow syntax" - comma-separated strings inside square brackets.
    command: [
      python3, /kfp/component/src/program.py, # Path of the program inside the container
      --input1-path, <local file path for the Input 1 data>,
      --param1, <value of Param1 input>,
      --output1-path, <local file path for the Output 1 data>,
    ]
```

The `command` section still contains some dummy placeholders (in angle
brackets). Let's replace them with real placeholders. A *placeholder* represents
a command-line argument that is replaced with some value or path before the
program is executed. In `component.yaml`, you specify the placeholders using
YAML's mapping syntax to distinguish them from the verbatim strings. There are
three placeholders available:

*   `{inputValue: Some input name}`   
    This placeholder is replaced with the **value** of the argument to the
    specified input. This is useful for small pieces of input data.
*   `{inputPath: Some input name}`   
    This placeholder is replaced with the auto-generated **local path** where the
    system will put the input data passed to the component during the pipeline run.
    This placeholder instructs the system to write the input argument data to a file and pass the path of that data file to the component program.
*   `{outputPath: Some output name}`   
    This placeholder is replaced with the auto-generated **local path** where the
    program should write its output data. This instructs the system to read the
    content of the file and store it as the value of the specified output.

In addition to putting real placeholders in the command line, you need to add
corresponding input and output specifications to the inputs and outputs
sections. The input/output specification contains the input name, type,
description and default value. Only the name is required. The input and output
names are free-form strings, but be careful with the YAML syntax and use quotes
if necessary. The input/output names do not need to be the same as the
command-line flags which are usually quite short.  
   
Replace the placeholders as follows:

+   Replace `<local file path for the Input 1 data>` with `{inputPath: Input 1}` and
    add `Input 1` to the `inputs` section.
    them in as command-line arguments.
+   Replace `<value of Param1 input>` with `{inputValue: Parameter 1}` and add
    `Parameter 1` to the `inputs` section. Integers are small, so we're passing
    them in as command-line arguments.
+   Replace `<local file path for the Output 1 data>` with `{outputPath: Output 1}`
    and add `Output 1` to the `outputs` section.

After replacing the placeholders and adding inputs/outputs, your
`component.yaml` looks like this:

```
inputs: #List of input specs. Each input spec is a map.
- {name: Input 1}
- {name: Parameter 1}
outputs:
- {name: Output 1}
implementation:
  container:
    image: gcr.io/my-org/my-image@sha256:a172..752f
    command: [
      python3, /pipelines/component/src/program.py,

      --input1-path,
      {inputPath: Input 1}, # Refers to the "Input 1" input

      --param1,
      {inputValue: Parameter 1}, # Refers to the "Parameter 1" input

      --output1-path,
      {outputPath: Output 1}, # Refers to the "Output 1" output
    ]
```

The above component specification is sufficient, but you should add more
metadata to make it more useful. The example below includes the following
additions:

* Component name and description.
* For each input and output: description, default value, and type.  
   
Final version of `component.yaml`:  

```
name: Do dummy work
description: Performs some dummy work.
inputs:
- {name: Input 1, type: GCSPath, description: 'Data for Input 1'}
- {name: Parameter 1, type: Integer, default: '100', description: 'Parameter 1 description'} # The default values must be specified as YAML strings.
outputs:
- {name: Output 1, description: 'Output 1 data'}
implementation:
  container:
    image: gcr.io/my-org/my-image@sha256:a172..752f
    command: [
      python3, /pipelines/component/src/program.py,
      --input1-path,  {inputPath:  Input 1},
      --param1,       {inputValue: Parameter 1},
      --output1-path, {outputPath: Output 1},
    ]
```

## Build your component into a pipeline with the Kubeflow Pipelines SDK

Here is a sample pipeline that shows how to load a component and use it to
compose a pipeline.
 
```python
import kfp
# Load the component by calling load_component_from_file or load_component_from_url
# To load the component, the pipeline author only needs to have access to the component.yaml file.
# The Kubernetes cluster executing the pipeline needs access to the container image specified in the component.
dummy_op = kfp.components.load_component_from_file(os.path.join(component_root, 'component.yaml')) 
# dummy_op = kfp.components.load_component_from_url('http://....../component.yaml')

# Load two more components for importing and exporting the data:
download_from_gcs_op = kfp.components.load_component_from_url('http://....../component.yaml')
upload_to_gcs_op = kfp.components.load_component_from_url('http://....../component.yaml')

# dummy_op is now a "factory function" that accepts the arguments for the component's inputs
# and produces a task object (e.g. ContainerOp instance).
# Inspect the dummy_op function in Jupyter Notebook by typing "dummy_op(" and pressing Shift+Tab
# You can also get help by writing help(dummy_op) or dummy_op? or dummy_op??
# The signature of the dummy_op function corresponds to the inputs section of the component.
# Some tweaks are performed to make the signature valid and pythonic:
# 1) All inputs with default values will come after the inputs without default values
# 2) The input names are converted to pythonic names (spaces and symbols replaced
#    with underscores and letters lowercased).

# Define a pipeline and create a task from a component:
def my_pipeline():
    dummy1_task = dummy_op(
        # Input name "Input 1" is converted to pythonic parameter name "input_1"
        input_1="one\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten",
        parameter_1='5',
    )
    # The outputs of the dummy1_task can be referenced using the
    # dummy1_task.outputs dictionary: dummy1_task.outputs['output_1']
    # ! The output names are converted to pythonic ("snake_case") names.

# This pipeline can be compiled, uploaded and submitted for execution.
kfp.Client().create_run_from_pipeline_func(my_pipeline, arguments={})
```

## Organizing the component files

This section provides a recommended way to organize the component files. There
is no requirement that you must organize the files in this way. However, using
the standard organization makes it possible to reuse the same scripts for
testing, image building and component versioning.  
See this
[sample component](https://github.com/kubeflow/pipelines/tree/master/components/sample/keras/train_classifier)
for a real-life component example.

```
components/<component group>/<component name>/

    src/*            #Component source code files
    tests/*          #Unit tests
    run_tests.sh     #Small script that runs the tests
    README.md        #Documentation. Move to docs/ if multiple files needed

    Dockerfile       #Dockerfile to build the component container image
    build_image.sh   #Small script that runs docker build and docker push

    component.yaml   #Component definition in YAML format
```

## Next steps

* Consolidate what you've learned by reading the 
  [best practices](/docs/pipelines/sdk/best-practices) for designing and 
  writing components.
* For quick iteration, 
  [build lightweight components](/docs/pipelines/sdk/lightweight-python-components/)
  directly from Python functions.
* See how to [export metrics from your 
  pipeline](/docs/pipelines/metrics/pipelines-metrics/).
* Visualize the output of your component by
  [adding metadata for an output 
  viewer](/docs/pipelines/metrics/output-viewer/).
* Explore the [reusable components and other shared 
  resources](/docs/examples/shared-resources/).
