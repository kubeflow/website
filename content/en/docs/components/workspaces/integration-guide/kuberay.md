---
title: Integrating with KubeRay
description: Run distributed Ray jobs and interact with Ray clusters from Kubeflow Workspaces
weight: 10
---

{{< workspaces-beta-notice >}}

This guide shows how to scale out work from a **Kubeflow Workspace** (for example, a JupyterLab notebook) to distributed compute with [Ray](https://docs.ray.io/), using [KubeRay](https://ray-project.github.io/kuberay/).

## Overview

Workspaces are lightweight, interactive environments. When a workload outgrows a single workspace (multi-node data processing, hyperparameter tuning, or distributed training), you can hand it off to a Ray cluster directly from Python.

Workspace users can run Ray in two ways:

| Workflow | Use it for | Who manages the Ray cluster | Cleanup |
| :--- | :--- | :--- | :--- |
| **[Interactive](#workflow-1-interactive-computing-on-a-shared-ray-cluster)**: connect to a shared `RayCluster` | Prototyping, exploratory analysis, running notebook cells step by step | Cluster administrator (long-lived, shared) | Not needed; the cluster stays up for others |
| **[On-demand job](#workflow-2-on-demand-jobs-with-rayjob)**: submit a `RayJob` | Batch processing, training runs, hyperparameter sweeps | KubeRay (created per job) | Automatic when the job finishes |

The setup is split between two roles:

| Role | Responsibilities |
| :--- | :--- |
| **[Cluster administrator](#for-cluster-administrators)** | Install KubeRay, grant workspaces permission to use Ray, and provision shared Ray clusters for interactive use. Done once per cluster or namespace. |
| **[Workspace user](#for-workspace-users)** (data scientists, ML engineers) | Run Ray workloads from Python in a workspace. No Kubernetes knowledge or credentials required. |

---

## For Cluster Administrators

After the steps in this section, every workspace created from the configured `WorkspaceKind` can use Ray with no further per-user setup.

### Step 1: Install the KubeRay Operator

Follow the official [KubeRay Operator Installation Guide](https://docs.ray.io/en/latest/cluster/kubernetes/getting-started/kuberay-operator-installation.html) (for example, using Helm). The on-demand job workflow uses `RayJob` `InteractiveMode`, which requires KubeRay **v1.3 or later**.

### Step 2: Grant Workspaces Permission to Use Ray

Each workspace pod runs as a dedicated `ServiceAccount` (`ws-<workspace-name>`). Instead of binding roles per workspace, define a `ClusterRole` once and attach it to the `WorkspaceKind`; the Workspaces controller then binds it for every workspace of that kind.

The role below follows least privilege:

- **`RayJob`: full access.** Users can self-serve on-demand jobs, whose clusters are cleaned up automatically.
- **`RayCluster`: read-only.** Users can discover and connect to shared clusters, but cannot create their own. A `RayCluster` created from a notebook has no lifecycle link to the notebook. If the user forgets to delete it, or the kernel crashes or the workspace is stopped, the cluster (including any GPUs it holds) keeps running indefinitely.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: ray-job-edit
  labels:
    rbac.authorization.kubeflow.org/aggregate-to-kubeflow-edit: "true"
rules:
  # Discover and connect to shared Ray clusters (no create/delete)
  - apiGroups: ["ray.io"]
    resources: ["rayclusters", "rayclusters/status"]
    verbs: ["get", "list", "watch"]
  # Self-service, self-cleaning on-demand jobs
  - apiGroups: ["ray.io"]
    resources: ["rayjobs", "rayjobs/status"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  # Status checks and logs
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services", "events"]
    verbs: ["get", "list", "watch"]
```

The `aggregate-to-kubeflow-edit` label merges these rules into Kubeflow's built-in `kubeflow-edit` role. As a result:

- **Profile contributors** (users with edit access to a namespace) get the same Ray permissions, so they can inspect or delete `RayJob`s from the Kubeflow dashboard or `kubectl`.
- **Workspaces bound to `kubeflow-edit`** inherit the Ray permissions automatically.

Omit the label if Ray access should be limited to workspaces whose `WorkspaceKind` lists `ray-job-edit` explicitly.

Then add the role to `spec.podTemplate.serviceAccount.clusterRoles` of your `WorkspaceKind` (for example, `jupyterlab`). Listing it explicitly keeps the grant visible and keeps it in effect even if `kubeflow-edit` is not bound:

```yaml
spec:
  podTemplate:
    serviceAccount:
      clusterRoles:
        - name: kubeflow-edit
        - name: ray-job-edit
```

To append the role to an existing `WorkspaceKind` without overwriting roles that are already listed:

```bash
kubectl patch workspacekind jupyterlab --type=json -p='[
  {"op": "add", "path": "/spec/podTemplate/serviceAccount/clusterRoles/-", "value": {"name": "ray-job-edit"}}
]'
```

### Step 3: Provide a Shared Ray Cluster for Interactive Use

Interactive users connect to a long-lived `RayCluster` that you manage in their namespace. Users can't create one themselves. To create one, see the [RayCluster Quickstart](https://docs.ray.io/en/latest/cluster/kubernetes/getting-started/raycluster-quick-start.html), and remember to set the Istio label described [below](#things-to-keep-in-mind). Tell users the cluster's name and the Ray version it runs. Enabling autoscaling with `minReplicas: 0` keeps idle workers from holding resources.

### Things to Keep in Mind

- **Version matching:** Ray Client requires the **same Ray version and Python minor version** on the client and the cluster. Choose a Ray image (for example, `rayproject/ray:2.58.0-py312`) that matches the Python version of your workspace images, and publish the Ray version users should install.
- **Istio sidecars:** Kubeflow enables Istio sidecar injection in user namespaces. The Envoy sidecar intercepts Ray's internal gRPC traffic between head and worker nodes, so the `RayCluster` never becomes ready. Ray pods must carry the `sidecar.istio.io/inject: "false"` label. Set it on your shared clusters; the users' `RayJob` code in this guide already sets it.
- **Quotas:** Users can create `RayJob`s freely, so consider a [`ResourceQuota`](https://kubernetes.io/docs/concepts/policy/resource-quotas/) per namespace to cap CPU, memory, and GPU usage.

---

## For Workspace Users

You can run Ray workloads directly from Python in your workspace. Your administrator has already set up permissions, so you don't need Kubernetes credentials or `kubectl`.

**Before you start**, ask your administrator for:

- The **Ray version** to install (it must match the Ray cluster).
- The **name of the shared Ray cluster**, if you plan to work interactively. If you don't have one, you can [find one yourself](#step-1-find-a-ray-cluster).

### Set Up Your Environment

Install the Ray SDK and the KubeRay Python client, using the Ray version from your administrator:

```bash
RAY_VERSION="2.58.0"

pip install "ray[default,client]==${RAY_VERSION}" \
  "git+https://github.com/ray-project/kuberay.git#subdirectory=clients/python-client"
```

If you install packages from inside a running notebook, restart the kernel afterward (**Kernel ➔ Restart Kernel**).

Both workflows need to know which namespace (your project space on the cluster) your workspace runs in. Run this once at the top of your notebook:

```python
def get_current_namespace() -> str:
    """Return the namespace this workspace runs in."""
    with open("/var/run/secrets/kubernetes.io/serviceaccount/namespace") as f:
        return f.read().strip()


NAMESPACE = get_current_namespace()
print(f"Namespace: {NAMESPACE}")
```

---

### Workflow 1: Interactive Computing on a Shared Ray Cluster

Use this workflow to run notebook cells on the shared Ray cluster while you explore and iterate. The cluster is long-lived and shared, so you don't need to start or clean it up.

#### Step 1: Find a Ray Cluster

If your administrator didn't give you a cluster name, list the shared clusters in your namespace. Temporary clusters created by `RayJob`s are filtered out:

```python
from python_client import kuberay_cluster_api

items = kuberay_cluster_api.RayClusterApi().list_ray_clusters(k8s_namespace=NAMESPACE).get("items", [])
clusters = [
    c["metadata"]["name"]
    for c in items
    if not any(o.get("kind") == "RayJob" for o in c["metadata"].get("ownerReferences", []))
]
print(f"Shared Ray clusters: {clusters}")
```

#### Step 2: Connect

Connect with Ray Client:

```python
import ray

CLUSTER_NAME = clusters[0]  # or the name your administrator gave you

ray.init(f"ray://{CLUSTER_NAME}-head-svc.{NAMESPACE}.svc.cluster.local:10001")
print(ray.cluster_resources())
```

`ray.cluster_resources()` shows the total CPUs, GPUs, and memory available. If the cluster autoscales, this number grows as you submit work.

#### Step 3: Run Distributed Code

Decorate a function with `@ray.remote` to run it on the cluster instead of in your workspace:

```python
@ray.remote
def square(x: int) -> int:
    return x * x


futures = [square.remote(i) for i in range(10)]  # dispatched in parallel, returns immediately
print(ray.get(futures))                          # waits for and collects the results
```

When you're done, disconnect. This only ends your session; the shared cluster keeps running for others:

```python
ray.shutdown()
```

---

### Workflow 2: On-Demand Jobs with `RayJob`

Use this workflow for batch processing, training, or sweeps that need dedicated compute. KubeRay starts a Ray cluster just for your job, runs it, and **removes the cluster automatically** when the job finishes.

The workflow has four steps: request the cluster, wait for it to be ready, submit your code, and follow the logs.

#### Step 1: Request a Ray Cluster for Your Job

The helper below describes the cluster your job needs and submits the request. Copy it as-is and adjust the parameters described below the code. It automatically uses the same Ray and Python versions as your workspace, so the two are always compatible.

```python
import sys
import uuid

import ray
from python_client import kuberay_job_api
from python_client.utils.kuberay_cluster_builder import ClusterBuilder


def create_ray_job_spec(
    job_name: str,
    namespace: str,
    num_workers: int = 1,
    worker_cpu: str = "1",
    worker_memory: str = "2G",
    head_cpu: str = "1",
    head_memory: str = "2G",
    max_runtime_seconds: int = 3600,
) -> dict:
    """Describe a RayJob whose cluster matches this workspace's Ray and Python versions."""
    ray_version = ray.__version__
    ray_image = f"rayproject/ray:{ray_version}-py{sys.version_info.major}{sys.version_info.minor}"

    cluster_spec = (
        ClusterBuilder()
        .build_meta(name=job_name, k8s_namespace=namespace, ray_version=ray_version)
        .build_head(
            ray_image=ray_image,
            cpu_requests=head_cpu, cpu_limits=head_cpu,
            memory_requests=head_memory, memory_limits=head_memory,
        )
        .build_worker(
            group_name="worker-group",
            ray_image=ray_image,
            replicas=num_workers,
            cpu_requests=worker_cpu, cpu_limits=worker_cpu,
            memory_requests=worker_memory, memory_limits=worker_memory,
        )
        .get_cluster()["spec"]
    )

    # Required on Kubeflow: with an Istio sidecar, the Ray cluster never becomes ready
    istio_label = {"sidecar.istio.io/inject": "false"}
    cluster_spec["headGroupSpec"]["template"].setdefault("metadata", {})["labels"] = istio_label
    for group in cluster_spec["workerGroupSpecs"]:
        group["template"].setdefault("metadata", {})["labels"] = istio_label

    return {
        "apiVersion": "ray.io/v1",
        "kind": "RayJob",
        "metadata": {"name": job_name, "namespace": namespace},
        "spec": {
            "submissionMode": "InteractiveMode",           # you submit the code from this notebook
            "shutdownAfterJobFinishes": True,              # delete the cluster when the job ends
            "ttlSecondsAfterFinished": 300,                # remove the finished RayJob after 5 minutes
            "activeDeadlineSeconds": max_runtime_seconds,  # hard time limit for the whole job
            "rayClusterSpec": cluster_spec,
        },
    }


JOB_NAME = f"my-rayjob-{uuid.uuid4().hex[:6]}"  # unique name per run

job_api = kuberay_job_api.RayjobApi()
job_api.submit_job(
    k8s_namespace=NAMESPACE,
    job=create_ray_job_spec(job_name=JOB_NAME, namespace=NAMESPACE, num_workers=2),
)
print(f"Requested Ray cluster for job '{JOB_NAME}'.")
```

The parameters you can adjust:

- `num_workers`: Number of Ray worker nodes, in addition to the head node.
- `worker_cpu`, `worker_memory`: Resources for each worker node. Your code runs mostly on the workers, so size these for your workload.
- `head_cpu`, `head_memory`: Resources for the head node, which coordinates the cluster and runs your entrypoint script. The defaults are usually enough; increase memory if your entrypoint loads large data itself.
- `max_runtime_seconds`: A time limit for the whole job. It counts from this request, so it includes cluster startup as well as your code's run time. When it runs out, KubeRay stops the job and deletes its cluster, even if your code is still running. This keeps a forgotten or stuck job from holding compute indefinitely. Set it comfortably above your expected run time (the default is 1 hour).

#### Step 2: Wait Until the Cluster Is Ready

Starting the cluster typically takes one to a few minutes. This helper waits until the cluster's Ray Dashboard (the endpoint that accepts job submissions) responds, then returns its URL:

```python
import time

import requests


def wait_for_ray_dashboard(job_name: str, namespace: str, timeout_seconds: int = 300) -> str:
    """Wait until the job's Ray cluster accepts submissions and return its dashboard URL."""
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        status = job_api.get_job_status(
            name=job_name, k8s_namespace=namespace, timeout=5, delay_between_attempts=1
        ) or {}
        if host := status.get("dashboardURL"):
            url = f"http://{host}"
            try:
                if requests.get(f"{url}/api/version", timeout=5).ok:
                    print(f"Ray cluster is ready: {url}")
                    return url
            except requests.RequestException:
                pass
        time.sleep(5)
    raise TimeoutError(f"Ray cluster for '{job_name}' was not ready within {timeout_seconds}s.")


dashboard_url = wait_for_ray_dashboard(JOB_NAME, NAMESPACE)
```

If this times out, the cluster may lack free capacity for the resources you requested. Try fewer or smaller workers, or ask your administrator.

#### Step 3: Submit Your Code

Submit your project to the cluster. Ray uploads the `working_dir` folder from your workspace and installs the listed `pip` packages on every node before running `entrypoint`:

```python
from ray.job_submission import JobSubmissionClient

client = JobSubmissionClient(dashboard_url)
job_id = client.submit_job(
    entrypoint="python train.py",          # command to run, relative to working_dir
    runtime_env={
        "working_dir": "./my_project",     # local folder with your scripts
        "pip": ["torch", "transformers"],  # extra packages your code needs
    },
)

# Link the submission to the RayJob so the cluster is removed when this job finishes
job_api.api.patch_namespaced_custom_object(
    group="ray.io", version="v1", plural="rayjobs",
    namespace=NAMESPACE, name=JOB_NAME,
    body={"spec": {"jobId": job_id}},
)
print(f"Submitted job {job_id}")
```

{{% alert title="Don't skip the last call" color="warning" %}}
Linking the `job_id` to the `RayJob` is what triggers automatic cleanup. Without it, the cluster stays up until `max_runtime_seconds` expires.
{{% /alert %}}

#### Step 4: Follow the Logs

Stream the job's output into your notebook until it finishes:

```python
async for lines in client.tail_job_logs(job_id):
    print(lines, end="")

print(f"\nJob finished with status: {client.get_job_status(job_id)}")
```

When the job finishes, KubeRay removes its Ray cluster automatically. You don't need to clean anything up.

#### Cancelling a Job

To stop a running job early, run `client.stop_job(job_id)`. Its cluster is then removed automatically.

If you requested a cluster but don't plan to submit code to it, delete the request to free its resources:

```python
job_api.delete_job(name=JOB_NAME, k8s_namespace=NAMESPACE)
```

---

### Troubleshooting

| Symptom | Likely cause and fix |
| :--- | :--- |
| `ray.init()` fails with a version mismatch error | Your workspace's Ray or Python version differs from the cluster's. Install the Ray version your administrator specified, then restart the kernel. |
| `403 Forbidden` from the KubeRay client | Your workspace lacks Ray permissions. Ask your administrator to complete the [administrator setup](#step-2-grant-workspaces-permission-to-use-ray). |
| `wait_for_ray_dashboard` times out | Not enough free capacity for the requested resources. Request fewer or smaller workers, or contact your administrator. |
| The job fails with `ModuleNotFoundError` | Add the missing package to `pip` in `runtime_env`. |

## Next Steps

- Learn more about the [KubeRay Operator and CRDs](https://ray-project.github.io/kuberay/).
- Explore the [Ray Job Submission documentation](https://docs.ray.io/en/latest/cluster/running-applications/job-submission/index.html).
- Explore Ray's distributed training, tuning, and serving libraries in the [Ray documentation](https://docs.ray.io/).
- Read the [Kubeflow Workspaces Overview](/docs/components/workspaces/overview/).
