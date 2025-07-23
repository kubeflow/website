+++
title = "Overview"
description = "What is BuiltinTrainer"
weight = 20
+++

## What is BuiltinTrianer

The Kubeflow SDK [`train()`](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/api/trainer_client.py#L156) API supports two types of trainers: [`BuiltinTrainer()`](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L140) and [`CustomTrainer()`](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L26).

These options allow you to specify how you want to configure the TrainJob:

1. **CustomTrainer**: Use this when you need full control over the training process. It requires you to define a self-contained Python function that includes the entire model training process. The `CustomTrainer` is ideal if you want to have full control over the training script.

2. **BuiltinTrainer**: Designed for configuration-driven TrainJobs using a predefined training script, often tailored for tasks like LLMs fine-tuning. The training script contains entire post-training logic for LLMs fine-tuning, and it allows you to adjust the configurations for dataset, LoRA parameters, learning rates, etc. The `BuiltinTrainer` is ideal for fast iteration without modifying the training loop.

Currently, Kubeflow SDK supports these configs for `BuiltinTrainer`:

1. [**TorchTuneConfig**](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L109): Configurations for TorchTune LLM Trainer, leveraging [TorchTune](https://github.com/pytorch/torchtune) to fine-tune LLMs.

## Next Steps

- Learn [how to use TorchTune LLM Trainer](/docs/components/trainer/user-guides/builtin-trainer/torchtune.md)
