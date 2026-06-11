+++
title = "TrainJob Progress and Training Metrics"
description = "How to surface real-time training progress, ETA, and custom metrics directly in TrainJob status using the Kubeflow SDK or HuggingFace Transformers."
weight = 55
+++

The TrainJob progress and training metrics feature allows training scripts to push structured
progress data (completion percentage, estimated time remaining, and custom key-value metric
pairs) directly into `TrainJob.status.trainerStatus` in real time. This eliminates the need
to manually parse or scrape container logs to monitor training health and performance. The
feature was introduced in Kubeflow Trainer v2.2.0 and requires the `TrainJobStatus` alpha
feature gate to be enabled on the controller.

{{% alert title="Before you begin" color="info" %}}
Make sure to follow the [Getting Started guide](/docs/components/trainer/getting-started/)
to understand the basics of Kubeflow Trainer.
{{% /alert %}}

## How it works

When the `TrainJobStatus` feature gate is enabled, the Trainer controller adds a new HTTPS
endpoint to the existing `kubeflow-trainer-controller-manager` service. This endpoint is
not a sidecar, it runs inside the controller itself and reuses the same webhook TLS
certificates, with automatic cert rotation. A "progress plugin" then injects three
environment variables into every trainer pod so that training code can POST updates to
this endpoint.

The end-to-end flow works as follows:

1. The cluster operator enables the `TrainJobStatus` feature gate on the controller
   (see [Prerequisites](#prerequisites)).
2. The controller starts an HTTPS status-reporting endpoint and injects three environment
   variables into every trainer pod: `KUBEFLOW_TRAINER_SERVER_URL`,
   `KUBEFLOW_TRAINER_SERVER_CA_CERT`, and `KUBEFLOW_TRAINER_SERVER_TOKEN`. It also attaches
   a label to each pod so the controller can verify that update requests come from pods
   that belong to the correct TrainJob.
3. The training script or an auto-registered framework callback such as
   `KubeflowTrainerCallback` in HuggingFace Transformers POSTs progress and metrics to
   that endpoint. Each request is authenticated using a projected service account token
   (OIDC-verified by the controller).
4. The controller writes the update directly into the
   [`TrainJobTrainerStatus`](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#TrainJobTrainerStatus)
   field at `status.trainerStatus` on the TrainJob CR, where it can be read via `kubectl`
   or the Kubeflow SDK without inspecting logs.

{{% alert title="Note" color="info" %}}
If the three environment variables are absent, for example during local development or
when the `TrainJobStatus` feature gate is disabled, all client-side calls are silently
treated as no-ops. Training is never interrupted by status-reporting failures. Network
errors are logged at `WARNING` level but are never raised.
{{% /alert %}}

## Prerequisites

- Kubeflow Trainer v2.2.0 or later installed on your cluster.
- The `TrainJobStatus` alpha feature gate enabled on the Trainer controller. To enable
  it, pass the flag to the controller at startup:

  ```bash
  --feature-gates=TrainJobStatus=true
  ```

  The command-line flag takes precedence over any value set in the controller config file.

- For SDK-based progress reporting: Kubeflow SDK with PR
  [kubeflow/sdk#368](https://github.com/kubeflow/sdk/pull/368).
  See the warning in [Option B](#option-b-kubeflow-sdk-custom-training-loop) below.
- For HuggingFace-based progress reporting: `transformers >= 4.52`.
  `KubeflowTrainerCallback` is included in this version.

## Report progress from your training script

### Option A: HuggingFace Transformers (zero code change)

When the injected environment variables are present, the `KubeflowTrainerCallback` is
automatically registered within the HuggingFace Trainer. No code changes are required.

```python
from transformers import Trainer, TrainingArguments

# model and train_dataset initialization omitted for brevity
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    logging_steps=10,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)

# When running inside a Kubeflow TrainJob with TrainJobStatus enabled,
# KubeflowTrainerCallback is auto-registered and reports the following
# at each logging step: loss, learning_rate, epoch, completion percentage.
trainer.train()
```

For implementation details, see
[huggingface/transformers#44487](https://github.com/huggingface/transformers/pull/44487).

### Option B: Kubeflow SDK (custom training loop)

{{% alert title="Warning" color="warning" %}}
The `update_runtime_status` utility is in PR
[kubeflow/sdk#368](https://github.com/kubeflow/sdk/pull/368), which has not yet been
merged. The import path and function signature below reflect the PR branch. Check the PR
for the latest status before using this in production.
{{% /alert %}}

Use `update_runtime_status` from `kubeflow.trainer.utils` when writing a custom training
loop or using a framework other than HuggingFace Transformers. The SDK throttles updates
to at most once every 5 seconds to avoid overloading the controller. Use `force=True` to
bypass the throttle recommended at the very start and end of training so those
transitions are always captured.

```python
from kubeflow.trainer.utils import update_runtime_status

total_epochs = 10

# Signal the start of training (force=True bypasses the 5-second throttle)
update_runtime_status(progress_percent=0, force=True)

for epoch in range(total_epochs):
    # --- your training logic here ---

    # Replace these with your actual computed values
    progress    = int((epoch + 1) / total_epochs * 100)
    eta_seconds = compute_eta(epoch, total_epochs)  # your own ETA helper
    metrics     = {
        "loss":     train_loss,   # replace with actual metric values
        "accuracy": train_acc,    # replace with actual metric values
    }

    # The SDK handles throttling automatically safe to call at every step
    update_runtime_status(
        progress_percent=progress,
        estimated_time_remaining=eta_seconds,
        metrics=metrics,
    )

# Signal completion (force=True ensures the final state is never throttled)
update_runtime_status(progress_percent=100, force=True)
```

### Option C: Raw HTTP (any language or framework)

If you are not using Python, or want to integrate progress reporting into a framework
without an existing callback, read the injected environment variables and POST directly
to the controller endpoint. Always wrap the HTTP call in exception handling so that a
reporting failure never halts training.

```python
import os
import requests

server_url   = os.environ.get("KUBEFLOW_TRAINER_SERVER_URL")
ca_cert_path = os.environ.get("KUBEFLOW_TRAINER_SERVER_CA_CERT")
token_path   = os.environ.get("KUBEFLOW_TRAINER_SERVER_TOKEN")

# Only attempt reporting when running inside a Kubeflow TrainJob
if server_url and ca_cert_path and token_path:
    with open(token_path, "r") as f:
        token = f.read().strip()

    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "progress_percent":          45,     # replace with actual value (0–100)
        "estimated_time_remaining":  120.5,  # replace with actual seconds remaining
        "metrics": {                         # replace with actual metric values
            "loss":     0.15,
            "accuracy": 0.92,
        }
    }

    try:
        response = requests.post(
            server_url,
            headers=headers,
            json=payload,
            verify=ca_cert_path,
            timeout=5,
        )
        response.raise_for_status()
    except Exception as e:
        # Log but never raise reporting must not interrupt training
        print(f"Failed to update TrainJob progress: {e}")
```

The server returns HTTP 200 with the original payload on success, and a
`metav1.Status`-style JSON object on error, consistent with the Kubernetes API server
conventions.

## SDK API reference

### `update_runtime_status()` parameters

The following parameters are supported by `update_runtime_status()` from
`kubeflow.trainer.utils`:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `progress_percent` | `int` | required | Completion percentage 0–100. Values outside this range are clamped automatically. |
| `estimated_time_remaining` | `float` or `None` | `None` | Seconds until completion. Surfaced as ETA in `status.trainerStatus`. |
| `metrics` | `dict` or `None` | `None` | String keys with numeric values. Merged into `status.trainerStatus.metrics`. |
| `force` | `bool` | `False` | If `True`, bypasses the 5-second throttle and sends the update immediately. |

Additional behaviour:

- Token caching: the projected service account token is cached for 5 minutes to minimise
  file I/O.
- Thread-safe: safe to call from multiple workers simultaneously.
- No-op outside Kubeflow: if `KUBEFLOW_TRAINER_SERVER_URL` is unset, returns `False`
  immediately.

### Injected environment variables

The controller injects the following into every trainer pod when `TrainJobStatus` is
enabled:

| Variable | Description |
| :--- | :--- |
| `KUBEFLOW_TRAINER_SERVER_URL` | HTTPS endpoint of the controller's status-reporting server. |
| `KUBEFLOW_TRAINER_SERVER_CA_CERT` | Path to the CA certificate (mounted from a ConfigMap) for TLS verification of the server. |
| `KUBEFLOW_TRAINER_SERVER_TOKEN` | Path to the projected service account token file used for authentication. |

### `TrainJobTrainerStatus` API type

Progress updates are stored in the
[`TrainJobTrainerStatus`](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#TrainJobTrainerStatus)
struct at `status.trainerStatus` on the TrainJob CR. The `lastUpdatedTime` field is
required whenever `trainerStatus` is present (enforced by a CEL validation rule on the
CRD).

The Go struct fields (from the
[proposal](https://github.com/kubeflow/trainer/tree/master/docs/proposals/2779-trainjob-progress))
are: `progressPercentage` (`int32`), `estimatedRemainingSeconds` (`int32`),
`metrics` (list of `{name, value}` pairs), and `lastUpdatedTime` (`metav1.Time`).

## View TrainJob progress and metrics

Once progress reporting is active, inspect `status.trainerStatus` using standard tooling.

### Using kubectl

```bash
kubectl get trainjob <trainjob-name> -o jsonpath='{.status.trainerStatus}'
```

To view the full status including conditions alongside trainer status:

```bash
kubectl describe trainjob <trainjob-name>
```

Example output showing `status.trainerStatus`:

```text
Status:
  Trainer Status:
    Progress Percentage:          45
    Estimated Remaining Seconds:  795649
    Metrics:
      Name:   loss
      Value:  0.2347
      Name:   accuracy
      Value:  0.9876
    Last Updated Time:  2026-06-12T03:00:00Z
```

{{% alert title="Note" color="info" %}}
The field names match the Go struct fields in
[`TrainJobTrainerStatus`](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#TrainJobTrainerStatus).
{{% /alert %}}

### Using the Kubeflow SDK

{{% alert title="Note" color="info" %}}
The SDK method shown below is part of PR [kubeflow/sdk#368](https://github.com/kubeflow/sdk/pull/368),
which is pending merge. The method name and field access pattern may change before release.
{{% /alert %}}

```python
from kubeflow.trainer import TrainerClient

client = TrainerClient()

# Method name and return type may change; see kubeflow/sdk#368
status = client.get_job_status("my-trainjob")

print(f"Progress:  {status.trainer_status.progress_percent}%")
print(f"ETA:       {status.trainer_status.estimated_time_remaining}s")
print(f"Metrics:   {status.trainer_status.metrics}")
```

## Future plans

The following capabilities are planned as follow-ons to this feature, as described in the
[TrainJob progress proposal](https://github.com/kubeflow/trainer/tree/master/docs/proposals/2779-trainjob-progress):

- Periodic, transparent checkpointing triggered automatically based on ETA.
- Integration with `OptimizationJob` for hyperparameter tuning jobs (Katib).

## Next steps

- [Getting Started with Kubeflow Trainer](/docs/components/trainer/getting-started/)
- [Configure TrainJob Lifecycle](/docs/components/trainer/user-guides/trainjob-lifecycle/)
- [TrainJob Progress feature proposal](https://github.com/kubeflow/trainer/tree/master/docs/proposals/2779-trainjob-progress)
- [Kubeflow Trainer v2.2 release blog post](https://blog.kubeflow.org/kubeflow-trainer-v2.2-release/)