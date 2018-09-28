+++
title = "Job Scheduling"
description = "Schedule job with gang-scheduling"
weight = 10
toc = true
[menu.docs]
  parent = "guides"
  weight = 30
+++

## Running jobs with gang-scheduling
To use gang-scheduling, you have to install kube-arbitrator in your cluster first as a secondary scheduler of Kubernetes and configure operator to enable gang-scheduling. 

* Kube-arbitrator's introduction is [here](https://github.com/kubernetes-incubator/kube-arbitrator), and also check how to install it [here](https://github.com/kubernetes-incubator/kube-arbitrator/blob/master/doc/usage/tutorial.md).
* Take tf-operator for example, enable gang-scheduling in tf-operator by setting true to `--enable-gang-scheduling` flag.

**Note:** Kube-arbitrator and operator in Kubeflow achieve gang-scheduling by using pdb. operator will create the pdb of the job automatically. You can know more about pdb [here](https://kubernetes.io/docs/tasks/run-application/configure-pdb/).

To use kube-arbitrator to schedule your job as a gang, you have to specify the schedulerName in each replica; for example.

```yaml
apiVersion: "kubeflow.org/v1alpha2"
kind: "TFJob"
metadata:
  name: "tfjob-gang-scheduling"
spec:
  tfReplicaSpecs:
    Worker:
      replicas: 1
      template:
        spec:
          schedulerName: kube-batchd
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
          schedulerName: kube-batchd
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

### About kube-arbitrator and gang-scheduling
With using kube-arbitrator to apply gang-scheduling, a job can run only if there are enough resourses for all the pods of the job. Otherwise, all the pods will be in pending state waiting for enough resources. For example, if a job requiring N pods is created and there are only enough resources to schedule N-2 pods, then N pods of the job will stay pending.

**Note:** when in a high workload, if a pod of the job dies when the job is still running, it might give other pods chance to occupied the resources and cause deadlock. 

### Troubleshooting 

If you keep getting logs like below in your kube-arbitrator.
```
I0910 10:27:16.745314       1 reflector.go:240] Listing and watching *v1alpha1.PodGroup from github.com/kubernetes-incubator/kube-arbitrator/pkg/scheduler/cache/cache.go:243
E0910 10:27:16.747168       1 reflector.go:205] github.com/kubernetes-incubator/kube-arbitrator/pkg/scheduler/cache/cache.go:243: Failed to list *v1alpha1.PodGroup: podgroups.scheduling.incubator.k8s.io is forbidden: User "system:serviceaccount:kube-system:my-scheduler" cannot list podgroups.scheduling.incubator.k8s.io at the cluster scope
I0910 10:27:17.747374       1 reflector.go:240] Listing and watching *v1alpha1.PodGroup from github.com/kubernetes-incubator/kube-arbitrator/pkg/scheduler/cache/cache.go:243
E0910 10:27:17.748986       1 reflector.go:205] github.com/kubernetes-incubator/kube-arbitrator/pkg/scheduler/cache/cache.go:243: Failed to list *v1alpha1.PodGroup: podgroups.scheduling.incubator.k8s.io is forbidden: User "system:serviceaccount:kube-system:my-scheduler" cannot list podgroups.scheduling.incubator.k8s.io at the cluster scope
```

You can just add the following rules into your clusterrole of scheduler used by kube-arbitrator.
```
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
```