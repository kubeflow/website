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

## Onboard new user

An **administrator** needs to create a profile for any user in the kubeflow cluster.
Here an administrator is a person who has
[*cluster-admin*](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
role binding in the Kubernetes cluster. This person has permissions to create
and modify Kubernetes resources in the cluster. For example, the person who
deployed Kubeflow will have administration privileges in the cluster.

There are 2 steps to onboard a new user:

#### Step 1: Grant user minimal k8s cluster view access

User should be given minimal permission scope that allows them to connect to the Kubernetes cluster.
For example for GCP users, they can be granted IAM role: **Kubernetes Engine Cluster Viewer**

#### Step 2: Creating a user profile 

Create a
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

### Batch creation of user profiles

Administrators might want to create profiles for multiple users as a batch. This can
be done by creating a `profile.yaml` on the local machine with multiple sections of
profile descriptions as shown below:

```
$ cat << EOF > profile.yaml
apiVersion: kubeflow.org/v1alpha1
kind: Profile
metadata:
  name: profileName1   # replace with the name of profile you want
spec:
  owner:
    kind: User
    name: userid1@email.com   # replace with the email of the user
---
apiVersion: kubeflow.org/v1alpha1
kind: Profile
metadata:
  name: profileName2   # replace with the name of profile you want
spec:
  owner:
    kind: User
    name: userid2@email.com   # replace with the email of the user
EOF
```

Apply to the Kubernetes cluster using:
```
kubectl create -f profile.yaml
```

This will create multiple profiles for each individual listed in the sections
in `profile.yaml`.


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

<!-- Commented until we have UI support for sharing profiles. Current
     method using CURL on the profiles API server is not recommended.

## Sharing access to a profile with another user

An owner of a profile can share view only or view and modify access to the profile
with another user in the system. 

-->

## Current Integration and Limitations

The Jupyter notebooks service is the first application to be fully integrated with
multi-user isolation. Access to the notebooks and the creation of notebooks is 
controlled by the profile access policies set by the Administrator or the owners
of the profiles. Resources created by the notebooks (eg. Training jobs and
deployments) will also inherit the same access.

Metadata and Pipelines or any other applications currently don't have full
fledged integration with isolation, though they will have access to the user
identity through the headers of the incoming requests. It's upto the individual
applications to leverage the available identity and create isolation stories
that make sense for them.

On GCP, the authentication and identify token is generated by GCP IAM and carried
through the requests as a JWT Token in header. Other cloud providers can have a
similar header to provide identity information.

For on-premise deployments, Kubeflow leverages Dex as a federated OpenID connection
provider and can be integrated with LDAP or Active Directory to provide authentication
and identity services.









