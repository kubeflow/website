+++
title = "Index of Reusable Components"
description = "A list of Kubeflow Pipelines components that you can use in your pipelines"
weight = 2
+++

A Kubeflow Pipelines *component* is a self-contained set of code that performs 
one step in the pipeline, such as data preprocessing, data transformation, model
training, and so on. Each component is packaged as a Docker image.
You can add existing components to your pipeline. These may be components that
you create yourself, or that someone else has created and made available.

The Kubeflow Pipelines repository includes a variety of 
[reusable components](https://github.com/kubeflow/pipelines/tree/master/components)
that you can add to your pipeline. This page highlights the components that
include usage documentation in the form of README files.

### Reusable components for Cloud Machine Learning Engine

**Component:** [Cloud ML Engine model training](https://github.com/kubeflow/pipelines/tree/master/components/gcp/ml_engine/train)
: Submits a Python training job to 
  [Cloud ML Engine](https://cloud.google.com/ml-engine/docs/).
  The job writes the trained model and other training results to a
  [Cloud Storage](https://cloud.google.com/storage/docs/) location of your
  choice.
  The component output is the ID of the training job on Cloud ML Engine.

**Component:** [Cloud ML Engine model deployment](https://github.com/kubeflow/pipelines/tree/master/components/gcp/ml_engine/deploy)
: Deploys a trained model to 
  [Cloud Machine Learning Engine](https://cloud.google.com/ml-engine/docs/)
  from a [Cloud Storage](https://cloud.google.com/storage/docs/) path.
  The component output is the Cloud ML Engine resource name of the deployed 
  model version.

**Component:** [Cloud ML Engine batch prediction](https://github.com/kubeflow/pipelines/tree/master/components/gcp/ml_engine/batch_predict)
: Submits a batch prediction request to a trained model deployed on 
  [Cloud Machine Learning Engine](https://cloud.google.com/ml-engine/docs/).
  The job writes the prediction results to a
  [Cloud Storage](https://cloud.google.com/storage/docs/) location of your
  choice.
  The component output is the ID of the batch prediction job on Cloud ML Engine.

### Reusable components for BigQuery

**Component:** [BigQuery query](https://github.com/kubeflow/pipelines/tree/master/components/gcp/bigquery/query)
: Submits a query to [BigQuery](https://cloud.google.com/bigquery/docs/) 
  and writes the component output to a 
  [Cloud Storage](https://cloud.google.com/storage/docs/) location of your
  choice.

### Reusable components for Cloud Dataflow

**Component:** [Dataflow Python Apache Beam job](https://github.com/kubeflow/pipelines/tree/master/components/gcp/dataflow/launch_python)
: Submits an Apache Beam job authored in Python to 
  [Cloud Dataflow](https://cloud.google.com/dataflow/docs/). 
  The Cloud Dataflow pipeline runner executes the Python code. The component 
  output is the ID of the Dataflow job.

**Component:** [Dataflow job from template](https://github.com/kubeflow/pipelines/tree/master/components/gcp/dataflow/launch_template)
: Submits a job to
  [Cloud Dataflow](https://cloud.google.com/dataflow/docs/) based on a template.
  The template must be stored in
  [Cloud Storage](https://cloud.google.com/storage/docs/). The component output
  is the ID of the Dataflow job.

## More information

* For usage instructions for each of the above components, see the README file 
  of the linked component on GitHub.
* See how to [build your own pipeline 
  components](/docs/pipelines/build-component).
