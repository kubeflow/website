+++
title = "Train and Deploy on GCP from a Kubeflow Notebook"
description = "Use Kubeflow Fairing to train and deploy a model on Google Cloud Platform (GCP) from a notebook that is hosted on Kubeflow"
weight = 35
+++

This guide introduces you to using [Kubeflow Fairing][fairing-repo] to train and
deploy a model to Kubeflow on Google Kubernetes Engine (GKE) and Google Cloud
ML Engine. As an example, this guide uses a notebook that is hosted on Kubeflow
to demonstrate how to:

*  Train an XGBoost model in a notebook,
*  Use Kubeflow Fairing to train an XGBoost model remotely on Kubeflow,
*  Use Kubeflow Fairing to train an XGBoost model remotely on Cloud ML Engine, 
*  Use Kubeflow Fairing to deploy a trained model to Kubeflow, and
*  Call the deployed endpoint for predictions.

Follow these instructions to set up your environment and run the XGBoost
quickstart notebook:

1.  If you do not have a Kubeflow environment, follow the guide to [deploying
    Kubeflow on GKE][kubeflow-install-gke] to set up your Kubeflow environment.
    The guide provides two options for setting up your environment:

    *  The [Kubeflow deployment user interface][kubeflow-deploy] is an easy
       way for you to set up a GKE cluster with Kubeflow
       installed, or
    *  You can deploy Kubeflow using the [command line][kubeflow-install].

1.  Use the Kubeflow user interface to open your hosted notebook environment
    in Kubeflow. 

1.  Download the files used in this example and install the packages that the
    XGBoost quickstart notebook depends on.

    1.  In your hosted notebook environment, click **New** and select **Terminal**
        to start a new terminal session in your notebook environment. Use the
        terminal session to set up your notebook environment to run this example.

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
    at `[path-to-cloned-fairing-repo]fairing/examples/prediction/xgboost-high-level-apis.ipynb`.

1.  Follow the instructions in the notebook to:

    1.  Train an XGBoost model in a notebook,
    1.  Use Kubeflow Fairing to train an XGBoost model remotely on Kubeflow,
    1.  Use Kubeflow Fairing to train an XGBoost model remotely on Cloud ML Engine, 
    1.  Use Kubeflow Fairing to deploy a trained model to Kubeflow, and
    1.  Call the deployed endpoint for predictions.

[fairing-repo]: https://github.com/kubeflow/fairing
[kubeflow-install-gke]: /docs/gke/deploy/
[kubeflow-install]: /docs/gke/deploy/deploy-cli/
[kubeflow-deploy]: https://deploy.kubeflow.cloud
