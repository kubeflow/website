+++
title = "Python Based Visualizations"
description = "Predefined and custom visualizations of pipeline outputs"
weight = 80
+++

This page describes Python based visualizations, how to create them, and how to
use them to visualize results within the Kubeflow Pipelines UI. Python based
visualizations are available in Kubeflow Pipelines version
[0.1.28](https://github.com/kubeflow/pipelines/releases/tag/0.1.28) and will
be avaliable in Kubeflow version 0.7.0.

While Python based visualizations are intended to be the main method of
visualizing data within the Kubeflow Pipelines UI, they do not replace the
previous method of visualizing data within the Kubeflow Pipelines UI. When
considering which method of visualization to use within your pipeline, check the
[limitations of python based visualizations](https://github.com/kubeflow/
pipelines/blob/master/backend/src/apiserver/visualization/
README.md#known-limitations) and compare them with the requirements of your
visualizations.

## Introduction

Python based visualizations are a new method to visualize results within the
Kubeflow Pipelines UI. This new method of visualizing results is done through
the usage of [nbcovert](https://github.com/jupyter/nbconvert). Alongside the
usage of nbconvert, results of a pipeline can now be visualized without a
component being included within the pipeline itself because the process of
visualizing results is now decoupled from a pipeline.

Python based visualizations provide two categories of visualizations. The first
being **predefined visualizations**. These visualizations are provided by
default in Kubeflow Pipelines and serve as a way for you and your customers to
easily and quickly generate powerful visualizations. The second category is
**custom visualizations**. Custom visualizations allow for you and your
customers to provided Python visualization code to be used to generate
visualizations. These visualizations allow for rapid development,
experimentation, and customization when visualizing results.

<img src="/docs/images/python-based-visualizations1.png" 
  alt="Confusion matrix visualization from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

## Using predefined visualizations

<img src="/docs/images/python-based-visualizations2.png" 
  alt="Confusion matrix visualization from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

1. Open the details of a run.
2. Select a component.
    * The component that is selected does not matter. But, if you want to
    visualize the output of a specific component, it is easier to do that within
    that component.
3. Select the **Artifacts** tab.
4. At the top of the tab you should see a card named **Visualization Creator**.
5. Within the card, provide a visualization type, a source, and any necessary
arguments.
    * Any required or optional arguments will be shown as a placeholder.
6. Click **Generate Visualization**.
7. View generated visualization by scrolling down.

## Using custom visualizations

<img src="/docs/images/python-based-visualizations3.png" 
  alt="Confusion matrix visualization from a pipeline component"
  class="mt-3 mb-3 border border-info rounded">

1. Enable custom visualizations within Kubeflow Pipelines.
    * If you have not yet deployed Kubeflow Pipelines to your cluster,
    you can edit the [frontend deployment YAML](https://github.com/kubeflow/
    pipelines/blob/master/manifests/kustomize/base/pipeline/
    ml-pipeline-ui-deployment.yaml)
    file to include the following YAML that specifies that custom visualizations
    are allowed via environment variables.

    ```YAML
    - env:
      - name: ALLOW_CUSTOM_VISUALIZATIONS
        value: true
    ```
    * If you already have Kubeflow Pipelines deployed within a cluster, you can
    edit the frontend deployment YAML to specify that custom visualizations are
    allowed in the same way described above. Details about updating
    deployments can be found in the Kubernetes documentation about
    [updating a deployment](https://kubernetes.io/docs/concepts/workloads/
    controllers/deployment/#updating-a-deployment).
2. Open the details of a run.
3. Select a component.
    * The component that is selected does not matter. But, if you want to
    visualize the output of a specific component, it is easier to do that within
    that component.
4. Select the **Artifacts** tab.
5. At the top of the tab you should see a card named **Visualization Creator**.
6. Within the card, select the **CUSTOM** visualization type then provide a
source, and any necessary arguments (the source and argument variables are
optional for custom visualizations).
7. Provide the custom visualization code.
8. Click **Generate Visualization**.
9. View generated visualization by scrolling down.

## Next steps
If you'd like to add a predefined visualization to Kubeflow, take a look at the
[developer docs](https://github.com/kubeflow/pipelines/blob/master/backend/src/
apiserver/visualization/README.md).