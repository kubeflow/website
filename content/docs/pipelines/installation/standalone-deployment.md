+++
title = "Kubeflow Pipelines Standalone Deployment"
description = "Instructions to deploy Kubeflow Pipelines standalone to a cluster"
weight = 20
+++

As an alternative to deploying Kubeflow Pipelines (KFP) as part of the
[Kubeflow deployment](/docs/started/getting-started/#installing-kubeflow), you also have a choice
to deploy only Kubeflow Pipelines. Follow the instructions below to deploy
Kubeflow Pipelines standalone using the supplied kustomize manifests.

You should be familiar with [Kubernetes](https://kubernetes.io/docs/home/),
[kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and [kustomize](https://kustomize.io/).

{{% alert title="Installation options for Kubeflow Pipelines standalone" color="info" %}}
This guide currently describes how to install Kubeflow Pipelines standalone
on Google Cloud Platform (GCP). You can also install Kubeflow Pipelines standalone on other
platforms. This guide needs updating. See [Issue 1253](https://github.com/kubeflow/website/issues/1253).
{{% /alert %}}

## Before you get started

Working with Kubeflow Pipelines Standalone requires a Kubernetes cluster as well as an installation of kubectl.

### Download and install kubectl

Download and install kubectl by following the [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

You need kubectl version 1.14 or higher for native support of kustomize.

### Set up your cluster

If you have an existing Kubernetes cluster, continue with the instructions for [configuring kubectl to talk to your cluster](#configure-kubectl).

See the GKE guide to [creating a cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-cluster) for Google Cloud Platform (GCP).

Use the [gcloud container clusters create command](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create) to create a cluster that can run all Kubeflow Pipelines samples:
```
# The following parameters can be customized based on your needs.

CLUSTER_NAME="kubeflow-pipelines-standalone"
ZONE="us-central1-a"
MACHINE_TYPE="n1-standard-2" # A machine with 2 CPUs and 7.50GB memory
SCOPES="cloud-platform" # This scope is needed for running some pipeline samples. Read the warning below for its security implication

gcloud container clusters create $CLUSTER_NAME \
     --zone $ZONE \
     --machine-type $MACHINE_TYPE \
     --scopes $SCOPES
```

**Warning**: Using `SCOPES="cloud-platform"` grants all GCP permissions to the cluster. For a more secure cluster setup, refer to [Authenticating Pipelines to GCP](/docs/gke/authentication/#authentication-from-kubeflow-pipelines).

Note, some legacy pipeline examples may need minor code change to run on clusters with `SCOPES="cloud-platform"`, refer to [Authoring Pipelines to use default service account](/docs/gke/pipelines/authentication-pipelines/#authoring-pipelines-to-use-default-service-account).

**References**:

  * [GCP regions and zones documentation](https://cloud.google.com/compute/docs/regions-zones/#available)

  * [gcloud command-line tool guide](https://cloud.google.com/sdk/gcloud/)

  * [gcloud command reference](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create)

### Configure kubectl to talk to your cluster {#configure-kubectl}

See the Google Kubernetes Engine (GKE) guide to
[configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

## Deploying Kubeflow Pipelines

1. Deploy the Kubeflow Pipelines:

     ```
     export PIPELINE_VERSION={{% pipelines/latest-version %}}
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION
     kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     ```

     The Kubeflow Pipelines deployment requires approximately 3 minutes to complete.

     **Note**: The above commands apply to Kubeflow Pipelines version 0.4.0 and higher.

     For Kubeflow Pipelines version 0.2.0 ~ 0.3.0, use:
     ```
     export PIPELINE_VERSION=<kfp-version-between-0.2.0-and-0.3.0>
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/base/crds?ref=$PIPELINE_VERSION
     kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     ```

     For Kubeflow Pipelines version < 0.2.0, use:
     ```
     export PIPELINE_VERSION=<kfp-version-0.1.x>
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     ```

     **Note**: `kubectl apply -k` accepts local paths and paths that are formatted as [hashicorp/go-getter URLs](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/remoteBuild.md#url-format). While the paths in the preceding commands look like URLs, the paths are not valid URLs.

1. Get the public URL for the Kubeflow Pipelines UI and use it to access the Kubeflow Pipelines UI:

     ```
     kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
     ```

## Upgrading Kubeflow Pipelines

1. Check the [Kubeflow Pipelines GitHub repository](https://github.com/kubeflow/pipelines/releases) for available releases.

1. To upgrade to Kubeflow Pipelines 0.4.0 and higher, use the following commands:
     ```
     export PIPELINE_VERSION=<version-you-want-to-upgrade-to>
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION
     kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     ```

     To upgrade to Kubeflow Pipelines 0.3.0 and lower, use the [deployment instructions](#deploying-kubeflow-pipelines) to upgrade your Kubeflow Pipelines cluster.

1. Delete obsolete resources manually.

     Depending on the version you are upgrading from and the version you are upgrading to,
     some Kubeflow Pipelines resources may have become obsolete.

     If you are upgrading from Kubeflow Pipelines < 0.4.0 to 0.4.0 or above, you can remove the
     following obsolete resources after the upgrade:
     `metadata-deployment`, `metadata-service`.

     Run the following command to check if these resources exist on your cluster:
     ```
     kubectl -n <KFP_NAMESPACE> get deployments | grep metadata-deployment
     kubectl -n <KFP_NAMESPACE> get service | grep metadata-service
     ```

     If these resources exist on your cluster, run the following commands to delete them:
     ```
     kubectl -n <KFP_NAMESPACE> delete deployment metadata-deployment
     kubectl -n <KFP_NAMESPACE> delete service metadata-service
     ```

     For other versions, you don't need to do anything.

## Customizing Kubeflow Pipelines

Kubeflow Pipelines can be configured through kustomize [overlays](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/glossary.md#overlay).

To begin, first clone the [Kubeflow Pipelines GitHub repository](https://github.com/kubeflow/pipelines),
and use it as your working directory.

### Deploy on GCP with CloudSQL and Google Cloud Storage

**Note**: This is recommended for production environments. For more details about customizing your environment
for GCP, see the [Kubeflow Pipelines GCP manifests](https://github.com/kubeflow/pipelines/tree/master/manifests/kustomize/env/gcp).

### Change deployment namespace

To deploy Kubeflow Pipelines standalone in namespace `<my-namespace>`:

1. Set the `namespace` field to `<my-namespace>` in
   [dev/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/dev/kustomization.yaml) or
   [gcp/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/gcp/kustomization.yaml).

1. Apply the changes to update the Kubeflow Pipelines deployment:

     ```
     kubectl apply -k manifests/kustomize/env/dev
     ```

     **Note**: If using GCP Cloud SQL and Google Cloud Storage, apply with this command:

     ```
     kubectl apply -k manifests/kustomize/env/gcp
     ```

### Disable the public endpoint

By default, the KFP standalone deployment installs an [inverting proxy agent](https://github.com/google/inverting-proxy) that exposes a public URL. If you want to skip the installation of the inverting proxy agent, complete the following:

1. Comment out the proxy components in the base [kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/base/kustomization.yaml).

1. Apply the changes to update the Kubeflow Pipelines deployment:

     ```
     kubectl apply -k manifests/kustomize/env/dev
     ```

     **Note**: If using GCP Cloud SQL and Google Cloud Storage, apply with this command:

     ```
     kubectl apply -k manifests/kustomize/env/gcp
     ```

1. Verify that the Kubeflow Pipelines UI is accessible by port-forwarding:

     ```
     kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
     ```

1. Open the Kubeflow Pipelines UI at `http://localhost:8080/`.

## Uninstalling Kubeflow Pipelines

To uninstall Kubeflow Pipelines, run `kubectl delete -k <manifest-file>`.

For example, to uninstall KFP using manifests from a GitHub repository, run:

```
export PIPELINE_VERSION={{% pipelines/latest-version %}}
kubectl delete -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
kubectl delete -k github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION
```

To uninstall KFP using manifests from your local repository or file system, run:

```
kubectl delete -k manifests/kustomize/env/dev
kubectl delete -k manifests/kustomize/cluster-scoped-resources
```

**Note**: If you are using GCP Cloud SQL and Google Cloud Storage, run:

```
kubectl delete -k manifests/kustomize/env/gcp
kubectl delete -k manifests/kustomize/cluster-scoped-resources
```

## Best practices for maintaining manifests

Similar to source code, configuration files belong in source control.
A repository manages the changes to your
manifest files and ensures that you can repeatedly deploy, upgrade,
and uninstall your components.

### Maintain your manifests in source control

After creating or customizing your deployment manifests, save your manifests
to a local or remote source control respository.
For example, save the following `kustomization.yaml`:

```
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
# Edit the following to change the deployment to your custom namespace.
namespace: kubeflow
# You can add other customizations here using kustomize.
# Edit ref in the following link to deploy a different version of Kubeflow Pipelines.
bases:
- github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref={{% pipelines/latest-version %}}
```

### Further reading

* To learn about kustomize workflows with off-the-shelf configurations, see the
[kustomize configuration workflows guide](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/workflows.md#off-the-shelf-configuration).

* Read [Authenticating Pipelines to GCP](/docs/gke/authentication/#authentication-from-kubeflow-pipelines#authoring-pipelines-to-use-workload-identity) if you want to use GCP services in Kubeflow Pipelines.

## Troubleshooting

* If your pipelines are stuck in ContainerCreating state and it has pod events like
```
MountVolume.SetUp failed for volume "gcp-credentials-user-gcp-sa" : secret "user-gcp-sa" not found
```

You should remove `use_gcp_secret` usages as documented in [Authenticating Pipelines to GCP](/docs/gke/pipelines/authentication-pipelines/#authoring-pipelines-to-use-workload-identity).
