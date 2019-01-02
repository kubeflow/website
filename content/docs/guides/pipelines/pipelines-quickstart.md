+++
title = "Pipelines Quickstart"
description = "Try Kubeflow Pipelines"
weight = 3
toc = true

[menu.docs]
  parent = "pipelines"
  weight = 1
+++

Use this guide if you want to get a simple pipeline running quickly in
Kubeflow Pipelines. If you need a more in-depth guide, see how to
[build a pipeline](/docs/guides/pipelines/build-pipeline/).

## Deploy Kubeflow and open the pipelines UI

Follow these steps to deploy Kubeflow and open the pipelines dashboard:

1. Follow the [GKE setup guide](/docs/started/getting-started-gke/) to
  deploy Kubeflow using the 
  [Kubeflow deployment UI](https://deploy.kubeflow.cloud/).

    (_Due to 
    [kubeflow/pipelines#345](https://github.com/kubeflow/pipelines/issues/345) and 
    [kubeflow/pipelines#337](https://github.com/kubeflow/pipelines/issues/337), 
    Kubeflow Pipelines depends on Google Cloud Platform (GCP) services and some of 
    the pipelines functionality is currently not supported by non-GKE clusters._)

1. When Kubeflow is running, access the Kubeflow UI at a URL of the form
  `https://<name>.endpoints.<project>.cloud.goog/`, as described in the setup
  guide. The Kubeflow UI looks like this:

    ![Kubeflow UI](/docs/images/central-ui.png)

1. Click **Pipeline Dashboard** to access the pipelines UI. The pipelines UI looks like
  this:

    ![Pipelines UI](/docs/images/pipelines-ui.png)

## Run a basic pipeline

The pipelines UI offers a few samples that you can use to try out
pipelines quickly. The steps below show you how to run a basic sample that
includes some Python operations, but doesn't include a machine learning (ML) 
workload:

1. Click the name of the sample, **\[Sample\] Basic - Parallel Join**, on the pipelines 
  UI:

    ![Pipelines UI](/docs/images/click-pipeline-sample.png)

1. Explore the **Graph** and **Source** tabs.
1. Click **Start an experiment**:

    ![Pipelines UI](/docs/images/pipelines-start-experiment.png)

1. Follow the prompts to create an **experiment** and a **run**. The sample 
  supplies default values for all the parameters you need. The following
  screenshot assumes you've already created an experiment named
  _My experiment_ and are now creating a run named _My first run_:

    ![Pipelines UI](/docs/images/pipelines-start-run.png)

1. Click **Create** to create the run.
1. Click the name of the run on the experiments dashboard:

    ![Pipelines UI](/docs/images/pipelines-experiments-dashboard.png)


1. Explore the graph and other aspects of your run by clicking on the 
  components of the graph and the other UI elements:

    ![Pipelines UI](/docs/images/pipelines-basic-run.png)

You can find the source code for the basic parallel join sample in the 
[Kubeflow Pipelines 
repo](https://github.com/kubeflow/pipelines/blob/master/samples/basic/parallel_join.py).

## Run an ML pipeline

TODO describe how to run the XGBoost sample, also supplied on the Pipelines UI - a sample that includes ML components. Need to enable Dataproc and supply parameters including a GCS location for output.

TODO Include screenshots.

TODO Include info about where to find the source code for the pipeline samples.

## Next steps

This page showed you how to run some of the examples supplied in the Kubeflow
Pipelines UI.

Next, you may want to run a pipeline from a notebook, or compile and run a
sample from the code. See the guide to 
[building a pipeline](/docs/guides/pipelines/build-pipeline/).
