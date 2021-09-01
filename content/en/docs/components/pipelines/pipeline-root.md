+++
title = "Pipeline Root"
description = "Getting started with Kubeflow Pipelines pipeline root"
weight = 50

+++
{{% beta-status
feedbacklink="https://github.com/kubeflow/pipelines/issues" %}}

Starting from [Kubeflow Pipelines SDK v2](https://www.kubeflow.org/docs/components/pipelines/sdk/v2/) and Kubeflow Pipelines 1.7.0, Kubeflow Pipelines supports a new intermediate artifact repository feature -- pipeline root in both [standalone deployment](https://www.kubeflow.org/docs/components/pipelines/installation/standalone-deployment/) and [AI platform Pipelines](https://cloud.google.com/ai-platform/pipelines/docs).

## Before you start
This guide tells you the basic concepts of Kubeflow Pipelines pipeline root and how to use it.
This guide assumes that you already have Kubeflow Pipelines installed or want to use standalone or AI platform Pipelines options in the [Kubeflow Pipelines deployment
guide](/docs/components/pipelines/installation/) to deploy Kubeflow Pipelines.

## What is pipeline root?

Pipeline root represents an artifact repository in which kubeflow pipelines will store pipeline's artifacts.
It supports MinIO, S3, GCS natively using [Go CDK](https://github.com/google/go-cloud). Artifacts can be more accessible in S3 and GCS when integrating Kubeflow Pipelines with other systems.
Note: For MinIO, you can't change the MinIO instance. Kubeflow Pipelines can only use the Minio instance deployed with itself.

## How to configure pipeline root authentication 
### MinIO
You don't need to pass the authentication for MinIO

### GCS
If you want to specify the `pipeline root` to GCS 
###  Set up pipeline root authentication in pipeline level via sdk
`dsl.get_pipeline_conf().add_op_transformer(aws.use_gcp_secret('xxx', ‘xxx’, ‘xxx’))`
(references: [add-op-transformer](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.PipelineConf.add_op_transformer) and [use-gcp-secret](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret))
### Set up pipeline root authentication via service account key 
Check [authentication-pipelines](https://www.kubeflow.org/docs/distributions/gke/pipelines/authentication-pipelines/)

### S3
If you want to specify the `pipeline root` to S3
###  Set up pipeline root authentication in pipeline level via sdk
`dsl.get_pipeline_conf().add_op_transformer(aws.use_aws_secret('xxx', ‘xxx’, ‘xxx’))`
(references: [add-op-transformer](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.PipelineConf.add_op_transformer) and [use-gcp-secret](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.aws.use_aws_secret))

## How to configure pipeline root

### Via ConfigMaps in Kubernetes Cluster

You can configure default `pipeline root` for Kubeflow Pipelines via changing the `defaultPipelineRoot` entry of  ConfigMaps `kfp-launcher` in Kubernetes Cluster.

```shell
kubectl edit configMap kfp-launcher -n ${your-namespace}
```
This `pipeline root` will be the default `pipeline root` for all pipelines running in the Kubernetes Cluster unless you override it through the following methods

### Via Building Pipelines
You can configure `pipeline root` through `kfp.dsl.pipeline` annotation when [building pipelines](https://www.kubeflow.org/docs/components/pipelines/sdk/v2/build-pipeline/#build-your-pipeline)

### Via Submitting a Pipeline through SDK
You can configure `pipeline root` via `pipeline_root` argument when you submit a Pipeline using [create_run_from_pipeline_func](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html#kfp.Client.create_run_from_pipeline_func) or [create_run_from_pipeline_package](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html#kfp.Client.create_run_from_pipeline_package) 
or [run_pipeline](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html#kfp.Client.run_pipeline).

### Via Submitting a Pipeline Run through UI
You can configure `pipeline root` via `pipeline_root` run parameters when you submit a pipeline run through UI.
<img src="/docs/images/pipelines/v2/pipelines-ui-pipelineroot.png"
alt="Configure pipeline root on the pipelines UI"
class="mt-3 mb-3 border border-info rounded">

## How to configure pipeline root authentication
