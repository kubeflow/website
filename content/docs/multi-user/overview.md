+++
title = "Overview of Multi-user Isolation Support"
description = "Isolation of user created resources for convenience and organization"
weight = 5
+++

Kubeflow v0.6 release enables support for multi-user isolation of user created
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
be accessing their primary profile. Users have view and modify access to their
primary profile. The owner of a profile can share access to the profile with
another user in the system. When sharing the access to a profile, the owner can
choose to share it as a view access only or view and modify access with the
user.

A user can select their active profile from the top bar on
the Kubeflow Central Dashboard. Note that the user can only view the profiles
in the dropdown list that they have view or modify access to.

Todo(abhishek): add screenshot

For this overview we will illustrate the user isolation functionality using the
Jupyter notebooks service which is the first service in the system to have full
integration with the multi-user isolation functionality.  

Once an active profile has been selected by the user, the Notebooks Manager UI
will display only the active notebook servers in the currently selected
profile. All other notebook servers remain hidden from the user. If they switch
the active profile, the view will switch the list of active notebooks
appropriately. The user can connect to any of the listed notebook servers and
view and modify the existing Jupyter notebooks available in the server.

Todo(abhishek): screenshots of notebook server lists

When the users create Jupyter notebook servers from the Notebooks Manager UI,
the notebook pods are created in the active profile. If the user doesn't have
modify access to the active profile, the user can only browse currently active
notebook servers and access the existing jupyter notebooks but cannot create
new notebook servers in that profile. Clearly the users can create notebook
servers in their primary profile which they have view and modify access to.

Todo(abhishek): Screenshot for successful creation & failed creation

### Creating a user profile

An **administrator** needs to create a profile for any user in the system.
Create a profile.yaml file with the following contents:

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
Create the correspoding profile resource using:

```
$ kubectl create -f profile.yaml
```

The above creates a profile named *profileName* whose owner is
*userid@email.com* and has view and modify access to that profile.
The following resources are created as part of the profile creation:

  - TODO (abhishek/kunming): List of resources created, eg. namespace, service accounts etc.

### Listing and describing profiles

An **administrator** can list the existing profiles in the system:
```
$ kubectl get profiles
```
and describe a specific profile using:
```
$ kubectl describe profile profileName
```

### Deleting an existing profile

An **administrator** can delete an existing profile using:
```
$ kubectl delete profile profileName
```

This will delete the profile, the corresponding namespace and any kubernetes
resources associated with the profile. The profile's owner or other users with
access to the profile will no longer have access to the profile and will not see
it in the dropdown list on the Central Dashboard.










