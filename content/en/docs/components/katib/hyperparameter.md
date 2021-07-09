+++
title = "Getting Started with Katib"
description = "How to set up Katib and perform hyperparameter tuning"
weight = 20
                    
+++

This guide shows how to get started with Katib and run a few examples using the
command line and the Katib user interface (UI) to perform hyperparameter tuning.

For an overview of the concepts around Katib and hyperparameter tuning, check the
[introduction to Katib](/docs/components/katib/overview/).

## Katib setup

Let's set up and configure Katib on your Kubernetes cluster with Kubeflow.

<a id="katib-install"></a>

### Installing Katib

You can skip this step if you have already installed Kubeflow. Your Kubeflow
deployment includes Katib.

To install Katib as part of Kubeflow, follow the
[Kubeflow installation guide](/docs/started/getting-started/).

If you want to install Katib separately from Kubeflow, or to get a later version
of Katib, you can use various Katib installs. Run the following command to clone
Katib repository:

```shell
git clone https://github.com/kubeflow/katib
cd katib
```

You can use one of the following Katib installations.

1. **Katib Standalone Installation**

   Run the following command to deploy Katib with the main components
   (`katib-controller`, `katib-ui`, `katib-mysql`, `katib-db-manager`, and `katib-cert-generator`):

   ```shell
   make deploy
   ```

   This installation doesn't require any additional setup on your Kubernetes cluster.

2. **Katib Cert Manager Installation**

   Run the following command to deploy Katib with
   [Cert Manager](https://cert-manager.io/docs/installation/kubernetes/) requirement:

   ```shell
   kustomize build manifests/v1beta1/installs/katib-cert-manager | kubectl apply -f -
   ```

   This installation uses Cert Manager instead of `katib-cert-generator`
   to provision Katib webhooks certificates. You have to deploy Cert Manager on
   your Kubernetes cluster before deploying Katib with this installation.

3. **Katib External DB Installation**

   Run the following command to deploy Katib with custom Database (DB) backend:

   ```shell
   kustomize build manifests/v1beta1/installs/katib-external-db | kubectl apply -f -
   ```

   This installation allows to use custom MySQL DB instead of `katib-mysql`.
   You have to modify appropriate environment variables in the
   [`secrets.env`](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/installs/katib-external-db/secrets.env)
   to point `katib-db-manager` on your custom MySQL DB.
   Learn more about `katib-db-manager` environment variables in
   [this guide](https://www.kubeflow.org/docs/components/katib/env-variables/#katib-db-manager).

4. **Katib on OpenShift**

   Run the following command to deploy Katib on [OpenShift](https://docs.openshift.com/) v4.4+:

   ```shell
   kustomize build ./manifests/v1beta1/installs/katib-openshift | oc apply -f - -l type!=local
   ```

   This installation uses OpenShift service controller instead of `katib-cert-generator`
   to provision Katib webhooks certificates.

Above installations deploy
[PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
for the Katib DB component.

Your Kubernetes cluster must have `StorageClass` for dynamic volume provisioning.
For more information, check the Kubernetes documentation on
[dynamic provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/).

If your cluster doesn't have dynamic volume provisioning, you must manually
deploy [PersistentVolume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)
to bind [PVC](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/mysql/pvc.yaml)
for the Katib DB component.

<a id="katib-ui"></a>

## Accessing the Katib UI

You can use the Katib user interface (UI) to submit experiments and to monitor
your results. The Katib home page within Kubeflow looks like this:

<img src="/docs/components/katib/images/home-page.png"
  alt="The Katib home page within the Kubeflow UI"
  class="mt-3 mb-3 border border-info rounded">

If you installed Katib as part of Kubeflow, you can access the
Katib UI from the Kubeflow UI:

1. Open the Kubeflow UI. Check the guide to
   [accessing the central dashboard](/docs/components/central-dash/overview/).
1. Click **Katib** in the left-hand menu.

Alternatively, you can set port-forwarding for the Katib UI service:

```shell
kubectl port-forward svc/katib-ui -n kubeflow 8080:80
```

Then you can access the Katib UI at this URL:

```shell
http://localhost:8080/katib/
```

Check [this guide](https://github.com/kubeflow/katib/tree/master/pkg/ui/v1beta1)
if you want to contribute to Katib UI.

### The new Katib UI

During Kubeflow 1.3 we have worked on a new iteration of the UI, which is
rewritten in Angular and is utilizing the common code of the other Kubeflow
[dashboards](https://github.com/kubeflow/kubeflow/tree/master/components/crud-web-apps).
While this UI is not yet on par with the current default one, we are actively
working to get it up to speed and provide all the existing functionalities.

The users are currently able to list, delete and create Katib Experiments in
their cluster via this new UI as well as inspect the owned Trials.
One important missing functionalities are the ability to edit the Trial Template
ConfigMaps and view neural architecture search Experiments.

While this UI is not ready to replace the current one we would like to
encourage users to also give it a try and provide us with feedback.

To try it out you should update the Katib UI image `newName` with the new
registry `docker.io/kubeflowkatib/katib-new-ui` in the
[Kustomize manifests](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/installs/katib-standalone/kustomization.yaml#L29).

<img src="/docs/components/katib/images/new-ui.png"
  alt="The Katib new UI"
  class="mt-3 mb-3 border border-info rounded">

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

If you installed Katib as part of Kubeflow, you can't run experiments in the
Kubeflow namespace. Run the following commands to change namespace and launch
an experiment using the random algorithm example:

1. Download the example:

   ```shell
   curl https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/random-example.yaml --output random-example.yaml
   ```

1. Edit `random-example.yaml` and change the following line to use your Kubeflow
   user profile namespace:

   ```shell
   Namespace: kubeflow
   ```

1. (Optional) **Note:** Katib's experiments don't work with
   [Istio sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
   If you are using Kubeflow with
   Istio, you have to disable sidecar injection. To do that, specify this annotation:
   `sidecar.istio.io/inject: "false"` in your experiment's trial template.

   For the provided random example with Kubernetes
   [`Job`](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
   trial template, annotation should be under
   [`.trialSpec.spec.template.metadata.annotations`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/random-example.yaml#L52).
   For the Kubeflow `TFJob` or other training operators check
   [here](/docs/components/training/tftraining/#what-is-tfjob)
   how to set the annotation.

1. Deploy the example:

   ```shell
   kubectl apply -f random-example.yaml
   ```

This example embeds the hyperparameters as arguments. You can embed
hyperparameters in another way (for example, using environment variables)
by using the template defined in the `trialTemplate.trialSpec` section of
the YAML file. The template uses the
[unstructured](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured)
format and substitutes parameters from the `trialTemplate.trialParameters`.
Follow the [trial template guide](/docs/components/katib/trial-template/)
to know more about it.

This example randomly generates the following hyperparameters:

- `--lr`: Learning rate. Type: double.
- `--num-layers`: Number of layers in the neural network. Type: integer.
- `--optimizer`: Optimization method to change the neural network attributes.
  Type: categorical.

Check the experiment status:

```shell
kubectl -n <YOUR_USER_PROFILE_NAMESPACE> get experiment random-example -o yaml
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
  namespace: "<YOUR_USER_PROFILE_NAMESPACE>"
  resourceVersion: "147081981"
  selfLink: /apis/kubeflow.org/v1beta1/namespaces/<YOUR_USER_PROFILE_NAMESPACE>/experiments/random-example
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
is complete. You can check information about the best trial in `status.currentOptimalTrial`.

- `.currentOptimalTrial.bestTrialName` is the trial name.

- `.currentOptimalTrial.observation.metrics` is the `max`, `min` and `latest` recorded values for objective
  and additional metrics.

- `.currentOptimalTrial.parameterAssignments` is the corresponding hyperparameter set.

In addition, `status` shows the experiment's trials with their current status.

<a id="view-ui"></a>

View the results of the experiment in the Katib UI:

1. Open the Katib UI as described [above](#katib-ui).

1. Click **Hyperparameter Tuning** on the Katib home page.

1. Open the Katib menu panel on the left, then open the **HP** section and
   click **Monitor**:

   <img src="/docs/components/katib/images/menu.png"
     alt="The Katib menu panel"
     class="mt-3 mb-3 border border-info rounded">

1. You should be able to view the list of experiments:

   <img src="/docs/components/katib/images/experiment-list.png"
     alt="The random example in the list of Katib experiments"
     class="mt-3 mb-3 border border-info rounded">

1. Click the name of the experiment, **random-example**.

1. There should be a graph showing the level of validation and train accuracy
   for various combinations of the hyperparameter values
   (learning rate, number of layers, and optimizer):

   <img src="/docs/components/katib/images/random-example-graph.png"
     alt="Graph produced by the random example"
     class="mt-3 mb-3 border border-info rounded">

1. Below the graph is a list of trials that ran within the experiment:

   <img src="/docs/components/katib/images/random-example-trials.png"
     alt="Trials that ran during the experiment"
     class="mt-3 mb-3 border border-info rounded">

1. You can click on trial name to get metrics for the particular trial:

   <img src="/docs/components/katib/images/random-example-trial-info.png"
     alt="Trials that ran during the experiment"
     class="mt-3 mb-3 border border-info rounded">

### TensorFlow example

If you installed Katib as part of Kubeflow, you can’t run experiments in the
Kubeflow namespace. Run the following commands to launch an experiment using
the Kubeflow's TensorFlow training job operator, TFJob:

1. Download `tfjob-example.yaml`:

   ```shell
   curl https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/tfjob-example.yaml --output tfjob-example.yaml
   ```

1. Edit `tfjob-example.yaml` and change the following line to use your Kubeflow
   user profile namespace:

   ```shell
   Namespace: kubeflow
   ```

1. (Optional) **Note:** Katib's experiments don't work with
   [Istio sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
   If you are using Kubeflow with
   Istio, you have to disable sidecar injection. To do that, specify this annotation:
   `sidecar.istio.io/inject: "false"` in your experiment's trial template.
   For the provided `TFJob` example check
   [here](/docs/components/training/tftraining/#what-is-tfjob)
   how to set the annotation.

1. Deploy the example:

   ```shell
   kubectl apply -f tfjob-example.yaml
   ```

1. You can check the status of the experiment:

   ```shell
   kubectl -n <YOUR_USER_PROFILE_NAMESPACE> get experiment tfjob-example -o yaml
   ```

Follow the steps as described for the _random algorithm example_
[above](#view-ui) to obtain the results of the experiment in the Katib UI.

### PyTorch example

If you installed Katib as part of Kubeflow, you can’t run experiments in the
Kubeflow namespace. Run the following commands to launch an experiment
using Kubeflow's PyTorch training job operator, PyTorchJob:

1. Download `pytorchjob-example.yaml`:

   ```shell
   curl https://raw.githubusercontent.com/kubeflow/katib/master/examples/v1beta1/pytorchjob-example.yaml --output pytorchjob-example.yaml
   ```

1. Edit `pytorchjob-example.yaml` and change the following line to use your
   Kubeflow user profile namespace:

   ```shell
   Namespace: kubeflow
   ```

1. (Optional) **Note:** Katib's experiments don't work with
   [Istio sidecar injection](https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/#automatic-sidecar-injection).
   If you are using Kubeflow with
   Istio, you have to disable sidecar injection. To do that, specify this annotation:
   `sidecar.istio.io/inject: "false"` in your experiment's trial template.
   For the provided `PyTorchJob` example setting the annotation should be similar to
   [`TFJob`](/docs/components/training/tftraining/#what-is-tfjob)

1. Deploy the example:

   ```shell
   kubectl apply -f pytorchjob-example.yaml
   ```

1. You can check the status of the experiment:

   ```shell
   kubectl -n <YOUR_USER_PROFILE_NAMESPACE> describe experiment pytorchjob-example
   ```

Follow the steps as described for the _random algorithm example_
[above](#view-ui) to get the results of the experiment in the Katib UI.

## Cleaning up

To remove Katib from your Kubernetes cluster run:

```shell
make undeploy
```

## Next steps

- Learn how to
  [configure and run your Katib experiments](/docs/components/katib/experiment/).

- Learn to configure your
  [trial templates](/docs/components/katib/trial-template/).

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
