+++
title = "Chainer Training"
description = "Instructions for using Chainer for training"
weight = 10
toc = true
bref= "This guide will walk you through using Chainer for training"
[menu]
[menu.docs]
  parent = "components"
  weight = 4
+++

## What is Chainer?

[Chainer](https://chainer.org/) is a powerful, flexible and intuitive deep learning framework.

- Chainer supports CUDA computation. It only requires a few lines of code to leverage a GPU. It also runs on multiple GPUs with little effort.
- Chainer supports various network architectures including feed-forward nets, convnets, recurrent nets and recursive nets. It also supports per-batch architectures.
- Forward computation can include any control flow statements of Python without lacking the ability of backpropagation. It makes code intuitive and easy to debug.

[ChainerMN](https://github.com/chainer/chainermn) is an additional package for Chainer, a flexible deep learning framework. ChainerMN enables multi-node distributed deep learning with the following features:

- Scalable --- it makes full use of the latest technologies such as NVIDIA NCCL and CUDA-Aware MPI,
- Flexible --- even dynamic neural networks can be trained in parallel thanks to Chainer's flexibility, and
- Easy --- minimal changes to existing user code are required.

[This blog post](https://chainer.org/general/2017/02/08/Performance-of-Distributed-Deep-Learning-Using-ChainerMN.html) provides a benchmark results using up to 128 GPUs.

## Installing Chainer Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.

An **alpha** version of [Chainer](https://chainer.org/) support was introduced with Kubeflow 0.3.0. You must be using a version of Kubeflow newer than 0.3.0.

```
$ cd ${KFAPP}/ks_app

# create when default env doesn't exist
$ ks env list | grep default || (source ../env.sh && ks env add default --namespace "${K8S_NAMESPACE}")

# deploy chainer-operator
$ ks apply default -c chainer-operator

# remove defualt environment so that kfctl.sh can automatically 
# point appropriate cluster when you run kfctl.sh next time.
$ ks env rm default
```

## Verify that Chainer support is included in your Kubeflow deployment

Check that the Chainer Job custom resource is installed

```shell
kubectl get crd
```

The output should include `chainerjobs.kubeflow.org`

```
NAME                                       AGE
...
chainerjobs.kubeflow.org                   4d
...
```

If it is not included you can add it as follows

```shells
cd ${KSONNET_APP}
ks pkg install kubeflow/chainer-job
ks generate chainer-operator chainer-operator
ks apply ${ENVIRONMENT} -c chainer-operator
```

## Creating a Chainer Job

You can create an Chainer Job by defining an ChainerJob config file.  First, please create a file `example-job-mn.yaml` like below:

```yaml
apiVersion: kubeflow.org/v1alpha1
kind: ChainerJob
metadata:
  name: example-job-mn
spec:
  backend: mpi
  master:
    mpiConfig:
      slots: 1 
    activeDeadlineSeconds: 6000
    backoffLimit: 60
    template:
      spec:
        containers:
        - name: chainer
          image: everpeace/chainermn:1.3.0
          command:
          - sh
          - -c
          - |
            mpiexec -n 3 -N 1 --allow-run-as-root --display-map  --mca mpi_cuda_support 0 \
            python3 /train_mnist.py -e 2 -b 1000 -u 100
  workerSets:
    ws0:
      replicas: 2
      mpiConfig:
        slots: 1
      template:
        spec:
          containers:
          - name: chainer
            image: everpeace/chainermn:1.3.0
            command:
            - sh
            - -c
            - |
              while true; do sleep 1 & wait; done
```

See [examples/chainerjob-reference.yaml](https://github.com/kubeflow/chainer-operator/blob/master/examples/chainerjob-reference.yaml) for definitions of each attributes. You may change the config file based on your requirements. By default, the example job is distributed learning with 3 nodes (1 master, 2 workers).

Deploy the ChainerJob resource to start training:

```shell
kubectl create -f example-job-mn.yaml
```

You should now be able to see the created pods which consist of the chainer job.

```
kubectl get pods -l chainerjob.kubeflow.org/name=example-job-mn
```

The training should run only for 2 epochs and takes within a few minutes even on cpu only cluster. Logs can be inspected to see its training progress.

```
PODNAME=$(kubectl get pods -l chainerjob.kubeflow.org/name=example-job-mn,chainerjob.kubeflow.org/role=master -o name)
kubectl logs -f ${PODNAME}
```

## Monitoring an Chainer Job

```shell
kubectl get -o yaml chainerjobs example-job-mn
```

See the status section to monitor the job status. Here is sample output when the job is successfully completed.

```yaml
apiVersion: kubeflow.org/v1alpha1
kind: ChainerJob
metadata:
  name: example-job-mn
...
status:
  completionTime: 2018-09-01T16:42:35Z
  conditions:
  - lastProbeTime: 2018-09-01T16:42:35Z
    lastTransitionTime: 2018-09-01T16:42:35Z
    status: "True"
    type: Complete
  startTime: 2018-09-01T16:34:04Z
  succeeded: 1
```
