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

## Using ModelDB

After ModelDB is deployed using kfctl.sh and the modeldb-db, modeldb-frontend and modeldb-backend pods are running - 

1)  Port forward the modeldb-backend pod to port 6543 - 

```
kubectl get pods -n kubeflow # Find your modeldb-backend pod
kubectl port-forward [modeldb-backend pod] 6543:6543 -n kubeflow
``` 
2)  Create a ModelDB syncer

ModelDBSyncer is the object that logs models and operations to the ModelDB backend. You can initialize the Syncer with your specified configurations as shown below. Explore the ModelDBSyncer here for more details on the Syncer object and the different ways to initialize it.

You can initialize the syncer either from a config file ( [see sample config file](https://github.com/mitdbg/modeldb/blob/master/client/syncer.json) ) or explicitly via arguments.
```
# Initialize syncer from a JSON or YAML config file
syncer_obj = Syncer.create_syncer_from_config(filepath)
# or
# Create a syncer using a convenience API
syncer_obj = Syncer.create_syncer("Sample Project", "test_user", "sample description")
# or
# Create a syncer explicitly
syncer_obj = Syncer(
    NewOrExistingProject("Samples Project", "test_user",
    "using modeldb light logging"),
    DefaultExperiment(),
    NewExperimentRun("", "sha_A1B2C3D4"))
```

3)  Sync Information

* Method 1 :

Load all model information from a JSON or a YAML file. The expected key names can be found [here](https://github.com/mitdbg/modeldb/blob/master/client/python/modeldb/utils/MetadataConstants.py). There are also samples JSON and YAML
 files in samples/basic.

```
syncer_obj.sync_all(filepath)
syncer_obj.sync()
```

* Method 2 :

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
The code for the API can be found in [ModelDbSyncerBase.py](https://github.com/mitdbg/modeldb/blob/master/client/python/modeldb/basic/ModelDbSyncerBase.py), where the Syncer, Dataset, Model, ModelConfig, ModelMetrics classes and their methods are declared.

4)  Port-forward the modeldb-frontend pod to port 3000.

```
kubectl get pods -n kubeflow # Get modeldb-frontend pod
kubectl port-forward [modeldb-frontend pod] 3000 -n kubeflow 
```
5)  Run your model in the browser at https://localhost:3000/.

## Samples


[BasicWorkflow.py](https://github.com/mitdbg/modeldb/blob/master/client/python/samples/basic/BasicWorkflow.py) and [BasicSyncAll.py](https://github.com/mitdbg/modeldb/blob/master/client/python/samples/basic/BasicSyncAll.py)
 show how ModelDB's Light API can be used. The former shows how each dataset, model, model configuration, and model metrics can be initialized and synced to ModelDB, while the latter shows a simple
 sync_all method where all the data can be imported from a JSON or a YAML file.
