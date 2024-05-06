+++
title = "How to Fine-Tune LLMs with Kubeflow"
description = "Overview of LLM fine-tuning API in Training Operator"
weight = 10
+++

{{% alert title="Warning" color="warning" %}}
This feature is in **alpha** stage and Kubeflow community is looking for your feedback. Please
share your experience using [#kubeflow-training-operator Slack channel](https://kubeflow.slack.com/archives/C985VJN9F)
or [Kubeflow Training Operator GitHib](https://github.com/kubeflow/training-operator/issues/new).
{{% /alert %}}

This page describes how to use a [`train` API from Training Python SDK](https://github.com/kubeflow/training-operator/blob/6ce4d57d699a76c3d043917bd0902c931f14080f/sdk/python/kubeflow/training/api/training_client.py#L112) that simplifies the ability to fine-tune LLMs with
distributed PyTorchJob workers.

If you want to learn more about how the fine-tuning API fit in the Kubeflow ecosystem, head to
[explanation guide](/docs/components/training/explanation/fine-tuning).

## Prerequisites

You need to install Training Python SDK [with fine-tuning support](/docs/components/training/installation/#install-python-sdk-with-fine-tuning-capabilities)
to run this API.

## How to use Fine-Tuning API ?

You need to provide the following parameters to use the `train` API:

- Pre-trained model parameters.
- Dataset parameters.
- Trainer parameters.
- Number of PyTorch workers and resources per workers.

For example, you can use `train` API as follows to fine-tune BERT model using Yelp Review dataset
from HuggingFace Hub:

```python
import transformers
from peft import LoraConfig

from kubeflow.training import TrainingClient
from kubeflow.storage_initializer.hugging_face import (
    HuggingFaceModelParams,
    HuggingFaceTrainerParams,
    HuggingFaceDatasetParams,
)

TrainingClient().train(
    name="fine-tune-bert",
    # BERT model URI and type of Transformer to train it.
    model_provider_parameters=HuggingFaceModelParams(
        model_uri="hf://google-bert/bert-base-cased",
        transformer_type=transformers.AutoModelForSequenceClassification,
    ),
    # Use 3000 samples from Yelp dataset.
    dataset_provider_parameters=HuggingFaceDatasetParams(
        repo_id="yelp_review_full",
        split="train[:3000]",
    ),
    # Specify HuggingFace Trainer parameters. In this example, we will skip evaluation and model checkpoints.
    trainer_parameters=HuggingFaceTrainerParams(
        training_parameters=transformers.TrainingArguments(
            output_dir="test_trainer",
            save_strategy="no",
            evaluation_strategy="no",
            do_eval=False,
            disable_tqdm=True,
            log_level="info",
        ),
        # Set LoRA config to reduce number of trainable model parameters.
        lora_config=LoraConfig(
            r=8,
            lora_alpha=8,
            lora_dropout=0.1,
            bias="none",
        ),
    ),
    num_workers=4, # nnodes parameter for torchrun command.
    num_procs_per_worker=2, # nproc-per-node parameter for torchrun command.
    resources_per_worker={
        "gpu": 2,
        "cpu": 5,
        "memory": "10G",
    },
)
```

After you execute `train`, Training Operator will orchestrate appropriate PyTorchJob resources
to fine-tune LLM.

## Next Steps

- Run example to [fine-tune TinyLlama LLM](https://github.com/kubeflow/training-operator/blob/6ce4d57d699a76c3d043917bd0902c931f14080f/examples/pytorch/language-modeling/train_api_hf_dataset.ipynb)

- Check this example to compare `create_job` and `train` Python API for
  [fine-tuning BERT LLM](https://github.com/kubeflow/training-operator/blob/6ce4d57d699a76c3d043917bd0902c931f14080f/examples/pytorch/text-classification/Fine-Tune-BERT-LLM.ipynb).

- Understand [the architecture behind `train` API](/docs/components/training/reference/fine-tuning).
