---
title: Enabling Spark
description: How to let Workspace users start Spark Connect sessions
weight: 20
---

{{< workspaces-beta-notice >}}

This guide is for platform administrators. It covers the one change you must make so that
Workspace users can start a Spark Connect session with the
[Kubeflow SDK](https://sdk.kubeflow.org/en/latest/spark/index.html).

Everything else is configured by the user at session creation time — see the
[user guide](/docs/components/workspaces/user-guides/spark-connect/).

## Prerequisites

- Kubeflow Workspaces `{{% kf-workspaces-version %}}` or later
- [Kubeflow Spark Operator](https://spark.kubeflow.org/) with the `SparkConnect` CRD
  installed and the operator watching your user namespaces
- The aggregated `kubeflow-spark-edit` ClusterRole present in the cluster

## Grant the Workspace access to Spark

Each Workspace runs under its own ServiceAccount, `ws-{WORKSPACE_NAME}`.

Since Workspaces `v2.0.0-beta.0` this ServiceAccount **no longer inherits the Kubeflow
ClusterRoles** the way the old shared `default-editor` did. Until you grant it explicitly,
a Workspace cannot create `SparkConnect` resources.

Bind the Spark role on the WorkspaceKind:

```yaml
spec:
  podTemplate:
    serviceAccount:
      clusterRoles:
        # create/get/list/delete sparkconnects and sparkapplications
        - name: "kubeflow-spark-edit"
```

Bind `kubeflow-spark-edit`, not `kubeflow-edit`. The Spark role grants only what is needed
to manage `SparkApplication` and `SparkConnect` resources; `kubeflow-edit` is far broader
and reintroduces exactly the permissions the per-Workspace ServiceAccount change removed.

That is the only WorkspaceKind change required.

## Verify

```bash
kubectl auth can-i create sparkconnects \
  --as="system:serviceaccount:${NAMESPACE}:ws-${WORKSPACE_NAME}" \
  -n "${NAMESPACE}"
```

If this returns `no`, fix the binding before users try to connect. Without the permission
`connect()` does not fail fast — it fails on a multi-minute Spark timeout, well away from
the actual cause.

## What users still have to configure

Three settings are supplied by the user in the `connect()` call rather than by you, because
they apply per session. They are documented in the
[user guide](/docs/components/workspaces/user-guides/spark-connect/), but they are worth
knowing about when a user reports a broken session:

**The driver needs a different ServiceAccount.** `kubeflow-spark-edit` lets the Workspace
create the `SparkConnect` resource, but the Spark driver pod separately creates and watches
its own executor pods. That is not covered by the Spark role, so the driver runs as
`default-editor`.

**Spark pods must leave the Istio mesh.** The driver and executors exchange data on ports
7078 and 7079. Executors register with the driver and then fail fetching broadcast blocks,
so tasks never complete. Both pods set `sidecar.istio.io/inject: "false"`.

**The executor container must be named `spark-kubernetes-executor`.** Spark submits with
`executor.podTemplateContainerName=spark-kubernetes-executor` and looks the container up by
that name, so a template must declare it even though the operator supplies the image.

## Image requirements

The Workspace image needs the Kubeflow SDK with its `spark` extra (`kubeflow[spark]`), plus
a `pyspark-connect` release matching the Spark version the SDK provisions, which it exposes
as `kubeflow.spark.backends.kubernetes.constants.DEFAULT_SPARK_VERSION`.

Installing the extra alone is not enough: it pins a `pyspark-connect` release that does not
currently match that constant. Build images against the constant rather than relying on the
extra or choosing a Spark version independently — a mismatch surfaces as an opaque protocol
error rather than a version complaint.

## Reference

The end-to-end setup is exercised in CI by the Workspaces Spark Connect test in
[`kubeflow/community-distribution`](https://github.com/kubeflow/community-distribution/tree/master/tests):
`workspaces_spark_connect_test.sh`, `workspacekind.spark.test.yaml`, and
`spark_connect_from_workspace.py`. That test is the authoritative working example.
