+++
title = "Shared Resources and Components"
description = "Hubs where you can find reusable components, shared Jupyter notebooks, and other ML resources"
weight = 50
+++

This page links to websites where you can find machine learning 
(ML) resources shared by various communities and organizations.

## AI Hub

[AI Hub](https://aihub.cloud.google.com/) is a platform for discovering and 
deploying ML products.

AI Hub includes the following shared resources that you can use within your Kubeflow deployment:

* [Pipelines and compo](https://aihub.cloud.google.com/s?category=pipeline) that you can use with Kubeflow Pipelines.
* [Jupyter notebooks](https://aihub.cloud.google.com/s?category=notebook) that you can upload to the notebooks server in your Kubeflow cluster.

## Reusable components for Kubeflow Pipelines

A Kubeflow Pipelines *component* is a self-contained set of code that performs 
one step in the pipeline, such as data preprocessing, data transformation, model
training, and so on. Each component is packaged as a Docker image.
You can add existing components to your pipeline. These may be components that
you create yourself, or that someone else has created and made available.

The Kubeflow Pipelines repository on GitHub includes a number of 
[reusable components](https://github.com/kubeflow/pipelines/tree/master/components)
that you can add to your pipeline.