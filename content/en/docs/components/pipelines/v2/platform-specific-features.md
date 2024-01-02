+++
title = "Platform-specific Features"
description = "Author tasks with platform-specific functionality"
weight = 12
+++


One of the benefits of KFP is cross-platform portability. The KFP SDK compiles pipeline definitions to [IR YAML][ir-yaml] which can be read and executed by different backends, including the [Kubeflow Pipelines open source backend][oss-be] and [Vertex AI Pipelines](https://cloud.google.com/vertex-ai/docs/pipelines/introduction).

For cases where features are not portable across platforms, users may author pipelines with platform-specific functionality via KFP SDK platform-specific plugin libraries.

In general, platform-specific plugin libraries provide functions that act on tasks similarly to [task-level configuration methods][task-level-config-methods] provided by the KFP SDK directly. Platform-specific plugin libraries may also provide pre-baked components.



<!-- TODO: add docs on how to create a platform-specific authoring library -->

## Example: Read/write to a Kubernetes PVC using kfp-kubernetes
Currently the only KFP SDK platform-specific plugin library is [`kfp-kubernetes`][kfp-kubernetes-pypi], which is supported by the [Kubeflow Pipelines open source backend][oss-be] and enables direct access to some Kubernetes resources and functionality.

The following uses `kfp-kubernetes` to demonstrate typical usage of a plugin library. Specifically, we will use `kfp-kubernetes` to create a [PersistentVolumeClaim (PVC)][persistent-volume], use the PVC to pass data between tasks, and delete the PVC after using it. See the [`kfp-kubernetes` documentation for more information][kfp-kubernetes-docs].

The following assumes basic familiarity with [PersistentVolume and PersistentVolumeClaim][persistent-volume] concepts in Kubernetes, [authoring components][authoring-components], and [authoring pipelines][authoring-pipelines].

### Step 1: Install the platform-specific plugin library with the KFP SDK

```sh
pip install kfp[kubernetes]
```

### Step 2: Create components that read/write to the mount path

Create two simple components that read and write to a file. In a later step, we will mount the associated volume to the `/data` directory.

```python
from kfp import dsl

@dsl.component
def producer() -> str:
    with open('/data/file.txt', 'w') as file:
        file.write('Hello world')
    with open('/data/file.txt', 'r') as file:
        content = file.read()
    print(content)
    return content

@dsl.component
def consumer() -> str:
    with open('/data/file.txt', 'r') as file:
        content = file.read()
    print(content)
    return content
```

### Step 3: Dynamically provision a PVC using CreatePVC

Now that we have our components, we can begin constructing a pipeline. First, we need a PVC to mount. We'll use the `kubernetes.CreatePVC` pre-baked component to dynamically provision a PVC.

```python
@dsl.pipeline
def my_pipeline():
    pvc1 = kubernetes.CreatePVC(
        # can also use pvc_name instead of pvc_name_suffix to use a pre-existing PVC
        pvc_name_suffix='-my-pvc',
        access_modes=['ReadWriteMany'],
        size='5Gi',
        storage_class_name='standard',
    )
```

This component provisions a 5GB PVC from the [StorageClass][storage-class] `'standard'` with the `ReadWriteMany` [access mode][access-mode]. The PVC will be named after the underlying Argo workflow that creates it, concatenated with the suffix `-my-pvc`. The `CreatePVC` component returns this name as the output `'name'`.


### Step 4: Read and write data to the PVC

Next, we'll use the `mount_pvc` task modifier with the `producer` and `consumer` components. We'll also schedule `task2` to run after `task1` to prevent the components from writing and reading to the PVC at the same time.

```python
    # write to the PVC
    task1 = producer()
    kubernetes.mount_pvc(
        task1,
        pvc_name=pvc1.outputs['name'],
        mount_path='/data',
    )

    # read to the PVC
    task2 = consumer()
    kubernetes.mount_pvc(
        task2,
        pvc_name=pvc1.outputs['name'],
        mount_path='/reused_data',
    )
    task2.after(task1)
```

### Step 5: Delete the PVC

Finally, we can schedule deletion of the PVC after `task2` finishes to clean up the Kubernetes resources we created.

```python
    delete_pvc1 = kubernetes.DeletePVC(
        pvc_name=pvc1.outputs['name']).after(task2)
```

For the full pipeline and more information, see a [similar example][full-example] in the [`kfp-kubernetes` documentation][kfp-kubernetes-docs].


[ir-yaml]: /docs/components/pipelines/v2/compile-a-pipeline#ir-yaml
[oss-be]: /docs/components/pipelines/v2/installation/
[kfp-kubernetes-pypi]: https://pypi.org/project/kfp-kubernetes/
[task-level-config-methods]: /docs/components/pipelines/v2/pipelines/pipeline-basics/#task-configurations
[kfp-kubernetes-docs]: https://kfp-kubernetes.readthedocs.io/
[persistent-volume]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[storage-class]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[access-mode]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[full-example]: https://kfp-kubernetes.readthedocs.io/en/kfp-kubernetes-0.0.1/#persistentvolumeclaim-dynamically-create-pvc-mount-then-delete
[authoring-components]: http://localhost:1313/docs/components/pipelines/v2/components/
[authoring-pipelines]: http://localhost:1313/docs/components/pipelines/v2/pipelines/
