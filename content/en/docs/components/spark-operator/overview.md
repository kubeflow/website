---
title: Overview
description: An overview for Spark Operator
weight: 10
---

## What is Kubeflow Spark Operator?

The Kubernetes Operator for Apache Spark aims to make specifying and running Spark applications as easy and idiomatic as running other workloads on Kubernetes. It uses Kubernetes custom resources for specifying, running, and surfacing status of Spark applications.

## Benefits

* **Declarative Workload Management:** Specify and manage Spark applications declaratively using standard Kubernetes YAML files and Custom Resource Definitions (`SparkApplication`) ([User Guide: Writing a SparkApplication](https://spark.kubeflow.org/en/latest/user-guide/writing-sparkapplication.html) and [API Reference](https://spark.kubeflow.org/en/latest/reference/api-docs.html)).
* **Automated Execution:** Automatically handles `spark-submit` on behalf of users whenever a valid application manifest is created or updated ([Overview: Architecture](https://spark.kubeflow.org/en/latest/overview/index.html#architecture)).
* **Native Cron Scheduling:** Provides built-in cron support for running recurring Spark jobs on scheduled intervals ([User Guide: Running Spark Applications on a Schedule](https://spark.kubeflow.org/en/latest/user-guide/running-sparkapplication-on-schedule.html)).
* **Advanced Pod Customization:** Utilizes a mutating admission webhook to perform pod customizations beyond Spark's native capabilities, such as mounting ConfigMaps and volumes or configuring pod affinity/anti-affinity ([Overview: Mutating Admission Webhook](https://spark.kubeflow.org/en/latest/overview/index.html#mutating-admission-webhook) and [User Guide: Customizing Spark Operator](https://spark.kubeflow.org/en/latest/user-guide/customizing-spark-operator.html)).
* **Failure Handling & Auto-Restart:** Supports configurable restart policies, automatic re-submissions upon spec updates, and submission retries with configurable linear back-off ([Overview: Handling Application Restart And Failures](https://spark.kubeflow.org/en/latest/overview/index.html#handling-application-restart-and-failures)).
* **Prometheus Observability:** Native support for collecting and exporting application-level, driver, and executor metrics directly to Prometheus ([User Guide: Monitoring Spark Applications](https://spark.kubeflow.org/en/latest/user-guide/monitoring-with-jmx-and-prometheus.html)).

## Architecture

<img src="https://raw.githubusercontent.com/kubeflow/spark-operator/master/docs/website/overview/sparkoperator-arch.jpg"
  alt="Kubeflow Spark Operator overview diagram">


## Next Steps
1. Follow the [Getting Started Guide](https://spark.kubeflow.org/en/latest/getting-started/) to deploy the Spark Operator into your Kubernetes cluster.
2. Read the [User Guide](https://spark.kubeflow.org/en/latest/user-guide/) (including [Writing a SparkApplication](https://spark.kubeflow.org/en/latest/user-guide/writing-sparkapplication.html)) to learn how to write, configure, and submit your first `SparkApplication` manifest.
