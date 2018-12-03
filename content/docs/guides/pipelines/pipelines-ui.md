+++
title = "Using the Pipelines UI"
description = "Using the Kubeflow Pipelines UI"
weight = 3
toc = true

[menu.docs]
  parent = "pipelines"
  weight = 5
+++
You can use the Kubeflow Pipelines UI to complete tasks like creating, listing, 
and managing different resources, and viewing and comparing the outputs of 
experiments. This guide discusses the different operations you can perform using 
the UI.

## List available pipelines

The landing page of the UI is a list of all available pipelines, with management 
controls such as uploading new pipelines, deleting existing ones, or creating an 
experiment out of a selected pipeline.

## Create an experiment

From a pipeline's details page, click **Create experiment**. This takes you to 
the new experiment page, where you can specify the experiment's name and 
description. 

## Create a run inside an experiment

On the experiment's details page, click **Create new run**. 
Fill out the run's name and description, pick which pipeline it will execute.

The next section is the pipeline's parameters form. This form is generated 
automatically based on the selected pipeline. You can try out different 
pipelines using the pipeline picker dialog. 

After you fill in the parameters (some are filled in automatically, if the 
pipeline author provides default values), click the **Create** button to start 
the run. This takes you back to the experiment's details page.

## Create recurring runs

In the experiment's details page, you can also click the 
**Create recurring run** button. This takes you through a similar flow as 
creating a run, but here you can choose the kind of trigger that should be used 
to spawn the runs. You can specify **Maximum concurrent runs** to limit the 
number of runs launched in parallel. This can be helpful if the pipeline is 
expected to run for a long period of time, and is triggered to run frequently.

## List runs and recurring runs

The experiment's details page shows all of the runs created or generated in it 
by default. The page also has a widget to show the number of active recurring 
runs in this experiment, and you can click the **manage** button to see a list 
of recurring run configs, enable and disable them, or see any config's details.

## List experiments

This page offers two views into the runs scheduled in the cluster:

1. All experiments: This shows a list of experiments, as well as the status of 
   each experiment's last five runs. You can expand the experiment to see the 
   list of the most recent five runs inline, or click its name to go to its 
   details page, where you can see all of its runs.
1. Show all runs: This is a flat list of all runs in the system, showing each 
   run's status, run duration, associated pipeline and experiment if any, and 
   its start time.

## Examine a run

Clicking a run in the run list (either inside an experiment, or in the top-level 
flat list of runs) takes you to the **Run Details** page in the 
Kubeflow Pipelines UI.

A run is a single execution of a pipeline. You can examine the configuration, 
status, outputs, execution graph, and logs on the run details page.

The run details page shows the following information:

* A toolbar with a breadcrumb and some action buttons.
* Two tabs, **Graph** and **Config**.
* A visualization of the execution graph of the run.

### The toolbar

The breadcrumb at the top of the page shows the following information:
 **Experiments > [experiment name] > [run name]**, with an icon to the left of 
 the run name indicating its status. For example, 
 _Succeeded_, _Running_, _Failed_. Each of these elements of the breadcrumb is 
 clickable and can be used to navigate.

The **Clone** button takes you to the **Create new run** form with the same 
pipeline selected and all of the parameters set to the same values as the run 
you are looking at. You can edit everything, but only need to fill in the 
**run name** and make sure a pipeline is selected before deploying.

The **Refresh** button retrieves the latest information from the back end, 
updating all elements on the page.

### Exploring the run

There are two main views in the run details page: the **Graph** view, and the
**Config** view.

### The graph

Pipelines generally consist of a number of components, and the graph shows the 
steps that this run has executed so far with arrows indicating parent/child 
relationships. The graph is viewable as soon as the run begins. You can update 
it using the **Refresh** button at the top of the page. Each node within the 
graph corresponds to a step within the pipeline and is labeled accordingly.

At the top right of each node is an icon indicating its status. For example, 
_Succeeded_, _Running_, _Failed_, or _Skipped_. A node can be skipped when its 
parent contains a conditional and is indicated by a gray triangle pointing 
towards a vertical line.

Clicking on a node highlights it and opens a resizable panel from the right of 
the page displaying the name of the run and containing its own three tabs: 
**Artifacts**, **Input/Output**, and **Logs**.

### Artifacts

Artifacts are any 
[viewers](docs/guides/pipelines/output-viewers) associated with a given 
component. There are many kinds of viewers including: 

* TensorBoard instances (accessible via link)
* A confusion matrix
* An ROC curve
* A simple table
* User-defined HTML
* And more

### Input/output

This simple view includes the inputs and outputs of the node, if any.

### Logs

This tab displays the Kubernetes pod logs associated with the selected component 
and may be useful for debugging.

## The config

This is a main view within the run details page and consists of some basic 
information about the run such as its status, creation time, start time, finish 
time, duration, and the pipeline parameters it was run with.
