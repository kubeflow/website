---
title: Integration with Kubeflow Notebooks
description: Integrating Kubeflow Notebooks with the Spark Operator
weight: 110
---

If you're using Kubeflow Notebooks and want to run big data or distributed machine learning jobs with PySpark, the option is now available.

The Spark Operator streamlines the deployment of Apache Spark applications on Kubernetes. By integrating it with [Jupyter Enterprise Gateway](https://github.com/jupyter-server/enterprise_gateway) and Kubeflow Notebooks, users can now run PySpark workloads at scale directly from a kubeflow notebook interface, without worrying about the underlying Spark infrastructure.

This integration enables a seamless workflow for data scientists and ML engineers, allowing users to write PySpark code in their Kubeflow notebooks, which is then executed remotely using Kubernetes resources via the Spark Operator and Jupyter Enterprise Gateway.

## Architecture

The following diagram illustrates how the components work together:

<img src="/docs/images/spark-operator/notebooks-spark.png" 
     alt="Architecture diagram showing Kubeflow notebooks integrated with Spark Operator" 
     class="mt-3 mb-3 border rounded">
</img>

---

## Overview

In a typical Kubeflow setup, users access Kubeflow Notebooks through the central dashboard. These notebooks can now be configured to run PySpark code remotely through kernels managed by Jupyter Enterprise Gateway.

Behind the scenes:

1. Jupyter Enterprise Gateway receives execution requests from Kubeflow notebooks.
2. Jupyter Enterprise Gateway creates and submits `SparkApplication` Custom Resources.
3. The Spark Operator handles the lifecycle of Spark driver and executor pods in Kubernetes.

This architecture enables scalable, elastic execution of big data or distributed ML workloads.

## Prerequisites

- A running Kubeflow deployment with Notebook Controller enabled
- Spark Operator installed and configured in the cluster
- Helm installed locally

---

## Step 1: Deploy Enterprise Gateway

This step creates a dedicated Kubernetes namespace (enterprise-gateway) and sets up a local persistent volume and claim using hostPath.

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
Now we will be deploying Jupyter Enterpise Gateway with support for remote kernel management and persistent kernelspec storage.

Save the following manifest as `enterprise-gateway-helm.yaml` which will be used as the basic configuration for the gateway.

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

Then deploy Enterprise Gateway using Helm:

The command below uses a YAML file named enterprise-gateway-helm.yaml, which includes an example configuration shown above.

```yaml
helm upgrade --install enterprise-gateway \
  https://github.com/jupyter-server/enterprise_gateway/releases/download/v3.2.3/jupyter_enterprise_gateway_helm-3.2.3.tar.gz \
  --namespace enterprise-gateway \
  --values enterprise-gateway-helm.yaml \
  --create-namespace \
  --wait

```

## Step 2: Configure the Notebook to connect to the Jupyter Gateway

Each user will have to edit their Kubeflow Notebook's custom resources to configure the following environment variables to allow notebook to connect to the deployed Jupyter gateway.
    
```yaml
env:
  - name: JUPYTER_GATEWAY_URL
    value: http://enterprise-gateway.enterprise-gateway:8888
  - name: JUPYTER_GATEWAY_REQUEST_TIMEOUT
    value: "120"

```

You can do this from the Lens, or using the following kubectl command below.

The <NOTEBOOK_NAME> parameter is the name of the notebook created on the Kubeflow Notebook workspace.

```yaml
kubectl patch notebook <NOTEBOOK_NAME> \
  -n kubeflow-user-example-com \
  --type='json' \
  -p='[
    {
      "op": "add",
      "path": "/spec/template/spec/containers/0/env",
      "value": [
        {
          "name": "JUPYTER_GATEWAY_URL",
          "value": "http://enterprise-gateway.enterprise-gateway:8888"
        },
        {
          "name": "JUPYTER_GATEWAY_REQUEST_TIMEOUT",
          "value": "120"
        }
      ]
    }
  ]'

```

These variables configure JupyterLab to forward kernel execution to Jupyter Enterprise Gateway, which then runs PySpark jobs via the Spark Operator.

## What Happens Next

Once everything is set up:

- Launch a notebook from the Kubeflow UI
- Select the `pyspark` kernel
- Write and run PySpark code
- Your notebook submits Spark jobs via Jupyter Enterprise Gateway → Spark Operator → Kubernetes



