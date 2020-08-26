+++
title = "Authenticating Kubeflow to GCP"
description = "Authentication and authorization to Google Cloud Platform (GCP)"
weight = 40
                    
+++

This page describes in-cluster and local authentication for Kubeflow GCP deployments.

## In-cluster authentication

Starting from Kubeflow v0.6, you consume Kubeflow from custom namespaces (that is, namespaces other than `kubeflow`).
The `kubeflow` namespace is only for running Kubeflow system components. Individual jobs and model deployments 
run in separate namespaces.

### Google Kubernetes Engine (GKE) workload identity

Starting in v0.7, Kubeflow uses the new GKE feature: [workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity).
This is the recommended way to access GCP APIs from your GKE cluster.
You can configure a Kubernetes service account (KSA) to act as a GCP service account (GSA).

If you deployed Kubeflow following the GCP instructions, then the profiler controller automatically binds the "default-editor" service account for every profile namespace to a default GCP service account created during kubeflow deployment. 
The Kubeflow deployment process also creates a default profile for the cluster admin.

For more info about profiles see the [Multi-user isolation](/docs/components/multi-tenancy/) page.

Here is an example profile spec:

```
apiVersion: kubeflow.org/v1beta1
kind: Profile
spec:
  plugins:
  - kind: WorkloadIdentity
    spec:
      gcpServiceAccount: ${SANAME}@${PROJECT}.iam.gserviceaccount.com
...
```

You can verify that there is a KSA called default-editor and that it has an annotation of the corresponding GSA:

```
kubectl -n ${PROFILE_NAME} describe serviceaccount default-editor

...
Name:        default-editor
Annotations: iam.gke.io/gcp-service-account: ${KFNAME}-user@${PROJECT}.iam.gserviceaccount.com
...
```

You can double check that GSA is also properly set up:

```
gcloud --project=${PROJECT} iam service-accounts get-iam-policy ${KFNAME}-user@${PROJECT}.iam.gserviceaccount.com
```

When a pod uses KSA default-editor, it can access GCP APIs with the role granted to the GSA.

**Provisioning custom Google service accounts in namespaces**:
When creating a profile, you can specify a custom GCP service account for the namespace to control which GCP resources are accessible.

Prerequisite: you must have permission to edit your GCP project's IAM policy and to create a profile custom resource (CR) in your Kubeflow cluster.

1. if you don't already have a GCP service account you want to use, create a new one. For example: `user1-gcp@<project-id>.iam.gserviceaccount.com`: 
```
gcloud iam service-accounts create user1-gcp@<project-id>.iam.gserviceaccount.com
```

2. You can bind roles to the GCP service account to allow access to the desired GCP resources. For example to run BigQuery job, you can grant access like so:
```
gcloud projects add-iam-policy-binding <project-id> \
      --member='serviceAccount:user1-gcp@<project-id>.iam.gserviceaccount.com' \
      --role='roles/bigquery.jobUser'
```

3. [Grant `owner` permission](https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/add-iam-policy-binding) of service account `user1-gcp@<project-id>.iam.gserviceaccount.com` to cluster account `<cluster-name>-admin@<project-id>.iam.gserviceaccount.com`:
```
gcloud iam service-accounts add-iam-policy-binding \
      user1-gcp@<project-id>.iam.gserviceaccount.com \
      --member='serviceAccount:<cluster-name>-admin@<project-id>.iam.gserviceaccount.com' --role='roles/owner'
```

4. Manually create a profile for user1 and specify the GCP service account to bind in `plugins` field:

```yaml
apiVersion: kubeflow.org/v1beta1
kind: Profile
metadata:
  name: profileName   # replace with the name of the profile (the user's namespace name)
spec:
  owner:
    kind: User
    name: user1@email.com   # replace with the email of the user
  plugins:
  - kind: WorkloadIdentity
    spec:
      gcpServiceAccount: user1-gcp@project-id.iam.gserviceaccount.com
```

**Note:**
The profile controller currently doesn't perform any access control checks to see whether the user creating the profile should be able to use the GCP service account. 
As a result, any user who can create a profile can get access to any service account for which the admin controller has owner permissions. We will improve this in subsequent releases.

You can find more details on workload identity in the [GKE documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity).

### Authentication from Kubeflow Pipelines

Starting from Kubeflow v1.1, Kubeflow Pipelines [supports multi-user isolation](/docs/pipelines/multi-user/). Therefore, pipeline runs are executed in user namespaces also using the `default-editor` KSA.

Additionally, the Kubeflow Pipelines UI, visualization, and TensorBoard server instances are deployed in your user namespace using the `default-editor` KSA. Therefore, to [visualize results in the Pipelines UI](/docs/pipelines/sdk/pipelines-sdk/output-viewer/), they can fetch artifacts in Google Cloud Storage using permissions of the same GSA you configured for this namespace.

For more details, refer to [Authenticating Pipelines to GCP](/docs/gke/pipelines/authentication-pipelines/).

---

## Local authentication

### gcloud


Use the [`gcloud` tool](https://cloud.google.com/sdk/gcloud/) to interact with Google Cloud Platform (GCP) on the command line. 
You can use the `gcloud` command to [set up Google Kubernetes Engine (GKE) clusters](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create), 
and interact with other Google services.

##### Logging in

You have two options for authenticating the `gcloud` command:

- You can use a **user account** to authenticate using a Google account (typically Gmail). 
You can register a user account using [`gcloud auth login`](https://cloud.google.com/sdk/gcloud/reference/auth/login), 
which brings up a browser window to start the familiar Google authentication flow.

- You can create a **service account** within your GCP project. You can then
[download a `.json` key file](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) 
associated with the account, and run the 
[`gcloud auth activate-service-account`](https://cloud.google.com/sdk/gcloud/reference/auth/activate-service-account)
command to authenticate your `gcloud` session.

You can find more information in the [GCP docs](https://cloud.google.com/sdk/docs/authorizing).

##### Listing active accounts

You can run the following command to verify you are authenticating with the expected account:

```
gcloud auth list
```

In the output of the command, an asterisk denotes your active account.

##### Viewing IAM roles

Permissions are handled in GCP using [IAM Roles](https://cloud.google.com/iam/docs/understanding-roles). 
These roles define which resources your account can read or write to. Provided you have the 
[necessary permissions](https://cloud.google.com/iam/docs/understanding-custom-roles#required_permissions_and_roles_),
you can check which roles were assigned to your account using the following gcloud command:

```
PROJECT_ID=your-gcp-project-id-here

gcloud projects get-iam-policy $PROJECT_ID --flatten="bindings[].members" \
    --format='table(bindings.role)' \
    --filter="bindings.members:$(gcloud config list account --format 'value(core.account)')"
```

You can view and modify roles through the 
[GCP IAM console](https://console.cloud.google.com/iam-admin/).


You can find more information about IAM in the 
[GCP docs](https://cloud.google.com/iam/docs/granting-changing-revoking-access).

---

### kubectl
The [`kubectl` tool](https://kubernetes.io/docs/reference/kubectl/overview/) is used for interacting with a Kubernetes cluster through the command line.

##### Connecting to a cluster using a GCP account
If you set up your Kubernetes cluster using GKE, you can authenticate with the cluster using a GCP account. 
The following commands fetch the credentials for your cluster and save them to your local 
[`kubeconfig` file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/):

```
CLUSTER_NAME=your-gke-cluster
ZONE=your-gcp-zone

gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE
```

You can find more information in the 
[GCP docs](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

##### Changing active clusters
If you work with multiple Kubernetes clusters, you may have multiple contexts saved in your local 
[`kubeconfig` file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
You can view the clusters you have saved by run the following command:

```
kubectl config get-contexts
```

You can view which cluster is currently being controlled by `kubectl` with the following command:
```
CONTEXT_NAME=your-new-context

kubectl config set-context $CONTEXT_NAME
```

You can find more information in the 
[Kubernetes docs](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

##### Checking RBAC permissions

Like GKE IAM, Kubernetes permissions are typically handled with a "role-based authorization control" (RBAC) system.
Each Kubernetes service account has a set of authorized roles associated with it. If your account doesn't have the 
right roles assigned to it, certain tasks fail.

You can check if an account has the proper permissions to run a command by building a query structured as
`kubectl auth can-i [VERB] [RESOURCE] --namespace [NAMESPACE]`. For example, the following command verifies
that your account has permissions to create deployments in the `kubeflow` namespace:

```
kubectl auth can-i create deployments --namespace kubeflow
```

You can find more information in the 
[Kubernetes docs](https://kubernetes.io/docs/reference/access-authn-authz/authorization/).

##### Adding RBAC permissions
If you find you are missing a permission you need, you can grant the missing roles to your service account using
Kubernetes resources.

- **Roles** describe the permissions you want to assign. For example, `verbs: ["create"], resources:["deployments"]`
- **RoleBindings** define a mapping between the `Role`, and a specific service account

By default, `Roles` and `RoleBindings` apply only to resources in a specific namespace, but there are also
`ClusterRoles` and `ClusterRoleBindings` that can grant access to resources cluster-wide

You can find more information in the 
[Kubernetes docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole).

## Next steps

See the [troubleshooting guide](/docs/gke/troubleshooting-gke/) for help with diagnosing and fixing issues you may encounter with Kubeflow on GCP
