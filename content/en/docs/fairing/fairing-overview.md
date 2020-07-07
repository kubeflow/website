+++
title = "Overview of Kubeflow Fairing"
description = "Build, train, and deploy your ML training jobs remotely"
weight = 5
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


{{% beta-status 
  feedbacklink="https://github.com/kubeflow/fairing/issues" %}}

Kubeflow Fairing streamlines the process of building, training, and deploying
machine learning (ML) training jobs in a hybrid cloud environment. By using
Kubeflow Fairing and adding a few lines of code, you can run your ML training
job locally or in the cloud, directly from Python code or a Jupyter
notebook. After your training job is complete, you can use Kubeflow Fairing to
deploy your trained model as a prediction endpoint.

## Getting started

Use the following guides to get started with Kubeflow Fairing:

1.  To set up your development environment, follow the guide to [installing
    Kubeflow Fairing][install].
1.  To ensure that Kubeflow Fairing can access your Kubeflow cluster, follow
    the guide to [configuring your development environment with access
    to Kubeflow][conf].
1.  To learn more about how to use Kubeflow Fairing in your environment,
    [follow the Kubeflow Fairing tutorials][tutorials].

## What is Kubeflow Fairing?

Kubeflow Fairing is a Python package that makes it easy to train and deploy ML
models on [Kubeflow][kubeflow]. Kubeflow Fairing can also been extended to
train or deploy on other platforms. Currently, Kubeflow Fairing has been
extended to train on [Google AI Platform][ai-platform]. 

Kubeflow Fairing packages your Jupyter notebook, Python function, or Python
file as a Docker image, then deploys and runs the training job on Kubeflow
or AI Platform. After your training job is complete, you can use Kubeflow
Fairing to deploy your trained model as a prediction endpoint on Kubeflow. 

The following are the goals of the [Kubeflow Fairing project][fairing-repo]:

* **Easily package ML training jobs:** Enable ML practitioners to easily package their ML model training code, and their code's dependencies, as a Docker image. 
* **Easily train ML models in a hybrid cloud environment:** Provide a high-level API for training ML models to make it easy to run training jobs in the cloud, without needing to understand the underlying infrastructure.
* **Streamline the process of deploying a trained model:** Make it easy for ML practitioners to deploy trained ML models to a hybrid cloud environment. 

## Next steps

*  Learn how to [set up a Jupyter notebooks instance on your Kubeflow
   cluster][kubeflow-notebooks].

[kubeflow-notebooks]: /docs/notebooks/setup/
[ai-platform]: https://cloud.google.com/ml-engine/docs/
[fairing-repo]: https://github.com/kubeflow/fairing
[kubeflow]: /docs/about/kubeflow/

[conf]: /docs/fairing/configure-fairing/
[install]: /docs/fairing/install-fairing/
[tutorials]: /docs/fairing/tutorials/other-tutorials/
