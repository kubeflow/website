+++
title = "Logging and monitoring"
description = "Logging and Monitoring for Kubeflow"
weight = 10
toc = true
bref= "This guide has information about logging and monitoring for Kubeflow."
[menu.docs]
  parent = "guides"
  weight = 100
+++

# Logging

## Stackdriver on GKE

The default on GKE is to send logs to
[Stackdriver logging](https://cloud.google.com/logging/docs/).

Stackdriver recently introduced new features for [Kubernetes Monitoring](https://cloud.google.com/monitoring/kubernetes-engine/migration) that are currently
in Beta. These features are only available on Kubernetes v1.10 or later and must
be explicitly installed. Below are instructions for both versions of Stackdriver Kubernetes.

### Default stackdriver

This section contains instructions for using the existing stackdriver support
for GKE which is the default.

To get the logs for a particular pod you can use the following
advanced filter in Stackdriver logging's search UI.

```
resource.type="container"
resource.labels.cluster_name="${CLUSTER}"
resource.labels.pod_id="${POD_NAME}"
```

where ${POD_NAME} is the name of the pod and ${CLUSTER} is the name of your cluster.

The equivalent gcloud command would be

```
gcloud --project=${PROJECT} logging read  \
     --freshness=24h \
     --order asc \
        "resource.type=\"container\" resource.labels.cluster_name=\"${CLUSTER}\" resource.labels.pod_id=\"${POD}\" "
```


Kubernetes events for the TFJob are also available in stackdriver and can
be obtained using the following query in the UI

```
resource.labels.cluster_name="${CLUSTER}"
logName="projects/${PROJECT}/logs/events" 
jsonPayload.involvedObject.name="${TFJOB}"
```

The equivalent gcloud command is

```
gcloud --project=${PROJECT} logging read  \
     --freshness=24h \
     --order asc \
        "resource.labels.cluster_name=\"${CLUSTER}\" jsonPayload.involvedObject.name=\"${TFJOB}\" logName=\"projects/${PROJECT}/logs/events\" "
```

### Stackdriver Kubernetes 

This section contains the relevant stackdriver queries and gloud commands
if you are using the new [Stackdriver Kubernetes Monitoring](https://cloud.google.com/monitoring/kubernetes-engine)

To get the stdout/stderr logs for a particular container you can use the following
advanced filter in Stackdriver logging's search UI.

```
resource.type="k8s_container"
resource.labels.cluster_name="${CLUSTER}"
resource.labels.pod_name="${POD_NAME}"
```

where ${POD_NAME} is the name of the pod and ${CLUSTER} is the name of your cluster.

The equivalent gcloud command would be

```
gcloud --project=${PROJECT} logging read  \
     --freshness=24h \
     --order asc \
        "resource.type=\"k8s_container\" resource.labels.cluster_name=\"${CLUSTER}\" resource.labels.pod_name=\"${POD_NAME}\" "
```

Events about individual pods can be obtained with the following query

```
resource.type="k8s_pod"
resource.labels.cluster_name="${CLUSTER}"
resource.labels.pod_name="${POD_NAME}"
```

or via gcloud

```
gcloud --project=${PROJECT} logging read  \
     --freshness=24h \
     --order asc \
        "resource.type=\"k8s_pod\" resource.labels.cluster_name=\"${CLUSTER}\" resource.labels.pod_name=\"${POD_NAME}\" "
```

#### Filter with labels

The new agents also support querying for logs using pod labels
For example:

```
resource.type="k8s_container"
resource.labels.cluster_name="${CLUSTER}"
metadata.userLables.${LABEL_KEY}="${LABEL_VALUE}"
```

# Monitoring

## Stackdriver on GKE
The new [Stackdriver Kubernetes Monitoring](https://cloud.google.com/monitoring/kubernetes-engine)
provides single dashboard observability and is compatible with Prometheus data model.

See this [doc](https://cloud.google.com/monitoring/kubernetes-engine/observing) for more
details on the dashboard.

Stackdriver by default provides container level CPU/memory metrics.
We can also define custom Prometheus metrics and view them on the Stackdriver dashboard.
See [here](https://cloud.google.com/monitoring/kubernetes-engine/prometheus) for more detail.

## Prometheus

### Kubeflow Prometheus component
Kubeflow provides a Prometheus [component](https://github.com/kubeflow/kubeflow/blob/master/kubeflow/core/prometheus.libsonnet).
To deploy the Prometheus component:

```
ks generate prometheus prom --projectId=YOUR_PROJECT --clusterName=YOUR_CLUSTER --zone=ZONE
ks apply YOUR_ENV -c prom
```

The prometheus server will scrape the services with annotation `prometheus.io/scrape=true`.
See [here](https://github.com/kubeflow/kubeflow/blob/master/kubeflow/core/prometheus.yml#L75) for more detail,
and [here](https://github.com/kubeflow/kubeflow/blob/master/kubeflow/core/metric-collector.libsonnet#L83) for an example.

#### Export metrics to Stackdriver
The Prometheus server will export metrics to Stackdriver, as configured
[here](https://github.com/kubeflow/kubeflow/blob/master/kubeflow/core/prometheus.yml#L127).
We are using an [image](https://github.com/kubeflow/kubeflow/blob/master/kubeflow/core/prometheus.libsonnet#L170)
provided by Stackdriver. See Stackdriver [doc](https://cloud.google.com/monitoring/kubernetes-engine/prometheus).

If you don't want to export metrics to Stackdriver, remove the `remote_write` part in the `prometheus.yml`,
and use a native Prometheus [image](https://hub.docker.com/r/prom/prometheus/tags/).

### Metric collector component
Kubeflow also provides a metric-collector [component](https://github.com/kubeflow/kubeflow/tree/master/metric-collector).
This component periodically pings your Kubeflow endpoint and provides a
[metric](https://github.com/kubeflow/kubeflow/blob/master/metric-collector/service-readiness/kubeflow-readiness.py#L21) 
of whether the endpoint is up or not. To deploy it:

```
ks generate metric-collector mc --targetUrl=YOUR_KF_ENDPOINT
ks apply YOUR_ENV -c mc
```
