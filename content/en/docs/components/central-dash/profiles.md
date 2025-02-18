+++
title = "Profiles and Namespaces"
description = "About Kubeflow Profiles and Namespaces for multi-user isolation"
weight = 20
+++

## What is a Kubeflow Profile?

A Kubeflow Profile is a [Kubernetes CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions) introduced by Kubeflow that wraps a Kubernetes [Namespace](https://kubernetes.io/docs/tasks/administer-cluster/namespaces-walkthrough/). Profile are owned by a single user, and can have multiple contributors with view or modify access. The owner of a profile can add and remove contributors (this can also be done by the cluster administrator).
Profiles and their child Namespaces are reconciled by the [Kubeflow Profile Controller](https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller) and contributors (not owners) are managed by the [Kubeflow Access Management API (KFAM)](https://github.com/kubeflow/kubeflow/tree/master/components/access-management).


## Profiles in the Central Dashboard

Select the active profile with the drop-down found in the top bar of Kubeflow Central Dashboard.
Most Kubeflow components use the active profile to determine which resources to display, and what permissions to grant.

Users can only see profiles to which they have owner, contributor (read + write), or viewer (read) access.

<img src="/docs/images/dashboard/homepage-profile-selector.png" 
     alt="Kubeflow Central Dashboard - Profile Selector" 
     class="mt-3 mb-3 border border-info rounded">
</img>

## Automatic Profile Creation

Kubeflow supports automatic profile creation for users who log into Kubeflow for the first time.

The `CD_REGISTRATION_FLOW` environment variable on the central-dashboard Deployment controls whether automatic profile creation is enabled.
By default, automatic profile creation is disabled.
When `CD_REGISTRATION_FLOW` is `true`, if a user logs into Kubeflow, and is not already a profile owner, they will be prompted to create a profile.

{{% alert title="Warning" color="warning" %}}
Automatic profile creation may not be suitable for all use cases.
<br>
Users become owners of the automatically created profile, so can add/remove contributors.

Cluster administrators may choose to disable automatic profile creation and [manually create profiles](#create-a-profile) for users and/or teams.
Typically, in these cases, users are only given view or modify access to profiles (not made owners).
{{% /alert %}}

Here is an example of the automatic profile creation flow:

1. A new user logs into Kubeflow for the first time:

<img src="/docs/images/dashboard/auto-profile-step-1.png"
     alt="Kubeflow Central Dashboard - Automatic Profile Creation - Step 1"
     class="mt-3 mb-3 border border-info rounded"
     style="width: 100%; max-width: 30em">
</img>

2. The user can name their profile and click *Finish*: 

<img src="/docs/images/dashboard/auto-profile-step-2.png"
     alt="Kubeflow Central Dashboard - Automatic Profile Creation - Step 2"
     class="mt-3 mb-3 border border-info rounded"
     style="width: 100%; max-width: 30em">
</img>

## Profile Resources

The following resources are created for each profile:

- A Kubernetes Namespace that shares the same name as the profile.
- Kubernetes [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) for Users:
    - For profile owner, a `RoleBinding` named `namespaceAdmin` to `ClusterRole/kubeflow-admin`
    - For each contributor, a `RoleBinding` named `user-{EMAIL}-clusterrole-{ROLE}` to `ClusterRole/kubeflow-{ROLE}`
       - `{EMAIL}` is the email of the contributor, special characters replaced with `-`, cast to lowercase.
       - `{ROLE}` is the role of the contributor, either `edit` or `view`
- Kubernetes [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) for ServiceAccounts:
    - For `ServiceAcount/default-editor`, a `RoleBinding` named `default-editor` to `ClusterRole/kubeflow-edit`
    - For `ServiceAcount/default-viewer`, a `RoleBinding` named `default-viewer` to `ClusterRole/kubeflow-view`
- Istio [AuthorizationPolicies](https://istio.io/latest/docs/reference/config/security/authorization-policy/):
    - For the profile owner, an `AuthorizationPolicy` named `ns-owner-access-istio`
    - For each contributor, an `AuthorizationPolicy` named `user-{EMAIL}-clusterrole-{ROLE}`
       - `{EMAIL}` is the email of the contributor, special characters replaced with `-`, cast to lowercase
       - `{ROLE}` is the role of the contributor, either `edit` or `view`

## Manage Profiles 

Because a Profile is a Kubernetes CRD, a cluster administrator can use `kubectl` commands to manage profiles.

### Create a Profile

A cluster administrator can create a new profile with `kubectl` commands.

First, create a file named `my-profile.yaml` with the following structure:

```yaml
apiVersion: kubeflow.org/v1
kind: Profile
metadata:
  ## the profile name will be the namespace name
  ## WARNING: unexpected behavior may occur if the namespace already exists
  name: my-profile
spec:
  ## the owner of the profile
  ## NOTE: you may wish to make a global super-admin the owner of all profiles
  ##       and only give end-users view or modify access to profiles to prevent
  ##       them from adding/removing contributors
  owner:
    kind: User
    name: admin@example.com

  ## plugins extend the functionality of the profile
  ## https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller#plugins
  plugins: []
  
  ## optionally create a ResourceQuota for the profile
  ## https://github.com/kubeflow/kubeflow/tree/master/components/profile-controller#resourcequotaspec
  ## https://kubernetes.io/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/#ResourceQuotaSpec
  resourceQuotaSpec: {}
```

Next, run the following command to create the profile:

```bash
kubectl apply -f my-profile.yaml
```

### List all Profiles

A cluster administrator can list existing profiles using the following command:

```bash
kubectl get profiles
```

### Describe a Profile

A cluster administrator can describe a specific profile using the following command:

```bash
kubectl describe profile MY_PROFILE_NAME
```

### Delete a Profile

A cluster administrator can delete an existing profile using the following command:

```bash
kubectl delete profile MY_PROFILE_NAME
```

{{% alert title="Warning" color="warning" %}}
Deleting a profile also deletes the corresponding Namespace from the cluster.
<br>
All resources created in the profile namespace will be deleted.
{{% /alert %}}

## Manage Profile Contributors

Profile contributors are defined by the __presence__ of [specific `RoleBinding` and `AuthorizationPolicy` resources](#profile-resources) in the profile namespace.

{{% alert title="Note" color="info" %}}
The [central dashboard method](#manage-contributors-with-central-dashboard) ONLY allows you to add contributors with "edit" access.
<br>
To add contributors with "view" access, you must use the [manual method](#manage-contributors-manually).
{{% /alert %}}

### Manage Contributors with Central Dashboard

The __owner__ of a profile can use the __Manage Contributors__ tab in the Kubeflow Central Dashboard to add or remove contributors.

<img src="/docs/images/dashboard/homepage-manage-contributors.png" 
     alt="Kubeflow Central Dashboard - Manage Contributors Link"
     class="mt-3 mb-3 border border-info rounded">
</img>

Contributors are managed with the "Contributors to your namespace" field.

<img src="/docs/images/dashboard/manage-contributors.png" 
     alt="Kubeflow Central Dashboard - Manage Contributors"
     class="mt-3 mb-3 border border-info rounded"
     style="width: 100%; max-width: 40em">
</img>

### Manage Contributors Manually

An administrator can manually add contributors to an existing profile by creating the [required `RoleBinding` and `AuthorizationPolicy` resources](#profile-resources) in the profile namespace.

#### Create Contributor RoleBinding

The `RoleBinding` which grants a user access to a profile is structured as follows:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: user-<SAFE_USER_EMAIL>-clusterrole-<USER_ROLE>
  namespace: <PROFILE_NAME>
  annotations:
    role: <USER_ROLE>
    user: <RAW_USER_EMAIL>
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-<USER_ROLE>
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: <RAW_USER_EMAIL>
```

Where the following variables are replaced with the appropriate values:

- `<RAW_USER_EMAIL>` the email of the user (case-sensitive)
- `<SAFE_USER_EMAIL>` the email of the user (special characters replaced with `-`, and cast to lowercase)
- `<USER_ROLE>` the role of the user, either `edit` or `view`
- `<PROFILE_NAME>` the name of the profile

#### Create Contributor AuthorizationPolicy

The `AuthorizationPolicy` which grants a user access to a profile is structured as follows:

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: user-<SAFE_USER_EMAIL>-clusterrole-<USER_ROLE>
  namespace: <PROFILE_NAME>
  annotations:
    role: <USER_ROLE>
    user: <RAW_USER_EMAIL>
spec:
  rules:
    - from:
        - source:
            ## for more information see the KFAM code:
            ## https://github.com/kubeflow/kubeflow/blob/v1.8.0/components/access-management/kfam/bindings.go#L79-L110
            principals:
              ## required for kubeflow notebooks
              ## TEMPLATE: "cluster.local/ns/<ISTIO_GATEWAY_NAMESPACE>/sa/<ISTIO_GATEWAY_SERVICE_ACCOUNT>"
              - "cluster.local/ns/istio-system/sa/istio-ingressgateway-service-account"

              ## required for kubeflow pipelines
              ## TEMPLATE: "cluster.local/ns/<KUBEFLOW_NAMESPACE>/sa/<KFP_UI_SERVICE_ACCOUNT>"
              - "cluster.local/ns/kubeflow/sa/ml-pipeline-ui"
      when:
        - key: request.headers[kubeflow-userid]
          values:
            - <RAW_USER_EMAIL>
```

Where the following variables are replaced with the appropriate values:

- `<RAW_USER_EMAIL>` the email of the user (case-sensitive)
- `<SAFE_USER_EMAIL>` the email of the user (special characters replaced with `-`, and cast to lowercase)
- `<USER_ROLE>` the role of the user, either `edit` or `view`
- `<PROFILE_NAME>` the name of the profile
- `<KUBEFLOW_NAMESPACE>` the namespace where Kubeflow is installed
- `<KFP_UI_SERVICE_ACCOUNT>` the name of the ServiceAccount used by `ml-pipeline-ui` Pod
- `<ISTIO_GATEWAY_NAMESPACE>` the namespace containing the Istio Gateway Deployment
- `<ISTIO_GATEWAY_SERVICE_ACCOUNT>` the name of the ServiceAccount used by the Istio Gateway Pods