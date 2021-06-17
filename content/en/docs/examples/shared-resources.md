+++
title = "Shared Resources and Components"
description = "Hubs where you can find reusable components, shared Jupyter notebooks, and other ML resources"
weight = 50
                    
+++

This page links to websites where you can find machine learning 
(ML) resources shared by various communities and organizations.

{{% alert title="Check the provider of any resource that you use" color="warning" %}}
Pipelines, components, and other resources contain executable code.
Before downloading and using a resource, make sure that you trust the provider
of the resource.
{{% /alert %}}

## Reusable components for Kubeflow Pipelines

A Kubeflow Pipelines *component* is a self-contained set of code that performs 
one step in the pipeline, such as data preprocessing, data transformation, model
training, and so on. Each component is packaged as a Docker image.
You can add existing components to your pipeline. These may be components that
you create yourself, or that someone else has created and made available.

The Kubeflow Pipelines repository on GitHub includes a number of 
[reusable components](https://github.com/kubeflow/pipelines/tree/master/components)
that you can add to your pipeline.
