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

## Installing Chainer Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.

An **alpha** version of [Chainer](https://chainer.org/) support was introduced with Kubeflow 0.3.0. You must be using a version of Kubeflow newer than 0.3.0.

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

## Creating an Chainer Job

You can create an Chainer Job by defining an ChainerJob config file. See [examples/chainerjob-reference.yaml](https://github.com/kubeflow/chainer-operator/blob/master/examples/chainerjob-reference.yaml) config file. You may change the config file based on your requirements. By default, the example job is distributed learning with 3 nodes (1 master, 2 workers).

```shell
cat examples/chainerjob-reference.yaml
```

Deploy the ChainerJob resource to start training:

```shell
kubectl create -f examples/chainerjob-reference.yaml
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
