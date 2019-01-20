+++
title = "Hyperparameter Tuning (Katib)"
description = "Using Katib to tune your model's hyperparameters"
weight = 5
+++

Hyperparameter tuning on Kubernetes.
This project is inspired by [Google vizier](https://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/bcb15507f4b52991a0783013df4222240e942381.pdf). Katib is a scalable and flexible hyperparameter tuning framework and is tightly integrated with Kubernetes. Also it does not depend on a specific deep learning framework (e.g. TensorFlow, MXNet, and PyTorch).

## Installing Katib

For running Katib jobs, you have to install necessary packages.

In your Ksonnet app root, run the following

```
export KF_ENV=default
ks env set ${KF_ENV} --namespace=kubeflow
ks registry add kubeflow github.com/kubeflow/kubeflow/tree/master/kubeflow
```

You can read more about Kubeflow's use of Ksonnet in the [Ksonnet component guide](/docs/components/ksonnet/).

### TF operator

For installing tf operator, run the following

```
ks pkg install kubeflow/tf-training
ks pkg install kubeflow/common
ks generate tf-job-operator tf-job-operator
ks apply ${KF_ENV} -c tf-job-operator
```

### Pytorch operator
For installing pytorch operator, run the following

```
ks pkg install kubeflow/pytorch-job
ks generate pytorch-operator pytorch-operator
ks apply ${KF_ENV} -c pytorch-operator
```

### Katib

Finally, you can install Katib

```
ks pkg install kubeflow/katib
ks generate katib katib
ks apply ${KF_ENV} -c katib
```

If you want to use Katib not in GKE and you don't have StorageClass for dynamic volume provisioning at your cluster, you have to create persistent volume (PV) to bound your persistent volume claim (PVC).

This is yaml file for PV

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: katib-mysql
  labels:
    type: local
    app: katib
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/katib
```

Create this PV after deploying Katib package

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/pv/pv.yaml
```

## Running examples

After deploy everything, you can run examples.

### Example using random algorithm

You can create Study Job for Katib by defining a StudyJob config file.
See [random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/random-example.yaml).

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/random-example.yaml
```

Running this command will launch a StudyJob. The study job will run a series of training jobs to train models using different hyperparameters and save the results.
The configurations for the study (hyper-parameter feasible space, optimization parameter, optimization goal, suggestion algorithm, and so on) are defined in [random-example.yaml](https://github.com/kubeflow/katib/blob/master/examples/random-example.yaml).
In this demo, hyper-parameters are embedded as args.
You can embed hyper-parameters in another way (e.g. environment values) by using the template defined in `WorkerSpec.GoTemplate.RawTemplate`.
It is written in [go template](https://golang.org/pkg/text/template/) format.

In this demo, 3 hyper parameters 
* Learning Rate (--lr) - type: double
* Number of NN Layer (--num-layers) - type: int
* optimizer (--optimizer) - type: categorical
are randomly generated.

Check the study status.

```
$ kubectl -n kubeflow describe studyjobs random-example
Name:         random-example
Namespace:    kubeflow
Labels:       controller-tools.k8s.io=1.0
Annotations:  <none>
API Version:  kubeflow.org/v1alpha1
Kind:         StudyJob
Metadata:
  Creation Timestamp:  2019-01-18T16:30:46Z
  Finalizers:
    clean-studyjob-data
  Generation:        5
  Resource Version:  1777650
  Self Link:         /apis/kubeflow.org/v1alpha1/namespaces/kubeflow/studyjobs/random-example
  UID:               687a67f9-1b3e-11e9-a0c2-c6456c1f5f0a
Spec:
  Metricsnames:
    accuracy
  Objectivevaluename:  Validation-accuracy
  Optimizationgoal:    0.88
  Optimizationtype:    maximize
  Owner:               crd
  Parameterconfigs:
    Feasible:
      Max:          0.03
      Min:          0.01
    Name:           --lr
    Parametertype:  double
    Feasible:
      Max:          5
      Min:          2
    Name:           --num-layers
    Parametertype:  int
    Feasible:
      List:
        sgd
        adam
        ftrl
    Name:           --optimizer
    Parametertype:  categorical
  Requestcount:     4
  Study Name:       random-example
  Suggestion Spec:
    Request Number:        3
    Suggestion Algorithm:  random
    Suggestion Parameters:
      Name:   SuggestionCount
      Value:  0
  Worker Spec:
    Go Template:
      Raw Template:  apiVersion: batch/v1
kind: Job
metadata:
  name: {{.WorkerID}}
  namespace: kubeflow
spec:
  template:
    spec:
      containers:
      - name: {{.WorkerID}}
        image: katib/mxnet-mnist-example
        command:
        - "python"
        - "/mxnet/example/image-classification/train_mnist.py"
        - "--batch-size=64"
        {{- with .HyperParameters}}
        {{- range .}}
        - "{{.Name}}={{.Value}}"
        {{- end}}
        {{- end}}
      restartPolicy: Never
Status:
  Condition:                    Running
  Early Stopping Parameter Id:  
  Last Reconcile Time:          2019-01-18T16:30:46Z
  Start Time:                   2019-01-18T16:30:46Z
  Studyid:                      y456536bd1e0ad5e
  Suggestion Count:             1
  Suggestion Parameter Id:      i31c2adcab54f891
  Trials:
    Trialid:  ka897d189e024460
    Workeridlist:
      Completion Time:  <nil>
      Condition:        Running
      Kind:             Job
      Start Time:       2019-01-18T16:30:46Z
      Workerid:         ma76ebe2b23fec02
    Trialid:            v9ec0edbb16befd7
    Workeridlist:
      Completion Time:  <nil>
      Condition:        Running
      Kind:             Job
      Start Time:       2019-01-18T16:30:46Z
      Workerid:         yc5053df337dbeec
    Trialid:            be68860be22cfce3
    Workeridlist:
      Completion Time:  <nil>
      Condition:        Running
      Kind:             Job
      Start Time:       2019-01-18T16:30:46Z
      Workerid:         v095e6b93d87e9eb
Events:                 <none>
```

It should start a study and run three jobs with different parameters.
When the `spec.Status.Condition` becomes Completed, the StudyJob is finished.

### TF operator example

To run tf operator example, you have to install volume for it.

If you are using GKE and default StorageClass, you have to create this PVC

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: tfevent-volume
  namespace: kubeflow
  labels:
    type: local
    app: tfjob
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

If you are not using GKE and you don't have StorageClass for dynamic volume provisioning at your cluster, you have to create PVC and PV

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pvc.yaml

kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pv.yaml
```

Finnaly, you can run tf operator example

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfjob-example.yaml
```

You can check study status

```
kubectl -n kubeflow describe studyjobs tfjob-example
```

### Pytorch example

This is example for pytorch operator

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/pytorchjob-example.yaml
```

You can check study status

```
kubectl -n kubeflow describe studyjobs pytorchjob-example
```

## Monitoring results

You can monitor your results in Katib UI. For accessing to Katib UI, you have to install Ambassador.

In your Ksonnet app root, run the following

```
ks generate ambassador ambassador
ks apply ${KF_ENV} -c ambassador
```


After this, you have to port-forward Ambassador service

Kubernetes version 1.9~

```
kubectl port-forward svc/ambassador -n kubeflow 8080:80
```

~1.8
```
kubectl get pods -n kubeflow  # Find one of the Ambassador pods
kubectl port-forward [Ambassador pod] -n kubeflow 8080:80
```

Finally, you can access to Katib UI using this URL: ```http://localhost:8080/katib/```.

## Cleanups

Delete installed components

```
ks delete ${KF_ENV} -c katib
ks delete ${KF_ENV} -c pytorch-operator
ks delete ${KF_ENV} -c tf-job-operator
```

If you create PV for Katib, delete it

```
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/pv/pv.yaml
```

If you create PV and PVC for tf operator delete it

```
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pvc.yaml
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pv.yaml
```

If you deploy Ambassador, delete it

```
ks delete ${KF_ENV} -c ambassador
```

## Metrics collector

Katib has metrics collector to take metrics from each worker. Katib collects metrics from stdout of each worker. Metrics should be printed in {metrics name}={value} style. For example when your objective value name is loss and the metrics are recall and precision, your training container should print like this

```
epoch 1:
loss=0.3
recall=0.5
precision=0.4

epoch 2:
loss=0.2
recall=0.55
precision=0.5
```

Katib will collect all logs of metrics.
