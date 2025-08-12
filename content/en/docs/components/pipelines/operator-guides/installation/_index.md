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
     ```

> 💡 **Troubleshooting**: If you encounter persistent pod crashes (e.g., `proxy-agent`, `workflow-controller`) after applying the default config, you may try using the `platform-agnostic` configuration instead:
>
> ```bash
> kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic?ref=$PIPELINE_VERSION"
> ```
>
> This workaround was verified on Minikube using `v2.0.0`, and aligns with community suggestions in [kubeflow/pipelines#9546](https://github.com/kubeflow/pipelines/issues/9546). It may also help users facing similar pod crash issues in other environments or newer versions.

## Deploying Kubeflow Pipelines in Kubernetes Native API Mode

Kubeflow Pipelines can be deployed in Kubernetes native API mode, which stores pipeline definitions as Kubernetes Custom Resources instead of using external DB storage. This mode provides better integration with Kubernetes native tooling and GitOps workflows.

**⚠️ Version Requirement**: Kubernetes native mode is available starting from Kubeflow Pipelines version 2.14.0.

**⚠️ Prerequisites**: cert-manager is required for this deployment as it provides certificates for the admission webhooks used in pipeline validation.

1. Deploy the Kubeflow Pipelines in Kubernetes Native Mode:

     ```bash
     export PIPELINE_VERSION={{% pipelines/latest-version %}}
     kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
     kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
     kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.18.2/cert-manager.yaml
     kubectl wait --for=condition=Ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s
     kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/cert-manager/platform-agnostic-k8s-native?ref=$PIPELINE_VERSION"
     ```

> 💡 **Alternative**: For multi-user environments with multiple teams or users requiring isolation and RBAC controls on who can access what pipelines, you can use the multi-user Kubernetes native mode:
> ```bash
> kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/cert-manager/platform-agnostic-multi-user-k8s-native?ref=$PIPELINE_VERSION"
> ```

> 💡 **Migration Note**: If you are upgrading from a previous version not deployed in Kubernetes native API mode, consider leveraging the [migration script](https://github.com/kubeflow/pipelines/tree/master/tools/k8s-native) to export all existing pipelines and pipeline versions as Kubernetes manifests which can be applied after upgrading Kubeflow Pipelines.

## Accessing the Kubeflow Pipelines UI

The Kubeflow Pipelines deployment requires approximately 3 minutes to complete.

1. Run the following to port-forward the Kubeflow Pipelines UI:
     ```
     kubectl port-forward -n kubeflow svc/ml-pipeline-ui 8080:80
     ```

2. Open http://localhost:8080 on your browser to see the Kubeflow Pipelines UI.