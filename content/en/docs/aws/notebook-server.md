+++
title = "Kubeflow Notebook Server on AWS"
description = "Customize Kubeflow Notebook Server to use AWS Services"
weight = 90
+++

## Kubeflow Notebook Image

Currently, we add ECR images on Kubeflow Notebook Image Options by-default. The list of ECR images we provide:

```
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-1.15.2-notebook-cpu:1.0.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-1.15.2-notebook-gpu:1.0.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-2.1.0-notebook-cpu:1.0.0
527798164940.dkr.ecr.us-west-2.amazonaws.com/tensorflow-2.1.0-notebook-gpu:1.0.0
```

The ECR image not only include all the dependencies that [GCR Kubeflow Notebook Images](https://github.com/kubeflow/kubeflow/blob/master/components/tensorflow-notebook-image/Dockerfile) require, but provide extra pre-installed packages as below:

```
docker client
kubeflow-metadata
kfp
kfserving
``` 
