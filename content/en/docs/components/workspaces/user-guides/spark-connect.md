---
title: Running Spark
description: Start an interactive Spark session from a Workspace
weight: 10
---

{{< workspaces-beta-notice >}}

[Spark Connect](https://spark.apache.org/docs/latest/spark-connect-overview.html) gives you
a Spark session from inside a Workspace without running Spark in the Workspace pod. You
write PySpark as usual; the [Spark Operator](/docs/components/spark-operator/) runs the
driver and executors as separate pods, and only results come back over gRPC.

## Before you start

Your cluster needs the Spark Operator v2.5.0 or later. If you are not sure, ask your
platform administrator.

Your Workspace needs permission to create Spark Connect sessions in your namespace. A
platform administrator grants this on the WorkspaceKind — see
[Spark Connect](/docs/components/workspaces/operator-guides/spark-connect/) in the
operator guides. From a terminal in your Workspace:

```shell
kubectl auth can-i create sparkconnects
```

If that prints `no`, stop here and ask your administrator.

## Install a matching Spark client

The Spark Connect client in your Workspace must match the Spark version of the server
the SDK starts. The SDK's `spark` extra and its default server version can differ, so
install the SDK, then pin the client to the version the SDK will actually provision:

```shell
pip install --upgrade "kubeflow[spark]" && \
SPARK_VERSION="$(python -c 'from kubeflow.spark.backends.kubernetes import constants; print(constants.DEFAULT_SPARK_VERSION)')" && \
pip install "pyspark-connect==${SPARK_VERSION}"
```

This is the same step the community distribution runs in CI; see
[`tests/workspaces_spark_connect_test.sh`](https://github.com/kubeflow/community-distribution/blob/master/tests/workspaces_spark_connect_test.sh).

## Start a session

Create the session with `SparkClient`, then use the `SparkSession` it returns exactly as
you would a local one:

```python
from kubeflow.common.types import KubernetesBackendConfig
from kubeflow.spark import Driver, Name, SparkClient

client = SparkClient(backend_config=KubernetesBackendConfig(namespace="my-namespace"))

spark = client.connect(
    options=[Name("my-session")],
    driver=Driver(service_account="default-editor"),
)

print(spark.version, spark.range(5).count())
```

Pass your own profile namespace: the default is `default`, which is not where your
permissions live. The driver runs as a ServiceAccount allowed to create executor pods —
`default-editor` has those permissions in a Kubeflow profile namespace.

A session holds its driver and executor pods until you delete it, and it outlives the
notebook kernel that created it. Release it when you are done:

```python
spark.stop()
client.delete_session("my-session")
```

`client.list_sessions()` finds sessions you have lost track of.

## A working example

The Kubeflow community distribution runs a Spark Connect session from a Workspace on
every pull request, against the current SDK and Spark Operator releases. Follow that
rather than a copy here — it is kept correct by CI:

- [`tests/spark_connect_session.py`](https://github.com/kubeflow/community-distribution/blob/master/tests/spark_connect_session.py)
  — the session itself
- [`.github/workflows/workspaces_spark_connect_test.yaml`](https://github.com/kubeflow/community-distribution/blob/master/.github/workflows/workspaces_spark_connect_test.yaml)
  — the cluster it runs against

Some clusters need extra per-session settings, such as keeping the Spark pods out of the
service mesh. Those are platform concerns rather than things to configure per session;
the test shows the current form, and the
[operator guide](/docs/components/workspaces/operator-guides/spark-connect/) explains why
they exist.