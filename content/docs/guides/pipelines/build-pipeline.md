+++
title = "Build a Pipeline"
description = "Deploy the Kubeflow Pipelines service"
weight = 4
+++

This page describes how to author pipelines and components, and submit them to 
the Kubeflow Pipelines system to run.

## Using a notebook

You can choose to build your pipeline in a Jupyter notebook.

We suggest that you use the JupyterHub that is installed in the same cluster as 
the pipeline system. Follow these steps to start a notebook:

* Follow the [instructions](/docs/guides/pipelines/deploy-pipelines-service) to 
  deploy a pipeline cluster and run a `kubectl` proxy to connect to the cluster. 
  You should see the Kubeflow Pipelines UI.

* Click **Notebooks** in the left-hend menu. If this is the first time you've 
  visited JupyterHub, you need to sign in with any username. Password can be 
  blank. Then click the **Spawn** button to create a new instance. After a few 
  minutes, the Jupyter UI opens. You can switch to the JupyterLab UI by changing 
  `/tree` to `/lab` in the URL. 

* Download the sample notebooks from 
  https://github.com/kubeflow/pipelines/tree/master/samples/notebooks. 
  
* Upload these notebooks from the Jupyter UI. In Jupyter, go to the tree view 
  and find the **upload** button in the top right-hand area of the screen.

* Open the uploaded notebooks and make sure you are on Python 3. The Python 
  version is at the top right-hand corner in the Jupyter notebook view. You can 
  run the notebooks now.

Note: The notebook samples don't work on Jupyter notebooks outside the same cluster, 
because the Python library communicates with the Kubeflow Pipelines system 
through in-cluster service names.

The following notebooks are available:

* [KubeFlow pipeline using TFX OSS components](https://github.com/kubeflow/pipelines/blob/master/samples/notebooks/KubeFlow%20Pipeline%20Using%20TFX%20OSS%20Components.ipynb): 
  This notebook demonstrates building a machine learning pipeline based on
  [TensorFlow Extended (TFX)](https://www.tensorflow.org/tfx/) components. 
  The pipeline includes a TFDV step to infer the schema, a TFT preprocessor, a 
  TensorFlow trainer, a TFMA analyzer, and a model deployer which deploys the 
  trained model to `tf-serving` in the same cluster. The notebook also 
  demonstrates how to build a component based on Python 3 inside the notebook 
  including building a docker container.

* [Lightweight python components](https://github.com/kubeflow/pipelines/blob/master/samples/notebooks/Lightweight%20Python%20components%20-%20basics.ipynb): 
  This notebook demonstrates building simple Python components based on Python 3
  and using  them in a pipeline with fast iterations. Going this route, building
  a component does not require building a docker container so it is faster, but 
  the container image may not be self contained because the source code is not 
  built into the container.

By following the notebooks you learn how to build pipelines and components with 
the Kubeflow Pipelines SDK (a Python DSL).

## Using the command line

Instead of using a notebook, you can choose to set up things yourself using the 
command line. But currently you can't use the Python SDK to submit 
pipelines to a cluster, and you can't build container images using the SDK.
The DSL compiler works as usual.

**Python 3.5 or above is required**. If you don't have Python 3 set up, we 
suggest the following steps to install 
[Miniconda](https://conda.io/miniconda.html).
 
* In a Debian/Ubuntu/[Cloud shell](https://console.cloud.google.com/cloudshell) 
  environment:   

    ```bash
    apt-get update; apt-get install -y wget bzip2
    wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh
    ```

* In a Windows environment, download the 
  [installer](https://repo.continuum.io/miniconda/Miniconda3-latest-Windows-x86_64.exe) 
  and  make sure you select the "*Add Miniconda to my PATH environment variable*" 
  option during the installation.

* In a Mac environment, download the 
  [installer](https://repo.continuum.io/miniconda/Miniconda3-latest-MacOSX-x86_64.sh) 
  and run the following command:

    ```bash
    bash Miniconda3-latest-MacOSX-x86_64.sh
    ```

Create a clean Python 3 environment:
 
```bash
conda create --name mlpipeline python=3.6
source activate mlpipeline
```
 
If the `conda` command is not found, be sure to add the Miniconda path:
 
```bash
export PATH=MINICONDA_PATH/bin:$PATH
```
 
### Install the Kubeflow Pipelines SDK

Run the following to install the Kubeflow Pipelines SDK:

```bash
pip3 install https://storage.googleapis.com/ml-pipeline/release/0.1.7/kfp.tar.gz --upgrade
```

After successful installation the command `dsl-compile` should be added to your 
PATH.

### Compile the samples

The pipelines are written in Python, but they must be compiled to an 
intermediate representation before submitting to the Kubeflow Pipelines service:

```bash
dsl-compile --py [path/to/py/file] --output [path/to/output/tar.gz]
```

For example:

```bash
dsl-compile --py [ML_REPO_DIRECTORY]/samples/basic/sequential.py --output [ML_REPO_DIRECTORY]/samples/basic/sequential.tar.gz
```

### Deploy the samples

Upload the generated `.tar.gz` file through the Kubeflow Pipelines UI.

## Advanced: Build your own components

See how to 
[build your own pipeline components](/docs/guides/pipelines/build-component).
