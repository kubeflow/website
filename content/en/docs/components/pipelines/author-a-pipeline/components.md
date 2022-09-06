+++
title = "Components"
description = "Author KFP components"
weight = 4
+++


## Summary
A *component* is the basic unit of execution logic in KFP. A component is a named template for how to run a container using an image, a command, and arguments. Components may also have inputs and outputs, making a component a computational template, analogous to a function.

Component inputs are dynamic data used in either the container commands or arguments.

Component outputs may be machine learning artifacts or other JSON-serializable data.

## Author a component

At the lowest level of execution, all components define their execution logic via a container image, command, and arguments. An importer component is a special case and the only exception to this.

The KFP SDK exposes three ways of authoring components with these three properties.

### 1. Lighweight Python function-based components
The most simple way to author a component is via a lightweight Python function-based component (also known as a lightweight component).

Lightweight components provides a fully Pythonic approach to creating a component that executes a single Python function within a container at runtime.

To create a lightweight component, you must:
1. Define a standalone function.

    A standalone Python function is a function that does not reference any symbols defined outside of its scope. This means the function must define all objects it uses within the scope of the function and must include all import statements within the function body.

2. Include type annotations for the function parameters and return values.

    Type annotations indicate what the component inputs and outputs are and tells the KFP lightweight component executor how to serialize and deserialize the data as it is passed within a pipeline. This also (optionally) allows the KFP DSL compiler to type check your pipeline.

    Valid parameter annotations include `str`, `int`, `float`, `bool`, `dict`, `list`, `OutputPath`, `InputPath`, `Input[<Artifact>]`, and `Output[<Artifact>]`.
    
    Valid return annotations include `str`, `int`, `float`, `bool`, `dict`, and `list`. You may also specify multiple return values by using these annotations within a `typing.NamedTuple`.

    For detailed discussion on type annotations and runtime behavior, see [Data Passing][data-passing].

3. Decorate your function with the `@kfp.dsl.component` decorator.
    This decorator transforms a Python function into a component that can be used within a pipeline.

    For a comprehensive list of `@kfp.dsl.component` decorator arguments, see the DSL [reference documentation][dsl-reference-documentation].


The following is an example of a lightweight component that trains a model on an existing input `Dataset` artifact for `num_epochs` epochs, then saves the output `Model` artifact.

```python
from kfp import dsl

@dsl.component(
    base_image='python:3.7',
    packages_to_install=['tensorflow==2.9.1']
)
def train_model(
    dataset: Input[Dataset],
    model: Output[Model],
    num_epochs: int,
):
    from tensorflow import keras
    
    # load and process the Dataset artifact
    with open(dataset.path) as f:
        x, y = ...

    my_model = keras.Sequential(
        [
            layers.Dense(4, activation='relu', name='layer1'),
            layers.Dense(3, activation='relu', name='layer2'),
            layers.Dense(2, activation='relu', name='layer2'),
            layers.Dense(1, name='layer3'),
        ]
    )

    my_model.compile(...)
    # train for num_epochs
    my_model.fit(x, y, epochs=num_epochs)
    
    # save the Model artifact
    my_model.save(model.path)
```

Notice the `base_image` argument to the `@kfp.dsl.component` decorator. Despite not having the word "container" in its name, lightweight components are still executed as a container at runtime. The `@kfp.dsl.component` decorator mereley provides a convient Pythonic interface to defining this container image, command, and arguments. [`python:3.7`][python-docker-image] is the default image, but can be changed to any image accessible to the executing backend, as long as the image has a Python interpreter available as `python3`. Packages in `packages_to_install` will be pip installed at container runtime.

**When to use?** Lightweight components should be used if your component implementation can be written as a standalone Python function and does not require an abundance of source code. This is the preferred authoring approach for quick demos and when authoring components in a noteebok.

For more involved components and for production usage, prefer containerized components and custom container components for their increased flexibility.

Note: This authoring approach replaces `kfp.components.create_component_from_func` in KFP v1.

### 2. Containerized Python components
Containerized Python components extend lightweight components by allowing users to package and build their Python function-based components into containers.

Unlike lightweight components, containerized Python components allow authors to use additional source code outside of the component's Python function definition, including source code across multiple files. This is the preferred approach for authoring Python components that require more source code than can cleanly be included in the body of a standalone function or in cases where you wish to reuse the same source code in multiple components.

To create a containerized component, you must:

1) Define a component using the `@kfp.dsl.component` decorator.

    A containerized Python component definition is very similar to a lightweight component definition, but with a few key differences:

    a) The `@kfp.dsl.component` decorator is given a `target_image`. This is the name of containerized component image that will be created from the `base_image` in Step 2 below.

    b) The `tensorflow` import is included outside of the `train_model` function. This is possible because the entire module will be executed at component runtime, not only the Python function as in a lightweight component.

    c) The component uses functions defined in `my_helper_module` imported via a [relative import](https://docs.python.org/3/reference/import.html#package-relative-imports). This is possible because `my_helper_module.py` will be included in the container image created in Step 2 below. This is unlike a lighweight component, which only uses the source code included in the Python function definition. This helper code could have also been defined within the same module outside of the `train_model` function.

    The following containerized component adapts the lightweight component in the previous section to a containerized component. Notice that most of the logic is extracted into helper functions in `my_helper_module`, permitting a cleaner, modular component function:

    ```python
    # my_component.py
    from kfp import dsl
    from tensorflow import keras
    from .my_helper_module import compile_and_train, get_model, split_dataset

    @dsl.component(
        base_image='python:3.7',
        target_image='gcr.io/my-project/my-component:v1',
        packages_to_install=['tensorflow'],
    )
    def train_model(
        dataset: Input[Dataset],
        model: Output[Model],
        num_epochs: int,
    ):
        # load and process the Dataset artifact
        with open(dataset.path) as f:
            x, y = split_dataset(f)

        untrained_model = get_model()
        
        # train for num_epochs
        trained_model = compile_and_train(untrained_model, epochs=num_epochs)
        
        # save the Model artifact
        trained_model.save(model.path)
    ```

    The `my_component.py` module, the `my_helper_module.py` module, and any other source code files you wish to include in the container image should be grouped together in a directory. When you build the component in Step 2 below, this directory will by [COPY](https://docs.docker.com/engine/reference/builder/#copy)'d into the image:

    ```
    src/
    ├── my_component.py
    └── my_helper_module.py
    └── another_module.py
    ```

2) Build the component.

    Once you've written a component and associated source code files and put them in a standalone directory, you can use the KFP CLI to build your component. This command to do this takes the form:

    ```shell
    kfp component build [OPTIONS] COMPONENTS_DIRECTORY [ARGS]...
    ```
    When you run this command, KFP will build an image with all the source code found in `COMPONENTS_DIRECTORY`. KFP will find your component definition in `src/` and execute the component function you defined at component runtime. Include the `--push-image` flag to push your image to a remote registry from which the executing backend can pull your image at runtime. For example:

    ```shell
    kfp component build src/ --push-image
    ```

    For detailed information about all arguments/flags, see [CLI reference documentation](https://kubeflow-pipelines.readthedocs.io/en/master/source/cli.html#kfp-component-build).

**When to use?** Containerized Python components should be used any time your component is implemented as Python code, but cannot be written as a standalone Python function or you wish to organize source code outside of the component Python function definition.

### 3. Custom container components

Container-based components make it easier to use the pre-existed container to build a KFP component. 
The user will control the container entrypoint and is able to define the component by specifying their container, commands, and args in a `ContainerSpec` object with similar authoring experiences as defining Python components. 

To define a container component, you must:
1) Write your component’s code as a python function that returns a `dsl.ContainerSpec` object to specify the container image and the commands to be run in the container and wrap the function into a `@container_component` decorator. The function should satisfy the following requirements:

    *   It should not use any code declared outside of the function definition.
    *   The function should do nothing other than returning a `dsl.ContainerSpec`
        object, with the following parameters:
        * image: The target image where the command (with args) is executed. The user will control the entrypoint of the image.
        * command(optional): The command to be executed. 
        * args(optional): The arguments of the command. It’s recommended to place the input of the     components in the args section instead of the command section.

    The decorator will then compose a `ComponentSpec` object using the `ContainerSpec` to be compiled for execution. (Learn more about [ContainerSpec][dsl-reference-documentation] in documentation.) 

2) Specify your function's inputs and outputs in the function's    signature [Learn more about passing data between components][data-passing]. Specifically for container-based component, your function's inputs and outputs must meet the following requirements:
    
    *   All your function's arguments must have data type annotations.
    *   Different from a Python component, your return type annotation for the function 
        must either be `dsl.ContainerSpec` or omitted. 
    *   If the function accepts or returns large amounts of data or complex
        data types, you must annotate that argument as an _artifact_. Note that in the function you defined, you can only access artifacts via its `.url`, `.path`, or `.metadata` attribute. Accessing any other attribute or the artifact variable by itself is currently not allowed. 

Here is a minimal example that uses a bash script to demonstrate the use of container component:
```python
from kfp import dsl
@dsl.container_component
def hello_world_comp(text: str, out_filename: dsl.OutputPath(str)):
    return dsl.ContainerSpec(
        image='python:3.7' # or put your custom container image here
        command=['source', 'hello_world.sh'],
        args=['--in', text, '--out', out_filename]
    )
```

Meanwhile, add a bash script `hello_world.sh` on your container that takes outputs the text into the provided path:
```bash
echo $2 >> $4
```
Below is a more complex example that authors a pipelines from two container component. Just as using with a Python component, we can access the outputs of a `container_component` for downstream tasks as demonstrated in the pipeline:
```python
from kfp.dsl import (
  container_component,
  ContainerSpec,
  Dataset,
  Input, 
  Output,
) 

@container_component
def component1(text: str, output_gcs: Output[Dataset]):
    return ContainerSpec(
        image='alpine',
        command=[
            'sh',
            '-c',
            'mkdir --parents $(dirname "$1") && echo "$0" > "$1"',
        ],
        args=[text, output_gcs.path])


@container_component
def component2(input_gcs: Input[Dataset]):
    return ContainerSpec(image='alpine', command=['cat'], args=[input_gcs.path])

@pipeline(name='two-step-pipeline-containerized')
def two_step_pipeline_containerized(text: str):
    component_1 = component1(text)
    component_2 = component2(input_gcs=component_1.outputs['output_gcs'])
```

## Special case: Importer components
Unlike the previous three authoring approaches, an importer component not a general authoring style but a pre-baked component for a specific use case: loading a machine learning [artifact][data-passing] from remote storage to machine learning metadata (MLMD).

**Before you continue:** Understand how KFP [Artifacts][data-passing] work.

Typically, the input artifact to a task is an output from an upstream task. In this case, the artifact can be easily accessed from the upstream task using `my_task.outputs['artifact_name']`. The artifact is also registered in MLMD when it is created by the upstream task.

If you wish to use an existing artifact that is not generated by a task in the current pipeline _or_ wish to use as an artifact an external file that was not generated by a pipeline at all, you can use an importer component to load an artifact from its URI.

You do not need to write an importer component; it can be imported from the `dsl` module and used directly:

```python
from kfp import dsl

@dsl.pipeline()
def my_pipeline():
    task = get_date_string()
    importer_task = dsl.importer(
        artifact_uri='gs://ml-pipeline-playground/shakespeare1.txt',
        artifact_class=dsl.Dataset,
        reimport=True,
        metadata={'date': task.output})
    other_component(dataset=importer_task.output)
```

In addition to the `artifact_uri`, you must provide an `artifact_class`, indicating the type of the artifact.

The `importer` component permits setting artifact metadata via the `metadata` argument. Metadata can be constructed with outputs from upstream tasks, as is done for the `'date'` value in the example pipeline.

You may also specify a boolean `reimport` argument. If `reimport` is `False`, KFP will use an existing MLMD artifact if it already exists from an earlier importer execution. If `reimport` is `True`, KFP will reimport the artifact as a new artifact, irrespective of whether it was previously imported.


## Compile (save) a component
Once you've written a component, you may wish to write the component definition to YAML for future use or submission for execution. This can be done via the KFP SDK DSL compiler:

```python
from kfp import compiler

compiler.Compiler().compile(pipeline_func=addition_component, package_path='addition_component.yaml')
```

## Load a component
You can load saved components via the `kfp.components` module. This is helpful for integrating existing components stored as YAML into a larger pipeline definition:

```python
from kfp import components

addition_component = components.load_component_from_file('addition_component.yaml')
```

Once loaded, you can use the component in a pipeline just as you would a component defined in Python:

```python
@dsl.pipeline()
def my_pipeline():
    addition_task = addition_component(num1=1, num2=2)
```

The `components` module also includes `.load_component_from_text` and `.load_component_from_url` for loading YAML from different sources.

[data-passing]: /docs/components/pipelines/author-a-pipeline/data-passing
[dsl-reference-documentation]: https://kubeflow-pipelines.readthedocs.io/en/master/source/dsl.html
[python-docker-image]: https://hub.docker.com/_/python