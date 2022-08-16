+++
title = "Building components using your own container"
description = "Bring user-controlled container into component authoring in KFP v2"
weight = 50
+++

Container-based components make it easier to use the pre-existed container to build a KFP component. 
The user will control the container entrypoint and is able to define the component by specifying their container, commands, and args in a `ContainerSpec` object with similar authoring experiences as defining Python components. 


## Before you begin

1. Run the following command to install the Kubeflow Pipelines SDK v(TODO) or higher. If you run this command in a Jupyter notebook, restart the kernel after installing the SDK. 

```python
$ pip install --upgrade kfp
```

2. Import the `kfp`, and `kfp.dsl` packages.

```python
import kfp
from kfp.dsl import (
  container_component,
  ContainerSpec,
  pipeline,
  OutputPath
)
 
```

3. Create an instance of the [`kfp.Client` class][kfp-client] following steps in [connecting to Kubeflow Pipelines using the SDK client][connect-api].


```python
client = kfp.Client() # change arguments accordingly
```

For more information about the Kubeflow Pipelines SDK, see the [SDK reference guide][sdk-ref].


## Getting started with Container-based components

1. This section demonstrates how to get started building container-based components by creating a simple hello world component.

Define your component’s code as a python function that returns a `dsl.ContainerSpec` object to specify the container image and the commands to be run in the container and wrap the function into a `@container_component` decorator. The decorator will compose a `ComponentSpec` object using the `ContainerSpec` to be compiled for execution. (Learn more about [ComponentSpec][dsl-component-spec] and [ContainerSpec][dsl-container-spec].) The inputs and outputs of the component should be written in the function signature with type annotations. In this example, we use a shell script to demonstrate how you could use a simple program in the container to pass data through this interface.  
  <!-- TODO: add hyperlink to source code of ContainerSpec  -->

```python
@container_component
def hello_world_comp(text: str, out_filename: dsl.OutputPath(str)):
    return ContainerSpec(
        image=..., # put your container image on gcs here
        command=['hello_world.sh'],
        args=['--in', text, '--out', out_filename]
    )
```

Meanwhile, add a shell script on your container that takes outputs the text into the provided path:
```shell
echo $2 >> $4
```

2. Create pipeline using the above container component. [Learn more about creating and running pipelines][build-pipelines].

```python
@pipeline(
    name='hello-world-pipeline',
    description='An example pipeline made of container-based component.'
)
def hello_world_pipeline(text: str):
    hello_world_comp(text)
```

3. Compile and run your pipeline. [Learn more about compiling and running pipelines][build-pipelines].

```python
arguments = {'text': 'Welcome to KFP v2!'}
client.create_run_from_pipeline_func(
    add_pipeline,
    arguments=arguments
)
```

## Building a container-based component
Use the following instructions to build a container-based component:

<a name="standalone"></a>

1.  Define a Python function as your container component. ([See sample container-based component.](#container-comp-example) This function must meet the following
    requirements:

    *   It should not use any code declared outside of the function definition.
    *   The function should do nothing other than returning a `dsl.ContainerSpec`
        object, with the following parameters:
        * image: The target image where the command (with args) is executed. The user will control the entrypoint of the image.
        * command(optional): The command to be executed. 
        * args(optional): The arguments of the command. It’s recommended to place the input of the     components in the args section instead of the command section. 
        * env(optional): the environment variables to be passed to the container.
        * resources(optional): the specification on the resource requirements.


2.  Kubeflow Pipelines uses your function's inputs and outputs to define your
    component's interface. [Learn more about passing data between
    components][passing-data]. Specifically for container-based component, 
    your function's inputs and outputs must meet the following requirements:
    
    *   All your function's arguments must have data type annotations.
    *   Different from a Python component, your return type annotation for the function 
        must either be `dsl.ContainerSpec` or omitted. 
    *   If the function accepts or returns large amounts of data or complex
        data types, you must annotate that argument as an _artifact_.
        [Learn more about using large amounts of data as inputs or outputs][pass-by-file]. Note 
        that in the function you defined, you can only access artifacts via its `.url` or `.path` attribute. Accessing any other attribute or the artifact variable by itself is not allowed. 
      
3.  Add the [`kfp.dsl.container_component`][dsl-container-component] decorator to convert your function
    into a pipeline component. Note: The `container_component` decorator doesn't take in any arguments.

## Example container-based components

<a name="container-comp-example"></a>
This section demonstrates how to build two container-based components with artifact inputs and outputs and connect them into a two-step pipeline.

1. Define two containerized components: the first component takes in a text and output it as an artifact to a path, and the second component retrives the artifact and print it out.  

```python
from kfp.dsl import (
  container_component,
  ContainerSpec,
  Dataset,
  Input, 
  Output
) 
  
@container_component
def component1(text: str, output_gcs: Output[Dataset]):
    return ContainerSpec(
        image='google/cloud-sdk:slim',
        command=[
            'sh -c | set -e -x', 'echo', text, 
            '| gsutil cp -', output_gcs.uri
        ]
    )


@container_component
def component2(input_gcs: Input[Dataset]):
    return ContainerSpec(
        image='google/cloud-sdk:slim',
        command=['sh -c', '|', 'set -e -x gsutil cat'],
        args=[input_gcs.path]
    )
```

2. Define a pipeline to connect the components, using the output path of the first component as the input path of the second component by accessing the `.outputs` attribute of the first component.  

```python
@pipeline(name='two-step-pipeline-containerized')
def two_step_pipeline_containerized(text: str):
    component_1 = component1(text).set_display_name('Producer')
    component_2 = component2(input_gcs=component_1.outputs['output_gcs'])
    component_2.set_display_name('Consumer')
```

3. Submit a pipeline run. [Learn more about compiling and running pipelines][build-pipelines].

```python
client.create_run_from_pipeline_func(
    two_step_pipeline_containerized,
    arguments={'text': 'Hello KFP v2!'}
)
```

<!-- TODO: fill in the links below in the new docs -->
[build-pipelines]: /docs/components/pipelines/quickstart
[connect-api]: https://www.kubeflow.org/docs/components/pipelines/sdk/connect-api
[dsl-component-spec]: TODO
[dsl-container-spec]: TODO
[dsl-container-component]: TODO
[kfp-client]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html#kfp.Client
[passing-data]: TODO
[pass-by-file]: TODO
[sdk-ref]: https://kubeflow-pipelines.readthedocs.io/en/stable/index.html
<!-- TODO: suggest added to the same section as passing data -->