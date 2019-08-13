+++
title = "Getting Started with Kubeflow on Docker Desktop"
weight = 10
+++

This document outlines the steps to get Kubeflow running with Docker Desktop. Docker Desktop allows you to build production ready applications locally. 

By the end of this tutorial, you should be able to get Kubeflow running and access the Kubeflow Dashboard.

Pre-requisites:

- Laptop, Desktop or a Workstation
- Mac OS X or Windows 10
- Docker Desktop (https://www.docker.com/products/docker-desktop) for Mac or Windows
- kubectl installed 
- sudo or admin access on the local machine
- Access to an Internet connection with reasonable bandwidth

# Enable Kubernetes 

1. Click on the Docker Desktop logo and select 'Preferences...' 
2. On the 'Kubernetes' tab tick the 'Enable Kubernetes' checkbox and then click on 'Apply'. 


# Download and install Kubeflow 

```bash
KUBEFLOW_SRC=${PWD}/kubeflow
export KUBEFLOW_TAG=v0.5.1

mkdir ${KUBEFLOW_SRC}
cd ${KUBEFLOW_SRC}

curl https://raw.githubusercontent.com/kubeflow/kubeflow/${KUBEFLOW_TAG}/scripts/download.sh | bash
```

**KUBEFLOW_SRC** - directory where you want kubeflow source to be downloaded

**KUBEFLOW_TAG** - a tag corresponding to the version to checkout such as v0.5.1

**KFAPP** - the name of a directory where you want kubeflow configurations to be stored. 

# Install Kubeflow

Run the following to get kubeflow working: 

```bash
KFAPP=kfapp
KUBEFLOW_REPO=${KUBEFLOW_SRC} ${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform docker-for-desktop

cd ${KFAPP}
${KUBEFLOW_SRC}/scripts/kfctl.sh generate platform docker-for-desktop

ks init ks_app
${KUBEFLOW_SRC}/scripts/kfctl.sh apply all
```

# Check the installation

Run 

```bash
kubectl get namespace
```
 to ensure the deployment was successful. 


# Enable the Kubeflow UI

Run the following to enable the Kubeflow UI on port 8080

```bash
export NAMESPACE=kubeflow
kubectl port-forward svc/ambassador -n ${NAMESPACE} 8080:80
```

Open http://localhost:8080 and you should see the Kubeflow UI or http://localhost:8080/notebooks for Jupyter notebooks.  
