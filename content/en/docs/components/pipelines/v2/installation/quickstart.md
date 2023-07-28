+++
title = "Quickstart"
description = "Get started with Kubeflow Pipelines"
weight = 2
+++

{{% kfp-v2-keywords %}}

<style type="text/css">
summary::marker {
    font-size: 1.5rem;
}
summary {
    margin-bottom: 1.5rem;
}
</style>

<!-- TODO: add UI screenshots for final pipeline -->
This tutorial helps you get started with deploying a KFP standalone instance, using KFP dashboard, and creating a pipeline with the KFP SDK.

Before you begin, you need the following prerequisites:

* **An existing Kubernetes cluster**: If you don't have a Kubernetes cluster, see [Installation][installation] for instructions about how to get one.

* **The [kubectl](https://kubernetes.io/docs/tasks/tools/) command-line tool**: Install and configure your [kubectl context](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) to connect with your cluster.

After you complete the prerequisites, click each section to view the instructions:

<details>
<summary><a name="kfp_qs_deployment"></a><h2 style="display:inline;">Deploy a KFP standalone instance into your cluster</h2></summary>

This step demonstrates how to deploy a KFP standalone instance into an existing Kubernetes cluster.

Run the following script after replacing `PIPELINE_VERSION` with the desired version of KFP (release are listed [here][releases]):

```shell
export PIPELINE_VERSION={{% pipelines/latest-version %}}

kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION"
```

After you deploy Kubernetes, obtain your KFP endpoint by following [these instructions][installation].
<!-- TODO: add more precise section link and descriptive link text (with more context) when available -->
</details>

<details>
<summary><a name="kfp_qs_basic_pipeline"></a><h2 style="display:inline;">Run a basic pipeline 
  using KFP Dashboard and SDK</h2></summary>

### **KFP Dashboard** ###
  Kubeflow Pipelines offers a few samples that you can use to try out
  Kubeflow Pipelines quickly. The steps below show you how to run a basic sample that
  includes some Python operations, but doesn't include a machine learning (ML) 
  workload:

1. Click the name of the sample, **[Tutorial] Data passing in python components**, on the pipelines UI:
  <img src="/docs/images/v2/click-pipeline-example.png" 
    alt="Pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

2. Click **Create run**:
  <img src="/docs/images/v2/pipelines-start-run.png" 
    alt="Creating a run on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

3. Follow the prompts to create a **run**. 
  The sample supplies default values for all the parameters you need. The 
  following screenshot assumes you are now creating a run named _My first run_:
  <img src="/docs/images/v2/pipelines-start-run-details.png" 
    alt="Details page of creating a run on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

4. Click **Start** to run the pipeline.

5. Explore the graph and other aspects of your run by clicking on the nodes 
  (components) of the graph and the other UI elements:
  <img src="/docs/images/v2/pipelines-basic-run.png" 
    alt="Run results on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

You can find the [source code for the **Data passing in python components** tutorial](https://github.com/kubeflow/pipelines/tree/2.0.0/samples/tutorials/Data%20passing%20in%20python%20components) in the Kubeflow Pipelines repo.

### **KFP SDK** ###
  This section shows how to use the KFP SDK to compose a pipeline and submit it for execution by KFP.

* Run the following script to install the KFP SDK:
  ```shell
  pip install kfp
  ```

The following simple pipeline adds two integers, and then adds another integer to the result to come up with a final sum.

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

The above code consists of the following parts:

* In the first part, the following lines create a [Lightweight Python Component][lightweight-python-component] by using the `@dsl.component` decorator:

  ```python
  @dsl.component
  def addition_component(num1: int, num2: int) -> int:
    return num1 + num2
  ```

  The `@dsl.component` decorator transforms a Python function into a component, which can be used within a pipeline. You are required to specify the type annotations on the parameters as well as the return value, as these inform the KFP executor how to serialize and deserialize the data passed between components. The type annotations and return value also enable the KFP compiler to type check any data that is passed between pipeline tasks.

* In the second part, the following lines [create a pipeline][pipelines] by using the `@dsl.pipeline` decorator:

  ```python
  @dsl.pipeline(name='addition-pipeline')
  def my_pipeline(a: int, b: int, c: int = 10):
    ...
  ```

  Like the component decorator, the `@dsl.pipeline` decorator transforms a Python function into a pipeline that can be executed by the KFP backend. The pipeline can have arguments. These arguments also require type annotations. In this example, the argument `c` has a default value of `10`.

* In the third part, the following lines connect the components together to form a computational directed acyclic graph (DAG) within the body of the pipeline function:

  ```python
  add_task_1 = addition_component(num1=a, num2=b)
  add_task_2 = addition_component(num1=add_task_1.output, num2=c)
  ```

  This example instantiates two different addition tasks from the same component named `addition_component`, by passing different arguments to the component function for each task, as follows:
  * The first task accepts pipeline parameters `a` and `b` as input arguments.
  * The second task accepts `add_task_1.output`, which is the output from `add_task_1`, as the first input argument. The pipeline parameter `c` is the second input argument.

  You must always pass component arguments as keyword arguments.

* In the fourth part, the following lines instantiate a KFP client using the endpoint obtained in [deployment step](#kfp_qs_deployment) and submit the pipeline to the KFP backend with the required pipeline arguments:

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

  In this example, replace `endpoint` with the KFP endpoint URL you obtained in [deployment step](#kfp_qs_deployment).

  Alternatively, you can compile the pipeline to [IR YAML][ir-yaml] for use at another time:

  ```python
  from kfp import compiler

  compiler.Compiler().compile(pipeline_func=my_pipeline, package_path='pipeline.yaml')
  ```
To view the pipeline run on the KFP Dashboard, go to the URL printed above.

To view the details of each task, including input and output, click the appropriate task node.
<!-- TODO: add logs to this list when available in v2 -->

<img src="/docs/images/pipelines/addition_pipeline_ui.png"
alt="Pipelines Dashboard"
class="mt-3 mb-3 border border-info rounded">


</details>

<details>
<summary><a name="kfp_qs_advanced_ml"></a><h2 style="display:inline;">Build a more advanced ML pipeline</h2></summary>

This step demonstrates how to build a more advanced machine learning (ML) pipeline that leverages additional KFP pipeline composition features.

The following ML pipeline creates a dataset, normalizes the features of the dataset as a preprocessing step, and trains a simple ML model on the data using different hyperparameters:

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

This example introduces the following new features in the pipeline:

* Some Python **packages to install** are added at component runtime, using the `packages_to_install` argument on the `@dsl.component` decorator, as follows:

    `@dsl.component(packages_to_install=['pandas==1.3.5'])`

    To use a library after installing it, you must include its import statements within the scope of the component function, so that the library is imported at component runtime.

* **Input and output artifacts** of types `Dataset` and `Model` are introduced in the component signature to describe the input and output artifacts of the components. This is done using the type annotation generics `Input[]` and `Output[]` for input and output artifacts respectively.

  Within the scope of a component, artifacts can be read (for inputs) and written (for outputs) via the `.path` attribute. The KFP backend ensures that *input* artifact files are copied *to* the executing pod's local file system from the remote storage at runtime, so that the component function can read input artifacts from the local file system. By comparison, *output* artifact files are copied *from* the local file system of the pod to remote storage, when the component finishes running. This way, the output artifacts persist outside the pod. In both cases, the component author needs to interact with the local file system only to create persistent artifacts.

  The arguments for the parameters annotated with `Output[]` are not passed to components by the pipeline author. The KFP backend passes this artifact during component runtime, so that component authors don't need to be concerned about the path to which the output artifacts are written. After an output artifact is written, the backend executing the component recognizes the KFP artifact types (`Dataset` or `Model`), and organizes them on the Dashboard.

  An output artifact can be passed as an input to a downstream component using the `.outputs` attribute of the source task and the output artifact parameter name, as follows:

  `create_dataset_task.outputs['iris_dataset']`

* One of the **DSL control flow features**, `dsl.ParallelFor`, is used. It is a context manager that lets pipeline authors create tasks. These tasks execute in parallel in a loop. Using `dsl.ParallelFor` to iterate over the `neighbors` pipeline argument lets you execute the  `train_model` component with different arguments and test multiple hyperparameters in one pipeline run. Other control flow features include `dsl.Condition` and `dsl.ExitHandler`.

</details>

Congratulations! You now have a KFP deployment, an end-to-end ML pipeline, and an introduction to the UI. That's just the beginning of KFP pipeline and Dashboard features.

<!TODO: Add some more content to direct the user to what comes next. -->

## Next steps

* See [Installation][installation] for additional ways to deploy KFP
* See [Pipelines][pipelines] to learn more about features available when authoring pipelines

[pipelines]: /docs/components/pipelines/v2/pipelines/
[installation]: /docs/components/pipelines/v2/installation/
[ir-yaml]: /docs/components/pipelines/v2/compile-a-pipeline/#ir-yaml
[lightweight-python-component]: /docs/components/pipelines/v2/components/lightweight-python-components
[releases]: https://github.com/kubeflow/pipelines/releases?q=Version&expanded=true
