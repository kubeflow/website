+++
title = "Train and Deploy on GCP from a Kubeflow Notebook"
description = "Use Kubeflow Fairing to train and deploy a model on Google Cloud Platform (GCP) from a notebook that is hosted on Kubeflow"
weight = 35
+++

This guide introduces you to using [Kubeflow Fairing][fairing-repo] to train and
deploy a model to Kubeflow on Google Kubernetes Engine (GKE) and 
Google AI Platform Training.

Your Kubeflow deployment includes services for spawning and managing Jupyter
notebooks. Kubeflow Fairing is preinstalled in the Kubeflow notebooks, along
with a number of machine learning (ML) libraries.

## Set up Kubeflow and access the Kubeflow notebook environment

Follow the [Kubeflow notebook setup guide](/docs/notebooks/setup/)
to install Kubeflow, access your Kubeflow hosted notebook environment, and 
create a new notebook server.

When selecting a Docker image and other settings for the baseline deployment
of your notebook server, you can leave all the settings at the default value.

## Run the example notebook

As an example, this guide uses a notebook that is hosted on Kubeflow
to demonstrate how to:

*  Train an XGBoost model in a notebook,
*  Use Kubeflow Fairing to train an XGBoost model remotely on Kubeflow,
*  Use Kubeflow Fairing to train an XGBoost model remotely on 
   AI Platform Training, 
*  Use Kubeflow Fairing to deploy a trained model to Kubeflow, and
*  Call the deployed endpoint for predictions.

Follow these instructions to run the XGBoost quickstart notebook:

1.  Download the files used in this example and install the packages that the
    XGBoost quickstart notebook depends on.

    1.  On the **Jupyter dashboard** for your notebook server, click **New** and
        select **Terminal** to start a new terminal session in your notebook
        environment. Use the terminal session to set up your notebook
        environment to run this example.

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
    at `fairing/examples/prediction/xgboost-high-level-apis.ipynb`.

1.  Follow the instructions in the notebook to:

    1.  Train an XGBoost model in a notebook,
    1.  Use Kubeflow Fairing to train an XGBoost model remotely on Kubeflow,
    1.  Use Kubeflow Fairing to train an XGBoost model remotely on AI Platform Training, 
    1.  Use Kubeflow Fairing to deploy a trained model to Kubeflow, and
    1.  Call the deployed endpoint for predictions.

[fairing-repo]: https://github.com/kubeflow/fairing
[kubeflow-install-gke]: /docs/gke/deploy/
[kubeflow-install]: /docs/gke/deploy/deploy-cli/
[kubeflow-deploy]: https://deploy.kubeflow.cloud
