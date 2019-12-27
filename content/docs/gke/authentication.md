+++
title = "Authenticating Kubeflow to GCP"
description = "Authentication and authorization to Google Cloud Platform (GCP)"
weight = 40
+++

This page describes in-cluster and local authentication for Kubeflow GCP deployments.

## In-cluster authentication

Starting from Kubeflow v0.6, you consume Kubeflow from custom namespaces (that is, namespaces other than `kubeflow`).
The `kubeflow` namespace is only for running Kubeflow system components. Individual jobs and model deployments 
run in separate namespaces. To do this, install GCP credentials into the new namespace.

### Starting in Kubeflow v0.7: Google Kubernetes Engine (GKE) workload identity

Starting in v0.7, Kubeflow uses the new GKE feature: [workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity).
This is the recommended way to access GCP APIs from your GKE cluster.
You no longer have to download GCP service account key. Instead, you can configure a Kubernetes service account (KSA) to act as a GCP service account (GSA).

If you deployed Kubeflow following the GCP instructions, then the profiler controller automatically binds the "default-editor" service account for every profile namespace to a default GCP service account created during kubeflow deployment. 
The Kubeflow deployment process also creates a default profile for the cluster admin.

For more info about profiles see the [Multi-user isolation](https://www.kubeflow.org/docs/other-guides/multi-user-overview/) page.

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

```
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

### Kubeflow v0.6 and before: GCP service account key as secret

When you [set up Kubeflow for GCP](/docs/gke/deploy), it automatically
[provisions three service accounts](https://www.kubeflow.org/docs/gke/deploy/deploy-cli/#gcp-service-accounts)
with different privileges in the `kubeflow` namespace. In particular, the `${KF_NAME}-user` service account is
meant to grant your user services access to GCP. The credentials to this service account can be accessed within
the cluster as a [Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/) called `user-gcp-sa`.

The secret has basic access to a limited set of GCP services by default, but more roles can be granted through the
[GCP IAM console](https://console.cloud.google.com/iam-admin/).

You can create a PodDefault object to attach the credentials to certain pods.

##### Credentials

You can add credentials to the new namespace by either copying them from an existing Kubeflow namespace or by
creating a new service account.

To copy credentials from one namespace to another namespace use the following CLI commands (**Note**: there is an
[issue](https://github.com/kubeflow/kubeflow/issues/3640) filed to automate these commands):

```
NAMESPACE=<new kubeflow namespace>
SOURCE=kubeflow
NAME=user-gcp-sa
SECRET=$(kubectl -n ${SOURCE} get secrets ${NAME} -o jsonpath="{.data.${NAME}\.json}" | base64 -d)
kubectl create -n ${NAMESPACE} secret generic ${NAME} --from-literal="${NAME}.json=${SECRET}"
```

To create a new service account instead of copying credentials, use the following steps:

1. Create a service account with the desired roles:
```
export PROJECT_ID=<GCP project id>
export NAMESPACE=<new kubeflow namespace>
export SA_NAME=<service account name>
export GCPROLES=roles/editor
gcloud --project=${PROJECT_ID} iam service-accounts create $SA_NAME
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
    --role $GCPROLES
```

2. Download the JSON service account key, set `KEYPATH` to the correct path, and create the key: 
```
export KEYPATH=some/path/${SA_NAME}.gcp.json
gcloud --project=${PROJECT_ID} iam service-accounts keys create ${KEYPATH} \
   --iam-account $SA_NAME@$PROJECT_ID.iam.gserviceaccount.com
```

3. Upload the JSON service account key to cluster as a secret:
```
kubectl create secret generic user-gcp-sa -n $NAMESPACE \ --from-file=user-gcp-sa.json=${KEYPATH}
```

##### PodDefault object

The PodDefault object is a way to centrally manage configurations that should be added to all pods.

The PodDefault will match all pods with the specified selector and modify the pods to inject the volumes,
secrets, and environment variables listed in the pod manifest.

Create a pod default in a file called `add-gcp-secret.yaml` and apply it using `kubectl apply -f add-gcp-secret.yaml -n $NAMESPACE`:
```
apiVersion: "kubeflow.org/v1alpha1"
kind: PodDefault
metadata:
  name: add-gcp-secret
spec:
 selector:
  matchLabels:
    addgcpsecret: "true"
 desc: "add gcp credential"
 env:
 - name: GOOGLE_APPLICATION_CREDENTIALS
   value: /secret/gcp/user-gcp-sa.json
 volumeMounts:
 - name: secret-volume
   mountPath: /secret/gcp
 volumes:
 - name: secret-volume
   secret:
    secretName: user-gcp-sa
```

### Authentication from a Pod

You must do two things to access a GCP service account from a Pod:

1. **Mount the secret as a file.** This gives your Pod access to your GCP account, 
so be careful which Pods you grant access to.
1. **Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable** to point to the service account.
GCP libraries use this environment variable to find the service account and authenticate with GCP.

The following YAML describes a Pod that has access to the `${KF_NAME}-user` service account:
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

Refer to [Authenticating Pipelines to GCP](/docs/gke/authentication-pipelines/).

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
