---
title: Spark Connect
description: Let Workspace users run interactive Spark sessions
weight: 30
---

{{< workspaces-beta-notice >}}

[Spark Connect](https://spark.apache.org/docs/latest/spark-connect-overview.html) lets a
Workspace user hold a Spark session without a Spark runtime in the Workspace pod: the
[Spark Operator](/docs/components/spark-operator/) runs the driver and executors as
separate pods. This page covers what a platform administrator puts in place. The
user-facing side is [Running Spark](/docs/components/workspaces/user-guides/spark-connect/).

## Grant the Workspace access to Spark

A Workspace runs as its own ServiceAccount, `ws-{WORKSPACE_NAME}`. As of Workspaces
v2.0.0-beta.0 that ServiceAccount is no longer granted the Kubeflow ClusterRoles
automatically, so a WorkspaceKind whose users need Spark has to ask for the grant:

```yaml
apiVersion: kubeflow.org/v1beta1
kind: WorkspaceKind
spec:
  podTemplate:
    serviceAccount:
      clusterRoles:
        - name: "kubeflow-spark-edit"
```

Bind `kubeflow-spark-edit` rather than the much broader `kubeflow-edit`: it carries only
the Spark resources. Verify after applying:

```shell
kubectl auth can-i create sparkconnects \
  --as="system:serviceaccount:${PROFILE}:ws-${WORKSPACE_NAME}" \
  -n "${PROFILE}"
```

## Service mesh

Spark's driver and executors talk to each other over their own RPC and block-manager
ports, and the client reaches the server over gRPC. None of that survives an Istio
sidecar: executors register with the driver and then fail to fetch broadcast blocks, so
tasks hang rather than fail outright. This is an upstream Spark-on-Kubernetes limitation,
tracked in [SPARK-42411](https://issues.apache.org/jira/browse/SPARK-42411).

Until that is resolved, Spark driver and executor pods have to be kept out of the mesh.
Keep that decision with the platform: it is cluster-wide policy, not something to ask a
notebook user to configure per session.

## Reference deployment

Rather than reproducing the configuration here, where it would drift, read the setup the
Kubeflow community distribution keeps green in CI — Spark Operator, Workspaces, a
WorkspaceKind with the Spark grant, and a session created from inside the Workspace pod:

- [`.github/workflows/workspaces_spark_connect_test.yaml`](https://github.com/kubeflow/community-distribution/blob/master/.github/workflows/workspaces_spark_connect_test.yaml)
  — the cluster and the install order
- [`tests/workspacekind.spark.test.yaml`](https://github.com/kubeflow/community-distribution/blob/master/tests/workspacekind.spark.test.yaml)
  — a WorkspaceKind with the Spark grant
- [`tests/spark_connect_from_workspace.py`](https://github.com/kubeflow/community-distribution/blob/master/tests/spark_connect_from_workspace.py)
  — the session, including the current form of the mesh exclusion