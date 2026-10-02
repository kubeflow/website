---
title: Integrating with KubeRay
description: Run distributed Ray jobs and interact with Ray clusters from Kubeflow Workspaces
weight: 10
---

{{< workspaces-beta-notice >}}

This guide demonstrates how to integrate **Kubeflow Workspaces** with **Ray** using [KubeRay](https://ray-project.github.io/kuberay/).

Kubeflow Workspaces provides lightweight, interactive development environments (e.g. JupyterLab). When your workload requires distributed compute—such as multi-node data processing, hyperparameter tuning, or model training—you can scale out compute to Ray without leaving your workspace.

## Best Practices: Avoiding Orphaned Ray Clusters

{{% alert title="Important: Beware of Orphaned Ray Clusters" color="warning" %}}
When a `RayCluster` custom resource is created imperatively from a notebook (e.g. via `RayClusterApi().create_ray_cluster()`), Kubernetes treats it as an independent, long-lived resource. It has **no automatic lifecycle linkage** to your notebook session or workspace pod.

If a user forgets to explicitly call `delete_ray_cluster()`, closes their browser tab, shuts down or idles the workspace, or encounters a kernel crash, the underlying `RayCluster` (including its head pod and worker pods) remains running indefinitely. This leads to **orphaned Ray clusters** that continue consuming expensive compute resources (CPUs, memory, and GPUs).
{{% /alert %}}

To prevent resource waste and maintain cluster hygiene, follow these two recommended patterns:

1. **On-Demand Batch & Training Jobs &rarr; Use `RayJob`**:
   When you need an elastic Ray cluster to run a batch job, model training run, or distributed processing script, submit a **`RayJob`**. KubeRay automatically spins up the required Ray cluster, runs your code entrypoint, and automatically tears down the worker and head pods as soon as the job finishes (`shutdownAfterJobFinishes: true`). Furthermore, a TTL (`ttlSecondsAfterFinished`) automatically removes the completed `RayJob` custom resource.
2. **Interactive Development &rarr; Connect to an Existing `RayCluster`**:
   When developing interactively (e.g. executing cells step-by-step with `@ray.remote` in a Jupyter session), connect your workspace to an **existing, centrally managed `RayCluster`** using Ray Client (`ray.init("ray://...")`). Because the cluster lifecycle is managed outside the ephemeral notebook session (e.g. by a cluster administrator or shared team infrastructure), resource allocation is governed consistently without risking ad-hoc orphaned clusters.

---

## Prerequisites

Before using Ray from your workspace, ensure the following are configured in your cluster:

1. **Install KubeRay Operator**: If KubeRay is not already installed on your cluster, follow the official [KubeRay Operator Installation Guide](https://docs.ray.io/en/latest/cluster/kubernetes/getting-started/kuberay-operator-installation.html) to deploy it (for example, using Helm).

2. **Configure Least-Privilege Permissions on `WorkspaceKind`**:
   In Kubeflow Workspaces, each workspace pod runs under a dedicated Kubernetes `ServiceAccount` named `ws-<workspace-name>`. Rather than configuring role bindings manually per workspace, a cluster administrator configures the `WorkspaceKind` to automatically grant Ray permissions to every workspace instance.

   To guard against orphaned clusters, administrators should apply the principle of least privilege:
   - **Non-write permissions to `RayCluster`** (`get`, `list`, `watch`): Allows workspace pods to discover existing Ray clusters and connect to them, while preventing notebooks from provisioning unmanaged raw clusters.
   - **Write permissions to `RayJob`** (`get`, `list`, `watch`, `create`, `update`, `patch`, `delete`): Allows data scientists to self-service on-demand, self-cleaning batch jobs.

   {{% alert title="Defining the ray-job-edit ClusterRole" color="info" %}}
   A cluster administrator can create a ClusterRole (such as `ray-job-edit`) enforcing these permissions:
   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: ray-job-edit
     labels:
       rbac.authorization.kubeflow.org/aggregate-to-kubeflow-edit: "true"
   rules:
     # Read-only access to RayCluster prevents accidental orphaned clusters
     - apiGroups: ["ray.io"]
       resources: ["rayclusters", "rayclusters/status"]
       verbs: ["get", "list", "watch"]
     # Full access to RayJob enables self-cleaning on-demand workloads
     - apiGroups: ["ray.io"]
       resources: ["rayjobs", "rayjobs/status"]
       verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
     # Read access to pods, logs, services, and events for status checks
     - apiGroups: [""]
       resources: ["pods", "pods/log", "services", "events"]
       verbs: ["get", "list", "watch"]
   ```
   {{% /alert %}}

   The cluster administrator then configures the `WorkspaceKind` (such as `jupyterlab`) to bind this role:

   ```yaml
   spec:
     podTemplate:
       serviceAccount:
         clusterRoles:
           - name: kubeflow-edit
           - name: ray-job-edit
   ```

   You can patch an existing `WorkspaceKind` with `kubectl`:

   ```bash
   kubectl patch workspacekind jupyterlab --type='merge' -p='{
     "spec": {
       "podTemplate": {
         "serviceAccount": {
           "clusterRoles": [
             {"name": "kubeflow-edit"},
             {"name": "ray-job-edit"}
           ]
         }
       }
     }
   }'
   ```

With the `WorkspaceKind` configured, all workspaces created from it automatically receive the necessary role bindings out of the box, allowing you to interact with Ray directly from Python without manual credential setup.

---

## 1. Install Required Python Packages

Install the Ray SDK and the KubeRay Python client in your workspace. Pin the Ray version (for example, `2.58.0`) to match the container image used for the Ray cluster:

```bash
RAY_VERSION="2.58.0"

pip install "ray[default,client]==${RAY_VERSION}" \
  "git+https://github.com/ray-project/kuberay.git#subdirectory=clients/python-client"
```

{{% alert title="Version Matching" color="info" %}}
Ray Client requires matching Ray versions and Python minor versions between your workspace and the Ray cluster. If you install Ray inside an active Jupyter session, restart the kernel (**Kernel ➔ Restart Kernel**) to load runtime extensions.
{{% /alert %}}

---

## 2. Wrap Kubernetes Plumbing in Utility Functions

To keep your notebooks and ML scripts focused on machine learning rather than Kubernetes internals (such as service account namespaces, internal DNS endpoints, container image tags, Istio labels, and Custom Resource Definitions), save the following helper module as `kuberay_utils.py` in your workspace:

```python
# kuberay_utils.py
import sys
import time
import ray
from ray.job_submission import JobSubmissionClient, JobStatus
from python_client import kuberay_cluster_api, kuberay_job_api
from python_client.utils.kuberay_cluster_builder import Director


def get_current_namespace() -> str:
    """Detect the Kubernetes namespace of the current workspace pod."""
    with open("/var/run/secrets/kubernetes.io/serviceaccount/namespace") as f:
        return f.read().strip()


def list_ray_clusters() -> list[str]:
    """List active RayCluster names in the workspace namespace."""
    namespace = get_current_namespace()
    cluster_api = kuberay_cluster_api.RayClusterApi()
    items = cluster_api.list_ray_clusters(k8s_namespace=namespace).get("items", [])
    return [item["metadata"]["name"] for item in items]


def connect_to_ray_cluster(cluster_name: str | None = None):
    """Connect the current interactive Python session to an existing RayCluster."""
    namespace = get_current_namespace()
    if cluster_name is None:
        clusters = list_ray_clusters()
        if not clusters:
            raise RuntimeError(f"No Ray clusters found in namespace '{namespace}'")
        cluster_name = clusters[0]
        print(f"Discovered {len(clusters)} Ray cluster(s). Connecting to: '{cluster_name}'")

    head_svc = f"{cluster_name}-head-svc.{namespace}.svc.cluster.local"
    context = ray.init(f"ray://{head_svc}:10001", ignore_reinit_error=True)
    print("Available cluster resources:", ray.cluster_resources())
    return context


def _build_cluster_spec(
    cluster_name: str,
    namespace: str,
    num_workers: int = 1,
    cpus_per_worker: int = 1,
    memory_per_worker: str = "2Gi",
    gpus_per_worker: int = 0,
) -> dict:
    """Build a RayCluster spec matching the workspace Python and Ray versions."""
    cluster_spec = Director().build_small_cluster(
        name=cluster_name,
        k8s_namespace=namespace,
    )

    py_tag = f"py{sys.version_info.major}{sys.version_info.minor}"
    gpu_suffix = "-gpu" if gpus_per_worker > 0 else ""
    ray_image = f"rayproject/ray:{ray.__version__}-{py_tag}{gpu_suffix}"

    spec = cluster_spec["spec"]
    spec["rayVersion"] = ray.__version__
    spec["headGroupSpec"]["template"]["spec"]["containers"][0]["image"] = ray_image
    spec["headGroupSpec"]["template"].setdefault("metadata", {})["labels"] = {
        "sidecar.istio.io/inject": "false",
    }

    for wg in spec["workerGroupSpecs"]:
        wg["replicas"] = num_workers
        wg["minReplicas"] = num_workers
        wg["maxReplicas"] = num_workers
        wg["template"].setdefault("metadata", {})["labels"] = {
            "sidecar.istio.io/inject": "false",
        }
        container = wg["template"]["spec"]["containers"][0]
        container["image"] = ray_image
        resources = {"cpu": str(cpus_per_worker), "memory": memory_per_worker}
        if gpus_per_worker > 0:
            resources["nvidia.com/gpu"] = str(gpus_per_worker)
        container["resources"] = {"requests": resources.copy(), "limits": resources.copy()}

    return spec


def submit_ray_job(
    job_name: str,
    entrypoint: str,
    working_dir: str = ".",
    pip: list[str] | None = None,
    num_workers: int = 1,
    cpus_per_worker: int = 1,
    memory_per_worker: str = "2Gi",
    gpus_per_worker: int = 0,
    cluster_name: str | None = None,
    ttl_seconds_after_finished: int = 300,
    timeout: int = 600,
) -> str:
    """
    Submit a RayJob with local Python files (working_dir) and pip dependencies.

    If `cluster_name` is None, KubeRay provisions an ephemeral RayCluster and
    automatically tears it down once the job finishes.
    """
    namespace = get_current_namespace()
    job_api = kuberay_job_api.RayjobApi()

    job_spec = {
        "apiVersion": "ray.io/v1",
        "kind": "RayJob",
        "metadata": {
            "name": job_name,
            "namespace": namespace,
        },
        "spec": {
            "submissionMode": "InteractiveMode",
            "preRunningDeadlineSeconds": timeout,
        },
    }

    if cluster_name is None:
        job_spec["spec"]["shutdownAfterJobFinishes"] = True
        job_spec["spec"]["ttlSecondsAfterFinished"] = ttl_seconds_after_finished
        job_spec["spec"]["rayClusterSpec"] = _build_cluster_spec(
            cluster_name=f"{job_name}-cluster",
            namespace=namespace,
            num_workers=num_workers,
            cpus_per_worker=cpus_per_worker,
            memory_per_worker=memory_per_worker,
            gpus_per_worker=gpus_per_worker,
        )
    else:
        job_spec["spec"]["clusterSelector"] = {"ray.io/cluster": cluster_name}

    print(f"Creating RayJob '{job_name}' in namespace '{namespace}'...")
    job_api.submit_job(k8s_namespace=namespace, job=job_spec)

    # Wait for KubeRay to provision the cluster and reach the 'Waiting' state
    print("Waiting for Ray cluster to be ready...")
    deadline = time.time() + timeout
    active_cluster = None
    while time.time() < deadline:
        status = job_api.get_job_status(name=job_name, k8s_namespace=namespace) or {}
        deployment_status = status.get("jobDeploymentStatus")
        if deployment_status == "Waiting" and status.get("rayClusterName"):
            active_cluster = status["rayClusterName"]
            break
        if deployment_status == "Failed":
            raise RuntimeError(f"RayJob '{job_name}' failed during cluster setup: {status}")
        time.sleep(5)

    if not active_cluster:
        raise TimeoutError(f"Timed out waiting for RayJob '{job_name}' cluster to be ready.")

    # Upload working_dir and pip dependencies using the Ray Job Submission client
    dashboard_url = f"http://{active_cluster}-head-svc.{namespace}.svc.cluster.local:8265"
    job_client = JobSubmissionClient(dashboard_url)

    runtime_env = {"working_dir": working_dir}
    if pip:
        runtime_env["pip"] = pip

    print(f"Uploading '{working_dir}' and submitting entrypoint: '{entrypoint}'...")
    ray_job_id = job_client.submit_job(entrypoint=entrypoint, runtime_env=runtime_env)

    # Bind the submitted Ray job ID back to the RayJob CR so KubeRay manages teardown
    job_api.api.patch_namespaced_custom_object(
        group="ray.io",
        version="v1",
        namespace=namespace,
        plural="rayjobs",
        name=job_name,
        body={"spec": {"jobId": ray_job_id}},
    )

    # Wait for the Ray job to finish and fetch logs before cluster teardown
    print(f"Waiting for job '{ray_job_id}' to complete...")
    while time.time() < deadline:
        ray_status = job_client.get_job_status(ray_job_id)
        if ray_status in {JobStatus.SUCCEEDED, JobStatus.FAILED, JobStatus.STOPPED}:
            break
        time.sleep(5)

    print("\n--- Job Logs ---")
    print(job_client.get_job_logs(ray_job_id).rstrip())
    print("----------------\n")

    job_api.wait_until_job_finished(
        name=job_name,
        k8s_namespace=namespace,
        timeout=max(30, int(deadline - time.time())),
        delay_between_attempts=5,
    )
    final_status = job_api.get_job_status(name=job_name, k8s_namespace=namespace) or {}
    print(f"Job Status: {final_status.get('jobStatus')}")
    print(f"Deployment Status: {final_status.get('jobDeploymentStatus')}")
    return ray_job_id
```

---

## 3. Interactive Computing with an Existing RayCluster

When developing models or exploring data interactively, use `connect_to_ray_cluster()` from `kuberay_utils` to connect your notebook session to an existing, shared Ray cluster:

```python
import ray
from kuberay_utils import connect_to_ray_cluster

# Automatically discovers and connects to the shared RayCluster in your namespace
connect_to_ray_cluster()

# Define a distributed function
@ray.remote
def square(x: int) -> int:
    return x * x

# Run tasks in parallel across worker pods
futures = [square.remote(i) for i in range(10)]
results = ray.get(futures)
print("Distributed calculation results:", results)

# Disconnect the interactive session when finished
ray.shutdown()
```

**Output:**
```
Discovered 1 Ray cluster(s). Connecting to: 'shared-raycluster'
Available cluster resources: {'CPU': 4.0, 'memory': 8589934592.0, 'node:10.0.0.1': 1.0, ...}
Distributed calculation results: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### Accessing the Ray Dashboard (Optional)

The Ray head node provides a web dashboard on port `8265`. Because your workspace pod is running on the cluster network, you can access the dashboard in your browser through JupyterLab's proxy:

1. **Forward port 8265 inside your workspace pod** (via workspace terminal):
   ```bash
   kubectl port-forward svc/<cluster-name>-head-svc 8265:8265
   ```
2. **Access the dashboard** in your browser:
   ```
   https://<kubeflow-endpoint>/workspace/connect/<tenant-namespace>/<workspace-name>/jupyterlab/proxy/8265/
   ```
   Or display it directly inside a notebook cell:
   ```python
   import os
   from IPython.display import IFrame

   nb_prefix = os.environ.get("NB_PREFIX", "/").rstrip("/") + "/"
   IFrame(src=f"{nb_prefix}proxy/8265/", width="100%", height=600)
   ```

---

## 4. Submitting On-Demand Distributed Jobs with `RayJob`

For batch jobs, model training pipelines, or hyperparameter sweeps that require dedicated compute, submitting a `RayJob` is the recommended approach.

With `submit_ray_job()`, KubeRay and Ray handle the entire lifecycle behind the scenes:
- **Multi-file packaging & dependencies**: Automatically uploads your local `working_dir` (including all Python modules) and installs extra `pip` packages across all worker nodes.
- **Automatic provisioning & teardown**: Spawns an ephemeral `RayCluster` tailored to your CPU/GPU/memory requests and automatically deletes the head and worker pods as soon as the job finishes (`shutdownAfterJobFinishes: True`).
- **Resource cleanup**: Automatically removes the completed `RayJob` resource after `ttl_seconds_after_finished`.

### Step 1: Create a Multi-File Ray Project

In realistic ML workflows, your job logic spans multiple Python modules and relies on third-party packages that may not be pre-installed in the base Ray image.

Create a project directory `my_ray_job/` containing two files:
- `data_utils.py`: Generates synthetic classification data and evaluates a model split using `scikit-learn`.
- `train.py`: Imports `data_utils`, launches parallel hyperparameter evaluations across Ray workers, and formats the results using `tabulate`.

```python
from pathlib import Path

job_dir = Path("my_ray_job")
job_dir.mkdir(exist_ok=True)

# 1. Helper module: my_ray_job/data_utils.py
(job_dir / "data_utils.py").write_text("""\
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


def evaluate_hyperparams(n_estimators: int, max_depth: int, seed: int = 42) -> dict:
    X, y = make_classification(
        n_samples=2000,
        n_features=20,
        n_informative=12,
        random_state=seed,
    )
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=seed
    )
    clf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=seed,
    )
    clf.fit(X_train, y_train)
    acc = accuracy_score(y_test, clf.predict(X_test))
    return {
        "n_estimators": n_estimators,
        "max_depth": max_depth,
        "accuracy": round(float(acc), 4),
    }
""")

# 2. Entrypoint script: my_ray_job/train.py
(job_dir / "train.py").write_text("""\
import ray
from tabulate import tabulate
from data_utils import evaluate_hyperparams


@ray.remote
def run_trial(n_estimators: int, max_depth: int) -> dict:
    return evaluate_hyperparams(n_estimators=n_estimators, max_depth=max_depth)


def main():
    ray.init()
    search_space = [
        (50, 4),
        (100, 6),
        (150, 8),
        (200, 12),
    ]
    futures = [run_trial.remote(n_est, depth) for n_est, depth in search_space]
    results = sorted(ray.get(futures), key=lambda r: r["accuracy"], reverse=True)

    print("Hyperparameter Sweep Results:")
    print(tabulate(results, headers="keys", tablefmt="github"))


if __name__ == "__main__":
    main()
""")
```

### Step 2: Submit the Job to an On-Demand Ray Cluster

Use `submit_ray_job()` to provision an ephemeral Ray cluster, upload the `./my_ray_job` directory, install `scikit-learn` and `tabulate` at runtime, and run `train.py`:

```python
from kuberay_utils import submit_ray_job

submit_ray_job(
    job_name="rf-hyperparam-sweep",
    entrypoint="python train.py",
    working_dir="./my_ray_job",
    pip=[
        "scikit-learn==1.5.2",
        "tabulate==0.9.0",
    ],
    num_workers=2,
    cpus_per_worker=2,
    memory_per_worker="4Gi",
)
```

**Output:**
```
Creating RayJob 'rf-hyperparam-sweep' in namespace 'kubeflow-user'...
Waiting for Ray cluster to be ready...
Uploading './my_ray_job' and submitting entrypoint: 'python train.py'...
Waiting for job 'raysubmit_8fKp2Lm9xQvW4nRt' to complete...

--- Job Logs ---
Hyperparameter Sweep Results:
|   n_estimators |   max_depth |   accuracy |
|----------------|-------------|------------|
|            200 |          12 |     0.9160 |
|            150 |           8 |     0.9040 |
|            100 |           6 |     0.8820 |
|             50 |           4 |     0.8460 |
----------------

Job Status: SUCCEEDED
Deployment Status: Complete
```

Because `shutdownAfterJobFinishes` is enabled automatically by `submit_ray_job()`, KubeRay terminates the head and worker pods upon job completion, returning all compute resources to the cluster and eliminating the risk of orphaned clusters.

### Submitting Batch Jobs to an Existing Cluster (Alternative)

If you already have a shared or long-running Ray cluster and want to submit your multi-file job to it without spinning up new compute nodes, pass `cluster_name` to `submit_ray_job()`:

```python
from kuberay_utils import submit_ray_job

submit_ray_job(
    job_name="rf-sweep-existing-cluster",
    entrypoint="python train.py",
    working_dir="./my_ray_job",
    pip=["scikit-learn==1.5.2", "tabulate==0.9.0"],
    cluster_name="shared-raycluster",
)
```

---

## Summary of Patterns

| Pattern | Best For | Cluster Lifecycle | Resource Cleanup | Permissions Required |
| :--- | :--- | :--- | :--- | :--- |
| **Interactive Computing** | Rapid prototyping, exploratory analysis, REPL cells | Long-lived / shared, managed by administrator | External to notebook | Read-only (`get`, `list`, `watch` on `rayclusters`) |
| **On-Demand `RayJob`** | Batch training, hyperparameter tuning, scheduled jobs | Ephemeral, provisioned per job | **Automatic** (`shutdownAfterJobFinishes: true`) | Write (`create`, `delete`, etc. on `rayjobs`) |
| **Ad-hoc `RayCluster`** *(Discouraged)* | Ad-hoc testing | Ephemeral, manually controlled | **Manual** (risk of orphaned clusters if uncleaned) | Write on `rayclusters` |

---

## Next Steps

- Learn more about the [KubeRay Operator and CRDs](https://ray-project.github.io/kuberay/).
- Explore the [Ray Job Submission Documentation](https://docs.ray.io/en/latest/cluster/running-applications/job-submission/index.html).
- Explore distributed training, tune, and serving libraries in the [Ray Documentation](https://docs.ray.io/).
- Read the [Kubeflow Workspaces Overview](/docs/components/workspaces/overview/).

