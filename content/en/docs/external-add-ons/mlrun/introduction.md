+++
title = "Introduction"
description = "A brief introduction to MLRun"
weight = 70
+++

## What is MLRun?

MLRun is an MLOps toolkit for quickly building and managing continuous ML applications across their lifecycle. 

MLRun includes the following major components:

- [**Project Management:**](https://docs.mlrun.org/en/latest/projects/project.html) A service (API, SDK, DB, UI) that manages the different project assets (data, functions, jobs, workflows, secrets, etc.) and provides central control and metadata layer

- [**Serverless Functions:**](https://docs.mlrun.org/en/latest/runtimes/functions.html) automatically deployed software package with one or more methods and runtime-specific attributes (such as image, libraries, command, arguments, resources, etc.)

- [**Data & Artifacts:**](https://docs.mlrun.org/en/latest/concepts/data-feature-store.html) connectivity to various data sources, metadata management, catalog, and versioning for structures/unstructured artifacts

- [**Feature Store:**](https://docs.mlrun.org/en/latest/feature-store/feature-store.html) automatically collects, prepares, catalogs, and serves production data features for development (offline) and real-time (online) deployment using minimal engineering effort

- [**Batch Runs & Workflows:**](https://docs.mlrun.org/en/latest/concepts/runs-workflows.html) Execute one or more functions with specific parameters and collect, track, and compare all their results and artifacts

- [**Real-Time Serving Pipeline:**](https://docs.mlrun.org/en/latest/serving/serving-graph.html) Rapid deployment of scalable data and ML pipelines using real-time serverless technology, including API handling, data preparation/enrichment, model serving, ensembles, driving and measuring actions, etc.

- [**Real-Time monitoring:**](https://docs.mlrun.org/en/latest/monitoring/index.html) monitors data, models, resources, and production components and provides a feedback loop for exploring production data, identifying drift, alerting on anomalies or data quality issues, triggering retraining jobs, measuring business impact, etc.

### What is MLRun Serving?

The [MLRun Serving](https://docs.mlrun.org/en/latest/serving/serving-graph.html) graphs allow you to build, test, deploy, and monitor real-time data processing and advanced model serving pipelines with minimal effort.

- MLRun Serving is built on top of the real-time serverless framework [Nuclio](https://github.com/nuclio/nuclio), and is API compatible with KFServing v2.

- With MLRun Serving you compose a graph of steps (composed of pre-defined graph blocks or native python classes/functions).
A graph can have data processing steps, model ensembles, model servers, post-processing, etc. ([see example](https://docs.mlrun.org/en/latest/serving/graph-example.html)).

- MLRun Serving supports complex and distributed graphs ([see example](https://docs.mlrun.org/en/latest/serving/distributed-graph.html)) which may involve streaming, data/document/image processing, NLP, model monitoring, etc.

## How to use MLRun with Kubeflow?

MLRun is natively integrated with Kubeflow and Kubeflow Pipelines, MLRun function objects can be deployed, tested and executed through Kubeflow.
MLRun’s serving functions can be deployed automatically using CLI, SDK, or Kubeflow Pipelines (KFP) operations.

Please see the MLRun documentation for information about [installing MLRun](https://docs.mlrun.org/en/latest/install/kubernetes.html) on Kubernetes.

### Deploying a simple model serving function

Loading library serving function, adding models, testing the pipeline, deploy to the cluster, and test the live endpoint:

```python
import mlrun

# load the sklearn model serving function and add models to it
fn = mlrun.import_function("hub://v2_model_server")
fn.add_model("model1", model_path={model1 - url})
fn.add_model("model2", model_path={model2 - url})

# test the serving pipeline using the graph simulator
server = fn.to_mock_server()
result = server.test("/v2/models/model1/infer", {"inputs": x})

# deploy the function to the cluster
fn.deploy()

# test the live model endpoint
fn.invoke("/v2/models/model1/infer", body={"inputs": [5]})

```

### Building your own serving class

MLRun Model Serving classes look and behave like KFServing classes, but are faster, support advanced graphs and capabilities, and eliminate all the deployment overhead.

```python
from cloudpickle import load
import numpy as np
import mlrun

class ClassifierModel(mlrun.serving.V2ModelServer):
    def load(self):
        """load and initialize the model and/or other elements"""
        model_file, extra_data = self.get_model(".pkl")
        self.model = load(open(model_file, "rb"))

    def predict(self, body: dict) -> list:
        """Generate model predictions from sample"""
        feats = np.asarray(body["inputs"])
        result: np.ndarray = self.model.predict(feats)
        return result.tolist()
```

### Deploy and Test Model Serving using Kubeflow Pipelines

The following Kubeflow pipeline uses MLRun Serverless functions from the MLRun marketplace and execute a simple training, serving deployment, and serving testing Kubefow pipeline.

(see the [full example](https://github.com/mlrun/demos/blob/0.6.x/scikit-learn-pipeline/sklearn-project.ipynb)) 

```python
@dsl.pipeline(name="Demo pipeline")
def kfpipeline():
    # train with hyper-paremeters
    train = mlrun.import_function("hub://sklearn_classifier").as_step(
        name="train",
        params={
            "sample": -1,
            "label_column": LABELS,
            "test_size": 0.10,
            "model_pkg_class": "sklearn.ensemble.RandomForestClassifier",
        },
        inputs={"dataset": DATASET},
        outputs=["model", "test_set"],
    )

    # deploy our model as a serverless function, we can pass a list of models to serve
    deploy = mlrun.import_function("hub://v2_model_server").deploy_step(
        models=[{"key": "mymodel:v1", "model_path": train.outputs["model"]}]
    )

    # test out new model server (via REST API calls)
    tester = mlrun.import_function("hub://v2_model_tester").as_step(
        name="model-tester",
        params={"addr": deploy.outputs["endpoint"], "model": "mymodel:v1"},
        inputs={"table": train.outputs["test_set"]},
    )

```