+++
title = "Istio Integration (for TF Serving)"
description = "Using Istio for TF Serving"
weight = 6
+++

[Istio](https://istio.io/) provides a lot of functionality that we want to have, such as metrics, auth and
quota, rollout and A/B testing.

## Install Istio
We assume Kubeflow is deployed in the `kubeflow` namespace.

### 1. Download Istio
Follow the istio [doc](https://istio.io/docs/setup/kubernetes/quick-start/)
to download istio.

- download or clone the istio source. cd to the directory.
- Install Istio's CRD,
    ```
    kubectl apply -f install/kubernetes/helm/istio/templates/crds.yaml
    ```

### 2. Configure sidecar injection
Before installing Istio components, we will change some configuration.
We will use isio's automatic sidecar injection. However, we want to inject only to those services with annotation.
According to this [table](https://github.com/istio/istio/issues/6476#issuecomment-399219937), we will
label the namespace as `enabled`, and set policy in `istio-sidecar-injector` (a configmap) as `disabled`.

- label the namespace
   ```
   kubectl label namespace kubeflow istio-injection=enabled
   ```
- Set the policy. This can be done by editing `install/kubernetes/istio-demo.yaml` directly.


### 3. Configure egress traffic
Also, we need to allow egress traffic, e.g. read models from GCS. This is control by the `-i` flag of the args of 
`istio-init` container in the same configmap `istio-sidecar-injector`. We can also edit it directly.
To determine the IP values, follow the instructions in the Istio
[doc](https://istio.io/docs/tasks/traffic-management/egress/#calling-external-services-directly). For example, for GKE you can do

```
gcloud container clusters describe XXXXXXX --zone=XXXXXX | grep -e clusterIpv4Cidr -e servicesIpv4Cidr
clusterIpv4Cidr: 10.4.0.0/14
servicesIpv4Cidr: 10.7.240.0/20
```

- Set the outbound IP ranges (direcly in the configmap). The value should be like
   `"10.32.0.0/14\,10.35.240.0/20"`.

### 4. Configure istio-ingressgateway
We recommend using a regular ingress instead of Istio's ingress gateway as the entry to cluster on GCP,
so this service should not be of type `LoadBalancer`.

- Edit `install/kubernetes/istio-demo.yaml` and change the service type of `istio-ingressgateway` from
  `LoadBalancer` to `NodePort`.

### 4. Install istio (without mTLS)
    ```
    kubectl apply -f install/kubernetes/istio-demo.yaml
    ```

### (optional) 5. Deploy the Gateway

This is for rolling out model and doing traffic split. See more detail below.

TODO(https://github.com/kubeflow/kubeflow/issues/1309): update this

## Kubeflow TF Serving with Istio

After installing Istio, we can deploy the TF Serving component as in [README](README.md) with
additional params:

```
ks param set ${MODEL_COMPONENT} injectIstio true
```

This will inject an istio sidecar in the TF serving deployment.

### Metrics
The istio sidecar reports data to [Mixer](https://istio.io/docs/concepts/policy-and-control/mixer.html).
Execute the command:

```
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000
```

Visit http://localhost:3000/dashboard/db/istio-mesh-dashboard in your web browser.
Send some requests to the TF serving service, then there should be some data (QPS, success rate, latency)
like
![istio dashboard](../istio-dashboard.png)


#### Define and view metrics
See istio [doc](https://istio.io/docs/tasks/telemetry/metrics-logs.html).

#### Expose Grafana dashboard behind ingress/IAP

TODO(https://github.com/kubeflow/kubeflow/issues/1309): update this section

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

1. Deploy the first model as described [here](tfserving_new.md). Then you will have the service (Model)
   and the deployment (Version).

2. Deploy another version of the model, v2. This time, no need to deploy the service part.

   ```
   MODEL_COMPONENT2=mnist-v2
   ks generate tf-serving-deployment-gcp ${MODEL_COMPONENT2}
   ks param set ${MODEL_COMPONENT2} modelName mnist  // modelName should be the SAME as the previous one
   ks param set ${MODEL_COMPONENT2} versionName v2   // v2 !!
   ks param set ${MODEL_COMPONENT2} modelBasePath gs://kubeflow-examples-data/mnist
   ks param set ${MODEL_COMPONENT2} gcpCredentialSecretName user-gcp-sa
   ks param set ${MODEL_COMPONENT2} injectIstio true   // This is required

   ks apply ${KF_ENV} -c ${MODEL_COMPONENT2}
   ```

3. Update the traffic weight
   ```
   ks param set mnist-service trafficRule v1:90:v2:10   // This routes 90% to v1, and 10% to v2
   ks apply ${KF_ENV} -c mnist-service
   ```
