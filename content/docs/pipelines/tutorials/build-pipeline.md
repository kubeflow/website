+++
title = "Experiment with the Pipelines Samples"
description = "Get started with the Kubeflow Pipelines notebooks and samples"
weight = 1
+++

You can learn how to build and deploy pipelines by running the samples
provided in the Kubeflow Pipelines repository or by walking through a
Jupyter notebook that describes the process.

## Compiling the samples on the command line

This section shows you how to compile the 
[Kubeflow Pipelines samples](https://github.com/kubeflow/pipelines/tree/master/samples)
and deploy them using the Kubeflow Pipelines UI.

### Before you start

Set up your environment:

1. Clone or download the
  [Kubeflow Pipelines samples](https://github.com/kubeflow/pipelines/tree/master/samples).
1. Install the [Kubeflow Pipelines SDK](/docs/pipelines/sdk/install-sdk/).
1. Activate your Python 3 environment if you haven't done so already:

    ```
    source activate <YOUR-PYTHON-ENVIRONMENT-NAME>
    ```

    For example:

    ```
    source activate mlpipeline
    ```

### Choose and compile a pipeline

Examine the pipeline samples that you downloaded and choose one to work with.
The 
[`sequential.py` sample pipeline](https://github.com/kubeflow/pipelines/blob/master/samples/basic/sequential.py):
is a good one to start with.

Each pipeline is defined as a Python program. Before you can submit a pipeline
to the Kubeflow Pipelines service, you must compile the 
pipeline to an intermediate representation. The intermediate representation
takes the form of a YAML file compressed into a 
`.tar.gz` file.

Use the `dsl-compile` command to compile the pipeline that you chose:

```bash
dsl-compile --py [path/to/python/file] --output [path/to/output/tar.gz]
```

For example, to compile the
[`sequential.py` sample pipeline](https://github.com/kubeflow/pipelines/blob/master/samples/basic/sequential.py):

```bash
export DIR=[YOUR PIPELINES REPO DIRECTORY]/samples/basic
dsl-compile --py ${DIR}/sequential.py --output ${DIR}/sequential.tar.gz
```

### Deploy the pipeline

Upload the generated `.tar.gz` file through the Kubeflow Pipelines UI. See the
guide to [getting started with the UI](/docs/pipelines/pipelines-quickstart).

## Building a pipeline in a Jupyter notebook

You can choose to build your pipeline in a Jupyter notebook. The
[sample notebooks](https://github.com/kubeflow/pipelines/tree/master/samples/notebooks)
walk you through the process.

It's easiest to use the Jupyter services that are installed in the same cluster as 
the Kubeflow Pipelines system. 

Note: The notebook samples don't work on Jupyter notebooks outside the same 
cluster, because the Python library communicates with the Kubeflow Pipelines 
system through in-cluster service names.

Follow these steps to start a notebook:

1. Deploy Kubeflow:

    * Follow the [GCP deployment guide](/docs/gke/deploy/), including the step 
      to deploy Kubeflow using the 
      [Kubeflow deployment UI](https://deploy.kubeflow.cloud/).

    * When Kubeflow is running, access the Kubeflow UI at a URL of the form
      `https://<deployment-name>.endpoints.<project>.cloud.goog/`.

1. Follow the [Kubeflow notebooks setup guide](/docs/notebooks/setup/) to
  create a Jupyter notebook server and open the Jupyter UI.

1. Download the sample notebooks from 
  https://github.com/kubeflow/pipelines/tree/master/samples/notebooks. 
  
1. Upload these notebooks from the Jupyter UI: In Jupyter, go to the tree view 
  and find the **upload** button in the top right-hand area of the screen.

1. Open one of the uploaded notebooks.

1. Make sure the notebook kernel is set to Python 3. The Python version is at 
  the top right-hand corner in the Jupyter notebook view. 
  
1. Follow the instructions in the notebook.

The following notebooks are available:

* [KubeFlow pipeline using TFX OSS components](https://github.com/kubeflow/pipelines/blob/master/samples/notebooks/KubeFlow%20Pipeline%20Using%20TFX%20OSS%20Components.ipynb): 
  This notebook demonstrates how to build a machine learning pipeline based on
  [TensorFlow Extended (TFX)](https://www.tensorflow.org/tfx/) components. 
  The pipeline includes a TFDV step to infer the schema, a TFT preprocessor, a 
  TensorFlow trainer, a TFMA analyzer, and a model deployer which deploys the 
  trained model to `tf-serving` in the same cluster. The notebook also 
  demonstrates how to build a component based on Python 3 inside the notebook, 
  including how to build a Docker container.

* [Lightweight Python components](https://github.com/kubeflow/pipelines/blob/master/samples/notebooks/Lightweight%20Python%20components%20-%20basics.ipynb): 
  This notebook demonstrates how to build simple Python components based on 
  Python 3 and use them in a pipeline with fast iterations. If you use this
  technique, you don't need to build a Docker container when you build a
  component. Note that the container image may not be self contained because the 
  source code is not built into the container.

## Next steps

* See how to 
  [build your own pipeline components](/docs/pipelines/sdk/build-component/).
* Read more about 
  [building lightweight components](/docs/pipelines/sdk/lightweight-python-components/).
