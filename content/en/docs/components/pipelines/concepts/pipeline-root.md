+++
title = "Pipeline Root"
description = "Getting started with Kubeflow Pipelines pipeline root"
weight = 15

+++

Starting from [Kubeflow Pipelines SDK v2](https://kubeflow-pipelines.readthedocs.io/en/stable/) and Kubeflow Pipelines v2, Kubeflow Pipelines supports a new intermediate artifact repository feature: pipeline root in both [standalone deployment](/docs/components/pipelines/legacy-v1/installation/standalone-deployment/) and [AI Platform Pipelines](https://cloud.google.com/ai-platform/pipelines/docs).

## Before you start
This guide tells you the basic concepts of Kubeflow Pipelines pipeline root and how to use it.
This guide assumes that you already have Kubeflow Pipelines installed, or want to use standalone or AI Platform Pipelines options in the [Kubeflow Pipelines deployment
guide](/docs/components/pipelines/operator-guides/installation/) to deploy Kubeflow Pipelines.

## What is pipeline root?

Pipeline root represents an artifact repository where Kubeflow Pipelines stores a pipeline's artifacts.
This feature supports MinIO, S3, GCS natively using [Go CDK](https://github.com/google/go-cloud). Artifacts can be more accessible in S3 and GCS when integrating Kubeflow Pipelines with other systems.

**Note:** For MinIO, you can't change the MinIO instance. Kubeflow Pipelines can only use the Minio instance deployed with itself.
(Please thumb up this [GitHub Issue](https://github.com/kubeflow/pipelines/issues/6517) if you need to specify the Minio instance.)

## How to configure pipeline root authentication 
#### MinIO
You don't need to pass the authentication for MinIO.
Kubeflow Pipelines is configured with the authentication of the MinIO instance deployed with itself.

#### GCS
If you want to specify the `pipeline root` to GCS :

check [authentication-pipelines](https://www.kubeflow.org/docs/distributions/gke/pipelines/authentication-pipelines/)

#### S3
If you want to specify the `pipeline root` to S3, please choose one of the following options:

* Via [AWS IRSA](https://aws.amazon.com/blogs/containers/cross-account-iam-roles-for-kubernetes-service-accounts/):

* Via kfp sdk:
`dsl.get_pipeline_conf().add_op_transformer(aws.use_aws_secret('xxx', ‘xxx’, ‘xxx’))`
  
**references**:
* [add-op-transformer](https://kubeflow-pipelines.readthedocs.io/en/stable/source/dsl.html#kfp.dsl.PipelineConf.add_op_transformer)
* [use-aws-secret](https://kubeflow-pipelines.readthedocs.io/en/stable/source/kfp.extensions.html#kfp.aws.use_aws_secret)

## How to configure pipeline root

#### Via ConfigMaps

You can configure default pipeline root for Kubeflow Pipelines via changing the `defaultPipelineRoot` entry of  ConfigMaps `kfp-launcher` in Kubernetes namespace.

```shell
kubectl edit configMap kfp-launcher -n ${namespace}
```
This pipeline root will be the default pipeline root for all pipelines running in the Kubernetes namespace unless you override it using one of the following options:

####  Via Building Pipelines
You can configure a pipeline root through the `kfp.dsl.pipeline` annotation when [building pipelines](/docs/components/pipelines/legacy-v1/sdk/build-pipeline/#build-your-pipeline)

####  Via Submitting a Pipeline through SDK
You can configure pipeline root via `pipeline_root` argument when you submit a Pipeline using one of the following:
* [create_run_from_pipeline_func](https://kubeflow-pipelines.readthedocs.io/en/stable/source/client.html#kfp.Client.create_run_from_pipeline_func)
* [create_run_from_pipeline_package](https://kubeflow-pipelines.readthedocs.io/en/stable/source/client.html#kfp.Client.create_run_from_pipeline_package) 
* [run_pipeline](https://kubeflow-pipelines.readthedocs.io/en/stable/source/client.html#kfp.Client.run_pipeline).

####  Via Submitting a Pipeline Run through UI
You can configure a pipeline root via the `pipeline_root` run parameters when you submit a pipeline run in the UI
<img src="/docs/images/pipelines/v1/v2-compatible/pipelines-ui-pipelineroot.png"
alt="Configure pipeline root on the pipelines UI"
class="mt-3 mb-3 border border-info rounded">
