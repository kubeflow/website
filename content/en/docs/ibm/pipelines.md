+++
title = "Pipelines on IBM Cloud Kubernetes Service (IKS)"
description = "Instructions for using Kubeflow Pipelines on IBM Cloud Kubernetes Service (IKS)"
weight = 50
+++

By default, Kubeflow pipelines on IBM Cloud are running with the Tekton backend. Below are the instructions on how to use the Kubeflow Pipelines with the Tekton backend [(kfp-tekton)](https://github.com/kubeflow/kfp-tekton).

In this tutorial, we use the below single step pipeline as our example

```python
from kfp import dsl
def echo_op():
    return dsl.ContainerOp(
        name='echo',
        image='busybox',
        command=['sh', '-c'],
        arguments=['echo "Got scheduled"']
    )

@dsl.pipeline(
    name='echo',
    description='echo pipeline'
)
def echo_pipeline(
):
    echo = echo_op()
```

# Declare the Python Client for Kubeflow Pipelines

## 1. Single User Kubeflow Pipelines with the SDK

**Notes**:
* Python package [`kfp-tekton`](https://pypi.org/project/kfp-tekton/) v0.4.0 or above is required.
* This code block below is for the single user Kubeflow deployment from the manifest
[https://raw.githubusercontent.com/kubeflow/manifests/v1.2-branch/kfdef/kfctl_ibm.v1.2.0.yaml](https://raw.githubusercontent.com/kubeflow/manifests/v1.2-branch/kfdef/kfctl_ibm.v1.2.0.yaml).

```python
from kfp_tekton import TektonClient

KUBEFLOW_PUBLIC_ENDPOINT_URL = 'http://<Kubeflow_public_endpoint_URL>'
KUBEFLOW_PROFILE_NAME = None
client = TektonClient(host=KUBEFLOW_PUBLIC_ENDPOINT_URL)
```

## 2. Authenticating Multi-user Kubeflow Pipelines with the SDK

**Notes**:
* Python package [`kfp-tekton`](https://pypi.org/project/kfp-tekton/) v0.4.0 or above is required.
* This feature is available with multi-user, auth-enabled Kubeflow installation deployed from the manifest [https://raw.githubusercontent.com/kubeflow/manifests/v1.2-branch/kfdef/kfctl_ibm_multi_user.v1.2.0.yaml](https://raw.githubusercontent.com/kubeflow/manifests/v1.2-branch/kfdef/kfctl_ibm_multi_user.v1.2.0.yaml).
* Since it transports sensitive information like session cookie value over edge network, we highly recommend enabling HTTPS for the public endpoint of Kubeflow.

It requires authentication via the public endpoint of Kubeflow deployment when using the Kubeflow Pipelines multi-user feature with Pipelines SDK. Below variables need to be provided, no matter coming from an in-cluster Jupyter notebook or a remote machine:
1. `KUBEFLOW_PUBLIC_ENDPOINT_URL` - Kubeflow public endpoint URL. You can obtain it from command `ibmcloud ks nlb-dns ls --cluster <your-cluster-name>`.
1. `SESSION_COOKIE` - A session cookie starts with `authservice_session=`. You can obtain it from your browser after authenticated from Kubeflow UI. Notice that this session cookie expires in 24 hours, so you need to obtain it again after cookie expired.
1. `KUBEFLOW_PROFILE_NAME` - Your Kubeflow profile name

Once you obtain above information, it can use the following Python code to list all your Pipelines experiments:
```Python
from kfp_tekton import TektonClient

KUBEFLOW_PUBLIC_ENDPOINT_URL = 'https://xxxx.<region-name>.containers.appdomain.cloud'
# this session cookie looks like "authservice_session=xxxxxxx"
SESSION_COOKIE = 'authservice_session=xxxxxxx'
KUBEFLOW_PROFILE_NAME = '<your-profile-name>'

client = TektonClient(
    host=f'{KUBEFLOW_PUBLIC_ENDPOINT_URL}/pipeline',
    cookies=SESSION_COOKIE
)

experiments = client.list_experiments(namespace=KUBEFLOW_PROFILE_NAME)
```

Pipelines components like experiments and runs are isolated by Kubeflow profiles. A Kubeflow user can only see Pipelines experiments and runs belonging to this user's Kubeflow profile.

# Upload Pipelines

Once the above Python client is declared, pipelines can be uploaded using Python. Run the below code block inside the Python session to upload the pipelines. The below code block shows how to upload different versions of the pipeline using the Python client.

```python
import os

# Initial version of the compiled pipeline
pipeline_file_path = 'echo_pipeline.yaml'
pipeline_name = 'echo_pipeline'

# For the purpose of this tutorial, we will be using the same pipeline for both version.
pipeline_version_file_path = 'echo_pipeline.yaml'
pipeline_version_name = 'new_echo_pipeline'

# Upload initial version of the pipeline
pipeline_file = os.path.join(pipeline_file_path)
pipeline = client.pipeline_uploads.upload_pipeline(pipeline_file, name=pipeline_name)

# Upload new version of the pipeline
pipeline_version_file = os.path.join(pipeline_version_file_path)
pipeline_version = client.pipeline_uploads.upload_pipeline_version(pipeline_version_file,
                                                                   name=pipeline_version_name,
                                                                   pipelineid=pipeline.id)
```

# Run Pipelines
The `TektonClient` can run pipelines using one of the below sources:

1. [Python DSL source code](#run-pipelines-from-the-python-dsl-source-code)
2. [Compiled pipeline file](#run-pipelines-from-the-compiled-pipeline-file)
3. [List of uploaded pipelines](#run-pipelines-from-the-list-of-uploaded-pipelines)

## Run pipelines from the Python DSL source code

To execute pipelines using the Python DSL source code, run the below code block in a Python session using the `echo_pipeline` example.
The `create_run_from_pipeline_func` takes the DSL source code to compile and run it directly using the Kubeflow pipeline API without
uploading it to the pipeline list. This method is recommended if we are doing some quick experiments without version control.

```python
# We can overwrite the pipeline default parameters by providing a dictionary of key-value arguments.
# If we don't want to overwrite the default parameters, then define the arguments as an empty dictionary.
arguments={}

client.create_run_from_pipeline_func(echo_pipeline, arguments=arguments, namespace=KUBEFLOW_PROFILE_NAME)
```

## Run pipelines from the compiled pipeline file

Alternatively, we can also run the pipeline directly using a pre-compiled file. 
```python
EXPERIMENT_NAME = 'Demo Experiments'
experiment = client.create_experiment(name=EXPERIMENT_NAME, namespace=KUBEFLOW_PROFILE_NAME)
run = client.run_pipeline(experiment.id, 'echo-pipeline', 'echo_pipeline.yaml')
``` 

## Run pipelines from the list of uploaded pipelines

Similarly, we can also run the pipeline from the list of uploaded pipelines using the same `run_pipeline` function. 

```python
EXPERIMENT_NAME = 'Demo Experiments'
experiment = client.create_experiment(name=EXPERIMENT_NAME, namespace=KUBEFLOW_PROFILE_NAME)

# Find the pipeline ID that we want to use.
client.list_pipelines()

run = client.run_pipeline(experiment.id, pipeline_id='925415d5-18e9-4e08-b57f-3b06e3e54648', job_name='echo_pipeline_run')
``` 
