+++
title = "Use Kubeflow Pipelines API Client"
description = "KFP SDK version >= 0.2.5 is required"
weight = 30
+++

This page includes a quick example on how to create a pipeline and a pipeline version using KFP API client.


## Before you start

* Install the [Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/). The following requires KFP SDK version equal to or greater than 0.2.5. You can test your installed version using
```
pip list | grep kfp
```

## Example 1: create a pipeline and then create a new version under it

* First, we use KFP API client to create a pipeline from a local file.
* When the pipeline is created, a default pipeline version is created under it automatically.
* Then, we again use KFP API client to create a new pipeline version from a local file, and the new version will be under the pipeline that just get created.
* The following template is a simple python script to accomplish the steps described above. Note:
    * Replace \<host>, \<path_to_pipeline_file>, \<pipeline_name>, \<path_to_pipeline_version_file> and \<pipeline_version_name> with the values of your choice.
    * Pipeline names need to be unique across your KFP instance; while pipeline version names need to be unique under each pipeline.

```python
import kfp
import os

host = <host>
pipeline_file_path = <path_to_pipeline_file>
pipeline_name = <pipeline_name>
pipeline_version_file_path = <path_to_pipeline_version_file>
pipeline_version_name = <pipeline_version_name>


if __name__ == '__main__':
  client = kfp.Client(host)
  pipeline_file = os.path.join(pipeline_file_path)
  pipeline = client.pipeline_uploads.upload_pipeline(pipeline_file, name=pipeline_name)
  pipeline_version_file = os.path.join(pipeline_version_file_path)
  pipeline_version = client.pipeline_uploads.upload_pipeline_version(pipeline_version_file, name=pipeline_version_name, pipelineid=pipeline.id)
```