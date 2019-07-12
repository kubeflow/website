+++
title = "Authenticating Kubeflow to GCP"
description = "Troubleshooting guide for authentication and authorization to GCP"
weight = 4
+++


# Authenticating gcloud

[The `gcloud` tool](https://cloud.google.com/sdk/gcloud/) is used to interact with Google Cloud Platform (GCP) over the command line. 
It can be used to [set up Google Kubernetes Engine (GKE) clusters](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create), 
and interact with other Google services.

### Logging in

There are two ways to authenticate the gcloud command:


- A **service account** is an account set up within your GCP project. Authentication is handled by 
[downloading a `.json` key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) 
associated with the account, and registering it with gcloud using 
[`gcloud auth activate-service-account`](https://cloud.google.com/sdk/gcloud/reference/auth/activate-service-account).
This is the recommended way to authenticate with GCP.

- A **user account** is a Google (typically gmail) account that users can use to authenticate.
You can register a user account using [`gcloud auth login`](https://cloud.google.com/sdk/gcloud/reference/auth/login), 
which brings up a browser window to start the familiar Google authentication flow.

More information can be found in the [GCP docs](https://cloud.google.com/sdk/docs/authorizing).

### Listing Active Accounts

You can run the following commend to verify you are authenticating with the expected account. 
Your active account will be denoted with an asterisk.

```
gcloud auth list
```

### Viewing IAM Roles

Permissions are handled in GCP using [IAM Roles](https://cloud.google.com/iam/docs/understanding-roles). 
These roles define which resources your account can read or write to. You can check which roles were assigned to your account using the following gcloud command:

```
PROJECT_ID=your-gcp-project-id-here

gcloud projects get-iam-policy $PROJECT_ID --flatten="bindings[].members" \
    --format='table(bindings.role)' \
    --filter="bindings.members:$(gcloud config list account --format 'value(core.account)')"
```

Roles can also be viewed and modified through the 
[GCP IAM console](https://console.cloud.google.com/iam-admin/).


More information about IAM can be found in the 
[GCP docs](https://cloud.google.com/iam/docs/granting-changing-revoking-access).

# Authenticating kubectl
The [`kubectl` tool](https://kubernetes.io/docs/reference/kubectl/overview/) is used for interacting with a Kubernetes cluster through the command line

### Connecting to a Cluster using a GCP Account
If you set up your Kubernetes cluster using GKE, you can authenticate with the cluster using a GCP account. 
The following command will fetch the credentials for your cluster and save them to your local 
[`kubeconfig` file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/):

```
CLUSTER_NAME=your-gke-cluster
ZONE=your-gcp-zone

gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE
```

More information can be found in the 
[GCP docs](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

### Changing Active Clusters
If you work with multiple Kubernetes clusters, you may have multiple contexts saved in your local 
[`kubeconfig` file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
To view the clusters you have saved, run the following command:

```
kubectl config get-contexts
```

This will show which cluster is currently being controlled by your `kubectl` commands.
To change your active cluster, run the following command:
```
CONTEXT_NAME=your-new-context

kubectl config set-context $CONTEXT_NAME
```

More information can be found in the 
[Kubernetes docs](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

### Checking RBAC Permissions

Like GKE IAM, Kubernetes permissions are typically handled with a "role-based authorization control" (RBAC) system.
Each Kubernetes service account has a set of authorized roles associated with it. If your account doesn't have the 
right roles assigned to it, certain tasks will fail.

To check if an account has the proper permissions to run a command, you can build a query structured as
`kubectl auth can-i [VERB] [RESOURCE] --namespace [NAMESPACE]`. For example, the following command will verify
that your account has permissions to create deployments in the `Kubeflow` namespace:
, 
```
kubectl auth can-i create deployments --namespace kubeflow
```

More information can be found in the 
[Kubernetes docs](https://kubernetes.io/docs/reference/access-authn-authz/authorization/).

### Adding RBAC Permissions
If you find you are missing a permission you need, you can grant the missing roles to your service account using
Kubernetes resources.
- **Roles** describe the permissions you want to assign. For example, `verbs: ["create"], resources:["deployments"]`
- **RoleBindings** define a mapping between the `Role`, and a specific service account

By default, `Roles` and `RoleBindings` apply only to resources in a specific namespace, but there are also
`ClusterRoles` and `ClusterRoleBindings` that can grant access to resources cluster-wide

More information can be found in the 
[Kubernetes docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole).

# In-Cluster Authentication

### Kubeflow GCP Service Accounts
When you set up Kubeflow for GCP, it will automatically 
[provision three service accounts](https://www.kubeflow.org/docs/gke/deploy/deploy-cli/#gcp-service-accounts) with different
privileges. In particular, the `${KFAPP}-user` service account is meant to grant your user services access to GCP. 
The credentials to this service account can be accessed within the cluster as a
[Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/).

The secret will have basic access to a limited set of GCP services by default, but more roles can be granted through the
[GCP IAM console](https://console.cloud.google.com/iam-admin/).

### Authentication from a Pod
To access the service account from a Pod, you have to do two things:
1. **Mount the secret as a file.** This will give your pod access to your GCP account, 
so be careful which pods you grant access to.
1. **Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable** to point to the service account.
GCP libraries will use this environment variable to find the service account and authenticate with GCP.

The following YAML describes Pod that has access to the `${KFAPP}-user` service account:
```
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: myimage
    env:
    - name: GOOGLE_APPLICATION_CREDENTIALS
      value: "/var/secrets/user-sa.json"
    volumeMounts:
    - name: gcp-secret
      mountPath: "/var/secrets/user-sa.json"
      readOnly: true
  volumes:
  - name: gcp-secret
    secret:
      secretName: myappname-user
```

### Authentication from Kubeflow Pipelines
In [Kubeflow Pipelines](https://www.kubeflow.org/docs/pipelines/), each step describes a 
container that is run independently. If you want to grant access for a single step to use
the credentials in one of your service account secrets, you can use 
[`kfp.gcp.use_gcp_secret()`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret)
Examples for how to use this function can be found in the 
[Kubeflow examples repo](https://github.com/kubeflow/examples/blob/871895c54402f68685c8e227c954d86a81c0575f/pipelines/mnist-pipelines/mnist_pipeline.py#L97).
