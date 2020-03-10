+++
title = "Experiment with the Kubeflow Pipelines API"
description = "How to use the Kubeflow Pipelines API to upload a local file to create a new pipeline version"
weight = 1
+++

The following example demonstrates how to use the Kubeflow Pipelines SDK to create a pipeline and a pipeline version.

## Before you start

To follow the example, you must have installed Kubeflow Pipelines SDK version 0.2.5 or higher. Use the following instructions to install the Kubeflow Pipelines SDK and check the SDK version.

* Install the [Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/)
* Run the following command to check the version of the SDK
```
pip list | grep kfp
```
The response should be something like this:
```
kfp                      0.2.5
kfp-server-api           0.2.5
```

## Example: create a pipeline and then create a new version under it

In this example, we first use KFP API client to create a pipeline from a local file. When the pipeline is created, a default pipeline version is created under it automatically. Then, we again use KFP API client to create a new pipeline version from a local file, and the new version will be under the pipeline that just get created.

```python
import kfp
import os

host = <host>
pipeline_file_path = <path to pipeline file>
pipeline_name = <pipeline name>
pipeline_version_file_path = <path to pipeline version file>
pipeline_version_name = <pipeline version name>


if __name__ == '__main__':
  client = kfp.Client(host)
  pipeline_file = os.path.join(pipeline_file_path)
  pipeline = client.pipeline_uploads.upload_pipeline(pipeline_file, name=pipeline_name)
  pipeline_version_file = os.path.join(pipeline_version_file_path)
  pipeline_version = client.pipeline_uploads.upload_pipeline_version(pipeline_version_file, name=pipeline_version_name, pipelineid=pipeline.id)
```

* **host**: Your Kubeflow Pipelines cluster's host name.
* **pipeline file path**: The path to the directory where your pipeline YAML is stored.
* **pipeline name**: Your pipeline's file name.
* **pipeline version file path**: The path to the directory where your pipeline version YAML is stored.
* **pipeline version name**: Your pipeline version's file name.

Note that the pipeline names need to be unique across your KFP instance; while pipeline version names need to be unique under each pipeline.