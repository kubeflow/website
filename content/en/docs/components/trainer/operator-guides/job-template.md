+++
title = "Job Template"
description = "How to configure Job Template in Kubeflow Trainer Runtimes"
weight = 60
+++

This guide describes how to configure
[the `Template` API](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#JobSetTemplateSpec)
in the Kubeflow Trainer Runtimes.

Before exploring this guide, make sure to follow [the Runtime guide](/docs/components/trainer/runtime)
to understand the basics of Kubeflow Trainer Runtimes.

### Template Overview

The `Template` API defines [the JobSet template](https://jobset.sigs.k8s.io/docs/overview/) used
to orchestrate resources for a TrainJob. Kubeflow Trainer controller
manager creates the appropriate JobSet based on the TrainJob specification, the `Template`,
and additional runtime configurations such as `PodGroupPolicy` and `MLPolicy`.

For each `ReplicatedJobs`, you can provide detailed settings, like
[the Job specification](https://kubernetes.io/docs/concepts/workloads/controllers/job/),
container image, commands, and resource requirements:

```YAML
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
                    image: pytorch/pytorch:1.9.0-cuda11.1-cudnn8-runtime
                    command: ["python", "/path/to/train.py"]
                    resources:
                      requests:
                        cpu: "2"
                        memory: "4Gi"
                      limits:
                        nvidia.com/gpu: "1"
```

### Ancestor Label Requirement

When defining `ReplicatedJobs` such as `dataset-initializer`, `model-initializer`, and `node`,
it is important to ensure that each job template includes the appropriate ancestor labels.
These labels are used by the Kubeflow Trainer controller to inject values from the parent
TrainJob into the corresponding `ReplicatedJob`:

- `trainer.kubeflow.org/trainjob-ancestor-step: trainer`: Inject values from
  [the TrainJob's `.spec.trainer`](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#Trainer)
- `trainer.kubeflow.org/trainjob-ancestor-step: dataset-initializer`: Inject values from
  [the TrainJob's `.spec.initializer.dataset](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#DatasetInitializer)
- `trainer.kubeflow.org/trainjob-ancestor-step: model-initializer`: Inject values from
  [the TrainJob's `.spec.initializer.model](https://pkg.go.dev/github.com/kubeflow/trainer/v2/pkg/apis/trainer/v1alpha1#ModelInitializer)

```YAML
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: example-runtime
spec:
  template:
    spec:
      replicatedJobs:
        - name: dataset-initializer
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: dataset-initializer
            spec:
              template:
                spec:
                  containers:
                    - name: dataset-initializer
                      image: ghcr.io/kubeflow/trainer/dataset-initializer
        - name: model-initializer
          dependsOn:
            - name: dataset-initializer
              status: Complete
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: model-initializer
            spec:
              template:
                spec:
                  containers:
                    - name: model-initializer
                      image: ghcr.io/kubeflow/trainer/model-initializer
        - name: node
          dependsOn:
            - name: model-initializer
              status: Complete
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              template:
                spec:
                  containers:
                    - name: node
                      image: ghcr.io/kubeflow/trainer/torchtune-trainer
```
