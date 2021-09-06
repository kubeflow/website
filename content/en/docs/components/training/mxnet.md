+++
title = "MXNet Training (MXJob)"
description = "Using MXJob to train a model with Apache MXNet"
weight = 25
                    
+++

This guide walks you through using [Apache MXNet (incubating)](https://github.com/apache/incubator-mxnet) with Kubeflow.

MXNet Operator provides a Kubernetes custom resource `MXJob` that makes it easy to run distributed or non-distributed
Apache MXNet jobs (training and tuning) and other extended framework like [BytePS](https://github.com/bytedance/byteps)
jobs on Kubernetes. Using a Custom Resource Definition (CRD) gives users the ability to create
and manage Apache MXNet jobs just like built-in K8S resources.

The Kubeflow implementation of `MXJob` is in [`training-operator`](https://github.com/kubeflow/tf-operator).

## Installing MXNet Operator

If you haven't already done so please follow the [Getting Started Guide](/docs/started/getting-started/) to deploy Kubeflow.

> By default, MXNet Operator will be deployed as a controller in training operator.

### Verify that MXJob support is included in your Kubeflow deployment

Check that the Apache MXNet custom resource is installed:

```
kubectl get crd
```

The output should include `mxjobs.kubeflow.org` like the following:

```
NAME                                             CREATED AT
...
mxjobs.kubeflow.org                              2021-09-06T18:33:57Z
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

## Creating a Apache MXNet training job

You create a training job by defining a `MXJob` with `MXTrain` mode and then creating it with.

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/tf-operator/master/examples/mxnet/train/mx_job_dist_gpu_v1.yaml
```

Each `mxReplicaSpecs` defines a set of Apache MXNet processes.
The `mxReplicaType` defines the semantics for the set of processes.
The semantics are as follows:

**scheduler**

- A job must have 1 and only 1 scheduler
- The pod must contain a container named `mxnet`
- The overall status of the `MXJob` is determined by the exit code of the
  mxnet container
  - 0 = success
  - 1 || 2 || 126 || 127 || 128 || 139 = permanent errors:
    - 1: general errors
    - 2: misuse of shell builtins
    - 126: command invoked cannot execute
    - 127: command not found
    - 128: invalid argument to exit
    - 139: container terminated by SIGSEGV(Invalid memory reference)
  - 130 || 137 || 143 = retryable error for unexpected system signals:
    - 130: container terminated by Control-C
    - 137: container received a SIGKILL
    - 143: container received a SIGTERM
  - 138 = reserved in tf-operator for user specified retryable errors
  - others = undefined and no guarantee

**worker**

- A job can have 0 to N workers
- The pod must contain a container named mxnet
- Workers are automatically restarted if they exit

**server**

- A job can have 0 to N servers
- parameter servers are automatically restarted if they exit

For each replica you define a **template** which is a K8S
[PodTemplateSpec](https://v1-21.docs.kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-template-v1/#PodTemplateSpec).
The template allows you to specify the containers, volumes, etc... that
should be created for each replica.

## Creating a TVM tuning job (AutoTVM)

[TVM](https://docs.tvm.ai/tutorials/) is a end to end deep learning compiler stack, you can easily run AutoTVM with mxnet-operator.
You can create a auto tuning job by define a type of MXTune job and then creating it with

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/tf-operator/master/examples/mxnet/tune/mx_job_tune_gpu_v1.yaml
```

Before you use the auto-tuning example, there is some preparatory work need to be finished in advance.
To let TVM tune your network, you should create a docker image which has TVM module.
Then, you need a auto-tuning script to specify which network will be tuned and set the auto-tuning parameters.
For more details, please see [tutorials](https://docs.tvm.ai/tutorials/autotvm/tune_relay_mobile_gpu.html#sphx-glr-tutorials-autotvm-tune-relay-mobile-gpu-py).
Finally, you need a startup script to start the auto-tuning program. In fact, mxnet-operator will set all the parameters as environment variables and the startup script need to reed these variable and then transmit them to auto-tuning script.
We provide an example under `examples/tune/`, tuning result will be saved in a log file like resnet-18.log in the example we gave. You can refer it for details.

## Using GPUs

MXNet Operator supports training with GPUs.

Please verify your image is available for distributed training with GPUs.

For example, if you have the following, MXNet Operator will arrange the pod to nodes to satisfy the GPU limit.

```
command: ["python"]
args: ["/incubator-mxnet/example/image-classification/train_mnist.py","--num-epochs","1","--num-layers","2","--kv-store","dist_device_sync","--gpus","0"]
resources:
  limits:
    nvidia.com/gpu: 1
```

## Monitoring your Apache MXNet job

To get the status of your job

```bash
kubectl get -o yaml mxjobs $JOB
```

Here is sample output for an example job

```yaml
apiVersion: kubeflow.org/v1
kind: MXJob
metadata:
  creationTimestamp: 2021-03-24T15:37:27Z
  generation: 1
  name: mxnet-job
  namespace: default
  resourceVersion: "5123435"
  selfLink: /apis/kubeflow.org/v1/namespaces/default/mxjobs/mxnet-job
  uid: xx11013b-4a28-11e9-s5a1-704d7bb912f91
spec:
  runPolicy:
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
  completionTime: 2021-03-24T09:25:11Z
  conditions:
    - lastTransitionTime: 2021-03-24T15:37:27Z
      lastUpdateTime: 2021-03-24T15:37:27Z
      message: MXJob mxnet-job is created.
      reason: MXJobCreated
      status: "True"
      type: Created
    - lastTransitionTime: 2021-03-24T15:37:27Z
      lastUpdateTime: 2021-03-24T15:37:29Z
      message: MXJob mxnet-job is running.
      reason: MXJobRunning
      status: "False"
      type: Running
    - lastTransitionTime: 2021-03-24T15:37:27Z
      lastUpdateTime: 2021-03-24T09:25:11Z
      message: MXJob mxnet-job is successfully completed.
      reason: MXJobSucceeded
      status: "True"
      type: Succeeded
  mxReplicaStatuses:
    Scheduler: {}
    Server: {}
    Worker: {}
  startTime: 2021-03-24T15:37:29Z
```

The first thing to note is the **RuntimeId**. This is a random unique
string which is used to give names to all the K8s resouces
(e.g Job controllers & services) that are created by the `MXJob`.

As with other K8S resources status provides information about the state
of the resource.

**phase** - Indicates the phase of a job and will be one of

- Creating
- Running
- CleanUp
- Failed
- Done

**state** - Provides the overall status of the job and will be one of

- Running
- Succeeded
- Failed

For each replica type in the job, there will be a `ReplicaStatus` that
provides the number of replicas of that type in each state.

For each replica type, the job creates a set of K8s
[Job Controllers](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)
named

```
${REPLICA-TYPE}-${RUNTIME_ID}-${INDEX}
```

For example, if you have 2 servers and the runtime id is "76n0", then `MXJob`
will create the following two jobs:

```
server-76no-0
server-76no-1
```

## More Information

- Check out [Kubeflow community page](https://www.kubeflow.org/docs/about/community/)
  for more information on how to get involved in our community.
