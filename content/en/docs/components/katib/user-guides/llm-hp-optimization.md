+++
title = "How to Optimize Hyperparameters for LLMs Fine-Tuning with Kubeflow"
description = "API description of LLMs Hyperparameter Optimization using Katib"
weight = 20
+++

{{% alert title="Warning" color="warning" %}}
This feature is in **alpha** stage and the Kubeflow community is looking for your feedback. Please
share your experience using the [#kubeflow-katib Slack channel](https://cloud-native.slack.com/archives/C073N7AS48P)
or the [Kubeflow Katib GitHub](https://github.com/kubeflow/katib/issues).
{{% /alert %}}

This page describes how to optimize hyperparameters (HPs) in the process of fine-tuning large language models (LLMs) using Katib's Python API and how to configure it.

## Prerequisites

You need to install the following Katib components to run code in this guide:

- Training Operator control plane – [install](/docs/components/trainer/legacy-v1/installation/#installing-the-control-plane)
- Katib control plane – [install](/docs/components/katib/installation/#installing-control-plane)
- Katib Python SDK with LLM Hyperparameter Optimization Support – [install](/docs/components/katib/installation/#installing-python-sdk)

**Note:** If you choose to define your own custom objective function and optimize parameters within it, distributed training is currently not supported. In this case, installing the Training Operator control plane is not necessary. For detailed instructions, please refer to [this guide](/docs/components/katib/getting-started).

**Note:** Ensure that the Training Operator control plane is installed prior to the Katib control plane. This guarantees that the correct namespace labels are applied and enables the PyTorchJob CRD to be utilized in Katib.

## Load Model and Dataset

To optimize hyperparameters of a pre-trained model, it is essential to load the model and dataset from a provider. Currently, this can be done using external platforms like **HuggingFace** and **S3-compatible object storage** (e.g., Amazon S3) through the `storage_initializer` API from Kubeflow Training Operator.

### HuggingFace Integration

The HuggingFace provider enables seamless integration of models and datasets for training and evaluation. You can import the necessary components for Hugging Face using the following code:

```python
from kubeflow.storage_initializer.hugging_face import (
    HuggingFaceModelParams,
    HuggingFaceDatasetParams,
    HuggingFaceTrainerParams,
)
```

{{% alert title="Note" color="info" %}}
The detailed descriptions of these parameter classes have been moved to the [Training Operator fine-tuning guide](/docs/components/trainer/legacy-v1/user-guides/fine-tuning/#huggingface-parameter-classes). This page provides a brief overview of how to use these classes with Katib for hyperparameter optimization.
{{% /alert %}}

#### HuggingFaceModelParams

The `HuggingFaceModelParams` dataclass holds configuration parameters for initializing Hugging Face models. For detailed documentation and examples, see the [Training Operator fine-tuning guide](/docs/components/trainer/legacy-v1/user-guides/fine-tuning/#huggingfacemodelparams).

#### HuggingFaceDatasetParams

The `HuggingFaceDatasetParams` class holds configuration parameters for loading datasets from Hugging Face. For detailed documentation and examples, see the [Training Operator fine-tuning guide](/docs/components/trainer/legacy-v1/user-guides/fine-tuning/#huggingfacedatasetparams).

#### HuggingFaceTrainerParams

The `HuggingFaceTrainerParams` class is used to define parameters for the training process in the Hugging Face framework. For detailed documentation and examples, see the [Training Operator fine-tuning guide](/docs/components/trainer/legacy-v1/user-guides/fine-tuning/#huggingfacetrainerparams).

{{% alert title="Note" color="info" %}}
Currently, only parameters within `training_parameters` and `lora_config` can be tuned using Katib's search API. Other fields are static and cannot be tuned.
{{% /alert %}}

###### Katib Search API for Defining Hyperparameter Search Space

The **Katib Search API** allows users to define the search space for hyperparameters during model tuning. This API supports continuous, discrete, and categorical parameter sampling, enabling flexible and efficient hyperparameter optimization.

Below are the available methods for defining hyperparameter search spaces:

| **Function**    | **Description**                                            | **Parameter Type** | **Arguments**                                                              |
| --------------- | ---------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| `double()`      | Samples a continuous float value within a specified range. | `double`           | `min` (float, required), `max` (float, required), `step` (float, optional) |
| `int()`         | Samples an integer value within a specified range.         | `int`              | `min` (int, required), `max` (int, required), `step` (int, optional)       |
| `categorical()` | Samples a value from a predefined list of categories.      | `categorical`      | `list` (List, required)                                                    |

##### Example Usage

This is an **example** of how to use the `HuggingFaceTrainerParams` class to define the training and LoRA parameters.

```python
import kubeflow.katib as katib
from kubeflow.storage_initializer.hugging_face import HuggingFaceTrainerParams

from transformers import TrainingArguments
from peft import LoraConfig

# Set up training and LoRA configuration
trainer_params = HuggingFaceTrainerParams(
    training_parameters=TrainingArguments(
        output_dir="results",
        # Using katib search api to define a search space for the parameter
        learning_rate=katib.search.double(min=1e-05, max=5e-05),
        num_train_epochs=3,
        per_device_train_batch_size=8,
    ),
    lora_config=LoraConfig(
        r=katib.search.int(min=8, max=32),
        lora_alpha=16,
        lora_dropout=0.1,
        bias="none",
    ),
)
```

### S3-Compatible Object Storage Integration

In addition to Hugging Face, you can integrate with S3-compatible object storage platforms to 
load datasets. To work with S3, use the `S3DatasetParams` class to define your dataset 
parameters.

For loading datasets from S3-compatible object storage, see the [S3DatasetParams documentation](/docs/components/trainer/legacy-v1/user-guides/fine-tuning/#s3datasetparams) in the Training Operator fine-tuning guide.

## Optimizing Hyperparameters of Large Language Models

In the context of optimizing hyperparameters of large language models (LLMs) like GPT, BERT, or similar transformer-based models, it is crucial to optimize various hyperparameters to improve model performance. This sub-section covers the key parameters used in tuning LLMs via a `tune` function, specifically using tools like Katib for automated hyperparameter optimization in Kubernetes environments.

### Key Parameters for LLM Hyperparameter Tuning

| **Parameter**                 | **Description**                                                              | **Required** |
| ----------------------------- | ---------------------------------------------------------------------------- | ------------ |
| `name`                        | Name of the experiment.                                                      | Required     |
| `model_provider_parameters`   | Parameters for the model provider, such as model type and configuration.     | Optional     |
| `dataset_provider_parameters` | Parameters for the dataset provider, such as dataset configuration.          | Optional     |
| `trainer_parameters`          | Configuration for the trainer, including hyperparameters for model training. | Optional     |
| `storage_config`              | Configuration for storage, like PVC size and storage class.                  | Optional     |
| `namespace`                   | Kubernetes namespace for the experiment.                                     | Optional     |
| `env_per_trial`               | Environment variables for each trial.                                        | Optional     |
| `algorithm_name`              | Algorithm used for the hyperparameter search.                                | Optional     |
| `algorithm_settings`          | Settings for the search algorithm.                                           | Optional     |
| `objective_metric_name`       | Name of the objective metric for optimization.                               | Optional     |
| `additional_metric_names`     | List of additional metrics to collect from the objective function.           | Optional     |
| `objective_type`              | Type of optimization for the objective metric (minimize or maximize).        | Optional     |
| `objective_goal`              | The target value for the objective to succeed.                               | Optional     |
| `max_trial_count`             | Maximum number of trials to run.                                             | Optional     |
| `parallel_trial_count`        | Number of trials to run in parallel.                                         | Optional     |
| `max_failed_trial_count`      | Maximum number of failed trials allowed.                                     | Optional     |
| `resources_per_trial`         | Resource requirements per trial, including CPU, memory, and GPU.             | Optional     |
| `retain_trials`               | Whether to retain resources from completed trials.                           | Optional     |
| `packages_to_install`         | List of additional Python packages to install.                               | Optional     |
| `pip_index_url`               | The PyPI URL from which to install Python packages.                          | Optional     |
| `metrics_collector_config`    | Configuration for the metrics collector.                                     | Optional     |

1. **Supported Objective Metric for LLMs**  
   Currently, for large language model (LLM) hyperparameter optimization, only `train_loss` is supported as the objective metric. This is because `train_loss` is the default metric produced by the `trainer.train()` function in Hugging Face, which our trainer utilizes. We plan to expand support for additional metrics in future updates.

2. **Configuring `resources_per_trial`**  
   When importing models and datasets from external platforms, you are required to define `resources_per_trial` using the `TrainerResources` object. Setting `num_workers` to a value greater than 1 enables distributed training through PyTorchJob. To disable distributed training, simply set `num_workers=1`.

   **Example Configuration:**

   ```python
     import kubeflow.katib as katib

     resources_per_trial=katib.TrainerResources(
        num_workers=1,
        num_procs_per_worker=1,
        resources_per_worker={"gpu": 0, "cpu": 1, "memory": "10G"},
     )
   ```

3. **Defining a Custom Objective Function**  
   In addition to importing models and datasets from external platforms using `model_provider_parameters`, `dataset_provider_parameters`, and `trainer_parameters`, users also have the flexibility to define a custom objective function, along with a custom image and parameters for hyperparameter optimization.

   For detailed instructions, refer to [this guide](https://www.kubeflow.org/docs/components/katib/getting-started/).

## Example: Optimizing Hyperparameters of Llama-3.2 for Binary Classification on IMDB Dataset

This code provides an example of hyperparameter optimized [**Llama-3.2 model**](https://huggingface.co/meta-llama/Llama-3.2-1B) for a **binary classification** task on the [**IMDB movie reviews dataset**](https://huggingface.co/datasets/stanfordnlp/imdb). The **Llama-3.2 model** is fine-tuned using **LoRA** (Low-Rank Adaptation) to reduce the number of trainable parameters. The dataset used in this example consists of 1000 movie reviews from the **IMDB** dataset, and the training process is optimized through **Katib** to find the best hyperparameters.

### Katib Configuration

The following table outlines the Katib configuration used for hyperparameter optimization process:

| **Parameter**                 | **Description**                                                       |
| ----------------------------- | --------------------------------------------------------------------- |
| `exp_name`                    | Name of the experiment (`llama`).                                     |
| `model_provider_parameters`   | Parameters for the Hugging Face model (Llama-3.2).                    |
| `dataset_provider_parameters` | Parameters for the IMDB dataset (1000 movie reviews).                 |
| `trainer_parameters`          | Parameters for the Hugging Face trainer, including LoRA settings.     |
| `objective_metric_name`       | The objective metric to minimize, in this case, `"train_loss"`.       |
| `objective_type`              | Type of optimization: `"minimize"` for training loss.                 |
| `algorithm_name`              | The optimization algorithm used, set to `"random"` for random search. |
| `max_trial_count`             | Maximum number of trials to run, set to `10`.                         |
| `parallel_trial_count`        | Number of trials to run in parallel, set to `2`.                      |
| `resources_per_trial`         | Resources allocated for each trial: 2 GPUs, 4 CPUs, 10GB memory.      |

### Code Example

```python
import kubeflow.katib as katib
from kubeflow.katib import KatibClient

from transformers import AutoModelForSequenceClassification, TrainingArguments
from peft import LoraConfig

from kubeflow.storage_initializer.hugging_face import (
	HuggingFaceModelParams,
	HuggingFaceDatasetParams,
	HuggingFaceTrainerParams,
)

hf_model = HuggingFaceModelParams(
    model_uri = "hf://meta-llama/Llama-3.2-1B",
    transformer_type = AutoModelForSequenceClassification,
)

# Train the model on 1000 movie reviews from imdb
# https://huggingface.co/datasets/stanfordnlp/imdb
hf_dataset = HuggingFaceDatasetParams(
    repo_id = "imdb",
    split = "train[:1000]",
)

hf_tuning_parameters = HuggingFaceTrainerParams(
    training_parameters = TrainingArguments(
        output_dir = "results",
        save_strategy = "no",
        learning_rate = katib.search.double(min=1e-05, max=5e-05),
        num_train_epochs=3,
    ),
    # Set LoRA config to reduce number of trainable model parameters.
    lora_config = LoraConfig(
        r = katib.search.int(min=8, max=32),
        lora_alpha = 8,
        lora_dropout = 0.1,
        bias = "none",
    ),
)

cl = KatibClient(namespace="kubeflow")

# Optimizing Hyperparameters for Binary Classification
exp_name = "llama"
cl.tune(
	name = exp_name,
	model_provider_parameters = hf_model,
	dataset_provider_parameters = hf_dataset,
	trainer_parameters = hf_tuning_parameters,
	objective_metric_name = "train_loss",
	objective_type = "minimize",
	algorithm_name = "random",
	max_trial_count = 10,
	parallel_trial_count = 2,
	resources_per_trial=katib.TrainerResources(
		num_workers=2,
		num_procs_per_worker=2,
		resources_per_worker={"gpu": 2, "cpu": 4, "memory": "10G"},
	),
)

cl.wait_for_experiment_condition(name=exp_name)

# Get the best hyperparameters.
print(cl.get_optimal_hyperparameters(exp_name))
```