+++
title = "Kubeflow 0.3 Simplifies Setup & Improves ML Development"
description = "Announcing Kubeflow 0.3"
weight = 20
publishDate = 2018-10-29T05:52:19-07:00
draft = false
+++

## Since Last We Met

It has been 3 months since landing [0.2](https://www.kubeflow.org/blog/announcing_kubeflow_0.2/) and we have continued to be amazed by the support from the community. The community continues to grow, with 100+ members from 20 different organizations and more than 4,500 Github stars!

In September, we held our first [contributor summit](http://bit.ly/kf-summit-2018-overview)! We were thrilled to have over 60 participants join in person along with 10 remote contributors from 4 continents! We are tentatively planning our next summit for early 2019.

To all our contributors, we want to share our deep appreciation for your support! We are getting closer to our vision of letting data scientists and ML engineers focus on building models and products by giving them a Kubernetes native platform for ML that is  easy-to-use, portable and  scalable.

## Upcoming Events
We have a number of upcoming events where you can connect with us and learn more about Kubeflow

* [KubeCon, Seattle](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/), 11-13 December, 2018
* [YOW!, Melbourne](https://melbourne.yowconference.com.au/), 4-7 December, 2018
     * [Kubeflow Explained: NLP Architectures on Kubernetes](https://melbourne.yowconference.com.au/proposal/?id=6858): Michelle Casbon
* [YOW!, Brisbane](https://brisbane.yowconference.com.au/), 3-4 December, 2018
     * [Kubeflow Explained: NLP Architectures on Kubernetes](https://brisbane.yowconference.com.au/proposal/?id=6859): Michelle Casbon
* [YOW!, Sydney](https://sydney.yowconference.com.au/), 27-30 November, 2018
     * [Kubeflow Explained: NLP Architectures on Kubernetes](https://sydney.yowconference.com.au/proposal/?id=6860): Michelle Casbon
* [KubeCon, Shanghai](https://www.lfasiallc.com/events/kubecon-cloudnativecon-china-2018/), 14-15 November, 2018

For the latest information please refer to our [events calendar](https://www.kubeflow.org/docs/about/events/).

## Introducing Kubeflow 0.3

We're thrilled to announce the availability of Kubeflow 0.3. This release provides easier deployment and customization of components and better multi-framework support. Let's walk through some of the highlights:

### Deploy

Combining existing services and applications into a cohesive, unified ML platform is one of the biggest obstacles to leveraging Kubernetes for ML. We are pleased to announce several features as part of our ongoing effort to tackle this problem.

**Declarative and Extensible Deployment**

We continue to simplify the deployment experience with a new deployment command line script; **kfctl.sh**. This tool allows Kubeflow to easily be configured and deployed like this:

```
${KUBEFLOW_REPO}/scripts/kfctl.sh init ${KFAPP} `--platform gcp --project ${PROJECT}`
cd ${KFAPP}
${KUBEFLOW_REPO}/scripts/kfctl.sh generate platform
${KUBEFLOW_REPO}/scripts/kfctl.sh apply platform
${KUBEFLOW_REPO}/scripts/kfctl.sh generate k8s
${KUBEFLOW_REPO}/scripts/kfctl.sh apply k8s
```

The new tool allows Kubernetes resources and non-K8s resources (e.g. clusters, filesystems, etc...) to be created and deployed consistently. We've divided the deployment process into two steps: 1) creating declarative configs describing your deployment and 2) applying these configs. This makes it easy to customize your deployment and check it into source control for repeatable deployments.

**More options for local development**

 * Minikube deployment now provides a single command shell script based deployment.

 * In addition to minikube, you can now use MicroK8s to easily run Kubeflow on your laptop.

### Develop

In order to deliver a complete platform for building ML products, we are continuing to add and improve the services included in Kubeflow.

**Inference**

We are pleased to announce a number of improvements to our inference capabilities.

Using Apache Beam, it is now possible to do batch inference with GPUs (but non distributed) for [TensorFlow](https://www.kubeflow.org/docs/guides/components/tfbatchpredict/).

We are continuing our efforts to make it easy to run TFServing in production by adding a Liveness probe and using fluentd to log [request and responses](https://www.kubeflow.org/docs/guides/components/tfserving/#request-logging)to enable[ ](https://www.kubeflow.org/docs/guides/components/tfserving/#request-logging)model retraining. In collaboration with NVIDIA we are really excited to be offering more options for online prediction using GPUs by taking advantage of [NVIDIA's TensorRT Inference Server.](https://www.kubeflow.org/blog/nvidia_tensorrt/)

**Hyperparameter tuning**

Finding optimal hyperparameters is one of the biggest barriers to producing high quality models. In order to make it easy to use hyperparameter tuning without writing any code, we are introducing a new K8s custom controller, StudyJob, that allows a hyperparameter search to be defined using YAML. This [manifest](https://github.com/kubeflow/katib/blob/master/examples/hypb-example.yaml) shows how easy it is to tune your models using the hyperband algorithm.

**Training**

We continue to expand the list of supported frameworks by offering an apha release of a K8s custom controller for Chainer([docs](https://www.kubeflow.org/docs/guides/components/chainer/)).

Cisco has created a v1alpha2 API for PyTorch that brings parity and consistency with our TFJob operator.

For PyTorch and TFJob we've added a number of highly requested features needed to handle production workloads. We've added support for gang-scheduling using Kube Arbitrator ([docs](https://www.kubeflow.org/docs/guides/job-scheduling/)) to avoid stranding resources and deadlockings in clusters under heavy load. We've added a TTL to allow garbage collecting old, completed jobs to avoid taxing the K8s API server. To support multi-tenant clusters, the operators can now be scoped to only claim resources in a specified namespace.

**Examples**

We've added numerous examples to illustrate the growing number of ways in which you can leverage Kubeflow.

* The XGBoost [example](https://github.com/kubeflow/examples/tree/master/xgboost_ames_housing) illustrates how to use non-DL frameworks with Kubeflow
* The object detection [example-](https://github.com/kubeflow/examples/commits/master/object_detection) illustrates how to leverage GPUs for online and batch inference.
*   The financial time series prediction example illustrates how to leverage Kubeflow for time series analysis ([blog](https://blog.ml6.eu/using-kubeflow-for-analyzing-financial-time-series-part-i-18580ef5df0b), [code](https://github.com/kubeflow/examples/tree/master/financial_time_series)).


**Kubebench**

Benchmarking is critical to identifying performance bottlenecks that slow development or waste expensive resources. To address these needs, Cisco created [Kubebench](https://github.com/kubeflow/kubebench), a framework for benchmarking ML workloads on Kubeflow.

**TFX Libraries**

The 0.3 Kubeflow Jupyter images ship with [TF Data-Validation](https://github.com/tensorflow/data-validation). TF Data-Validation is a library for exploring and validating machine learning data.

And many more. For a complete list of updates, see the 0.3 [Change Log](https://github.com/kubeflow/kubeflow/blob/master/CHANGELOG.md)  on GitHub.

## Getting Started

To get started with Kubeflow we suggest following the steps below:


1.  Follow our getting [started guide](https://www.kubeflow.org/docs/started/getting-started/)  to deploy Kubeflow 
1.  Try out Kubeflow using one of the  existing models in the [examples repository](https://github.com/kubeflow/examples). 


## What's Next

Our next major release, 0.4, will be coming by the end of this year. Here are some key areas we are working on.


### Ease of Use

To make Kubeflow more accessible to data scientists, we want to make it possible to perform common ML tasks without having to learn Kubernetes. In 0.4, we hope to provide an initial version of tooling that makes it possible for data scientists to train and deploy models entirely from a notebook.


### Model Tracking

Keeping track of experiments is a major source of toil for data scientists and ML Engineers. In 0.4, we plan on making it easier to track models by providing a simple API and database for tracking models.


### Production Readiness

With 0.4 we want to continue to push Kubeflow towards production readiness by graduating our PyTorch and TFJob operators to beta.


## Come Help!

As always, we're listening! Please tell us the feature (or features) you'd really like to see that aren't there yet. Some options for making your voice heard include:


*   Join the Kubeflow [Slack channel](https://join.slack.com/t/kubeflow/shared_invite/enQtMjgyMzMxNDgyMTQ5LWUwMTIxNmZlZTk2NGU0MmFiNDE4YWJiMzFiOGNkZGZjZmRlNTExNmUwMmQ2NzMwYzk5YzQxOWQyODBlZGY2OTg)
*   File GitHub issues in [kubeflow/kubeflow](https://github.com/kubeflow/kubeflow)
*   Email the [Kubeflow-discuss](https://groups.google.com/forum/#!forum/kubeflow-discuss) mailing list
*   Follow us at [Kubeflow Twitter](http://twitter.com/kubeflow) account
*   Attend our [weekly community meeting](https://github.com/kubeflow/community)

Thank you for all your support so far!

*Jeremy Lewi, Abhishek Gupta, & Chris Cho (Google)*
