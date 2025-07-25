+++
title = "TorchTune BuiltinTrainer"
description = "How to fine-tune LLMs with TorchTune BuiltinTrainer"
weight = 20
+++

**TorchTuneConfig**, the configuration for **TorchTune LLM Trainer**, is one of the supported configs in `BuiltinTrainer`. It leverages TorchTune to streamline and simplify LLM fine-tuning lifecycle on Kubernetes, while providing a simple yet efficient Python API for data scientists.

The supported model list can be seen in [this directory](https://github.com/kubeflow/trainer/tree/master/manifests/base/runtimes/torchtune). It's worth noticing that we do not support multi-node fine-tuning for now. Only one Pod will be launched for TorchTune LLM Trainer.

In this page, we'll show a simple example of fine-tuning LLMs with TorchTune LLM Trainer in Kubeflow SDK. If you want to learn more about TorchTune LLM Trainer, please refer to [KEP-2401](https://github.com/kubeflow/trainer/tree/master/docs/proposals/2401-llm-trainer-v2) in Kubeflow Trainer.

## Prerequisites

Before exploring this guide, make sure to follow [the Getting Started guide](https://www.kubeflow.org/docs/components/trainer/getting-started/) to understand the basics of Kubeflow Trainer.

```Python
# Get torchtune-llama3.2-1b Kubeflow Training Runtime.
from kubeflow.trainer import *

client = TrainerClient()
runtime = client.get_runtime("torchtune-llama3.2-1b")
print(runtime)
```

## Use TorchTune LLM Trainer in BuiltinTrainer

The guides below shows how to fine-tune Llama-3.2-1B-Instruct with alpaca datset by BuiltinTrainer.

### Create PVCs for Models and Datasets

{{% alert title="Note" color="info" %}}
Currently, we do not support automatically orchestrate the volume claim.

To follow up with this problem, please refer to [this issue](https://github.com/kubeflow/trainer/issues/2630).
{{% /alert %}}

We need to manually create PVCs for each models we want to fine-tune. Please note that **the PVC name must be equal to the ClusterTrainingRuntime name**. In this example, it's `torchtune-llama3.2-1b`.

```Python
# Create a PersistentVolumeClaim for the TorchTune Llama 3.2 1B model.
client.core_api.create_namespaced_persistent_volume_claim(
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

### Use TorchTune LLM Trainer with train() API

You need to provide the following parameters to use TorchTune LLM Trainer with `train()` API:

- Reference to existing Runtimes.
- Initializer parameters.
- Trainer configuration.

Kubeflow TrainJob will train the model in the referenced (Cluster)TrainingRuntime.

For example, you can use the `train()` API to fine-tune the Llama-3.2-1B-Instruct model using the alpaca dataset from HuggingFace with the code below:

```python
job_name = client.train(
    runtime=client.get_runtime("torchtune-llama3.2-1b"),
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

## Parameters

We use `train()` API to launch fine-tuning jobs with TorchTune LLM Trainer.

```python
def train(
    self,
    runtime: types.Runtime = types.DEFAULT_RUNTIME,
    initializer: Optional[types.Initializer] = None,
    trainer: Optional[Union[types.CustomTrainer, types.BuiltinTrainer]] = None,
) -> str:
```

### Runtime

For TorchTune LLM Trainer, you can just find the runtime you want in the [manifest folder](https://github.com/kubeflow/trainer/tree/master/manifests/base/runtimes/torchtune), and just specify the `name` parameter. Like:

```python
runtime=Runtime(name="torchtune-llama3.2-1b")
```

### Initializer

We'll use parameters in Initializer to download dataset and model from remote storage.

| **Parameters** | **Type** | **What is it?** |
| - | - | - |
| `dataset` | `Optional[HuggingFaceDatasetInitializer]` | The configuration for one of the supported dataset initializers. |
| `model` | `Optional[HuggingFaceModelInitializer]` | The configuration for one of the supported model initializers. |

#### Dataset Initializer

Currently, we only support downloading datasets from HuggingFace by defining `HuggingFaceDatasetInitializer`:

{{% alert title="Note" color="info" %}}
For `storage_uri` in Dataset Initializer, you need to speficy **the exact path to data files**. That's to say, you need to set it to `hf://<org_id>/<repo_id>/path/to/data/files`.

Currently, we support:

1. Data Directory: Use all data files under this directory. For example, `hf://tatsu-lab/alpaca/data` uses all data files under the `/data` direcotry of `tatsu-lab/alpaca` repo in HuggingFace.
2. Single Data File: Use the single data file given the path. For example, `hf://tatsu-lab/alpaca/data/xxx.parquet` uses the single `/data/xxx.parquet` data file of `tatsu-lab/alpaca` repo in HuggingFace.
{{% /alert %}}

| **Parameters** | **Type** | **What is it?** |
| - | - | - |
| `storage_uri` | `str` | Storage URI for dataset that begins with `hf://` |
| `access_token` | `Optional[str]` | Token that verfies your access to the dataset if needed. |

#### Model Initializer

Currently, we only support downloading models from HuggingFace by defining `HuggingFaceModelInitializer`:

| **Parameters** | **Type** | **What is it?** |
| - | - | - |
| `storage_uri` | `str` | Storage URI for model that begins with `hf://` |
| `access_token` | `Optional[str]` | Token that verfies your access to the model if needed. |

#### Example Usage

```python
initializer=Initializer(
    dataset=HuggingFaceDatasetInitializer(
        storage_uri="hf://tatsu-lab/alpaca/data",
        access_token="<YOUR_HF_TOKEN>"  # Replace with your Hugging Face token
    ),
    model=HuggingFaceModelInitializer(
        storage_uri="hf://meta-llama/Llama-3.2-1B-Instruct",
        access_token="<YOUR_HF_TOKEN>"  # Replace with your Hugging Face token
    )
)
```

### TorchTune LLM Trainer

#### Description

The `TorchTuneConfig` class is used for configuring TorchTune LLM Trainer that already includes the fine-tuning logic.

| **Parameters** | **Type** | **What is it?** |
| - | - | - |
| `dtype` | `Optional[DataType]` | The underlying data type used to represent the model and optimizer parameters. Currently, we only support `bf16` and `fp32`. |
| `batch_size` | `Optional[int]` | The number of samples processed before updating model weights. |
| `epochs` | `Optional[int]` | The number of samples processed before updating model weights. |
| `loss` | `Optional[Loss]` | The loss algorithm we use to fine-tune the LLM, e.g. `torchtune.modules.loss.CEWithChunkedOutputLoss` |
| `num_nodes` | `Optional[int]` | The number of PyTorch Nodes in training |
| `dataset_preprocess_config` | `Optional[TorchTuneInstructDataset]` | Configuration for dataset preprocessing. |
| `resource_per_node` | `Optional[Dict]` | The resource for each PyTorch Node |

```python
# Loss function for the TorchTune LLM Trainer.
class Loss(Enum):
    CEWithChunkedOutputLoss = "torchtune.modules.loss.CEWithChunkedOutputLoss"

# Data type for the TorchTune LLM Trainer.
class DataType(Enum):
    BF16 = "bf16"
    FP32 = "fp32"
```

The `TorchTuneInstructDataset` is a dataset class supported by TorchTune. It defines some dataset parameters which allows TorchTune preprocessing the Instruct Dataset for us automatically.

| **Parameters** | **Type** | **What is it?** |
| - | - | - |
| `source` | `Optional[DataFormat]` | Data file type |
| `split` | `Optional[str]` | The split of the dataset to use. You can use this argument to load a subset of a given split, e.g. split="train[:10%]". Default is `train`. |
| `train_on_input` | `Optional[bool]` | Whether the model is trained on the user prompt or not. Default is False. |
| `new_system_prompt` | `Optional[str]` | The new system prompt to use. If specified, prepend a system message. This can serve as instructions to guide the model response. Default is None. |
| `column_map` | `Optional[Dict[str, str]]` | A mapping to change the expected "input" and "output" column names to the actual column names in the dataset. Keys should be "input" and "output" and values should be the actual column names. Default is None, keeping the default "input" and "output" column names. |

```python
# Data file type for the TorchTune LLM Trainer.
class DataFormat(Enum):
    JSON = "json"
    CSV = "csv"
    PARQUET = "parquet"
    ARROW = "arrow"
    TEXT = "text"
    XML = "xml"
```

#### Example Usage

```python
torchtune_config = TorchTuneConfig(
    dtype=DataType.BF16,
    batch_size=10,
    epochs=10,
    loss=Loss.CEWithChunkedOutputLoss,
    num_nodes=1,
    dataset_preprocess_config=TorchTuneInstructDataset(
        source=DataFormat.PARQUET,
        split="train[:95%]",
        train_on_input=True,
        new_system_prompt="You are an AI assistant. ",
        column_map={"input": "incorrect", "output": "correct"},
    ),
    resources_per_node={"gpu": 1},
)
```

## Next Steps

- Run the example to [fine-tune the Llama-3.2-1B-Instruct LLM](https://github.com/kubeflow/trainer/blob/master/examples/torchtune/llama3_2/alpaca-trainjob-yaml.ipynb)
