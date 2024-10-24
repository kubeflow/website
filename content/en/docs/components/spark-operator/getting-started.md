---
title: Getting Started
description: Getting started with Spark Operator
weight: 30
---

For a more detailed guide on how to use, compose and work with `SparkApplication`s, please refer to the [User Guide](/docs/components/spark-operator/user-guide).

## Prerequisites

- [Helm](https://helm.sh/) >= 3
- [Kubernetes](https://kubernetes.io) >= 1.16

## Installation

### Add Helm Repo

To add the Spark operator Helm repository, run the following command:

```bash
helm repo add spark-operator https://kubeflow.github.io/spark-operator

helm repo update
```

See [helm repo](https://helm.sh/docs/helm/helm_repo) for command documentation.

### Install the Chart

For example, if you want to create a release with name `spark-operator` in the `spark-operator` namespace, do as follows:

```bash
helm install spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    --create-namespace
```

If you want to install a specified version of the chart, use `helm search` to list the available versions:

```bash
$ helm search repo spark-operator/spark-operator --devel --versions
NAME                            CHART VERSION   APP VERSION             DESCRIPTION                                   
spark-operator/spark-operator   2.0.1           2.0.1                   A Helm chart for Spark on Kubernetes operator.
spark-operator/spark-operator   2.0.0           2.0.0                   A Helm chart for Spark on Kubernetes operator.
spark-operator/spark-operator   2.0.0-rc.0      2.0.0-rc.0              A Helm chart for Spark on Kubernetes operator.
spark-operator/spark-operator   1.4.6           v1beta2-1.6.2-3.5.0     A Helm chart for Spark on Kubernetes operator 
spark-operator/spark-operator   1.4.5           v1beta2-1.6.2-3.5.0     A Helm chart for Spark on Kubernetes operator 
...
```

Then use the `--version` flag in `helm install` command to install a specific version:

```bash
helm install spark-operator spark-operator/spark-operator \
    --version 2.0.1 \
    --namespace spark-operator \
    --create-namespace
```

See [helm install](https://helm.sh/docs/helm/helm_install) for command documentation.

Installing the chart will create a namespace `spark-operator` if it doesn't exist, and helm will set up RBAC for the operator to run in the namespace. It will also set up RBAC in the `default` namespace for driver pods of your Spark applications to be able to manipulate executor pods. In addition, the chart will create a Deployment in the namespace `spark-operator`. The chart by default does not enable [Mutating Admission Webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) for Spark pod customization. When enabled, a webhook service and a secret storing the x509 certificate called `spark-webhook-certs` are created for that purpose. To install the operator with the mutating admission webhook on a Kubernetes cluster, install the chart with the flag `webhook.enable=true`:

```bash
helm install my-release spark-operator/spark-operator \
    --namespace spark-operator \
    --create-namespace \
    --set webhook.enable=true
```

If you want to deploy the chart to GKE cluster, you will first need to [grant yourself cluster-admin privileges](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control#defining_permissions_in_a_role) before you can create custom roles and role bindings on a GKE cluster versioned 1.6 and up. Run the following command before installing the chart on GKE:

```bash
kubectl create clusterrolebinding <user>-cluster-admin-binding --clusterrole=cluster-admin --user=<user>@<domain>
```

Now you should see the operator running in the cluster by checking the status of the Helm release.

```bash
helm status --namespace spark-operator my-release
```

### Upgrade the Chart

To upgrade the Spark operator with release name `spark-operator` in the namespace `spark-operator`, run the following command:

```bash
helm upgrade spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    <flags>
```

For example, if you want to update the controller/webhook replicas both to `2`, run the following command:

```bash
helm upgrade spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    --set controller.replicas=2 \
    --set webhook.replicas=3
```

See [helm upgrade](https://helm.sh/docs/helm/helm_upgrade) for command documentation.

### Uninstall the Chart

To uninstall the Spark operator with release name `spark-operator` in the `spark-operator` namespace, run the following command:

```bash
helm uninstall spark-operator \
    --namespace spark-operator
```

This removes all the Kubernetes resources associated with the chart and deletes the release, except for the custom resource definitions (CRD), those will have to be removed manually.

See [helm uninstall](https://helm.sh/docs/helm/helm_uninstall) for command documentation.

## Submit an Example SparkApplication

To run the Spark PI example, run the following command:

```bash
kubectl apply -f examples/spark-pi.yaml
```

Note that [spark-pi.yaml](https://github.com/kubeflow/spark-operator/blob/master/examples/spark-pi.yaml) configures the driver pod to use the `spark-operator-spark` service account to communicate with the Kubernetes API server. You might need to replace it with the appropriate service account before submitting the job. For example, if you installed the chart with the spark service account name configured as `spark` as follows:

```bash
helm install spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    --create-namespace \
    --set spark.serviceAccount.name=spark
```

Then you need to change the driver service account name in the example to `spark`. 

Besides, If you installed the operator using the Helm chart and overrode `spark.jobNamespaces`, the service account name ends with `-spark` and starts with the Helm release name. For example, if you would like to run your Spark applications to run in a namespace called `spark`, then install the chart with the following command:

```bash
helm install spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    --create-namespace \
    --set 'spark.jobNamespaces={spark}'
```

Then the chart will set up a service account for your Spark jobs to use in that namespace.

See the section on the [Spark Job Namespace](#about-spark-job-namespaces) for details on the behavior of the default Spark Job Namespace.

Running the above command will create a `SparkApplication` object named `spark-pi`. Check the object by running the following command:

```bash
kubectl get sparkapplication spark-pi -o=yaml
```

This will show something similar to the following:

```yaml
$ kubectl get sparkapplication spark-pi -o=yaml
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"sparkoperator.k8s.io/v1beta2","kind":"SparkApplication","metadata":{"annotations":{},"name":"spark-pi","namespace":"default"},"spec":{"driver":{"coreLimit":"1200m","cores":1,"labels":{"version":"3.5.0"},"memory":"512m","serviceAccount":"spark-operator-spark"},"executor":{"coreLimit":"1200m","cores":1,"instances":1,"labels":{"version":"3.5.0"},"memory":"512m"},"image":"spark:3.5.0","imagePullPolicy":"IfNotPresent","mainApplicationFile":"local:///opt/spark/examples/jars/spark-examples_2.12-3.5.0.jar","mainClass":"org.apache.spark.examples.SparkPi","mode":"cluster","sparkVersion":"3.5.0","type":"Scala"}}
  creationTimestamp: "2024-08-30T07:30:23Z"
  generation: 1
  name: spark-pi
  namespace: default
  resourceVersion: "42716451"
  uid: 8d286697-02f4-4412-b99f-f85ac8ef1f2a
spec:
  deps: {}
  driver:
    coreLimit: 1200m
    cores: 1
    labels:
      version: 3.5.0
    memory: 512m
    serviceAccount: spark-operator-spark
  executor:
    coreLimit: 1200m
    cores: 1
    instances: 1
    labels:
      version: 3.5.0
    memory: 512m
  image: spark:3.5.0
  imagePullPolicy: IfNotPresent
  mainApplicationFile: local:///opt/spark/examples/jars/spark-examples_2.12-3.5.0.jar
  mainClass: org.apache.spark.examples.SparkPi
  mode: cluster
  restartPolicy:
    type: Never
  sparkVersion: 3.5.0
  type: Scala
status:
  applicationState:
    state: COMPLETED
  driverInfo:
    podName: spark-pi-driver
    webUIAddress: 192.168.191.178:4040
    webUIPort: 4040
    webUIServiceName: spark-pi-ui-svc
  executionAttempts: 1
  executorState:
    spark-pi-6b26fb91a2315d26-exec-1: COMPLETED
  lastSubmissionAttemptTime: "2024-08-30T07:30:25Z"
  sparkApplicationId: spark-526a5e4d8d634320904911f11483d642
  submissionAttempts: 1
  submissionID: 1c4ba2c3-4f35-4e1f-a9d5-d56ae8a9add8
  terminationTime: "2024-08-30T07:30:37Z"
```

To check out the events of `spark-pi` SparkApplication, run the following command:

```bash
kubectl describe sparkapplication spark-pi
```

This will show the events similarly to the following:

```text
Events:
  Type    Reason                     Age   From                          Message
  ----    ------                     ----  ----                          -------
  Normal  SparkApplicationSubmitted  76s   spark-application-controller  SparkApplication spark-pi was submitted successfully
  Normal  SparkDriverRunning         74s   spark-application-controller  Driver spark-pi-driver is running
  Normal  SparkExecutorPending       70s   spark-application-controller  Executor [spark-pi-6b26fb91a2315d26-exec-1] is pending
  Normal  SparkExecutorRunning       69s   spark-application-controller  Executor [spark-pi-6b26fb91a2315d26-exec-1] is running
  Normal  SparkExecutorCompleted     65s   spark-application-controller  Executor [spark-pi-6b26fb91a2315d26-exec-1] completed
  Normal  SparkDriverCompleted       64s   spark-application-controller  Driver spark-pi-driver completed
```

The operator submits the Spark Pi example to run once it receives an event indicating the `SparkApplication` object was added.

## Configuration

The operator is typically deployed and run using the Helm chart. However, users can still run it outside a Kubernetes cluster and make it talk to the Kubernetes API server of a cluster by specifying path to `kubeconfig`, which can be done using the `--kubeconfig` flag, `~/.kube/config` will be used if not specified.

The operator uses multiple workers in the `SparkApplication` controller. The number of worker threads are controlled using command-line flag `-controller-threads` which has a default value of `10`.

The operator enables cache resynchronization so periodically the informers used by the operator will re-list existing objects it manages and re-trigger resource events. The resynchronization interval in seconds can be configured using the flag `-resync-interval`, with a default value of `30` seconds.

By default, the operator will only watch SparkApplication/ScheduledSparkApplication in the `default` namespace . It can be configured to manage only the custom resource objects in a specific list of namespaces with the flag `--namespaces=ns1,ns2,ns3`.

## About Spark Job Namespaces

The Helm chart value `spark.jobNamespaces` defines the list of namespaces where `SparkApplication`/`ScheduledSparkApplication` objects will be watched, and its default value is `["default"]`. When the list of job namespace is empty (`[]`) or contains empty namespace (e.g. `[""]`, `["", "ns1", "ns2", "ns3"]`), the Helm chart will create a service account in the namespace where the spark-operator is deployed.

If you installed the operator using the Helm chart and overrode the `spark.jobNamespaces` to some other value, pre-existing namespace, the Helm chart will create the necessary service account and RBAC in the specified namespace.

The Spark Operator uses the Spark Job Namespace to identify and filter relevant events for the `SparkApplication` CRD. If you specify a namespace for Spark Jobs, and then submit a SparkApplication resource to another namespace, the Spark Operator will filter out the event, and the resource will not get deployed. If you don't specify a namespace, the Spark Operator will see only `SparkApplication` events for the Spark Operator namespace.

For example, if you want to watch all namespaces, you can install the chart as follows:

```bash
helm install spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    --create-namespace \
    --set 'spark.jobNamespace={}'
```

Note that the above command will not create RBAC resources for Spark applications in the job namespaces. To watch all namespaces and create RBAC resources for Spark in some specified namespaces, you can do as following:

```bash
helm install spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    --create-namespace \
    --set 'sparkJobNamespace={,default,spark}'
```

This will watch all namespaces and also create RBAC resources for Spark applications in `default` and `spark` namespaces.

## About the Service Account for Driver Pods

A Spark driver pod need a Kubernetes service account in the pod's namespace that has permissions to create, get, list, and delete executor pods, and create a Kubernetes headless service for the driver. The driver will fail and exit without the service account, unless the default service account in the pod's namespace has the needed permissions. To submit and run a `SparkApplication` in a namespace, please make sure there is a service account with the permissions in the namespace and set `.spec.driver.serviceAccount` to the name of the service account. Please refer to [spark-rbac.yaml](https://github.com/kubeflow/spark-operator/blob/master/config/rbac/spark-application-rbac.yaml) for an example RBAC setup that creates a driver service account named `spark-operator-spark` in the `default` namespace, with a RBAC role binding giving the service account the needed permissions.

## About the Service Account for Executor Pods

A Spark executor pod may be configured with a Kubernetes service account in the pod namespace. To submit and run a `SparkApplication` in a namespace, please make sure there is a service account with the permissions required in the namespace and set `.spec.executor.serviceAccount` to the name of the service account.

## Driver UI Access and Ingress

The operator, by default, makes the Spark UI accessible by creating a service of type `ClusterIP` which exposes the UI. This is only accessible from within the cluster.

The operator also supports creating an optional Ingress for the UI. This can be turned on by setting the `ingress-url-format` command-line flag. The `ingress-url-format` should be a template like `{{$appName}}.{ingress_suffix}/{{$appNamespace}}/{{$appName}}`. The `{ingress_suffix}` should be replaced by the user to indicate the cluster's ingress url and the operator will replace the `{{$appName}}` & `{{$appNamespace}}` with the appropriate value. Please note that Ingress support requires that cluster's ingress url routing is correctly set-up. For e.g. if the `ingress-url-format` is `{{$appName}}.ingress.cluster.com`, it requires that anything `*ingress.cluster.com` should be routed to the ingress-controller on the K8s cluster.

The operator also sets both `WebUIAddress` which is accessible from within the cluster as well as `WebUIIngressAddress` as part of the `DriverInfo` field of the `SparkApplication`.

The operator generates ingress resources intended for use with the [Ingress NGINX Controller](https://kubernetes.github.io/ingress-nginx/). Include this in your application spec for the controller to ensure it recognizes the ingress and provides appropriate routes to your Spark UI.

```yaml
spec:
  sparkUIOptions:
    ingressAnnotations:
        kubernetes.io/ingress.class: nginx
```

## About the Mutating/Validating Webhook

The Spark operator comes with optional mutating/validating admission webhooks for mutating/validating Spark pods based on the specification in `SparkApplication` objects, e.g., mounting user-specified ConfigMaps and volumes, and setting pod affinity/anti-affinity, and adding tolerations.

To install the operator with a custom port, pass the appropriate flag during `helm install`:

```bash
helm install spark-operator spark-operator/spark-operator \
   --namespace spark-operator  \
   --create-namespace \
   --set webhook.enable=true \
   --set webhook.port=443
```

## Enable Metric Exporting to Prometheus

The operator exposes a set of metrics via the metric endpoint to be scraped by `Prometheus`. The Helm chart by default installs the operator with the additional flag to enable metrics (`-enable-metrics=true`) as well as other annotations used by Prometheus to scrape the metric endpoint. If `podMonitor.enable` is enabled, the helm chart will submit a pod monitor for the operator's pod. To install the operator  **without** metrics enabled, pass the appropriate flag during `helm install`:

```bash
helm install spark-operator spark-operator/spark-operator \
    --namespace spark-operator \
    --create-namespace \
    --set metrics.enable=false
```

If enabled, the operator generates the following metrics:

### Spark Application Metrics

| Metric | Description |
| ------------- | ------------- |
| `spark_app_count`  | Total number of SparkApplication handled by the Operator.|
| `spark_app_submit_count`  | Total number of SparkApplication spark-submitted by the Operator.|
| `spark_app_success_count` | Total number of SparkApplication which completed successfully.|
| `spark_app_failure_count` | Total number of SparkApplication which failed to complete. |
| `spark_app_running_count` | Total number of SparkApplication which are currently running.|
| `spark_app_success_execution_time_microseconds` | Execution time for applications which succeeded.|
| `spark_app_failure_execution_time_microseconds` | Execution time for applications which failed. |
| `spark_app_start_latency_microseconds` | Start latency of SparkApplication as type of [Prometheus Summary](https://prometheus.io/docs/concepts/metric_types/#summary). |
| `spark_app_start_latency_seconds` | Start latency of SparkApplication as type of [Prometheus Histogram](https://prometheus.io/docs/concepts/metric_types/#histogram). |
| `spark_app_executor_success_count` | Total number of Spark Executors which completed successfully. |
| `spark_app_executor_failure_count` | Total number of Spark Executors which failed. |
| `spark_app_executor_running_count` | Total number of Spark Executors which are currently running. |

### Work Queue Metrics

| Metric | Description |
| ------------- | ------------- |
| `spark_application_controller_depth` | Current depth of workqueue |
| `spark_application_controller_adds` | Total number of adds handled by workqueue |
| `spark_application_controller_latency` | Latency for workqueue |
| `spark_application_controller_work_duration` | How long processing an item from workqueue takes |
| `spark_application_controller_retries` | Total number of retries handled by workqueue |
| `spark_application_controller_unfinished_work_seconds` | Unfinished work in seconds |
| `spark_application_controller_longest_running_processor_microseconds` | Longest running processor in microseconds |

The following is a list of all the configurations the operators supports for metrics:

```bash
-enable-metrics=true
-metrics-port=10254
-metrics-endpoint=/metrics
-metrics-prefix=myServiceName
-metrics-label=label1Key
-metrics-label=label2Key
```

All configs except `-enable-metrics` are optional. If port and/or endpoint are specified, please ensure that the annotations `prometheus.io/port`,  `prometheus.io/path` and `containerPort` in `spark-operator-with-metrics.yaml` are updated as well.

A note about `metrics-labels`: In `Prometheus`, every unique combination of key-value label pairs represents a new time series, which can dramatically increase the amount of data stored. Hence, labels should not be used to store dimensions with high cardinality with potentially a large or unbounded value range.

Additionally, these metrics are best-effort for the current operator run and will be reset on an operator restart. Also, some of these metrics are generated by listening to pod state updates for the driver/executors and deleting the pods outside the operator might lead to incorrect metric values for some of these metrics.

## Running Spark operator on Cloud

If you are running Spark operator on Google Kubernetes Engine (GKE) and want to use Google Cloud Storage (GCS) and/or BigQuery for reading/writing data, also refer to the [GCP guide](/docs/components/spark-operator/user-guide/gcp/).

### Mutating Admission Webhooks on a private GKE or EKS cluster

If you are deploying the operator on a GKE cluster with the [Private cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters) setting enabled, or on an enterprise AWS EKS cluster and you wish to deploy the cluster with the [Mutating Admission Webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/), then make sure to change the `webhookPort` to `443`. Alternatively you can choose to allow connections to the default port (`8080`).

> By default, firewall rules restrict your cluster master to only initiate TCP connections to your nodes on ports 443 (HTTPS) and 10250 (kubelet). For some Kubernetes features, you might need to add firewall rules to allow access on additional ports. For example, in Kubernetes 1.9 and older, kubectl top accesses heapster, which needs a firewall rule to allow TCP connections on port 8080. To grant such access, you can add firewall rules.
For GCP, refer to [this link](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters#add_firewall_rules)
