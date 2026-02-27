+++
title = "Flux Guide"
description = "How to run Flux with Kubeflow Trainer for AI/ML HPC Simulation"
weight = 30
+++

This guide describes how to use TrainJob to train or fine-tune AI models with a [Flux Framework](https://flux-framework.org) High Performance Computing (HPC) cluster. 

## Prerequisites

Before exploring this guide, make sure to read [the Getting Started guide](/docs/components/trainer/getting-started/)
to learn the basics of Kubeflow Trainer.

## Flux Framework Overview

As AI/ML workloads grow in scale and complexity, they often intersect with the needs of traditional High Performance Computing, which can include topology-aware scheduling, high throughput, and using the low latency Message Passing Interface (MPI). 

To support these workloads, Kubeflow can be deployed with Flux, an HPC workload manager that offers several important features: 

*   **Robust MPI Bootstrapping:** Flux uses a tree-based overlay network combined with native bootstrapping that works across MPI variants. Bootstrap over SSH requiring a client and server, shared keys, consistent user IDs, and complicated permissions, is not required. 
*   **Topology Awareness:** Flux supports workloads that require fine-grained, topology-aware placement for both GPUs and CPUs.
*   **Scheduling Features:** Flux is built with support for custom job queues, graph-based scheduling for complex workflows, and scheduling policies. 
*   **Throughput**: Kubernetes is limited by API interactions, and etcd performance. Throughput in standard Kubernetes clusters can range between 10-100 Pods per second, and it can be much higher for HPC workload managers, especially Flux. In Flux, high throughput is enabled via submitting jobs to a hierarchy of Flux instances. 

The integration of Flux Framework with Kubeflow provides these features, and offers a solution for demanding distributed jobs that require features from High Performance Computing.
demanding distributed jobs. The Kubeflow Trainer can be deployed with a Flux Policy to execute workloads that use MPI with or without GPUs.

## Flux Policy Example: LAMMPS

This example demonstrates how to use the **Flux Framework** policy for the Kubeflow Trainer to run distributed HPC workloads. Flux is a next-generation high-performance computing (HPC) scheduler that provides sophisticated resource management in Kubernetes. For more about Flux and its context for Kubeflow Trainer, see [KEP-2841](https://github.com/kubeflow/trainer/tree/master/docs/proposals/2841-flux-hpc).

The Flux plugin automatically handles:
- Cluster discovery and broker configuration.
- Shared encryption (CURVE certificate) generation.
- Flux installation via an init-container.
- Automatic wrapping of your training command.

The example here will show you how to run the [LAMMPS](https://www.lammps.org/) Molecular Dynamic Simulator.  The design here emulates the [Flux Operator](https://flux-framework.org/flux-operator/), and you can learn more about Flux Framework and associated projects [here](https://flux-framework.org/). Do you have a question?
We are part of the High Performance Software Foundation ([HPSF](https://hpsf.io/)) and we hope that you reach out to us with questions or feature requests (The GitHub [flux-framework](https://github.com/flux-framework/) organization works well).

### Prerequisites

1. **Kubeflow Trainer** installed in your cluster.
2. **JobSet** operator installed (dependency of the Trainer).

## Quick Start

You'll need to first install the Kubeflow Trainer.
Apply the directory containing the `ClusterTrainingRuntime` and the `TrainJob`:

```bash
kubectl apply -f examples/flux
```

### 1. Monitor the Job

Watch for the pods to be created. You will see a replicated job named `node`.

```bash
kubectl get pods -w
```

### 2. Check Logs

You'll see the InitContainer, and then PodInitializing is usually a container pulling.
To see the Flux broker initialization and the output of the LAMMPS job, check the logs of the lead broker (pod index `0-0`):

```bash
kubectl logs lammps-flux-interactive-node-0-0-tsqbp -c node -f
```

## Interactive Mode

A cool feature of the Flux plugin is the ability to launch an interactive HPC cluster for debugging or manual job submission.

### Switch to Interactive Mode

To use interactive mode, edit `lammps-train-job.yaml` and **comment out or remove** the `command` field under `spec.trainer`. When no command is provided, the Flux broker will start an interactive session you can shell into, just like a traditional HPC cluster.

### Using the Flux Shell

Once the pods are running in interactive mode, shell into the lead broker pod:

```bash
kubectl exec -it lammps-flux-interactive-node-0-0 -- bash
```

Once inside the container, follow these steps to interact with your cluster:

```bash
# 1. Source the environment to put Flux and software in your PATH
. /mnt/flux/flux-view.sh

# 2. Connect to the running lead broker socket
flux proxy $fluxsocket bash

# 3. Verify that Flux sees all 4 nodes (physical pods)
flux resource list

# 4. Manually run LAMMPS across the cluster
flux run -N 4 -n 4 lmp -v x 2 -v y 2 -v z 2 -in in.reaxc.hns -nocite
```

For the above, the `WORKDIR` has the LAMMPS input file `in.reaxc.hns`.

## Configuration Details

- **Runtime Configuration**: The `flux-runtime.yaml` defines the base blueprint. Note that the `flux: {}` policy trigger must be present for the plugin to activate.
- **Environment Variables**: You can customize the Flux setup by adding `env` variables to the `TrainJob` spec (e.g., `FLUX_VIEW_IMAGE` to change the base OS or `FLUX_NETWORK_DEVICE` to specify the interface).
- **Volumes**: Binaries are installed to `/mnt/flux`, software is copied to `/opt/software`, and configurations are stored in `/etc/flux-config`.

For environment variables, we currently support a small set:

- FLUX_VIEW_IMAGE: The flux view base image, which defaults to `ghcr.io/converged-computing/flux-view-ubuntu:tag-jammy`
- FLUX_NETWORK_DEVICE: The network device for the Flux overlay network only (not necessarily your application). Defaults to `eth0`
- FLUX_QUEUE_POLICY: The queue policy. Defaults to `fcfs` (first come, first serve)

This can be easily expanded. [Let us know](https://github.com/flux-framework).
For the view, you primarily want it to make the base container platform, OS and version. We currently also provide:

- ghcr.io/converged-computing/flux-view-rocky:arm-9
- ghcr.io/converged-computing/flux-view-rocky:arm-8
- ghcr.io/converged-computing/flux-view-rocky:tag-9
- ghcr.io/converged-computing/flux-view-rocky:tag-8
- ghcr.io/converged-computing/flux-view-ubuntu:tag-noble
- ghcr.io/converged-computing/flux-view-ubuntu:tag-jammy
- ghcr.io/converged-computing/flux-view-ubuntu:tag-focal
- ghcr.io/converged-computing/flux-view-ubuntu:arm-jammy
- ghcr.io/converged-computing/flux-view-ubuntu:arm-focal

A GPU example will be added soon. Thanks for stopping by!

## Next Steps

- Check out [the Flux Operator](https://github.com/flux-framework/flux-operator).
- Learn more about [Flux Framework APIs](https://flux-framework.org).