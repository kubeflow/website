+++
title = "Pipelines Standalone Deployment in GCP"
description = "Instructions to deploy Kubeflow Pipelines standalone to a cluster"
weight = 15
+++

As an alternative to [deploying Kubeflow](/docs/started/getting-started/#installing-kubeflow) as a
whole with many components including pipelines, you also have a choice to deploy
only Kubeflow Pipelines. Follow the instructions below to deploy
Kubeflow Pipelines standalone using the supplied kustomize
manifests.

Knowledge about [Kubernetes](https://kubernetes.io/docs/home/), [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) and [kustomize](https://kustomize.io/) will help you understand this
document better and be able to customize based on your needs.

## Deploying Kubeflow Pipelines standalone to an existing cluster

1. Deploy latest version of Kubeflow Pipelines:

    ```
    export PIPELINE_VERSION={{% kfp-latest-version %}}
    kubectl apply -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
    ```

1. Get the URL for the Kubeflow Pipelines UI :

    ```
    kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
    ```

## Deploying Kubeflow Pipelines standalone from scratch

1. Prepare a Kubernetes cluster:

    You can reference [Creating a cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-cluster) for Google Cloud Platform (GCP).

    Recommend using the following gcloud command to create a cluster that can run all pipeline samples:

    ```
    # The following parameters can be customized based on your needs.

    CLUSTER_NAME="kubeflow-pipelines-standalone"
    ZONE="us-central1-a"
    MACHINE_TYPE="n1-standard-2" # A machine with 2 CPUs and 7.50GB memory
    SCOPES="storage-rw,cloud-platform" # These scopes are needed for running some pipeline samples

    gcloud container clusters create $CLUSTER_NAME \
        --zone $ZONE \
        --machine-type $MACHINE_TYPE \
        --scopes $SCOPES \
        --num-nodes 2 \
        --max-nodes 5 \
        --min-nodes 2 \
        --enable-autoscaling
    ```

    Reference:

    - You can find available zones in https://cloud.google.com/compute/docs/regions-zones/#available.
    - Get gcloud CLI tool at https://cloud.google.com/sdk/gcloud/.
    - Read `gcloud container clusters create` command documentation at https://cloud.google.com/sdk/gcloud/reference/container/clusters/create.

1. Download kubectl CLI tool:

    You can get kubectl from [its official doc](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

    You need kubectl version 1.14 or later, for native support of kustomize (the `kubectl apply -k` option you will see below).

1. Configure kubectl to talk to your cluster:

    You can reference [Configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

1. Deploy latest version of Kubeflow Pipelines standalone to your cluster:

    ```
    export PIPELINE_VERSION={{% kfp-latest-version %}}
    kubectl apply -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
    ```

    Kubeflow Pipelines applications take a while (~3 minutes) to start.

1. Get public URL of Pipelines UI and use it to access Kubeflow Pipelines:
    ```
    kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com
    ```

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

- Edit [dev/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/dev/kustomization.yaml)
    or [gcp/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/gcp/kustomization.yaml)
  namespace section to FOO.
- Then run

```
kubectl apply -k manifests/kustomize/env/dev
# Or the following if using GCP Cloud SQL + Google Cloud Storage
# kubectl apply -k manifests/kustomize/env/gcp
```

### Disable the public endpoint

By default, the deployment installs an [inverting proxy agent](https://github.com/google/inverting-proxy) that exposes a public URL. If you want to skip installing it,

- Comment out the proxy component in the [kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/base/kustomization.yaml).
- Then run:

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

You can uninstall Kubeflow Pipelines by running:

```
export PIPELINE_VERSION={{% kfp-latest-version %}}
kubectl delete -k github.com/kubeflow/pipelines//manifests/kustomize/env/dev?ref=$PIPELINE_VERSION
```

Or if you deployed through kustomize:

```
kubectl delete -k manifests/kustomize/env/dev
# Or the following if using GCP Cloud SQL + Google Cloud Storage
# kubectl delete -k manifests/kustomize/env/gcp
```

## Troubleshooting

### Permission error installing Kubeflow Pipelines standalone to a cluster

Run:

```
kubectl create clusterrolebinding your-binding --clusterrole=cluster-admin --user=[your-user-name]
```

### Pipeline samples that require "user-gcp-sa" secret

If sample pipeline requires a "user-gcp-sa" secret, you could create one by:

- First download the GCE VM service account token [Document](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys):

    ```
    gcloud iam service-accounts keys create application_default_credentials.json \
      --iam-account [SA-NAME]@[PROJECT-ID].iam.gserviceaccount.com
    ```

- Run:
    ```
    kubectl create secret -n [your-namespace] generic user-gcp-sa \
      --from-file=user-gcp-sa.json=application_default_credentials.json
    ```
