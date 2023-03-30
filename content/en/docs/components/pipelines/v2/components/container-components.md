+++
title = "Container Components"
description = "Create a component via an arbitrary container definition"
weight = 4
+++

In KFP, each task execution corresponds to a container execution. This means that all components, even Python Components, are defined by an `image`, `command`, and `args`.

Python Components are unique because they abstract most aspects of the container definition away from the user, making it convenient to construct components that use pure Python. Under the hood, the KFP SDK sets the `image`, `commands`, and `args` to the values needed to execute the Python component for the user.

**Container Components, unlike Python Components, enable component authors to set the `image`, `command`, and `args` directly.** This makes it possible to author components that execute shell scripts, use other languages and binaries, etc., all from within the KFP Python SDK.

### A simple Container Component

The following starts with a simple `say_hello` Container Component and gradually modifies it until it is equivalent to our `say_hello` component from the [Hello World Pipeline example][hello-world-pipeline]. Here is a simple Container Component:

```python
from kfp import dsl

@dsl.container_component
def say_hello():
    return dsl.ContainerSpec(image='alpine', command=['echo'], args=['Hello'])
```

To create a Container Components, use the [`dsl.container_component`][dsl-container-component] decorator and create a function that returns a [`dsl.ContainerSpec`][dsl-containerspec] object. `dsl.ContainerSpec` accepts three arguments: `image`, `command`, and `args`. The component above runs the command `echo` with the argument `Hello` in a container running the image [`alpine`][alpine].

Container Components can be used in pipelines just like Python Components:

```python
from kfp import dsl
from kfp import compiler

@dsl.pipeline
def hello_pipeline():
    say_hello()

compiler.Compiler().compile(hello_pipeline, 'pipeline.yaml')
```

If you run this pipeline, you'll see the string `Hello` in `say_hello`'s logs.

### Use component inputs

To be more useful, `say_hello` should be able to accept arguments. You can modify `say_hello` so that it accepts an input argument `name`:

```python
from kfp import dsl

@dsl.container_component
def say_hello(name: str):
    return dsl.ContainerSpec(image='alpine', command=['echo'], args=[f'Hello, {name}!'])
```

The parameters and annotations in the Container Component function declare the component's interface. In this case, the component has one input parameter `name` and no output parameters.

When you compile this component, `name` will be replaced with a placeholder. At runtime, this placeholder is replaced with the actual value for `name` provided to the `say_hello` component.

Another way to implement this component is to use `sh -c` to read the commands from a single string and pass the name as an argument. This approach tends to be more flexible, as it readily allows chaining multiple commands together.

```python
from kfp import dsl

@dsl.container_component
def say_hello(name: str):
    return dsl.ContainerSpec(image='alpine', command=['sh', '-c', 'echo Hello, $0!'], args=[name])
```

When you run the component with the argument `name='World'`, you’ll see the string `'Hello, World!'` in `say_hello`’s logs.

### Create component outputs

Unlike Python functions, containers do not have a standard mechanism for returning values. To enable Container Components to have outputs, KFP requires you to write outputs to a file inside the container. KFP will read this file and persist the output.

To return an output string from the say `say_hello` component, you can add an output parameter to the function using a `dsl.OutputPath(str)` annotation:

```python
@dsl.container_component
def say_hello(name: str, greeting: dsl.OutputPath(str)):
    ...
```

This component now has one input parameter named `name` typed `str` and one output parameter named `greeting` also typed `str`. At runtime, parameters annotated with [`dsl.OutputPath`][dsl-outputpath] will be provided a system-generated path as an argument. Your component logic should write the output value to this path as JSON. The argument `str` in `greeting: dsl.OutputPath(str)` describes the type of the output `greeting` (e.g., the JSON written to the path `greeting` will be a string). You can fill in the `command` and `args` to write the output:

```python
@dsl.container_component
def say_hello(name: str, greeting: dsl.OutputPath(str)):
    """Log a greeting and return it as an output."""

    return dsl.ContainerSpec(
        image='alpine',
        command=[
            'sh', '-c', '''RESPONSE="Hello, $0!"\
                            && echo $RESPONSE\
                            && mkdir -p $(dirname $1)\
                            && echo $RESPONSE > $1
                            '''
        ],
        args=[name, greeting])
```

### Use in a pipeline

Finally, you can use the updated `say_hello` component in a pipeline:

```python
from kfp import dsl
from kfp import compiler

@dsl.pipeline
def hello_pipeline(person_to_greet: str) -> str:
    # greeting argument is provided automatically at runtime!
    hello_task = say_hello(name=person_to_greet)
    return hello_task.outputs['greeting']

compiler.Compiler().compile(hello_pipeline, 'pipeline.yaml')
```

Note that you will never provide output parameters to components when constructing your pipeline; output parameters are always provided automatically by the backend at runtime.

This should look very similar to the [Hello World pipeline][hello-world-pipeline] with one key difference: since `greeting` is a named output parameter, we access it and return it from the pipeline using `hello_task.outputs['greeting']`, instead of `hello_task.output`. Data passing is discussed in more detail in [Pipelines Basics][pipeline-basics].

[hello-world-pipeline]: /docs/components/pipelines/v2/hello-world
[pipeline-basics]: /docs/components/pipelines/v2/pipelines/pipeline-basics
[alpine]: https://hub.docker.com/_/alpine
[dsl-outputpath]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.OutputPath
[dsl-container-component]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.container_component
[dsl-containerspec]: https://kubeflow-pipelines.readthedocs.io/en/latest/source/dsl.html#kfp.dsl.ContainerSpec
