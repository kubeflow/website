+++
title = "Multi-User Overview"
description = "Overview of multi-user isolation in Kubeflow"
weight = 10
                    
+++

In Kubeflow clusters, users often need to be isolated into a group, where a group includes one or more users.   Additionally, a user may need to belong to multiple groups.  Kubeflow’s multi-user isolation simplifies user operations because each user only views and edited\s the Kubeflow components and model artifacts defined in their configuration.  A user’s view is not cluttered by components or model artifacts that are not in their configuration. This isolation also provides for efficient infrastructure and operations i.e. a single cluster supports multiple isolated users, and does not require the administrator to operate different clusters to isolate users.  

## Key concepts

- **Administrator**: An Administrator is someone who creates and maintains the Kubeflow cluster. This person configures permissions (i.e. view, edit) for other users.
- **User**: A User is someone who has access to some set of resources in the cluster. A user needs to be granted access permissions by the administrator.
- **Profile**: A Profile is a unique configuration for a user, which determines their access privileges and is defined by the Administrator.
- **Isolation**: Isolation uses Kubernetes Namespaces.  Namespaces isolate users or a group of users i.e. Bob’s namespace or ML Eng namespace that is shared by Bob and Sara.
- **Authentication**: Authentication is provided by an integration of Istio and OIDC and is secured by mTLS.  More details can be found [here](https://journal.arrikto.com/kubeflow-authentication-with-istio-dex-5eafdfac4782)
- **Authorization**: Authorization is provided by an integration with Kubernetes RBAC. 

Kubeflow multi-user isolation is configured by Kubeflow administrators.   Administrators configure Kubeflow User Profiles for each user.  After the configuration is created and applied, a User can only access the Kubeflow components that the Administrator has configured for them.  The configuration limits non-authorized UI users from viewing or accidentally deleting model artifacts.   

With multi-user isolation, Users are authenticated and authorized, and then provided with a time-based token i.e. a json web token (JWT).   The access token is carried as a web header in user requests, and authorizes the user to access the resources configured in their Profile.  The Profile configures several items including the User’s namespace(s), RBAC RoleBinding, Istio ServiceRole and ServiceRoleBindings along with Resource Quotas and Custom Plug-ins.   More information on the Profile definition and related CRD can be found [here](https://github.com/kubeflow/kubeflow/blob/master/components/profile-controller/README.md)


## Current integration 

These Kubeflow Components can support multi-user isolation: Central Dashboard, Notebooks, Pipelines, AutoML (Katib), KFServing.  Furthermore, resources created by the notebooks (for example, training jobs and deployments) also inherit the same access.

Important notes: Multi-user isolation has several configurable dependencies, especially those related to how Kubeflow is configured with the underlying Kubernetes cluster’s identity management system.   Additionally, Kubeflow multi-user isolation doesn’t provide hard security guarantees against malicious attempts to infiltrate another user’s profile.

When configuring multi-user isolation along with your security and identity management requirements, it is recommended that you consult with your [distribution provider](https://www.kubeflow.org/docs/distributions/).   This KubeCon [presentation](https://www.youtube.com/watch?v=U8yWOKOhzes) provides a detailed review of the architecture and implementation.   For on-premise deployments, Kubeflow uses Dex as a federated OpenID connection provider and can be integrated with LDAP or Active Directory to provide authentication and identity services.   This can be an advanced configuration and it is recommended that you consult with a distribution provider, or a team that provides advanced technical support for on-premise Kubeflow.   

## Next steps

* Learn how to configure user access [with profiles](/docs/components/central-dash/profiles).
* Learn about the [design of multi-user isolation](/docs/components/central-dash/multi-tenancy/design/) in Kubeflow.
* Learn about [how Istio is used](/docs/components/central-dash/multi-tenancy/istio/) in Kubeflow.
