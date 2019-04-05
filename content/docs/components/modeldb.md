+++
title = "ModelDB"
description ="ModelDB - A system to manage machine learning models"
weight = 10
toc = true
[menu]
[menu.docs]
  parent = "components"
  weight = 5
+++

## Introduction

ModelDB is an end-to-end system to manage machine learning models. It ingests models and associated metadata as models are being trained, stores model data in a structured format, and surfaces it through a web-frontend
for rich querying. ModelDB can be used with any ML environment via the ModelDB Light API. ModelDB native clients can be used for advanced support in spark.ml and scikit-learn.

For more info see [here](https://github.com/mitdbg/modeldb#overview).

## Deploying ModelDB

Use the below commands to deploy ModelDB.

```
ks generate modeldb modeldb
ks apply default -c modeldb
```

## Concepts
 
ModelDB organizes model data in a 3-level model hierarchy, from bottom to top - 

1. ExperimentRun: every execution of a script/program creates an ExperimentRun.
1. Experiment: related ExperimentRuns can be grouped into an Experiment (e.g., "running hyperparameter optimization for the Neural Network"). 
1. Project: Finally, all Experiments and ExperimentRuns belong to a Project (e.g., "churn prediction").

Classes -

1. Datasets takes  filepaths and optional metadata. Associate a tag (key) for each Dataset (value).
1. Model takes model type, model and path to model as arguments.
1. ModelConfig takes model type and model config.
1. ModelMetrics takes what metric to use as argument.

## Using ModelDB

After ModelDB is deployed and modeldb-db, modeldb-backend and modeldb-frontend pods are running - 

1. Install ModelDB
    
    Modeldb is now a part of the verta library. verta is compatible with python 3.5+ and the latest verta releases are available as source packages over pip. When using pip it is generally recommended to install packages in a virtual environment to avoid modifying system state.
  
  - Check your python version : 
  
    ```python --version```
    
  -  Creating and activating new environment : 

     ```python -m venv .env```
  
     ``` source .env/bin/activate```

  - Install Verta :
  
    ```pip install verta==versionNumber```
  
2. Setup

    Get the host and port details of the modelDB backend proxy.
    ```
    kubectl get service modeldb-backend-proxy --namespace kubeflow
    ```
    Configure HOST and PORT to connect to the modelDB backend. 
    ```
    from verta import ModelDBClient
    HOST = ""
    PORT = ""

    client = ModelDBClient(HOST, PORT)
    ```
3. Creating a project
    
    Begin by creating a project and adding all the models as runs within the project. Each run can represent a strategy to solve the problem. 

     ```
     project = client.set_project(proj_name="My Project")  # a project is a goal
     experiment = client.set_experiment(expt_name="My Experiment")  # strategy for project
     run = client.set_experiment_run(run_name="First run")
     ```
   
4. Logging hyperparameters, metrics and datasets

   Use ```run.log_xxx()``` in your code to record metrics, hyperparameters, datasets etc.
    
   ```
   #Hyperparameters
    param_grid = {'n_estimators': [100],
              'learning_rate':[ 0.1, 0.02],
              'max_depth' : [6, 4],
              'max_leaf_nodes': [3, 15],
              'max_features': [1.0, 0.1]
             }
    for h, v in param_grid.items():
      run.log_hyperparameter(h, v)
      
    #Metrics
    model = GradientBoostingRegressor(**hyperparameters)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    run.log_metric("Accuracy_train", train_score)
    run.log_metric("Accuracy_test", test_score)
    
    #Datasets
    #save models with either joblib or pickle
    from sklearn.externals import joblib
    filename_2 = "simple_model_gbr_2.joblib"
    joblib.dump(model, filename_2)
    run.log_model("model_gbr_2", filename_2)
   ```
   
5. View your models in the webapp

    Get the IP address of the modelDB webapp service and open it in the browser
    ```
    kubectl get service modeldb-webapp --namespace kubeflow
    ```

## Samples
These notebooks show how each dataset, model, model configuration, and model metrics can be initialized and logged into modelDB - 
* TensorFlow [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VertaAI/modeldb-client/blob/development/workflows/demos/tensorflow.ipynb)
* Pytorch [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VertaAI/modeldb-client/blob/development/workflows/demos/pytorch.ipynb)
* sklearn [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VertaAI/modeldb-client/blob/development/workflows/demos/sklearn.ipynb)
