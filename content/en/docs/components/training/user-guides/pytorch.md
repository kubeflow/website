+++
title = "PyTorch Training (PyTorchJob)"
description = "Using PyTorchJob to train a model with PyTorch"
weight = 20
+++

This page describes `PyTorchJob` for training a machine learning model with [PyTorch](https://pytorch.org/).

`PyTorchJob` is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
to run PyTorch training jobs on Kubernetes. The Kubeflow implementation of
`PyTorchJob` is in [`training-operator`](https://github.com/kubeflow/training-operator).

**Note**: `PyTorchJob` doesn’t work in a user namespace by default because of
Istio [automatic sidecar injection](https://istio.io/v1.3/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
In order to get it running, it needs annotation `sidecar.istio.io/inject: "false"`
to disable it for either `PyTorchJob` pods or namespace.
To view an example of how to add this annotation to your `yaml` file,
see the [`TFJob` documentation](https://www.kubeflow.org/docs/components/training/user-guides/tensorflow).

## Creating a PyTorch training job

You can create a training job by defining a `PyTorchJob` config file. See the manifests for the [distributed MNIST example](https://github.com/kubeflow/training-operator/blob/master/examples/pytorch/simple.yaml). You may change the config file based on your requirements.

Deploy the `PyTorchJob` resource to start training:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/training-operator/master/examples/pytorch/simple.yaml
```

You should now be able to see the created pods matching the specified number of replicas.

```
kubectl get pods -l job-name=pytorch-simple -n kubeflow
```

Training takes 5-10 minutes on a cpu cluster. Logs can be inspected to see its training progress.

```
PODNAME=$(kubectl get pods -l job-name=pytorch-simple,replica-type=master,replica-index=0 -o name -n kubeflow)
kubectl logs -f ${PODNAME} -n kubeflow
```

## Monitoring a PyTorchJob

```
kubectl get -o yaml pytorchjobs pytorch-simple -n kubeflow
```

See the status section to monitor the job status. Here is sample output when the job is successfully completed.

```yaml
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  clusterName: ""
  creationTimestamp: 2018-12-16T21:39:09Z
  generation: 1
  name: pytorch-tcp-dist-mnist
  namespace: default
  resourceVersion: "15532"
  selfLink: /apis/kubeflow.org/v1/namespaces/default/pytorchjobs/pytorch-tcp-dist-mnist
  uid: 059391e8-017b-11e9-bf13-06afd8f55a5c
spec:
  cleanPodPolicy: None
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      restartPolicy: OnFailure
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
            - image: gcr.io/kubeflow-ci/pytorch-dist-mnist_test:1.0
              name: pytorch
              ports:
                - containerPort: 23456
                  name: pytorchjob-port
              resources: {}
    Worker:
      replicas: 3
      restartPolicy: OnFailure
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
            - image: gcr.io/kubeflow-ci/pytorch-dist-mnist_test:1.0
              name: pytorch
              ports:
                - containerPort: 23456
                  name: pytorchjob-port
              resources: {}
status:
  completionTime: 2018-12-16T21:43:27Z
  conditions:
    - lastTransitionTime: 2018-12-16T21:39:09Z
      lastUpdateTime: 2018-12-16T21:39:09Z
      message: PyTorchJob pytorch-tcp-dist-mnist is created.
      reason: PyTorchJobCreated
      status: "True"
      type: Created
    - lastTransitionTime: 2018-12-16T21:39:09Z
      lastUpdateTime: 2018-12-16T21:40:45Z
      message: PyTorchJob pytorch-tcp-dist-mnist is running.
      reason: PyTorchJobRunning
      status: "False"
      type: Running
    - lastTransitionTime: 2018-12-16T21:39:09Z
      lastUpdateTime: 2018-12-16T21:43:27Z
      message: PyTorchJob pytorch-tcp-dist-mnist is successfully completed.
      reason: PyTorchJobSucceeded
      status: "True"
      type: Succeeded
  replicaStatuses:
    Master: {}
    Worker: {}
  startTime: 2018-12-16T21:40:45Z
```

## Next steps

- Learn about [distributed training](/docs/components/training/reference/distributed-training/) in Training Operator.

- See how to [run a job with gang-scheduling](/docs/use-cases/job-scheduling#running-jobs-with-gang-scheduling).
