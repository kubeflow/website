+++
title = "Job Scheduling"
description = "How to schedule a job with gang-scheduling"
weight = 30
+++

This guide describes how to use Volcano to support gang-scheduling in 
Kubeflow, to allow jobs to run multiple pods at the same time.

## Running jobs with gang-scheduling
To use gang-scheduling, you have to install volcano scheduler in your cluster first as a secondary scheduler of Kubernetes and configure operator to enable gang-scheduling. 

* Volcano's introduction is [here](https://github.com/kubernetes-sigs/volcano), and also check how to install it [here](https://github.com/kubernetes-sigs/volcano/blob/master/doc/usage/tutorial.md).
* Take tf-operator for example, enable gang-scheduling in tf-operator by setting true to `--enable-gang-scheduling` flag.

**Note:** Volcano and operator in Kubeflow achieve gang-scheduling by using pdb. operator will create the pdb of the job automatically. You can know more about pdb [here](https://kubernetes.io/docs/tasks/run-application/configure-pdb/).

To use Volcano scheduler to schedule your job as a gang, you have to specify the schedulerName in each replica; for example.

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
          schedulerName: kube-batch
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
          schedulerName: kube-batch
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

## About Volcano and gang-scheduling
With using Volcano to apply gang-scheduling, a job can run only if there are enough resources for all the pods of the job. Otherwise, all the pods will be in pending state waiting for enough resources. For example, if a job requiring N pods is created and there are only enough resources to schedule N-2 pods, then N pods of the job will stay pending.

**Note:** when in a high workload, if a pod of the job dies when the job is still running, it might give other pods chance to occupied the resources and cause deadlock. 

## Troubleshooting 

If you keep getting problems related to RBAC in your volcano.

You can try to add the following rules into your clusterrole of scheduler used by volcano.
```
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
```
