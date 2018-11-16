+++
title = "Hyperparameter Tuning (Katib)"
description = "Hyperparameter Tuning (Katib)"
weight = 10
toc = true
[menu]
[menu.docs]
  parent = "components"
  weight = 5
+++

## Using Katib

Currently we are using port-forwarding to access the katib services.
kubernetes version 1.9~
```
kubectl -n kubeflow port-forward svc/katib-ui 8000:80
```
~1.8
```
kubectl get pod -n kubeflow  # Find your katib-ui pods
kubectl port-forward -n kubeflow [katib-ui pod] 8000:80 &
```
## Creating a Study Job
You can create Study Job for Katib by defining a StudyJob config file.
See [random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/random-example.yaml).

```
$ kubectl apply -f random-example.yaml
```
Running this command will launch a StudyJob. The study job will run a series of training jobs to train models using different hyperparameters and save the results.
The configurations for the study (hyper-parameter feasible space, optimization parameter, optimization goal, suggestion algorithm, and so on) are defined in `random-example.yaml`,
In this demo, hyper-parameters are embedded as args.
You can embed in another way (e.g. eviroment values) by using this template.
It defined in `WorkerSpec.GoTemplate.RawTemplate`.
It is written in [go template](https://golang.org/pkg/text/template/) format.

In this demo, 3 hyper parameters 
* Learning Rate (--lr) - type: double
* Number of NN Layer (--num-layers) - type: int
* optimizer (--optimizer) - type: categorical
are randomly generated.

```
$ kubectl -n katib get studyjob
```

Check the study status.

```
$ kubectl -n katib describe studyjobs random-example
Name:         random-example
Namespace:    kubeflow
Labels:       controller-tools.k8s.io=1.0
Annotations:  kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"kubeflow.org/v1alpha1","kind":"StudyJob","metadata":{"annotations":{},"labels":{"controller-tools.k8s.io":"1.0"},"name":"random-example"...
API Version:  kubeflow.org/v1alpha1
Kind:         StudyJob
Metadata:
  Cluster Name:
  Creation Timestamp:  2018-08-15T01:29:13Z
  Generation:          0
  Resource Version:    173289
  Self Link:           /apis/kubeflow.org/v1alpha1/namespaces/katib/studyjobs/random-example
  UID:                 9e136400-a02a-11e8-b88c-42010af0008b
Spec:
  Study Spec:
    Metricsnames:
      accuracy
    Name:                random-example
    Objectivevaluename:  Validation-accuracy
    Optimizationgoal:    0.98
    Optimizationtype:    maximize
    Owner:               crd
    Parameterconfigs:
      Feasible:
        Max:          0.03
        Min:          0.01
      Name:           --lr
      Parametertype:  double
      Feasible:
        Max:          3
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
  Suggestion Spec:
    Request Number:         3
    Suggestion Algorithm:   random
    Suggestion Parameters:  <nil>
  Worker Spec:
    Command:
      python
      /mxnet/example/image-classification/train_mnist.py
      --batch-size=64
    Image:        katib/mxnet-mnist-example
    Worker Type:  Default
Status:
  Best Objctive Value:          <nil>
  Conditon:                     Running
  Early Stopping Parameter Id:
  Studyid:                      qb397cc06d1f8302
  Suggestion Parameter Id:
  Trials:
    Trialid:  p18ee16163b85678
    Workeridlist:
      Objctive Value:  <nil>
      Conditon:        Running
      Workerid:        td08f74b9939350d
    Trialid:           pb1be3dbe53a5cb0
    Workeridlist:
      Objctive Value:  <nil>
      Conditon:        Running
      Workerid:        p2b23e25cce4092c
    Trialid:           m64209fe0867e91a
    Workeridlist:
      Objctive Value:  <nil>
      Conditon:        Running
      Workerid:        q6258c1ac98a00a5
Events:                <none>
```

It should start a study and run two jobs with different parameters.

Go to http://localhost:8000/katib to see the result.
