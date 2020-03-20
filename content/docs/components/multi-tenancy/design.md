+++
title = "Design for Multi-user Isolation"
description = "In-depth design for supporting multi-user isolation"
weight = 20
+++

{{% stable-status %}}

## Design overview

Kubeflow multi-tenancy is currently built around *user namespaces*.
Specifically, Kubeflow defines user-specific namespaces and uses Kubernetes
[role-based access control (RBAC) policies](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
to manage user access.

This feature enables users to share access to their workspaces.
Workspace owners can share/revoke workspace access with other users through the 
Kubeflow UI.
After being invited, users have permissions to edit the workspace and operate 
Kubeflow custom resources.

Kubeflow multi-tenancy is self-served - a new user can self-register to create and own
their workspace through the UI.

Kubeflow uses Istio to control in-cluster traffic. By default, requests to user
workspaces are denied unless allowed by Istio RBAC. In-bound user requests are
identified using an identity provider (for example, Identity Aware Proxy (IAP) on
Google Cloud or Dex for on-premises deployments), and then validated by Istio RBAC rules.

Internally, Kubeflow uses the *Profile* custom resource to control all policies, roles, and bindings involved,
and to guarantee consistency. Kubeflow also offers a plugin interface to manage external resource/policy outside Kubernetes,
for example interfacing with Amazon Web Services APIs for identity management.

The following diagram illustrates a Kubeflow multi-tenancy cluster with two user-access routes:
via the Kubeflow central dashboard and via the kubectl command-line interface (CLI).

<img src="/docs/images/multi-tenancy-cluster.png"
  alt="multi tenancy cluster "
  class="mt-3 mb-3 border border-info rounded">

## Feature requirements
- Kubeflow uses [Istio](https://istio.io/) to apply access control over in-cluster traffic.
- Kubeflow profile controller needs `cluster admin` permission.
- Kubeflow UI needs to be served behind an identity aware proxy. The identity aware proxy and Kubernetes
master should share the same identity management.
- The Kubeflow installation on Google Cloud uses [GKE](https://cloud.google.com/kubernetes-engine) and [IAP](https://cloud.google.com/iap/docs/concepts-overview).
- On-premises installations of Kubeflow make use of [Dex](https://github.com/dexidp/dex), a flexible OpenID Connect (OIDC) provider.

## Supported platforms
* Kubeflow multi-tenancy is enabled by default if you deploy Kubeflow on GCP with [IAP](/docs/gke/deploy).
* If you are not on GCP, you can deploy multi-tenancy to [your existing cluster](/docs/started/k8s/kfctl-istio-dex/).

## Next steps

* Learn [how to use multi-user isolation and profiles](/docs/components/multi-tenancy/getting-started/).
* Read more about [Istio in Kubeflow](/docs/other-guides/istio-in-kubeflow/).
