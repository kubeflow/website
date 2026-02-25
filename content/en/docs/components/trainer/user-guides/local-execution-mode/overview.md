+++
title = "Overview"
description = "Run TrainJobs locally using different backends and common operations"
weight = 1
+++

The Kubeflow SDK allows you to run TrainJobs on your local machine without deploying to a Kubernetes cluster. This is ideal for:

- Development and testing of training scripts
- Quick prototyping and experimentation
- Learning and educational purposes
- Environments where Kubernetes is not available

## Available Backends

### Local Process Backend

Run TrainJobs directly using native Python processes and virtual environments. This is the fastest option for simple, single-node training.

**Best for:**

- Quick prototyping and development
- Testing training scripts without container overhead
- Environments where Docker/Podman is not available

[Learn more about Local Process Backend](./local_process.md)

### Container Backend with Docker

Run distributed TrainJobs in isolated Docker containers with full multi-node support.

**Best for:**

- General use cases, especially on macOS/Windows
- Distributed training with multiple containers
- Reproducible containerized environments

[Learn more about Docker Backend](./docker.md)

### Container Backend with Podman

Run distributed TrainJobs using Podman, a daemonless container engine with enhanced security.

**Best for:**

- Security-focused environments
- Rootless containerized training
- Linux servers with systemd integration

[Learn more about Podman Backend](./podman.md)

## Backend Comparison

| Feature           | Local Process          | Docker                      | Podman                   |
| ----------------- | ---------------------- | --------------------------- | ------------------------ |
| **Setup**         | No additional software | Docker Desktop/Engine       | Podman installation      |
| **Isolation**     | Virtual environments   | Full container isolation    | Full container isolation |
| **Multi-node**    | Not supported          | Supported                   | Supported                |
| **Root Required** | No                     | Docker group or root        | Rootless supported       |
| **Startup Time**  | Fast (seconds)         | Medium (container start)    | Medium (container start) |
| **Best For**      | Quick prototyping      | General use, wide ecosystem | Security, Linux servers  |

## Switching Between Backends

All backends use the same `TrainerClient` interface, making it easy to progress from local development to production deployment. The same training code works across all backends - only the backend configuration changes.

### Local Process Backend

Complete some quick local testing:

```python
from kubeflow.trainer import LocalProcessBackendConfig

backend_config = LocalProcessBackendConfig()
client = TrainerClient(backend_config=backend_config)

trainer = CustomTrainer(func=train_model)
job_name = client.train(trainer=trainer)
```

### Container Backend

Use Docker/Podman for multi-node distributed training:

```python
# Switch to Docker Backend - same trainer works!
from kubeflow.trainer import ContainerBackendConfig

backend_config = ContainerBackendConfig(
    container_runtime="docker",
)
client = TrainerClient(backend_config=backend_config)

# Same trainer, same train() call!
trainer = CustomTrainer(func=train_model, num_nodes=4)  # Now with multi-node support
job_name = client.train(trainer=trainer)
```

### Kubernetes Backend

Production environment with the Kubernetes backend:

```python
# Deploy to Kubernetes - same trainer still works!
from kubeflow.trainer import KubernetesBackendConfig

backend_config = KubernetesBackendConfig(namespace="kubeflow")
client = TrainerClient(backend_config=backend_config)

# Same trainer, same train() call!
trainer = CustomTrainer(func=train_model, num_nodes=4)
job_name = client.train(trainer=trainer)
```

## Job Management

All backends support the same job management operations through the `TrainerClient` interface using the same set of APIs.

### Listing Jobs

```python
# List all jobs
jobs = client.list_jobs()

for job in jobs:
    print(f"Job: {job.name}, Status: {job.status}")
```

### Viewing Logs

```python
# Stream logs from a specific node
for log_line in client.get_job_logs(job_name, node_index=0, follow=True):
    print(log_line, end='')

# Get logs from all nodes (Container backends only)
for node_index in range(trainer.num_nodes):
    print(f"\n=== Logs from node {node_index} ===")
    for log_line in client.get_job_logs(job_name, node_index=node_index):
        print(log_line, end='')
```

### Waiting for Job Completion

```python
from kubeflow.trainer.constants import constants

# Wait for job to complete
job = client.wait_for_job_status(
    job_name,
    status={constants.TRAINJOB_COMPLETE},
    timeout=600
)

print(f"Job completed with status: {job.status}")
```

### Deleting Jobs

```python
# Delete job and clean up resources
client.delete_job(job_name)
```

This removes:

- All containers/processes for the job
- Networks created for the job (Container backends)
- Job metadata

## Working with Runtimes

Runtimes provide pre-configured training environments with specific frameworks and settings.

### Listing Available Runtimes

```python
# List available runtimes
runtimes = client.list_runtimes()
for runtime in runtimes:
    print(f"Runtime: {runtime.name}")
```

### Using a Specific Runtime

```python
# Train with the runtime
job_name = client.train(
    trainer=trainer,
    runtime="torch-distributed"
)
```

### Custom Runtime Sources (Container Backends)

By default, the Container Backends load runtimes from:

1. **GitHub** - `github://kubeflow/trainer` (official runtimes, cached for 24 hours)
2. **Fallback** - Built-in default images (e.g., `pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime`)

You can customize where runtimes are loaded from using the `runtime_source` configuration:

```python
from kubeflow.trainer import ContainerBackendConfig, TrainingRuntimeSource

backend_config = ContainerBackendConfig(
    container_runtime="docker",  # or "podman"
    runtime_source=TrainingRuntimeSource(sources=[
        "github://kubeflow/trainer",                    # Official Kubeflow runtimes
        "github://myorg/myrepo/path/to/runtimes",       # Custom GitHub repository
        "https://example.com/custom-runtime.yaml",      # HTTP(S) endpoint
        "file:///absolute/path/to/runtime.yaml",        # Local YAML file
        "/absolute/path/to/runtime.yaml",               # Local YAML file (alternate)
    ])
)

client = TrainerClient(backend_config=backend_config)
```

**Source Priority**: Sources are checked in order. If a runtime is not found in any source, the system falls back to the default image for the framework.

**Runtime YAML Example**:

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: torch-custom
  labels:
    trainer.kubeflow.org/framework: torch
spec:
  mlPolicy:
    numNodes: 1
    torch:
      numProcPerNode: auto
  template:
    spec:
      replicatedJobs:
        - name: node
          template:
            spec:
              template:
                spec:
                  containers:
                    - name: node
                      image: myregistry.com/pytorch-custom:latest
```

### Switching Between Container Backends

The unified Container Backend API makes it easy to switch between Docker and Podman:

```python
# Use Docker
backend_config = ContainerBackendConfig(
    container_runtime="docker",
)

# Switch to Podman - just change one line!
backend_config = ContainerBackendConfig(
    container_runtime="podman",
)

# Or let it auto-detect
backend_config = ContainerBackendConfig(
    container_runtime=None,  # Auto-detect (tries Docker first, then Podman)
)
```

**Key Points:**

- Your training function (`func=train_model`) doesn't change
- Job management operations (`list_jobs()`, `get_job_logs()`, `delete_job()`) work the same across all backends
- Only the backend configuration import and instantiation changes
- This progression allows you to test locally first, validate with containers, then deploy to production

## Next Steps

Choose the backend that best fits your needs:

- **[Local Process Backend](./local_process.md)**
- **[Docker Backend](./docker.md)**
- **[Podman Backend](./podman.md)**
