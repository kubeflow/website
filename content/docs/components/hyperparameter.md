+++
title = "Hyperparameter Tuning (Katib)"
description = "Using Katib to tune your model's hyperparameters on Kubernetes"
weight = 5
+++

The [Katib](https://github.com/kubeflow/katib) project is inspired by 
[Google vizier](https://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/bcb15507f4b52991a0783013df4222240e942381.pdf). 
Katib is a scalable and flexible hyperparameter tuning framework and is tightly 
integrated with Kubernetes. It does not depend on any specific deep learning 
framework (such as TensorFlow, MXNet, or PyTorch).

## Installing Katib

To run Katib jobs, you must install the required packages as shown in this
section.

In your ksonnet application's root directory, run the following commands:

```
export KF_ENV=default
ks env set ${KF_ENV} --namespace=kubeflow
ks registry add kubeflow github.com/kubeflow/kubeflow/tree/master/kubeflow
```

The `KF_ENV` environment variable represents a conceptual deployment environment 
such as development, test, staging, or production, as defined by 
ksonnet. For this example, we use the `default` environment.

You can read more about Kubeflow's use of ksonnet in the Kubeflow 
[ksonnet component guide](/docs/components/ksonnet/).

### TFJob (tf-operator)

To install a TensorFlow job operator, run the following commands:

```
ks pkg install kubeflow/tf-training
ks pkg install kubeflow/common
ks generate tf-job-operator tf-job-operator
ks apply ${KF_ENV} -c tf-job-operator
```

### PyTorch operator

To install a PyTorch job operator, run the following commands:

```
ks pkg install kubeflow/pytorch-job
ks generate pytorch-operator pytorch-operator
ks apply ${KF_ENV} -c pytorch-operator
```

### Katib

Then run the following commands to install Katib:

```
ks pkg install kubeflow/katib
ks generate katib katib
ks apply ${KF_ENV} -c katib
```

If you want to use Katib outside Google Kubernetes Engine (GKE) and you don't 
have a StorageClass for  dynamic volume provisioning in your cluster, you must 
create a persistent volume  (PV) to bind your persistent volume claim (PVC).

This is the YAML file for a PV:

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

After deploying the Katib package, run the following command to create the PV:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/pv/pv.yaml
```

## Running examples

After deploying everything, you can run some examples.

### Example using random algorithm

You can create a StudyJob for Katib by defining a StudyJob config file. See the 
[random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/random-example.yaml).

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/random-example.yaml
```

Running this command launches a StudyJob. The study job runs a series of 
training jobs to train models using different hyperparameters and save the 
results.

The configurations for the study (hyper-parameter feasible space, optimization 
parameter, optimization goal, suggestion algorithm, and so on) are defined in 
[random-example.yaml](https://github.com/kubeflow/katib/blob/master/examples/random-example.yaml).

In this demo, hyper-parameters are embedded as args.
You can embed hyper-parameters in another way (for example, environment values) 
by using the template defined in `WorkerSpec.GoTemplate.RawTemplate`.
It is written in [go template](https://golang.org/pkg/text/template/) format.

This demo randomly generates 3 hyper parameters:

* Learning Rate (--lr) - type: double
* Number of NN Layer (--num-layers) - type: int
* optimizer (--optimizer) - type: categorical

Check the study status:

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

The demo should start a study and run three jobs with different parameters.
When the `spec.Status.Condition` changes to *Completed*, the StudyJob is 
finished.

### TensorFlow operator example

To run the TensorFlow operator example, you must install a volume.

If you are using GKE and default StorageClass, you must create this PVC:

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

If you are not using GKE and you don't have StorageClass for dynamic volume 
provisioning in your cluster, you must create a PVC and a PV:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pvc.yaml

kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pv.yaml
```

Now you can run the TensorFlow operator example:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfjob-example.yaml
```

You can check the status of the study:

```
kubectl -n kubeflow describe studyjobs tfjob-example
```

### PyTorch example

This is an example for the PyTorch operator:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/pytorchjob-example.yaml
```

You can check the status of the study:

```
kubectl -n kubeflow describe studyjobs pytorchjob-example
```

## Monitoring results

You can monitor your results in the Katib UI. To access the Katib UI, you must 
install Ambassador.

In your ksonnet application's root directory, run the following commands:

```
ks generate ambassador ambassador
ks apply ${KF_ENV} -c ambassador
```

Then port-forward the Ambassador service:

* For Kubernetes version 1.9 and later:

    ```
    kubectl port-forward svc/ambassador -n kubeflow 8080:80
    ```

* For Kubernetes version 1.8 and earlier:

    ```
    kubectl get pods -n kubeflow  # Find one of the Ambassador pods
    kubectl port-forward [Ambassador pod] -n kubeflow 8080:80
    ```

Now you can access the Katib UI at this URL: ```http://localhost:8080/katib/```.

## Cleanup

Delete the installed components:

```
ks delete ${KF_ENV} -c katib
ks delete ${KF_ENV} -c pytorch-operator
ks delete ${KF_ENV} -c tf-job-operator
```

If you created a PV for Katib, delete it:

```
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/pv/pv.yaml
```

If you created a PV and PVC for the TensorFlow operator, delete it:

```
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pvc.yaml
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/tfevent-volume/tfevent-pv.yaml
```

If you deployed Ambassador, delete it:

```
ks delete ${KF_ENV} -c ambassador
```

## Metrics collector

Katib has a metrics collector to take metrics from each worker. Katib collects 
metrics from stdout of each worker. Metrics should print in the following
format: `{metrics name}={value}`. For example, when your objective value name 
is `loss` and the metrics are `recall` and `precision`, your training container
should print like this:

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

Katib collects all logs of metrics.
