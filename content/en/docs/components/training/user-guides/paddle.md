+++
title = "PaddlePaddle Training (PaddleJob)"
description = "Using PaddleJob to train a model with PaddlePaddle"
weight = 30
+++

This page describes `PaddleJob` for training a machine learning model with [PaddlePaddle](https://www.paddlepaddle.org.cn/).

`PaddleJob` is a Kubernetes
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
to run PaddlePaddle training jobs on Kubernetes. The Kubeflow implementation of
`PaddleJob` is in [`training-operator`](https://github.com/kubeflow/training-operator).

**Note**: `PaddleJob` doesn’t work in a user namespace by default because of
Istio [automatic sidecar injection](https://istio.io/v1.3/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
In order to get it running, it needs annotation `sidecar.istio.io/inject: "false"`
to disable it for either `PaddleJob` pods or namespace.
To view an example of how to add this annotation to your `yaml` file,
see the [`TFJob` documentation](/docs/components/training/user-guides/tensorflow/).

## Creating a PaddlePaddle training job

You can create a training job by defining a `PaddleJob` config file. See the manifests for the [distributed example](https://github.com/kubeflow/training-operator/blob/master/examples/paddlepaddle/simple-cpu.yaml). You may change the config file based on your requirements.

Deploy the `PaddleJob` resource to start training:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/training-operator/master/examples/paddlepaddle/simple-cpu.yaml
```

You should now be able to see the created pods matching the specified number of replicas.

```
kubectl get pods -l job-name=paddle-simple-cpu -n kubeflow
```

Training takes several minutes on a cpu cluster. Logs can be inspected to see its training progress.

```
PODNAME=$(kubectl get pods -l job-name=paddle-simple-cpu,replica-type=worker,replica-index=0 -o name -n kubeflow)
kubectl logs -f ${PODNAME} -n kubeflow
```

## Monitoring a PaddleJob

```
kubectl get -o yaml paddlejobs paddle-simple-cpu -n kubeflow
```

See the status section to monitor the job status. Here is sample output when the job is successfully completed.

```
apiVersion: kubeflow.org/v1
kind: PaddleJob
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"kubeflow.org/v1","kind":"PaddleJob","metadata":{"annotations":{},"name":"paddle-simple-cpu","namespace":"kubeflow"},"spec":{"paddleReplicaSpecs":{"Worker":{"replicas":2,"restartPolicy":"OnFailure","template":{"spec":{"containers":[{"args":["-m","paddle.distributed.launch","run_check"],"command":["python"],"image":"registry.baidubce.com/paddlepaddle/paddle:2.4.0rc0-cpu","imagePullPolicy":"Always","name":"paddle","ports":[{"containerPort":37777,"name":"master"}]}]}}}}}}
  creationTimestamp: "2022-10-24T03:47:45Z"
  generation: 3
  name: paddle-simple-cpu
  namespace: kubeflow
  resourceVersion: "266235056"
  selfLink: /apis/kubeflow.org/v1/namespaces/kubeflow/paddlejobs/paddle-simple-cpu
  uid: 7ef4f92f-0ed4-4a35-b10a-562b79538cc6
spec:
  paddleReplicaSpecs:
    Worker:
      replicas: 2
      restartPolicy: OnFailure
      template:
        spec:
          containers:
          - args:
            - -m
            - paddle.distributed.launch
            - run_check
            command:
            - python
            image: registry.baidubce.com/paddlepaddle/paddle:2.4.0rc0-cpu
            imagePullPolicy: Always
            name: paddle
            ports:
            - containerPort: 37777
              name: master
              protocol: TCP
status:
  completionTime: "2022-10-24T04:04:43Z"
  conditions:
  - lastTransitionTime: "2022-10-24T03:47:45Z"
    lastUpdateTime: "2022-10-24T03:47:45Z"
    message: PaddleJob paddle-simple-cpu is created.
    reason: PaddleJobCreated
    status: "True"
    type: Created
  - lastTransitionTime: "2022-10-24T04:04:28Z"
    lastUpdateTime: "2022-10-24T04:04:28Z"
    message: PaddleJob kubeflow/paddle-simple-cpu is running.
    reason: JobRunning
    status: "False"
    type: Running
  - lastTransitionTime: "2022-10-24T04:04:43Z"
    lastUpdateTime: "2022-10-24T04:04:43Z"
    message: PaddleJob kubeflow/paddle-simple-cpu successfully completed.
    reason: JobSucceeded
    status: "True"
    type: Succeeded
  replicaStatuses:
    Worker:
      labelSelector:
        matchLabels:
          group-name: kubeflow.org
          job-name: paddle-simple-cpu
          training.kubeflow.org/job-name: paddle-simple-cpu
          training.kubeflow.org/operator-name: paddlejob-controller
          training.kubeflow.org/replica-type: Worker
      succeeded: 2
  startTime: "2022-10-24T03:47:45Z"
```
