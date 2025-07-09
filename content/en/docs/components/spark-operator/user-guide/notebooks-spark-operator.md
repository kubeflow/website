---
title: Integration with Notebooks
description: Integrating Jupyter Notebooks with the Spark Operator
weight: 110
---

If you're using Kubeflow Notebooks and want to run big data or distributed machine learning jobs with PySpark, the option is now available.

The Spark Operator streamlines the deployment of Apache Spark applications on Kubernetes. By integrating it with Jupyter Enterprise Gateway (JEG) and Kubeflow Notebooks, users can now run PySpark workloads at scale directly from a notebook interface, without worrying about the underlying Spark infrastructure.

This integration enables a seamless workflow for data scientists and ML engineers, allowing users to write PySpark code in their notebooks, which is then executed remotely using Kubernetes resources via the Spark Operator and JEG.

## Architecture

The following diagram illustrates how the components work together:

<img src="/docs/images/spark-operator/notebooks-spark.png" 
     alt="Architecture diagram showing Kubeflow notebooks integrated with Spark Operator" 
     class="mt-3 mb-3 border rounded">
</img>

## Overview

In a typical Kubeflow setup, users access JupyterLab Notebooks through the central dashboard. These notebooks can now be configured to run PySpark code remotely through kernels managed by Jupyter Enterprise Gateway (JEG).

Behind the scenes:

1. JEG receives execution requests from notebooks.
2. JEG creates `SparkApplication` Custom Resources.
3. The Spark Operator handles the lifecycle of Spark driver and executor pods in Kubernetes.

This architecture enables scalable, elastic execution of big data or distributed ML workloads.

## Prerequisites

- A running Kubeflow deployment with Notebook Controller enabled
- Spark Operator installed and configured in the cluster
- Helm installed locally
- (Optional) Minikube for local development or testing

---

## Step 1: Deploy Enterprise Gateway

Begin by creating the necessary storage resources. Save the following manifest as `enterprise-gateway-storage.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: enterprise-gateway
  labels:
    app: enterprise-gateway
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pvc-kernelspecs
  labels:
    app: enterprise-gateway
spec:
  storageClassName: standard
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/jupyter-gateway/kernelspecs"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-kernelspecs
  namespace: enterprise-gateway
spec:
  storageClassName: standard
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi

```
Apply it:
```yaml
kubectl apply -f enterprise-gateway-storage.yaml
```
Then deploy Enterprise Gateway using Helm:
```yaml
helm upgrade --install enterprise-gateway \
  https://github.com/jupyter-server/enterprise_gateway/releases/download/v3.2.3/jupyter_enterprise_gateway_helm-3.2.3.tar.gz \
  --namespace enterprise-gateway \
  --values enterprise-gateway-minikube-helm.yaml \
  --create-namespace \
  --wait

```
Example configuration yaml: Save the following manifest as `enterprise-gateway-minikube-helm.yaml`:
```yaml
image: elyra/enterprise-gateway:3.2.3
imagePullPolicy: Always
logLevel: DEBUG

kernel:
  shareGatewayNamespace: true
  launchTimeout: 300
  cullIdleTimeout: 3600
  allowedKernels:
    - pyspark
    - python3
  defaultKernelName: pyspark

kernelspecsPvc:
  enabled: true
  name: pvc-kernelspecs

kip:
  enabled: false
  image: elyra/kernel-image-puller:3.2.3
  imagePullPolicy: Always
  pullPolicy: Always
  defaultContainerRegistry: quay.io

```
This deploys JEG with remote kernel management and persistent kernelspec storage.

## Step 2: Configure the Notebook CR

Edit your Kubeflow Notebook resource to add the following environment variables:
    
```yaml
env:
  - name: JUPYTER_GATEWAY_URL
    value: http://enterprise-gateway.enterprise-gateway:8888
  - name: JUPYTER_GATEWAY_REQUEST_TIMEOUT
    value: "120"

```

You can do this from the Kubeflow UI, Lens, or using kubectl to edit notebooks.

These variables configure JupyterLab to forward kernel execution to JEG, which then runs PySpark jobs via the Spark Operator.

## What Happens Next

Once everything is set up:

- Launch a notebook from the Kubeflow UI
- Select the `pyspark` kernel
- Write and run PySpark code
- Your notebook submits Spark jobs via JEG → Spark Operator → Kubernetes



