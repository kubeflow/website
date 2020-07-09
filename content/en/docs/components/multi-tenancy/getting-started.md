+++
title = "Getting Started with Multi-user Isolation"
description = "How to use multi-user isolation with profiles"
weight = 30
+++

{{% stable-status %}}

## Usage overview

After Kubeflow is installed and configured, you will by default
be accessing your *primary profile*. A *profile* owns a Kubernetes namespace of
the same name along with a collection of Kubernetes resources. Users have view
and modify access to their primary profiles. You can share
access to your profile with another user in the system. When sharing the access
to a profile with another user, you can choose to whether to provide only read access or read/modify
access. For all practical purposes when working
through the Kubeflow central dashboard, the active namespace is directly tied
with the active profile.

## Example of usage

You can select your active profile from the top bar on the Kubeflow central
dashboard.  Note that you can only see the profiles
to which you have view or modify access.

<img src="/docs/images/select-profile.png" 
  alt="Select active profile "
  class="mt-3 mb-3 border border-info rounded">

This guide illustrates the user isolation functionality using the Jupyter
notebooks service which is the first service in the system to have full
integration with the multi-user isolation functionality.  

After you select an active profile, the Notebooks Servers UI
displays only the active notebook servers in the currently selected
profile. All other notebook servers remain hidden from you. If you switch
the active profile, the view switches the list of active notebooks
appropriately. You can connect to any of the listed notebook servers and
view and modify the existing Jupyter notebooks available in the server.

For example, the following image shows the list of notebook servers available
in a user's primary profile:

<img src="/docs/images/notebooks-in-profile.png" 
  alt="List of notebooks in active profile "
  class="mt-3 mb-3 border border-info rounded">

When an unauthorized user accesses the notebooks in this profile, they see an 
error:

<img src="/docs/images/notebook-access-error.png" 
  alt="Error listing notebooks in inacessible profile"
  class="mt-3 mb-3 border border-info rounded">

When you create Jupyter notebook servers from the Notebooks Servers UI,
the notebook pods are created in your active profile. If you don't have
modify access to the active profile, you can only browse currently active
notebook servers and access the existing notebooks but cannot create
new notebook servers in that profile. You can create notebook
servers in your primary profile which you have view and modify access to.

## Onboarding a new user

Kubeflow {{% kf-latest-version %}} provides automatic profile creation for authenticated users on
first login. Additionally, an **administrator** can create a profile for any
user in the Kubeflow cluster.  Here an administrator is a person who has
[*cluster-admin*](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
role binding in the Kubernetes cluster. This person has permissions to create
and modify Kubernetes resources in the cluster. For example, the person who
deployed Kubeflow will have administration privileges in the cluster.

### Pre-requisites: grant user minimal Kubernetes cluster access

You must grant each user the minimal permission scope that allows them to 
connect to the Kubernetes cluster.

For example, for Google Cloud Platform (GCP) users, you should grant the 
following Cloud Identity and Access Management (IAM) roles. In the following
commands, replace `[PROJECT]` with your GCP project and replace `[EMAIL]` with 
the user's email address:

* To access the Kubernetes cluster, the user needs the [Kubernetes Engine 
  Cluster Viewer](https://cloud.google.com/kubernetes-engine/docs/how-to/iam)
  role:

    ```
    gcloud projects add-iam-policy-binding [PROJECT] --member=user:[EMAIL] --role=roles/container.clusterViewer
    ```

* To access the Kubeflow UI through IAP, the user needs the
  [IAP-secured Web App User](https://cloud.google.com/iap/docs/managing-access)
  role:

    ```
    gcloud projects add-iam-policy-binding [PROJECT] --member=user:[EMAIL] --role=roles/iap.httpsResourceAccessor
    ```

* To be able to run `gcloud get credentials` and see logs in Cloud Logging
  (formerly Stackdriver), the user needs viewer access on the project:

    ```
    gcloud projects add-iam-policy-binding [PROJECT] --member=user:[EMAIL] --role=roles/viewer
    ```

### Automatic creation of profiles

Kubeflow {{% kf-latest-version %}} provides automatic profile creation:

  - The Kubeflow deployment process automatically creates a profile for the user
    performing the deployment. When the user access the Kubeflow central dashboard
    they see their profile in the dropdown list.
  - The automatic profile creation can be disabled as part of the deployment by setting the registration-flow env variable to false. And an admin can manually create profiles per user or per project and add collaborators through YAML files. 
   Modify the kustomize/centraldashboard/base/parama.env to set the registration variable to false
   ```
   clusterDomain=cluster.local
   userid-header=kubeflow-userid
   userid-prefix=
   registration-flow=false
   ```
  - When an authenticated user logs into the system and visits the central
    dashboard for the first time, they trigger a profile creation automatically.
      - A brief message introduces profiles: <img
        src="/docs/images/auto-profile1.png" alt="Automatic profile creation
        step 1" class="mt-3 mb-3 border border-info rounded">
      - The user can name their profile and click *Finish*:  <img
        src="/docs/images/auto-profile2.png" alt="Automatic profile creation
        step 2" class="mt-3 mb-3 border border-info rounded">
      - This redirects the user to the dashboard where they can view and select
        their profile in the dropdown list.

### Manual profile creation

An administrator can manually create profiles for users as described below.

Create a
`profile.yaml` file with the following content on your local machine:

```
apiVersion: kubeflow.org/v1beta1
kind: Profile
metadata:
  name: profileName   # replace with the name of profile you want, this will be user's namespace name
spec:
  owner:
    kind: User
    name: userid@email.com   # replace with the email of the user
  
  resourceQuotaSpec:    # resource quota can be set optionally 
   hard:  
     cpu: "2"
     memory: 2Gi
     nvidia.com/gpu: "1"
     persistentvolumeclaims: "1"
     requests.storage: "5Gi"  
```
Run the following command to create the corresponding profile resource:

```
kubectl create -f profile.yaml

kubectl apply -f profile.yaml  #if you are modifying the profile 
```

The above command creates a profile named *profileName*. The profile owner is
*userid@email.com* and has view and modify access to that profile.
The following resources are created as part of the profile creation:

  - A Kubernetes namespace that shares the same name with the corresponding
    profile.
  - Kubernetes RBAC role binding for the namespace: *Admin*. This makes the
    profile owner the namespace administrator, thus giving them access to the 
    namespace using kubectl (via the Kubernetes API).
  - Istio namespace-scoped ServiceRole: *ns-access-istio*. This allows access to
    all services in the target namespace via Istio routing.
  - Istio namespace-scoped ServiceRoleBinding: *owner-binding-istio*. This binds
    the ServiceRole *ns-access-istio* to the profile owner. The profile owner can
    therefore access services in the namespace.
  - Namespace-scoped service-accounts *editor* and *viewer* to be used by
    user-created pods in the namespace.
  - Namespace scoped resource quota limits will be placed.

**Note**: Due to a one-to-one correspondence of profiles with Kubernetes
namespaces, the terms *profile* and *namespace* are sometimes used interchangably in the
documentation.

### Batch creation of user profiles

Administrators might want to create profiles for multiple users as a batch. You can
do this by creating a `profile.yaml` on the local machine with multiple sections of
profile descriptions as shown below:

```
apiVersion: kubeflow.org/v1beta1
kind: Profile
metadata:
  name: profileName1   # replace with the name of profile you want
spec:
  owner:
    kind: User
    name: userid1@email.com   # replace with the email of the user
---
apiVersion: kubeflow.org/v1beta1
kind: Profile
metadata:
  name: profileName2   # replace with the name of profile you want
spec:
  owner:
    kind: User
    name: userid2@email.com   # replace with the email of the user
```

Run the following command to apply the namespaces to the Kubernetes cluster:
```
kubectl create -f profile.yaml

kubectl apply -f profile.yaml  #if you are modifying the profiles
```

This will create multiple profiles, one for each individual listed in the sections
in `profile.yaml`.

## Listing and describing profiles

An administrator can list the existing profiles in the system:
```
$ kubectl get profiles
```
and describe a specific profile using:
```
$ kubectl describe profile profileName
```

## Deleting an existing profile

An administrator can delete an existing profile using:
```
$ kubectl delete profile profileName
```

This will delete the profile, the corresponding namespace and any Kubernetes
resources associated with the profile. The profile's owner or other users with
access to the profile will no longer have access to the profile and will not see
it in the dropdown list on the central dashboard.


## Managing contributors through the Kubeflow UI

Kubeflow {{% kf-latest-version %}} allows sharing of profiles with other users in the
system.  An owner of a profile can share access to their profile using the
**Manage Contributors** tab available through the dashboard.

<img src="/docs/images/multi-user-contributors.png" 
  alt="Manage Contributors in Profiles"
  class="mt-3 mb-3 border border-info rounded">

Here is an example of the Manage Contributors tab view:

<img src="/docs/images/manage-contributors.png" 
  alt="Manage Contributors in Profiles"
  class="mt-3 mb-3 border border-info rounded">

Notice that in the above view the account associated with the profile is a
cluster administrator (*Cluster Admin*)
as this account was used to deploy Kubeflow. The view lists the
profiles accessible to the user along with the role associated with that
profile.

To add or remove a contributor, add/remove the 
email address or the user identifier in the **Contributors to your namespace** field.

<img src="/docs/images/add-contributors.png" 
  alt="Add Contributors"
  class="mt-3 mb-3 border border-info rounded">

The Manage Contributors tab shows the contributors that the namespace owner has
added. Note that the cluster administrator can view all the 
profiles in the system along with their contributors.

<img src="/docs/images/view-contributors.png" 
  alt="View Contributors"
  class="mt-3 mb-3 border border-info rounded">


The contributors have access to all the Kubernetes resources in the
namespace and can create notebook servers as well as access
existing notebooks.

## Managing contributors manually

An administrator can manually add contributors to an existing profile as described below.

Create a rolebinding.yaml file with the following content on your local machine:

```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  annotations:
    role: edit
    user: userid@email.com   # replace with the email of the user from your Active Directory case sensitive
  name: user-userid-email-com-clusterrole-edit
  # Ex: if the user email is lalith.vaka@kp.org the name should be user-lalith-vaka-kp-org-clusterrole-edit
  # Note: if the user email is Lalith.Vaka@kp.org from your Active Directory, the name should be user-lalith-vaka-kp-org-clusterrole-edit
  namespace: profileName # replace with the namespace/profile name that you are adding contribbitors to
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-edit
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: userid@email.com   # replace with the email of the user from your Active Directory case sensitive
```

Create a servicerolebinding.yaml file with the following content on your local machine:

```
apiVersion: rbac.istio.io/v1alpha1
kind: ServiceRoleBinding
metadata:
  annotations:
    role: edit
    user: userid@email.com   # replace with the email of the user from your Active Directory case sensitive
  generation: 1
  name: user-userid-email-com-clusterrole-edit 
  # Ex: if the user email is lalith.vaka@kp.org the name should be user-lalith-vaka-kp-org-clusterrole-edit
  # Note: if the user email is Lalith.Vaka@kp.org from your Active Directory, the name should be user-lalith-vaka-kp-org-clusterrole-edit
  namespace: profileName # replace with the namespace/profile name that you are adding contribbitors to
spec:
  roleRef:
    kind: ServiceRole
    name: ns-access-istio
  subjects:
  - properties:
      request.headers[kubeflow-userid]: userid@email.com   # replace with the email of the user from your Active Directory case sensitive
status: {}
```

Run the following command to create the corresponding contributor resources:

```
kubectl create -f rolebinding.yaml

kubectl create -f servicerolebinding.yaml 
```

The above command adds a contributor *userid@email.com* to the profile named *profileName*. The contributor
*userid@email.com* has view and modify access to that profile.
