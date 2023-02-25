+++
title = "Job Scheduling"
description = "How to schedule a job with gang-scheduling"
weight = 60
                    
+++

{{% alpha-status
  feedbacklink="https://github.com/kubeflow/training-operator/issues" %}}

This guide describes how to use 
[Volcano Scheduler](https://github.com/volcano-sh/volcano) and
[Scheduler Plugins with coscheduling](https://github.com/kubernetes-sigs/scheduler-plugins/blob/2502825c671063af5b2aa78a1d34b24917f2def4/pkg/coscheduling/README.md)
to support gang-scheduling in Kubeflow, to allow jobs to run multiple pods at the same time.

## Running jobs with gang-scheduling

Training Operator supports running jobs with gang-scheduling using Volcano Scheduler and Scheduler Plugins with coscheduling.

**Note:** Scheduler Plugins with coscheduling is currently supported only in [Training Operator](https://github.com/kubeflow/training-operator).
[MPI Operator](https://github.com/kubeflow/mpi-operator) does not support that.

### Scheduler Plugins with coscheduling

You have to install the Scheduler Plugins with coscheduling in your cluster first as a default scheduler or a secondary scheduler of Kubernetes and
configure operator to select the scheduler name for gang-scheduling in the following:

- training-operator

```diff
...
    spec:
      containers:
        - command:
            - /manager
+           - --gang-scheduler-name=scheduler-plugins
          image: kubeflow/training-operator
          name: training-operator
...
```

- mpi-operator (installed scheduler-plugins as a default scheduler)

```diff
...
    spec:
      containers:
      - args:
+       - --gang-scheduling=default-scheduler
        - -alsologtostderr
        - --lock-namespace=mpi-operator
        image: mpioperator/mpi-operator:0.4.0
        name: mpi-operator
...
```

- mpi-operator (installed scheduler-plugins as a secondary scheduler)

```diff
...
    spec:
      containers:
      - args:
+       - --gang-scheduling=scheduler-plugins-scheduler
        - -alsologtostderr
        - --lock-namespace=mpi-operator
        image: mpioperator/mpi-operator:0.4.0
        name: mpi-operator
...
```

- Follow to [instructions in the kubernetes-sigs/scheduler-plugins repository](https://github.com/kubernetes-sigs/scheduler-plugins/blob/2502825c671063af5b2aa78a1d34b24917f2def4/doc/install.md#install-release-v0249-and-use-coscheduling)
to install the Scheduler Plugins with coscheduling.

**Note:** Scheduler Plugins and operator in Kubeflow achieve gang-scheduling by using [PodGroup](https://github.com/kubernetes-sigs/scheduler-plugins/blob/2502825c671063af5b2aa78a1d34b24917f2def4/pkg/coscheduling/README.md#podgroup).
Operator will create the PodGroup of the job automatically.

If you install Scheduler Plugins in your cluster as a secondary scheduler,
you need to specify the scheduler name in CustomJob resources (e.g., TFJob), for example: 

```diff
apiVersion: "kubeflow.org/v1"
kind: TFJob
metadata:
  name: tfjob-simple
  namespace: kubeflow
spec:
  tfReplicaSpecs:
    Worker:
      replicas: 2
      restartPolicy: OnFailure
      template:
        spec:
+         schedulerName: scheduler-plugins-scheduler
          containers:
            - name: tensorflow
              image: kubeflow/tf-mnist-with-summaries:latest
              command:
                - "python"
                - "/var/tf_mnist/mnist_with_summaries.py"
```

In installing Scheduler Plugins as a default scheduler, you don't need to specify the scheduler name in CustomJob resources (e.g., TFJob).

### Volcano Scheduler

You have to install volcano scheduler in your cluster first as a secondary scheduler of Kubernetes and
configure operator to select the scheduler name for gang-scheduling in the following:

- training-operator

```diff
...
    spec:
      containers:
        - command:
            - /manager
+           - --gang-scheduler-name=volcano
          image: kubeflow/training-operator
          name: training-operator
...
```

- mpi-operator

```diff
...
    spec:
      containers:
      - args:
+       - --gang-scheduling=volcano
        - -alsologtostderr
        - --lock-namespace=mpi-operator
        image: mpioperator/mpi-operator:0.4.0
        name: mpi-operator
...
```

- Follow the [instructions in the volcano repository](https://github.com/volcano-sh/volcano) to install Volcano.

**Note:** Volcano scheduler and operator in Kubeflow achieve gang-scheduling by using [PodGroup](https://volcano.sh/en/docs/podgroup/).
Operator will create the PodGroup of the job automatically.

The yaml to use volcano scheduler to schedule your job as a gang is the same as non-gang-scheduler, for example:

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
                  cpu: "1"
              workingDir: /opt/tf-benchmarks/scripts/tf_cnn_benchmarks
          restartPolicy: OnFailure
```

## About gang-scheduling

With using Volcano Scheduler or Scheduler Plugins with coscheduling to apply gang-scheduling,
a job can run only if there are enough resources for all the pods of the job.
Otherwise, all the pods will be in pending state waiting for enough resources.
For example, if a job requiring N pods is created and there are only enough resources to schedule N-2 pods,
then N pods of the job will stay pending.

**Note:** when in a high workload, if a pod of the job dies when the job is still running,
it might give other pods a chance to occupy the resources and cause deadlock.

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
