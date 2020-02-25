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

Working with Kubeflow Pipelines requires a Kubernetes cluster as well as an installation of kubectl.

### Download and install kubectl

Download and install kubectl by following the [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

You need kubectl version 1.14 or later for native support of kustomize.

### Set up your cluster

If you have an existing Kubernetes cluster, continue with the instructions for [deploying Kubeflow Pipelines](#deploying-kubeflow-pipelines). To create a new Kubernetes cluster, run the following:

1. Prepare a Kubernetes cluster:

    See the GKE guide to [creating a cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-cluster) for Google Cloud Platform (GCP).

    Use the [gcloud container clusters create command](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create) to create a cluster that can run all Kubeflow Pipelines samples:

    ```
    # The following parameters can be customized based on your needs.

    CLUSTER_NAME="kubeflow-pipelines-standalone"
    ZONE="us-central1-a"
    MACHINE_TYPE="n1-standard-2" # A machine with 2 CPUs and 7.50GB memory
    SCOPES="cloud-platform" # These scopes are needed for running some pipeline samples

    gcloud container clusters create $CLUSTER_NAME \
        --zone $ZONE \
        --machine-type $MACHINE_TYPE \
        --scopes $SCOPES
    ```

     **Warning**: Using `SCOPES="cloud-platform"` grants all GCP permissions to the cluster. For a more secure cluster setup, refer to [Authenticating Pipelines to GCP](/docs/gke/authentication/#authentication-from-kubeflow-pipelines).

     **References**:

      * [GCP regions and zones documentation](https://cloud.google.com/compute/docs/regions-zones/#available)

      * [gcloud command-line tool guide](https://cloud.google.com/sdk/gcloud/)

      * [gcloud command reference](https://cloud.google.com/sdk/gcloud/reference/container/clusters/create)

1. Configure kubectl to talk to your newly created cluster. See the Google Kubernetes Engine (GKE) guide to
[configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

## Deploying Kubeflow Pipelines

1. Deploy the latest version of Kubeflow Pipelines:

     **Note**: The following commands apply to Kubeflow Pipelines version 0.2.0 and later.

     ```
     export PIPELINE_VERSION={{% pipelines/latest-version %}}
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/base/crds?ref=$PIPELINE_VERSION
     kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     ```

     The Kubeflow Pipelines deployment requires approximately 3 minutes to complete.

     **Note**: To deploy versions of Kubeflow Pipelines prior to version 0.2.0, run:

     ```
     export PIPELINE_VERSION=<kfp-version>
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     ```

     **Note**: `kubectl apply -k` accepts local paths and paths that are formatted as [hashicorp/go-getter URLs](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/remoteBuild.md#url-format). While the paths in the preceding commands look like URLs, the paths are not valid URLs.

1. Get the public URL for the Kubeflow Pipelines UI and use it to access the Kubeflow Pipelines UI:

     ```
     kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
     ```

## Upgrading Kubeflow Pipelines

1. Check the [Kubeflow Pipelines GitHub repository](https://github.com/kubeflow/pipelines/releases) for available releases.

1. Upgrade to a version of Kubeflow Pipelines standalone:

     ```
     export PIPELINE_VERSION=<version-you-want-to-upgrade-to>
     kubectl apply -k github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     ```

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
kubectl delete -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
```

To uninstall KFP using manifests from your local repository or file system, run:

```
kubectl delete -k manifests/kustomize/env/dev
```

**Note**: If you are using GCP Cloud SQL and Google Cloud Storage, run:

```
kubectl delete -k manifests/kustomize/env/gcp
```

## Best practices for maintaining manifests

Similar to source code, your configuration files belong in source control.
After storing your manifests in a repository, you can repeatedly deploy, upgrade,
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

### Use a repository to deploy, upgrade, and uninstall Kubeflow Pipelines

**Note**: The following commands reference an existing repository.

**Caution**: For upgrades, it is recommended to back up your data storage for Kubeflow Pipelines.

To deploy Kubeflow Pipelines using a repository, run:

```
export PIPELINE_VERSION=<kfp-version>
export KFP_MANIFESTS_REPO_LINK=github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
kubectl apply -k $KFP_MANIFESTS_REPO_LINK
```

To upgrade your Kubeflow Pipelines deployment from a repository, follow these steps:

1. Check [Kubeflow Pipelines GitHub repository](https://github.com/kubeflow/pipelines/releases) for available releases.
1. Set the `PIPELINE_VERSION` environment variable to a version you want to upgrade to.
1. Upgrade Kubeflow Pipelines by running:

     ```
     export PIPELINE_VERSION=<version-you-want-to-upgrade-to>
     export KFP_MANIFESTS_REPO_LINK=github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
     kubectl apply -k $KFP_MANIFESTS_REPO_LINK
     ```

To uninstall Kubeflow Pipelines using a repository, run:

```
export PIPELINE_VERSION=<kfp-version>
export KFP_MANIFESTS_REPO_LINK=github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
kubectl delete -k $KFP_MANIFESTS_REPO_LINK
```

### Further reading

To learn about kustomize workflows with off-the-shelf configurations, see the
[kustomize configuration workflows guide](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/workflows.md#off-the-shelf-configuration).

## Troubleshooting

If you encounter a permission error when installing Kubeflow Pipelines standalone, run:

```
kubectl create clusterrolebinding your-binding --clusterrole=cluster-admin --user=<your-user-name>
```
