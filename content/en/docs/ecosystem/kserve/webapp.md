+++
title = "KServe UI"
description = "An overview of the KServe UI"
weight = 2
+++

## What is the KServe UI?

The [KServe UI](https://github.com/kserve/models-web-app) is a component of KServe that provides a user-friendly way to handle the lifecycle of `InferenceService` CRs in a Kubeflow cluster.
This allows users to create, delete, and inspect the state of their Model Servers without needing to interact with Kubernetes resources directly.
The UI is [included as a part of the `kubeflow/community-distribution`](https://github.com/kubeflow/community-distribution/tree/master/applications/kserve/kserve-ui).
It is exposed as a menu link in the Kubeflow Central Dashboard by default.
To see how the UI is installed and verified, refer to the [`tests/kserve_install.sh`](https://github.com/kubeflow/community-distribution/blob/master/tests/kserve_install.sh) script, which the [`Test KServe`](https://github.com/kubeflow/community-distribution/blob/master/.github/workflows/kserve_test.yaml) workflow runs in CI.

## Usage

The UI exposes information from the underlying Knative resources, like Conditions from the Knative Configurations, Route and Revisions as well as live logs from the Model server pod.

### Listing

The main page of the UI provides a list of all the InferenceServices that are deployed in the selected Namespace.
The frontend periodically polls the backend for the latest state of InferenceServices.

<img src="/docs/ecosystem/kserve/pics/webapp-list.png" 
     alt="Models web app main page" 
     class="mt-3 mb-3 border rounded">
</img>

### Creating

The page for creating a new InferenceService.
The user can paste the YAML object of the InferenceService they wish to create.

Note that the backend will override the provided `.metadata.namespace` field of the submitted object, to prevent users from trying to create InferenceServices in other namespaces.

<img src="/docs/ecosystem/kserve/pics/webapp-new.png" 
     alt="Models web app create page" 
     class="mt-3 mb-3 border rounded">
</img>

### Deleting

Users can delete an existing InferenceService by clicking on the <i class="fas fa-trash"></i> icon next to an InferenceService, in the main page that lists all the namespaced resources.

{{% alert title="Note" color="info" %}}
The backend is using [foreground cascading deletion](https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/#foreground-cascading-deletion) when deleting an InferenceService.
This means that the InferenceService CR will be deleted from the K8s API Server only once the underlying resources have been deleted.
{{% /alert %}}

### Inspecting

Users can click on the name of an InferenceService, from the main page, and view a more detailed summary of the CR's state.

<img src="/docs/ecosystem/kserve/pics/webapp-overview.png" 
     alt="Models web app overview page" 
     class="mt-3 mb-3 border rounded">
</img>

{{% alert title="Note" color="info" %}}
To gather the logs the backend will:

1. Filter all the pods that have a `serving.knative.dev/revision` label
2. Get the logs from the `kserve-container`
   {{% /alert %}}

## Metrics

As mentioned in the above sections the UI allows users to inspect the metrics from the InferenceService.
This tab will **not** be enabled by default.
In order to expose it the users will need to install Grafana and Prometheus.

Currently, the frontend is expecting to find a Grafana exposed in the `/grafana` prefix.
This Grafana instance will need to have specific dashboards in order for the app to embed them in iframes.
We are working on making this more generic to allow people to expose their own graphs.

You can install Grafana and Prometheus, for the UI to consume, by installing:

1. the `monitoring-core.yaml` and `monitoring-metrics-prometheus.yaml` files from the [Knative 0.21 release](https://github.com/knative/serving/releases/tag/v0.21.0)
2. the following yaml files for exposing Grafana outside the cluster, by allowing **anonymous access**

{{< blocks/tabs name="grafana-installation-yamls" >}}
{{{< blocks/tab name="ConfigMap" codelang="yaml" >}}
apiVersion: v1
kind: ConfigMap
metadata:
name: grafana-custom-config
namespace: knative-monitoring
labels:
serving.knative.dev/release: "v0.21.0"
data:
custom.ini: | # You can customize Grafana via changing the context of this field.
[auth.anonymous] # enable anonymous access
enabled = true
[security]
allow_embedding = true
[server]
root_url = "/grafana"
serve_from_sub_path = true
{{< /blocks/tab >}}
{{< blocks/tab name="VirtualService" codelang="yaml" >}}
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
name: grafana
namespace: knative-monitoring
spec:
gateways:

- kubeflow/kubeflow-gateway
  hosts:
- '\*'
  http:
- match: - uri:
  prefix: /grafana/
  route: - destination:
  host: grafana.knative-monitoring.svc.cluster.local
  port:
  number: 30802
  {{< /blocks/tab >}}}
  {{< blocks/tab name="AuthorizationPolicy" codelang="yaml" >}}
  apiVersion: security.istio.io/v1beta1
  kind: AuthorizationPolicy
  metadata:
  name: models-web-application
  namespace: kubeflow
  spec:
  action: ALLOW
  rules:
- from: - source:
  principals: - cluster.local/ns/istio-system/sa/istio-ingressgateway-service-account
  selector:
  matchLabels:
  kustomize.component: kserve-models-web-application
  app.kubernetes.io/component: kserve-models-web-application
  {{< /blocks/tab >}}}
  {{< /blocks/tabs >}}

After applying these YAMLs, and ensuring the Grafana instance is exposed under `/grafana` the UI will show the `METRICS` tab.

<img src="/docs/ecosystem/kserve/pics/webapp-metrics.png" 
     alt="Models web app metrics page" 
     class="mt-3 mb-3 border rounded">
</img>
