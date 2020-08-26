+++
title = "Manipulate Kubernetes Resources as Part of a Pipeline"
description = "Overview of using the SDK to manipulate Kubernetes resources dynamically as steps of the pipeline"
weight = 1350
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

This page describes how to manipulate Kubernetes resources through individual
Kubeflow Pipelines components during a pipeline.
Users may handle any Kubernetes resource, while creating
[Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
and
[Volume Snapshots](https://kubernetes.io/docs/concepts/storage/volume-snapshots/)
is rendered easy in the common case.

## Kubernetes Resources

### ResourceOp

This class represents a step of the pipeline which manipulates Kubernetes resources.
It implements
[Argo's resource template](https://github.com/argoproj/argo/tree/master/examples#kubernetes-resources).

This feature allows users to perform some action (`get`, `create`, `apply`,
`delete`, `replace`, `patch`) on Kubernetes resources.
Users are able to set conditions that denote the success or failure of the
step undertaking that action.

[Link](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ResourceOp)
to the corresponding Python library.

#### Arguments

Only most significant arguments are presented in this section.
For more information, please refer to the aforementioned link to the library.

* `k8s_resource`: Definition of the Kubernetes resource.
  (_required_)
* `action`: Action to be performed (defaults to `create`).
* `merge_strategy`: Merge strategy when action is `patch`.
  (_optional_)
* `success_condition`: Condition to denote success of the step once it is true.
  (_optional_)
* `failure_condition`: Condition to denote failure of the step once it is true.
  (_optional_)
* `attribute_outputs`: Similar to `file_outputs` of
  [`kfp.dsl.ContainerOp`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.ContainerOp).
  Maps output parameter names to JSON paths in the Kubernetes object.
  More on that in the following section.
  (_optional_)

#### Outputs

ResourceOps can produce output parameters.
They can output field values of the resource which is being manipulated.
For example:

```python
job = kubernetes_client.V1Job(...)

rop = kfp.dsl.ResourceOp(
    name="create-job",
    k8s_resource=job,
    action="create",
    attribute_outputs={"name": "{.metadata.name}"}
)
```

By default, ResourceOps output the resource's name as well as the whole resource
specification.

### Samples

For better understanding, please refer to the following samples:
[1](https://github.com/kubeflow/pipelines/blob/master/samples/core/resource_ops/resource_ops.py)

---

## Persistent Volume Claims (PVCs)

Request the creation of PVC instances simple and fast.

### VolumeOp

A ResourceOp specialized in PVC creation.

[Link](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.VolumeOp)
to the corresponding Python library.

#### Arguments

The following arguments are an extension to `ResourceOp` arguments.
If a `k8s_resource` is passed, then none of the following should be provided.

* `resource_name`: The name of the resource which will be created.
  This string will be prepended with the workflow name.
  This may contain `PipelineParam`s.
  (_required_)
* `size`: The requested size for the PVC.
  This may contain `PipelineParam`s.
  (_required_)
* `storage_class`: The storage class to be used.
  This may contain `PipelineParam`s.
  (_optional_)
* `modes`: The `accessModes` of the PVC (defaults to `RWM`).
  Check
  [this documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)
  for further information.
  The user may find the following modes built-in:
    * `VOLUME_MODE_RWO`: `["ReadWriteOnce"]`
    * `VOLUME_MODE_RWM`: `["ReadWriteMany"]`
    * `VOLUME_MODE_ROM`: `["ReadOnlyMany"]`  
* `annotations`: Annotations to be patched in the PVC.
  These may contain `PipelineParam`s.
  (_optional_)
* `data_source`: It is used to create a PVC from a `VolumeSnapshot`.
  It can be either a `string` or a `V1TypedLocalObjectReference`, and may contain
  `PipelineParam`s. (_Alpha feature_, _optional_)

#### Outputs

Additionally to the whole specification of the resource and its name
(`ResourceOp` defaults), a `VolumeOp` also outputs the storage size of the
bounded Persistent Volume (as `step.outputs["size"]`).
However, this may be empty if the storage provisioner has a
`WaitForFirstConsumer` binding mode.
This value, if not empty, is always greater than or equal to the requested size.

#### Useful information

1. `VolumeOp` steps have a `.volume` attribute which is a `PipelineVolume`
   referencing the created PVC.
   More information on Pipeline Volumes in the following section.
2. A `ContainerOp` has a `pvolumes` argument in its constructor.
   This is a dictionary with mount paths as keys and volumes as values and
   functions similarly to `file_outputs` (which can then be used as
   `op.outputs["key"]` or `op.output`).
   For example:

```python
vop = dsl.VolumeOp(
    name="volume_creation",
    resource_name="mypvc",
    size="1Gi"
)
step1 = dsl.ContainerOp(
    name="step1",
    ...
    pvolumes={"/mnt": vop.volume}  # Implies execution after vop
)
step2 = dsl.ContainerOp(
    name="step2",
    ...
    pvolumes={"/data": step1.pvolume,  # Implies execution after step1
              "/mnt": dsl.PipelineVolume(pvc="existing-pvc")}
)
step3 = dsl.ContainerOp(
    name="step3",
    ...
    pvolumes={"/common": step2.pvolumes["/mnt"]}  # Implies execution after step2
)
```

### PipelineVolume

Reference Kubernetes volumes easily, mount them and express dependencies
through them.

A `PipelineVolume` is essentially a Kubernetes `Volume`(\*) carrying
dependencies, supplemented with an `.after()` method extending them.
Those dependencies can then be parsed properly by a `ContainerOp`, when consumed
in `pvolumes` argument or `add_pvolumes()` method, to extend the dependencies
of that step.

[Link](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.PipelineVolume)
to the corresponding Python library.

_(*) Inherits from V1Volume class of Kubernetes Python client._

#### Arguments

`PipelineVolume` constructor accepts all arguments `V1Volume` constructor does.
However, `name` can be omitted and a pseudo-random name for that volume is
generated instead.

Extra arguments:

* `pvc`: Name of an existing PVC to be referenced by this `PipelineVolume`.
  This value can be a `PipelineParam`.
* `volume`: Initialize a new `PipelineVolume` instance from an existing
  `V1Volume`, or its inherited types (e.g. `PipelineVolume`).

### Samples

For better understanding, please refer to the following samples:
[1](https://github.com/kubeflow/pipelines/blob/master/samples/core/volume_ops/volume_ops.py),
[2](https://github.com/kubeflow/pipelines/blob/master/samples/contrib/volume_ops/volumeop_dag.py),
[3](https://github.com/kubeflow/pipelines/blob/master/samples/contrib/volume_ops/volumeop_parallel.py),
[4](https://github.com/kubeflow/pipelines/blob/master/samples/contrib/volume_ops/volumeop_sequential.py)

---

## Volume Snapshots

Request the creation of Volume Snapshot instances simple and fast.

### VolumeSnapshotOp

A ResourceOp specialized in Volume Snapshot creation.

[Link](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.dsl.html#kfp.dsl.VolumeSnapshotOp)
to the corresponding Python library.

**NOTE:** You should check if your Kubernetes cluster admin has Volume Snapshots
enabled in your cluster.

#### Arguments

The following arguments are an extension to the `ResourceOp` arguments.
If a `k8s_resource` is passed, then none of the following may be provided.

* `resource_name`: The name of the resource which will be created.
  This string will be prepended with the workflow name.
  This may contain `PipelineParam`s.
  (_required_)
* `pvc`: The name of the PVC to be snapshotted.
  This may contain `PipelineParam`s.
  (_optional_)
* `snapshot_class`: The snapshot storage class to be used.
  This may contain `PipelineParam`s.
  (_optional_)
* `volume`: An instance of a `V1Volume`, or its inherited type (e.g.
  `PipelineVolume`).
  This may contain `PipelineParam`s.
  (_optional_)
* `annotations`: Annotations to be patched in the `VolumeSnapshot`.
  These may contain `PipelineParam`s.
  (_optional_)

**NOTE:** One of the `pvc` or `volume` needs to be provided.

#### Outputs

Additionally to the whole specification of the resource and its name
(`ResourceOp` defaults), a `VolumeSnapshotOp` also outputs the `restoreSize` of
the bounded `VolumeSnapshot` (as `step.outputs["size"]`).
This is the minimum size for a PVC clone of that snapshot.

#### Useful information

`VolumeSnapshotOp` steps have a `.snapshot` attribute which is a
`V1TypedLocalObjectReference`.
This can be passed as a `data_source` to create a PVC out of that
`VolumeSnapshot`.
The user may otherwise use the `step.outputs["name"]` as `data_source`.

### Samples

For better understanding, please refer to the following samples:
[1](https://github.com/kubeflow/pipelines/blob/master/samples/core/volume_snapshot_ops/volume_snapshot_ops.py),
[2](https://github.com/kubeflow/pipelines/blob/master/samples/contrib/volume_snapshot_ops/volume_snapshotop_rokurl.py)

## Next steps

* See samples in Kubeflow Pipelines 
  [repository](https://github.com/kubeflow/pipelines/tree/master/samples).
  For instance, check these samples of 
  [ResourceOps](https://github.com/kubeflow/pipelines/tree/master/samples/core/resource_ops), 
  [VolumeOps](https://github.com/kubeflow/pipelines/tree/master/samples/core/volume_ops)
  and 
  [VolumeSnapshotOps](https://github.com/kubeflow/pipelines/tree/master/samples/core/volume_snapshot_ops).
* Learn more about the 
  [Kubeflow Pipelines domain-specific language (DSL)](/docs/pipelines/sdk/pipelines-sdk/dsl-overview/),
  a set of Python libraries that you can use to specify ML pipelines.
* For quick iteration, 
  [build components and pipelines](/docs/pipelines/sdk/pipelines-sdk/build-component/).
