+++
title = "PyTorch Training"
description = "Instructions for using PyTorch"
weight = 15
                    
+++

{{% stable-status %}}

This page describes PyTorchJob for training a machine learning model with PyTorch.

## Installing PyTorch Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.


## Verify that PyTorch support is included in your Kubeflow deployment

Check that the PyTorch custom resource is installed

```
kubectl get crd
```

The output should include `pytorchjobs.kubeflow.org`

```
NAME                                           AGE
...
pytorchjobs.kubeflow.org                       4d
...
```


## Creating a PyTorch Job

You can create PyTorch Job by defining a PyTorchJob config file. See the manifests for the [distributed MNIST example](https://github.com/kubeflow/tf-operator/blob/master/examples/pytorch/simple.yaml). You may change the config file based on your requirements.

```
cat simple.yaml
```
Deploy the PyTorchJob resource to start training:

```
kubectl create -f simple.yaml
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
