+++
title = "How to Fine-Tune LLMs with Kubeflow"
description = "Overview of the LLM fine-tuning API in the Training Operator"
weight = 10
+++

{{% alert title="Old Version" color="warning" %}}
This page is about **Kubeflow Training Operator V1**, for the latest information check
[the Kubeflow Trainer V2 documentation](/docs/components/trainer).

Follow [this guide for migrating to Kubeflow Trainer V2](/docs/components/trainer/operator-guides/migration).
{{% /alert %}}

This page describes how to use a [`train` API from the Training Python SDK](https://github.com/kubeflow/training-operator/blob/release-1.9/sdk/python/kubeflow/training/api/training_client.py#L95)
that simplifies the ability to fine-tune LLMs with distributed PyTorchJob workers.

If you want to learn more about how the fine-tuning API fits in the Kubeflow ecosystem, head to
the [explanation guide](/docs/components/trainer/legacy-v1/explanation/fine-tuning).

## Prerequisites

You need to install the Training Python SDK [with fine-tuning support](/docs/components/trainer/legacy-v1/installation/#install-the-python-sdk-with-fine-tuning-capabilities)
to run this API.

## How to use the Fine-Tuning API?

You need to provide the following parameters to use the `train` API:

- Pre-trained model parameters.
- Dataset parameters.
- Trainer parameters.
- Number of PyTorch workers and resources per workers.

For example, you can use the `train` API to fine-tune the BERT model using the Yelp Review dataset
from HuggingFace Hub with the code below:

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
            eval_strategy="no",
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

After you execute `train`, the Training Operator will orchestrate the appropriate PyTorchJob resources
to fine-tune the LLM.

## Using custom images with Fine-Tuning API

Platform engineers can customize the storage initializer and trainer images by setting the `STORAGE_INITIALIZER_IMAGE` and `TRAINER_TRANSFORMER_IMAGE` environment variables before executing the `train` command.

For example: In your python code, set the env vars before executing `train`:

```python
...
os.environ['STORAGE_INITIALIZER_IMAGE'] = 'docker.io/<username>/<custom-storage-initiailizer_image>'
os.environ['TRAINER_TRANSFORMER_IMAGE'] = 'docker.io/<username>/<custom-trainer_transformer_image>'

TrainingClient().train(...)
```

## Next Steps

- Run the example to [fine-tune the TinyLlama LLM](https://github.com/kubeflow/training-operator/blob/release-1.9/examples/pytorch/language-modeling/train_api_hf_dataset.ipynb)

- Check this example to compare the `create_job` and the `train` Python API for
  [fine-tuning BERT LLM](https://github.com/kubeflow/training-operator/blob/release-1.9/examples/pytorch/text-classification/Fine-Tune-BERT-LLM.ipynb).

- Understand [the architecture behind `train` API](/docs/components/trainer/legacy-v1/reference/fine-tuning).
