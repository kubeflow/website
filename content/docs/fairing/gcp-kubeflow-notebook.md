+++
title = "Train and Deploy on GCP from a Kubeflow Notebook"
description = "Use Kubeflow Fairing to train and deploy a model on Google Cloud Platform (GCP) from a notebook that is hosted on Kubeflow."
weight = 35
+++

This guide introduces you to using Kubeflow Fairing to train and deploy a
model to Kubeflow on Google Kubernetes Engine (GKE), and Google Cloud ML Engine.
As an example, this guide uses a notebook that is hosted on Kubeflow to
demonstrate how to:

*  Train an XGBoost model in a notebook,
*  Use Kubeflow Fairing to train an XGBoost model remotely on Kubeflow,
*  Use Kubeflow Fairing to train an XGBoost model remotely on Cloud ML Engine, 
*  Use Kubeflow Fairing to deploy a trained model to Kubeflow, and
*  Call the deployed endpoint for predictions.

## Use Kubeflow Fairing to train a model in a notebook, on Kubeflow, and on GCP

1.  Use the Kubeflow user interface to open your hosted notebook environment
    in Kubeflow.

1.  In your hosted noteboo environment, click **New** and select **Terminal**
    to start a new terminal session in your notebook environment. Use the
    terminal session to configure your notebook environment to run the XGBoost
    quickstart notebook:

    1.  Clone the Kubeflow Fairing repository to download the files used in
        this example.

        ```bash
        git clone https://github.com/kubeflow/fairing 
        ```

    1.  Install the Python dependencies for the XGBoost quickstart notebook.

        ```bash
        pip3 install -r fairing/examples/prediction/requirements.txt
        ```

1.  Use the notebook user interface to open the XGBoost quickstart notebook
    at fairing/examples/prediction/xgboost-high-level-apis.ipynb.

1.  Follow the instructions in the notebook to train a model in the
    notebook, on Kubeflow, and on Cloud ML Engine. Then deploy the
    trained model to Kubeflow for predictions and send requests to
    the prediction endpoint.
