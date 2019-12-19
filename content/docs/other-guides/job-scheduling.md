+++
title = "Job Scheduling"
description = "How to schedule a job with gang-scheduling"
weight = 70
+++

This guide describes how to use [volcano scheduler](https://github.com/volcano-sh/volcano) to support gang-scheduling in 
Kubeflow, to allow jobs to run multiple pods at the same time.

## Running jobs with gang-scheduling
To use gang-scheduling, you have to install volcano scheduler in your cluster first as a secondary scheduler of Kubernetes and configure operator to enable gang-scheduling. 

* Follow the [instructions in the volcano repository](https://github.com/volcano-sh/volcano) to install Volcano.
* Take tf-operator for example, enable gang-scheduling in tf-operator by setting true to `--enable-gang-scheduling` flag.

**Note:** Volcano scheduler and operator in Kubeflow achieve gang-scheduling by using [PodGroup](https://github.com/volcano-sh/volcano/blob/master/pkg/apis/scheduling/v1alpha2/types.go). operator will create the PodGroup of the job automatically.

The yaml to use volcano scheduler to schedule your job as a gang is the same as non-gang-scheduler, for example.

```yaml
apiVersion: "kubeflow.org/v1beta1"
kind: "TFJob"
metadata:
  name: "tfjob-gang-scheduling"
spec:
  tfReplicaSpecs:
    Worker:
      replicas: 1
      template:
        spec:
          containers:
          - args:
            - python
            - tf_cnn_benchmarks.py
            - --batch_size=32
            - --model=resnet50
            - --variable_update=parameter_server
            - --flush_stdout=true
            - --num_gpus=1
            - --local_parameter_device=cpu
            - --device=gpu
            - --data_format=NHWC
            image: gcr.io/kubeflow/tf-benchmarks-gpu:v20171202-bdab599-dirty-284af3
            name: tensorflow
            resources:
              limits:
                nvidia.com/gpu: 1
            workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          restartPolicy: OnFailure
    PS:
      replicas: 1
      template:
        spec:
          containers:
          - args:
            - python
            - tf_cnn_benchmarks.py
            - --batch_size=32
            - --model=resnet50
            - --variable_update=parameter_server
            - --flush_stdout=true
            - --num_gpus=1
            - --local_parameter_device=cpu
            - --device=cpu
            - --data_format=NHWC
            image: gcr.io/kubeflow/tf-benchmarks-cpu:v20171202-bdab599-dirty-284af3
            name: tensorflow
            resources:
              limits:
                cpu: '1'
            workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          restartPolicy: OnFailure
```

## About volcano scheduler and gang-scheduling
With using volcano scheduler to apply gang-scheduling, a job can run only if there are enough resources for all the pods of the job. Otherwise, all the pods will be in pending state waiting for enough resources. For example, if a job requiring N pods is created and there are only enough resources to schedule N-2 pods, then N pods of the job will stay pending.

**Note:** when in a high workload, if a pod of the job dies when the job is still running, it might give other pods chance to occupied the resources and cause deadlock. 

## Troubleshooting 

If you keep getting problems related to RBAC in your volcano scheduler.

You can try to add the following rules into your clusterrole of scheduler used by volcano scheduler.
```
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
```
