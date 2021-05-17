+++
title = "Introducing Kubeflow Pipelines SDK v2"
description = "Overview of how to get started with Kubeflow Pipelines SDK v2"
weight = 10
+++

The Kubeflow Pipelines SDK provides a set of Python packages that you can use to specify and run your machine learning (ML) workflow as a pipeline. Version 2 of the SDK adds support for tracking pipeline runs and artifacts using ML Metadata. Starting with Kubeflow Pipelines 1.6, you can build and run pipelines in v2 compatibility mode.

Kubeflow Pipelines SDK v2 compatibility mode lets you use the new pipeline semantics and gain the benefits of logging your metadata to ML Metadata. You can use ML Metadata to help answer questions about the lineage of your pipeline’s artifacts.

To learn more about the work towards Kubeflow Pipelines v2, read the design documents for [Kubeflow Pipelines v2](http://bit.ly/kfp-v2) and [Kubeflow Pipelines v2 compatible
mode](http://bit.ly/kfp-v2-compatible), or join the Kubeflow Pipelines community.

## Before you begin

1.  Run the following command to install Kubeflow Pipelines SDK v1.6 or higher. If you run this command in a Jupyter notebook, restart the kernel after installing the SDK.
    
    ```bash
    pip install kfp --upgrade
    ```

1.  Import the kfp and kfp.components packages.

    ```python
    import kfp
    import kfp.components as comp
    ```

1.  Create an instance of the kfp.Client class. To find your Kubeflow Pipelines cluster’s hostname and URL scheme, open the Kubeflow Pipelines user interface in your browser. The URL of the Kubeflow Pipelines user interface is something like https://my-cluster.my-organization.com/pipelines. In this case, the host name and URL scheme are https://my-cluster.my-organization.com.

    ```python
    # If you run this command on a Jupyter notebook running on Kubeflow, you can
    # exclude the host parameter.
    # client = kfp.Client()
    client = kfp.Client(host='<your-kubeflow-pipelines-host-name>')
    ```

## Building pipelines using the Kubeflow Pipelines SDK v2

If you are new to building pipelines, read the following guides to learn more about
using Kubeflow Pipelines SDK v2 to build pipelines and components.

*  [Get started building pipelines using Pipelines SDK v2][build-pipeline].
*  [Learn how to build pipeline components using Pipelines SDK v2][build-component].
*  [Build lightweight Python function-based components using Pipelines SDK
   v2][python-component].

If you are familiar with building Kubeflow pipelines, the Kubeflow Pipelines SDK v2 
introduces the following changes:

*   The following changes affect how you build components:

    *   All component inputs and outputs must be annotated with their data type.

    *   The Kubeflow Pipelines SDK v2 makes a distinction between inputs and outputs that
        are _parameters_ and those that are _artifacts_.

        *   Parameters are inputs or outputs of type `str`, `int`, or `float`
            that typically are used to change the behavior of a pipeline. Input parameters
            are always passed by value, which means that they are inserted into the
            command used to execute the component. Parameters are stored in ML Metadata. 

        *   [Artifacts](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/io_types.py)
            are larger inputs or outputs, such as datasets or models. Input
            artifacts are always passed as a reference to a path. 

            You can also access an artifact's metadata. For input artifacts, you can
            read the artifact's metadata. For output artifacts, you can write key/value
            pairs to the metadata dictionary.  

*   The following changes affect how you define a pipeline:

    *   Pipeline functions must be decorated with
         [`@kfp.dsl.pipeline`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/dsl/_pipeline.py). Specify the following arguments for the 
         `@pipeline` annotation.

        *   `name`: The pipeline name is used when querying MLMD to store or lookup
             component parameters and artifacts. Reusing pipeline names may result in unexpected behaviors. You can override this name when you run the pipeline.
        *   `description`: (Optional.) A user friendly description of this pipeline.
        *   `pipeline_root`: (Optional.) The root path where this pipeline's outputs
            are stored. This can be a MinIO, Google Cloud Storage, or Amazon Web Services
            S3 URI. You can override the pipeline root when you run the pipeline.

            If you do not specify the `pipeline_root`, Kubeflow Pipelines stores your
            artifacts using MinIO.
    
    *   The Kubeflow Pipelines SDK v2 compiler checks that data types are used correctly in pipelines,
+        and that parameters outputs are not passed to artifact inputs and vice versa

        You might need to modify existing pipelines to run them in v2 compatibility mode.

    *   It is not longer supported to pass constants to artifact inputs. 

    *   All pipeline parameters must be annotated with their data type.

## Running pipelines in v2 compatibility mode

To run your pipeline in v2 compatibility mode, specify that 
`mode=kfp.dsl.PipelineExecutionMode.V2_COMPATIBLE` when you create a pipeline
run using `create_run_from_pipeline_func`. The following example demonstrates
how to run a pipeline using v2 compatibility mode.

```python
import kfp
import kfp.dsl as dsl
from kfp.v2.dsl import component

@component
def add(a: float, b: float) -> float:
  '''Calculates sum of two arguments'''
  return a + b

@dsl.pipeline(
  name='addition-pipeline',
  description='An example pipeline that performs addition calculations.',
  # pipeline_root='gs://my-pipeline-root/example-pipeline'
)
def add_pipeline(a: float=1, b: float=7):
  add_task = add(a, b)

# run the pipeline in v2 compatibility mode
client.create_run_from_pipeline_func(
    add_pipeline,
    arguments={'a': 7, 'b': 8},
    mode=kfp.dsl.PipelineExecutionMode.V2_COMPATIBLE,
)
```

[build-pipeline]: /docs/components/pipelines/sdk/v2/build-pipeline/
[build-component]: /docs/components/pipelines/sdk/v2/component-development/
[python-component]: /docs/components/pipelines/sdk/v2/python-function-components/