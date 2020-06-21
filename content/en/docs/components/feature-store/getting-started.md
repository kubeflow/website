+++
title = "Getting started with Feast"
description = "How to set up Feast and walk through examples"
weight = 20
+++

This guide provides the necessary resources to install [Feast](http://feast.dev/) alongside Kubeflow, describes the usage of Feast with Kubeflow components, and provides examples that users can follow to test their setup.

For an overview of Feast, please read [Introduction to Feast](/docs/components/feature-store/overview/).

## Install Kubeflow

This guide assumes that you have a running Kubeflow cluster already. If you don't have Kubeflow installed, then head on over to the 
[Kubeflow installation guide](/docs/started/getting-started/).

## Installing Feast with Kubeflow

Feast can be installed into a running Kubeflow deployment. The process of installing Feast into Kubernetes is documented in the [Deploying Feast into Kubernetes](https://docs.feast.dev/getting-started/deploying-feast/kubernetes) guide.

## Accessing Feast from Kubeflow

Once Feast is installed within the same Kubernetes cluster as Kubeflow, users can access its APIs directly without any additional steps.

Feast APIs can roughly be grouped into the following sections:
* __Feature definition and management__: Feast provides both a [Python SDK](https://docs.feast.dev/getting-started/connecting-to-feast-1) and [CLI](https://docs.feast.dev/getting-started/connecting-to-feast-1) for interacting with [Feast Core](https://docs.feast.dev/user-guide/architecture#feast-core). Feast Core allows users to define and register features and entities and their associated metadata and schemas. The Python SDK is typically used from within a Jupyter notebook by end users to administer Feast, but ML teams may opt to version control feature specifications in order to follow a GitOps based approach.

* __Model training__: The Feast Python SDK can be used to trigger the [creation of training datasets](https://docs.feast.dev/user-guide/feature-retrieval#3-historical-feature-retrieval) and generation of statistics through [Feast Serving](https://docs.feast.dev/user-guide/architecture#feast-serving). The most natural place to use this SDK is to create a training dataset as part of a [Kubeflow Pipeline](/docs/pipelines/pipelines-overview) prior to model training.

* __Model serving__: Feast provides three different SDKs for [online feature serving](https://docs.feast.dev/user-guide/feature-retrieval#online-feature-retrieval), a [Python SDK](https://api.docs.feast.dev/python/), [Java SDK](https://javadoc.io/doc/dev.feast/feast-sdk), and [Go SDK](https://godoc.org/github.com/feast-dev/feast/sdk/go). These clients are used prior to inference with [Model Serving](/docs/pipelines/pipelines-overview) systems like KFServing, TFX, or Seldon. 

All of the above clients interact with Feast through gRPC endpoints ([Core](https://api.docs.feast.dev/grpc/feast.core.pb.html), [Serving](https://api.docs.feast.dev/grpc/feast.serving.pb.html)). These APIs allow users to directly interface with Feast services if they do not wish to use an SDK.

## Examples

Feast also comes with example notebooks that users can use to get up to speed.
* [Introductory Notebook for Feast](https://nbviewer.jupyter.org/github/feast-dev/feast/blob/master/examples/basic/basic.ipynb)
* [Telecom Churn Prediction with XGBoost and Feast](https://nbviewer.jupyter.org/github/feast-dev/feast/blob/master/examples/feast-xgboost-churn-prediction-tutorial/Telecom%20Customer%20Churn%20Prediction%20%28with%20Feast%20and%20XGBoost%29.ipynb)

## Next steps

* For more details on Feast concepts please see the [Feast documentation](https://docs.feast.dev/)

* Please see our [changelog](https://github.com/feast-dev/feast/blob/master/CHANGELOG.md) and [roadmap](https://docs.feast.dev/roadmap) for new or upcoming functionality.

* Please use [GitHub issues](https://github.com/feast-dev/feast/issues) for any feedback, issues, or feature requests.

* If you would like to get involved with Feast, come and visit us in [#Feast](https://kubeflow.slack.com/archives/CE0L8T267) in the [Kubeflow Slack](https://join.slack.com/t/kubeflow/shared_invite/zt-cpr020z4-PfcAue_2nw67~iIDy7maAQ), or join our [community calls](https://docs.feast.dev/getting-help#community-call), [mailing list](https://docs.feast.dev/getting-help#mailing-list), or have a look at our [contribution process](https://docs.feast.dev/contributing/contributing) 

