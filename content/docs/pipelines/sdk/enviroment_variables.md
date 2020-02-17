+++
title = "Using enviroment varibales in piplines"
description = "How set and use enviroment variables in kubeflow piplines"
+++

This page describes how to create a enviroment varaibale for Kubeflow Pipelines 
and how to combine enviroment variable into a pipeline. 

## Before you start

### Initial setup
Before starting with this tutorial the following things have to be in place: 
- A GCP account.
- [Kubeflow set up on GKE](https://www.kubeflow.org/docs/gke/deploy/deploy-cli/)
- Jupyter nooteboks set up on you kubeflow deployment


## Using enviroment variables 

Below is a example python lightweight component where we read a enviroment
variable and the logging it out as a string. 

We are going to use jupyter ligthweight componetes you can find more about them 
[here](https://www.kubeflow.org/docs/pipelines/sdk/lightweight-python-components/).

To build a component, define a stand-alone Python function and then call 
`kfp.components.func_to_container_op(func)` to convert the function to a 
component that can be used in a pipeline. Below is one small function logging 
out the enviroment variable.

```python
    def logg_env_function():
        import os
        import logging
        logging.basicConfig(level=logging.INFO)
        env_variable = os.getenv('Test_env')
        #logging out the enviroment variable
        logging.info('The enviroment variable is: {}'.format(env_variable))
```

Then we transform the function to a container using the 
`kfp.components.func_to_container_op(func)`.  
```python
    logg_env_function_op = comp.func_to_container_op(logg_env_function, base_image='tensorflow/tensorflow:1.11.0-py3')
```

Then the functions is put into a pipline and  it is here that we mount the 
enviroment variable to the container. This code is the same no matter if your
using python lightweight components or prebuild container. 
```python
    import kfp.dsl as dsl
    from kubernetes.client.models import V1EnvVar

    @dsl.pipeline(
    name='Logging',
    description='A pipline showing how to use enviroment variables'
    )
    def enviroment_pipline():

        #Returns a dsl.ContainerOp class instance. 
        container_op = logg_env_function_op().add_env_variable(V1EnvVar(name='Test_env', value='env_variable')) 
```

If more varaiblaes is wanted you would simply add one more .add_env_varaible()
statment after the first one. We then execute the pipline in the notebok. 

```python
    #Specify pipeline argument values
    arguments = {}

    #Submit a pipeline run
    kfp.Client().create_run_from_pipeline_func(enviroment_pipline, arguments=arguments)
```