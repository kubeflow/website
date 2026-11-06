+++
title = "Running Spark"
description = "Start an interactive Spark session from a Kubeflow Notebook"
weight = 40
+++

[Spark Connect](https://spark.apache.org/docs/latest/spark-connect-overview.html) gives you a Spark session from inside a Notebook without running Spark in the notebook pod. You write PySpark as usual; the [Spark Operator](/docs/components/spark-operator/) runs the driver and executors as separate pods, and only results come back over gRPC.

## Before you start

Your cluster needs the Spark Operator v2.5.0 or later, installed so that Kubeflow's aggregated Spark ClusterRoles are in place — if you are not sure, ask your platform administrator. Beyond that there is nothing to set up: a notebook pod already has permission to create Spark Connect sessions in your own namespace. If the session below fails with a permissions error, that is a platform configuration problem — raise it with your platform administrator.

## Install a matching Spark client

The Spark Connect client in your notebook must match the Spark version of the server the SDK starts. The SDK's `spark` extra and its default server version can differ, so install the SDK, then pin the client to the version the SDK will actually provision:

```shell
pip install --upgrade "kubeflow[spark]" && \
SPARK_VERSION="$(python -c 'from kubeflow.spark.backends.kubernetes import constants; print(constants.DEFAULT_SPARK_VERSION)')" && \
pip install "pyspark-connect==${SPARK_VERSION}"
```

This is the same step the community distribution runs in CI; see [`tests/notebooks_spark_connect_test.sh`](https://github.com/kubeflow/community-distribution/blob/master/tests/notebooks_spark_connect_test.sh).

## Start a session

Create the session with `SparkClient`, then use the `SparkSession` it returns exactly as you would a local one:

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

Pass your own profile namespace: the default is `default`, which is not where your permissions live. The driver creates and watches executor pods, so it runs as a ServiceAccount allowed to do that — `default-editor` has those permissions in a profile namespace.

A session holds its driver and executor pods until you delete it, and it outlives the notebook kernel that created it. Release it when you are done:

```python
spark.stop()
client.delete_session("my-session")
```

`client.list_sessions()` finds sessions you have lost track of.

## A working example

The Kubeflow community distribution runs a Spark Connect session from a notebook on every pull request, against the current SDK and Spark Operator releases. Follow that rather than a copy here — it is kept correct by CI:

- [`tests/spark_connect_session.py`](https://github.com/kubeflow/community-distribution/blob/master/tests/spark_connect_session.py) — the session itself, shared with the Workspaces test
- [`.github/workflows/notebooks_spark_connect_test.yaml`](https://github.com/kubeflow/community-distribution/blob/master/.github/workflows/notebooks_spark_connect_test.yaml) — the cluster it runs against

Some clusters need extra per-session settings. The driver and executors exchange data over their own ports and do not survive a service mesh sidecar, so those pods have to be excluded from injection — an upstream Spark-on-Kubernetes limitation tracked in [SPARK-42411](https://issues.apache.org/jira/browse/SPARK-42411). That is a platform-level decision rather than something to configure per notebook; the linked test shows the current form.

Running Spark from a Kubeflow Workspace works the same way — see [Running Spark](/docs/components/workspaces/user-guides/spark-connect/) in the Workspaces guides, which also covers the one permission change an administrator has to make there.