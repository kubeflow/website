+++
title = "Migrating to Kubeflow Trainer V2"
description = "How to migrate to the new Kubeflow Trainer V2."
weight = 20
+++

## Overview

Kubeflow Trainer is a significant update to the Kubeflow Training Operator project.

The key features introduced by Kubeflow Trainer are:

- The new CRDs: TrainJob, TrainingRuntime, and ClusterTrainingRuntime APIs. These APIs enable the
  creation of templates for distributed model training and LLM fine-tuning. It abstracts the
  Kubernetes complexities, providing more intuitive experience for data scientists and ML engineers.

- The Kubeflow Python SDK: to further enhance ML user experience and to provide seamless integration
  with Kubeflow Trainer APIs.

- Custom dataset and model initializer: to streamline assets initialization across distributed
  training nodes and to reduce GPU cost by offloading I/O tasks to CPU workloads.

- Enhanced MPI support: featuring MPI-Operator V2 features with SSH-based optimization to boost
  MPI performance.

## Migration Paths

TODO (andreyvelich): Add docs for migration.
