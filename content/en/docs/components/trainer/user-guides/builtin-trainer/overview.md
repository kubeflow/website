+++
title = "Overview"
description = "What is BuiltinTrainer"
weight = 20
+++

## What is BuiltinTrianer

[BuiltinTrainer](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L140) is a concept versus [CustomTrainer](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L26). They are both supported in [`train()` API from the Kubeflow SDK](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/api/trainer_client.py#L156). And their difference lies in:

1. **CustomTrainer**: Used to support custom training task and users will take the responsibility to define a self contained function that encapsulates the entire model training process.
2. **BuiltinTrainer**: Designed for **config-driven tasks with existing trainer**, which already includes the post-training logic and requires only parameter adjustments.

Currently, Kubeflow SDK supports these BuiltinTrainers:

1. [**TorchTune LLM Trainer**](https://github.com/kubeflow/sdk/blob/e065767999361772758c0c12b2b154c3589d45ae/python/kubeflow/trainer/types/types.py#L109): Leverage [TorchTune](https://github.com/pytorch/torchtune) to fine-tune LLMs.

## Next Steps

- Learn [how to use TorchTune LLM Trainer](./torchtune.md)
