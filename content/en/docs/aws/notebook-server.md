+++
title = "Kubeflow Notebook Server on AWS"
description = "Customize Kubeflow Notebook Server to use AWS Services"
weight = 90
+++

## Kubeflow Notebook Image

Currently, we add ECR images on Kubeflow Notebook Image Options by-default, such as `527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-1.15.2-notebook-cpu:1.0.0`.

The ECR image provides:
 
1. DLC as base image

    The reason we take [DLC](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/what-is-dlc.html) as base image, is that DLC provides optimized environments with TensorFlow and MXNet, Nvidia CUDA (for GPU instances), and Intel MKL (for CPU instances) libraries. 


2. Extra pre-installed packages as below:
    ```
    docker client
    kubeflow-metadata
    kfp
    kfserving
    ``` 
