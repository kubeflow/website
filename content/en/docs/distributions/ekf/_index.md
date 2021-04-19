+++
title = "Arrikto Enterprise Kubeflow"
description = "The Arrikto Enterprise Kubeflow distribution"
weight = 50
+++

The [Arrikto Enterprise Kubeflow (EKF)](https://www.arrikto.com/enterprise-kubeflow/) distribution introduces a number of features that enhance the automation, portability, reproducibility, and security aspects of Kubeflow.
- Generate Kubeflow pipelines from ML code. Start by tagging cells in Jupyter Notebooks to define pipeline steps, hyperparameter tuning, GPU usage, and metrics tracking. Click a button to create pipeline components and KFP DSL, resolve dependencies, inject data objects into each step, and deploy the data science pipeline. Or use the Kale SDK with your preferred IDE.
- Automatically snapshot pipeline code and data for every step with Arrikto’s Rok data management platform. Roll back to any machine learning pipeline step at it’s exact execution state for easy debugging. Collaborate with other data scientists through a GitOps-style publish/subscribe versioning workflow.
- Manage teams and user access via GitLab or any ID provider via Istio/OIDC. Isolate user ML data access within their own namespace while enabling notebook and pipeline collaboration in shared namespaces.