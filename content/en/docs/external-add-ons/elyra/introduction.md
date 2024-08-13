+++
title = "Introduction"
description = "A brief introduction to Elyra"
weight = 10
+++

## What is Elyra?

[Elyra](https://elyra.readthedocs.io/en/stable/index.html) is an [open-source](https://github.com/elyra-ai/elyra) tool to reduce model development life cycle complexities. 
Elyra is a _JupyterLab extension_ that provides a _visual pipeline editor_ to enable low-code creation of pipelines that can be executed with Kubeflow Pipelines.

Below is an example of a Pipeline created with Elyra, you can identify the components/tasks and related properties that are all managed in the visual editor.

<img src="/docs/external-add-ons/elyra/elyra-pipeline-covid-scenario.png" alt="A pipeline example created using Elyra Pipeline Visual Editor" class="mt-3 mb-3 p-3 border border-info rounded"></img>

## How to use Elyra with Kubeflow?

Elyra can be used with Kubeflow to create and run Pipelines in a Kubeflow environment.

You may create a [custom Kubeflow Notebook image](/docs/components/notebooks/container-images/#custom-images) based on any of our pre-built Jupyter Notebook images and install Elyra in it.
The Elyra project has an [example in their documentation](https://elyra.readthedocs.io/en/stable/recipes/using-elyra-with-kubeflow-notebook-server.html) and a [`Dockerfile`](https://github.com/elyra-ai/elyra/blob/main/etc/docker/kubeflow/Dockerfile) that you can use as a reference.

{{% alert title="Elyra and JupyterLab 4.0" color="warning" %}}
Elyra [`3.15.0`](https://github.com/elyra-ai/elyra/releases/tag/v3.15.0) may not properly support JupyterLab 4.0, which has been included in the default Kubeflow Notebook images since Kubeflow 1.9.0.
{{% /alert %}}

## Next steps

- Visit the <a href="https://github.com/elyra-ai/elyra" target="_blank">Elyra GitHub Repository</a>
- <a href="https://elyra.readthedocs.io/en/stable/recipes/using-elyra-with-kubeflow-notebook-server.html" target="_blank">Use Elyra in Kubeflow Notebooks</a>
