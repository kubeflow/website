+++
title = "Pipelines Standalone Deployment"
description = "Instructions to deploy Kubeflow Pipelines standalone to a cluster"
weight = 20
+++

As an alternative to [deploying Kubeflow](/docs/started/getting-started/#installing-kubeflow) as a
whole with many components including pipelines, you also have a choice to deploy
only Kubeflow Pipelines. Follow the instructions below to deploy
Kubeflow Pipelines standalone using the supplied kustomize
manifests.

Knowledge about [Kubernetes](https://kubernetes.io/docs/home/), [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) and [kustomize](https://kustomize.io/) will help you understand this
document better and be able to customize your deployment based on your needs.

{{% alert title="Installation outside GCP is also available" color="info" %}}
<p>This guide currently describes how to install Kubeflow Pipelines standalone 
on Google Cloud Platform (GCP). You can also install Kubeflow Pipelines on other
platforms. This guide needs updating. See
<a href="https://github.com/kubeflow/website/issues/1253">issue #1253</a>.</p>
{{% /alert %}}

## Common prerequisites

These are common one time setups you need for all the instructions below:

### Download kubectl CLI tool
Follow the [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

You need kubectl version 1.14 or later, for native support of kustomize.

### Configure kubectl to talk to your cluster
See the Google Kubernetes Engine (GKE) guide to [configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

## Deploying Kubeflow Pipelines standalone to an existing cluster

1. Deploy the latest version of Kubeflow Pipelines:

    ```
    export PIPELINE_VERSION={{% pipelines/latest-version %}}
    kubectl apply -f https://storage.googleapis.com/ml-pipeline/pipeline-lite/$PIPELINE_VERSION/crd.yaml
    kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
    kubectl apply -f https://storage.googleapis.com/ml-pipeline/pipeline-lite/$PIPELINE_VERSION/namespaced-install.yaml
    ```
    **Note**: the above approach is introduced since KFP version 0.2.0. For an older
    version please follow the following commands instead:
    ```
    export PIPELINE_VERSION={{% pipelines/latest-version %}}
    kubectl apply -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
    ```

1. Get the URL for the Kubeflow Pipelines UI :

    ```
    kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
    ```

## Deploying Kubeflow Pipelines standalone from scratch

1. Prepare a Kubernetes cluster:

    See the GKE guide to [creating a cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-cluster) for Google Cloud Platform (GCP).

    Use the following gcloud command to create a cluster that can run all pipeline samples:

    ```
    # The following parameters can be customized based on your needs.

    CLUSTER_NAME="kubeflow-pipelines-standalone"
    ZONE="us-central1-a"
    MACHINE_TYPE="n1-standard-2" # A machine with 2 CPUs and 7.50GB memory
    SCOPES="storage-rw,cloud-platform" # These scopes are needed for running some pipeline samples.

    gcloud container clusters create $CLUSTER_NAME \
        --zone $ZONE \
        --machine-type $MACHINE_TYPE \
        --scopes $SCOPES \
        --num-nodes 2 \
        --max-nodes 5 \
        --min-nodes 2 \
        --enable-autoscaling
    ```
     **WARNING**: Using `SCOPES="storage-rw,cloud-platform"` overgrants all GCP permissions to the cluster, so it's convenient to use. For a more secure cluster setup, refer to [Authenticating Pipelines to GCP](/docs/gke/authentication-pipelines/).

    Reference:

    - You can find available zones in https://cloud.google.com/compute/docs/regions-zones/#available.
    - Get gcloud CLI tool at https://cloud.google.com/sdk/gcloud/.
    - Read `gcloud container clusters create` command documentation at https://cloud.google.com/sdk/gcloud/reference/container/clusters/create.

1. Configure kubectl to talk to your newly created cluster. Refer to [Configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

1. Deploy the latest version of Kubeflow Pipelines standalone to your cluster:

    ```
    export PIPELINE_VERSION={{% pipelines/latest-version %}}
    kubectl apply -f https://storage.googleapis.com/ml-pipeline/pipeline-lite/$PIPELINE_VERSION/crd.yaml
    kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
    kubectl apply -f https://storage.googleapis.com/ml-pipeline/pipeline-lite/$PIPELINE_VERSION/namespaced-install.yaml
    ```

    Kubeflow Pipelines applications take a while (~3 minutes) to start.
    
    **Note**: the above approach is introduced since KFP version 0.2.0. For an older
    version please follow the following commands instead:
    ```
    export PIPELINE_VERSION={{% pipelines/latest-version %}}
    kubectl apply -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
    ```

1. Get public URL of Pipelines UI and use it to access Kubeflow Pipelines:
    ```
    kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
    ```

## Upgrade
1. Configure kubectl to talk to your cluster. Refer to [Configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).
1. Upgrade to a version of Kubeflow Pipelines standalone you choose:
    ```
    export PIPELINE_VERSION=<version-you-want-to-upgrade-to>
    kubectl apply -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
    ```
    Check [Kubeflow Pipelines github repo](https://github.com/kubeflow/pipelines/releases) for available releases.

## Customization

Customization can be done through kustomize [overlays](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/glossary.md#overlay).

Note - The instruction below assume you installed kubectl v1.14.0 or later, which has native support of kustomize.
To get latest kubectl, visit [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

For the following instructions, first clone [Kubeflow Pipelines repo](https://github.com/kubeflow/pipelines),
and use it as working directory.

### Deploy on GCP with CloudSQL and Google Cloud Storage

This is recommended for production environments. See
[here](https://github.com/kubeflow/pipelines/tree/master/manifests/kustomize/env/gcp) for more details.

### Change deployment namespace

To deploy Kubeflow Pipelines standalone in namespace FOO:

1. Edit [dev/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/dev/kustomization.yaml)
    or [gcp/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/gcp/kustomization.yaml)
  namespace section to FOO.
1. Then run

```
kubectl apply -k manifests/kustomize/env/dev
# Or the following if using GCP Cloud SQL + Google Cloud Storage
# kubectl apply -k manifests/kustomize/env/gcp
```

### Disable the public endpoint

By default, the deployment installs an [inverting proxy agent](https://github.com/google/inverting-proxy) that exposes a public URL. If you want to skip installing it,

1. Comment out the proxy component in the [kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/base/kustomization.yaml).
1. Then run:

```
kubectl apply -k manifests/kustomize/env/dev
# Or the following if using GCP Cloud SQL + Google Cloud Storage
# kubectl apply -k manifests/kustomize/env/gcp
```

The UI is still accessible by port-forwarding:

```
kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
```

and open http://localhost:8080/.

## Uninstall

You can uninstall Kubeflow Pipelines by:

1. Configure kubectl to talk to your cluster. Refer to [Configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

1. Uninstall Pipelines:
    ```
    export PIPELINE_VERSION={{% pipelines/latest-version %}}
    kubectl delete -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
    ```

    Or if you deployed through kustomize:

    ```
    kubectl delete -k manifests/kustomize/env/dev
    # Or the following if using GCP Cloud SQL + Google Cloud Storage
    # kubectl delete -k manifests/kustomize/env/gcp
    ```

## Best practices maintaining custom manifests

### Maintain a repo for your manifests

Save the following to a source controlled repo.

File `kustomization.yaml`.
```
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
# Edit the following to change the deployment to your custom namespace.
namespace: kubeflow
# You can add other customizations here using kustomize.
# Edit ref in the following link to deploy a different version of Kubeflow Pipelines.
bases:
- github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref={{% pipelines/latest-version %}}
```

### How to deploy, upgrade and uninstall using the repo
Deploy: `kubectl apply -k $YOUR_REPO`

Upgrade:

   1. (Recommended) Back up your data storages for KFP.
   1. Edit `ref={{% pipelines/latest-version %}}` to a version you want to upgrade to.

        Check [Kubeflow Pipelines github repo](https://github.com/kubeflow/pipelines/releases) for available releases.
   1. Deploy: `kubectl apply -k $YOUR_REPO`.

Uninstall: `kubectl delete -k $YOUR_REPO`.

### Further reading
* kustomize's [recommended workflow using an off-the-shelf configuration](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/workflows.md#off-the-shelf-configuration).

## Troubleshooting

### Permission error installing Kubeflow Pipelines standalone to a cluster

Run:

```
kubectl create clusterrolebinding your-binding --clusterrole=cluster-admin --user=[your-user-name]
```
