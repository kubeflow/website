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

```Python
# List all available Kubeflow Training Runtimes.
from kubeflow.trainer import *

client = TrainerClient()
for runtime in client.list_runtimes():
    print(runtime)
```

### Installing the Kubeflow Python SDK

Install the latest Kubeflow Python SDK version directly from the source repository:

```bash
pip install git+https://github.com/kubeflow/sdk.git@main#subdirectory=python
```

## How to use the TorchTune LLM Trainer in BuiltinTrainer?

### Create PVCs for Models and Datasets

{{% alert title="Note" color="info" %}}
Currently, we do not support automatically orchestrate the volume claim in (Cluster)TrainingRuntime. That's because JobSet hasn't supported stateful mode up to now.

To follow up this problem, please refer to [this issue](https://github.com/kubeflow/trainer/issues/2630).
{{% /alert %}}

We need to manually create PVCs for each models we want to fine-tune. Please note that **the PVC name must be equal to the ClusterTrainingRuntime name**. In this example, it's `torchtune-llama3.2-1b`.

```Python
# Create a PersistentVolumeClaim for the TorchTune Llama 3.2 1B model.
client.core_api.create_namespaced_persistent_volume_claim(
  namespace="default",
  body=client.V1PersistentVolumeClaim(
    api_version="v1",
    kind="PersistentVolumeClaim",
    metadata=client.V1ObjectMeta(name="torchtune-llama3.2-1b"),
    spec=client.V1PersistentVolumeClaimSpec(
      access_modes=["ReadWriteOnce"],
      resources=client.V1ResourceRequirements(
        requests={"storage": "20Gi"}
      ),
    ),
  ),
)
```

### Use TorchTune LLM Trainer with `train()` API

You need to provide the following parameters to use TorchTune LLM Trainer with `train()` API:

- Reference to existing Runtimes.
- Initializer parameters.
- Trainer configuration.

Kubeflow TrainJob will train the model in the referenced (Cluster)TrainingRuntime.

For example, you can use the `train()` API to fine-tune the Llama-3.2-1B-Instruct model using the alpaca dataset from HuggingFace with the code below:

```python
job_name = client.train(
    runtime=Runtime(
        name="torchtune-llama3.2-1b"
    ),
    initializer=Initializer(
        dataset=HuggingFaceDatasetInitializer(
            storage_uri="hf://tatsu-lab/alpaca/data"
        ),
        model=HuggingFaceModelInitializer(
            storage_uri="hf://meta-llama/Llama-3.2-1B-Instruct",
            access_token="<YOUR_HF_TOKEN>"  # Replace with your Hugging Face token,
        )
    ),
    trainer=BuiltinTrainer(
        config=TorchTuneConfig(
            dataset_preprocess_config=TorchTuneInstructDataset(
                source=DataFormat.PARQUET,
            ),
            resources_per_node={
                "gpu": 1,
            }
        )
    )
)
```

### Watch the TrainJob Logs

We can use the get_job_logs() API to get the TrainJob logs.

#### Dataset Initializer

```python
from kubeflow.trainer.constants import constants

log_dict = client.get_job_logs(job_name, follow=False, step=constants.DATASET_INITIALIZER)
print(log_dict[constants.DATASET_INITIALIZER])
```

#### Model Initializer

```python
log_dict = client.get_job_logs(job_name, follow=False, step=constants.MODEL_INITIALIZER)
print(log_dict[constants.MODEL_INITIALIZER])
```

#### TorchTune LLM Trainer

```python
log_dict = client.get_job_logs(job_name, follow=False)
print(log_dict[f"{constants.NODE}-0"])
```

### Get the Fine-Tuned Model

After Trainer node completes the fine-tuning task, the fine-tuned model will be stored into the `/workspace/output ` directory, which can be shared across Pods through PVC mounting. You can find it in another Pod's `/<mountDir>/output` directory if you mount the PVC under `/<mountDir>`.

## Next Steps

- Run the example to [fine-tune the Llama-3.2-1B-Instruct LLM](https://github.com/kubeflow/trainer/blob/master/examples/torchtune/llama3_2/alpaca-trainjob-yaml.ipynb)
