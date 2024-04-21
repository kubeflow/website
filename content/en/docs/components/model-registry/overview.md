+++
title = "Overview"
description = "An overview for Kubeflow Model Registry"
weight = 10
                    
+++

{{% alpha-status
  feedbacklink="https://github.com/kubeflow/model-registry" %}}

## What is Model Registry?

A model registry is an important component in the life cycle of AI/ML models, an integral component for any MLOps platform and for ML workflows.

A model registry provides a central index for ML model developers to index and manage models, versions, and ML artifacts metadata.
It fills a gap between model experimentation and production activities.
It provides a central interface for all stakeholders in the ML lifecycle to collaborate on ML models.

<img src="/docs/components/model-registry/images/MLloopinnerouter.png"
  alt="Model Registry MLOps loop"
  class="mt-3 mb-3">

- **Create**: during the creation phase, the Model Registry facilitates collaboration between different teams in order to track changes, experiment with different model architectures, and maintain a history of model iterations.
- **Verify**: in the verification stage, the Model Registry supports rigorous testing and validation before progressing further, maintaining a record of performance metrics and test results for each version.
- **Package**: the Model Registry assists in organizing model artifacts and dependencies, enabling seamless integration with deployment pipelines and ensuring reproducibility across environments.
- **Release**: when releasing a model, the Model Registry manages the transition of validated versions to production-ready status, helping organization to maintain versioning conventions and facilitating approval workflows.
- **Deploy**: during deployment, the Model Registry provides information of the approved model versions and associated artifacts, ensuring consistency and traceability across deployment environments.
- **Monitor**: in the monitoring phase, the Model Registry supports ongoing performance monitoring and model drift detection by maintaining a comprehensive record of deployed models and linking to their performance metrics, facilitating proactive maintenance and retraining as needed.

DevOps, Data Scientists, and developers need to collaborate with other users in the ML workflow to get models into production.
Data scientists need an efficient way to share model versions, artifacts and metadata with other users that need access to those models as part of the MLOps workflow.

## Use Cases

This section describes Model Registry use-cases in the context of a MLOps Platform with Model Training, Experimentation, and Deployment.

A company, ACME Inc., is developing a machine-learning model for predicting customer churn. They require a centralized model registry for their MLOps platform (based on Kubeflow) for managing their ML model development lifecycle, including training, experimentation, and deployment. They want to ensure model governance, reproducibility, and efficient collaboration across data scientists and engineers.

### Personas

* **Data Scientist**: develops and evaluates different models for customer churn prediction. Tracks the performance of various model versions to compare them easily.
* **MLOps Engineer**: Responsible for deploying the chosen model into production. They need to access the latest model version and its metadata to configure the deployment environment.
* **Business Analyst**: Monitors the deployed model's performance and makes decisions based on its predictions. They need to understand the lineage of the model and its operational metrics.

### Use Case 1: Tracking the Training of Models

The _Data Scientist_ uses Kubeflow Notebooks to perform exploratory research and trains several types of models, with different hyperparameters and metrics. The Kubeflow Model Registry is used to track those models, in order to make comparisons and identify the best-performing model. Once the champion model is selected, the _Data Scientist_ shares the model with the team. The _Data Scientist_ also tracks the lineage of training data sources and notebook code.

* Track models available on storage: once the model is stored, it can then be tracked in the Kubeflow Model Registry for managing its lifecycle. The Model Registry can catalog, list, index, share, record, organize this information. This allows the _Data Scientist_ to compare different versions and revert to previous versions if needed.
* Track and compare performance: View key metrics like accuracy, recall, and precision for each model version. This helps identify the best-performing model for deployment.
* Create lineage: Capture the relationships between data, code, and models. This enables the _Data Scientist_ to understand the origin of each model and reproduce specific experiments.
* Collaborate: Share models and experiment details with the _MLOps Engineer_ for deployment preparation. This ensures a seamless transition from training to production.

### Use Case 2: Experimenting with Different Model Weights to Optimize Model Accuracy

The _Data Scientist_ after identifying a base model, uses KubeFlow Pipelines, Katib, and other components to experiment model with alternative weights, hyperparameters, and other variations to improve the model’s performance metrics; Kubeflow Model Registry can be used to track data related to experiments and runs for comparison, reproducibility and collaboration.

* Register the Base Model: Track the Base Model storage location along with hyperparameters in the Model Registry. 
* Track Experiments/Runs: With Kubeflow pipelines or using the Kubeflow Notebooks, track every variation of the hyper-parameters along with any configuration in that specific Experiment. With each run the different parameters can be tracked in the Model Registry.
* Track and compare performance: with each run view key metrics like accuracy, recall, and precision. This helps the Data Scientist identify the best-performing run/experiment for deployment.
* Reproducibility: if needed, the data tracked in Model Registry can be replayed to perform again the experiment/run to reproduce the models.
* Collaborate: Share models and experiment details with the _MLOps Engineer_ for deployment preparation. This ensures a seamless transition from training to production.

### Use Case 3: Model Deployment

The MLOps Engineer uses Kubeflow Model Registry to locate the most recent version for a given model, verify it is approved for deployment, understand model format, architecture, hyperparameters, and performance metrics to configure the serving environment; once deployed, Model Registry is used to continue monitoring and track deployed models for performance and mitigate drift.

* Retrieve the latest model version: Easily access the model version approved for deployment.
* Access model metadata: Understand the model's architecture, hyperparameters, and performance metrics. This helps the MLOps engineer to configure the deployment environment and monitor performance after deployment.
* Manage serving configurations: Define how the model will be served to production applications and set up necessary resources.
* Track model deployments: Monitor the deployed model's performance and track its health over time. This allows the MLOps Engineer to identify potential issues and take corrective actions.

### Use Case 4: Monitoring and Governance

The Business Analyst uses Kubeflow Model Registry to audit deployed models, monitor model performance, track key metrics and identify when model is drifting or needs re-training; capabilities of model lineage enable identifying all related artifacts such as training which was used or the original training data.

* View model performance metrics: Track key metrics in real-time to understand how the model is performing in production.
* Identify model drift: can be used as a reference and baseline, by integrating with other tools, to detect if the model's predictions are deviating from expected behavior.
* Access model lineage: Understand the model's origin and training details to diagnose and address performance issues.
* Audit model usage: Track who uses the model, ensuring compliance with data privacy and security regulations. Together with lineage, they provide very important capabilities in heavily regulated industries (e.g.: FSI, Healthcare, etc.) and with respect to country regulations (e.g.: GDPR, EU AI Act, etc.).

### Benefits of Model Registry:

* Improved collaboration: Facilitate communication and collaboration between Data Scientists and MLOps engineers.
* Improved experiment management: Organize and track Experiments in a centralized location for better organization and accessibility.
* Version control: Track different versions of the model with different weight configurations, allowing comparisons and revert to previous versions if needed.
* Increased efficiency: Streamline model development and deployment processes.
* Enhanced governance: Ensure model compliance with regulations and organizational policies.
* Reproducibility: Enable recreating specific experiments and model versions.
* Better decision-making: Provide data-driven insights for improving model performance and business outcomes.

### Conclusion:

By implementing a model registry, ACME Inc. can significantly enhance their MLOps platform's functionality, enabling efficient model training, experimentation, and deployment. The Model Registry empowers Data Scientists, MLOps engineers, and Business analysts to collaborate effectively and make informed decisions based on reliable data and insights.

## Next steps

- Follow the [installation guide](/docs/components/model-registry/installation/) to set up Model Registry
- Run some examples following the [getting started guide](/docs/components/model-registry/getting-started/)
