+++
title = "Install the Kubeflow Pipelines SDK"
description = "Setting up your Kubeflow Pipelines development environment"
weight = 1
+++

This guide tells you how to install the 
[Kubeflow Pipelines SDK](https://github.com/kubeflow/pipelines/tree/master/sdk)
which you can use to build machine learning pipelines. You can use the SDK
to execute your pipeline, or alternatively you can upload the pipeline to
the Kubeflow Pipelines UI for execution.

All of the SDK's classes and methods are described in the auto-generated [SDK reference docs](https://kubeflow-pipelines.readthedocs.io/en/latest/).

## Set up Python

You need **Python 3.5** or later to use the Kubeflow Pipelines SDK. This
guide uses Python 3.7.

If you haven't yet set up a Python 3 environment, do so now. This guide
recommends [Miniconda](https://conda.io/miniconda.html), but you can use
a virtual environment manager of your choice, such as `virtualenv`.

Follow the steps below to set 
up Python using [Miniconda](https://conda.io/miniconda.html):

1. Choose one of the following methods to install Miniconda, depending on your
  environment:

  * Debian/Ubuntu/[Cloud Shell](https://console.cloud.google.com/cloudshell):   

        ```bash
        apt-get update; apt-get install -y wget bzip2
        wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
        bash Miniconda3-latest-Linux-x86_64.sh
        ```

  * Windows: Download the 
    [installer](https://repo.continuum.io/miniconda/Miniconda3-latest-Windows-x86_64.exe)
    and make sure you select the option to
    **Add Miniconda to my PATH environment variable** during the installation.

  * MacOS: Download the 
    [installer](https://repo.continuum.io/miniconda/Miniconda3-latest-MacOSX-x86_64.sh)
    and run the following command:

        ```bash
        bash Miniconda3-latest-MacOSX-x86_64.sh
        ```

1. Check that the `conda` command is available:

    ```bash
    which conda
    ```

    If the `conda` command is not found, add Miniconda to your path:
 
    ```bash
    export PATH=<YOUR_MINICONDA_PATH>/bin:$PATH
    ```

1. Create a clean Python 3 environment with a name of your choosing. This
  example uses Python 3.7 and an environment name of `mlpipeline`.:
 
    ```bash
    conda create --name mlpipeline python=3.7
    source activate mlpipeline
    ```
 
## Install the Kubeflow Pipelines SDK

Run the following command to install the Kubeflow Pipelines SDK:

```bash
latest_version=$(curl --silent https://api.github.com/repos/kubeflow/pipelines/releases/latest | jq -r .tag_name)
pip install https://storage.googleapis.com/ml-pipeline/release/${latest_version}/kfp.tar.gz --upgrade
```

After successful installation, the command `dsl-compile` should be available.
You can use this command to verify it:

```bash
which dsl-compile
```

The response should be something like this:

```
/<PATH_TO_YOUR_USER_BIN>/miniconda3/envs/mlpipeline/bin/dsl-compile
```

## Next steps

* [Build a component and a pipeline](/docs/pipelines/sdk/build-component/).
* [Get started](/docs/pipelines/pipelines-quickstart) with the 
  Kubeflow Pipelines UI.
* Read more about [pipeline concepts](/docs/pipelines/concepts/).
