+++
title = "Prometheus Monitoring"
description = "Prometheus Metrics for the Training Operator"
weight = 70
+++

This guide explains how to monitor Kubeflow training jobs using Prometheus metrics. The Training Operator exposes these metrics, providing essential insights into the status of distributed machine learning workloads.

{{< note >}}
Metrics are only generated in response to specific events. For example, job creation metrics will only appear after a job has been created. If a metric is not visible, it may be because the corresponding event has not occurred yet.
{{< /note >}}

## Prometheus Metrics for Training Operator
The Training Operator includes a built-in `/metrics` endpoint exposes Prometheus metrics. This feature is enabled by default and requires no additional configuration for basic use.

### Configuring Metrics Port
By default, metrics are exposed on port 8080. If you want to change the default port for metrics exporting, simply add the `metrics-bind-address` argument.

For example, to change the metrics port to 8082:
```yaml
# deployment.yaml for the Training Operator
spec:
    containers:
    - command:
        - /manager
        image: kubeflow/training-operator
        name: training-operator
        ports:
        - containerPort: 8080
        - containerPort: 9443
            name: webhook-server
            protocol: TCP
        args:
        - "--metrics-bind-address=:8082" # Metrics port changed to 8082
```
### Accessing the Metrics
The method to access these metrics may vary depending on your Kubernetes setup and environment. For example, use the following command for local environments:
```
kubectl port-forward -n kubeflow deployment/training-operator 8080:8080
```

Then you'll see metrics in this format via `http://localhost:8080/metrics`:
```
# HELP training_operator_jobs_created_total Counts number of jobs created
# TYPE training_operator_jobs_created_total counter
training_operator_jobs_created_total{framework="tensorflow",job_namespace="kubeflow"} 7
```

## List of Job Metrics

| Metric name                          |  Description                     | Labels                                           |
|------------------------------------|---------|--------------------------|------------------------------------------------------|
| `training_operator_jobs_created_total`   |  Total number of jobs created       | `namespace`, `framework`                 |
| `training_operator_jobs_deleted_total`   |  Total number of jobs deleted       | `namespace`, `framework`                 |
| `training_operator_jobs_successful_total` |  Total number of successful jobs   |  `namespace`, `framework`                 |
| `training_operator_jobs_failed_total`    |  Total number of failed jobs       |  `namespace`, `framework` |
| `training_operator_jobs_restarted_total` |  Total number of restarted jobs   |  `namespace`, `framework`|

Labels information can be interpreted as follow:
| Label name                          |  Description                     | 
|------------------------------------|---------|--------------------------|
| `namespace`   | The Kubernetes namespace where the job is running        |
| `framework` | The machine learning framework used (e.g. TensorFlow,PyTorch)     | 



