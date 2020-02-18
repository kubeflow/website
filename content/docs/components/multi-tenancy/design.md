+++
title = "Design for Multi-user Isolation"
description = "In-depth design for supporting multi-user isolation"
weight = 20
+++

{{% stable-status %}}

## Design overview

Kubeflow multi-tenancy is currently built around *user namespaces*.
Specifically, we define user-specific namespaces and utilize Kubernetes
[RBAC policies](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
to manage user access.

This feature enables users to share access to their workspaces.
Workspace owners can share/revoke workspace access with other users through Kubeflow UI.
Once invited, users will have permissions to edit the workspace and operate kubeflow custom
resources.

Kubeflow multi-tenancy is self-served - new user can self-register to create and own
their workspace through the UI.

We leverage Istio to control in-cluster traffic. By default, requests to user
workspaces are denied unless allowed by Istio RBAC. In-bound user requests are
identified using an identity provider (for example, Identity Aware Proxy (IAP) on
Google Cloud or Dex for on-premises deployments), and then validated by Istio RBAC rules.

Internall, we use the *Profile* custom resource to control all policies, roles, and bindings involved,
and to guarantee consistency. We also offer a plugin interface to manage external resource/policy outside Kubernetes,
for example accessing control of public cloud APIs.

The following diagram illustrates a Kubeflow multi-tenancy cluster with two user-access routes:
via the Kubeflow central dashboard and via the kubectl command-line interface (CLI).

<img src="/docs/images/multi-tenancy-cluster.png"
  alt="multi tenancy cluster "
  class="mt-3 mb-3 border border-info rounded">

## Feature Requirements
- Kubeflow uses [Istio](https://istio.io/) to apply access control over in-cluster traffic.
- Kubeflow profile controller needs `Cluster admin` permission.
- Kubeflow UI needs to be served behind an identity aware proxy, the identity aware proxy and k8s
master should share the same identity management.
- The Kubeflow installation on Google Cloud uses [GKE](https://cloud.google.com/kubernetes-engine) and [IAP](https://cloud.google.com/iap/docs/concepts-overview).
- On-prem installations of Kubeflow make use of [Dex](https://github.com/dexidp/dex), a flexible OIDC provider.

## Supported Platforms
* Kubeflow multi-tenancy is enabled by default if you deploy Kubeflow on GCP with [IAP](/docs/gke/deploy)
* If you are not on GCP, you can deploy multi-tenancy to [your existing cluster](/docs/started/k8s/kfctl-existing-arrikto/)

## Next steps

* Learn [how to use multi-user isolation and profiles](/docs/components/multi-tenancy/getting-started/).
* Read more about [Istio in Kubeflow](/docs/other-guides/istio-in-kubeflow/).
