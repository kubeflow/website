+++
title = "Pipelines Quickstart"
description = "Getting started with Kubeflow Pipelines"
weight = 20
+++

Use this guide if you want to get a simple pipeline running quickly in
Kubeflow Pipelines. If you need a more in-depth guide, see the
[end-to-end tutorial](/docs/pipelines/tutorials/pipelines-tutorial/).

* This quickstart guide shows you how to use one of the samples that come with 
  the Kubeflow Pipelines installation and are visible on the Kubeflow Pipelines
  user interface (UI). You can use this guide as an introduction to the 
  Kubeflow Pipelines UI.
* The end-to-end tutorial shows you how to prepare and compile a pipeline, 
  upload it to Kubeflow Pipelines, then run it.

## Deploy Kubeflow and open the pipelines UI

Follow these steps to deploy Kubeflow and open the pipelines dashboard:

1. Follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/), 
  including the step to deploy Kubeflow using the 
  [Kubeflow deployment UI](https://deploy.kubeflow.cloud/).

    {{% pipelines-compatibility %}} 

1. When Kubeflow is running, access the Kubeflow UI at a URL of the form
  `https://<deployment-name>.endpoints.<project>.cloud.goog/`, as described in the setup
  guide. The Kubeflow UI looks like this:
  <img src="/docs/images/central-ui.png" 
    alt="Kubeflow UI"
    class="mt-3 mb-3 border border-info rounded">

    If you skipped the Cloud IAP option when deploying Kubeflow, or if you 
    haven't yet set up your Kubeflow endpoint, you can access Kubeflow via 
    `kubectl` and port-forwarding:
    
    1. Install `kubectl` if you haven't already done so, by running the 
      following command on the command line: 
      `gcloud components install kubectl`. For more information, see the 
      [`kubectl` 
      documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

    1. Run ```kubectl port-forward -n kubeflow `kubectl get pods -n kubeflow --selector=service=ambassador -o jsonpath='{.items[0].metadata.name}'` 8080:80``` and go to `http://localhost:8080/`.

1. Click **Pipeline Dashboard** to access the pipelines UI. The pipelines UI looks like
  this:
  <img src="/docs/images/pipelines-ui.png" 
    alt="Pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

## Run a basic pipeline

The pipelines UI offers a few samples that you can use to try out
pipelines quickly. The steps below show you how to run a basic sample that
includes some Python operations, but doesn't include a machine learning (ML) 
workload:

1. Click the name of the sample, **\[Sample\] Basic - Parallel Join**, on the pipelines 
  UI:
  <img src="/docs/images/click-pipeline-sample.png" 
    alt="Pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

1. Click **Create an experiment**:
  <img src="/docs/images/pipelines-start-experiment.png" 
    alt="Starting an experiment on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

1. Follow the prompts to create an **experiment** and then create a **run**. 
  The sample supplies default values for all the parameters you need. The 
  following screenshot assumes you've already created an experiment named
  _My experiment_ and are now creating a run named _My first run_:
  <img src="/docs/images/pipelines-start-run.png" 
    alt="Creating a run on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

1. Click **Start** to create the run.
1. Click the name of the run on the experiments dashboard:
  <img src="/docs/images/pipelines-experiments-dashboard.png" 
    alt="Experiments dashboard on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

1. Explore the graph and other aspects of your run by clicking on the 
  components of the graph and the other UI elements:
  <img src="/docs/images/pipelines-basic-run.png" 
    alt="Run results on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

You can find the source code for the basic parallel join sample in the 
[Kubeflow Pipelines 
repo](https://github.com/kubeflow/pipelines/blob/master/samples/basic/parallel_join.py).

## Run an ML pipeline

This section shows you how to run the XGBoost sample available
from the pipelines UI. Unlike the basic sample described above, the
XGBoost sample does include ML components. Before running this sample, 
you need to set up some GCP services for use by the sample.

Follow these steps to set up the necessary GCP services and run the sample:

1. In addition to the standard GCP APIs that you need for Kubeflow (see the
  [GCP setup guide](/docs/gke/deploy/project-setup)), ensure that the 
  following APIs are enabled:

    * [Cloud Storage](https://console.cloud.google.com/apis/library/storage-component.googleapis.com)
    * [Dataproc](https://console.cloud.google.com/apis/library/dataproc.googleapis.com)

1. Create a 
  [Cloud Storage bucket](https://console.cloud.google.com/storage/create-bucket) 
  to hold the results of the pipeline run.

  * Your *bucket name* must be unique across all of Cloud Storage.
  * Each time you create a new run for this pipeline, Kubeflow creates a unique
    directory within the output bucket, so the output of each run does not
    override the output of the previous run.

1. Click the name of the sample, 
  **\[Sample\] ML - XGBoost - Training with Confusion Matrix**, on the pipelines 
  UI:
  <img src="/docs/images/click-xgboost-sample.png" 
    alt="XGBoost sample on the pipelines UI"
    class="mt-3 mb-3 border border-info rounded">

1. Click **Create an experiment**.
1. Follow the prompts to create an **experiment** and then create a **run**.
  Supply the following **run parameters**:

  * **output:** The Cloud Storage bucket that you created earlier to hold the
    results of the pipeline run.
  * **project:** Your GCP project ID.

    The sample supplies the values for the other parameters:

  * region: The GCP geographical region in which the training and evaluaton data
    are stored.
  * train-data: Cloud Storage path to the training data.
  * eval-data: Cloud Storage path to the evaluation data.
  * schema: Cloud Storage path to a JSON file describing the format of the
    CSV files that contain the training and evaluation data.
  * target: Column name of the target variable.
  * rounds: The number of rounds for XGBoost training.
  * workers: Number of workers used for distributed training.
  * true-label: Column to be used for text representation of the label output
    by the model.

    The arrows on the following screenshot indicate the run parameters that you
    must supply:
    <img src="/docs/images/pipelines-start-xgboost-run.png" 
      alt="Starting the XGBoost run on the pipelines UI"
      class="mt-3 mb-3 border border-info rounded">

1. Click **Start** to create the run.
1. Click the name of the run on the experiments dashboard.
1. Explore the graph and other aspects of your run by clicking on the 
  components of the graph and the other UI elements. The following screenshot
  shows the graph when the pipeline has finished running:
    <img src="/docs/images/pipelines-xgboost-graph.png" 
      alt="XGBoost results on the pipelines UI"
      class="mt-3 mb-3 border border-info rounded">

You can find the source code for the XGBoost training sample in the 
[Kubeflow Pipelines 
repo](https://github.com/kubeflow/pipelines/tree/master/samples/xgboost-spark).

## Clean up your GCP environment

As you work through this guide, your project uses billable components of
GCP. To minimise costs, follow these steps to clean up resources when you've 
finished with them:

1. Visit [Deployment Manager](https://console.cloud.google.com/dm) to delete 
  your deployment and related resources.
1. Delete your [Cloud Storage bucket](https://console.cloud.google.com/storage) 
  when you've finished examining the output of the pipeline.

## Next steps

* Learn more about the 
  [important concepts](/docs/pipelines/concepts/) in Kubeflow
  Pipelines.
* Follow the [end-to-end tutorial](/docs/pipelines/tutorials/pipelines-tutorial/) 
  using an MNIST machine-learning model.
* This page showed you how to run some of the examples supplied in the Kubeflow
  Pipelines UI. Next, you may want to run a pipeline from a notebook, or compile 
  and run a sample from the code. See the guide to experimenting with
  [the Kubeflow Pipelines samples](/docs/pipelines/tutorials/build-pipeline/).
