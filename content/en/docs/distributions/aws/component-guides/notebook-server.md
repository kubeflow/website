+++
title = "AWS-Optimized Kubeflow Notebooks"
description = "Work in AWS-optimized Notebooks based on AWS Deep Learning Containers"
weight = 10
+++

Installing Kubeflow on AWS includes AWS-optimized container images as default options for a Kubeflow Notebook server. For more information on gettings started with Kubeflow Notebooks, see the [Quickstart Guide](https://www.kubeflow.org/docs/components/notebooks/quickstart-guide/).

## AWS-optimized container images

The following container images are available from the [Amazon Elastic Container Registry (Amazon ECR)](https://gallery.ecr.aws/c9e4w0g3/).

```
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-tensorflow:2.6.0-gpu-py38-cu112
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-tensorflow:2.6.0-cpu-py38
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-pytorch:1.9.0-gpu-py38-cu111
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-pytorch:1.9.0-cpu-py38
```

These images are based on [AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/what-is-dlc.html). AWS Deep Learning Containers provide optimized environments with popular machine learning frameworks such as TensorFlow and PyTorch, and are available in the Amazon ECR. For more information on AWS Deep Learning Container options, see [Available Deep Learning Containers Images](https://github.com/aws/deep-learning-containers/blob/master/available_images.md).

Along with specific machine learning frameworks, these container images have additional pre-installed packages:
- `kfp`
- `kfp-server-api`
- `kfserving` 
- `h5py`
- `pandas`
- `matplotlib`
- `xgboost`
- `ipympl`
- `awscli`
- `boto3`