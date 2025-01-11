+++
title = "How to Optimize LLM Hyperparameters"
description = "API description"
weight = 20
+++

This page describes LLM hyperparameter (HP) optimization Python API that Katib supports and how to configure
it.

## Prerequisites

You need to install the following Katib components to run code in this guide:

- Katib control plane [install](/docs/components/katib/installation/#installing-control-plane).
- Katib Python SDK [install](/docs/components/katib/installation/#installing-python-sdk).

Additionally install following python packages to run the example:

- Transformers from Hugging Face [install](https://pypi.org/project/transformers/).

## Load Model and Dataset

To fine-tune a pre-trained model, it is essential to load the model and dataset from a provider. Currently, this can be done using external platforms like **Hugging Face** and **S3-compatible object storage** (e.g., Amazon S3) through the `storage_initializer` API from Kubeflow.

### Hugging Face Integration

The Hugging Face provider enables seamless integration of models and datasets for training and evaluation. You can import the necessary components for Hugging Face using the following code:

```python
from kubeflow.storage_initializer.hugging_face import (
    HuggingFaceModelParams,
    HuggingFaceDatasetParams,
    HuggingFaceTrainerParams,
)
```

### S3-Compatible Object Storage Integration

In addition to Hugging Face, you can integrate with S3-compatible object storage platforms to load datasets. To work with S3, use the `S3DatasetParams` class to define your dataset parameters.

```python
from kubeflow.storage_initializer.s3 import S3DatasetParams
```

### HuggingFaceModelParams Description

The `HuggingFaceModelParams` dataclass holds configuration parameters for initializing Hugging Face models with validation checks.

| **Attribute**    | **Type**                              | **Description**                                                |
|------------------|---------------------------------------|----------------------------------------------------------------|
| `model_uri`      | `str`                                 | URI or path to the Hugging Face model (must not be empty).      |
| `transformer_type` | `TRANSFORMER_TYPES`                 | Specifies the model type for various NLP/ML tasks.              |
| `access_token`   | `Optional[str]` (default: `None`)      | Token for accessing private models on Hugging Face.             |
| `num_labels`     | `Optional[int]` (default: `None`)      | Number of output labels (used for classification tasks).        |

### Supported Transformer Types (`TRANSFORMER_TYPES`)

| **Model Type**                                 | **Task**                    |
|------------------------------------------------|-----------------------------|
| `AutoModelForSequenceClassification`           | Text classification         |
| `AutoModelForTokenClassification`             | Named entity recognition    |
| `AutoModelForQuestionAnswering`              | Question answering          |
| `AutoModelForCausalLM`                        | Text generation (causal)    |
| `AutoModelForMaskedLM`                        | Masked language modeling    |
| `AutoModelForImageClassification`            | Image classification        |

#### Example Usage

```python
from transformers import AutoModelForSequenceClassification

params = HuggingFaceModelParams(
    model_uri="bert-base-uncased",
    transformer_type=AutoModelForSequenceClassification,
    access_token="huggingface_access_token",
    num_labels=2  # For binary classification
)
```

### HuggingFaceDatasetParams Description

The `HuggingFaceDatasetParams` class holds configuration parameters for loading datasets from Hugging Face with validation checks.

| **Attribute**    | **Type**                | **Description**                                                |
|------------------|-------------------------|----------------------------------------------------------------|
| `repo_id`        | `str`                   | Identifier of the dataset repository on Hugging Face (must not be empty). |
| `access_token`   | `Optional[str]` (default: `None`) | Token for accessing private datasets on Hugging Face. |
| `split`          | `Optional[str]` (default: `None`) | Dataset split to load (e.g., `"train"`, `"test"`). |

### S3DatasetParams Description

The `S3DatasetParams` class is used for loading datasets from S3-compatible object storage. The parameters are defined as follows:

| **Parameter**     | **Type**           | **Description**                                                   |
|-------------------|--------------------|-------------------------------------------------------------------|
| `endpoint_url`    | `str`              | URL of the S3-compatible storage service.                         |
| `bucket_name`     | `str`              | Name of the S3 bucket containing the dataset.                     |
| `file_key`        | `str`              | Key (path) to the dataset file within the bucket.                 |
| `region_name`     | `str`, optional    | The AWS region of the S3 bucket (optional).                       |
| `access_key`      | `str`, optional    | The access key for authentication with S3 (optional).            |
| `secret_key`      | `str`, optional    | The secret key for authentication with S3 (optional).            |

#### Example Usage

##### Hugging Face

```python
dataset_params = HuggingFaceDatasetParams(
    repo_id="imdb",            # Public dataset repository ID on Hugging Face
    split="train",             # Dataset split to load
    access_token=None          # Not needed for public datasets
)
```

##### S3

```python
s3_params = S3DatasetParams(
    endpoint_url="https://s3.amazonaws.com",
    bucket_name="my-dataset-bucket",
    file_key="datasets/train.csv",
    region_name="us-west-2",
    access_key="YOUR_ACCESS_KEY",
    secret_key="YOUR_SECRET_KEY"
)
```


### Hugging Face trainer params

TODO

### Example: Fine-Tuning Llama-3.2 for Binary Classification on IMDB Dataset

This code provides an example of fine-tuning the [**Llama-3.2 model**](https://huggingface.co/meta-llama/Llama-3.2-1B) for a **binary classification** task on the [**IMDB movie reviews dataset**](https://huggingface.co/datasets/stanfordnlp/imdb). The **Llama-3.2 model** is fine-tuned using **LoRA** (Low-Rank Adaptation) to reduce the number of trainable parameters. The dataset used in this example consists of 1000 movie reviews from the **IMDB** dataset, and the training process is optimized through **Katib** to find the best hyperparameters.

#### Model:
- [**Llama-3.2** from Hugging Face](https://huggingface.co/meta-llama/Llama-3.2-1B)

#### Dataset:
- [**IMDB movie reviews**](https://huggingface.co/datasets/stanfordnlp/imdb) (1000 samples for training)

#### Training:
- Fine-tuning for binary classification
- Hyperparameter tuning with Katib

### Katib Configuration

The following table outlines the Katib configuration used for hyperparameter tuning in the fine-tuning process:

| **Parameter**              | **Description**                                                       |
|----------------------------|-----------------------------------------------------------------------|
| `exp_name`                 | Name of the experiment (`Llama-3.2-fine-tune`).                       |
| `model_provider_parameters`| Parameters for the Hugging Face model (Llama-3.2).                    |
| `dataset_provider_parameters`| Parameters for the IMDB dataset (1000 movie reviews).              |
| `trainer_parameters`       | Parameters for the Hugging Face trainer, including LoRA settings.    |
| `objective_metric_name`    | The objective metric to minimize, in this case, `"train_loss"`.      |
| `objective_type`           | Type of optimization: `"minimize"` for training loss.                |
| `algorithm_name`           | The optimization algorithm used, set to `"random"` for random search.|
| `max_trial_count`          | Maximum number of trials to run, set to `10`.                        |
| `parallel_trial_count`     | Number of trials to run in parallel, set to `2`.                     |
| `resources_per_trial`      | Resources allocated for each trial: 2 GPUs, 4 CPUs, 10GB memory.    |

This configuration is used to find the best hyperparameters for fine-tuning the Llama-3.2 model using Katib.


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

# Fine-tuning for Binary Classification
exp_name = "Llama-3.2-fine-tune"
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
	resources_per_trial={
		"gpu": "2",
		"cpu": "4",
		"memory": "10G",
	},
)

cl.wait_for_experiment_condition(name=exp_name)

# Get the best hyperparameters.
print(cl.get_optimal_hyperparameters(exp_name))
```
