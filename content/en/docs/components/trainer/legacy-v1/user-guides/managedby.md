+++
title = "spec.runPolicy.managedBy"
Desciption = "Using managedBy feild for MultiKueue"
weight = 60
+++

## Overview

The `spec.runPolicy.managedBy` field is a new feature introduced for MultiQueue support in the Kubeflow Training Operator. This field allows for more robust management of multi-cluster job dispatching by specifying the managing entity.

## Prerequisites

1. Ensure that you have the latest version of the Kubeflow Training Operator installed.
2. Make sure Kueue is compiled against the new operator to leverage the `spec.runPolicy.managedBy` field.

## Usage

To use the `spec.runPolicy.managedBy` field in your training jobs, include it in the job specification as shown below:

```yaml
apiVersion: "kubeflow.org/v1"
kind: "TFJob"
metadata:
 name: "example-tfjob"
spec:
 runPolicy:
  managedBy: "kueue"
  tfReplicaSpecs:
    ...
```

Example

Here is a complete example of a TensorFlow job using the spec.managedBy field:

```YAML
apiVersion: "kubeflow.org/v1"
kind: "TFJob"
metadata:
 name: "example-tfjob"
spec:
 runPolicy:
  managedBy: "kueue"
  tfReplicaSpecs:
    Chief:
      replicas: 1
      template:
        spec:
          containers:
            - name: tensorflow
              image: tensorflow/tensorflow:latest
              args: ["python", "model.py"]
    Worker:
      replicas: 2
      template:
        spec:
          containers:
            - name: tensorflow
              image: tensorflow/tensorflow:latest
              args: ["python", "model.py"]
```

## Cross-References

For more details on setting up and using MultiQueue with the Kubeflow Training Operator, refer to the following documentation pages:

- [Kueue/Kubeflow](https://kueue.sigs.k8s.io/docs/tasks/run/multikueue/kubeflow/)
