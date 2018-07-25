+++
title = "PyTorch"
description = "Instructions for using PyTorch"
weight = 10
toc = true
bref= "This guide will walk you through using PyTorch with Kubeflow"
aliases = ["/docs/pytorch/"]
[menu.docs]
  parent = "started"
  weight = 3
+++

## Installing PyTorch Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.

An **alpha** version of PyTorch support was introduced with Kubeflow 0.2.0. You must be using a version of Kubeflow newer than 0.2.0.

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
cd ${KSONNET_APP}
ks pkg install kubeflow/pytorch-job
ks generate pytorch-operator pytorch-operator
ks apply ${ENVIRONMENT} -c pytorch-operator
```

## Creating a PyTorch Job

You can create PyTorch Job by defining a PyTorchJob config file. See [distributed MNIST example](https://github.com/kubeflow/pytorch-operator/blob/master/examples/dist-mnist/pytorch_job_mnist.yaml) config file. You may change the config file based on your requirements.

```
cat examples/dist-mnist/pytorch_job_mnist.yaml
```
Deploy the PyTorchJob resource to start training:

```
kubectl create -f examples/dist-mnist/pytorch_job_mnist.yaml
```
You should now be able to see the created pods matching the specified number of replicas.

```
kubectl get pods -l pytorch_job_name=dist-mnist-for-e2e-test
```
Training should run for about 10 epochs and takes 5-10 minutes on a cpu cluster. Logs can be inspected to see its training progress.

```
PODNAME=$(kubectl get pods -l pytorch_job_name=dist-mnist-for-e2e-test,task_index=0 -o name)
kubectl logs -f ${PODNAME}
```
## Monitoring a PyTorch Job

```
kubectl get -o yaml pytorchjobs dist-mnist-for-e2e-test
```
See the status section to monitor the job status. Here is sample output when the job is successfully completed.

```
apiVersion: v1
items:
- apiVersion: kubeflow.org/v1alpha1
  kind: PyTorchJob
  metadata:
    clusterName: ""
    creationTimestamp: 2018-06-22T08:16:14Z
    generation: 1
    name: dist-mnist-for-e2e-test
    namespace: default
    resourceVersion: "3276193"
    selfLink: /apis/kubeflow.org/v1alpha1/namespaces/default/pytorchjobs/dist-mnist-for-e2e-test
    uid: 87772d3b-75f4-11e8-bdd9-42010aa00072
  spec:
    RuntimeId: kmma
    pytorchImage: pytorch/pytorch:v0.2
    replicaSpecs:
    - masterPort: 23456
      replicaType: MASTER
      replicas: 1
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
          - image: gcr.io/kubeflow-ci/pytorch-dist-mnist_test:1.0
            imagePullPolicy: IfNotPresent
            name: pytorch
            resources: {}
          restartPolicy: OnFailure
    - masterPort: 23456
      replicaType: WORKER
      replicas: 3
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
          - image: gcr.io/kubeflow-ci/pytorch-dist-mnist_test:1.0
            imagePullPolicy: IfNotPresent
            name: pytorch
            resources: {}
          restartPolicy: OnFailure
    terminationPolicy:
      master:
        replicaName: MASTER
        replicaRank: 0
  status:
    phase: Done
    reason: ""
    replicaStatuses:
    - ReplicasStates:
        Succeeded: 1
      replica_type: MASTER
      state: Succeeded
    - ReplicasStates:
        Running: 1
        Succeeded: 2
      replica_type: WORKER
      state: Running
    state: Succeeded
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""

```
