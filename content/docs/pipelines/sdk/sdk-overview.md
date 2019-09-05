+++
title = "Introduction to the Pipelines SDK"
description = "Overview of using the SDK to build components and pipelines"
weight = 10
+++

The [Kubeflow Pipelines 
SDK](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.html)
provides a set of Python packages that you can use to specify and run your 
machine learning (ML) workflows. A *pipeline* is a description of an ML 
workflow, including all of the *components* that make up the steps in the 
workflow and how the components interact with each other. 

## SDK packages

The Kubeflow Pipelines SDK includes the following packages:

* [`kfp.compiler`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html)
  includes classes and methods for building Docker container images for your
  pipeline components. Methods in this package include, but are not limited
  to, the following:

  * `kfp.compiler.Compiler.compile` compiles your Python DSL code into a single 
    static configuration (in YAML format) that the Kubeflow Pipelines service
    can process. The Kubeflow Pipelines service converts the static 
    configuration into a set of Kubernetes resources for execution.

  * `kfp.compiler.build_docker_image` builds a container image based on a 
    Dockerfile and pushes the image to a URI. In the parameters, you provide the 
    path to a Dockerfile containing the image specification, and the URI for the 
    target image (for example, a container registry).

  * `kfp.compiler.build_python_component` builds a container image for a
    pipeline component based on a Python function, and pushes the image to a 
    URI. In the parameters, you provide the Python function that does the work 
    of the pipeline component, a Docker image to use as a base image, 
    and the URI for the target image (for example, a container registry).

* [`kfp.components`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html)
  includes classes and methods for interacting with pipeline components. 
  Methods in this package include, but are not limited to, the following:

  * `kfp.components.func_to_container_op` converts a Python function to a 
    pipeline component and returns a factory function.
    You can then call the factory function to construct an instance of a 
    pipeline task
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)) 
    that runs the original function in a container.

  * `kfp.components.load_component_from_file` loads a pipeline component from
    a file and returns a factory function.
    You can then call the factory function to construct an instance of a 
    pipeline task 
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)) 
    that runs the component container image.

  * `kfp.components.load_component_from_url` loads a pipeline component from
    a URL and returns a factory function.
    You can then call the factory function to construct an instance of a 
    pipeline task 
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)) 
    that runs the component container image.

* [`kfp.dsl`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html)
  contains the domain-specific language (DSL) that you can use to define and
  interact with pipelines and components. 
  Methods, classes, and modules in this package include, but are not limited to, 
  the following:

  * `kfp.dsl.ContainerOp` represents a pipeline task (op) implemented by a 
    container image.
  * `kfp.dsl.PipelineParam` represents a pipeline parameter that you can pass
    from one pipeline component to another. See the guide to 
    [pipeline parameters](/docs/pipelines/sdk/parameters/).
  * `kfp.dsl.component` is a decorator for DSL functions that returns a
    pipeline component.
    ([`ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp)).
  * `kfp.dsl.pipeline` is a decorator for Python functions that returns a
    pipeline.
  * `kfp.dsl.python_component` is a decorator for Python functions that adds
    pipeline component metadata to the function object.
  * [`kfp.dsl.types`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.types.html) 
    contains a list of types defined by the Kubeflow Pipelines SDK. Types
    include basic types like `String`, `Integer`, `Float`, and `Bool`, as well
    as domain-specific types like `GCPProjectID` and `GCRPath`.
    See the guide to 
    [DSL static type checking](/docs/pipelines/sdk/static-type-checking).
  * [`kfp.dsl.ResourceOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ResourceOp)
    represents a pipeline task (op) which lets you directly manipulate 
    Kubernetes resources (`create`, `get`, `apply`, ...).
  * [`kfp.dsl.VolumeOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.VolumeOp)
    represents a pipeline task (op) which creates a new `PersistentVolumeClaim` 
    (PVC). It aims to make the common case of creating a `PersistentVolumeClaim` 
    fast.
  * [`kfp.dsl.VolumeSnapshotOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.VolumeSnapshotOp)
    represents a pipeline task (op) which creates a new `VolumeSnapshot`. It 
    aims to make the common case of creating a `VolumeSnapshot` fast.
  * [`kfp.dsl.PipelineVolume`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.PipelineVolume)
    represents a volume used to pass data between pipeline steps. `ContainerOp`s 
    can mount a `PipelineVolume` either via the constructor's argument 
    `pvolumes` or `add_pvolumes()` method.

* [`kfp.Client`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html)
  contains the Python client libraries for the [Kubeflow Pipelines 
  API](/docs/pipelines/reference/api/kubeflow-pipeline-api-spec/).
  Methods in this package include, but are not limited to, the following:

  * `kfp.Client.create_experiment` creates a pipeline 
    [experiment](/docs/pipelines/concepts/experiment/) and returns an
    experiment object.
  * `kfp.Client.run_pipeline` runs a pipeline and returns a run object.

* [`kfp.notebook`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.notebook.html)

* [KFP extension modules](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html)
  include classes and functions for specific platforms on which you can use
  Kubeflow Pipelines. Examples include utility functions for on premises,
  Google Cloud Platform (GCP), Amazon Web Services (AWS), and Microsoft Azure.

## Installing the SDK

Follow the guide to 
[installing the Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).

## Building pipelines and components

This section summarizes the ways you can use the SDK to build pipelines and 
components:

* [Creating components from existing application 
  code](#standard-component-outside-app)
* [Creating components within your application code](#standard-component-in-app)
* [Creating lightweight components](#lightweight-component)
* [Using prebuilt, reusuable components in your pipeline](#prebuilt-component)

The diagrams provide a conceptual guide to the relationships between the 
following concepts:

* Your Python code
* A pipeline component
* A Docker container image
* A pipeline

<a id="standard-component-outside-app"></a>
### Creating components from existing application code

This section describes how to create a component and a pipeline *outside* your
Python application, by creating components from existing containerized
applications. This technique is useful when you have already created a 
TensorFlow program, for example, and you want to use it in a pipeline.

<img src="/docs/images/pipelines-sdk-outside-app.svg" 
  alt="Creating components outside your application code"
  class="mt-3 mb-3 border border-info rounded">

Below is a more detailed explanation of the above diagram:

1. Write your application code, `my-app-code.py`. For example, write code to
  transform data or train a model.

1. Create a [Docker](https://docs.docker.com/get-started/) container image that 
  packages your program (`my-app-code.py`) and upload the container image to a 
  registry. To build a container image based on a given 
  [Dockerfile](https://docs.docker.com/engine/reference/builder/), you can use 
  the [Docker command-line 
  interface](https://docs.docker.com/engine/reference/commandline/cli/)
  or the 
  [`kfp.compiler.build_docker_image` method](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.build_docker_image) from the Kubeflow Pipelines 
  SDK.

1. Write a component function using the Kubeflow Pipelines DSL to define your
  pipeline's interactions with the component’s Docker container. Your
  component function must return a
  [`kfp.dsl.ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp).
  Optionally, you can use the [`kfp.dsl.component` 
  decorator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.component)
  to enable [static type checking](/docs/pipelines/sdk/static-type-checking) in 
  the DSL compiler. To use the decorator, you can add the `@kfp.dsl.component` 
  annotation to your component function:

    ```python
    @kfp.dsl.component
    def my_component(my_param):
      ...
      return kfp.dsl.ContainerOp(
        name='My component name',
        image='gcr.io/path/to/container/image'
      )
    ```

1. Write a pipeline function using the Kubeflow Pipelines DSL to define the 
  pipeline and include all the pipeline components. Use the [`kfp.dsl.pipeline`
  decorator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.pipeline)
  to build a pipeline from your pipeline function. To use the decorator, you can
  add the `@kfp.dsl.pipeline` annotation to your pipeline function:

    ```python
    @kfp.dsl.pipeline(
      name='My pipeline',
      description='My machine learning pipeline'
    )
    def my_pipeline(param_1: PipelineParam, param_2: PipelineParam):
      my_step = my_component(my_param='a')
    ```

1. Compile the pipeline to generate a compressed YAML definition of the 
  pipeline. The Kubeflow Pipelines service converts the static configuration 
  into a set of Kubernetes resources for execution.
  
    To compile the pipeline, you can choose one of the following 
    options:

    * Use the 
      [`kfp.compiler.Compiler.compile`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.Compiler) 
      method:

        ```python
        kfp.compiler.Compiler().compile(my_pipeline,  
          'my-pipeline.zip')
        ```

    * Alternatively, use the `dsl-compile` command on the command line.

        ```shell
        dsl-compile --py [path/to/python/file] --output my-pipeline.zip
        ```

1. Use the Kubeflow Pipelines SDK to run the pipeline:

    ```python
    client = kfp.Client()
    my_experiment = client.create_experiment(name='demo')
    my_run = client.run_pipeline(my_experiment.id, 'my-pipeline', 
      'my-pipeline.zip')
    ```

You can also choose to share your pipeline as follows:

* Upload the pipeline zip file to the Kubeflow Pipelines UI. For more 
  information about the UI, see the [Kubeflow Pipelines quickstart 
  guide](/docs/pipelines/pipelines-quickstart/).
* Upload the pipeline zip file to a shared repository. See the 
  [reusable components and other shared resources](/docs/examples/shared-resources/).

{{% alert title="More about the above workflow" color="info" %}}
For more detailed instructions, see the guide to [building components and 
pipelines](/docs/pipelines/sdk/build-component/).

For an example, see the
[`xgboost-training-cm.py`](https://github.com/kubeflow/pipelines/blob/master/samples/core/xgboost_training_cm/xgboost_training_cm.py)
pipeline sample on GitHub. The pipeline creates an XGBoost model using 
structured data in CSV format.
{{% /alert %}}

<a id="standard-component-in-app"></a>
### Creating components within your application code

This section describes how to create a pipeline component *inside* your
Python application, as part of the application. The DSL code for creating a
component therefore runs inside your Docker container.

<img src="/docs/images/pipelines-sdk-within-app.svg" 
  alt="Building components within your application code"
  class="mt-3 mb-3 border border-info rounded">

Below is a more detailed explanation of the above diagram:

1. Write your code in a Python function. For example, write code to transform 
  data or train a model:

    ```python
    def my_python_func(a: str, b: str) -> str:
      ...
    ```

1. Use the [`kfp.dsl.python_component`
  decorator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.python_component)
  to convert your Python function into 
  a pipeline component. To use the decorator, you can add the 
  `@kfp.dsl.python_component` annotation to your function:

    ```python
    @kfp.dsl.python_component(
      name='My awesome component',
      description='Come and play',
    )
    def my_python_func(a: str, b: str) -> str:
      ...
    ```

1. Use 
  [`kfp.compiler.build_python_component`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.build_python_component)
  to create a container image for the component.

    ```python
    my_op = compiler.build_python_component(
      component_func=my_python_func,
      staging_gcs_path=OUTPUT_DIR,
      target_image=TARGET_IMAGE)
    ```

1. Write a pipeline function using the Kubeflow Pipelines DSL to define the 
  pipeline and include all the pipeline components. Use the [`kfp.dsl.pipeline`
  decorator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.pipeline)
  to build a pipeline from your pipeline function, by adding 
  the `@kfp.dsl.pipeline` annotation to your pipeline function:

    ```python
    @kfp.dsl.pipeline(
      name='My pipeline',
      description='My machine learning pipeline'
    )
    def my_pipeline(param_1: PipelineParam, param_2: PipelineParam):
      my_step = my_op(a='a', b='b')
    ```

1. Compile the pipeline to generate a compressed YAML definition of the 
  pipeline. The Kubeflow Pipelines service converts the static configuration 
  into a set of Kubernetes resources for execution.
  
    To compile the pipeline, you can choose one of the following 
    options:

    * Use the 
      [`kfp.compiler.Compiler.compile`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.Compiler) 
      method:

        ```python
        kfp.compiler.Compiler().compile(my_pipeline,  
          'my-pipeline.zip')
        ```

    * Alternatively, use the `dsl-compile` command on the command line.

        ```shell
        dsl-compile --py [path/to/python/file] --output my-pipeline.zip
        ```

1. Use the Kubeflow Pipelines SDK to run the pipeline:

    ```python
    client = kfp.Client()
    my_experiment = client.create_experiment(name='demo')
    my_run = client.run_pipeline(my_experiment.id, 'my-pipeline', 
      'my-pipeline.zip')
    ```

You can also choose to share your pipeline as follows:

* Upload the pipeline zip file to the Kubeflow Pipelines UI. For more 
  information about the UI, see the [Kubeflow Pipelines quickstart 
  guide](/docs/pipelines/pipelines-quickstart/).
* Upload the pipeline zip file to a shared repository. See the 
  [reusable components and other shared resources](/docs/examples/shared-resources/).

{{% alert title="More about the above workflow" color="info" %}}
For an example of the above workflow, see the
Jupyter notebook titled [KubeFlow Pipeline Using TFX OSS 
Components](https://github.com/kubeflow/pipelines/blob/master/samples/core/kubeflow_pipeline_using_TFX_OSS_components/KubeFlow%20Pipeline%20Using%20TFX%20OSS%20Components.ipynb) on GitHub.
{{% /alert %}}

<a id="lightweight-component"></a>
### Creating lightweight components

This section describes how to create lightweight Python components that do not
require you to build a container image. Lightweight components simplify 
prototyping and rapid development, especially in a Jupyter notebook environment.

<img src="/docs/images/pipelines-sdk-lightweight.svg" 
  alt="Building lightweight Python components"
  class="mt-3 mb-3 border border-info rounded">

Below is a more detailed explanation of the above diagram:

1. Write your code in a Python function. For example, write code to transform 
  data or train a model:

    ```python
    def my_python_func(a: str, b: str) -> str:
      ...
    ```

1. Use 
  [`kfp.components.func_to_container_op`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html#kfp.components.func_to_container_op)
  to convert your Python function into a pipeline component:

    ```python
    my_op = kfp.components.func_to_container_op(my_python_func)
    ```

    Optionally, you can write the component to a file that you can share or use
    in another pipeline:

    ```python
    my_op = kfp.components.func_to_container_op(my_python_func, 
      output_component_file='my-op.component')
    ```

1. If you stored your lightweight component in a file as described in the 
  previous step, use 
  [`kfp.components.load_component_from_file`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html#kfp.components.load_component_from_file)
  to load the component:

    ```python
    my_op = kfp.components.load_component_from_file('my-op.component')
    ```

1. Write a pipeline function using the Kubeflow Pipelines DSL to define the 
  pipeline and include all the pipeline components. Use the [`kfp.dsl.pipeline`
  decorator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.pipeline)
  to build a pipeline from your pipeline function, by adding 
  the `@kfp.dsl.pipeline` annotation to your pipeline function:

    ```python
    @kfp.dsl.pipeline(
      name='My pipeline',
      description='My machine learning pipeline'
    )
    def my_pipeline(param_1: PipelineParam, param_2: PipelineParam):
      my_step = my_op(a='a', b='b')
    ```

1. Compile the pipeline to generate a compressed YAML definition of the 
  pipeline. The Kubeflow Pipelines service converts the static configuration 
  into a set of Kubernetes resources for execution.
  
    To compile the pipeline, you can choose one of the following 
    options:

    * Use the 
      [`kfp.compiler.Compiler.compile`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.Compiler) 
      method:

        ```python
        kfp.compiler.Compiler().compile(my_pipeline,  
          'my-pipeline.zip')
        ```

    * Alternatively, use the `dsl-compile` command on the command line.

        ```shell
        dsl-compile --py [path/to/python/file] --output my-pipeline.zip
        ```

1. Use the Kubeflow Pipelines SDK to run the pipeline:

    ```python
    client = kfp.Client()
    my_experiment = client.create_experiment(name='demo')
    my_run = client.run_pipeline(my_experiment.id, 'my-pipeline', 
      'my-pipeline.zip')
    ```

{{% alert title="More about the above workflow" color="info" %}}
For more detailed instructions, see the guide to [building lightweight 
components](/docs/pipelines/sdk/lightweight-python-components/).

For an example, see the [Lightweight Python components - 
basics](https://github.com/kubeflow/pipelines/blob/master/samples/core/lightweight_component/Lightweight%20Python%20components%20-%20basics.ipynb)
notebook on GitHub.
{{% /alert %}}

<a id="prebuilt-component"></a>
### Using prebuilt, reusable components in your pipeline

A reusable component is one that someone has built and made available for others
to use. To use the component in your pipeline, you need the YAML file that
defines the component.

<img src="/docs/images/pipelines-sdk-reusable.svg" 
  alt="Using prebuilt, reusable components in your pipeline"
  class="mt-3 mb-3 border border-info rounded">

Below is a more detailed explanation of the above diagram:

1. Find the YAML file that defines the reusable component. For example, take a
  look at the [reusable components and other shared 
  resources](/docs/examples/shared-resources/).

1. Use 
  [`kfp.components.load_component_from_url`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html#kfp.components.load_component_from_url)
  to load the component:

    ```python
    my_op = kfp.components.load_component_from_url('https://path/to/component.yaml')
    ```

1. Write a pipeline function using the Kubeflow Pipelines DSL to define the 
  pipeline and include all the pipeline components. Use the [`kfp.dsl.pipeline`
  decorator](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.pipeline)
  to build a pipeline from your pipeline function, by adding 
  the `@kfp.dsl.pipeline` annotation to your pipeline function:

    ```python
    @kfp.dsl.pipeline(
      name='My pipeline',
      description='My machine learning pipeline'
    )
    def my_pipeline(param_1: PipelineParam, param_2: PipelineParam):
      my_step = my_op(a='a', b='b')
    ```

1. Compile the pipeline to generate a compressed YAML definition of the 
  pipeline. The Kubeflow Pipelines service converts the static configuration 
  into a set of Kubernetes resources for execution.
  
    To compile the pipeline, you can choose one of the following 
    options:

    * Use the 
      [`kfp.compiler.Compiler.compile`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.compiler.html#kfp.compiler.Compiler) 
      method:

        ```python
        kfp.compiler.Compiler().compile(my_pipeline,  
          'my-pipeline.zip')
        ```

    * Alternatively, use the `dsl-compile` command on the command line.

        ```shell
        dsl-compile --py [path/to/python/file] --output my-pipeline.zip
        ```

1. Use the Kubeflow Pipelines SDK to run the pipeline:

    ```python
    client = kfp.Client()
    my_experiment = client.create_experiment(name='demo')
    my_run = client.run_pipeline(my_experiment.id, 'my-pipeline', 
      'my-pipeline.zip')
    ```
{{% alert title="More about the above workflow" color="info" %}}
For an example, see the
[`xgboost-training-cm.py`](https://github.com/kubeflow/pipelines/blob/master/samples/core/xgboost-spark/xgboost-training-cm.py)
pipeline sample on GitHub. The pipeline creates an XGBoost model using 
structured data in CSV format.
{{% /alert %}}

## Next steps

* [Use pipeline parameters](/docs/pipelines/sdk/parameters/) to pass data between components.
* Learn how to [write recursive functions in the 
  DSL](/docs/pipelines/sdk/dsl-recursion).
* Build a [reusable component](/docs/pipelines/sdk/component-development/) for
  sharing in multiple pipelines.
* Find out how to use the DSL to [manipulate Kubernetes resources dynamically 
  as steps of your pipeline](/docs/pipelines/sdk/manipulate-resources/).
