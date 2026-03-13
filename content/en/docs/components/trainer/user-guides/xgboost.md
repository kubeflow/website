+++
title = "XGBoost Guide"
description = "How to run XGBoost on Kubernetes with Kubeflow Trainer"
weight = 20
+++

This guide describes how to use TrainJob to run distributed
[XGBoost](https://xgboost.readthedocs.io/) training on Kubernetes.

## Prerequisites

Before exploring this guide, make sure to follow
[the Getting Started guide](/docs/components/trainer/getting-started/)
to understand the basics of Kubeflow Trainer.

---

## XGBoost Distributed Overview

XGBoost supports distributed training through the
[Collective](https://xgboost.readthedocs.io/en/latest/tutorials/kubernetes.html)
communication protocol (historically known as Rabit). In a distributed setting,
multiple worker processes each operate on a shard of the data and synchronize
histogram bin statistics via AllReduce to agree on the best tree splits.

Kubeflow Trainer integrates with XGBoost by:

- Deploying worker pods as a [JobSet](https://github.com/kubernetes-sigs/jobset).
- Automatically injecting the `DMLC_*` environment variables required by XGBoost's
  Collective communication layer (`DMLC_TRACKER_URI`, `DMLC_TRACKER_PORT`,
  `DMLC_TASK_ID`, `DMLC_NUM_WORKER`).
- Providing the rank-0 pod with the tracker address so user code can start a
  `RabitTracker` for worker coordination.
- Supporting both CPU and GPU training workloads.

The built-in runtime is called `xgboost-distributed` and uses the container image
`ghcr.io/kubeflow/trainer/xgboost-runtime:latest`, which includes XGBoost with
CUDA 12 support, NumPy, and scikit-learn.

### Worker Count

The total number of XGBoost workers is calculated as:

```text
DMLC_NUM_WORKER = numNodes × workersPerNode
```

- **CPU training**: 1 worker per node. Each worker uses OpenMP to parallelize
  across all available CPU cores.
- **GPU training**: 1 worker per GPU. The GPU count is derived from
  `resourcesPerNode` limits in the TrainJob.

---

## Further Information

For comprehensive documentation including complete training examples (Python SDK
and kubectl YAML), best practices (`QuantileDMatrix`, early stopping,
checkpointing, logging), and common issues, see the XGBoost documentation:

**[Distributed XGBoost on Kubernetes — XGBoost Tutorial](https://xgboost.readthedocs.io/en/latest/tutorials/kubernetes.html)**

You can also use the Kubeflow Trainer distributed XGBoost notebook example:

**[xgboost-distributed.ipynb](https://github.com/kubeflow/trainer/blob/master/examples/xgboost/distributed-training/xgboost-distributed.ipynb)**
