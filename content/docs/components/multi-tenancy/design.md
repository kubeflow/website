+++
title = "Design for Multi-user Isolation"
description = "In-depth design for supporting multi-user isolation"
weight = 20
+++

{{% stable-status %}}

## Design overview

Kubeflow multi-tenancy implementation currently follows:

- Define user workspace as namespace and build access control around it
  * Manage user access to namespace through k8s rbac policy.
- Leverage Istio to control in-cluster traffic
  * By default requests to user workspaces are denied unless allowed by Istio Rbac
- Leverage Identity Provider and Istio to control traffic through ingress
  * Identity user request through Identity Provider.
  * Istio then do rbac check on request target workspace and identity
- Enable workspace access sharing & revoke
  * Workspace owners can share/revoke workspace access with other users through kubeflow UI
  * Invited users will have k8s edit permission plus permission to operate kubeflow CRs
- Self-serve
  * New user can self-register to create and own their workspace through kubeflow UI
- Kubeflow Profile CR to control all policies, roles and bindings involved and guarantee consistency.
  * Offer plugin interface to manage external resource/policy outside k8s, eg. access control of public cloud APIs

Kubeflow multi-tenancy cluster:

<img src="/docs/images/multi-tenancy-cluster.png"
  alt="multi tenancy cluster "
  class="mt-3 mb-3 border border-info rounded">

### Prerequisite and supported platforms

#### Prerequisite
- Kubeflow use [Istio](https://istio.io/) to apply access control over in-cluster traffics.
- Kubeflow profile controller need `Cluster admin` permission.
- Kubeflow UI need to be served behind an identity aware proxy, the identity aware proxy and k8s
master should share the same identity management.
  * On GCP we use [GKE](https://cloud.google.com/kubernetes-engine) + [IAP](https://cloud.google.com/iap/docs/concepts-overview)
  * For on-prem installations, we make use of [Dex](https://github.com/dexidp/dex), a flexible OIDC provider.

#### supported platform
* kubeflow multi-tenancy is enabled by default if you [deploy kuebflow on GCP with IAP](/docs/gke/deploy)
* Not on GCP? [deploy to your existing cluster](/docs/started/k8s/kfctl-existing-arrikto/)








