+++
title = "Installation"
weight = 1
+++

{{% kfp-v2-keywords %}}

As an alternative to deploying Kubeflow Pipelines (KFP) as part of the
[Kubeflow deployment](/docs/started/installing-kubeflow), you also have a choice
to deploy only Kubeflow Pipelines. Follow the instructions below to deploy
Kubeflow Pipelines standalone using the supplied kustomize manifests.

You should be familiar with [Kubernetes](https://kubernetes.io/docs/home/),
[kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and [kustomize](https://kustomize.io/).

## Deploying Kubeflow Pipelines

1. Deploy the Kubeflow Pipelines:

     ```
     export PIPELINE_VERSION={{% pipelines/latest-version %}}
     kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
     kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
     kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/dev?ref=$PIPELINE_VERSION" 

> **Note:** The placeholder `{{% pipelines/latest-version %}}` automatically resolves to the latest Kubeflow Pipelines release (e.g., `2.5.0`).  
> Users don’t need to manually update this value each time a new release is published.

     ```

> 💡 **Troubleshooting**: If you encounter persistent pod crashes (e.g., `proxy-agent`, `workflow-controller`) after applying the default config, you may try using the `platform-agnostic` configuration instead:
>
> ```bash
> kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic?ref=$PIPELINE_VERSION"
> ```
>
> This workaround was verified on Minikube using `v2.0.0`, and aligns with community suggestions in [kubeflow/pipelines#9546](https://github.com/kubeflow/pipelines/issues/9546). It may also help users facing similar pod crash issues in other environments or newer versions.

The Kubeflow Pipelines deployment requires approximately 3 minutes to complete.

1. Run the following to port-forward the Kubeflow Pipelines UI:
     ```
     kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
     ```

2. Open http://localhost:8080 on your browser to see the Kubeflow Pipelines UI.
