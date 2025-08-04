+++
title = "Gang Scheduling"
description = "How to configure PodGroupPolicy in Kubeflow Trainer Runtimes"
weight = 50
+++

This guide describes how to integrate gang scheduling into TrainJobs. It ensures that a group of
related training nodes (e.g. Pods), only start when all required resources are available. Having
this is crucial when working with expensive and limited GPU accelerators.

You can enable gang scheduling by using
[the `PodGroupPolicy` API](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#PodGroupPolicy)
in the Kubeflow Trainer Runtimes.

Before exploring this guide, make sure to follow [the Runtime guide](/docs/components/trainer/operator-guides/runtime)
to understand the basics of Kubeflow Trainer Runtimes.

## PodGroupPolicy Overview

The `PodGroupPolicy` API defines the configuration for gang scheduling plugins:

```YAML
podGroupPolicy:
  coscheduling:
    scheduleTimeoutSeconds: 30
```
