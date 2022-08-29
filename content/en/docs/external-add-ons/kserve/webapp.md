+++
title = "Models UI"
description = "Web app for managing Model servers"
weight = 2

+++

The Models web app is responsible for allowing the user to manipulate the Model Servers in their Kubeflow cluster. To achieve this it provides a user friendly way to handle the lifecycle of `InferenceService` CRs.

The web app currently works with `v1beta1` versions of `InferenceService` objects.

The web app is also exposing information from the underlying Knative resources,
like Conditions from the Knative Configurations, Route and Revisions as well as
live logs from the Model server pod.

## Installation and Access

Refer https://github.com/kserve/models-web-app/#development for installation

The web app includes the following resources:
* A `Deployment` for running the backend server, and serving the static frontend files
* A `Service` for configuring the incluster network traffic
* A `ServiceAccount` and `ClusterRole{Binding}` to give the necessary
    permissions to the web app's Pod
* A `VirtualService` for exposing the app via the cluster's Istio Ingress
    Gateway

### Kubeflow

The web app is included as a part of the Kubeflow [1.5
release](https://github.com/kubeflow/manifests/tree/v1.5-branch/contrib/kserve/models-web-app) manifests.
It is [exposed](https://github.com/kubeflow/manifests/blob/v1.5-branch/apps/centraldashboard/upstream/base/configmap.yaml#L30) via the
Central Dashboard, out of the box.

### Standalone

In this case all the resources of the web app will be installed in the
`kserve` namespace. Users can access the web app either via the
`knative-ingress-gateway.knative-serving` Istio Ingress Gateway or by
port-forwarding the backend.

#### Port forwarding
```bash
# set the following ENV vars in the app's Deployment
kubectl edit -n kserve deployments.apps kserve-models-web-app
# APP_PREFIX: /
# APP_DISABLE_AUTH: "True"
# APP_SECURE_COOKIES: "False"

# expose the app under localhost:5000
kubectl port-forward -n kserve svc/kserve-models-web-app 5000:80
```

## Authorization

### SubjectAccessReviews

The web app has a mechanism for performing authentication and authorization
checks, to ensure that user actions are compliant with the cluster's RBAC,
which is only enabled in the _kubeflow_ manifests of the app. This mechanism
can be toggled by leveraging the `APP_DISABLE_AUTH: "True" | "False"` ENV Var.

This mechanism is only enabled in the _kubeflow_ manifests since in a Kubeflow
installation all requests that end up in the web app's Pod will also contain a custom
header that denotes the user. In a Kubeflow installation there's an authentication
component in front of the cluster that ensures only logged in users can
access the cluster's services. In the standalone mode such a
component might not always be deployed.

The web app will be using the value from this custom header to extract the name
of the [K8s
user](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)
that made the request. Then it will create a
[SubjectAccessReview](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#determine-whether-a-request-is-allowed-or-denied)
to check if the user has permissions to perform the specific action, for
example deleting an InferenceService in a namespace.

{{% alert title="Tip" color="info" %}}
If you are port-forwarding the app via __kubectl port-forward__ then you will
need to set __APP_DISABLE_AUTH="True"__ in the web app's Deployment. When
port-forwarding the authentication header will not be set, which will result in the
web app raising __401__ errors.
{{% /alert %}}

### Namespace selection

Both in _standalone_ and in _kubeflow_ setups the user needs to be able to
select a Namespace in order to interact with the InferenceServices in it.

In _standalone_ mode the web app will show a dropdown that will show all the
namespaces to the user and allow them to select any of them. The backend will
make a LIST request to the API Server to get all the namespaces. In this case
the only authorization check that takes place is in the K8s API Server that
ensures the [web app Pod's
ServiceAccount](https://github.com/kserve/models-web-app/blob/release-0.7/config/base/rbac.yaml)
has permissions to list namespaces.

In _kubeflow_ mode the [Central
Dashboard](/docs/components/central-dash/overview/) is responsible for the
Namespace selection. Once the user selects a namespace then the Dashboard will
inform the iframed Models web app about the newly selected namespace. The
Models web app itself won't expose a dropdown namespace selector in this mode.

## Use Cases

Currently users can do the following workflows via this web app:
* See a list of the existing InferenceService CRs in a Namespace
* Create a new InferenceService by providing a YAML
* Inspect an InferenceService
    * View the live status of the InferenceService
    * Inspect the K8s Conditions of the underlying Knative resources
    * View the logs of the created Model server Pod, for that InferenceService
    * Inspect the YAML contents as they are stored in the K8s API Server
    * View some basic metrics

### Listing

The main page of the app provides a list of all the InferenceServices that are
deployed in the selected Namespace. The frontend periodically polls the backend
for the latest state of InferenceServices.

<img src="/docs/external-add-ons/kserve/pics/webapp-list.png" alt="Models web app main page">

### Creating

The page for creating a new InferenceService. The user can paste the YAML
object of the InferenceService they wish to create.

Note that the backend will override the provided `.metadata.namespace` field of
the submitted object, to prevent users from trying to create InferenceServices
in other namespaces.

<img src="/docs/external-add-ons/kserve/pics/webapp-new.png" alt="Models web app create page">

### Deleting

Users can delete an existing InferenceService by clicking on the
<i class="fas fa-trash"></i> icon next to an InferenceService, in the main page
that lists all the namespaced resources.

{{% alert title="Note" color="info" %}}
The backend is using [foreground cascading
deletion](https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/#foreground-cascading-deletion)
when deleting an InferenceService. This means that the InferenceService CR will
be deleted from the K8s API Server only once the underlying resources have been
deleted.
{{% /alert %}}


### Inspecting

Users can click on the name of an InferenceService, from the main page, and
view a more detailed summary of the CR's state. In this page users can inspect:
1. The overview of the InferenceService's status (OVERVIEW)
2. A user friendly representation of the CR's spec (DETAILS)
3. Metrics from the underlying resources (METRICS)
4. Logs from the created Pods (LOGS)
4. The YAML file as is in the K8s API Server (YAML)

<img src="/docs/external-add-ons/kserve/pics/webapp-overview.png" alt="Models web app overview page">

{{% alert title="Note" color="info" %}}
To gather the logs the backend will:
1. Filter all the pods that have a `serving.knative.dev/revision` label
2. Get the logs from the `kserve-container`
{{% /alert %}}

## Metrics

As mentioned in the above sections the web app allows users to inspect the
metrics from the InferenceService. This tab will __not__ be enable by default.
In order to expose it the users will need to install Grafana and Prometheus.

Currently the frontend is expecting to find a Grafana exposed in the `/grafana`
prefix. This Grafana instance will need to have specific dashboards in order
for the app to embed them in iframes. We are working on making this more
generic to allow people to expose their own graphs.

You can install Grafana and Prometheus, for the web app to consume, by
installing
1. the `monitoring-core.yaml` and
`monitoring-metrics-prometheus.yaml` files from the [Knative 0.18
release](https://github.com/knative/serving/releases/tag/v0.18.0)
2. the following yaml files for exposing Grafana outside the cluster, by
   allowing __anonymous access__

{{< blocks/tabs name="grafana-installation-yamls" >}}
{{{< blocks/tab name="ConfigMap" codelang="yaml" >}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-custom-config
  namespace: knative-monitoring
  labels:
    serving.knative.dev/release: "v0.11.0"
data:
  custom.ini: |
    # You can customize Grafana via changing the context of this field.
    [auth.anonymous]
    # enable anonymous access
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
  - '*'
  http:
  - match:
    - uri:
        prefix: /grafana/
    route:
    - destination:
        host: grafana.knative-monitoring.svc.cluster.local
        port:
          number: 30802
{{< /blocks/tab >}}}
{{< blocks/tab name="AuthorizationPolicy" codelang="yaml" >}}
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: models-web-app
  namespace: kubeflow
spec:
  action: ALLOW
  rules:
  - from:
    - source:
        principals:
        - cluster.local/ns/istio-system/sa/istio-ingressgateway-service-account
  selector:
    matchLabels:
      kustomize.component: kserve-models-web-app
      app.kubernetes.io/component: kserve-models-web-app
{{< /blocks/tab >}}}
{{< /blocks/tabs >}}

{{% alert title="Note" color="info" %}}
If you installed the app in the _standalone_ mode then you will need to instead
use the __knative-serving/knative-ingress-gateway__ Ingress Gateway and deploy
the AuthorizationPolicy in the __kserve__ namespace instead.
{{% /alert %}}

After applying these YAMLs, based on your installation mode, and ensuring the
Grafana instance is exposed under `/grafana` the web app will show the
`METRICS` tab.

<img src="/docs/external-add-ons/kserve/pics/webapp-metrics.png" alt="Models web app metrics page">

## Configurations

The following is a list of ENV var that can configure different aspects of the
application.

| ENV Var | Default value | Description |
| - | - | - |
| APP_PREFIX | "/models" | Controls the app's prefix, by setting the [base-url](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) element |
| APP_DISABLE_AUTH | "False" | Controls whether the app should use SubjectAccessReviews to ensure the user is authorized to perform an action |
| APP_SECURE_COOKIES | "True" | Controls whether the app should use [Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Secure) CSRF cookies. By default the app expects to be exposed with https |
| CSRF_SAMESITE | "Strict" | Controls the [SameSite value](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#SameSite) of the CSRF cookie |
| USERID_HEADER | "kubeflow-userid" | Header in each request that will contain the username of the logged in user |
| USERID_PREFIX | "" | Prefix to remove from the `USERID_HEADER` value to extract the logged in user name |
