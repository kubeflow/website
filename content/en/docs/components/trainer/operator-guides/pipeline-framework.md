+++
title = "Trainer Pipeline Framework"
description = "How to install Kubeflow Trainer control plane"
weight = 30
+++

This guide describes `Trainer Pipeline Framework` core concepts, including the startup phase, pre-execution phase, build phase, and post-execution phase for user.

## Overview

The **Kubeflow Trainer Pipeline Framework** is designed as an internal mechanism that allows for flexible expansion and integration of various **Runtimes** and **TrainJobs** in the Kubeflow ecosystem. The framework provides a streamlined approach for building, managing, and executing the training lifecycle on Kubernetes. It consists of four distinct phases: **Startup Phase**, **PreExecution Phase**, **Build Phase**, and **PostExecution Phase**. Each phase has specific actions that help automate and optimize the training process.

<img src="/docs/components/trainer/operator-guides/images/TrainerPipelineFrameworkOverview.drawio.svg"
  alt="Trainer Pipeline Framework Overview"
  class="mt-3 mb-3">

## Core Concepts

### Phases

The Kubeflow TrainerPipelineFramework follows a structured, step-by-step execution flow. Each phase represents a logical part of the workflow:

- **Startup Phase**: Executes once during the initialization of the `kubeflow-trainer-controller-manager`. This phase sets up necessary internal components.
- **PreExecution Phase**: Triggered when a `TrainJob` is created or updated. This phase validates and prepares the job for execution.
- **Build Phase**: Builds and deploys the required Kubernetes resources for training jobs.
- **PostExecution Phase**: Runs after the job has been built and executed, checking the status and applying relevant conditions to the job.

### APIs and Extension Points

In each phase, there are two types of components:
1. **Internal APIs**: These APIs are used internally by the framework and cannot be extended or modified by the user.
2. **Extension Points**: These points are exposed to the user and allow for customization through plugins that can be added to the framework.

<img src="/docs/components/trainer/operator-guides/images/TrainerPipelineFramework.drawio.svg"
  alt="Kubeflow Trainer Pipeline Framework"
  class="mt-3 mb-3">

## Phases Explained

### 1. **Startup Phase**

**Purpose**: Initialize the TrainerPipelineFramework and set up necessary components for managing training jobs.

- **Internal APIs**:
  - **Initialize Kubeflow TrainerFrameworkPipeline**: Sets up the entire Kubeflow TrainerPipelineFramework.
  - **TrainJobController**: Configures the TrainJob controller and registers it with the Manager.
  - **Built-in Webhook Servers**: Initializes Admission Webhook Servers that handle job creation and updates.
  - **Start Manager**: Starts the main management process.

- **Extension Point**:
  - **WatchExtension**: Registers custom reconciler builders that watch specific resources and trigger TrainJob reconciliations as necessary.

### 2. **PreExecution Phase**

**Purpose**: Triggered when a `TrainJob` is created or updated, this phase validates the job and prepares it for execution.

- **Extension Point**:
  - **CustomValidation**: Registers custom validation logic to validate resources before a `TrainJob` is executed. This can include checking specific fields or configurations before proceeding.

### 3. **Build Phase**

**Purpose**: In this phase, the required Kubernetes resources are built and deployed to the cluster for execution.

- **Internal API**:
  - **ComponentDeployer**: Deploys the built components (Kubernetes resources) to the cluster as part of the reconciliation process.

- **Extension Points**:
  - **EnforcePodGroupPolicy**: Configures pod-specific parameters, such as those specified in the `TrainingRuntime.spec.podGroupPolicy`, for any relevant resources (like PodSpecs).
  - **EnforceMLPolicy**: Configures Machine Learning-specific parameters from the `TrainingRuntime.spec.mlPolicy` to adjust the deployment of training resources.
  - **ComponentBuilder**: Builds Kubernetes resources using the `RuntimeInfo` and `TrainJob` objects, allowing for a dynamic, runtime-specific deployment configuration.

### 4. **PostExecution Phase**

**Purpose**: After the training job has been executed, the framework checks the state of the job and applies terminal conditions if necessary.

- **Internal APIs**:
  - **SuspendedCondition**: Checks if the `TrainJob` is in a suspended state and adds the `Suspended` condition.
  - **CreatedCondition**: Verifies if the `TrainJob` has been created successfully and applies the `Created` condition.

- **Extension Point**:
  - **TerminalCondition**: Checks whether the `TrainJob` has terminated. If so, it applies the `Complete` condition and propagates any terminal reason or message from the child jobs to the `TrainJob`.
