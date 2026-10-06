---
title: Running Spark
description: Start a Spark Connect session from inside your Workspace
weight: 10
---

{{< workspaces-beta-notice >}}

You can run distributed Spark from a notebook in your Workspace without writing any
Kubernetes manifests. The [Kubeflow SDK](https://sdk.kubeflow.org/en/latest/spark/index.html)
creates the Spark cluster for you and hands back an ordinary PySpark session.

## Before you start

Your administrator has to grant your WorkspaceKind access to Spark first — see the
[operator guide](/docs/components/workspaces/operator-guides/spark-connect/). Confirm it is
done from a Workspace terminal:

```bash
kubectl auth can-i create sparkconnects
```

If this prints `no`, stop here and ask your administrator. Without the permission
`connect()` does not fail immediately; it fails on a multi-minute Spark timeout.

## Install the client

If your Workspace image does not already ship it:

```bash
pip install "kubeflow[spark]"
```

Then pin `pyspark-connect` to the Spark version the SDK will provision. The `spark` extra
installs a `pyspark-connect` release that does not currently match the SDK's
`DEFAULT_SPARK_VERSION`, so this second step is required rather than belt-and-braces:

```bash
SPARK_VERSION="$(python -c \
  'from kubeflow.spark.backends.kubernetes import constants; print(constants.DEFAULT_SPARK_VERSION)')"
pip install "pyspark-connect==${SPARK_VERSION}"
```

## Start a session

```python
from kubeflow.common.types import KubernetesBackendConfig
from kubeflow.spark import Name, PodTemplateOverride, SparkClient

client = SparkClient(backend_config=KubernetesBackendConfig(namespace="my-namespace"))

spark = client.connect(
    options=[
        Name("my-spark-session"),
        PodTemplateOverride(
            role="driver",
            template={
                "metadata": {"labels": {"sidecar.istio.io/inject": "false"}},
                "spec": {"serviceAccountName": "default-editor"},
            },
        ),
        PodTemplateOverride(
            role="executor",
            template={
                "metadata": {"labels": {"sidecar.istio.io/inject": "false"}},
                "spec": {"containers": [{"name": "spark-kubernetes-executor"}]},
            },
        ),
    ]
)
```

The two overrides are not optional. Each one works around something that would otherwise
fail in a way that does not point at its cause:

`serviceAccountName: default-editor` — your Workspace ServiceAccount can create the
`SparkConnect` resource, but the driver pod separately creates and watches its own executor
pods, which that role does not cover. Without this, executors never appear.

`sidecar.istio.io/inject: "false"` — the driver and executors exchange data on ports 7078
and 7079, and that traffic does not survive the service mesh. Executors register with the
driver, then fail fetching broadcast blocks, so tasks hang rather than error.

`containers: [{"name": "spark-kubernetes-executor"}]` — Spark submits with
`executor.podTemplateContainerName=spark-kubernetes-executor` and looks the container up by
name, so the template must declare it even though the operator supplies the image.

## Run a query

From here it is ordinary PySpark:

```python
rows = (
    spark.range(0, 100_000, numPartitions=4)
    .selectExpr("id % 8 AS bucket")
    .groupBy("bucket")
    .count()
    .collect()
)
```

## Shut the session down

The Spark cluster holds resources until you delete it:

```python
spark.stop()
client.delete_session("my-spark-session")
```

## Troubleshooting

**`connect()` hangs, then times out.** Usually RBAC. Run the
`kubectl auth can-i create sparkconnects` check above.

**The session connects but no executors appear.** The driver override is missing or the
driver ServiceAccount lacks pod permissions.

**Executors start, register, then tasks hang.** Istio. Check that both pod templates carry
the `sidecar.istio.io/inject: "false"` label. Excluding ports 7078 and 7079 individually is
not enough — the pods have to leave the mesh.

**The driver exits with status 1.** Check the executor container is named exactly
`spark-kubernetes-executor`.

**Protocol errors on a session that started cleanly.** Client and server Spark versions have
drifted. Compare `pyspark.__version__` against `spark.version` and re-pin.

## Reference

A complete working example runs in CI as the Workspaces Spark Connect test in
[`kubeflow/community-distribution`](https://github.com/kubeflow/community-distribution/tree/master/tests)
(`spark_connect_from_workspace.py`).
