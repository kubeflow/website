+++
title = "Optimized Jupyter Notebooks on AWS"
description = "AWS-optimized Notebooks based on AWS Deep Learning Containers"
weight = 10
+++

## AWS Optimized Notebook Images

Installing Kubeflow on AWS using this guide will include AWS-optimized Kubeflow Notebook Images as the default options in the notebook server.

These images are based on [AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/what-is-dlc.html). AWS Deep Learning Containers provide optimized environments with popular machine learning frameworks such as TensorFlow and PyTorch, and are available in the Amazon Elastic Container Registry (Amazon ECR). For more information on AWS Deep Learning Container options, see [Available Deep Learning Containers Images](https://github.com/aws/deep-learning-containers/blob/master/available_images.md).

Additional pre-installed packages:
- `docker-client`
- `kubeflow-metadata`
- `kfp`
- `kfserving`

These images are available from the Amazon Elastic Container Registry (Amazon ECR).

```
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-tensorflow:2.6.0-gpu-py38-cu112
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-tensorflow:2.6.0-cpu-py38
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-pytorch:1.9.0-gpu-py38-cu111
public.ecr.aws/c9e4w0g3/notebook-servers/jupyter-pytorch:1.9.0-cpu-py38
```