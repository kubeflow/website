+++
title = "Python Based Visualizations"
description = "Predefined and arbitrary visualizations of pipeline outputs"
weight = 80
+++

This page describes Python based visualizations, how to create them, and how to
use them to visualize results within the Kubeflow Pipelines UI.

## Introduction

Python based visualizations are a new method to visualize results within the
Kubeflow Pipelines UI. This new method of visualizing results is done through
the usage of [nbcovert](https://github.com/jupyter/nbconvert). Alongside the
usage of nbconvert, results of a pipeline can now be visualized without a
component being included within the pipeline itself. The process of visualizing
results are now decoupled from a pipeline.

Python based visualizations provide two categories of visualizations. The first
being **predefined visualizations**. These visualizations are provided by
default in Kubeflow Pipelines and serve as a way for you and your customers to
easily and quickly generate powerful visualizations. The second category is
**arbitrary visualizations**. Arbitrary visualizations allow for you and your
customers to provided Python visualization code to be used to generate
visualizations. These visualizations allow for rapid development,
experimentation, and customizability when visualizing results.

## Using predefined visualizations

1. Open the details of a run
2. Select a component
    * The component that is selected does not matter. But, if you want to
    visualize the output of a specific component, it is easier to do that within
    that component.
3. Select the **Artifacts** tab
4. At the top of the tab you should see a card named **Visualization Creator**
5. Within the card, provide a visualization type, a source, and any necessary
arguments
    * Any required or optional arguments will be shown as a placeholder
6. Click **Generate Visualization**
7. View generated visualization by scrolling down

## Using arbitrary visualizations

1. Enable arbitrary visualizations within Kubeflow Pipelines
2. Open the details of a run
3. Select a component
    * The component that is selected does not matter. But, if you want to
    visualize the output of a specific component, it is easier to do that within
    that component.
4. Select the **Artifacts** tab
5. At the top of the tab you should see a card named **Visualization Creator**
6. Within the card, select the **CUSTOM** visualization type then provide a
source, and any necessary arguments (the source and argument variables are
optional for custom visualizations)
7. Provide the arbitrary visualization code
8. Click **Generate Visualization**
9. View generated visualization by scrolling down

## Next Steps
* Create a [predefined visualization](https://github.com/kubeflow/pipelines/
blob/master/backend/src/apiserver/visualization/developer_guide.md).