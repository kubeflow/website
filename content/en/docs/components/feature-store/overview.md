+++
title = "Introduction to Feast"
description = "Overview of Feast for feature storage, management, and serving"
weight = 10
                    
+++

{{% alpha-status 
  feedbacklink="https://github.com/feast-dev/feast/issues" %}}
  
Use [Feast](http://feast.dev/) for defining, managing, discovering, validating, and serving features to your models during training and inference.

This page introduces feature store concepts as well as Feast as a component of Kubeflow.

## Introduction to feature stores

Feature stores are systems that help to address some of the key challenges that ML teams face when productionizing features

* __Feature sharing and reuse__: Engineering features is one of the most time consuming activities in building an end-to-end ML system, yet many teams continue to develop features in silos. This leads to a high amount of re-development and duplication of work across teams and projects.

* __Serving features at scale__: Models need data that can come from a variety of sources, including event streams, data lakes, warehouses, or notebooks. ML teams need to be able to store and serve all these data sources to their models in a performant and reliable way. The challenge is scalably producing massive datasets of features for model training, and providing access to real-time feature data at low latency and high throughput in serving.

* __Consistency between training and serving__: The separation between data scientists and engineering teams often lead to the re-development of feature transformations when moving from training to online serving. Inconsistencies that arise due to discrepancies between training and serving implementations frequently leads to a drop in model performance in production.

* __Point-in-time correctness__:  General purpose data systems are not built with ML use cases in mind and by extension don't provide point-in-time correct lookups of feature data. Without a point-in-time correct view of data, models are trained on datasets that are not representative of what is found in production, leading to a drop in accuracy.

* __Data quality and validation__: Features are business critical inputs to ML systems. Teams need to be confident in the quality of data that is served in production and need to be able to react when there is any drift in the underlying data.

## Feast as a feature store

[Feast](http://feast.dev/) is an [open-source](https://github.com/feast-dev/feast) feature store that helps teams operate ML systems at scale by allowing them to define, manage, validate, and serve features to models in production. 

Feast provides the following functionality:

* __Load streaming and batch data__: Feast is built to be able to ingest data from a variety of bounded or unbounded sources. Feast allows users to ingest data from streams, object stores, databases, or notebooks. Data that is ingested into Feast is persisted in both online store and historical stores, which in turn is used for the creation of training datasets and serving features to online systems.

* __Standardized definitions__: Feast becomes the single source of truth for all feature definitions and data within an organization. Teams are able to capture documentation, metadata, and metrics about features. This allows teams to communicate clearly about features, test feature data, and determine if a feature is both safe and relevant to their use cases. 

* __Historical serving__: Features that are persisted in Feast can be retrieved through its feature serving APIs to produce training datasets. Feast is able to produce massive training datasets that are agnostics of the data source that was used to ingest the data originally. Feast is also able to ensure point-in-time correctness when joining these data sources, which in turn ensures the quality and consistency of features reaching models.

* __Online serving__: Feast exposes low latency serving APIs for all data that has been ingested into the system. This allows all production ML systems to use Feast as the primary data source when looking up real-time features.

* __Consistency between training and serving__: Feast provides a consistent view of feature data through the use of a unified ingestion layer, unified serving API and canonical feature references. By building ML systems on feature references, teams abstract away the underlying data infrastructure and make it possible to safely move models between training and serving without a drop in data consistency.
 
* __Feature sharing and reuse__: Feast provides a discovery and metadata API that allows teams to track, share, and reuse features across projects. Feast also decouples the process of creating features from the process of consumption, meaning teams that start new projects can begin by simply consuming features that already exist in the store, instead of starting from scratch. 

* __Statistics and validation__: Feast allows for the generation of statistics based on features within the systems. Feast has compatibility with TFDV, meaning statistics that are generated by Feast can be validated using TFDV. Feast also allows teams to capture TFDV schemas as part of feature definitions, allowing domain experts to define data properties that can be used for validating these features in other production settings like training, ingestion, or serving.

## Next steps

Please follow the [Getting Started with Feast](/docs/components/feature-store/getting-started/) guide to set up Feast and run walk through our tutorials.

## Resources

* [Feast: Documentation](http://docs.feast.dev/)
* [Feast: Source Code](https://github.com/feast-dev/feast)
* [Google Cloud - Introducing Feast: An open source feature store for machine learning](https://cloud.google.com/blog/products/ai-machine-learning/introducing-feast-an-open-source-feature-store-for-machine-learning)
* [Medium - Feast: Bridging ML Models and Data](https://blog.gojekengineering.com/feast-bridging-ml-models-and-data-efd06b7d1644)