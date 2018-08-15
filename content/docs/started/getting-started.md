+++
title = "Getting Started with Kubeflow"
description = "Quickly get running with your ML Workflow on an existing Kubernetes installation"
weight = 25
toc = true
bref = "The Kubeflow project is dedicated to making deployments of machine learning (ML) workflows on Kubernetes simple, portable and scalable. Our goal is not to recreate other services, but to provide a straightforward way to deploy best-of-breed open-source systems for ML to diverse infrastructures. Anywhere you are running Kubernetes, you should be able to run Kubeflow."
aliases = ["/docs/started/"]
[menu.docs]
  parent = "started"
  weight = 1
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

This documentation assumes you have a Kubernetes cluster available. If
not, setup one of these environments first:

  * Local: [Minikube setup](/docs/started/getting-started-minikube/)
  * Cloud: [GKE setup](/docs/started/getting-started-gke/)

For more general information on setting up a Kubernetes cluster please refer to [Kubernetes Setup](https://kubernetes.io/docs/setup/). If you want to use GPUs, be sure to follow the Kubernetes [instructions for enabling GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/).

## Quick start

Requirements:

  * ksonnet version [0.11.0](https://github.com/ksonnet/ksonnet/releases).
  * Kubernetes >= 1.8
  * kubectl

1. Run the following script to download `kfctl.sh`

    ```
    mkdir ${KUBEFLOW_SRC}
    cd ${KUBEFLOW_SRC}
    export KUBEFLOW_TAG=<version>
    curl https://raw.githubusercontent.com/kubeflow/kubeflow/{{< params "githubbranch" >}}/scripts/download.sh | bash
     ```
   * **KUBEFLOW_SRC** directory where you want to download the source to
   * **KUBEFLOW_TAG** a tag corresponding to the version to checkout such as `master` for latest code.
   * **Note** you can also just clone the repository using git.
1. To setup and deploy
    
    ```
    ${KUBEFLOW_REPO}/scripts/kfctl.sh init ${KFAPP} --platform none
    cd ${KFAPP}
    ${KUBEFLOW_REPO}/scripts/kfctl.sh generate k8s
    ${KUBEFLOW_REPO}/scripts/kfctl.sh apply k8s
    ```
   * **${KFAPP}** The name of a directory to store your configs. This directory will be created when you run init.
      * The ksonnet app will be created in the directory **${KFAPP}/ks_app**

**Important**: The commands above will enable collection of **anonymous** user data to help us improve Kubeflow; for more information including instructions for explictly
disabling it please refer to the [Usage Reporting section](/docs/guides/usage-reporting/) of the user guide.

## Troubleshooting
For detailed troubleshooting instructions, please refer to the [Troubleshooting Guide](/docs/guides/troubleshooting/).

## Resources

* The Guides section (see sections on left) provides in-depth instructions for using Kubeflow
* Self-paced scenarios for learning and trying out Kubeflow
  * [Codelabs](https://codelabs.developers.google.com/?cat=tensorflow)
    * [Introduction to Kubeflow on Google Kubernetes Engine](https://codelabs.developers.google.com/codelabs/kubeflow-introduction/index.html)
    * [Kubeflow End to End: GitHub Issue Summarization](https://codelabs.developers.google.com/codelabs/cloud-kubeflow-e2e-gis/index.html)
  * [Katacoda](https://www.katacoda.com/kubeflow)
    * [Deploying GitHub Issue Summarization with Kubeflow](https://www.katacoda.com/kubeflow/scenarios/deploying-github-issue-summarization)
    * [Deploying Kubeflow](https://www.katacoda.com/kubeflow/scenarios/deploying-kubeflow)
    * [Deploying Kubeflow with Ksonnet](https://www.katacoda.com/kubeflow/scenarios/deploying-kubeflow-with-ksonnet)
    * [Deploying Pytorch with Kubeflow](https://www.katacoda.com/kubeflow/scenarios/deploy-pytorch-with-kubeflow)
  * [Qwiklabs](https://qwiklabs.com/catalog?keywords=kubeflow)
    * [Introduction to Kubeflow on Google Kubernetes Engine](https://qwiklabs.com/focuses/960?locale=en&parent=catalog)
    * [Kubeflow End to End: GitHub Issue Summarization](https://qwiklabs.com/focuses/1257?locale=en&parent=catalog)
