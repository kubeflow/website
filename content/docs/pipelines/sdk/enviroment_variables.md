+++
title = "Using environment variables in pipelines"
description = "How to set and use environment variables in Kubeflow pipelines"
weight = 115
+++

This page describes how to pass environment variables to Kubeflow pipeline 
components.

## Before you start

Set up your environment: 

- [Install Kubeflow](https://www.kubeflow.org/docs/started/getting-started/)
- [Install the Kubeflow Pipelines SDK](https://www.kubeflow.org/docs/pipelines/sdk/install-sdk/)
- [Kubeflow set up on kubernetes](https://www.Kubeflow.org/docs/gke/deploy/deploy-cli/)
- Jupyter nooteboks set up on you Kubeflow deployment


## Using environment variables 

In this example, you pass an environment variable to a lightweight Python 
component, which writes the variable's value to the log.

[Learn more about](https://www.Kubeflow.org/docs/pipelines/sdk/lightweight-python-components/).

To build a component, define a stand-alone Python function and then call 
[kfp.components.func_to_container_op(func)](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html#kfp.components.func_to_container_op) to convert the function to a 
component that can be used in a pipeline. The following function gets an 
environment variable and writes it to the log.

```python
    def logg_env_function():
        import os
        import logging
        logging.basicConfig(level=logging.INFO)
        env_variable = os.getenv('example_env')
        #logging out the environment variable
        logging.info('The environment variable is: {}'.format(env_variable))
```

Transform the function into a component using 
[kfp.components.func_to_container_op(func)](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.components.html#kfp.components.func_to_container_op).  
```python
    logg_env_function_op = comp.func_to_container_op(logg_env_function, base_image='tensorflow/tensorflow:1.11.0-py3')
```

Add this component to a pipeline. Use [add_env_variable](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp.container) to pass an 
environment variable into the component. This code is the same no matter if your
using python lightweight components or prebuild container. 


```python
    import kfp.dsl as dsl
    from kubernetes.client.models import V1EnvVar

    @dsl.pipeline(
    name='Logging',
    description='A pipline showing how to use environment variables'
    )
    def environment_pipline():

        #Returns a dsl.ContainerOp class instance. 
        container_op = logg_env_function_op().add_env_variable(V1EnvVar(name='example_env', value='env_variable')) 
```

To pass more environment variables into a component, add more instances of 
[add_env_variable()](). Use the following command to run this pipeline using the 
Kubeflow Pipelines SDK.


To use more then one env variables you simply add on more .add_env_varaible()
after the first one. Then execute the pipline in the notebok. 

```python
    #Specify pipeline argument values
    arguments = {}

    #Submit a pipeline run
    kfp.Client().create_run_from_pipeline_func(environment_pipline, arguments=arguments)
```