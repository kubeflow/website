+++
title = "Authenticating Kubeflow to GCP"
description = "Authentication and authorization to GCP"
weight = 4
+++


## In-cluster authentication

Starting from Kubeflow version 0.6, you consume Kubeflow from custom namespaces (i.e., namespaces other than `kubeflow`).
The `kubeflow` namespace is intended for running Kubeflow system components while individual jobs and model deployments
are expected to run in separate namespaces. In order to do this you will need to install GCP credentials into the new namespace.

### Starting in 0.7: GKE Workload Identity

Starting in 0.7, we use the new GKE feature: [workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity).
This is the recommended way to access GCP APIs from your GKE cluster.
We will no longer download GCP service account key. Instead, we configure a Kubernetes service account (KSA) to act as a GCP service account (GSA).

If you deployed Kubeflow following the GCP instructions then for every profile namespace the profiler controller will automatically 
bind the "default-editor" service account to a default GCP service account created during kubeflow deployment, 
we also create a default profile for cluster admin during kubeflow deployment.
More info for profile [here](https://www.kubeflow.org/docs/other-guides/multi-user-overview/).
As an example, the profile spec looks like:

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

You can verify that there should be a KSA called default-editor, and it has an annotation of the corresponding GSA:

```
kubectl -n ${PROFILE_NAME} describe serviceaccount default-editor

...
Name:        default-editor
Annotations: iam.gke.io/gcp-service-account: ${KFNAME}-user@${PROJECT}.iam.gserviceaccount.com
...
```

You can double check that GSA is also properly setup:

```
gcloud --project=${PROJECT} iam service-accounts get-iam-policy ${KFNAME}-user@${PROJECT}.iam.gserviceaccount.com
```

When a pod uses KSA default-editor, it can access GCP APIs with the role granted to the GSA.

**fine grain access control**:
To control what GCP resources are accessible from a specific profile/namespace, you can explicitly specify which GCP service account to use when creating the profile.

1. for user `user1@email.com`, if you don't already have a GCP service account you want to use, create a new one like: `user1-gcp@<project-id>.iam.gserviceaccount.com`: 
```
gcloud iam service-accounts create user1-gcp@<project-id>.iam.gserviceaccount.com
```

2. Bind necessary roles to the GCP service account to allow `user1` to access GCP resources. For example if user1 need to run bigquery job, we can bgrant access by:
```
gcloud projects add-iam-policy-binding <project-id> \
      --member='serviceAccount:user1-gcp@<project-id>.iam.gserviceaccount.com' \
      --role='roles/bigquery.jobUser'
```

3. [Grant `owner` permission](https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/add-iam-policy-binding) of service account `user1-gcp@<project-id>.iam.gserviceaccount.com` to cluster account `<cluster-name>-admin@<project-id>.iam.gserviceaccount.com`.
```
gcloud iam service-accounts add-iam-policy-binding \
      user1-gcp@<project-id>.iam.gserviceaccount.com \
      --member='serviceAccount:<cluster-name>-admin@<project-id>.iam.gserviceaccount.com' --role='roles/owner'
```

4. Manual create profile for user1, and specify the GCP service account to bind in `plugins` field.

```
apiVersion: kubeflow.org/v1beta1
kind: Profile
metadata:
  name: profileName   # replace with the name of profile you want, this will be user's namespace name
spec:
  owner:
    kind: User
    name: user1@email.com   # replace with the email of the user
  plugins:
  - kind: WorkloadIdentity
    spec:
      gcpServiceAccount: user1-gcp@project-id.iam.gserviceaccount.com
```

More details on workload identity can be found in the official [docs](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity).

### 0.6 and before: GCP Service Account key as secret

When you [set up Kubeflow for GCP](/docs/gke/deploy), it will automatically
[provision three service accounts](https://www.kubeflow.org/docs/gke/deploy/deploy-cli/#gcp-service-accounts)
with different privileges in the `kubeflow` namespace. In particular, the `${KF_NAME}-user` service account is
meant to grant your user services access to GCP. The credentials to this service account can be accessed within
the cluster as a [Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/) called `user-gcp-sa`.

The secret will have basic access to a limited set of GCP services by default, but more roles can be granted through the
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

1. Create a service account with the desired roles
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

2. Download the JSON service account key, set `KEYPATH` to the correct path, and create the key 
```
export KEYPATH=some/path/${SA_NAME}.gcp.json
gcloud --project=${PROJECT_ID} iam service-accounts keys create ${KEYPATH} \
   --iam-account $SA_NAME@$PROJECT_ID.iam.gserviceaccount.com
```

3. Upload the JSON service account key to cluster as a secret
```
kubectl create secret generic user-gcp-sa -n $NAMESPACE \ --from-file=user-gcp-sa.json=${KEYPATH}
```

##### PodDefault Object

The PodDefault object is a way to centrally manage configurations that should be added to all pods.

The PodDefault will match all pods with the specified selector and modify the pods to inject the volumes,
secrets, and environment variables listed in the pod manifest.

Create a pod default in a file called `add-gcp-secret.yaml` and apply it using: `kubectl apply -f add-gcp-secret.yaml -n $NAMESPACE`.
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

1. **Mount the secret as a file.** This will give your Pod access to your GCP account, 
so be careful which Pods you grant access to.
1. **Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable** to point to the service account.
GCP libraries will use this environment variable to find the service account and authenticate with GCP.

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
In [Kubeflow Pipelines](https://www.kubeflow.org/docs/pipelines/), each step describes a 
container that is run independently. If you want to grant access for a single step to use
 one of your service accounts, you can use 
[`kfp.gcp.use_gcp_secret()`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.extensions.html#kfp.gcp.use_gcp_secret).
Examples for how to use this function can be found in the 
[Kubeflow examples repo](https://github.com/kubeflow/examples/blob/871895c54402f68685c8e227c954d86a81c0575f/pipelines/mnist-pipelines/mnist_pipeline.py#L97).

---

## Local Authentication

### gcloud


[The `gcloud` tool](https://cloud.google.com/sdk/gcloud/) is used to interact with Google Cloud Platform (GCP) over the command line. 
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

You can run the following command to verify you are authenticating with the expected account. 
In the output of the command, an asterisk denotes your active account.

```
gcloud auth list
```

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
right roles assigned to it, certain tasks will fail.

You can check if an account has the proper permissions to run a command by building a query structured as
`kubectl auth can-i [VERB] [RESOURCE] --namespace [NAMESPACE]`. For example, the following command will verify
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
