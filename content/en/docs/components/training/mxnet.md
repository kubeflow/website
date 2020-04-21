+++
title = "MXNet Training"
description = "Instructions for using MXNet"
weight = 25
+++

{{% alpha-status 
  feedbacklink="https://github.com/kubeflow/mxnet-operator/issues" %}}

This guide walks you through using MXNet with Kubeflow.

## Installing MXNet Operator

If you haven't already done so please follow the [Getting Started Guide](https://www.kubeflow.org/docs/started/getting-started/) to deploy Kubeflow.

A version of MXNet support was introduced with Kubeflow 0.2.0. You must be using a version of Kubeflow newer than 0.2.0.

## Verify that MXNet support is included in your Kubeflow deployment

Check that the MXNet custom resource is installed

```
kubectl get crd
```

The output should include `mxjobs.kubeflow.org`

```
NAME                                           AGE
...
mxjobs.kubeflow.org                            4d
...
```

If it is not included you can add it as follows

```
git clone https://github.com/kubeflow/manifests
cd manifests/mxnet-job/mxnet-operator
kubectl kustomize base | kubectl apply -f -
```

Alternatively, you can deploy the operator with default settings without using kustomize by running the following from the repo:

```
git clone https://github.com/kubeflow/mxnet-operator.git
cd mxnet-operator
kubectl create -f manifests/crd-v1beta1.yaml 
kubectl create -f manifests/rbac.yaml 
kubectl create -f manifests/deployment.yaml
```

## Creating a MXNet training job


You create a training job by defining a MXJob with MXTrain mode and then creating it with


```
kubectl create -f examples/v1beta1/train/mx_job_dist_gpu.yaml
```


## Creating a TVM tuning job (AutoTVM)


[TVM](https://docs.tvm.ai/tutorials/) is a end to end deep learning compiler stack, you can easily run AutoTVM with mxnet-operator. 
You can create a auto tuning job by define a type of MXTune job and then creating it with


```
kubectl create -f examples/v1beta1/tune/mx_job_tune_gpu.yaml
```


Before you use the auto-tuning example, there is some preparatory work need to be finished in advance. To let TVM tune your network, you should create a docker image which has TVM module. Then, you need a auto-tuning script to specify which network will be tuned and set the auto-tuning parameters, For more details, please see https://docs.tvm.ai/tutorials/autotvm/tune_relay_mobile_gpu.html#sphx-glr-tutorials-autotvm-tune-relay-mobile-gpu-py. Finally, you need a startup script to start the auto-tuning program. In fact, mxnet-operator will set all the parameters as environment variables and the startup script need to reed these variable and then transmit them to auto-tuning script. We provide an example under examples/v1beta1/tune/, tuning result will be saved in a log file like resnet-18.log in the example we gave. You can refer it for details.


## Monitoring a MXNet Job


To get the status of your job

```bash
kubectl get -o yaml mxjobs ${JOB}
```   

Here is sample output for an example job

```yaml
apiVersion: kubeflow.org/v1beta1
kind: MXJob
metadata:
  creationTimestamp: 2019-03-19T09:24:27Z
  generation: 1
  name: mxnet-job
  namespace: default
  resourceVersion: "3681685"
  selfLink: /apis/kubeflow.org/v1beta1/namespaces/default/mxjobs/mxnet-job
  uid: cb11013b-4a28-11e9-b7f4-704d7bb59f71
spec:
  cleanPodPolicy: All
  jobMode: MXTrain
  mxReplicaSpecs:
    Scheduler:
      replicas: 1
      restartPolicy: Never
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
          - image: mxjob/mxnet:gpu
            name: mxnet
            ports:
            - containerPort: 9091
              name: mxjob-port
            resources: {}
    Server:
      replicas: 1
      restartPolicy: Never
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
          - image: mxjob/mxnet:gpu
            name: mxnet
            ports:
            - containerPort: 9091
              name: mxjob-port
            resources: {}
    Worker:
      replicas: 1
      restartPolicy: Never
      template:
        metadata:
          creationTimestamp: null
        spec:
          containers:
          - args:
            - /incubator-mxnet/example/image-classification/train_mnist.py
            - --num-epochs
            - "10"
            - --num-layers
            - "2"
            - --kv-store
            - dist_device_sync
            - --gpus
            - "0"
            command:
            - python
            image: mxjob/mxnet:gpu
            name: mxnet
            ports:
            - containerPort: 9091
              name: mxjob-port
            resources:
              limits:
                nvidia.com/gpu: "1"
status:
  completionTime: 2019-03-19T09:25:11Z
  conditions:
  - lastTransitionTime: 2019-03-19T09:24:27Z
    lastUpdateTime: 2019-03-19T09:24:27Z
    message: MXJob mxnet-job is created.
    reason: MXJobCreated
    status: "True"
    type: Created
  - lastTransitionTime: 2019-03-19T09:24:27Z
    lastUpdateTime: 2019-03-19T09:24:29Z
    message: MXJob mxnet-job is running.
    reason: MXJobRunning
    status: "False"
    type: Running
  - lastTransitionTime: 2019-03-19T09:24:27Z
    lastUpdateTime: 2019-03-19T09:25:11Z
    message: MXJob mxnet-job is successfully completed.
    reason: MXJobSucceeded
    status: "True"
    type: Succeeded
  mxReplicaStatuses:
    Scheduler: {}
    Server: {}
    Worker: {}
  startTime: 2019-03-19T09:24:29Z
```
