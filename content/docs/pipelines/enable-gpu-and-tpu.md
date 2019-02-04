+++ 
title = "Enable GPU and TPU for Kubeflow Pipelines on GKE"
description = "Enable GPU and TPU for Kubeflow Pipelines on Google Kubernetes Engine."
weight = 6 
+++

This page is for advanced users. It describes how to enable GPU or TPU for the pipeline on GKE by using the Pipelines 
DSL language.

## Prerequisites

To enable GPU and TPU on Kubeflow cluster, please follow the instructions on how to 
[customize](/docs/gke/customizing-gke#common-customizations) the GKE cluster for Kubeflow before
setting up the cluster.

## Configure ContainerOp to consume GPUs

After enabling GPU, Kubeflow setup script installs a default GPU pool with type nvidia-tesla-k80 with auto-scaling enabled.
The following code consumes 2 GPUs in a ContainerOp.

```python
gpu_op = ContainerOp(name='gpu-op', ...).set_gpu_limit(2)
```

The code above will be compiled into Kubernetes Pod spec:

```yaml
container:
  ...
  resources:
    limits:
      nvidia.com/gpu: "2"
```

If the cluster has multiple node pools with different GPU types, you can specify the GPU type by the following code.

```python
gpu_op = ContainerOp(name='gpu-op', ...).set_gpu_limit(2)
gpu_op.add_node_selector_constraint('cloud.google.com/gke-accelerator', 'nvidia-tesla-p4')
```

The code above will be compiled into Kubernetes Pod spec:


```yaml
container:
  ...
  resources:
    limits:
      nvidia.com/gpu: "2"
nodeSelector:
  cloud.google.com/gke-accelerator: nvidia-tesla-p4
```

Check [GKE GPU guide](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus) to learn more about GPU settings, 

## Configure ContainerOp to consume TPUs

Use the following code to configure ContainerOp to consumer TPUs on GKE:

```python
tpu_op = ContainerOp(name='tpu-op', ...).apply(gcp.use_tpu(tpu_cores = 8, tpu_resource = 'v2', tf_version = '1.12'))
```

The above code uses 8 v2 TPUs with TF version to be 1.12. The code above will be compiled into Kubernetes Pod spec:

```yaml
container:
  ...
  resources:
    limits:
      cloud-tpus.google.com/v2: "8"
  metadata:
    annotations:
      tf-version.cloud-tpus.google.com: "1.12"
```

See [GKE TPU Guide](https://cloud.google.com/tpu/docs/kubernetes-engine-setup) to learn more about TPU settings.
