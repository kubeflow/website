+++
title = "Getting Started"
description = "Getting started with Feast and Kubeflow"
weight = 20
+++

This guide provides the necessary resources to install [Feast](https://feast.dev/) alongside Kubeflow, describes the usage of Feast with Kubeflow components, and provides examples that users can follow to test their setup.

For an overview of Feast, please read [Introduction to Feast](/docs/external-add-ons/feast/introduction/).

## Installing Feast with Kubeflow

### Requirements

- This guide assumes that you have a running Kubeflow cluster already. 
  If you don't have Kubeflow installed, then head on over to the [Kubeflow installation guide](/docs/started/getting-started/).
- This guide also assumes that you have a running online feature store that Feast supports (Redis, Datastore, DynamoDB).
- The latest version of Feast does not need to be installed into Kubernetes. 
  It is possible to run Feast completely from CI or as a client library (during training or inference)
- Feast requires a bucket (S3, GCS, Minio, etc) to maintain a feature registry, requires an online feature store for serving feature values, and it requires a scheduler to keep the online store up to date.

### Installation

To use Feast with Kubeflow, please follow the following steps:

- [Install Feast](https://docs.feast.dev/how-to-guides/feast-gcp-aws/install-feast) into your development environment, as well as any environment where you want to register feature views or read features from the feature store.
- [Create a feature repository](https://docs.feast.dev/how-to-guides/feast-gcp-aws/create-a-feature-repository) to store your feature views and entities. 
  Make sure to configure your feature_store.yaml to point to your online store. 
  Please see the online store [configuration reference](https://docs.feast.dev/reference/online-stores) here for more details. 
- [Deploy your feature store](https://docs.feast.dev/how-to-guides/feast-gcp-aws/deploy-a-feature-store). This step configures your online store and sets up your feature registry. 
- [Build a training dataset](https://docs.feast.dev/how-to-guides/feast-gcp-aws/build-a-training-dataset). This step is typically executed from a Kubeflow Pipeline from which you'd train a model.
- [Load features into the online store](https://docs.feast.dev/how-to-guides/feast-gcp-aws/load-data-into-the-online-store). This step can also be executed from a Kubernetes cron job.
- [Read features from the online store](https://docs.feast.dev/how-to-guides/feast-gcp-aws/read-features-from-the-online-store). This step is typically executed from your model serving service, right before calling your model for a prediction.

### Advanced

- Please see [this guide](https://docs.feast.dev/how-to-guides/running-feast-in-production) which provides best practices for running Feast in a production context.
- Please see [this guide](https://docs.google.com/document/u/1/d/1AOsr_baczuARjCpmZgVd8mCqTF4AZ49OEyU4Cn-uTT0/edit) for upgrading from Feast 0.9 (Spark-based) to the latest Feast (0.12+).

## Accessing Feast from Kubeflow

Once Feast is installed within the same Kubernetes cluster as Kubeflow, users can access its APIs directly without any additional steps.

Feast APIs can roughly be grouped into the following sections:

- __Feature definition and management__: Feast provides both a [Python SDK](https://docs.feast.dev/getting-started/quickstart) and [CLI](https://docs.feast.dev/reference/feast-cli-commands) for interacting with Feast Core. 
  Feast Core allows users to define and register features and entities and their associated metadata and schemas. 
  The Python SDK is typically used from within a Jupyter notebook by end users to administer Feast, but ML teams may opt to version control feature specifications in order to follow a GitOps based approach.
- __Model training__: The Feast Python SDK can be used to trigger the [creation of training datasets](https://docs.feast.dev/how-to-guides/feast-gcp-aws/build-a-training-dataset). 
  The most natural place to use this SDK is to create a training dataset as part of a [Kubeflow Pipeline](/docs/components/pipelines/introduction) prior to model training.
- __Model serving__: The Feast Python SDK can also be used for [online feature retrieval](https://docs.feast.dev/how-to-guides/feast-gcp-aws/read-features-from-the-online-store). 
  This client is used to retrieve feature values for inference with [Model Serving](/docs/components/pipelines/introduction) systems like KFServing, TFX, or Seldon.

## Examples

Please see our [tutorials](https://docs.feast.dev/tutorials/tutorials-overview) section for a full list of examples:

- [Driver ranking with Feast](https://docs.feast.dev/tutorials/driver-ranking-with-feast)
- [Fraud detection on GCP](https://docs.feast.dev/tutorials/fraud-detection)
- [Real-time credit scoring on AWS](https://docs.feast.dev/tutorials/real-time-credit-scoring-on-aws)

## Next steps

- For more details on Feast concepts please see the [Feast documentation](https://docs.feast.dev/)
- Please see our [changelog](https://github.com/feast-dev/feast/blob/master/CHANGELOG.md) and [roadmap](https://docs.feast.dev/roadmap) for new or upcoming functionality.
- Please use [GitHub issues](https://github.com/feast-dev/feast/issues) for any feedback, issues, or feature requests.
- If you would like to get involved with Feast, come and visit us in [#Feast](https://slack.feast.dev) or join our [community calls](https://docs.feast.dev/community), [mailing list](https://docs.feast.dev/community), or have a look at our [contribution process](https://docs.feast.dev/project/contributing) 
