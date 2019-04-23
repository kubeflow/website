+++
title = "Overview of Kubeflow Fairing"
description = "Build, train, and deploy your ML training jobs remotely"
weight = 5
+++

Kubeflow Fairing streamlines the process of building, training, and deploying
machine learning (ML) training jobs in a hybrid cloud environment. By using
Kubeflow Fairing and adding a few lines of code, you can run your ML training
job locally or in the cloud, directly from Python code or a Jupyter
notebook. After your training job is complete, you can use Kubeflow Fairing to
deploy your trained model as a prediction endpoint.

## Quickstart

Follow a quickstart guide to learn how to get started running training jobs
remotely with Kubeflow Fairing:

*  Learn how to [train and deploy a model on Google Cloud Platform (GCP) from
   a local notebook][gcp-local].
*  Learn how to [train and deploy a model on GCP from a notebook hosted on
   Kubeflow][gcp-kubeflow].

## What is Kubeflow Fairing?

Kubeflow Fairing is a Python package that makes it easy to train and deploy ML
models on [Kubeflow][kubeflow], [Kubernetes][kubernetes], or [Google AI
Platform][ai-platform]. 

Kubeflow Fairing packages your Jupyter notebook or Python function as a Docker
image, then deploys and runs the training job on Kubeflow, Kubernetes, or AI
Platform. After your training job is complete, you can use Kubeflow Fairing to
deploy your trained model as a prediction endpoint on Kubeflow or Kubernetes. 

The following are the goals of the [Kubeflow Fairing project][fairing-repo]:

*  Easily run ML training jobs remotely: Streamline the process of running ML
   training jobs in a hybrid cloud environment. 
*  Write ML training jobs once, then train locally or in the cloud: Provide ML
   practitioners with a way to write ML training jobs once, then run them
   locally or in a hybrid cloud environment.

## Next steps

*  Learn how to [set up a Jupyter notebooks instance on your Kubeflow
   cluster][kubeflow-notebooks].

[gcp-local]: /docs/fairing/gcp-local-notebook/
[gcp-kubeflow]: /docs/fairing/gcp-kubeflow-notebook/
[kubeflow-notebooks]: /docs/notebooks/setup/
[ai-platform]: https://cloud.google.com/ml-engine/docs/
[kubernetes]: https://kubernetes.io/
[fairing-repo]: https://github.com/kubeflow/fairing
[kubeflow]: /docs/about/kubeflow/