+++
title = "Local Process Backend"
description = "Run training jobs with native Python processes and virtual environments"
weight = 10
+++

## Overview

The Local Process Backend allows you to execute training jobs directly on your local machine using native Python processes and virtual environments. This backend is ideal for:

- Quick prototyping and development
- Testing training scripts without container overhead
- Environments where Docker/Podman is not available
- Debugging training code locally

The Local Process Backend creates isolated Python virtual environments for each training job, automatically installs required dependencies, and manages the lifecycle of training processes in background threads with real-time log streaming.

## Key Features

- **Isolated Environments**: Each job runs in its own Python virtual environment
- **Dependency Management**: Automatic installation and intelligent conflict resolution of Python packages
- **Job Lifecycle**: Complete job management (create, monitor, logs, cancel, cleanup)
- **Threaded Execution**: Non-blocking job execution with real-time log streaming
- **Automatic Cleanup**: Optional cleanup of virtual environments after completion
- **Fast Iteration**: Quick setup and teardown for rapid experimentation

## Prerequisites

- Python 3.9 or later
- pip (Python package installer)
- **Kubeflow SDK**: Install the base package:
  ```bash
  pip install kubeflow
  ```
- Sufficient disk space for virtual environments
- Required Python packages for your training framework (e.g., PyTorch, TensorFlow)

## Basic Example

Here's a simple example using the Local Process Backend:

```python
from kubeflow.trainer import CustomTrainer, TrainerClient
from kubeflow.trainer.backends.localprocess import LocalProcessBackendConfig

# Define your training function
def train_model():
    import torch
    import time

    print("Starting training...")

    # Your training code here
    model = torch.nn.Linear(10, 1)
    optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

    for epoch in range(5):
        # Training loop
        loss = torch.nn.functional.mse_loss(
            model(torch.randn(32, 10)),
            torch.randn(32, 1)
        )
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        print(f"Epoch {epoch + 1}/5, Loss: {loss.item():.4f}")

    print("Training completed!")

# Configure the backend
backend_config = LocalProcessBackendConfig(
    cleanup_venv=True  # Automatically clean up virtual environments after completion
)

# Create the client
client = TrainerClient(backend_config=backend_config)

# Create the trainer
trainer = CustomTrainer(
    func=train_model,
    num_nodes=1,  # Local process backend ignores this parameter
)

# Start the training job
job_name = client.train(trainer=trainer)
print(f"Training job started: {job_name}")

# Wait for completion
from kubeflow.trainer.constants import constants

job = client.wait_for_job_status(
    job_name,
    status={constants.TRAINJOB_COMPLETE},
    timeout=300
)

print(f"Job completed with status: {job.status}")
```

## Configuration Options

### LocalProcessBackendConfig

The `LocalProcessBackendConfig` class provides configuration options for the Local Process Backend:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cleanup_venv` | bool | `True` | Whether to automatically remove virtual environments after job completion. Set to `False` to preserve environments for debugging. |

**Example:**

```python
from kubeflow.trainer.backends.localprocess import LocalProcessBackendConfig

# Keep virtual environments for debugging
backend_config = LocalProcessBackendConfig(
    cleanup_venv=False
)
```

## Working with Runtimes

The Local Process Backend supports predefined runtimes that specify the training framework and required packages.

### Listing Available Runtimes

```python
client = TrainerClient(backend_config=backend_config)
runtimes = client.list_runtimes()

for runtime in runtimes:
    print(f"Runtime: {runtime.name}")
    print(f"  Framework: {runtime.trainer.framework}")
```

### Using a Specific Runtime

```python
# Get a specific runtime
runtime = client.get_runtime("torch-distributed")

# Train with the runtime
job_name = client.train(
    trainer=trainer,
    runtime=runtime
)
```

### Supported Runtimes

Currently supported runtimes:

| Runtime | Framework | Description | Packages |
|---------|-----------|-------------|----------|
| `torch-distributed` | PyTorch | PyTorch training with torchrun | `torch` |

## Job Management

### Listing Jobs

```python
# List all jobs
jobs = client.list_jobs()

for job in jobs:
    print(f"Job: {job.name}, Status: {job.status}")
```

### Checking Job Status

```python
# Get job details
job = client.get_job(job_name)
print(f"Status: {job.status}")
print(f"Created: {job.created}")
print(f"Completed: {job.completed}")
```

### Viewing Job Logs

```python
# Stream logs from a running or completed job
for log_line in client.get_job_logs(job_name, follow=True):
    print(log_line, end='')
```

### Deleting Jobs

```python
# Delete a job and clean up resources
client.delete_job(job_name)
```

## Advanced Usage

### Custom Training with Dependencies

You can specify additional packages to install in the training environment:

```python
from kubeflow.trainer import CustomTrainer, TrainerClient
from kubeflow.trainer.backends.localprocess import LocalProcessBackendConfig

def train_with_dependencies():
    import numpy as np
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier

    print("Training with scikit-learn...")
    # Your training code here
    X = np.random.rand(100, 4)
    y = np.random.randint(0, 2, 100)

    clf = RandomForestClassifier(n_estimators=10)
    clf.fit(X, y)

    print(f"Model accuracy: {clf.score(X, y):.2f}")

backend_config = LocalProcessBackendConfig()
client = TrainerClient(backend_config=backend_config)

# Specify packages to install
trainer = CustomTrainer(
    func=train_with_dependencies,
    packages_to_install=["numpy", "pandas", "scikit-learn"],
    pip_index_urls=["https://pypi.org/simple"]
)

job_name = client.train(trainer=trainer)
```

### CustomTrainer Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `func` | `Callable` | ✅ | Training function to execute |
| `func_args` | `dict` | ❌ | Arguments to pass to training function |
| `packages_to_install` | `list[str]` | ❌ | Additional Python packages to install |
| `pip_index_urls` | `list[str]` | ❌ | PyPI URLs for package installation |
| `env` | `dict[str, str]` | ❌ | Environment variables for the training process |

### Environment Variables

Pass custom environment variables to your training job:

```python
trainer = CustomTrainer(
    func=train_model,
    env={
        "CUDA_VISIBLE_DEVICES": "0",
        "OMP_NUM_THREADS": "4",
        "CUSTOM_VAR": "value"
    }
)
```

### Debugging Failed Jobs

When `cleanup_venv=False`, you can inspect the virtual environment after job failure:

```python
backend_config = LocalProcessBackendConfig(cleanup_venv=False)
client = TrainerClient(backend_config=backend_config)

trainer = CustomTrainer(func=train_model)
job_name = client.train(trainer=trainer)

try:
    job = client.wait_for_job_status(
        job_name,
        status={constants.TRAINJOB_COMPLETE, constants.TRAINJOB_FAILED},
        timeout=300
    )

    if job.status == constants.TRAINJOB_FAILED:
        print("Job failed. Logs:")
        for log_line in client.get_job_logs(job_name):
            print(log_line, end='')

        # Virtual environment is preserved for debugging
        print(f"\nVirtual environment preserved for job: {job_name}")
except Exception as e:
    print(f"Error: {e}")
finally:
    # Clean up when done debugging
    client.delete_job(job_name)
```

## How It Works

Understanding the internal workflow helps with debugging and optimization:

### 1. Job Creation
- A unique job name is generated (e.g., `a1b2c3d4e5f`)
- A temporary directory is created: `/tmp/a1b2c3d4e5f_xyz/`
- A Python virtual environment is set up with isolation

### 2. Environment Setup
```bash
python -m venv --without-pip /tmp/a1b2c3d4e5f_xyz/
source /tmp/a1b2c3d4e5f_xyz/bin/activate
python -m ensurepip --upgrade --default-pip
```

### 3. Package Dependency Resolution

The backend implements intelligent package dependency management:

**Rules:**
1. **Trainer Override**: Trainer packages take precedence over runtime packages
2. **Case-Insensitive Matching**: Package names are normalized (PEP 503)
3. **Duplicate Detection**: Prevents duplicate packages in trainer dependencies
4. **Order Preservation**: Maintains installation order for reproducibility

**Example:**
```python
# Runtime packages: ["torch==1.9.0", "numpy"]
# Trainer packages: ["torch==2.0.0", "scipy"]
# Result: ["numpy", "torch==2.0.0", "scipy"]
# torch==2.0.0 from trainer overrides torch==1.9.0 from runtime
```

### 4. Training Code Preparation

The training function source code is extracted and written to a Python file:
```python
# Written to: /tmp/a1b2c3d4e5f_xyz/train_a1b2c3d4e5f.py

def train_model():
    import torch
    print("Starting PyTorch training...")
    # ... your code ...

train_model()  # Auto-generated function call
```

### 5. Execution

For PyTorch framework:
```bash
/tmp/a1b2c3d4e5f_xyz/bin/torchrun train_a1b2c3d4e5f.py
```

For other frameworks:
```bash
/tmp/a1b2c3d4e5f_xyz/bin/python train_a1b2c3d4e5f.py
```

### 6. Cleanup (Optional)

When `cleanup_venv=True`:
```bash
rm -rf /tmp/a1b2c3d4e5f_xyz/
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LocalProcessBackend                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐    ┌──────────────────┐                     │
│  │ Training Job  │────│ Virtual Env      │                     │
│  │ (LocalJob)    │    │ /tmp/xyz123...   │                     │
│  │               │    │ ├── bin/python   │                     │
│  │ - Threading   │    │ ├── lib/...      │                     │
│  │ - Log Stream  │    │ └── train_xyz.py │                     │
│  │ - Status Mgmt │    └──────────────────┘                     │
│  └───────────────┘                                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┤
│  │ Package Management                                         │
│  │ - Runtime dependencies (torch, etc.)                       │
│  │ - Trainer dependencies (custom packages)                   │
│  │ - Conflict resolution & merging                            │
│  └─────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
```

## Best Practices

### ✅ Perfect For

- **Local Development**: Developing and testing training code
- **Experimentation**: Quick iteration on training algorithms
- **CI/CD Pipelines**: Automated testing of training workflows
- **Educational Use**: Learning distributed training concepts
- **Prototyping**: Validating ideas before cluster deployment

### ❌ Not Suitable For

- **Production Training**: Large-scale distributed training workloads
- **Multi-Node Training**: Training across multiple machines
- **Resource Management**: Fine-grained GPU/memory allocation
- **Long-Running Jobs**: Training jobs that run for days/weeks
- **High Availability**: Mission-critical training pipelines

### General Best Practices

1. **Use for Development**: The Local Process Backend is best suited for development and testing. For production workloads, consider using the Container Backend or Kubernetes Backend.

2. **Clean Up Resources**: Set `cleanup_venv=True` (default) to avoid filling disk space with virtual environments.

3. **Test Before Containerizing**: Use the Local Process Backend to quickly validate your training code before moving to containerized environments.

4. **Monitor Resource Usage**: Since jobs run directly on your machine, monitor CPU, memory, and disk usage to avoid resource exhaustion.

5. **Specify Dependencies Explicitly**: Use `packages_to_install` to ensure all required packages are installed in the isolated environment.

## Troubleshooting

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `ValueError: CustomTrainer must be set` | Using BuiltinTrainer | Use CustomTrainer instead |
| `ValueError: Runtime 'name' not found` | Invalid runtime name | Use `list_runtimes()` to see available options |
| `ValueError: No python executable found` | Missing Python | Install Python or ensure it's in PATH |
| `No TrainJob with name 'name'` | Job doesn't exist | Check job name spelling |

### Job Status Flow

```
Created → Running → Complete
    ↓       ↓
  Failed ← Failed
```

### Virtual Environment Creation Fails

**Problem**: Error creating virtual environment.

**Solution**: Ensure you have sufficient disk space and that Python's `venv` module is installed:

```bash
python -m venv --help
```

### Package Installation Errors

**Problem**: Required packages fail to install in the virtual environment.

**Solution**:
- Check your internet connection
- Verify that package names are correct
- Use `packages_to_install` to explicitly specify packages
- Ensure pip is up to date: `pip install --upgrade pip`

### Jobs Not Cleaning Up

**Problem**: Virtual environments remain after job completion.

**Solution**: Verify that `cleanup_venv=True` in your config, or manually delete jobs:

```python
client.delete_job(job_name)
```

### Permission Errors

**Problem**: Permission denied when creating virtual environments.

**Solution**: Ensure you have write permissions to the temp directory. On Unix-like systems, check:

```bash
ls -ld /tmp
```

### Debug Mode

Enable debug logging for detailed execution information:

```python
import logging
logging.basicConfig(level=logging.DEBUG)

backend_config = LocalProcessBackendConfig(cleanup_venv=False)
client = TrainerClient(backend_config=backend_config)
```

## Limitations

- **Single Machine Only**: Only runs on local machine, no distributed training across multiple nodes. The `num_nodes` parameter is ignored.
- **CustomTrainer Only**: Does not support BuiltinTrainer configurations.
- **No GPU Scheduling**: Cannot manage GPU allocation across multiple jobs.
- **Process Isolation**: Jobs are isolated by virtual environment, not containers.
- **Limited Scaling**: Not suitable for large-scale production training.
- **System Dependencies**: Training code must be compatible with your local Python environment and operating system.

## Comparison with Container Backend

| Feature | Local Process Backend | Container Backend |
|---------|----------------------|-------------------|
| **Setup** | No additional software required | Requires Docker or Podman |
| **Isolation** | Python virtual environments | Full container isolation |
| **Multi-node Training** | Not supported | Supported |
| **Startup Time** | Fast (seconds) | Slower (image pull + container start) |
| **Resource Isolation** | Limited (shared system) | Strong (cgroups, namespaces) |
| **GPU Support** | Direct system access | NVIDIA Container Toolkit required |
| **Best For** | Quick prototyping, development | Production, distributed training |

## Migration Guide

### From Kubernetes Backend

The same training code works in both backends:

```python
# Before (Kubernetes)
from kubeflow.trainer.backends.kubernetes import KubernetesBackendConfig
backend_config = KubernetesBackendConfig(namespace="default")

# After (Local Process)
from kubeflow.trainer.backends.localprocess import LocalProcessBackendConfig
backend_config = LocalProcessBackendConfig()

# Same trainer, same train() call!
client = TrainerClient(backend_config=backend_config)
trainer = CustomTrainer(func=train_model)
job_name = client.train(trainer=trainer)
```

### To Kubernetes Backend

```python
# Test locally first with LocalProcessBackend
# Then deploy to cluster with KubernetesBackend
# No code changes needed - same CustomTrainer works in both!
```

## Next Steps

- Learn about the [Container Backend with Docker](./docker.md) for containerized training
- Learn about the [Container Backend with Podman](./podman.md) for rootless containerized training
