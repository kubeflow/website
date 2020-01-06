+++
title = "Using Preemptible VMs and GPUs on GCP"
description = "Configuring preemptible VMs and GPUs for Kubeflow Pipelines on GCP"
weight = 80
+++

This document describes how to configure preemptible virtual machines
([preemptible VMs](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms))
and GPUs on preemptible VM instances
([preemptible GPUs](https://cloud.google.com/compute/docs/instances/preemptible#preemptible_with_gpu))
for your workflows running on Kubeflow Pipelines on Google Cloud Platform (GCP). 

## Introduction

Preemptible VMs are [Compute Engine VM 
instances](https://cloud.google.com/compute/docs/instances/) that last a maximum 
of 24 hours and provide no availability guarantees. The 
[pricing](https://cloud.google.com/compute/pricing) of preemptible VMs is
lower than that of standard Compute Engine VMs.

GPUs attached to preemptible instances 
([preemptible GPUs](https://cloud.google.com/compute/docs/instances/preemptible#preemptible_with_gpu)) 
work like normal GPUs but persist only for the life of the instance.

Using preemptible VMs and GPUs can reduce costs on GCP.
In addition to using preemptible VMs, your Google Kubernetes Engine (GKE)
cluster can autoscale based on current workloads.

This guide assumes that you have already deployed Kubeflow Pipelines. If not,
follow the guide to [deploying Kubeflow on GCP](/docs/gke/deploy/).

## Using preemptible VMs with Kubeflow Pipelines

In summary, the steps to schedule a pipeline to run on [preemptible
VMs](https://cloud.google.com/compute/docs/instances/preemptible) are as
follows: 

1.  Create a
    [node pool](https://cloud.google.com/kubernetes-engine/docs/concepts/node-pools)
    in your cluster that contains preemptible VMs.
1.  Configure your pipelines to run on the preemptible VMs.

The following sections contain more detail about the above steps.

### 1. Create a node pool with preemptible VMs

Use the `gcloud` command to
[create a node pool](https://cloud.google.com/sdk/gcloud/reference/container/node-pools/create).
The following example includes placeholders to illustrate the important
configurations:

    gcloud container node-pools create PREEMPTIBLE_CPU_POOL \
    	--cluster=CLUSTER_NAME \
        --enable-autoscaling --max-nodes=MAX_NODES --min-nodes=MIN_NODES \
        --preemptible \
        --node-taints=preemptible=true:NoSchedule \
        --service-account=DEPLOYMENT_NAME-vm@PROJECT_NAME.iam.gserviceaccount.com

Where:

+   `PREEMPTIBLE_CPU_POOL` is the name of the node pool. 
+   `CLUSTER_NAME` is the name of the GKE cluster.
+   `MAX_NODES` and `MIN_NODES` are the maximum and minimum number of nodes
    for the [GKE 
    autoscaling](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-autoscaler)
    functionality.
+   `DEPLOYMENT_NAME` is the name of your Kubeflow deployment. If you used
    [the CLI to deploy Kubeflow](/docs/gke/deploy/deploy-cli/),
    this name is the value of the `${KF_NAME}` environment variable. If you used
    the [deployment UI](/docs/gke/deploy/deploy-ui/),
    this name is the value you specified as the deployment name.
+   `PROJECT_NAME` is the name of your GCP project.

Below is an example of the command:

    gcloud container node-pools create preemptible-cpu-pool \
    	--cluster=user-4-18 \
        --enable-autoscaling --max-nodes=4 --min-nodes=0 \
        --preemptible \
        --node-taints=preemptible=true:NoSchedule \
        --service-account=user-4-18-vm@ml-pipeline-project.iam.gserviceaccount.com

### 2. Schedule your pipeline to run on the preemptible VMs

After configuring a node pool with preemptible VMs, you must configure your
pipelines to run on the preemptible VMs. 

In the [DSL code](/docs/pipelines/sdk/sdk-overview/) for
your pipeline, add the following to the `ContainerOp` instance:

    .apply(gcp.use_preemptible_nodepool())

The above function works for both methods of generating the `ContainerOp`:

+   The `ContainerOp` generated from 
[`kfp.components.func_to_container_op`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/components/_python_op.py).
+   The `ContainerOp` generated from the task factory function, which is
    loaded by [`components.load_component_from_url`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/components/_components.py).

**Note**: 

+   Call `.set_retry(#NUM_RETRY)` on your `ContainerOp` to retry 
    the task after the task is preempted.
+   If you modified the
    [node taint](https://cloud.google.com/kubernetes-engine/docs/how-to/node-taints)
    when creating the node pool, pass the same node toleration to the
    `use_preemptible_nodepool()` function.
+   `use_preemptible_nodepool()` also accepts a parameter `hard_constraint`. When the `hard_constraint` is
    `True`, the system will strictly schedule the task in preemptible VMs. When the `hard_constraint` is 
    `False`, the system will try to schedule the task in preemptible VMs. If it cannot find the preemptible VMs,
    or the preemptible VMs are busy, the system will schedule the task in normal VMs.

For example:

    import kfp.dsl as dsl
    import kfp.gcp as gcp

    class FlipCoinOp(dsl.ContainerOp):
      """Flip a coin and output heads or tails randomly."""

      def __init__(self):
        super(FlipCoinOp, self).__init__(
          name='Flip',
          image='python:alpine3.6',
          command=['sh', '-c'],
          arguments=['python -c "import random; result = \'heads\' if random.randint(0,1) == 0 '
                     'else \'tails\'; print(result)" | tee /tmp/output'],
          file_outputs={'output': '/tmp/output'})

    @dsl.pipeline(
      name='pipeline flip coin',
      description='shows how to use dsl.Condition.'
    )

    def flipcoin():
      flip = FlipCoinOp().apply(gcp.use_preemptible_nodepool())

    if __name__ == '__main__':
      import kfp.compiler as compiler
      compiler.Compiler().compile(flipcoin, __file__ + '.zip')

## Using preemptible GPUs with Kubeflow Pipelines

This guide assumes that you have already deployed Kubeflow Pipelines. In
summary, the steps to schedule a pipeline to run with
[preemptible GPUs](https://cloud.google.com/compute/docs/instances/preemptible#preemptible_with_gpu)
are as follows: 

1.  Make sure you have enough GPU quota.
1.  Create a node pool in your GKE cluster that contains preemptible VMs with
    preemptible GPUs. 
1.  Configure your pipelines to run on the preemptible VMs with preemptible
    GPUs.

The following sections contain more detail about the above steps.

### 1. Make sure you have enough GPU quota

Add GPU quota to your GCP project. The [GCP
documentation](https://cloud.google.com/compute/docs/gpus/#introduction) lists
the availability of GPUs across regions. To check the available quota for
resources in your project, go to the
[Quotas](https://console.cloud.google.com/iam-admin/quotas) page in the GCP
Console.

### 2. Create a  node pool of preemptible VMs with preemptible GPUs

Use the `gcloud` command to
[create a node pool](https://cloud.google.com/sdk/gcloud/reference/container/node-pools/create).
The following example includes placeholders to illustrate the important
configurations:

    gcloud container node-pools create PREEMPTIBLE_GPU_POOL \
        --cluster=CLUSTER_NAME \
        --enable-autoscaling --max-nodes=MAX_NODES --min-nodes=MIN_NODES \
        --preemptible \
        --node-taints=preemptible=true:NoSchedule \
        --service-account=DEPLOYMENT_NAME-vm@PROJECT_NAME.iam.gserviceaccount.com \
        --accelerator=type=GPU_TYPE,count=GPU_COUNT

Where:

+   `PREEMPTIBLE_GPU_POOL` is the name of the node pool. 
+   `CLUSTER_NAME` is the name of the GKE cluster.
+   `MAX_NODES` and `MIN_NODES` are the maximum and minimum number of nodes
    for the
    [GKE autoscaling](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-autoscaler)
    functionality.
+   `DEPLOYMENT_NAME` is the name of your Kubeflow deployment. If you used
    [the CLI to deploy Kubeflow](/docs/gke/deploy/deploy-cli/),
    this name is the value of the `${KF_NAME}` environment variable. If you used
    the [deployment UI](/docs/gke/deploy/deploy-ui/),
    this name is the value you specified as the deployment name.
+   `PROJECT_NAME` is the name of your GCP project.
+   `GPU_TYPE` is the [type of
    GPU](https://cloud.google.com/compute/docs/gpus/).
+   `GPU_COUNT` is the number of GPUs.

Below is an example of the command:

    gcloud container node-pools create preemptible-gpu-pool \
        --cluster=user-4-18 \
        --enable-autoscaling --max-nodes=4 --min-nodes=0 \
        --preemptible \
        --node-taints=preemptible=true:NoSchedule \
        --service-account=user-4-18-vm@ml-pipeline-project.iam.gserviceaccount.com \
        --accelerator=type=nvidia-tesla-t4,count=2

### 3. Schedule your pipeline to run on the preemptible VMs with preemptible GPUs

In the [DSL code](/docs/pipelines/sdk/sdk-overview/) for
your pipeline, add the following to the `ContainerOp` instance:

    .apply(gcp.use_preemptible_nodepool()

The above function works for both methods of generating the `ContainerOp`:

+   The `ContainerOp` generated from 
[`kfp.components.func_to_container_op`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/components/_python_op.py).
+   The `ContainerOp` generated from the task factory function, which is
    loaded by [`components.load_component_from_url`](https://github.com/kubeflow/pipelines/blob/master/sdk/python/kfp/components/_components.py).

**Note**: 

+   Call `.set_gpu_limit(#NUM_GPUs, GPU_VENDOR)` on your 
    `ContainerOp` to specify the GPU limit (for example, `1`) and vendor (for 
    example, `'nvidia'`).
+   Call `.set_retry(#NUM_RETRY)` on your `ContainerOp` to retry 
    the task after the task is preempted.
+   If you modified the
    [node taint](https://cloud.google.com/kubernetes-engine/docs/how-to/node-taints)
    when creating the node pool, pass the same node toleration to the
    `use_preemptible_nodepool()` function.
+   `use_preemptible_nodepool()` also accepts a parameter `hard_constraint`. When the `hard_constraint` is
    `True`, the system will strictly schedule the task in preemptible VMs. When the `hard_constraint` is 
    `False`, the system will try to schedule the task in preemptible VMs. If it cannot find the preemptible VMs,
    or the preemptible VMs are busy, the system will schedule the task in normal VMs.

For example:

    import kfp.dsl as dsl
    import kfp.gcp as gcp

    class FlipCoinOp(dsl.ContainerOp):
      """Flip a coin and output heads or tails randomly."""

      def __init__(self):
        super(FlipCoinOp, self).__init__(
          name='Flip',
          image='python:alpine3.6',
          command=['sh', '-c'],
          arguments=['python -c "import random; result = \'heads\' if random.randint(0,1) == 0 '
                     'else \'tails\'; print(result)" | tee /tmp/output'],
          file_outputs={'output': '/tmp/output'})

    @dsl.pipeline(
      name='pipeline flip coin',
      description='shows how to use dsl.Condition.'
    )

    def flipcoin():
      flip = FlipCoinOp().set_gpu_limit(1, 'nvidia').apply(gcp.use_preemptible_nodepool())
    if __name__ == '__main__':
      import kfp.compiler as compiler
      compiler.Compiler().compile(flipcoin, __file__ + '.zip')

## Comparison with Cloud AI Platform Training service

[Cloud AI Platform Training](https://cloud.google.com/ml-engine/docs/) is a GCP
machine learning (ML) training service that supports distributed training and
hyperparameter tuning, and requires no complex GKE configuration. Cloud AI
Platform Training charges the Compute Engine costs only for the runtime of the
job. 

The table below compares Cloud AI Platform Training with Kubeflow Pipelines
running preemptible VMs or GPUs:

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th></th>
        <th>Cloud AI Platform Training</th>
        <th>Kubeflow Pipelines with preemption</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Configuration</td>
        <td>No GKE configuration</td>
        <td>Requires GKE configuration</td>
      </tr>
      <tr>
        <td>Cost</td>
        <td>Compute Engine costs for the job lifetime</td>
        <td>Lower price with preemptible VMs/GPUs/TPUs</td>
      </tr>
      <tr>
        <td>Accelerator</td>
        <td>Supports various VM types, GPUs, and CPUs</td>
        <td>Support various VM types, GPUs, and CPUs</td>
      </tr>
      <tr>
      <td>Scalability</td>
        <td>Automates resource provisioning and supports distributed training</td>
        <td>Requires manual configuration such as <a
        href="https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler">GKE
        autoscaler</a> and distributed training workflow</td>
      </tr>
      <tr>
        <td>Features</td>
        <td>Out-of-box support for hyperparameter tuning</td>
        <td>Do-it-yourself hyperparameter tuning with Katib</td>
      </tr>
    </tbody>
  </table>
</div>

## Next steps

* Explore further options for [customizing Kubeflow on GCP](/docs/gke/).
* See how to [build pipelines with the SDK](/docs/pipelines/sdk/).
