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
bash ./katib/scripts/v1alpha3/deploy.sh
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
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1alpha3/pv/pv.yaml
```

## Running examples

After deploying everything, you can run some examples.

### Example using random algorithm

You can create an Experiment for Katib by defining an Experiment config file. See the 
[random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/v1alpha3/random-example.yaml).

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/random-example.yaml
```

Running this command launches an Experiment. It runs a series of 
training jobs to train models using different hyperparameters and save the 
results.

The configurations for the experiment (hyperparameter feasible space, optimization 
parameter, optimization goal, suggestion algorithm, and so on) are defined in 
[random-example.yaml](https://github.com/kubeflow/katib/blob/master/examples/v1alpha3/random-example.yaml).

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
API Version:  kubeflow.org/v1alpha3
Kind:         Experiment
Metadata:
  Creation Timestamp:  2019-10-29T02:02:25Z
  Finalizers:
    update-prometheus-metrics
  Generation:        2
  Resource Version:  55900050
  Self Link:         /apis/kubeflow.org/v1alpha3/namespaces/kubeflow/experiments/random-example
  UID:               275eee5b-f9f0-11e9-a6cc-00163e01b303
Spec:
  Algorithm:
    Algorithm Name:        random
    Algorithm Settings:    <nil>
  Max Failed Trial Count:  3
  Max Trial Count:         100
  Metrics Collector Spec:
    Collector:
      Kind:  StdOut
  Objective:
    Additional Metric Names:
      accuracy
    Goal:                   0.99
    Objective Metric Name:  Validation-accuracy
    Type:                   maximize
  Parallel Trial Count:     3
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
  Completion Time:  2019-10-29T02:09:12Z
  Conditions:
    Last Transition Time:  2019-10-29T02:02:26Z
    Last Update Time:      2019-10-29T02:02:26Z
    Message:               Experiment is created
    Reason:                ExperimentCreated
    Status:                True
    Type:                  Created
    Last Transition Time:  2019-10-29T02:09:12Z
    Last Update Time:      2019-10-29T02:09:12Z
    Message:               Experiment is running
    Reason:                ExperimentRunning
    Status:                False
    Type:                  Running
    Last Transition Time:  2019-10-29T02:09:12Z
    Last Update Time:      2019-10-29T02:09:12Z
    Message:               Experiment has succeeded because max trial count has reached
    Reason:                ExperimentSucceeded
    Status:                True
    Type:                  Succeeded
  Current Optimal Trial:
    Observation:
      Metrics:
        Name:   Validation-accuracy
        Value:  0.978702
    Parameter Assignments:
      Name:          --lr
      Value:         0.016331188424169637
      Name:          --num-layers
      Value:         4
      Name:          --optimizer
      Value:         sgd
  Start Time:        2019-10-29T02:02:26Z
  Trials:            100
  Trials Succeeded:  100
Events:              <none>
```

The demo should start an experiment and run three jobs with different parameters.
When the `spec.Status.Condition` changes to *Completed*, the experiment is 
finished.

### TensorFlow operator example

This is an example for the Tensorflow operator:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/tfjob-example.yaml
```

You can check the status of the experiment:

```
kubectl -n kubeflow describe experiment tfjob-example
```

### PyTorch example

This is an example for the PyTorch operator:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/pytorchjob-example.yaml
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
bash ./scripts/v1alpha3/undeploy.sh
```

If you created a PV for Katib, delete it:

```
kubectl delete -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1alpha3/pv/pv.yaml
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

Katib adds metrics collector sidecar container to training Pod to collect metrics
from training container when training job done.
