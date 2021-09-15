+++
title = "PyTorch Training (PyTorchJob)"
description = "Using PyTorchJob to train a model with PyTorch"
weight = 15
                    
+++

{{% stable-status %}}

This page describes `PyTorchJob` for training a machine learning model with [PyTorch](https://pytorch.org/).

`PyTorchJob` is a Kubernetes [custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to run PyTorch training jobs on Kubernetes. The Kubeflow implementation of `PyTorchJob` is in [`training-operator`](https://github.com/kubeflow/tf-operator).

## Installing PyTorch Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.

> By default, PyTorch Operator will be deployed as a controller in training operator.

### Verify that PyTorchJob support is included in your Kubeflow deployment

Check that the PyTorch custom resource is installed:

```
kubectl get crd
```

The output should include `pytorchjobs.kubeflow.org` like the following:

```
NAME                                             CREATED AT
...
pytorchjobs.kubeflow.org                         2021-09-06T18:33:58Z
...
```

Check that the Training operator is running via:

```
kubectl get pods -n kubeflow
```

The output should include `training-operaror-xxx` like the following:

```
NAME                                READY   STATUS    RESTARTS   AGE
training-operator-d466b46bc-xbqvs   1/1     Running   0          4m37s
```

## Creating a PyTorch training job

You can create a training job by defining a `PyTorchJob` config file. See the manifests for the [distributed MNIST example](https://github.com/kubeflow/tf-operator/blob/master/examples/pytorch/simple.yaml). You may change the config file based on your requirements.

Deploy the `PyTorchJob` resource to start training:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/tf-operator/master/examples/pytorch/simple.yaml
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

## Monitoring a PyTorch Job

```
kubectl get -o yaml pytorchjobs pytorch-simple -n kubeflow
```

See the status section to monitor the job status. Here is sample output when the job is successfully completed.

```
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
