+++
title = "Using Preemptible VMs and GPUs on Google Cloud"
description = "Configuring preemptible VMs and GPUs for Kubeflow Pipelines on Google Cloud"
weight = 80
                    
+++


This document describes how to configure preemptible virtual machines
([preemptible VMs](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms))
and GPUs on preemptible VM instances
([preemptible GPUs](https://cloud.google.com/compute/docs/instances/preemptible#preemptible_with_gpu))
for your workflows running on Kubeflow Pipelines on Google Cloud. 

## Introduction

Preemptible VMs are [Compute Engine VM 
instances](https://cloud.google.com/compute/docs/instances/) that last a maximum 
of 24 hours and provide no availability guarantees. The 
[pricing](https://cloud.google.com/compute/pricing) of preemptible VMs is
lower than that of standard Compute Engine VMs.

GPUs attached to preemptible instances 
([preemptible GPUs](https://cloud.google.com/compute/docs/instances/preemptible#preemptible_with_gpu)) 
work like normal GPUs but persist only for the life of the instance.

Using preemptible VMs and GPUs can reduce costs on Google Cloud.
In addition to using preemptible VMs, your Google Kubernetes Engine (GKE)
cluster can autoscale based on current workloads.

This guide assumes that you have already deployed Kubeflow Pipelines. If not,
follow the guide to [deploying Kubeflow on Google Cloud](/docs/gke/deploy/).

## Before you start

The variables defined in this page can be found in [gcp-blueprint/kubeflow/env.sh](https://github.com/kubeflow/gcp-blueprints/blob/master/kubeflow/env.sh). They are the same value as you set based on your [Kubeflow deployment](/docs/distributions/gke/deploy/deploy-cli/#environment-variables). 

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

Create a `preemptible-nodepool.yaml` as below and fulfill all placerholder content `KF_NAME`, `KF_PROJECT`, `LOCATION`:

```
apiVersion: container.cnrm.cloud.google.com/v1beta1
kind: ContainerNodePool
metadata:
  labels:
    kf-name: KF_NAME # kpt-set: ${name}
  name: PREEMPTIBLE_CPU_POOL
  namespace: KF_PROJECT # kpt-set: ${gcloud.core.project}
spec:
  location: LOCATION # kpt-set: ${location}
  initialNodeCount: 1
  autoscaling:
    minNodeCount: 0
    maxNodeCount: 5
  nodeConfig:
    machineType: n1-standard-4
    diskSizeGb: 100
    diskType: pd-standard
    preemptible: true
    taint:
    - effect: NO_SCHEDULE
      key: preemptible
      value: "true"
    oauthScopes:
    - "https://www.googleapis.com/auth/logging.write"
    - "https://www.googleapis.com/auth/monitoring"
    - "https://www.googleapis.com/auth/devstorage.read_only"
    serviceAccountRef:
      external: KF_NAME-vm@KF_PROJECT.iam.gserviceaccount.com # kpt-set: ${name}-vm@${gcloud.core.project}.iam.gserviceaccount.com
    metadata:
      disable-legacy-endpoints: "true"
  management:
    autoRepair: true
    autoUpgrade: true
  clusterRef:
    name: KF_NAME # kpt-set: ${name}
    namespace: KF_PROJECT # kpt-set: ${name}
```


Where:

+   `PREEMPTIBLE_CPU_POOL` is the name of the node pool. 
+   `KF_NAME` is the name of the Kubeflow GKE cluster.
+   `KF_PROJECT` is the name of your Kubeflow Google Cloud project. 
+   `LOCATION` is the region of this nodepool, for example: us-west1-b.
+   `KF_NAME-vm@KF_PROJECT.iam.gserviceaccount.com` is your service account, replace the `KF_NAME` and `KF_PROJECT` using the value above  in this pattern, you can get vm service account you have already created in Kubeflow cluster deployment

Apply the nodepool patch file above by running:

```bash
kubectl --context=${MGMTCTXT} --namespace=${KF_PROJECT} apply -f <path-to-nodepool-file>/preemptible-nodepool.yaml
```

#### For Kubeflow Pipelines standalone only

Alternatively, if you are on Kubeflow Pipelines standalone, or AI Platform Pipelines, you can run this command to create node pool:

```
gcloud container node-pools create PREEMPTIBLE_CPU_POOL \
    --cluster=CLUSTER_NAME \
      --enable-autoscaling --max-nodes=MAX_NODES --min-nodes=MIN_NODES \
      --preemptible \
      --node-taints=preemptible=true:NoSchedule \
      --service-account=DEPLOYMENT_NAME-vm@PROJECT_NAME.iam.gserviceaccount.com
```

Below is an example of command:

```
gcloud container node-pools create preemptible-cpu-pool \
  --cluster=user-4-18 \
    --enable-autoscaling --max-nodes=4 --min-nodes=0 \
    --preemptible \
    --node-taints=preemptible=true:NoSchedule \
    --service-account=user-4-18-vm@ml-pipeline-project.iam.gserviceaccount.com
```


### 2. Schedule your pipeline to run on the preemptible VMs

After configuring a node pool with preemptible VMs, you must configure your
pipelines to run on the preemptible VMs. 

In the [DSL code](/docs/components/pipelines/sdk/sdk-overview/) for
your pipeline, add the following to the `ContainerOp` instance:

    .apply(gcp.use_preemptible_nodepool())

The above function works for both methods of generating the `ContainerOp`:

+   The `ContainerOp` generated from 
[`kfp.components.func_to_container_op`](https://github.com/kubeflow/pipelines/blob/sdk/release-1.8/sdk/python/kfp/components/_python_op.py).
+   The `ContainerOp` generated from the task factory function, which is
    loaded by [`components.load_component_from_url`](https://github.com/kubeflow/pipelines/blob/sdk/release-1.8/sdk/python/kfp/components/_components.py).

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

Add GPU quota to your Google Cloud project. The [Google Cloud
documentation](https://cloud.google.com/compute/docs/gpus/#introduction) lists
the availability of GPUs across regions. To check the available quota for
resources in your project, go to the
[Quotas](https://console.cloud.google.com/iam-admin/quotas) page in the Google Cloud
Console.

### 2. Create a node pool of preemptible VMs with preemptible GPUs

Create a `preemptible-gpu-nodepool.yaml` as below and fulfill all placerholder content:

```
apiVersion: container.cnrm.cloud.google.com/v1beta1
kind: ContainerNodePool
metadata:
  labels:
    kf-name: KF_NAME # kpt-set: ${name}
  name: KF_NAME-containernodepool-gpu
  namespace: KF_PROJECT # kpt-set: ${gcloud.core.project}
spec:
  location: LOCATION # kpt-set: ${location}
  initialNodeCount: 1
  autoscaling:
    minNodeCount: 0
    maxNodeCount: 5
  nodeConfig:
    machineType: n1-standard-4
    diskSizeGb: 100
    diskType: pd-standard
    preemptible: true
    oauthScopes:
    - "https://www.googleapis.com/auth/logging.write"
    - "https://www.googleapis.com/auth/monitoring"
    - "https://www.googleapis.com/auth/devstorage.read_only"
    serviceAccountRef:
      external: KF_NAME-vm@KF_PROJECT.iam.gserviceaccount.com # kpt-set: ${name}-vm@${gcloud.core.project}.iam.gserviceaccount.com
    guestAccelerator:
    - type: "nvidia-tesla-k80"
      count: 1
    metadata:
      disable-legacy-endpoints: "true"
  management:
    autoRepair: true
    autoUpgrade: true
  clusterRef:
    name: KF_NAME # kpt-set: ${name}
    namespace: KF_PROJECT # kpt-set: ${gcloud.core.project}
```

Where:

+   `PREEMPTIBLE_CPU_POOL` is the name of the node pool. 
+   `KF_NAME` is the name of the Kubeflow GKE cluster.
+   `KF_PROJECT` is the name of your Kubeflow Google Cloud project. 
+   `LOCATION` is the region of this nodepool, for example: us-west1-b.
+   `KF_NAME-vm@KF_PROJECT.iam.gserviceaccount.com` is your service account, replace the `KF_NAME` and `KF_PROJECT` using the value above  in this pattern, you can get vm service account you have already created in Kubeflow cluster deployment.


#### For Kubeflow Pipelines standalone only

Alternatively, if you are on Kubeflow Pipelines standalone, or AI Platform Pipelines, you can run this command to create node pool:

```
gcloud container node-pools create PREEMPTIBLE_GPU_POOL \
    --cluster=CLUSTER_NAME \
    --enable-autoscaling --max-nodes=MAX_NODES --min-nodes=MIN_NODES \
    --preemptible \
    --node-taints=preemptible=true:NoSchedule \
    --service-account=DEPLOYMENT_NAME-vm@PROJECT_NAME.iam.gserviceaccount.com \
    --accelerator=type=GPU_TYPE,count=GPU_COUNT
```

Below is an example of command:

```
gcloud container node-pools create preemptible-gpu-pool \
    --cluster=user-4-18 \
    --enable-autoscaling --max-nodes=4 --min-nodes=0 \
    --preemptible \
    --node-taints=preemptible=true:NoSchedule \
    --service-account=user-4-18-vm@ml-pipeline-project.iam.gserviceaccount.com \
    --accelerator=type=nvidia-tesla-t4,count=2
```


### 3. Schedule your pipeline to run on the preemptible VMs with preemptible GPUs

In the [DSL code](/docs/components/pipelines/sdk/sdk-overview/) for
your pipeline, add the following to the `ContainerOp` instance:

    .apply(gcp.use_preemptible_nodepool()

The above function works for both methods of generating the `ContainerOp`:

+   The `ContainerOp` generated from 
[`kfp.components.func_to_container_op`](https://github.com/kubeflow/pipelines/blob/sdk/release-1.8/sdk/python/kfp/components/_python_op.py).
+   The `ContainerOp` generated from the task factory function, which is
    loaded by [`components.load_component_from_url`](https://github.com/kubeflow/pipelines/blob/sdk/release-1.8/sdk/python/kfp/components/_components.py).

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

## Debugging

Run the following command if your nodepool didn't show up or has error during provisioning:

```bash
kubectl --context=${MGMTCTXT} --namespace=${KF_PROJECT} describe containernodepool -l kf-name=${KF_NAME}
```


## Next steps

* Explore further options for [customizing Kubeflow on Google Cloud](/docs/gke/).
* See how to [build pipelines with the SDK](/docs/components/pipelines/sdk/).
