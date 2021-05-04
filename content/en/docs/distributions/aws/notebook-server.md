+++
title = "Optimized Jupyter Notebooks on AWS"
description = "AWS-optimized Notebooks based on AWS Deep Learning Containers"
weight = 40
+++

## AWS Optimized Notebook Images

Installing Kubeflow on AWS using this guide will include AWS-optimized Kubeflow Notebook Images as the default options in the notebook server.

These images are based upon [AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/what-is-dlc.html). AWS Deep Learning Containers provide optimized environments with TensorFlow and MXNet, Nvidia CUDA (for GPU instances), and Intel MKL (for CPU instances) libraries.

Additional pre-installed packages:
- `docker-client`
- `kubeflow-metadata`
- `kfp`
- `kfserving`

These images are available from the Amazon Elastic Container Registry (Amazon ECR).

```
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-1.15.2-notebook-cpu:1.2.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-1.15.2-notebook-gpu:1.2.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-2.1.0-notebook-cpu:1.2.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-2.1.0-notebook-gpu:1.2.0
```