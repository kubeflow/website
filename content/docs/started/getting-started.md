+++
title = "Getting Started with Kubeflow"
description = "Quickly get running with your ML Workflow on an existing Kubernetes installation"
weight = 25
toc = true
bref = "The Kubeflow project is dedicated to making deployments of machine learning (ML) workflows on Kubernetes simple, portable and scalable. Our goal is not to recreate other services, but to provide a straightforward way to deploy best-of-breed open-source systems for ML to diverse infrastructures. Anywhere you are running Kubernetes, you should be able to run Kubeflow."

+++

## Who should consider using Kubeflow?

Based on the current functionality you should consider using Kubeflow if:

  * You want to train/serve TensorFlow models in different environments (e.g. local, on prem, and cloud)
  * You want to use Jupyter notebooks to manage TensorFlow training jobs
  * You want to launch training jobs that use resources -- such as additional
    CPUs or GPUs -- that aren't available on your personal computer
  * You want to combine TensorFlow with other processes
       * For example, you may want to use [tensorflow/agents](https://github.com/tensorflow/agents) to run simulations to generate data for training reinforcement learning models.

This list is based ONLY on current capabilities. We are investing significant resources to expand the
functionality and actively soliciting help from companies and individuals interested in contributing (see [Contributing](/docs/contributing/)).

## Setup

This documentation assumes you have a Kubernetes cluster already available. 

  * For local environment try [Minikube setup](/docs/started/getting-started-minikube/).
  * For cloud environment try [GKE setup](/docs/started/getting-started-gke/).
  * For general k8s cluster try [quick start](/docs/started/getting-started/#quick-start) or [install via ksonnet](/docs/started/getting-started/#install-via-ksonnet).

For more general information on setting up a Kubernetes cluster please refer to [Kubernetes Setup](https://kubernetes.io/docs/setup/). If you want to use GPUs, be sure to follow the Kubernetes [instructions for enabling GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/).

## quick start

Get kubeflow bootstrapper [yaml spec](https://github.com/kubeflow/kubeflow/blob/master/bootstrap/bootstrapper.yaml)

```
    kubectl create -f bootstrapper.yaml
```

You should have kubeflow components deployed to your k8s cluster.
Exec into pod ```kubeflow-bootstrapper-0``` in namespace ```kubeflow-admin``` if you need to edit your ksonnet app.
Your ksonnet app is store at ```/opt/bootstrap/default``` in above pod.

The default components are defined in [default.yaml](https://github.com/kubeflow/kubeflow/blob/master/bootstrap/config/default.yaml), user can customize which components to deploy by
pointing ```--config``` args in ```bootstrapper.yaml``` to their own config (eg. a configmap in k8s clsuter)

This bootstrapper example [config](https://github.com/kubeflow/kubeflow/blob/master/bootstrap/config/gcp_prototype.yaml) can help explain how config customization works.

## Install Via Ksonnet

**Requirements**

  * ksonnet version [0.9.2](https://ksonnet.io/#get-started).
  * Kubernetes >= 1.8 [see here](https://github.com/kubeflow/tf-operator#requirements)

**Github Tokens**

It is HIGHLY likely you'll overload Github's API if you are unauthenticated. To get around this, do the following steps:

* Go to https://github.com/settings/tokens and generate a new token. You don't have to give it any access at all as you are simply authenticating.
* Make sure you save that token someplace because you can't see it again. If you lose it you'll have to delete and create a new one.
* Set an environment variable in your shell: export GITHUB_TOKEN=<token>. You may want to do this as part of your shell startup scripts (i.e. .profile).

```
echo "export GITHUB_TOKEN=${GITHUB_TOKEN}" >> ~/.bashrc
```

**Steps**

In order to quickly set up all components, execute the following commands:

```commandline
# Create a namespace for kubeflow deployment
NAMESPACE=kubeflow
kubectl create namespace ${NAMESPACE}

# Which version of Kubeflow to use
# For a list of releases refer to:
# https://github.com/kubeflow/kubeflow/releases
VERSION=v0.1.2

# Initialize a ksonnet app. Set the namespace for it's default environment.
APP_NAME=my-kubeflow
ks init ${APP_NAME}
cd ${APP_NAME}
ks env set default --namespace ${NAMESPACE}

# Install Kubeflow components
ks registry add kubeflow github.com/kubeflow/kubeflow/tree/${VERSION}/kubeflow

ks pkg install kubeflow/core@${VERSION}
ks pkg install kubeflow/tf-serving@${VERSION}
ks pkg install kubeflow/tf-job@${VERSION}

# Create templates for core components
ks generate kubeflow-core kubeflow-core

# If your cluster is running on Azure you will need to set the cloud parameter.
# If the cluster was created with AKS or ACS choose aks, it if was created
# with acs-engine, choose acsengine
# PLATFORM=<aks|acsengine>
# ks param set kubeflow-core cloud ${PLATFORM}

# Enable collection of anonymous usage metrics
# Skip this step if you don't want to enable collection.
ks param set kubeflow-core reportUsage true
ks param set kubeflow-core usageId $(uuidgen)

# Deploy Kubeflow
ks apply default -c kubeflow-core
```

The above commands are used to setup JupyterHub and a custom resource for running TensorFlow training jobs. Furthermore, the ksonnet packages provide prototypes that can be used to configure TensorFlow jobs and deploy TensorFlow models.
Used together, these make it easy for a user to transition from training to model serving using Tensorflow with minimal
effort, and in a portable fashion across different environments.

For more detailed instructions about how to use Kubeflow, including testing the Jupyter Notebook, please refer to the [user guide](user_guide.md).

**Important**: The commands above will enable collection of **anonymous** user data to help us improve Kubeflow; for more information including instructions for explictly
disabling it please refer to the [Usage Reporting section](user_guide.md#usage-reporting) of the user guide.

## Troubleshooting
For detailed troubleshooting instructions, please refer to [this section of the user guide](user_guide.md#troubleshooting).

## Resources

* The [kubeflow user guide](user_guide.md) provides in-depth instructions for using Kubeflow
* Katacoda has produced a [self-paced scenario](https://www.katacoda.com/kubeflow) for learning and trying out Kubeflow
