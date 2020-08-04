+++
title = "Optimized Jupyter Notebooks on AWS"
description = "Customize Kubeflow Jupyter Notebooks"
weight = 90
+++

## Kubeflow Notebook Images

Currently, we add AWS optimized Kubeflow Notebook Images and make them default options in notebook server.

```
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-1.15.2-notebook-cpu:1.1.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-1.15.2-notebook-gpu:1.1.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-2.1.0-notebook-cpu:1.1.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-2.1.0-notebook-gpu:1.1.0
```

The ECR image provides:
 
**AWS Deep Learning Containers as base image**

The reason we take [AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/what-is-dlc.html) as base image, is that AWS Deep Learning Containers provides optimized environments with TensorFlow and MXNet, Nvidia CUDA (for GPU instances), and Intel MKL (for CPU instances) libraries on AWS.

**Extra pre-installed packages**
- docker-client
- kubeflow-metadata
- kfp
- kfserving
