---
title: Integrating with Kubeflow Trainer
description: Start interactive MPI TrainJobs and run mpirun on them from Kubeflow Workspaces
weight: 20
---

{{< workspaces-beta-notice >}}

This guide shows how to create and use distributed compute from a **Kubeflow
Workspace** via [Kubeflow Trainer](/docs/components/trainer/overview/), by
using an interactive MPI `TrainJob` as an example workload.

## Overview

A regular `TrainJob` runs one command and finishes. An **interactive**
`TrainJob` instead starts a set of MPI nodes that do nothing but wait (`sleep
infinity`). The nodes stay connected to each other over SSH, so you can run
`mpirun` against them as often as you like while you develop, and delete the
job when you are done.

The Workspace reaches the job with `kubectl exec`: it opens a shell command in
the job's **launcher** Pod, and `mpirun` fans out from there to all nodes. This
works because each Workspace runs as its own `ServiceAccount`, which the
`WorkspaceKind` can grant permissions to.

The setup is split between two roles:

| Role | Responsibilities |
| :--- | :--- |
| **[Cluster administrator](#for-cluster-administrators)** | Create the MPI runtime and grant Workspaces permission to manage `TrainJobs` and exec into Pods. Done once per cluster. |
| **[Workspace user](#for-workspace-users)** | Create an interactive `TrainJob` from the Workspace, run `mpirun` on it, and delete it afterwards. |

---

## For Cluster Administrators

After the steps in this section, every Workspace created from the configured
`WorkspaceKind` can start interactive MPI jobs in its own namespace with no
further per-user setup.

### Prerequisites

- Kubeflow Workspaces is installed, see the [Deployment
  Guide](/docs/components/workspaces/operator-guides/deployment-guide/).
- Kubeflow Trainer is installed. It is part of the [Kubeflow Community
  Distribution](/docs/started/installing-kubeflow/), which also provides the
  `kubeflow-trainer-edit` `ClusterRole` used below but can also be installed
  standalone.

### Step 1: Create the MPI runtime

A `ClusterTrainingRuntime` is the blueprint that every `TrainJob` is created
from. The runtime below is based on the `deepspeed-distributed` runtime that
ships with Kubeflow Trainer and uses the same OpenMPI image. It defines two
kinds of Pods:

- `node` Pods run an SSH server and wait for work.
- one `launcher` Pod, started once all `node` Pods are ready. This is the Pod
  that users exec into. Because of `runLauncherAsNode: true` it also counts as
  one of the MPI nodes.

<details>

<summary>Click to see ClusterTrainingRuntime snippet</summary>

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: mpi-interactive
  labels:
    trainer.kubeflow.org/framework: mpi
spec:
  mlPolicy:
    numNodes: 1
    mpi:
      numProcPerNode: 1
      mpiImplementation: OpenMPI
      sshAuthMountPath: /home/mpiuser/.ssh
      runLauncherAsNode: true
  template:
    spec:
      network:
        publishNotReadyAddresses: true
      successPolicy:
        operator: All
        targetReplicatedJobs:
          - launcher
      replicatedJobs:
        - name: node
          template:
            spec:
              template:
                metadata:
                  labels:
                    # Required on Kubeflow, see "Things to keep in mind" below.
                    sidecar.istio.io/inject: "false"
                spec:
                  securityContext:
                    fsGroup: 1000
                  containers:
                    - name: node
                      image: ghcr.io/kubeflow/trainer/deepspeed-runtime:v2.3.0
                      securityContext:
                        runAsUser: 1000
                      command:
                        - /usr/sbin/sshd
                      args:
                        - -De
                        - -f
                        - /home/mpiuser/.sshd_config
                      readinessProbe:
                        tcpSocket:
                          port: 2222
                        initialDelaySeconds: 5
        - name: launcher
          dependsOn:
            - name: node
              status: Ready
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              template:
                metadata:
                  labels:
                    # Required on Kubeflow, see "Things to keep in mind" below.
                    sidecar.istio.io/inject: "false"
                spec:
                  securityContext:
                    fsGroup: 1000
                  containers:
                    - name: node
                      image: ghcr.io/kubeflow/trainer/deepspeed-runtime:v2.3.0
                      securityContext:
                        runAsUser: 1000
```

Use the image tag that matches your installed Kubeflow Trainer version. You can
read it from the runtimes that are already installed:

```bash
kubectl get clustertrainingruntime deepspeed-distributed \
  -o jsonpath='{.spec.template.spec.replicatedJobs[0].template.spec.template.spec.containers[0].image}'
```

</details>

### Step 2: Grant Workspaces permission to use the runtime

Each Workspace Pod runs as a dedicated `ServiceAccount` named
`ws-<workspace-name>`, and has no permissions by default. In order to work with
an interactive `TrainJob`, it needs to:

| Permission | Provided by |
| :--- | :--- |
| Create, read and delete `TrainJobs`; read Pods, Pod logs and events | `kubeflow-trainer-edit` |
| Run commands in Pods (`create` on `pods/exec`) | not part of any Trainer role, created below |

The only shipped roles that allow `pods/exec` are `kubeflow-kubernetes-edit`
and `kubeflow-edit`, which also grant access to Secrets and to creating and
deleting workloads. To keep the grant minimal, create a `ClusterRole` that only
allows `exec`:

```bash
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeflow-workspaces-pod-exec
rules:
  - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create"]
EOF
```

Then list both roles in `spec.podTemplate.serviceAccount.clusterRoles` of your
`WorkspaceKind` (for example, `jupyterlab`):

```bash
kubectl patch workspacekind jupyterlab --type=merge --patch '
spec:
  podTemplate:
    serviceAccount:
      clusterRoles:
        - name: kubeflow-trainer-edit
        - name: kubeflow-workspaces-pod-exec
'
```

{{% alert title="Warning" color="warning" %}}
A merge patch **replaces** the whole `clusterRoles` list. If the
`WorkspaceKind` already lists other roles, include them in the patch as well.
{{% /alert %}}

The Workspaces controller turns each entry into a `RoleBinding` in the
namespace of every Workspace of that kind. This means:

- The permissions only apply inside the Workspace's own namespace, even though
  the roles are `ClusterRoles`.
- Changes apply within seconds to running Workspaces. They do **not** need to
  be restarted.
- Removing an entry deletes the `RoleBinding` and revokes the permission again.

To verify the result for a Workspace named `my-workspace` in the namespace
`my-namespace`:

```bash
kubectl auth can-i create pods --subresource=exec \
  --namespace my-namespace \
  --as=system:serviceaccount:my-namespace:ws-my-workspace
```

### Things to keep in mind

- **Istio sidecars:** Kubeflow enables Istio sidecar injection in profile
  namespaces. With a sidecar, the SSH connections between the launcher and the
  nodes are closed (`kex_exchange_identification: Connection closed by remote
  host`) and `mpirun` fails. The MPI Pods must therefore carry the
  `sidecar.istio.io/inject: "false"` label, which the runtime above already
  sets. The `deepspeed-distributed` runtime that ships with Kubeflow Trainer
  does not set it.
- **Exec is namespace-wide:** Kubernetes RBAC cannot limit `pods/exec` to the
  Pods of a `TrainJob`. A Workspace with this permission can run commands in
  **every** Pod of its namespace, including the Workspaces of other users who
  share the same profile.
- **Idle jobs hold resources:** An interactive `TrainJob` runs until someone
  deletes it.

---

## For Workspace Users

Your administrator has already set up the permissions, so you can do everything
below from inside your Workspace: the Python parts in a notebook, the `kubectl`
parts in a terminal (in JupyterLab: **File ➔ New ➔ Terminal**). Both `kubectl`
and the Kubeflow SDK are preinstalled in the Kubeflow Workspace images and
automatically use your Workspace's namespace.

### Step 1: Create an interactive TrainJob

Create the job with the [Kubeflow SDK](https://github.com/kubeflow/sdk), which
is preinstalled in the Kubeflow Workspace images since `v1.11.0`. Run the
following in a notebook cell or a Python shell. It starts four MPI nodes from
the `mpi-interactive` runtime, keeps them waiting, and returns once the job is
running:

```python
from kubeflow.trainer import CustomTrainerContainer, TrainerClient
from kubeflow.trainer.options import Name, TrainerCommand

client = TrainerClient()

runtime = client.get_runtime("mpi-interactive")

job_name = client.train(
    runtime=runtime,
    trainer=CustomTrainerContainer(image=runtime.trainer.image, num_nodes=4),
    options=[
        Name("mpi-interactive"),
        TrainerCommand(["sleep", "infinity"]),
    ],
)

client.wait_for_job_status(job_name, status={"Running"}, timeout=600)
```

Three `node` Pods start first, the `launcher` follows once they are ready. The
first start can take a few minutes while the image is downloaded. You can
follow the Pods of the job from the terminal:

```bash
kubectl get pods -l jobset.sigs.k8s.io/jobset-name=mpi-interactive
```

All four Pods are `Running` when the job is ready:

```
NAME                                 READY   STATUS    RESTARTS   AGE
mpi-interactive-launcher-0-0-qppg9   1/1     Running   0          5s
mpi-interactive-node-0-0-w88m8       1/1     Running   0          18s
mpi-interactive-node-0-1-zgfbp       1/1     Running   0          18s
mpi-interactive-node-0-2-zs4wc       1/1     Running   0          18s
```

### Step 2: Run `mpirun`

Look up the launcher Pod and run `mpirun` in it. The example starts one Python
process per node and lets each one print its hostname and MPI rank:

```bash
LAUNCHER=$(kubectl get pods -o name \
  -l jobset.sigs.k8s.io/jobset-name=mpi-interactive,jobset.sigs.k8s.io/replicatedjob-name=launcher)

kubectl exec "$LAUNCHER" -- \
  mpirun python -c "from mpi4py import MPI; import socket; c = MPI.COMM_WORLD; print(f'host={socket.gethostname()} | RANK: {c.Get_rank()}')"
```

Every node answers with its own rank:

```
Warning: Permanently added '[mpi-interactive-node-0-2.mpi-interactive]:2222' (ECDSA) to the list of known hosts.
Warning: Permanently added '[mpi-interactive-node-0-1.mpi-interactive]:2222' (ECDSA) to the list of known hosts.
Warning: Permanently added '[mpi-interactive-node-0-0.mpi-interactive]:2222' (ECDSA) to the list of known hosts.
host=mpi-interactive-launcher-0-0 | RANK: 0
host=mpi-interactive-node-0-2 | RANK: 3
host=mpi-interactive-node-0-1 | RANK: 2
host=mpi-interactive-node-0-0 | RANK: 1
```

The job keeps running, so you can repeat this step with your own commands as
often as you like.

### Step 3: Clean up

The job holds its resources until you delete it:

```bash
kubectl delete trainjob mpi-interactive
kubectl wait --for=delete pod -l jobset.sigs.k8s.io/jobset-name=mpi-interactive --timeout=180s
```

alternatively you can also use the SDK:

```python
client.delete_job("mpi-interactive")
```

The second command waits until all Pods are gone. Do this before you create a new job with the
same name, see [Troubleshooting](#troubleshooting).

### Troubleshooting

| Symptom | Likely cause and fix |
| :--- | :--- |
| `cannot create resource "pods/exec"` or `cannot create resource "trainjobs"` | Your Workspace lacks the permissions. Ask your administrator to complete the [administrator setup](#step-2-grant-workspaces-permission-to-use-the-runtime). |
| `mpirun` fails with `kex_exchange_identification: Connection closed by remote host` | The MPI Pods run with an Istio sidecar. Ask your administrator to check the [runtime](#step-1-create-the-mpi-runtime). |
| `mpirun` fails with `Permission denied (publickey,password,keyboard-interactive)` | The job was created while the Pods of a deleted job with the same name were still shutting down, so some Pods use the old SSH key. Delete the job, wait until all its Pods are gone as shown in [Step 3](#step-3-clean-up), and create it again. |
| Pods stay `Pending` | The cluster has no free capacity for the job. Use fewer nodes or contact your administrator. |

## Next Steps

- Learn more about [Kubeflow Trainer](/docs/components/trainer/overview/).
- Read the [Kubeflow Workspaces Overview](/docs/components/workspaces/overview/).
