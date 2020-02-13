+++
title = "Introduction to Multi-user Isolation"
description = "What does multi-user isolation mean?"
weight = 10
+++

{{% stable-status %}}

In a production environment, it is often necessary to share the same pool
of resources across different teams and users. These different users need
a reliable way to isolate and protect their own resources, without accidentally
stepping on each other.

Kubeflow {{% kf-latest-version %}} supports multi-user isolation, which applies 
access control over namespaces and user-created
resources in a deployment. It provides the users with the
convenience of clutter-free browsing of notebooks, training jobs, serving
deployments and other resources. The isolation mechanisms also prevent
accidental deletion/modification of resources of other users in the deployment.

### Key Words

**administrator**: An administrator is someone who creates and maintains the Kubeflow cluster.
This person has the permission to grant access permissions to others.

**user**: A user is someone who has access to some set of resources in the cluster. A user
needs to be granted access permissions by the administrator.

**profile**: A profile is a grouping of all Kubernetes clusters owned by a user.

Note that the isolation support in Kubeflow doesn't provide any hard security
guarantees against malicious attempts by users to infiltrate other user's
profiles.








