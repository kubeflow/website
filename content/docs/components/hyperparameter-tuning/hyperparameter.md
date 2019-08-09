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
section. You can do so by following the Kubeflow [deployment guide](/docs/gke/deploy/),
or by installing Katib directly from its repository:
```
git clone https://github.com/kubeflow/katib
./katib/scripts/v1alpha2/deploy.sh
```

### Persistent Volumes
If you want to use Katib outside Google Kubernetes Engine (GKE) and you don't 
have a StorageClass for  dynamic volume provisioning in your cluster, you must 
create a persistent volume (PV) to bind your persistent volume claim (PVC).

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
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1alpha2/pv/pv.yaml
```

## Running examples

After deploying everything, you can run some examples.

### Example using random algorithm

You can create an Experiment for Katib by defining an Experiment config file. See the 
[random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/v1alpha2/random-example.yaml).

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha2/random-example.yaml
```

Running this command launches an Experiment. It runs a series of 
training jobs to train models using different hyperparameters and save the 
results.

The configurations for the experiment (hyperparameter feasible space, optimization 
parameter, optimization goal, suggestion algorithm, and so on) are defined in 
[random-example.yaml](https://github.com/kubeflow/katib/blob/master/examples/v1alpha2/random-example.yaml).

In this demo, hyperparameters are embedded as args.
You can embed hyperparameters in another way (for example, environment values) 
by using the template defined in `TrialTemplate.GoTemplate.RawTemplate`.
It is written in [go template](https://golang.org/pkg/text/template/) format.

This demo randomly generates 3 hyperparameters:

* Learning Rate (--lr) - type: double
* Number of NN Layer (--num-layers) - type: int
* optimizer (--optimizer) - type: categorical

Check the experiment status:

```
$ kubectl -n kubeflow describe experiment random-example
Name:         random-example
Namespace:    kubeflow
Labels:       controller-tools.k8s.io=1.0
Annotations:  <none>
API Version:  kubeflow.org/v1alpha2
Kind:         Experiment
Metadata:
  Creation Timestamp:  2019-01-18T16:30:46Z
  Finalizers:
    clean-data-in-db
  Generation:        5
  Resource Version:  1777650
  Self Link:         /apis/kubeflow.org/v1alpha2/namespaces/kubeflow/experiments/random-example
  UID:               687a67f9-1b3e-11e9-a0c2-c6456c1f5f0a
Spec:
  Algorithm:
    Algorithm Name:  random
    Algorithm Settings:
  Max Failed Trial Count:  3
  Max Trial Count:         100
  Objective:
    Additional Metric Names:
      accuracy
    Goal:                   0.99
    Objective Metric Name:  Validation-accuracy
    Type:                   maximize
  Parallel Trial Count:     10
  Parameters:
    Feasible Space:
      Max:           0.03
      Min:           0.01
    Name:            --lr
    Parameter Type:  double
    Feasible Space:
      Max:           5
      Min:           2
    Name:            --num-layers
    Parameter Type:  int
    Feasible Space:
      List:
        sgd
        adam
        ftrl
    Name:            --optimizer
    Parameter Type:  categorical
  Trial Template:
    Go Template:
      Template Spec:
        Config Map Name:       trial-template
        Config Map Namespace:  kubeflow
        Template Path:         mnist-trial-template
Status:
  Completion Time:  2019-06-20T00:12:07Z
  Conditions:
    Last Transition Time:  2019-06-19T23:20:56Z
    Last Update Time:      2019-06-19T23:20:56Z
    Message:               Experiment is created
    Reason:                ExperimentCreated
    Status:                True
    Type:                  Created
    Last Transition Time:  2019-06-20T00:12:07Z
    Last Update Time:      2019-06-20T00:12:07Z
    Message:               Experiment is running
    Reason:                ExperimentRunning
    Status:                False
    Type:                  Running
    Last Transition Time:  2019-06-20T00:12:07Z
    Last Update Time:      2019-06-20T00:12:07Z
    Message:               Experiment has succeeded because max trial count has reached
    Reason:                ExperimentSucceeded
    Status:                True
    Type:                  Succeeded
  Current Optimal Trial:
    Observation:
      Metrics:
        Name:   Validation-accuracy
        Value:  0.982483983039856
    Parameter Assignments:
      Name:          --lr
      Value:         0.026666666666666665
      Name:          --num-layers
      Value:         2
      Name:          --optimizer
      Value:         sgd
  Start Time:        2019-06-19T23:20:55Z
  Trials:            100
  Trials Succeeded:  100
Events:                 <none>
```

The demo should start an experiment and run three jobs with different parameters.
When the `spec.Status.Condition` changes to *Completed*, the experiment is 
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
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha2/tfevent-volume/tfevent-pvc.yaml

kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha2/tfevent-volume/tfevent-pv.yaml
```

Now you can run the TensorFlow operator example:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha2/tfjob-example.yaml
```

You can check the status of the experiment:

```
kubectl -n kubeflow describe experiment tfjob-example
```

### PyTorch example

This is an example for the PyTorch operator:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha2/pytorchjob-example.yaml
```

You can check the status of the experiment:

```
kubectl -n kubeflow describe experiment pytorchjob-example
```

## Monitoring results

You can monitor your results in the Katib UI. If you installed Kubeflow
using the deployment guide, you can access the Katib UI at
```
https://<your kubeflow endpoint>/katib/
```

For example, if you deployed Kubeflow on GKE, your endpoint would be
```
https://<deployment_name>.endpoints.<project>.cloud.goog/
```

Otherwise, you can set port-forwarding for the Katib UI service:

```
kubectl port-forward svc/katib-ui -n kubeflow 8080:80
```

Now you can access the Katib UI at this URL: ```http://localhost:8080/katib/```.

## Cleanup

Delete the installed components:

```
./scripts/v1alpha2/undeploy.sh
```

If you created a PV for Katib, delete it:

```
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1alpha2/pv/pv.yaml
```

If you created a PV and PVC for the TensorFlow operator, delete it:

```
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha2/tfevent-volume/tfevent-pvc.yaml
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha2/tfevent-volume/tfevent-pv.yaml
```

## Metrics collector

Katib has a metrics collector to take metrics from each trial. Katib collects
metrics from stdout of each trial. Metrics should print in the following
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

Katib periodically launches CronJobs to collect metrics from pods.
