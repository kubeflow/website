+++
title = "Set Up and Deploy the Pipelines Service"
description = "Deploy the Kubeflow Pipelines service"
weight = 3
toc = true

[menu.docs]
  parent = "pipelines"
  weight = 3
+++

Starting from [V0.1.3](https://github.com/kubeflow/pipelines/releases/tag/0.1.3), Kubeflow Pipelines becomes one of the Kubeflow core components. It's automatically deployed during Kubeflow deployment. 

Note: Due to 
[kubeflow/pipelines#345](https://github.com/kubeflow/pipelines/issues/345) and 
[kubeflow/pipelines#337](https://github.com/kubeflow/pipelines/issues/337), Kubeflow Pipelines depends on GCP services and some of the funcitonalities are not supported by non-GKE cluster.
For best user experience, please deploy Kubeflow through GKE. Please refer to [GKE setup](/docs/started/getting-started-gke/) for instruction.