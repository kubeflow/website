+++
title = "How to use Trial Templates"
description = "Trial template parameters overview and how use CRDs with Katib Trials"
weight = 60
+++

This guide describes how to configure Trial template parameters and use custom
[Kubernetes CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
in Katib Trials. You will learn about changing trial template specification, how to use
[Kubernetes ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
to store templates and how to modify Katib controller to support your
Kubernetes CRD in Katib experiments.

Katib dynamically supports any kind of Kubernetes CRD as Trial's Worker.
In Katib examples, you can find the following examples for Trial's Workers:

- [Kubernetes `Job`](https://kubernetes.io/docs/concepts/workloads/controllers/job/)

- [Kubeflow `TFJob`](/docs/components/training/user-guide/tensorflow)

- [Kubeflow `PyTorchJob`](/docs/components/training/user-guide/pytorch/)

- [Kubeflow `MXJob`](/docs/components/training/user-guide/mxnet)

- [Kubeflow `XGBoostJob`](/docs/components/training/user-guide/xgboost)

- [Kubeflow `MPIJob`](/docs/components/training/user-guide/mpi)

- [Tekton `Pipelines`](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/tekton)

- [Argo `Workflows`](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/argo)

To use your own Kubernetes resource follow the steps [below](#use-crds-with-trial-template).

## How to use Trial Template

To run the Katib experiment you have to specify a Trial template for your
Worker job where actual training is running. Learn more about Katib concepts
in the [architecture guide](/docs/components/katib/refrence/architecture).

### Configure Trial Template Specification

Trial template specification is located under `.spec.trialTemplate` of your experiment.
To define Trial, you should specify these parameters in `.spec.trialTemplate`:

- `trialParameters` - list of the parameters which are used in the trial template
  during experiment execution.

  **Note:** Your trial template must contain each parameter from the `trialParameters`. You can
  set these parameters in any field of your template, except `.metadata.name` and
  `.metadata.namespace`. For example, your training container can receive
  hyperparameters as command-line or arguments or as environment variables.

  Your Experiment's Suggestion produces `trialParameters` before running the trial.
  Each `trialParameter` has these structure:

  - `name` - the parameter name that is replaced in your template.

  - `description` (optional) - the description of the parameter.

  - `reference` - the parameter name that experiment's suggestion returns. Usually, for the
    hyperparameter tuning parameter references are equal to the experiment search space. For example,
    in grid example search space has [three parameters](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/hp-tuning/grid.yaml#L17-L29) (`lr`, `momentum`) and `trialParameters` contains each of these parameters in
    [`reference`](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/hp-tuning/grid.yaml#L32-L39).

- You have to define your Trial template in **one** of the `trialSpec` or `configMap` sources.

  **Note:** Your template must omit `.metadata.name` and `.metadata.namespace`.

  To set the parameters from the `trialParameters`, you need to use this expression:
  `${trialParameters.<parameter-name>}` in your template. Katib automatically replaces it with
  the appropriate values from the Suggestion.

  For example, `--lr=${trialParameters.learningRate}` is the `learningRate` parameter.

  - `trialSpec` - the Trial template in
    [unstructured](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured) format.
    The template should be a valid YAML.

  - `configMap` - Kubernetes ConfigMap specification where the Trial template is located.
    This ConfigMap must have the label `katib.kubeflow.org/component: trial-templates` and contains
    key-value pairs, where `key: <template-name>, value: <template-yaml>`. Check the example of the
    [ConfigMap with Trial templates](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/trial-template/trial-configmap-source.yaml).

    The `configMap` specification should have:

    1. `configMapName` - the ConfigMap name with the trial templates.

    1. `configMapNamespace` - the ConfigMap namespace with the trial templates.

    1. `templatePath` - the ConfigMap's data path to the template.

`.spec.trialTemplate` parameters below are used to control Trial behavior. If parameter has the
default value, it can be **omitted** in the Experiment YAML.

- `retain` - indicates that Trials's resources are not clean-up after the trial
  is complete. Check the example with
  [`retain: true`](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/tekton/pipeline-run.yaml#L31) parameter.

  The default value is `false`

- `primaryPodLabels` - the
  [Trial Worker's](/docs/components/katib/reference/architecutre/#worker) Pod or Pods labels.
  These Pods are injected by Katib metrics collector.

  **Note:** If `primaryPodLabels` are **omitted**, the metrics collector wraps all worker's Pods.
  Learn more about [Katib metrics collector](/docs/components/katib/user-guides/metrics-collector)
  Check the example with
  [`primaryPodLabels`](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/kubeflow-training-operator/mpijob-horovod.yaml#L30-L31).

  The default value for Kubeflow `TFJob`, `PyTorchJob`, `MXJob`, and `XGBoostJob` is `job-role: master`

  The `primaryPodLabels` default value works only if you specify your template in
  `.spec.trialTemplate.trialSpec`. For the `configMap` template source you have to manually set
  `primaryPodLabels`.

- `primaryContainerName` - the training container name where actual model training is running.
  Katib metrics collector wraps this container to collect required metrics for the single
  experiment optimization step.

- `successCondition` - The Trial Worker's object
  [status](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
  in which trial's job has succeeded. This condition must be in
  [GJSON format](https://github.com/tidwall/gjson). Check the example with
  [`successCondition`](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/tekton/pipeline-run.yaml#L35).

  The default value for Kubernetes `Job` is
  `status.conditions.#(type=="Complete")#|#(status=="True")#`

  The default value for Kubeflow `TFJob`, `PyTorchJob`, `MXJob`, and `XGBoostJob` is
  `status.conditions.#(type=="Succeeded")#|#(status=="True")#`

  The `successCondition` default value works only if you specify your template
  in `.spec.trialTemplate.trialSpec`. For the `configMap` template source
  you have to manually set `successCondition`.

- `failureCondition` - The Trial Worker's object
  [status](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
  in which trial's job has failed. This condition must be in
  [GJSON format](https://github.com/tidwall/gjson). Check the example with
  [`failureCondition`](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/tekton/pipeline-run.yaml#L36).

  The default value for Kubernetes `Job` is
  `status.conditions.#(type=="Failed")#|#(status=="True")#`

  The default value for Kubeflow `TFJob`, `PyTorchJob`, `MXJob`, and `XGBoostJob` is
  `status.conditions.#(type=="Failed")#|#(status=="True")#`

  The `failureCondition` default value works only if you specify your template in
  `.spec.trialTemplate.trialSpec`. For the `configMap` template source you
  have to manually set `failureCondition`.

### Use Metadata in Trial Template

You can't specify `.metadata.name` and `.metadata.namespace` in your trial template, but you can
get this data during the Experiment run. For example, if you want to append the Trial's name to your
model storage.

To do this, point `.trialParameters[x].reference` to the appropriate metadata parameter and
use `.trialParameters[x].name` in your Trial template.

The table below shows the connection between
`.trialParameters[x].reference` value and trial metadata.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Reference</th>
        <th>Trial metadata</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>${trialSpec.Name}</code></td>
        <td>Trial name</td>
      </tr>
      <tr>
        <td><code>${trialSpec.Namespace}</code></td>
        <td>Trial namespace</td>
      </tr>
      <tr>
        <td><code>${trialSpec.Kind}</code></td>
        <td>Kubernetes resource kind for the trial's worker</td>
      </tr>
      <tr>
        <td><code>${trialSpec.APIVersion}</code></td>
        <td>Kubernetes resource APIVersion for the trial's worker</td>
      </tr>
      <tr>
        <td><code>${trialSpec.Labels[custom-key]}</code></td>
        <td>Trial's worker label with <code>custom-key</code> key </td>
      </tr>
      <tr>
        <td><code>${trialSpec.Annotations[custom-key]}</code></td>
        <td>Trial's worker annotation with <code>custom-key</code> key </td>
      </tr>
    </tbody>
  </table>
</div>

Check the example of
[using trial metadata](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/examples/v1beta1/trial-template/trial-metadata-substitution.yaml).

## Use CRDs with Trial Template

It is possible to use your own Kubernetes CRD or other Kubernetes resource
(e.g. [Kubernetes `Deployment`](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/))
as a Trial Worker without modifying Katib controller source code and building the new image.
As long as your CRD creates Kubernetes Pods, allows to inject
the [sidecar container](https://kubernetes.io/docs/concepts/workloads/pods/) on these Pods and has
succeeded and failed status, you can use it in Katib.

To do that, you need to modify Katib components before installing it on your Kubernetes cluster.
Accordingly, you have to know your CRD API group and version, the CRD object's kind.
Also, you need to know which resources your custom object is created. Check the
[Kubernetes guide](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
to know more about CRDs.

Follow these two simple steps to integrate your custom CRD in Katib:

1. Modify Katib controller
   [ClusterRole's rules](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/manifests/v1beta1/components/controller/rbac.yaml#L5)
   with the new rule to give Katib access to all resources that are created by the Trial.
   To know more about ClusterRole, check the
   [Kubernetes guide](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole).

   In case of Tekton `Pipelines`, Trials creates Tekton `PipelineRun`, then Tekton `PipelineRun`
   creates Tekton `TaskRun`. Therefore, Katib controller ClusterRole should have access to the
   `pipelineruns` and `taskruns`:

   ```yaml
   - apiGroups:
       - tekton.dev
     resources:
       - pipelineruns
       - taskruns
     verbs:
       - "get"
       - "list"
       - "watch"
       - "create"
       - "delete"
   ```

1. Modify Katib Config
   [controller parameters](https://github.com/kubeflow/katib/blob/fc858d15dd41ff69166a2020efa200199063f9ba/manifests/v1beta1/installs/katib-standalone/katib-config.yaml#L9-L15)
   with the new entity:

   ```
   trialResources:
    <object-kind>.<object-API-version>.<object-API-group>
   ```

   For example, to support Tekton `Pipelines`:

   ```yaml
   trialResources: PipelineRun.v1beta1.tekton.dev
   ```

After these changes, deploy Katib as described in the [installation guide](/docs/components/katib/installation/)
and wait until the `katib-controller` Pod is created. You can check logs from the Katib controller
to verify your resource integration:

```shell
$ kubectl logs $(kubectl get pods -n kubeflow -o name | grep katib-controller) -n kubeflow | grep '"CRD Kind":"PipelineRun"'

{"level":"info","ts":1628032648.6285546,"logger":"trial-controller","msg":"Job watch added successfully","CRD Group":"tekton.dev","CRD Version":"v1beta1","CRD Kind":"PipelineRun"}
```

If you ran the above steps successfully, you should be able to use your custom
object YAML in the experiment's Trial template source spec.

We appreciate your feedback on using various CRDs in Katib. It would be great, if you could let us
know about your experiments. The
[developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md)
is a good starting point to know how to contribute to the project.

## Next steps

- Learn how to
  [configure and run your Katib experiments](/docs/components/katib/experiment/).

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
