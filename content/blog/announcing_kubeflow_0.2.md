+++
title = "Kubeflow 0.2 Offers New Components and Simplified Setup"
description = "Announcing Kubeflow 0.2"
weight = 20
publishDate = 2018-08-06T11:52:19-07:00
draft = false
+++

## Since Last We Met
It has been 6 months since Google announced Kubeflow at KubeCon Austin, and just 3 months since the Kubeflow community delivered 0.1 at KubeCon EU. We have been both humbled and delighted by the amazing progress since then. The community has grown even faster than we could have imagined, with nearly 100 contributors in 20 different organizations and more than 4,000 GitHub stars. But what really shocked us was how many supporting projects are collaborating with the Kubeflow community  to extend and expand what Kubeflow can do. Just a small summary include:

  - [Argo](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/argo) for managing ML workflows
  - [Caffe2 Operator](https://github.com/kubeflow/caffe2-operator) for running Caffe2 jobs
  - [Horovod & OpenMPI](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/openmpi) for improved distributed training performance of TensorFlow
  - [Identity Aware Proxy](https://github.com/kubeflow/kubeflow/blob/master/docs/gke/iap.md), which enables using security your services with identities, rather than VPNs and Firewalls
  - [Katib](https://github.com/kubeflow/katib) for hyperparameter tuning
  - [Kubernetes volume controller](https://github.com/kubeflow/experimental-kvc) which provides basic volume and data management using volumes and volume sources in a Kubernetes cluster.
  - [Kubebench](https://github.com/kubeflow/kubebench ) for benchmarking of HW and ML stacks
  - [Pachyderm](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/pachyderm) for managing complex data pipelines
  - [PyTorch operator](https://github.com/kubeflow/pytorch-operator) for running PyTorch jobs
  - [Seldon Core](https://github.com/kubeflow/kubeflow/tree/master/kubeflow/seldon) for running complex model deployments and non-TensorFlow serving

To everyone who has contributed so far, we would like to offer a huge thank you! We are getting ever closer to realizing our vision: letting data scientists and software engineers focus on the things they do well by giving them an easy-to-use, portable and scalable ML stack.

## Introducing Kubeflow 0.2
We’re proud to announce the availability of Kubeflow 0.2. The new release offers significant performance upgrades, a simplified getting started experience, and alpha support for advanced features. Let’s walk through some of the highlights:

### Improved Getting Started Experience
We know that many data scientists and ML engineers are new to Kubernetes and Kubernetes concepts. We’ve done a number of investments to minimize the amount of work they have to do to get started on the platform. This includes:

  - A new deployment script which makes getting started on an existing cluster a single command. To get a default deployment running on Kubernetes *anywhere* just execute:
    
    ```
    export KUBEFLOW_VERSION=0.2.2
    curl https://raw.githubusercontent.com/kubeflow/kubeflow/v${KUBEFLOW_VERSION}/scripts/deploy.sh | bash
    ```

  - We also offer cloud-specific versions of these deployment scripts so that you can auto create a cluster if you don’t have one available. For example:
    ```
    export KUBEFLOW_VERSION=0.2.2
    curl https://raw.githubusercontent.com/kubeflow/kubeflow/${KUBEFLOW_VERSION}/scripts/gke/deploy.sh | bash
    ```
  - A central UI that gives you visibility into all the components running in your cluster - Central UI - To make it easier to navigate among components

    ![Central UI Dashboard](../Central_UI_Screenshot.svg)

  - A declarative deployment process that first creates Cloud resources including your Kubernetes cluster and then deploys Kubeflow. We have an example for GCP using Deployment Manager, and plan to add support for other clouds using tools like Terraform.

### New and Improved Components Available
The essence of Kubeflow is all about extending the project with new components, and making the existing components more feature rich. Some examples of the improvements we made in 0.2 include:

  - Adding TFX components TFMA & TFT
  - Several TF Job improvements
    - Event driven implementation making running even faster.
    - Preservation of logs after job finishes.
    - A master/chief is no longer required; expanding the number of TF programs that just run
    - Simplified ksonnet prototypes for TFJob; make it easier to do advanced customization
  - Alpha support for advanced tooling including:
    - Katib for Hyperparameter search
    - PyTorch operator 
    - Horvod / MPI integration

### Leveraging Kubernetes for deeper platform integrations
Part of our goals with Kubeflow is to enable platform extensions so that users can customize their deployments based on their needs. These include:

  - Simplified networking integration including auto provisioning of endpoints and identity aware proxysetup
  - Using Kubernetes Persistent Volumes to simplify persistent storage (both locally and in the cloud) - PVC for Jupyter notebooks
  - Kubernetes native monitoring which works with both Prometheus and cloud-based monitoring (such as Stackdriver)

And many more. For a more comprehensive list, please see the [issues closed in 0.2.0 on github](https://github.com/kubeflow/kubeflow/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+label%3Arelease%2F0.2.0+).

## Learning More
If you’d like to try out Kubeflow, we have a number of options for you:

  - You can use [sample walkthroughs](https://www.katacoda.com/kubeflow) hosted on Katacoda
  - You can follow a guided tutorial with existing models from the [examples repository](https://github.com/kubeflow/examples). We recommend the [GitHub Issue Summarization](https://github.com/kubeflow/examples/tree/master/github_issue_summarization) for a complete E2E example.
  - You can start a cluster on your own and try your own model. Any Kubernetes conformant cluster will support Kubeflow including those from contributors Alibaba Cloud, [Caicloud](https://www.prnewswire.com/news-releases/caicloud-releases-its-kubernetes-based-cluster-as-a-service-product-claas-20-and-the-first-tensorflow-as-a-service-taas-11-while-closing-6m-series-a-funding-300418071.html),
 [Canonical](https://jujucharms.com/canonical-kubernetes/),
 Cisco, Dell,
 [Google](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-container-cluster),
 [Heptio](https://heptio.com/products/kubernetes-subscription/),
 Intel,
 [Mesosphere](https://github.com/mesosphere/dcos-kubernetes-quickstart),
 [Microsoft](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough),
 [IBM](https://console.bluemix.net/docs/containers/cs_tutorials.html#cs_cluster_tutorial),
 [Red Hat/Openshift](https://docs.openshift.com/container-platform/3.3/install_config/install/quick_install.html#install-config-install-quick-install) and
 [Weaveworks](https://www.weave.works/product/cloud/).


## What’s Next
Our next major release will be 0.3 coming this fall. In it, we expect to land the following new features:

  - Hyperparameter tuning jobs can be submitted without writing any code
  - Job operators - Consistent APIs across supported frameworks
  - Getting Started - Click to Deploy

## Come Help!
As always, we’re listening! Please tell us the feature (or features) you’d really like to see that aren’t there yet. Some options for making your voice heard include:

  - The [Kubeflow Slack channel](https://join.slack.com/t/kubeflow/shared_invite/enQtMjgyMzMxNDgyMTQ5LWUwMTIxNmZlZTk2NGU0MmFiNDE4YWJiMzFiOGNkZGZjZmRlNTExNmUwMmQ2NzMwYzk5YzQxOWQyODBlZGY2OTg)
  - The [Kubeflow-discuss](https://groups.google.com/forum/#!forum/kubeflow-discuss) email list
  - The [Kubeflow Twitter](http://twitter.com/kubeflow) account
  - Our [weekly community meeting](https://github.com/kubeflow/community)
  - Please download and run [Kubeflow](https://github.com/kubeflow/kubeflow/), and submit bugs!

Thank you for all your support so far!

*Jeremy Lewi & David Aronchick Google*

