+++
title = "Deploy Kubeflow Pipelines Alternatives"
description = "Alternative approaches to deploy just Pipelines to a cluster"
weight = 15
+++

Kubeflow Pipelines has kustomize manifests for lite deployment solution. You can
follow the instruction to deploy Kubeflow Pipelines (without other components of
Kubeflow) in an existing cluster.

Knowledge about Kubernetes, kubectl and kustomize will help you understand this
document.


## TL;DR

To deploy Kubeflow Pipelines in an existing Kubernetes cluster, do the following:

1. Deploy latest version of Kubeflow Pipelines
```
export PIPELINE_VERSION=0.1.31
kubectl apply -f https://storage.googleapis.com/ml-pipeline/pipeline-lite/$PIPELINE_VERSION/namespaced-install.yaml
```

2. Get the Pipeline UI URL
```
kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com 
```

## Step by step tutorial to deploy Pipelines from scratch

1. Prepare a Kubernetes cluster

    You have many options from cloud service providers. For GCP, you can reference
    [Creating a cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-cluster).

    Cluster minimum requirement: node pool with at least 2 nodes and 2 CPUs per node.

1. Download kubectl CLI tool

    You can get kubectl from [its official doc](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

1. Configure kubectl to talk to your cluster

    For GCP, you can reference [Configuring cluster access for kubectl](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl)

1. Deploy latest version of Kubeflow Pipelines Lite to your cluster

    ```
    export PIPELINE_VERSION=0.1.31
    kubectl apply -f kubectl apply -f https://storage.googleapis.com/ml-pipeline/pipeline-lite/$PIPELINE_VERSION/namespaced-install.yaml
    ```

    Kubeflow pipelines applications take a while (~3 minutes) to start.

1. Get public URL of Pipelines UI and use it to use Kubeflow Pipelines
    ```
    kubectl describe configmap inverse-proxy-config -n kubeflow | grep googleusercontent.com 
    ```


## Customization
Customization can be done through Kustomize [Overlay](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/glossary.md#overlay). 

Note - The instruction below assume you installed kubectl v1.14.0 or later, which has native support of kustomize.
To get latest kubectl, visit [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Deploy on GCP with CloudSQL and GCS
This is recommended for production environments. See
[here](https://github.com/kubeflow/pipelines/tree/master/manifests/kustomize/env/gcp) for more details. 

### Change deploy namespace
To deploy Kubeflow Pipelines in namespace FOO,
- Edit [dev/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/dev/kustomization.yaml)
or [gcp/kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/env/gcp/kustomization.yaml)
namespace section to FOO
- Then run 
```
kubectl apply -k $PIPELINES_REPO/manifests/kustomize/env/dev # or other env of your choice
```

### Disable the public endpoint
By default, the deployment install an [invert proxy agent](https://github.com/google/inverting-proxy) that exposes a public URL. If you want to skip installing it,
- Comment out the proxy component in the [kustomization.yaml](https://github.com/kubeflow/pipelines/blob/master/manifests/kustomize/base/kustomization.yaml).
- Then run 
```
kubectl apply -k $PIPELINES_REPO/manifests/kustomize/env/dev # or other env of your choice
```

The UI is still accessible by port-forwarding
```
kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
```
and open http://localhost:8080/



## Uninstall
You can uninstall Kubeflow Pipelines by running
```
export PIPELINE_VERSION=0.1.31
kubectl delete -f https://raw.githubusercontent.com/kubeflow/pipelines/$PIPELINE_VERSION/manifests/kustomize/namespaced-install.yaml
```

Or if you deploy through kustomize
```
kubectl kustomize env/dev | kubectl delete -f -
# or
kubectl kustomize env/gcp | kubectl delete -f -
```

## Troubleshooting

### Permission error installing Kubeflow Pipelines to a cluster
Run 
```
kubectl create clusterrolebinding your-binding --clusterrole=cluster-admin --user=[your-user-name]
```

### Samples requires "user-gcp-sa" secret
If sample code requires a "user-gcp-sa" secret, you could create one by 
- First download the GCE VM service account token [Document](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys)
```
gcloud iam service-accounts keys create application_default_credentials.json \
  --iam-account [SA-NAME]@[PROJECT-ID].iam.gserviceaccount.com
```
- Run
```
kubectl create secret -n [your-namespace] generic user-gcp-sa --from-file=user-gcp-sa.json=application_default_credentials.json
```
