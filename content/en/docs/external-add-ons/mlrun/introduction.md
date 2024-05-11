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

### Kubeflow Integration

MLRun is natively integrated with Kubeflow and Kubeflow Pipelines, MLRun function objects can be deployed, tested and executed through Kubeflow (see [example below](#examples)).
MLRun’s serving functions can be deployed automatically using CLI, SDK, or Kubeflow Pipelines (KFP) operations.

## Installation

Please see the MLRun documentation for information about [installing MLRun](https://docs.mlrun.org/en/latest/install/kubernetes.html) on Kubernetes.

## MLRun Serving

The [MLRun Serving](https://docs.mlrun.org/en/latest/serving/serving-graph.html) graphs allow you to build, test, deploy, and monitor real-time data processing and advanced model serving pipelines with minimal effort.

MLRun Serving is built on top of the real-time serverless framework [Nuclio](https://github.com/nuclio/nuclio), and is API compatible with KFServing v2.

With MLRun Serving you compose a graph of steps (composed of pre-defined graph blocks or native python classes/functions).
A graph can have data processing steps, model ensembles, model servers, post-processing, etc. ([see example](https://docs.mlrun.org/en/latest/serving/graph-example.html)).

MLRun Serving supports complex and distributed graphs ([see example](https://docs.mlrun.org/en/latest/serving/distributed-graph.html)) which may involve streaming, data/document/image processing, NLP, model monitoring, etc.

### Accelerate performance and time to production

MLRun's underline serverless engine ([Nuclio](https://nuclio.io/)) uses a high-performance parallel processing engine that maximizes the utilization of CPUs and GPUs.

MLRun Serving provides native model monitoring, including auto drift detection and custom metric, models can be tracked via the Grafana plug-in or in MLRun UI ([see details](https://docs.mlrun.org/en/latest/model_monitoring/index.html)).

The serving pipelines can be tested locally or in a notebook, and deployed into multiple managed serverless functions in a single command (`deploy()`). Such functions are fully managed, with logging, monitoring, auto-scaling, security, etc., which eliminate the deployment overhead, improve performance and scalability, and accelerate time to production.   

MLRun serving is natively integrated with MLRun Online Feature Store, which can be used to generate and/or enrich real-time feature vectors as well as store back production features for later analysis and re-training.

MLRun allows developers to focus on code and deploy faster by supporting:

- 13 protocols and invocation methods (HTTP, Cron, Kafka, Kinesis, etc...)
- Dynamic auto-scaling for http and streaming
- Optimal resource management for CPUs and GPUs
- Full life cycle--including auto-generation of microservices, APIs, load-balancing, logging, monitoring, and configuration management

## Examples

### Deploying a simple model serving function

Loading library serving function, adding models, testing the pipeline, deploy to the cluster, and test the live endpoint:

```python
import mlrun  
# load the sklearn model serving function and add models to it  
fn = mlrun.import_function('hub://v2_model_server')
fn.add_model("model1", model_path={model1-url})
fn.add_model("model2", model_path={model2-url})

# test the serving pipeline using the graph simulator
server = fn.to_mock_server()
result = server.test("/v2/models/model1/infer", {"inputs": x})

# deploy the function to the cluster
fn.deploy()

# test the live model endpoint
fn.invoke('/v2/models/model1/infer', body={"inputs": [5]})
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
        model_file, extra_data = self.get_model('.pkl')
        self.model = load(open(model_file, 'rb'))

    def predict(self, body: dict) -> list:
        """Generate model predictions from sample"""
        feats = np.asarray(body['inputs'])
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
    train = mlrun.import_function('hub://sklearn_classifier').as_step(
        name="train",
        params={"sample"          : -1, 
                "label_column"    : LABELS,
                "test_size"       : 0.10,
                'model_pkg_class': "sklearn.ensemble.RandomForestClassifier"},
        inputs={"dataset"         : DATASET},
        outputs=['model', 'test_set'])

    # deploy our model as a serverless function, we can pass a list of models to serve 
    deploy = mlrun.import_function('hub://v2_model_server').deploy_step(
        models=[{"key": "mymodel:v1", "model_path": train.outputs['model']}])
    
    # test out new model server (via REST API calls)
    tester = mlrun.import_function('hub://v2_model_tester').as_step(
        name='model-tester',
        params={'addr': deploy.outputs['endpoint'], 'model': "mymodel:v1"},
        inputs={'table': train.outputs['test_set']})
```

See the documentation links below for more advanced examples.

## Additional Resources

### Serving Documentation

- [MLRun Serving Graphs](https://docs.mlrun.org/en/latest/serving/serving-graph.html)
	- [Overview](https://docs.mlrun.org/en/latest/serving/serving-graph.html#overview)
	- [Examples](https://docs.mlrun.org/en/latest/serving/serving-graph.html#examples)
	- [The Graph State Machine](https://docs.mlrun.org/en/latest/serving/serving-graph.html#the-graph-state-machine)
- [Model Serving API and Protocol](https://docs.mlrun.org/en/latest/serving/model-api.html)
	- [Creating Custom Model Serving Class](https://docs.mlrun.org/en/latest/serving/model-api.html#creating-custom-model-serving-class)
	- [Model Server API](https://docs.mlrun.org/en/latest/serving/model-api.html#model-server-api)
	- [Model Monitoring](https://docs.mlrun.org/en/latest/serving/model-api.html#model-monitoring)
- [Advance Graph Notebook Example](https://docs.mlrun.org/en/latest/serving/graph-example.html)
	- [Define Functions and Classes (used in our graph)](https://docs.mlrun.org/en/latest/serving/graph-example.html#define-functions-and-classes-used-in-our-graph)
	- [Create a New Serving Function and Graph](https://docs.mlrun.org/en/latest/serving/graph-example.html#create-a-new-serving-function-and-graph) 
	- [Test our functions locally](https://docs.mlrun.org/en/latest/serving/graph-example.html#test-our-function-locally) 
	- [Deploy a Graph as a Real-time Serverless function](https://docs.mlrun.org/en/latest/serving/graph-example.html#deploy-the-graph-as-a-real-time-serverless-function)
- [Distributed (Multi-function) Pipeline Example](https://docs.mlrun.org/en/latest/serving/distributed-graph.html) 
	- [Create the Pipeline](https://docs.mlrun.org/en/latest/serving/distributed-graph.html#create-the-pipeline) 
	- [Test the Pipeline locally](https://docs.mlrun.org/en/latest/serving/distributed-graph.html#test-the-pipeline-locally)
	- [Deploy to the Cluster](https://docs.mlrun.org/en/latest/serving/distributed-graph.html#deploy-to-the-cluster) 

### Model Monitoring Documentation

- [Model Monitoring Overview](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html) 
	- [Introduction](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#introduction)
	- [Architecture](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#architecture) 
		- [Drift Analysis](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#drift-analysis) 
		- [Common Terminology](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#common-terminology) 
	- [Model Monitoring Using the Iguazio Platform Interface](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#model-monitoring-using-the-iguazio-platform-interface) 
		- [Model Endpoint Summary List](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#model-endpoint-summary-list) 
		- [Model Endpoint Overview](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#model-endpoint-overview) 
		- [Model Drift Analysis](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#model-drift-analysis) 
		- [Model Features Analysis](https://docs.mlrun.org/en/latest/model_monitoring/model-monitoring-deployment.html#model-features-analysis)
