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
Katib](/docs/components/katib/overview/).

## Katib setup

This section describes some configurations that you may need to add to your
Kubernetes cluster, depending on the way you're using Kubeflow and Katib.

<a id="katib-install"></a>

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
make deploy
```

### Setting up persistent volumes

If you used [above script](#katib-install) to deploy Katib, you can skip this step. This script deploys PVC and PV on your cluster.

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
kubectl apply -f https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1beta1/pv/pv.yaml
```

The above `kubectl apply` command uses a YAML file
([`pv.yaml`](https://raw.githubusercontent.com/kubeflow/katib/master/manifests/v1beta1/pv/pv.yaml))
that defines the properties of the PV.

<a id="katib-ui"></a>

## Accessing the Katib UI

You can use the Katib user interface (UI) to submit experiments and to monitor
your results. The Katib home page within Kubeflow looks like this:

<img src="/docs/images/katib/katib-home.png"
  alt="The Katib home page within the Kubeflow UI"
  class="mt-3 mb-3 border border-info rounded">

If you installed Katib as part of Kubeflow, you can access the
Katib UI from the Kubeflow UI:

1. Open the Kubeflow UI. See the guide to
   [accessing the central dashboard](/docs/components/central-dash/overview/).
1. Click **Katib** in the left-hand menu.

Alternatively, you can set port-forwarding for the Katib UI service:

```
kubectl port-forward svc/katib-ui -n kubeflow 8080:80
```

Then you can access the Katib UI at this URL:

```
http://localhost:8080/katib/
```

Check [this guide](https://github.com/kubeflow/katib/tree/master/pkg/ui/v1beta1)
if you want to contribute to Katib UI.

## Examples

This section introduces some examples that you can run to try Katib.

<a id="random-algorithm"></a>

### Example using random algorithm

You can create an experiment for Katib by defining the experiment in a YAML
configuration file. The YAML file defines the configurations for the experiment,
including the hyperparameter feasible space, optimization parameter,
optimization goal, suggestion algorithm, and so on.

This example uses the [YAML file for the
random algorithm example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/random-example.yaml).

The random algorithm example uses an MXNet neural network to train an image
classification model using the MNIST dataset. You can check training container source code
[here](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/mxnet-mnist).
The experiment runs twelve training jobs with various hyperparameters and saves the results.

If you installed Katib as part of Kubeflow, you can't run experiments in Kubeflow namespace.
Run the following commands to change namespace and launch an experiment using the random algorithm
example:

1. Download the example:

   ```
   curl https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/random-example.yaml --output random-example.yaml
   ```

1. Edit `random-example.yaml` and change the following line to use your Kubeflow user profile namespace:

   ```
   Namespace: kubeflow
   ```

1. Deploy the example:
   ```
   kubectl apply -f random-example.yaml
   ```

This example embeds the hyperparameters as arguments. You can embed
hyperparameters in another way (for example, using environment variables)
by using the template defined in the `trialTemplate.trialSpec`
section of the YAML file. The template uses the
[unstructured format](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured) and substitutes parameters from
`trialTemplate.trialParameters`.

This example randomly generates the following hyperparameters:

- `--lr`: Learning rate. Type: double.
- `--num-layers`: Number of layers in the neural network. Type: integer.
- `--optimizer`: Optimizer. Type: categorical.

Check the experiment status:

```
kubectl -n <your user profile namespace> get experiment random-example -o yaml
```

The output of the above command should look similar to this:

```yaml
apiVersion: kubeflow.org/v1beta1
kind: Experiment
metadata:
  creationTimestamp: "2020-10-23T21:27:53Z"
  finalizers:
    - update-prometheus-metrics
  generation: 1
  name: random-example
  namespace: "<your user profile namespace>"
  resourceVersion: "147081981"
  selfLink: /apis/kubeflow.org/v1beta1/namespaces/<your user profile namespace>/experiments/random-example
  uid: fb3776e8-0f83-4783-88b6-80d06867ca0b
spec:
  algorithm:
    algorithmName: random
  maxFailedTrialCount: 3
  maxTrialCount: 12
  metricsCollectorSpec:
    collector:
      kind: StdOut
  objective:
    additionalMetricNames:
      - Train-accuracy
    goal: 0.99
    metricStrategies:
      - name: Validation-accuracy
        value: max
      - name: Train-accuracy
        value: max
    objectiveMetricName: Validation-accuracy
    type: maximize
  parallelTrialCount: 3
  parameters:
    - feasibleSpace:
        max: "0.03"
        min: "0.01"
      name: lr
      parameterType: double
    - feasibleSpace:
        max: "5"
        min: "2"
      name: num-layers
      parameterType: int
    - feasibleSpace:
        list:
          - sgd
          - adam
          - ftrl
      name: optimizer
      parameterType: categorical
  resumePolicy: LongRunning
  trialTemplate:
    failureCondition: status.conditions.#(type=="Failed")#|#(status=="True")#
    primaryContainerName: training-container
    successCondition: status.conditions.#(type=="Complete")#|#(status=="True")#
    trialParameters:
      - description: Learning rate for the training model
        name: learningRate
        reference: lr
      - description: Number of training model layers
        name: numberLayers
        reference: num-layers
      - description: Training model optimizer (sdg, adam or ftrl)
        name: optimizer
        reference: optimizer
    trialSpec:
      apiVersion: batch/v1
      kind: Job
      spec:
        template:
          metadata:
            annotations:
              sidecar.istio.io/inject: "false"
          spec:
            containers:
              - command:
                  - python3
                  - /opt/mxnet-mnist/mnist.py
                  - --batch-size=64
                  - --lr=${trialParameters.learningRate}
                  - --num-layers=${trialParameters.numberLayers}
                  - --optimizer=${trialParameters.optimizer}
                image: docker.io/kubeflowkatib/mxnet-mnist:v1beta1-e294a90
                name: training-container
            restartPolicy: Never
status:
  conditions:
    - lastTransitionTime: "2020-10-23T21:27:53Z"
      lastUpdateTime: "2020-10-23T21:27:53Z"
      message: Experiment is created
      reason: ExperimentCreated
      status: "True"
      type: Created
    - lastTransitionTime: "2020-10-23T21:28:13Z"
      lastUpdateTime: "2020-10-23T21:28:13Z"
      message: Experiment is running
      reason: ExperimentRunning
      status: "True"
      type: Running
  currentOptimalTrial:
    bestTrialName: random-example-smpc6ws2
    observation:
      metrics:
        - latest: "0.993170"
          max: "0.993170"
          min: "0.920293"
          name: Train-accuracy
        - latest: "0.978006"
          max: "0.978603"
          min: "0.959295"
          name: Validation-accuracy
    parameterAssignments:
      - name: lr
        value: "0.02889324678979306"
      - name: num-layers
        value: "5"
      - name: optimizer
        value: sgd
  runningTrialList:
    - random-example-26d5wzn2
    - random-example-98fpd29m
    - random-example-x2vjlzzv
  startTime: "2020-10-23T21:27:53Z"
  succeededTrialList:
    - random-example-n9c4j4cv
    - random-example-qfb68jpb
    - random-example-s96tq48v
    - random-example-smpc6ws2
  trials: 7
  trialsRunning: 3
  trialsSucceeded: 4
```

When the last value in `status.conditions.type` is `Succeeded`, the experiment
is complete. You can see information about the best trial in `status.currentOptimalTrial`.

- `.currentOptimalTrial.bestTrialName` is the trial name.

- `.currentOptimalTrial.observation.metrics` is the `max`, `min` and `latest` recorded values for objective
  and additional metrics.

- `.currentOptimalTrial.parameterAssignments` is the corresponding hyperparameter set.

As well, `status` shows experiment's trials with the current statuses.

<a id="view-ui"></a>
View the results of the experiment in the Katib UI:

1. Open the Katib UI as described [above](#katib-ui).
1. Click **Hyperparameter Tuning** on the Katib home page.
1. Open the Katib menu panel on the left, then open the **HP** section and
   click **Monitor**:

   <img src="/docs/images/katib/katib-menu.png"
       alt="The Katib menu panel"
       class="mt-3 mb-3 border border-info rounded">

1. You should see the list of experiments:

   <img src="/docs/images/katib/katib-experiments.png"
     alt="The random example in the list of Katib experiments"
     class="mt-3 mb-3 border border-info rounded">

1. Click the name of the experiment, **random-example**.
1. You should see a graph showing the level of validation and train accuracy for various
   combinations of the hyperparameter values (learning rate, number of layers,
   and optimizer):

   <img src="/docs/images/katib/katib-random-example-graph.png"
       alt="Graph produced by the random example"
       class="mt-3 mb-3 border border-info rounded">

1. Below the graph is a list of trials that ran within the experiment:

   <img src="/docs/images/katib/katib-random-example-trials.png"
     alt="Trials that ran during the experiment"
     class="mt-3 mb-3 border border-info rounded">

1. You can click on trial name to see metrics for the particular trial:

   <img src="/docs/images/katib/katib-random-example-trial-info.png"
     alt="Trials that ran during the experiment"
     class="mt-3 mb-3 border border-info rounded">

### TensorFlow example

If you installed Katib as part of Kubeflow, you can’t run experiments in Kubeflow namespace.
Run the following commands to launch an experiment using the Kubeflow's
TensorFlow training job operator, TFJob:

1. Download the tfjob-example.yaml file

   ```
   curl https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/tfjob-example.yaml --output tfjob-example.yaml
   ```

1. Edit `tfjob-example.yaml` and change the following line to use your Kubeflow user profile namespace:

   ```
   Namespace: kubeflow
   ```

1. Deploy the example:

   ```
   kubectl apply -f tfjob-example.yaml
   ```

1. You can check the status of the experiment:
   ```
   kubectl -n <your user profile namespace> describe experiment tfjob-example
   ```

Follow the steps as described for the _random algorithm example_
[above](#view-ui), to see the results of the experiment in the Katib UI.

### PyTorch example

If you installed Katib as part of Kubeflow, you can’t run experiments in Kubeflow namespace.
Run the following commands to launch an experiment using Kubeflow's PyTorch
training job operator, PyTorchJob:

1. Download the pytorchjob-example.yaml file

   ```
   curl https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/pytorchjob-example.yaml --output pytorchjob-example.yaml
   ```

1. Edit `pytorchjob-example.yaml` and change the following line to use your Kubeflow user profile namespace:

   ```
   Namespace: kubeflow
   ```

1. Deploy the example:

   ```
   kubectl apply -f pytorchjob-example.yaml
   ```

1. You can check the status of the experiment:
   ```
   kubectl -n <your user profile namespace> describe experiment pytorchjob-example
   ```

Follow the steps as described for the _random algorithm example_
[above](#view-ui), to see the results of the experiment in the Katib UI.

## Cleanup

To delete Katib from Kubernetes cluster run::

```
make undeploy
```

## Next steps

- For details of how to configure and run your experiment, see the guide to
  [running an experiment](/docs/components/katib/experiment/).

- For a detailed instruction of the Katib Configuration file,
  read the [Katib config page](/docs/components/katib/katib-config/).

- See how you can change installation of Katib component in the [environment variables guide](/docs/components/katib/env-variables/).