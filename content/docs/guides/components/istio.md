+++
title = "Istio Integration (for TF Serving)"
description = "Istio Integration (for TF Serving)"
weight = 10
toc = true
[menu]
[menu.docs]
  parent = "components"
  weight = 6
+++

[Istio](https://istio.io/) provides a lot of functionality that we want to have, such as metrics, auth and
quota, rollout and A/B testing.

## Install Istio
We assume Kubeflow is deployed in the `kubeflow` namespace.

Follow the istio [doc](https://istio.io/docs/setup/kubernetes/quick-start/)
to install istio.

1. download or clone the istio source. cd to the directory.
2. Install Istio's CRD,
    ```
    kubectl apply -f install/kubernetes/helm/istio/templates/crds.yaml
    ```

Before installing Istio components, we will change some configuration.
We will use isio's automatic sidecar injection. However, we want to inject only to those services with annotation.
According to this [table](https://github.com/istio/istio/issues/6476#issuecomment-399219937), we will
label the namespace as `enabled`, and set policy in `istio-sidecar-injector` (a configmap) as `disabled`.
3. label the namespace
   ```
   kubectl label namespace kubeflow istio-injection=enabled
   ```
4. Set the policy. This can be done by editing `install/kubernetes/istio-demo.yaml`,
   or use helm template: TODO(lunkai): how.

Also, we need to allow egress traffic, e.g. read models from GCS. This is control by the `-i` flag of the args of 
`istio-init` container in the same configmap `istio-sidecar-injector`. We can also edit it directly or use helm.
To determine the IP values, follow the instructions in the Istio
[doc](https://istio.io/docs/tasks/traffic-management/egress/#calling-external-services-directly). For example, for GKE you can do

```
gcloud container clusters describe XXXXXXX --zone=XXXXXX | grep -e clusterIpv4Cidr -e servicesIpv4Cidr
clusterIpv4Cidr: 10.4.0.0/14
servicesIpv4Cidr: 10.7.240.0/20
```
5. Set the outbound IP ranges (direcly in the configmap, or use helm). The value should be like
   `"10.32.0.0/14\,10.35.240.0/20"`.

6. Install istio (without mTLS)
    ```
    kubectl apply -f install/kubernetes/istio-demo.yaml
    ```

## Kubeflow TF Serving with Istio

After installing Istio, we can deploy the TF Serving component as in [README](README.md) with
additional params:

```
ks param set ${MODEL_COMPONENT} injectIstio true
```

This will inject an istio sidecar in the TF serving deployment.

TODO(lunkai): update below

### Metrics
The istio sidecar reports data to [Mixer](https://istio.io/docs/concepts/policy-and-control/mixer.html).
We can view the istio dashboard by [installing Grafana](https://istio.io/docs/tasks/telemetry/using-istio-dashboard.html#viewing-the-istio-dashboard).
Execute the command:

```
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000 &
```

Visit http://localhost:3000/dashboard/db/istio-dashboard in your web browser.
Send some requests to the TF serving service, then there should be some data (QPS, success rate, latency)
like
![istio dashboard](../istio-dashboard.png)


#### Define and view metrics
See istio [doc](https://istio.io/docs/tasks/telemetry/metrics-logs.html).

#### Expose Grafana dashboard behind ingress/IAP
To expose the grafana dashboard as, e.g. `YOUR_HOST/grafana`, follow these steps.

  - Add ambassador annotation for routing. However, since ambassador only scans the service within
  its [namespace](https://www.getambassador.io/reference/advanced),
  we can add the annotation for grafana service in ambassador service. So do
  `kubectl edit svc -n kubeflow ambassador`, and add annotation

  ```
  getambassador.io/config: |
    ---
    apiVersion: ambassador/v0
    kind:  Mapping
    name:  grafana_dashboard_mapping
    prefix: /grafana/
    service: grafana.istio-system:3000
  ```

  - Grafana needs to be [configured](http://docs.grafana.org/installation/behind_proxy/#examples-with-sub-path-ex-http-foo-bar-com-grafana)
  to work properly behind a reverse proxy. We can override the default config using
  [environment variable](http://docs.grafana.org/installation/configuration/#using-environment-variables).
  So do `kubectl edit deploy -n istio-system grafana`, and add env vars

  ```
  - name: GF_SERVER_DOMAIN
    value: YOUR_HOST
  - name: GF_SERVER_ROOT_URL
    value: '%(protocol)s://%(domain)s:/grafana'
  ```

### Rolling out new model

A typical scenario is that we first deploy a model A. Then we develop another model B, and we want to deploy it
and gradually move traffic from A to B. This can be achieved using Istio's traffic routing.

  1. Deploy the first model as [usual](README.md), with name X. We can optionally set the version param, which
  default to `v1`. After doing `ks apply`, we will have a service X, and a deployment `X-v1`.
  In addition, a default routing rule is created and routes all requests to `v1`.
  2. When we want to rollout the new model, use the same name X and set a different version, e.g. `v2`.

  ```
  ks param set --env=$ENV $MODEL_COMPONENT version v2
  ks param set --env=$ENV $MODEL_COMPONENT firstVersion false
  ks apply $ENV -c $MODEL_COMPONENT
  ```

  This deploys the new deployment `X-v2`, but the traffic will still go to `v1`
  3. Create the new routing rule. For example, the following sends 5% traffic to `v2`.

  ```
  apiVersion: config.istio.io/v1alpha2
  kind: RouteRule
  metadata:
    name: inception-rollout
    namespace: kubeflow
  spec:
    destination:
      name: inception
    precedence: 2
    route:
    - labels:
        version: v1
      weight: 95
    - labels:
        version: v2
      weight: 5
  ```
