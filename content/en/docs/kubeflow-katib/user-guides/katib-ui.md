+++
title = "How to use Katib UI"
description = "How to access and use Katib UI"
weight = 30
+++

This page describes how to access and use Katib UI. Follow
[the installation page](/docs/components/katib/installation/#installing-katib) to install Katib
control plane before accessing Katib UI.

You can use the Katib user interface (UI) to submit Katib Experiments and to monitor your
Experiments results.

## Accessing Katib UI from Kubeflow Central Dashboard

If you install Katib as part of Kubeflow platform, you can access Katib UI via
[Kubeflow Central Dashboard](/docs/components/central-dash/access/#how-to-access-the-kubeflow-central-dashboard).
Click **Experiments (AutoML)** in the left-hand menu:

<img src="/docs/components/katib/images/home-page-kubeflow-ui.png"
  alt="The Katib UI within the Kubeflow Central Dashboard"
  class="mt-3 mb-3 border border-info rounded">

## Accessing Katib UI Standalone

You can access Katib UI standalone without Kubeflow Central Dashboard. For that, port-forward the
Katib UI service:

```shell
kubectl port-forward svc/katib-ui -n kubeflow 8080:80
```

Use this URL to access Katib UI:

```shell
http://localhost:8080/katib/
```

You need to select namespace to view Katib Experiments:

<img src="/docs/components/katib/images/home-page-standalone.png"
  alt="The Katib UI Standalone"
  class="mt-3 mb-3 border border-info rounded">

## Running Hyperparameter Tuning Experiment from Katib UI

You can submit an hyperparameter tuning Experiment from the Katib UI.

### Create Katib Experiment

1. Click **New Experiment** on the Katib home page.

1. You should be able to view tabs offering you the following options:

   - **Metadata:** Type name of your Experiment.

   - **Trial Thresholds:** Choose how many Trials you want to run.

   - **Objective:** Add metrics that you want to optimize and type of optimization.

   - **Search Algorithm:** Select hyperparameter tuning algorithm and configure algorithm settings.

   - **Early Stopping:** Add early stopping algorithm if that is required.

   - **Hyper Parameters:** Add hyperparameters and search space that you want to optimize.

   - **Metrics Collector:** Modify metrics collector type if that is required.

   - **Trial Template:** Configure parameters for your Trial template. Every hyperparameter must have
     reference to the `trialParameters` values.

   <img src="/docs/components/katib/images/deploy-parameters.png"
        alt="Deploy Katib Experiment using parameters"
        class="mt-3 mb-3 border border-info rounded">

1. (Optional) If you want to modify Experiment YAML, you can click edit and submit YAML at the bottom.

   <img src="/docs/components/katib/images/deploy-yaml.png"
       alt="Deploy Katib Experiment using YAML"
       class="mt-3 mb-3 border border-info rounded">

1. Create Katib Experiment.

### Get Katib Experiment Results

Follow these steps to get Katib Experiment results:

1. You should be able to view the list of Experiments on Katib UI home page:

   <img src="/docs/components/katib/images/home-page-kubeflow-ui.png"
     alt="List of Katib Experiments"
     class="mt-3 mb-3 border border-info rounded">

1. Click the name of your Experiment. For example, click **random-example**.

1. There should be a graph showing the level of validation and train accuracy
   for various combinations of the hyperparameter values (learning rate, number
   of layers, and optimizer):

   <img src="/docs/components/katib/images/random-example-graph.png"
     alt="Graph produced by the random example"
     class="mt-3 mb-3 border border-info rounded">

1. If you click to the Trials tab, you will see list of Trials that ran withing the Experiment.

   <img src="/docs/components/katib/images/random-example-trials.png"
     alt="Trials that ran during the Experiment"
     class="mt-3 mb-3 border border-info rounded">

1. You can click on Trial name to get metrics for the particular Trial:

   <img src="/docs/components/katib/images/random-example-trial-info.png"
     alt="Trial metrics graph"
     class="mt-3 mb-3 border border-info rounded">

### Create Katib Experiment with Early Stopping

Follow [this guide](/docs/components/katib/user-guides/early-stopping) to learn how early stopping
works in Katib.

1. Select early stopping algorithm while creating Katib Experiment:

   <img src="/docs/components/katib/images/early-stopping-parameter.png"
       alt="Katib Experiment with Early Stopping"
       class="mt-3 mb-3 border border-info rounded">

1. After your Experiment is complete, you can check your results in the Katib UI. The Trial statuses
   on the Experiment monitor page should look as follows:

   <img src="/docs/components/katib/images/early-stopping-trials.png"
       alt="Trials view with early stopping"
       class="mt-3 mb-3 border border-info rounded">

1. You can click on the early stopped Trial name to get reported metrics before this Trial was early stopped:

   <img src="/docs/components/katib/images/early-stopping-trial-info.png"
     alt="Early stopped Trial metrics"
     class="mt-3 mb-3 border border-info rounded">

## Next Steps

- Understand how [Katib metrics collector works](/docs/components/katib/user-guides/metrics-collector).

- Learn how to use [early stopping within Katib Experiments](/docs/components/katib/user-guides/early-stopping)
