+++
title = "Getting started with Katib"
description = "How to set up Katib and run some hyperparameter tuning examples"
weight = 20
+++

This page gets you started with Katib. Follow this guide to perform any
additional setup you may need, depending on your environment, and to run a few
examples using the command line and the Katib user interface (UI).

For an overview of the concepts around Katib and hyperparameter tuning, read the
[introduction to 
Katib](/docs/components/hyperparameter-tuning/overview/).

## Katib setup

This section describes some configurations that you may need to add to your
Kubernetes cluster, depending on the way you're using Kubeflow and Katib.

### Installing Katib

You can skip this step if you have already installed Kubeflow. Your Kubeflow
deployment includes Katib. 

To install Katib as part of Kubeflow, follow the 
[Kubeflow installation guide](/docs/started/getting-started/).

If you want to install Katib separately from Kubeflow, or to get a later version
of Katib, run the following commands to install Katib directly from its 
repository on GitHub and deploy Katib to your cluster:

```
git clone https://github.com/kubeflow/katib
bash ./katib/scripts/v1alpha3/deploy.sh
```

### Setting up persistent volumes

You can skip this step if you're using Kubeflow on Google Kubernetes Engine 
(GKE) or if your Kubernetes cluster includes a StorageClass for dynamic volume 
provisioning. For more information, see the Kubernetes documentation on
[dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)
and [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

If you're using Katib outside GKE and your cluster doesn't include a 
StorageClass for dynamic volume provisioning, you must create a persistent 
volume (PV) to bind to the persistent volume claim (PVC) required by Katib. 

After deploying Katib to your cluster, run the following command to create the 
PV:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1alpha3/pv/pv.yaml
```

The above `kubectl create` command uses a YAML file 
([`pv.yaml`](https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1alpha3/pv/pv.yaml))
that defines the properties of the PV.

<a id="katib-ui"></a>
## Accessing the Katib UI

You can use the Katib user interface (UI) to submit experiments and to monitor 
your results. The Katib home page within Kubeflow looks like this:

<img src="/docs/images/katib-home.png" 
  alt="The Katib home page within the Kubeflow UI"
  class="mt-3 mb-3 border border-info rounded">

If you installed Katib as part of Kubeflow, you can access the 
Katib UI from the Kubeflow UI:

1. Open the Kubeflow UI. See the guide to 
  [accessing the Kubeflow UI](/docs/other-guides/accessing-uis/).
1. Click **Katib** in the left-hand menu.

Alternatively, you can set port-forwarding for the Katib UI service:

```
kubectl port-forward svc/katib-ui -n kubeflow 8080:80
```

Then you can access the Katib UI at this URL:

```
http://localhost:8080/katib/
```

## Examples

This section introduces some examples that you can run to try Katib.

<a id="random-algorithm"></a>
### Example using random algorithm

You can create an experiment for Katib by defining the experiment in a YAML 
configuration file. The YAML file defines the configurations for the experiment,
including the hyperparameter feasible space, optimization parameter, 
optimization goal, suggestion algorithm, and so on.

This example uses the [YAML file for the
random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/v1alpha3/random-example.yaml).

The random algorithm example uses an MXNet neural network to train an image
classification model using the MNIST dataset. The experiment runs three 
training jobs with various hyperparameters and saves the results.

Run the following command to launch an experiment using the random algorithm
example:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/random-example.yaml
```

This example embeds the hyperparameters as arguments. You can embed
hyperparameters in another way (for example, using environment variables) 
by using the template defined in the `TrialTemplate.GoTemplate.RawTemplate`
section of the YAML file. The template uses the 
[Go template format](https://golang.org/pkg/text/template/).

This example randomly generates the following hyperparameters:

* `--lr`: Learning rate. Type: double.
* `--num-layers`: Number of layers in the neural network. Type: integer.
* `--optimizer`: Optimizer. Type: categorical.

Check the experiment status:

```
kubectl -n kubeflow describe experiment random-example
```

The output of the above command should look similar to this:

```
Name:         random-example
Namespace:    kubeflow
Labels:       controller-tools.k8s.io=1.0
Annotations:  <none>
API Version:  kubeflow.org/v1alpha3
Kind:         Experiment
Metadata:
  Creation Timestamp:  2019-12-22T22:53:25Z
  Finalizers:
    update-prometheus-metrics
  Generation:        2
  Resource Version:  720692
  Self Link:         /apis/kubeflow.org/v1alpha3/namespaces/kubeflow/experiments/random-example
  UID:               dc6bc15a-250d-11ea-8cae-42010a80010f
Spec:
  Algorithm:
    Algorithm Name:        random
    Algorithm Settings:    <nil>
  Max Failed Trial Count:  3
  Max Trial Count:         12
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
      Raw Template:  apiVersion: batch/v1
kind: Job
metadata:
  name: {{.Trial}}
  namespace: {{.NameSpace}}
spec:
  template:
    spec:
      containers:
      - name: {{.Trial}}
        image: docker.io/kubeflowkatib/mxnet-mnist-example
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
  Conditions:
    Last Transition Time:  2019-12-22T22:53:25Z
    Last Update Time:      2019-12-22T22:53:25Z
    Message:               Experiment is created
    Reason:                ExperimentCreated
    Status:                True
    Type:                  Created
    Last Transition Time:  2019-12-22T22:55:10Z
    Last Update Time:      2019-12-22T22:55:10Z
    Message:               Experiment is running
    Reason:                ExperimentRunning
    Status:                True
    Type:                  Running
  Current Optimal Trial:
    Observation:
      Metrics:
        Name:   Validation-accuracy
        Value:  0.981091
    Parameter Assignments:
      Name:          --lr
      Value:         0.025139701133432946
      Name:          --num-layers
      Value:         4
      Name:          --optimizer
      Value:         sgd
  Start Time:        2019-12-22T22:53:25Z
  Trials:            12
  Trials Running:    2
  Trials Succeeded:  10
Events:              <none>
```

When the last value in `Status.Conditions.Type` is `Succeeded`, the experiment
is complete.

View the results of the experiment in the Katib UI:

1. Open the Katib UI as described [above](#katib-ui).
1. Click **Hyperparameter Tuning** on the Katib home page.
1. Open the Katib drop-down menu on the left, then open the **HP** section and
  click **Monitor**:

    <img src="/docs/images/katib-menu.png" 
      alt="The Katib drop-down menu"
      class="mt-3 mb-3 border border-info rounded">

1. Click on the right-hand panel to close the drop-down menu. You should see
  the list of experiments:

    <img src="/docs/images/katib-experiments.png" 
      alt="The random example in the list of Katib experiments"
      class="mt-3 mb-3 border border-info rounded">

1. Click the name of the experiment, **random-example**.
1. You should see a graph showing the level of accuracy for various 
  combinations of the hyperparameter values (learning rate, number of layers, 
  and optimizer):

    <img src="/docs/images/katib-random-example-graph.png" 
      alt="Graph produced by the random example"
      class="mt-3 mb-3 border border-info rounded">

1. Below the graph is a list of trials that ran within the experiment:

    <img src="/docs/images/katib-random-example-trials.png" 
      alt="Trials that ran during the experiment"
      class="mt-3 mb-3 border border-info rounded">


### TensorFlow operator example

Run the following command to launch an experiment using the Kubeflow's 
TensorFlow training job operator, TFJob:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/tfjob-example.yaml
```

You can check the status of the experiment:

```
kubectl -n kubeflow describe experiment tfjob-example
```

Follow the steps as described for the *random algorithm example* above, 
to see the results of the experiment in the Katib UI.

### PyTorch example

Run the following command to launch an experiment using Kubeflow's PyTorch 
training job operator, PyTorchJob:

```
kubectl create -f https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1alpha3/pytorchjob-example.yaml
```

You can check the status of the experiment:

```
kubectl -n kubeflow describe experiment pytorchjob-example
```

Follow the steps as described for the *random algorithm example* above, 
to see the results of the experiment in the Katib UI.

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

## Next steps

For details of how to define your experiment, see the guide to [running an 
experiment](/docs/components/hyperparameter-tuning/experiment/).
