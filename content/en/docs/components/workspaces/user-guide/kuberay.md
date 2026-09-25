---
title: Integrating with KubeRay
description: Provision and interact with distributed Ray clusters from Kubeflow Workspaces
weight: 10
---

{{< workspaces-beta-notice >}}

This guide demonstrates how to integrate **Kubeflow Workspaces** with **Ray** using [KubeRay](https://ray-project.github.io/kuberay/).

Kubeflow Workspaces provides lightweight, interactive development environments (e.g. JupyterLab). When your workload requires distributed compute—such as multi-node data processing, hyperparameter tuning, or model training—you can dynamically provision and control an elastic Ray cluster directly from your notebook using Python, without leaving your workspace.

## Prerequisites

Before using Ray from your workspace, ensure the following are configured in your cluster:

1. **Install KubeRay Operator**: If KubeRay is not already installed on your cluster, follow the official [KubeRay Operator Installation Guide](https://docs.ray.io/en/latest/cluster/kubernetes/getting-started/kuberay-operator-installation.html) to deploy it (for example, using Helm).

2. **Configure Permissions on `WorkspaceKind`**:
   In Kubeflow Workspaces, each workspace pod runs under a dedicated Kubernetes `ServiceAccount` named `ws-<workspace-name>`. Rather than configuring role bindings manually per workspace, a cluster administrator configures the `WorkspaceKind` to automatically grant Ray permissions (such as `ray-edit`) to every workspace instance:

   ```yaml
   spec:
     podTemplate:
       serviceAccount:
         clusterRoles:
           - name: kubeflow-edit
           - name: ray-edit
   ```

   You can patch an existing `WorkspaceKind` (such as `jupyterlab`) with `kubectl`:

   ```bash
   kubectl patch workspacekind jupyterlab --type='merge' -p='{
     "spec": {
       "podTemplate": {
         "serviceAccount": {
           "clusterRoles": [
             {"name": "kubeflow-edit"},
             {"name": "ray-edit"}
           ]
         }
       }
     }
   }'
   ```

   {{% alert title="Defining the ray-edit ClusterRole" color="info" %}}
   If your cluster does not already have a `ray-edit` ClusterRole, a cluster administrator can create one:
   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: ray-edit
     labels:
       rbac.authorization.kubeflow.org/aggregate-to-kubeflow-edit: "true"
   rules:
     - apiGroups: ["ray.io"]
       resources: ["rayclusters", "rayclusters/status", "rayjobs", "rayjobs/status"]
       verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
     - apiGroups: [""]
       resources: ["pods", "pods/log", "services", "events"]
       verbs: ["get", "list", "watch"]
   ```
   {{% /alert %}}

With the `WorkspaceKind` configured, all workspaces created from it automatically receive the necessary role bindings out of the box, allowing you to manage Ray clusters directly from Python without any manual credential setup.

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

## 2. Provision an On-Demand Ray Cluster

Use the `Director().build_small_cluster` helper from the KubeRay Python SDK to build a `RayCluster` specification (1 head node and 1 worker node) and submit it to the Kubernetes API. Ensure the cluster container image is explicitly aligned with your workspace's Ray and Python versions:

```python
import os
import sys
import ray
from python_client import kuberay_cluster_api
from python_client.utils.kuberay_cluster_builder import Director

# 1. Automatically detect the tenant namespace from the workspace pod
with open("/var/run/secrets/kubernetes.io/serviceaccount/namespace") as f:
    tenant_namespace = f.read().strip()

cluster_name = "raycluster-sample"

# 2. Build a small RayCluster spec (1 head node, 1 worker node)
cluster_spec = Director().build_small_cluster(
    name=cluster_name,
    k8s_namespace=tenant_namespace,
)

# 3. Lock the container image to match the workspace Ray and Python versions
py_tag = f"py{sys.version_info.major}{sys.version_info.minor}"
ray_image = f"rayproject/ray:{ray.__version__}-{py_tag}"

cluster_spec["spec"]["rayVersion"] = ray.__version__
cluster_spec["spec"]["headGroupSpec"]["template"]["spec"]["containers"][0]["image"] = ray_image
for wg in cluster_spec["spec"]["workerGroupSpecs"]:
    wg["template"]["spec"]["containers"][0]["image"] = ray_image

# 4. If your cluster uses Istio, disable Istio sidecar injection on Ray pods
# so direct pod-to-pod gRPC communication between Ray nodes is not blocked
cluster_spec["spec"]["headGroupSpec"]["template"].setdefault("metadata", {})["labels"] = {
    "sidecar.istio.io/inject": "false",
}
for wg in cluster_spec["spec"]["workerGroupSpecs"]:
    wg["template"].setdefault("metadata", {})["labels"] = {
        "sidecar.istio.io/inject": "false",
    }

# 5. Create the Ray cluster and wait for readiness
cluster_api = kuberay_cluster_api.RayClusterApi()
print(f"Creating RayCluster '{cluster_name}' with image '{ray_image}' in namespace '{tenant_namespace}'...")
cluster_api.create_ray_cluster(body=cluster_spec, k8s_namespace=tenant_namespace)

cluster_api.wait_until_ray_cluster_running(
    name=cluster_name,
    k8s_namespace=tenant_namespace,
    timeout=300,
)
print(f"RayCluster '{cluster_name}' is running and ready!")
```

**Output:**
```
Creating RayCluster 'raycluster-sample' in namespace 'kubeflow-user'...
RayCluster 'raycluster-sample' is running and ready!
```

---

## 3. Interactive Computing with Ray Client

Connect your notebook session directly to the Ray cluster using Ray Client (`ray://...:10001`). The Ray head service is reachable using Kubernetes internal DNS:

```python
import ray

head_svc = f"{cluster_name}-head-svc.{tenant_namespace}.svc.cluster.local"
ray.init(f"ray://{head_svc}:10001")

print("Available cluster resources:", ray.cluster_resources())

# Define a distributed function
@ray.remote
def square(x: int) -> int:
    return x * x

# Run tasks in parallel across worker pods
futures = [square.remote(i) for i in range(10)]
results = ray.get(futures)
print("Distributed calculation results:", results)

# Disconnect the interactive session
ray.shutdown()
```

**Output:**
```
Available cluster resources: {'CPU': 3.0, 'memory': 4294967296.0, 'node:10.0.0.1': 1.0, ...}
Distributed calculation results: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

---

## 4. Discover Clusters and Submit Batch Jobs

You can discover existing Ray clusters in your namespace and submit background batch jobs using the Ray Jobs API (`http://...:8265`). Batch jobs continue running on the Ray cluster even if you close your notebook.

```python
import time
from python_client import kuberay_cluster_api
from ray.job_submission import JobSubmissionClient, JobStatus

# 1. Discover active Ray clusters in your namespace
cluster_api = kuberay_cluster_api.RayClusterApi()
clusters = cluster_api.list_ray_clusters(k8s_namespace=tenant_namespace).get("items", [])
if not clusters:
    raise RuntimeError(f"No Ray clusters found in namespace '{tenant_namespace}'")

target_cluster = clusters[0]["metadata"]["name"]
print(f"Discovered {len(clusters)} Ray cluster(s). Targeting: '{target_cluster}'")

# 2. Submit a batch job to the Ray head service (port 8265)
dashboard_uri = f"http://{target_cluster}-head-svc.{tenant_namespace}.svc.cluster.local:8265"
client = JobSubmissionClient(dashboard_uri)

job_id = client.submit_job(
    entrypoint="python -c 'import ray; ray.init(); print(\"Hello from Ray Job!\")'",
)
print(f"Submitted batch job: {job_id}")

# 3. Poll for completion
while True:
    status = client.get_job_status(job_id)
    if status in {JobStatus.SUCCEEDED, JobStatus.FAILED, JobStatus.STOPPED}:
        break
    time.sleep(2)

print(f"Job finished with status: {status}")
print("Job logs:\n", client.get_job_logs(job_id))
```

---

## 5. Accessing the Ray Dashboard (Optional)

The Ray head node provides a web dashboard on port `8265`. Because your workspace pod is running on the cluster network, you can access the dashboard in your browser through JupyterLab's proxy:

1. **Forward port 8265 inside your workspace pod** (via workspace terminal):
   ```bash
   kubectl port-forward svc/raycluster-sample-head-svc 8265:8265
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

## 6. Clean Up Compute Resources

When you have finished your work, delete the on-demand Ray cluster to free compute resources for other users:

```python
cluster_api.delete_ray_cluster(name=cluster_name, k8s_namespace=tenant_namespace)
print(f"RayCluster '{cluster_name}' deleted.")
```

Your Kubeflow Workspace pod remains running, preserving your code, files, and environment.

---

## Next Steps

- Learn more about the [KubeRay Operator and CRDs](https://ray-project.github.io/kuberay/).
- Explore distributed training, tune, and serving libraries in the [Ray Documentation](https://docs.ray.io/).
- Read the [Kubeflow Workspaces Overview](/docs/components/workspaces/overview/).
