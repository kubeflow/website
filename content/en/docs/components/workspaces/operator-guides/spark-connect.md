---
title: Spark Connect
description: Configure Kubeflow Workspaces to run interactive Spark sessions
weight: 30
---

[Spark Connect](https://spark.apache.org/docs/latest/spark-connect-overview.html) lets a
Workspace user hold a Spark session without a Spark runtime in the Workspace pod: the
[Spark Operator](/docs/components/spark-operator/) runs the driver and executors as
separate pods. This page covers what a platform administrator puts in place. The
user-facing side is [Running Spark](/docs/components/workspaces/user-guides/running-spark/).

## Prerequisites

The cluster needs the [Spark Operator](/docs/components/spark-operator/) v2.5.0 or later.
It provides the `SparkConnect` custom resource and the controller that acts on it;
granting the permissions below does not install either, and earlier versions do not
handle the session shape these guides use.

We recommend installing the Spark Operator from the Kubeflow Community Distribution
rather than its upstream Helm chart: the distribution also ships the aggregated
`kubeflow-spark-*` ClusterRoles that the grant below relies on, and the operator's own
chart does not.

## Grant the Workspace access to Spark

A Workspace runs as its own ServiceAccount, which the controller creates and names after
the Workspace. That ServiceAccount is no longer granted the `kubeflow-edit` ClusterRole
automatically, so a WorkspaceKind whose users need Spark needs these roles to be
explicitly added to its definition:

```yaml
apiVersion: kubeflow.org/v1beta1
kind: WorkspaceKind
spec:
  podTemplate:
    serviceAccount:
      clusterRoles:
        - name: "kubeflow-edit"
```

`kubeflow-edit` is what a Kubeflow Profile binds to `default-editor`, so a Workspace user
ends up with the same permissions as a Notebook user, and the Spark rules come with it —
`kubeflow-spark-edit` aggregates into `kubeflow-edit`. To verify, create a Workspace from
this kind, open a terminal in it, and run:

```shell
kubectl auth can-i create sparkconnects
```

Run from inside the Workspace, this tests the Workspace's own ServiceAccount. Run from
an administrator's own kubeconfig it tests your permissions instead, and will pass
whether or not the grant worked.

## Service mesh

Spark's driver and executors talk to each other over their own RPC and block-manager
ports, and the client reaches the server over gRPC. None of that survives an Istio
sidecar: executors register with the driver and then fail to fetch broadcast blocks, so
tasks hang rather than fail outright. This is an upstream Spark-on-Kubernetes limitation,
tracked in [SPARK-42411](https://issues.apache.org/jira/browse/SPARK-42411).

Until that is resolved, Spark driver and executor pods have to be kept out of the mesh,
and that belongs with the platform rather than with each session.

The Spark Operator labels every pod it launches with
`sparkoperator.k8s.io/launched-by-spark-operator: "true"`, on the driver and the
executors alike, so one cluster-wide exemption covers all Spark workloads. With Istio,
add that label to the sidecar injector's
[`neverInjectSelector`](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#controlling-the-injection-policy),
which the Kubeflow Community Distribution ships with an empty value by default.

Without an exemption, a namespace with automatic injection leaves Spark pods in the mesh
and distributed queries hang rather than fail. Sessions can also opt out individually —
[`tests/spark_connect_session.py`](https://github.com/kubeflow/community-distribution/blob/master/tests/spark_connect_session.py)
does this — but that puts an infrastructure concern in front of the user, so prefer the
cluster-wide exemption.

## Reference deployment

Rather than reproducing the configuration here, where it could potentially drift, feel
free to take inspiration from the setup as showcased in the test suite of the Kubeflow
Community Distribution: Spark Operator, Workspaces, a WorkspaceKind with the Spark grant,
and a session created from inside the Workspace pod:

- **Cluster setup and install order**:
  [`.github/workflows/workspaces_spark_connect_test.yaml`](https://github.com/kubeflow/community-distribution/blob/master/.github/workflows/workspaces_spark_connect_test.yaml)
- **Example WorkspaceKind with Spark permissions**:
  [`tests/workspacekind.spark.test.yaml`](https://github.com/kubeflow/community-distribution/blob/master/tests/workspacekind.spark.test.yaml)
- **Example session code and Istio mesh exclusion**:
  [`tests/spark_connect_session.py`](https://github.com/kubeflow/community-distribution/blob/master/tests/spark_connect_session.py)
