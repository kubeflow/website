+++
title = "Train and Deploy on GCP from an AI Platform Notebook"
description = "Use Kubeflow Fairing to train and deploy a model on Google Cloud Platform (GCP) from a notebook that is hosted on Google Cloud AI Platform"
weight = 35
+++

This guide introduces you to using [Kubeflow Fairing][fairing-repo] to train and
deploy a model to Kubeflow on [Google Kubernetes Engine (GKE)][gke] and [Google AI 
Platform][ai-platform]. As an example, this guide uses a notebook that is hosted
on [AI Platform Notebooks][ai-notebooks] to demonstrate how to:

*  Train an XGBoost model in a notebook,
*  Use Kubeflow Fairing to train an XGBoost model remotely on Kubeflow,
*  Use Kubeflow Fairing to train an XGBoost model remotely on AI Platform, 
*  Use Kubeflow Fairing to deploy a trained model to Kubeflow, and
*  Call the deployed endpoint for predictions.

## Set up Kubeflow

If you do not have a Kubeflow environment, follow the guide to [deploying
Kubeflow on GKE][kubeflow-install-gke] to set up your Kubeflow environment on
GKE. The guide provides two options for setting up your environment:

*  The [Kubeflow deployment user interface][kubeflow-deploy] is an easy
   way for you to set up a GKE cluster with Kubeflow
   installed, or
*  You can deploy Kubeflow using the [command line][kubeflow-install].

## Set up your AI Platform Notebooks instance

Kubeflow Fairing requires Python 3.6 or later. Currently, only AI Platform
Notebooks instances created with the PyTorch framework image have Python 3.6
or later installed. If you do not have an AI Platform Notebooks instance that
uses the PyTorch framework, follow the guide to [creating a new notebook
instance][ai-notebook-create] to set up your environment and select the
PyTorch **Framework**. 

![](/docs/images/fairing/ai-platform-notebook-pytorch.png)

## Run the example notebook

Follow these instructions to set up your environment and run the XGBoost
quickstart notebook:

1.  Use the AI Platform Notebooks user interface to [open your hosted notebook
    environment][ai-notebook-open].

1.  Download the files used in this example and install the packages that the
    XGBoost quickstart notebook depends on.

    1.  In the JupyterLab user interface, click **File** > **New** > **Terminal**
        in the menu to start a new terminal session in your notebook environment.
        Use the terminal session to set up your notebook environment to run this
        example.

    1.  Clone the Kubeflow Fairing repository to download the files used in
        this example.

        ```bash
        git clone https://github.com/kubeflow/fairing 
        cd fairing
        ```

    1.  Upgrade Kubeflow Fairing from the cloned repository.

        ```bash
        pip install .
        ```

    1.  Install the Python dependencies for the XGBoost quickstart notebook.

        ```bash
        pip install -r examples/prediction/requirements.txt
        ```

    1.  Authorize Docker to access your [GCP Container Registry][container-registry]. 

        ```bash
        gcloud auth configure-docker
        ```

    1.  Update your `kubeconfig` with appropriate credentials and endpoint
        information for your Kubeflow cluster. To find your
        cluster's name, run the following command to list the clusters in your
        project:

        ```bash
        gcloud container clusters list
        ```

        Update the following command with your cluster's name and GCP zone, then
        run the command to update your `kubeconfig` to provide it with credentials
        to access this Kubeflow cluster.
    
        ```bash
        export CLUSTER_NAME=kubeflow
        export ZONE=us-central1-a
        gcloud container clusters get-credentials $CLUSTER_NAME --region $ZONE
        ```


1.  Use the notebook user interface to open the XGBoost quickstart notebook
    at `[path-to-cloned-fairing-repo]fairing/examples/prediction/xgboost-high-level-apis.ipynb`.

1.  Follow the instructions in the notebook to:

    1.  Train an XGBoost model in a notebook,
    1.  Use Kubeflow Fairing to train an XGBoost model remotely on Kubeflow,
    1.  Use Kubeflow Fairing to train an XGBoost model remotely on AI Platform, 
    1.  Use Kubeflow Fairing to deploy a trained model to Kubeflow, and
    1.  Call the deployed endpoint for predictions.

[fairing-repo]: https://github.com/kubeflow/fairing
[kubeflow-install-gke]: /docs/gke/deploy/
[kubeflow-install]: /docs/gke/deploy/deploy-cli/
[kubeflow-deploy]: https://deploy.kubeflow.cloud
[ai-platform]: https://cloud.google.com/ml-engine/docs/
[ai-notebook-create]: https://cloud.google.com/ml-engine/docs/notebooks/create-new
[ai-notebook-open]: https://cloud.google.com/ml-engine/docs/notebooks/create-new#open_a_notebook
[container-registry]: https://cloud.google.com/container-registry/
[gke]: https://cloud.google.com/kubernetes-engine/