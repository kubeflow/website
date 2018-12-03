+++
title = "MPI Training"
description = "Instructions for using MPI for training"
weight = 25
+++

This guide walks you through using MPI for training.

## Installing MPI Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.

An **alpha** version of MPI support was introduced with Kubeflow 0.2.0. You must be using a version of Kubeflow newer than 0.2.0.

## Verify that MPI support is included in your Kubeflow deployment

Check that the MPI Job custom resource is installed

```
kubectl get crd
```

The output should include `mpijobs.kubeflow.org`

```
NAME                                       AGE
...
mpijobs.kubeflow.org                       4d
...
```

If it is not included you can add it as follows

```
cd ${KSONNET_APP}
ks pkg install kubeflow/mpi-job
ks generate mpi-operator mpi-operator
ks apply ${ENVIRONMENT} -c mpi-operator
```

## Creating an MPI Job

You can create an MPI Job by defining an MPIJob config file. See [Tensorflow benchmark example](https://github.com/kubeflow/mpi-operator/blob/master/examples/tensorflow-benchmarks.yaml) config file. You may change the config file based on your requirements.

```
cat examples/tensorflow-benchmarks.yaml
```
Deploy the MPIJob resource to start training:

```
kubectl create -f examples/tensorflow-benchmarks.yaml
```
You should now be able to see the created pods matching the specified number of GPUs.

```
kubectl get pods -l mpi_job_name=tensorflow-benchmarks-16
```
Training should run for 100 steps and takes a few minutes on a gpu cluster. Logs can be inspected to see its training progress.

```
PODNAME=$(kubectl get pods -l mpi_job_name=tensorflow-benchmarks-16,mpi_role_type=launcher -o name)
kubectl logs -f ${PODNAME}
```
## Monitoring an MPI Job

```
kubectl get -o yaml mpijobs tensorflow-benchmarks-16
```
See the status section to monitor the job status. Here is sample output when the job is successfully completed.

```
apiVersion: kubeflow.org/v1alpha1
kind: MPIJob
metadata:
  clusterName: ""
  creationTimestamp: 2018-08-14T19:48:44Z
  generation: 1
  name: tensorflow-benchmarks-16
  namespace: default
  resourceVersion: "7670207"
  selfLink: /apis/kubeflow.org/v1alpha1/namespaces/default/mpijobs/tensorflow-benchmarks-16
  uid: 0d24b791-9ffb-11e8-9b38-029ed2ab0d38
spec:
  gpus: 16
  template:
    metadata:
      creationTimestamp: null
    spec:
      containers:
      - image: mpioperator/tensorflow-benchmarks:latest
        name: tensorflow-benchmarks
        resources: {}
status:
  launcherStatus: Succeeded
```
