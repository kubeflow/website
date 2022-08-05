+++
title = "Quickstart"
description = "Getting started with Kubeflow Pipelines"
weight = 3
                    
+++
<!-- TODO: add links to more thorough content docs -->
<!-- TODO: add UI screenshots for final pipeline -->
In this tutorial we will deploy a Kubernetes cluster, deploy a KFP standalone deployment into that cluster, create and run a simple pipeline using the KFP SDK, view the pipeline on the KFP Dashboard, then create a more involved machine learning pipeline that uses additional KFP features.

### 1) Deploy a Kubernetes cluster
If you already have a Kubernetes cluster, you can skip this step. If you do not have a Kubernetes cluster, follow sections (a) or (b) below to deploy a local cluster or a GCP cluster, depending on your preference.

#### a) Deploy a local cluster
To deploy a Kubernetes cluster locally, start by installing [kind](https://kind.sigs.k8s.io/).

**On Linux:**  
```shell
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64 && \
chmod +x ./kind && \
mv ./kind /bin/kind
```

**On macOS:**  
```shell
brew install kind
```

**On Windows:**  
Replace `KIND_DIRECTORY` with the directory in `PATH` where you wish to save kind.

```shell
KIND_DIRECTORY='<my_directory_in_path>'
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/latest/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\{KIND_DIRECTORY}\kind.exe
```
or install kind from [Chocolatey](https://chocolatey.org/packages/kind):

```shell
choco install kind
```

**All platforms:**  
After you've installed kind you can create a cluster by running:
```shell
kind create cluster
```

#### b) Deploy a cluster on GCP
To deploy a Kubernetes cluster on GCP, use the `gcloud` CLI:

```shell
CLUSTER_NAME="kubeflow-pipelines-standalone"
ZONE="us-central1-a"
MACHINE_TYPE="e2-standard-2" # 2 CPUs and 8GB memory
SCOPES="cloud-platform" # This scope is needed for running some pipelines. Read the warning below for security implications.

gcloud container clusters create $CLUSTER_NAME \
     --zone $ZONE \
     --machine-type $MACHINE_TYPE \
     --scopes $SCOPES
```
**Warning:** Using `SCOPES="cloud-platform"` grants all GCP permissions to the cluster. For a more secure cluster setup, refer to [Authenticating Pipelines to GCP](/docs/distributions/gke/authentication/#authentication-from-kubeflow-pipelines).

### 2) Deploy a KFP standalone instance into your cluster
Now that you have a Kubernetes cluster, you can deploy a KFP standalone instance into this cluster. Replace `PIPELINE_VERSION` with the desired version of KFP and run the following script:

```shell
export PIPELINE_VERSION="2.0.0-alpha.3"

kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION"
```

If you've deployed KFP on a local cluster, run the following to port forward the KFP Dashboard:

```shell
kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
```

then visit [http://localhost:8080](http://localhost:8080) to view the KFP Dashboard.

If you've deployed KFP on a cluster on GCP, run the following to get the public URL for the KFP Dashboard:

```shell
kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
```

Open the returned URL in your browser to view the KFP Dashboard.

### 3) Compose and submit simple pipeline
Now we'll compose a pipeline and submit it for execution by KFP using the KFP SDK.

To install the KFP SDK (v2 is currently in pre-release), run:
```shell
pip install kfp --pre
```

The following simple pipeline adds two integers together then adds another integer to this result to come up with a final sum.

```python
from kfp import dsl
from kfp import client


@dsl.component
def addition_component(num1: int, num2: int) -> int:
    return num1 + num2


@dsl.pipeline(name='addition-pipeline')
def my_pipeline(a: int, b: int, c: int = 10):
    add_task_1 = addition_component(num1=a, num2=b)
    add_task_2 = addition_component(num1=add_task_1.output, num2=c)


endpoint = '<KFP_ENDPOINT>'
kfp_client = client.Client(host=endpoint)
run = kfp_client.create_run_from_pipeline_func(
    my_pipeline,
    arguments={
        'a': 1,
        'b': 2
    },
)
url = f'{endpoint}/#/runs/details/{run.run_id}'
print(url)
```

Let's walk through each part step-by-step.

<!-- TODO: add lightweight component authoring link -->
First, we begin by creating a lightweight Python component using the `@dsl.component` decorator:
```python
@dsl.component
def addition_component(num1: int, num2: int) -> int:
    return num1 + num2
```
This decorator transforms a Python function into a component that can be used within a pipeline. Type annotations on the parameters and return value are required, as this tells the KFP executor how to serialize and deserialize data as it is passed between components. It also allows the KFP compiler to type check your pipeline.

Second, we create a pipeline using the `@dsl.pipeline` decorator:
```python
@dsl.pipeline(name='addition-pipeline')
def my_pipeline(a: int, b: int, c: int = 10):
    ...
```
Like the component decorator, the pipeline decorator transforms a Python function into a pipeline that can be executed by the KFP backend. The pipeline can have arguments which should also have type annotations. Notice that `c` has a default value of `10`.

Third, we connect components together to form a computational directed acyclic graph (DAG) within the pipeline function body:
```python    
add_task_1 = addition_component(num1=a, num2=b)
add_task_2 = addition_component(num1=add_task_1.output, num2=c)
```

In this example, we instantiate two different addition tasks from the same `addition_component` by passing arguments to the component function. Component arguments must always be passed as keyword arguments.

The first task takes pipeline parameters `a` and `b` as inputs. The second component takes the output from `add_task_1` as one input using `add_task_1.output` and pipeline parameter `c` as the second input.

Finally, we instantiate a KFP client with the endpoint we obtained in the previous step and submit the pipeline to the backend with the required pipeline arguments:

```python
endpoint = '<KFP_ENDPOINT>'
kfp_client = client.Client(host=endpoint)
run = kfp_client.create_run_from_pipeline_func(
    my_pipeline,
    arguments={
        'a': 1,
        'b': 2
    },
)
url = f'{endpoint}/#/runs/details/{run.run_id}'
print(url)
```

`endpoint` should be the KFP Dashboard URL you obtained in the previous step.

Alternatively, we could have compiled the pipeline to YAML for use at another time:

```python
from kfp import compiler

compiler.Compiler().compile(pipeline_func=my_pipeline, package_path='pipeline.yaml')
```

### 4) View the pipeline in the KFP Dashbaord
Open the URL printed by step three to view the pipeline run on the KFP Dashboard. By clicking on each task node, you can view inputs, outputs, logs, and other task details.

<img src="/docs/images/pipelines/addition_pipeline_ui.png" 
alt="Pipelines Dashboard"
class="mt-3 mb-3 border border-info rounded">

### 5) Build a more advanced pipeline
We'll finish by building a more advanced pipeline that demonstrates some additional KFP pipeline composition features.

The following machine learning pipeline creates a dataset, normalizes the features of the dataset as a preprocessing step, and trains a simple machine learning model on the data using different hyperparameters.

```python
from typing import List

from kfp import client
from kfp import dsl
from kfp.dsl import Dataset
from kfp.dsl import Input
from kfp.dsl import Model
from kfp.dsl import Output


@dsl.component(packages_to_install=['pandas==1.3.5'])
def create_dataset(iris_dataset: Output[Dataset]):
    import pandas as pd

    csv_url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'
    col_names = [
        'Sepal_Length', 'Sepal_Width', 'Petal_Length', 'Petal_Width', 'Labels'
    ]
    df = pd.read_csv(csv_url, names=col_names)

    with open(iris_dataset.path, 'w') as f:
        df.to_csv(f)


@dsl.component(packages_to_install=['pandas==1.3.5', 'scikit-learn==1.0.2'])
def normalize_dataset(
    input_iris_dataset: Input[Dataset],
    normalized_iris_dataset: Output[Dataset],
    standard_scaler: bool,
    min_max_scaler: bool,
):
    if standard_scaler is min_max_scaler:
        raise ValueError(
            'Exactly one of standard_scaler or min_max_scaler must be True.')

    import pandas as pd
    from sklearn.preprocessing import MinMaxScaler
    from sklearn.preprocessing import StandardScaler

    with open(input_iris_dataset.path) as f:
        df = pd.read_csv(f)
    labels = df.pop('Labels')

    if standard_scaler:
        scaler = StandardScaler()
    if min_max_scaler:
        scaler = MinMaxScaler()

    df = pd.DataFrame(scaler.fit_transform(df))
    df['Labels'] = labels
    with open(normalized_iris_dataset.path, 'w') as f:
        df.to_csv(f)


@dsl.component(packages_to_install=['pandas==1.3.5', 'scikit-learn==1.0.2'])
def train_model(
    normalized_iris_dataset: Input[Dataset],
    model: Output[Model],
    n_neighbors: int,
):
    import pickle

    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.neighbors import KNeighborsClassifier

    with open(normalized_iris_dataset.path) as f:
        df = pd.read_csv(f)

    y = df.pop('Labels')
    X = df

    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)

    clf = KNeighborsClassifier(n_neighbors=n_neighbors)
    clf.fit(X_train, y_train)
    with open(model.path, 'wb') as f:
        pickle.dump(clf, f)


@dsl.pipeline(name='iris-training-pipeline')
def my_pipeline(
    standard_scaler: bool,
    min_max_scaler: bool,
    neighbors: List[int],
):
    create_dataset_task = create_dataset()

    normalize_dataset_task = normalize_dataset(
        input_iris_dataset=create_dataset_task.outputs['iris_dataset'],
        standard_scaler=True,
        min_max_scaler=False)

    with dsl.ParallelFor(neighbors) as n_neighbors:
        train_model(
            normalized_iris_dataset=normalize_dataset_task
            .outputs['normalized_iris_dataset'],
            n_neighbors=n_neighbors)


endpoint = '<KFP_UI_URL>'
kfp_client = client.Client(host=endpoint)
run = kfp_client.create_run_from_pipeline_func(
    my_pipeline,
    arguments={
        'min_max_scaler': True,
        'standard_scaler': False,
        'neighbors': [3, 6, 9]
    },
)
url = f'{endpoint}/#/runs/details/{run.run_id}'
print(url)
```

Let's look at the new features introduced in this pipeline:

First, we've added some Python **packages to install** at component runtime via the `packages_to_install` argument on the `@dsl.component` decorator: `@dsl.component(packages_to_install=['pandas==1.3.5'])`. To use a library after it is installed you must include its import statements within the scope of the component function so that the library is imported at component runtime.

Second, we've used **input and output artifacts** of type `Dataset` and `Model`. These are specified in the component signature via the type annotation generics `Input[]` and `Output[]` , depending on whether the artifact is an input to the component or an output of the component.

Within the scope of a component, artifacts can be read (for inputs) and written (for outputs) via the `.path` attribute. The KFP backend will ensure that *input* artifact files are copied *to* the executing pod local filesystem from remote storage at runtime so that the component function can read input artifacts from the local filesystem. By comparison, *output* artifact files are copied *from* the pod's local filesystem to remote storage when the component finishes running, this way output artifacts are persisted outside of the pod. In both cases, the component author only needs to interact with the local filesystem to create persistent artifacts.

Notice that arguments for the parameters annotated with `Output[]` are not passed to components by the pipeline author. The KFP backend passes this artifact at component runtime so that component authors do not need to be concerned with the path to which output artifacts should be written. Once an output is written, the executing backend will recognize the KFP artifact types (`Dataset`, `Model`, etc.) and organize them within the Dashboard.

An output artifact can be passed as an input to a downstream component using via the source task's `.outputs` attribute and the output artifact parameter name: `create_dataset_task.outputs['iris_dataset']`.

Third, we used one of the **DSL control flow features**. `dsl.ParallelFor` is a context manager that allows pipeline authors to write a for loop that is executed at pipeline runtime. By using `dsl.ParallelFor` to iterate over the `neighbors` pipeline argument, we can execute the  `train_model` component with different arguments to test multiple hyperparameters in one pipeline run. Other control flow features include `dsl.Condition` and `dsl.ExitHandler`.

Congratulations! You now have a KFP deployment, an end-to-end machine learning pipeline, and an introduction to the UI! And that's just the beginning of KFP pipeline and Dashboard features.



## Next steps
* See [Installation](/docs/components/pipelines/installation/) for additional ways to deploy KFP
* See [Author a Pipeline](/docs/components/pipelines/author-a-pipeline/) to learn more about feautres available when authoring pipelines
* See [Dashboard](/docs/components/pipelines/user-interface/) for learn more about the KFP Dashboard