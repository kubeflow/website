+++
title = "PyTorch Training"
description = "Instructions for using PyTorch"
weight = 35
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

{{% stable-status %}}

This guide walks you through using PyTorch with Kubeflow.

## Installing PyTorch Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.

An **alpha** version of PyTorch support was introduced with Kubeflow 0.2.0. You must be using a version of Kubeflow between 0.2.0 and 0.3.5 to use this version.

More recently, a **beta** version of PyTorch support was introduced with Kubeflow 0.4.0. You must be using a version of Kubeflow newer than 0.4.0 to use this version.

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

If it is not included you can add it as follows

```
export KF_DIR=<your Kubeflow installation directory>
cd ${KF_DIR}/kustomize
kubectl apply -f pytorch-job-crds.yaml
kubectl apply -f pytorch-operator.yaml
```

## Creating a PyTorch Job

You can create PyTorch Job by defining a PyTorchJob config file. See the manifests for the [distributed MNIST example](https://github.com/kubeflow/pytorch-operator/tree/master/examples/mnist). You may change the config file based on your requirements.

```
cat pytorch_job_mnist.yaml
```
Deploy the PyTorchJob resource to start training:

```
kubectl create -f pytorch_job_mnist.yaml
```
You should now be able to see the created pods matching the specified number of replicas.

```
kubectl get pods -l pytorch_job_name=pytorch-tcp-dist-mnist
```
Training should run for about 10 epochs and takes 5-10 minutes on a cpu cluster. Logs can be inspected to see its training progress.

```
PODNAME=$(kubectl get pods -l pytorch_job_name=pytorch-tcp-dist-mnist,pytorch-replica-type=master,pytorch-replica-index=0 -o name)
kubectl logs -f ${PODNAME}
```
## Monitoring a PyTorch Job

```
kubectl get -o yaml pytorchjobs pytorch-tcp-dist-mnist
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
