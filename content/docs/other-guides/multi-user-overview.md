+++
title = "Multi-user Isolation"
description = "Isolation of user-created resources for convenience and organization"
weight = 50
+++

As of v0.6, Kubeflow supports for multi-user isolation of user-created
resources in a Kubeflow deployment. The primary purpose of this functionality
is to enable multiple users to operate on a shared Kubeflow deployment without
stepping on each others' jobs and resources. It provides the users with the
convenience of clutter free browsing of notebooks, training jobs, serving
deployments and other resources. The isolation mechanisms also prevent
accidental deletion/modification of resources of other users in the deployment.
Note that the isolation support in Kubeflow doesn't provide any hard security
guarantees against malicious attempts by users to infiltrate other user's
profiles.

## Usage overview

An administrator needs to deploy Kubeflow and configure the authentication.
service for the deployment.  A user can log into the system and will by default
be accessing their *primary profile*. A *profile* is a collection of Kubernetes
resources along with a Kubernetes namespace of the same name. Users have view
and modify access to their primary profile. The owner of a profile can share
access to the profile with another user in the system. When sharing the access
to a profile, the owner can choose to share it as a view access only or view
and modify access with the user. For all practical purposes when working
through the Kubeflow central dashboard, the active namespace is directly tied
with the active profile.

## Example of usage

A user can select their active profile from the top bar on the Kubeflow central
dashboard.  Note that the user can only view the profiles in the dropdown list
that they have view or modify access to.

<img src="/docs/images/select-profile.png" 
  alt="Select active profile "
  class="mt-3 mb-3 border border-info rounded">

This guide illustrates the user isolation functionality using the Jupyter
notebooks service which is the first service in the system to have full
integration with the multi-user isolation functionality.  

Once an active profile has been selected by the user, the Notebooks Servers UI
will display only the active notebook servers in the currently selected
profile. All other notebook servers remain hidden from the user. If they switch
the active profile, the view will switch the list of active notebooks
appropriately. The user can connect to any of the listed notebook servers and
view and modify the existing Jupyter notebooks available in the server.

For example, the following image shows the list of Notebook servers available
in the user's primary profile:

<img src="/docs/images/notebooks-in-profile.png" 
  alt="List of notebooks in active profile "
  class="mt-3 mb-3 border border-info rounded">

And when an unauthorized user accesses the Notebooks in this profile, they are
presented with an error.

<img src="/docs/images/notebook-access-error.png" 
  alt="Error listing notebooks in inacessible profile"
  class="mt-3 mb-3 border border-info rounded">

When the users create Jupyter notebook servers from the Notebooks Servers UI,
the notebook pods are created in the active profile. If the user doesn't have
modify access to the active profile, the user can only browse currently active
notebook servers and access the existing jupyter notebooks but cannot create
new notebook servers in that profile. The users can create notebook
servers in their primary profile which they have view and modify access to.

## Creating a user profile

An **administrator** needs to create a profile for any user in the system.
Here an administrator is a person who has
[*cluster-admin*](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
role binding in the Kubernetes cluster. This person has permissions to create
and modify Kubernetes resources in the cluster. For example, the person who
deployed Kubeflow will have administration privileges in the cluster.  Create a
`profile.yaml` file with the following contents on your local machine:

```
$ cat << EOF > profile.yaml
apiVersion: kubeflow.org/v1alpha1
kind: Profile
metadata:
  name: profileName   # replace with the name of profile you want
spec:
  owner:
    kind: User
    name: userid@email.com   # replace with the email of the user
EOF
```
Create the corresponding profile resource using:

```
$ kubectl create -f profile.yaml
```

The above creates a profile named *profileName* whose owner is
*userid@email.com* and has view and modify access to that profile.
The following resources are created as part of the profile creation:

  - A Kubernetes namespace that shares the same name with the corresponding
    profile.
  - Kubernetes RBAC rolebinding for the namespace *Admin*. This makes the
    profile owner the namespace admin, allowing access to the namespace via
    Kubernetes API (using kubectl).
  - Istio namespace-scoped ServiceRole *ns-access-istio*. This allows access to
    all services in the target namespace via Istio routing.
  - Istio namespace-scoped ServiceRoleBinding *owner-binding-istio*. This binds
    the ServiceRole ns-access-istio to the profile owner. The profile owner can
    therefore access services in the namespace created.
  - Namespace-scoped service-accounts editor and viewer to be used by
    user-created pods in above namespace.

## Listing and describing profiles

An **administrator** can list the existing profiles in the system:
```
$ kubectl get profiles
```
and describe a specific profile using:
```
$ kubectl describe profile profileName
```

## Deleting an existing profile

An **administrator** can delete an existing profile using:
```
$ kubectl delete profile profileName
```

This will delete the profile, the corresponding namespace and any Kubernetes
resources associated with the profile. The profile's owner or other users with
access to the profile will no longer have access to the profile and will not see
it in the dropdown list on the central dashboard.

## Sharing access to a profile with another user

An owner of a profile can share view only or view and modify access to the profile
with another user in the system. 










