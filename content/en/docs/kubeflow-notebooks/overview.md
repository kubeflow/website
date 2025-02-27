+++
title = "Overview"
description = "An overview of Kubeflow Notebooks"
weight = 5
                    
+++
{{% stable-status %}}

## What is Kubeflow Notebooks?

Kubeflow Notebooks provides a way to run web-based development environments inside your Kubernetes cluster by running them inside Pods.

Some key features include:
- Native support for [JupyterLab](https://github.com/jupyterlab/jupyterlab), [RStudio](https://github.com/rstudio/rstudio), and [Visual Studio Code (code-server)](https://github.com/cdr/code-server).
- Users can create notebook containers directly in the cluster, rather than locally on their workstations.
- Admins can provide standard notebook images for their organization with required packages pre-installed.
- Access control is managed by Kubeflow's RBAC, enabling easier notebook sharing across the organization.

## Next steps

- Get started with Kubeflow Notebooks using the [quickstart guide](/docs/components/notebooks/quickstart-guide/).
- Learn how to create your own [container images](/docs/components/notebooks/container-images/).
