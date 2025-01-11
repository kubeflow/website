+++
title = "How to Optimize LLM Hyperparameters"
description = "API description"
weight = 20
+++

This page describes LLM hyperparameter (HP) optimization API that Katib supports and how to configure
it.

## LLM Hyperparameters Optimization


```python
import kubeflow.katib as katib
from kubeflow.katib import KatibClient

import transformers
from peft import LoraConfig

from kubeflow.storage_initializer.hugging_face import (
	HuggingFaceModelParams,
	HuggingFaceDatasetParams,
	HuggingFaceTrainerParams,
)

hf_model = HuggingFaceModelParams(
    model_uri = "hf://meta-llama/Llama-3.2-1B",
    transformer_type = transformers.AutoModelForSequenceClassification,
)

# Train the model on 1000 movie reviews from imdb
# https://huggingface.co/datasets/stanfordnlp/imdb
hf_dataset = HuggingFaceDatasetParams(
    repo_id = "imdb",
    split = "train[:1000]",
)

hf_tuning_parameters = HuggingFaceTrainerParams(
    training_parameters = transformers.TrainingArguments(
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
