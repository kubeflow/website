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
 
* ModelDB organizes model data in a 3-level model hierarchy, from bottom to top - 

1. ExperimentRun: every execution of a script/program creates an ExperimentRun.
1. Experiment: related ExperimentRuns can be grouped into an Experiment (e.g., "running hyperparameter optimization for the Neural Network"). 
1. Project: Finally, all Experiments and ExperimentRuns belong to a Project (e.g., "churn prediction").

* Classes -

1. Datasets takes  filepaths and optional metadata. Associate a tag (key) for each Dataset (value).
1. Model takes model type, model and path to model as arguments.
1. ModelConfig takes model type and model config.
1. ModelMetrics takes what metric to use as argument.

## Using ModelDB

After ModelDB is deployed and modeldb-db, modeldb-backend and modeldb-frontend pods are running - 

1. Install ModelDB

``` 
pip install modeldb
```

1. Loading Metrics from Python

   You can use Jupyter notebooks or a Python file for your model script.

   ModelDBSyncer is the object that logs models and operations to the ModelDB backend.
   You can initialize the Syncer with your specified configurations as shown below.

   Create a syncer using a convenience API

   ```
   syncer_obj = Syncer.create_syncer("Project Name", 
   "test_user", 
   "project description", 
   host="modeldb-backend")
   ```

   For other ways of initializing the syncer see [here](https://github.com/mitdbg/modeldb/blob/master/client/python/light_api.md#b-create-a-modeldb-syncer).

1. Sync Information

   Initialize the Dataset, Model, ModelConfig, ModelMetrics classes with the needed information as arguments then call the sync methods on the Syncer object. Finally, call syncer_obj.sync().

   ```
   # create Datasets by specifying their filepaths and optional metadata
   # associate a tag (key) for each Dataset (value)
   datasets = {
    "train" : Dataset("/path/to/train", {"num_cols" : 15, "dist" : "random"}),
    "test" : Dataset("/path/to/test", {"num_cols" : 15, "dist" : "gaussian"})
   }

   # create the Model, ModelConfig, and ModelMetrics instances
   model = "model_obj"
   model_type = "NN"
   mdb_model1 = Model(model_type, model, "/path/to/model1")
   model_config1 = ModelConfig(model_type, {"l1" : 10})
   model_metrics1 = ModelMetrics({"accuracy" : 0.8})

   # sync the datasets to modeldb
   syncer_obj.sync_datasets(datasets)

   # sync the model with its model config and specify which dataset tag to use for it
   syncer_obj.sync_model("train", model_config1, mdb_model1)

   # sync the metrics to the model and also specify which dataset tag to use for it
   syncer_obj.sync_metrics("test", mdb_model1, model_metrics1)

   syncer_obj.sync()
   ```
   The code for the API can be found in [ModelDbSyncerBase.py](https://github.com/mitdbg/modeldb/blob/master/client/python/modeldb/basic/ModelDbSyncerBase.py), where the Syncer, Dataset, Model, ModelConfig, ModelMetrics classes and
   their methods are declared.

   For other methods of logging please refer to the ModelDB docs [here](https://github.com/mitdbg/modeldb/blob/master/client/python/light_api.md#c-sync-information).

1. Port-forward the modeldb-frontend pod to port 3000.

   ```
   kubectl port-forward service/modeldb-frontend 3000 -n kubeflow
   ```
1. Run your model in the browser at https://localhost:3000/.

## Samples


 [BasicWorkflow.py](https://github.com/mitdbg/modeldb/blob/master/client/python/samples/basic/BasicWorkflow.py) and [BasicSyncAll.py](https://github.com/mitdbg/modeldb/blob/master/client/python/samples/basic/BasicSyncAll.py)
 show how ModelDB's Light API can be used. The former shows how each dataset, model, model configuration, and model metrics can be initialized and synced to ModelDB, while the latter shows a simple
 sync_all method where all the data can be imported from a JSON or a YAML file.
