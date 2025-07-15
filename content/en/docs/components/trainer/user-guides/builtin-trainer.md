+++
title = "BuiltinTrainer Guide"
description = "How to use BuiltinTrainer in Kubeflow SDK"
weight = 10
+++

This page describes how to use a BuiltinTrainer in Kubeflow SDK that simplifies the ability to fine-tune LLMs with TorchTune.

[BuiltinTrainer](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L140) is concept versus [CustomTrainer](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L26). They are both supported in [`train()` API from the Kubeflow SDK](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/api/trainer_client.py#L156). CustomTrainer is used to support custom training task and users will take the responsibility to define a self contained function that encapsulates the entire model training process. However, BuiltinTrainer is designed for **config-driven tasks with existing trainer**, which already includes the post-training logic and requires only parameter adjustments.

Currently, Kubeflow SDK supports these BuiltinTrainer:

- [**TorchTune LLM Trainer**](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L109): Leverage [TorchTune](https://github.com/pytorch/torchtune) to fine-tune LLMs.

If you want to learn more about BuiltinTrainer in Kubeflow SDK, please refer to [KEP-2401](https://github.com/kubeflow/trainer/tree/master/docs/proposals/2401-llm-trainer-v2) in Kubeflow Trainer.

## Prerequisites

Ensure that you have access to a Kubernetes cluster with Kubeflow Trainer
control plane installed. If it is not set up yet, follow
[the installation guide](/docs/components/trainer/operator-guides/installation) to quickly deploy
Kubeflow Trainer.

### Installing the Kubeflow Python SDK

Install the latest Kubeflow Python SDK version directly from the source repository:

```bash
pip install git+https://github.com/kubeflow/sdk.git@main#subdirectory=python
```
