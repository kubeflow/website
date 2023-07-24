+++
title = "Overview"
description = "An overview of Kubeflow Workbenches"
weight = 5
                    
+++
{{% stable-status %}}

## What is Kubeflow Workbenches?

Kubeflow Workbenches provides a way to run web-based development environments inside your Kubernetes cluster by running them inside Pods.

Some key features include:
- Native support for [JupyterLab](https://github.com/jupyterlab/jupyterlab), [RStudio](https://github.com/jupyterlab/jupyterlab), and [Visual Studio Code (code-server)](https://github.com/cdr/code-server).
- Users can create workbench containers directly in the cluster, rather than locally on their workstations.
- Admins can provide standard workbench images for their organization with required packages pre-installed.
- Access control is managed by Kubeflow's RBAC, enabling easier workbench sharing across the organization.

## Next steps

- Get started with Kubeflow Workbenches using the [quickstart guide](/docs/components/notebooks/quickstart-guide/).
- Learn how to create your own [container images](/docs/components/notebooks/container-images/).
