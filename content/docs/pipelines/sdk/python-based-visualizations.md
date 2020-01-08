+++
title = "Python Based Visualizations"
description = "Predefined and custom visualizations of pipeline outputs"
weight = 80
+++

This page describes Python based visualizations, how to create them, and how to
use them to visualize results within the Kubeflow Pipelines UI. Python based
visualizations are available in Kubeflow Pipelines version
[0.1.29](https://github.com/kubeflow/pipelines/releases/tag/0.1.29) and later, and
in Kubeflow version 0.7.0 and later.

While Python based visualizations are intended to be the main method of
visualizing data within the Kubeflow Pipelines UI, they do not replace the
previous method of visualizing data within the Kubeflow Pipelines UI. When
considering which method of visualization to use within your pipeline, check the
limitations of Python based visualizations in the section below and compare
them with the requirements of your visualizations.

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

### Predefined matrix visualization

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

### Predefined TFX visualization

<video width="960" height="540" controls>
  <source src="/docs/videos/tfdv_example_with_taxi_pipeline.webm" type="video/webm">
</video>

1. On the Pipelines page, click **[Sample] Unified DSL - Taxi Tip Prediction Model Trainer** to open the Pipeline Details page.
2. On the Pipeline Details page, click **Create run**.
3. On the Create run page,
    * Use a run name and an experiment name of your choice.
    * In the **pipeline-root** field, specify a storage bucket that you have permission to write to. For example, enter the path to a Google Cloud Storage bucket or an Amazon S3 bucket.
    * Click **Start** to create the run.
4. After the run is complete, on the Run Details page, click any step. For example, click the first step **csvexamplegen** as shown in the video above.
5. In the side panel of the selected step,
    * Click the **Artifacts** tab.
    * In the **Visualization Creator** section, choose **TFDV** from the drop down menu.
    * In the **Source** field, use **gs://ml-pipeline-playground/tfx_taxi_simple/data/data.csv**, which is the input data used for this run.
    * Click **Generate Visualization** and wait.
6. Move to the bottom of the **Artifacts** tab to find the generated visualization.

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

## Known limitations
* Multiple visualizations cannot be generated concurrently.
    * This is because a single Python kernel is used to generate visualizations.
    * If visualizations are a major part of your workflow, it is recommended to
    increase the number of replicas within the
    [visualization deployment YAML](https://github.com/kubeflow/pipelines/tree/
    master/manifests/kustomize/base/pipeline/
    ml-pipeline-visualization-deployment.yaml)
    file or within the visualization service deployment itself.
        * _Please note that this does not directly solve the issue, instead it
        decreases the likelihood of experiencing delays when generating
        visualizations._
* Visualizations that take longer than 30 seconds will fail to generate.
    * For visualizations where the 30 second timeout is reached, you can add the
    **TimeoutValue** header to the request made by the frontend, specifying a
    _positive integer as ASCII string of at most 8 digits_ for the length of
    time required to generate a visualization as specified by the
    [grpc documentation](https://github.com/grpc/grpc/blob/master/doc/
    PROTOCOL-HTTP2.md#requests).
    * For visualizations that take longer than 100 seconds, you will have to
    specify a **TimeoutValue** within the request headers **AND** change the
    default kernel timeout of the visualization service. To change the default
    kernel timeout of the visualization service, set the **KERNEL_TIMEOUT**
    environment variable of the visualization service deployment to be the new
    timeout length in seconds within the
    [visualization deployment YAML](https://github.com/kubeflow/pipelines/tree/
    master/manifests/kustomize/base/pipeline/
    ml-pipeline-visualization-deployment.yaml)
    file or within the visualization service deployment itself.
    ```YAML
    - env:
          - name: KERNEL_TIMEOUT
            value: 100
    ```
* The HTML content of the generated visualizations cannot be larger than 4MB.
    * gRPC by default imposes a limit of 4MB as the maximum size that can be
    sent and received by a server. To allow for visualizations that are larger
    than 4MB in size to be generated, you must manually set
    **MaxCallRecvMsgSize** for gRPC. This can be done by editing the provided
    options given to the gRPC server within [main.go](https://github.com/
    kubeflow/pipelines/blob/master/backend/src/apiserver/main.go#L128)
    to
    ```golang
    var maxCallRecvMsgSize = 4 * 1024 * 1024
    if serviceName == "Visualization" {
          // Only change the maxCallRecvMesSize if it is for visualizations
          maxCallRecvMsgSize = 50 * 1024 * 1024
    }
    opts := []grpc.DialOption{
          grpc.WithDefaultCallOptions(grpc.MaxCallRecvMsgSize(maxCallRecvMsgSize)),
          grpc.WithInsecure(),
    }
    ```

## Next steps
If you'd like to add a predefined visualization to Kubeflow, take a look at the
[developer docs](https://github.com/kubeflow/pipelines/blob/master/backend/src/
apiserver/visualization/README.md).
