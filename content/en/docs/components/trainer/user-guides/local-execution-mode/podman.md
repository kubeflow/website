+++
title = "Podman Backend"
description = "Run distributed training jobs in Podman containers"
weight = 30
+++

## Overview

The Container Backend with Podman enables you to run distributed training jobs in isolated containers using Podman, a daemonless container engine. Podman offers several advantages over Docker:

- **Daemonless Architecture**: No background daemon required, reducing attack surface
- **Rootless Containers**: Run containers without root privileges for enhanced security
- **Full Container Isolation**: Each training process runs in its own container with isolated filesystem, network, and resources
- **Multi-Node Support**: Run distributed training across multiple containers with automatic DNS-enabled networking
- **Docker Compatibility**: Compatible with Docker images and Docker CLI syntax
- **systemd Integration**: Better integration with systemd for service management

The Podman backend uses the same adapter pattern as Docker, providing a unified interface for container operations.

## Prerequisites

### Required Software

- **Podman 3.0+**: Install Podman for your platform
  - **macOS**: `brew install podman`
  - **Linux**: Follow [Podman installation guide](https://podman.io/getting-started/installation)
  - **Windows**: Install via WSL2 or Podman Desktop
- **Python 3.9+**
- **Kubeflow SDK**: Install with Podman support:
  ```bash
  pip install kubeflow[podman]
  ```

### Initial Setup

#### macOS Setup

```bash
# Install Podman
brew install podman

# Initialize and start Podman machine
podman machine init
podman machine start

# Verify installation
podman version
podman ps
```

#### Linux Setup (Rootless)

```bash
# Install Podman (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y podman

# Or (Fedora/RHEL)
sudo dnf install -y podman

# Enable rootless mode (already default on most distributions)
podman --version

# Verify installation
podman ps
```

#### Custom Socket Location (Optional)

By default, Podman uses different socket locations than Docker. You can specify a custom socket:

```bash
# Start Podman with custom socket (macOS/Linux)
podman system service --time=0 unix:///tmp/podman.sock

# Or use systemd (Linux)
systemctl --user enable --now podman.socket
```

## Basic Example

Here's a simple example using the Podman Container Backend:

```python
from kubeflow.trainer import CustomTrainer, TrainerClient
from kubeflow.trainer.backends.container.types import ContainerBackendConfig

def train_model():
    """Simple training function."""
    import torch
    import os

    # Environment variables set by torchrun
    rank = int(os.environ.get('RANK', '0'))
    world_size = int(os.environ.get('WORLD_SIZE', '1'))

    print(f"Training on rank {rank}/{world_size}")

    # Your training code
    model = torch.nn.Linear(10, 1)
    optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

    for epoch in range(5):
        loss = torch.nn.functional.mse_loss(
            model(torch.randn(32, 10)),
            torch.randn(32, 1)
        )
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        print(f"[Rank {rank}] Epoch {epoch + 1}/5, Loss: {loss.item():.4f}")

    print(f"[Rank {rank}] Training completed!")

# Configure the Podman backend
backend_config = ContainerBackendConfig(
    container_runtime="podman",   # Explicitly use Podman
    pull_policy="IfNotPresent",   # Pull image if not cached locally
    auto_remove=True              # Clean up containers after completion
)

# Create the client
client = TrainerClient(backend_config=backend_config)

# Create a trainer with multi-node support
trainer = CustomTrainer(
    func=train_model,
    num_nodes=2  # Run distributed training across 2 containers
)

# Start the training job
job_name = client.train(trainer=trainer)
print(f"Training job started: {job_name}")

# Wait for completion
from kubeflow.trainer.constants import constants

job = client.wait_for_job_status(
    job_name,
    status={constants.TRAINJOB_COMPLETE},
    timeout=600
)

print(f"Job completed with status: {job.status}")
```

## Configuration Options

### ContainerBackendConfig for Podman

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `container_runtime` | `str \| None` | `None` | Force specific runtime: `"podman"`, `"docker"`, or `None` (auto-detect). Use `"podman"` to ensure Podman is used. |
| `pull_policy` | `str` | `"IfNotPresent"` | Image pull policy: `"IfNotPresent"` (pull if missing), `"Always"` (always pull), `"Never"` (use cached only). |
| `auto_remove` | `bool` | `True` | Automatically remove containers and networks after job completion or deletion. Set to `False` for debugging. |
| `container_host` | `str \| None` | `None` | Override Podman socket URL (e.g., `"unix:///tmp/podman.sock"`, `"unix:///run/user/1000/podman/podman.sock"`). |
| `runtime_source` | `TrainingRuntimeSource` | GitHub sources | Configuration for training runtime sources. See "Custom Runtime Sources" section below. |

### Configuration Examples

#### Basic Podman Configuration

```python
backend_config = ContainerBackendConfig(
    container_runtime="podman",
)
```

#### Custom Socket Location

```python
# macOS with Podman machine
backend_config = ContainerBackendConfig(
    container_runtime="podman",
    container_host="unix:///tmp/podman.sock"
)

# Linux rootless (user-specific socket)
import os
uid = os.getuid()
backend_config = ContainerBackendConfig(
    container_runtime="podman",
    container_host=f"unix:///run/user/{uid}/podman/podman.sock"
)
```

#### Always Pull Latest Image

```python
backend_config = ContainerBackendConfig(
    container_runtime="podman",
    pull_policy="Always"  # Always pull latest image
)
```

#### Keep Containers for Debugging

```python
backend_config = ContainerBackendConfig(
    container_runtime="podman",
    auto_remove=False  # Containers remain after job completion
)


## Multi-Node Distributed Training

The Podman backend automatically sets up networking and environment variables for distributed training:

```python
from kubeflow.trainer import CustomTrainer, TrainerClient
from kubeflow.trainer.backends.container.types import ContainerBackendConfig

def distributed_train():
    """PyTorch distributed training example."""
    import os
    import torch
    import torch.distributed as dist

    # Environment variables set by torchrun
    rank = int(os.environ['RANK'])
    world_size = int(os.environ['WORLD_SIZE'])

    print(f"Initializing process group: rank={rank}, world_size={world_size}")

    # Initialize distributed training
    dist.init_process_group(
        backend='gloo',  # Use 'gloo' for CPU, 'nccl' for GPU
        rank=rank,
        world_size=world_size
    )

    # Your distributed training code
    model = torch.nn.Linear(10, 1)
    ddp_model = torch.nn.parallel.DistributedDataParallel(model)

    # Training loop
    for epoch in range(5):
        # Your training code here
        print(f"[Rank {rank}] Training epoch {epoch + 1}")

    dist.destroy_process_group()
    print(f"[Rank {rank}] Training complete")

backend_config = ContainerBackendConfig(
    container_runtime="podman",
)

client = TrainerClient(backend_config=backend_config)

trainer = CustomTrainer(
    func=distributed_train,
    num_nodes=4  # Run across 4 containers
)

job_name = client.train(trainer=trainer)
```

### Podman-Specific Networking

Podman creates networks with **DNS enabled by default**, allowing containers to resolve each other by hostname. The backend implementation uses **IP addresses** for the `MASTER_ADDR` environment variable to ensure reliable communication:

#### IP Address Resolution

The Podman backend automatically retrieves the IP address of the rank-0 container using `podman inspect`:

```bash
podman inspect --format '{{.NetworkSettings.Networks.<network-name>.IPAddress}}' <container-name>
```

This IP address is then set as `MASTER_ADDR` for all nodes in the job, ensuring that:
  - Communication works even if DNS resolution has timing issues
  - The master address is available immediately when containers start
  - Distributed training frameworks (PyTorch, TensorFlow) can connect reliably

#### DNS Resolution

While DNS is enabled and containers can resolve each other by hostname, the backend uses IP addresses for reliability:

```python
def test_networking():
    import os
    import socket

    rank = int(os.environ['RANK'])
    master_addr = os.environ['MASTER_ADDR']

    print(f"Rank {rank}: My hostname is {socket.gethostname()}")
    print(f"Rank {rank}: Master address (IP): {master_addr}")
    # DNS is also available - containers can resolve by hostname
    if rank == 0:
        container_name = os.environ.get('HOSTNAME')
        print(f"Rank {rank}: My IP address: {socket.gethostbyname(container_name)}")
    
    # Containers can ping each other by name or IP
    if rank != 0:
        import subprocess
        result = subprocess.run(['ping', '-c', '1', master_addr], capture_output=True)
        print(f"Ping to master IP: {result.returncode == 0}")
```

#### Network Architecture

For a job with `num_nodes=3`, the Podman backend:

1. Creates a dedicated network: `<job-name>-net` with DNS enabled
2. Launches rank-0 container and waits for it to be running
3. Inspects rank-0 container to get its IP address
4. Sets `MASTER_ADDR` to this IP for all containers
5. Launches remaining containers (rank 1, 2, ...) connected to the same network
    
This approach combines the benefits of DNS (hostname resolution) with the reliability of IP addresses for critical communication paths.

## Job Management

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

# Get logs from all nodes
for node_index in range(trainer.num_nodes):
    print(f"\n=== Logs from node {node_index} ===")
    for log_line in client.get_job_logs(job_name, node_index=node_index):
        print(log_line, end='')
```

### Inspecting Containers with Podman CLI

When `auto_remove=False`, you can inspect containers:

```bash
# List containers for a job
podman ps -a --filter "label=kubeflow.org/job-name=<job-name>"

# Inspect a specific container
podman inspect <job-name>-node-0

# View logs directly
podman logs <job-name>-node-0

# Execute commands in a container
podman exec -it <job-name>-node-0 /bin/bash

# With custom socket
podman --url unix:///tmp/podman.sock logs <job-name>-node-0
```

### Deleting Jobs

```python
# Delete job and clean up resources
client.delete_job(job_name)
```

This removes:
- All containers for the job
- The Podman network created for the job
- Job metadata

## Advanced Usage

### Using Runtimes

Runtimes provide pre-configured training environments with specific frameworks and settings:

```python
# List available runtimes
runtimes = client.list_runtimes()
for runtime in runtimes:
    print(f"Runtime: {runtime.name}")

# Get a specific runtime
runtime = client.get_runtime("torch-distributed")

# Train with the runtime
job_name = client.train(
    trainer=trainer,
    runtime=runtime
)
```

### Custom Runtime Sources

By default, the Container Backend loads runtimes from:
1. **GitHub** - `github://kubeflow/trainer` (official runtimes, cached for 24 hours)
2. **Fallback** - Built-in default images (e.g., `pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime`)

You can customize where runtimes are loaded from using the `runtime_source` configuration:

```python
from kubeflow.trainer import ContainerBackendConfig, TrainingRuntimeSource

backend_config = ContainerBackendConfig(
    container_runtime="podman",
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

## Troubleshooting

### Podman Service Not Running (macOS)

**Error**: `ConnectionRefusedError: [Errno 61] Connection refused`

**Solution**:
```bash
# Check Podman machine status
podman machine list

# Start Podman machine
podman machine start

# Or start with custom socket
podman machine stop
podman machine start --now
```

### Socket Not Found (Linux)

**Error**: `FileNotFoundError: [Errno 2] No such file or directory: '/run/user/1000/podman/podman.sock'`

**Solution**:
```bash
# Start Podman socket service
systemctl --user start podman.socket
systemctl --user enable podman.socket

# Verify socket exists
ls -la /run/user/$(id -u)/podman/podman.sock

# Or specify custom socket in config
```

### Permission Denied (Rootless)

**Error**: `Error: container_linux.go:380: starting container process caused: process_linux.go:545: container init caused: rootfs_linux.go:76: mounting`

**Solution**:
```bash
# Enable user namespaces (Linux)
sudo sysctl -w user.max_user_namespaces=15000

# Or edit /etc/sysctl.conf
echo "user.max_user_namespaces=15000" | sudo tee -a /etc/sysctl.conf

# For persistent storage, configure subuid/subgid
sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 $USER
```


### DNS Resolution Issues

**Error**: Containers cannot resolve each other's hostnames

**Solution**:
```bash
# Verify DNS is enabled in network
podman network inspect <job-name>-net | grep dns_enabled

# Should show: "dns_enabled": true

# Podman networks created by the backend have DNS enabled by default
```

### Containers Not Removed

**Problem**: Containers remain after job completion

**Solution**:
```python
# Ensure auto_remove is enabled
backend_config = ContainerBackendConfig(
    container_runtime="podman",
    auto_remove=True  # Default
)

# Or manually clean up
client.delete_job(job_name)

# Or use Podman CLI
podman rm -f $(podman ps -aq --filter "label=kubeflow.org/job-name=<job-name>")
```

## Docker vs Podman Comparison

| Feature | Podman | Docker |
|---------|--------|--------|
| **Architecture** | Daemonless, fork/exec model | Client-server with daemon |
| **Root Requirement** | Rootless mode supported | Requires root or docker group |
| **Security** | No root daemon, better isolation | Daemon runs as root |
| **systemd Integration** | Native systemd support | Limited |
| **DNS in Networks** | Enabled by default | Requires configuration |
| **Image Format** | OCI compliant | Docker image format |
| **CLI Compatibility** | Docker-compatible commands | Native |
| **Setup (macOS)** | Requires Podman machine | Docker Desktop |
| **Best For** | Security, Linux servers, rootless | General use, wider ecosystem |

### When to Use Podman

- **Security is a priority**: Rootless containers and no root daemon
- **Multi-user environments**: Better user isolation
- **Linux servers**: Native systemd integration
- **Compliance requirements**: OCI-compliant, no privileged daemon

### When to Use Docker

- **macOS/Windows development**: Docker Desktop is more mature
- **Wider ecosystem support**: More third-party tools
- **Simpler setup**: Docker Desktop handles most configuration
- **Team familiarity**: Most developers know Docker

## Switching Between Docker and Podman

The beauty of the unified Container Backend is that you can switch between Docker and Podman with minimal code changes:

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

## Next Steps

- Learn about the [Container Backend with Docker](./docker.md) for Docker-specific features
- Learn about the [Local Process Backend](./local_process.md) for non-containerized local execution
