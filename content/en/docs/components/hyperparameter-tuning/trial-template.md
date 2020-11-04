+++
title = "Trial Template Overview"
description = "How to specify trial template parameters and support custom CRD in Katib"
weight = 50
                    
+++

This page describes in detail how to configure trial template parameters and
use custom [Kubernetes CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
in Katib. Follow this guide to know more about changing trial template specification,
how to use [Kubernetes ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
to store templates and how to modify Katib controller to support your
Kubernetes CRD in Katib experiments.

Katib has these CRD examples in upstream:

- [Kubernetes `Job`](https://kubernetes.io/docs/concepts/workloads/controllers/job/)

- [Kubeflow `TFJob`](/docs/components/training/tftraining/)

- [Kubeflow `PyTorchJob`](/docs/components/training/pytorch/)

- [Kubeflow `MPIJob`](/docs/components/training/mpi)

- [Tekton `Pipeline`](https://github.com/tektoncd/pipeline)

To use your own Kubernetes resource follow the steps [bellow](#custom-resource).

For the details of how to configure and run your experiment, see the
[running an experiment guide](/docs/components/hyperparameter-tuning/experiment/).

## Use trial template to submit experiment

To run Katib experiment you have to specify trial template for your
worker job where actual training is running. Read more about Katib concepts
in [overview guide](/docs/components/hyperparameter-tuning/overview/#trial).

### Configure trial template specification

Trial template specification is located under `.spec.trialTemplate` of your experiment.
For the API overview see the
[`TrialTemplate` type](https://github.com/kubeflow/katib/blob/master/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L208-L270).

To define experiment's trial, you should specify these parameters in `.spec.TrialTemplate`:

- `trialParameters` - list of the parameters which are used in trial template
  during experiment execution. **Note:** Your trial template must contain
  each parameter from the `trialParameters`. You can set these parameters in any
  field of your template, except `.metadata.name` and `.metadata.namespace`.
  See [bellow](#template-metadata) how you can use trial `metadata` parameters
  in your template. For example, your training container can receive
  hyperparameters as command-line or arguments or as environment variables.

  Your experiment's suggestion produces `trialParameters` before running the trial.
  Each `trialParameter` has these structure:

  - `name` - is the parameter name that is replaced in your template.

  - `description` (optional) - description of the parameter.

  - `reference` - is the parameter name that experiment's suggestion is produced.
    Usually, for the hyperparameter tunning parameter references are equal to the
    experiment search space. For example, in grid example search space has
    [three parameters](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/grid-example.yaml#L19-L36)
    (`lr`, `num-layers` and `optimizer`) and `trialParameters` contains each of
    these parameter in
    [`reference`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/grid-example.yaml#L39-L48).

- You have to define your experiment's trial template in **one** of the `trialSpec`
  or `configMap` sources. To set parameters in your template from the
  `trialParameters`, you need to use expression:
  `${trialParameters.<parameter-name>}` in your template. Katib automatically
  replaces it with the appropriate values from the experiment's suggestion.
  For example,
  [`"--lr=${trialParameters.learningRate}"`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/grid-example.yaml#L62)
  is the [`learningRate`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/grid-example.yaml#L40)
  parameter.

  - `trialSpec` - experiment's trial template in
    [unstructured](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured)
    format. The template should be a valid YAML. See the
    [grid example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/grid-example.yaml#L49-L65).

  - `configMap` - Kubernetes ConfigMap specification where experiment's
    trial template is located. This ConfigMap must have label
    `app: katib-trial-templates` and contains key-value pairs where
    `key: <template-name>, value: <template-yaml>`. See the example of
    [ConfigMap with trial templates](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/katib-controller/trial-template-configmap.yaml).

    The `configMap` specification should have:

    1. `configMapName` - name of the ConfigMap with trial templates.

    1. `configMapNamespace` - namespace of the ConfigMap with trial templates.

    1. `templatePath` - path to the template in ConfigMap's data.

    See the example with
    [ConfigMap source](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/trial-configmap-source.yaml#L50-L53)
    for the trial template.

`.spec.trialTemplate` parameters bellow is used to control trial behavior.
If parameter has default value, it can be **omitted** in experiment YAML.

- `retain` - indicates that trial's resources are not clean-up after trial is
  complete. See the example with
  [`retain: true`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/tekton/pipeline-run.yaml#L32)
  parameter.

  The default value is `false`

- `primaryPodLabels` - labels that determines if
  the [trial worker's](/docs/components/hyperparameter-tuning/overview/#worker-job)
  pod or pods need to be injected by Katib metrics collector. **Note:** If
  `primaryPodLabels` is omitted, metrics collector wraps all worker pods.
  Read more about Katib metrics collector in
  [running an experiment guide](http://localhost:1313/docs/components/hyperparameter-tuning/experiment/#metrics-collector).
  See the example with
  [`primaryPodLabels`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/mpijob-horovod.yaml#L29-L30).

  The default value for Kubeflow `TFJob` and `PyTorchJob` is `job-role: master`

  The `primaryPodLabels` default value works only if you specify your template
  in `.spec.trialTemplate.trialSpec`. For the `configMap` template source you
  have to manually set `primaryPodLabels`.

- `primaryContainerName` - name of the training container where actual
  model training is running. Katib metrics collector wraps this container
  to collect required metrics for the single experiment optimization step.

- `successCondition` - [condition](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
  of the trial worker Kubernetes resource status in which trial's job is succeeded.
  This condition must be in [GJSON format](https://github.com/tidwall/gjson).
  See the example with
  [`successCondition`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/tekton/pipeline-run.yaml#L36).

  The default value for Kubernetes `Job` is
  `status.conditions.#(type=="Complete")#|#(status=="True")#`

  The default value for Kubeflow `TFJob` and `PyTorchJob` is
  `status.conditions.#(type=="Succeeded")#|#(status=="True")#`

  The `successCondition` default value works only if you specify your template
  in `.spec.trialTemplate.trialSpec`. For the `configMap` template source
  you have to manually set `successCondition`.

- `failureCondition` - [condition](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
  of the trial worker Kubernetes resource status in which trial's job is failed.
  This condition must be in [GJSON format](https://github.com/tidwall/gjson).
  See the example with
  [`failureCondition`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/tekton/pipeline-run.yaml#L37).

  The default value for Kubernetes `Job` is
  `status.conditions.#(type=="Failed")#|#(status=="True")#`

  The default value for Kubeflow `TFJob` and `PyTorchJob` is
  `status.conditions.#(type=="Failed")#|#(status=="True")#`

  The `failureCondition` default value works only if you specify your template
  in `.spec.trialTemplate.trialSpec`. For the `configMap` template source you
  have to manually set `failureCondition`.

<a id="template-metadata"></a>

### Use trial metadata in template

You can't specify `.metadata.name` and `.metadata.namespace` for your
trial template, but you can get this data during experiment run.
For example, if you want to append trial name to your model storage.

To do this, point `.trialParameters[x].reference` to the
appropriate metadata parameter and use `.trialParameters[x].name`
in your trial template.

The table bellow shows connection between
`.trialParameters[x].reference` value and trial worker's metadata.

<div class="table-responsive">
  <table class="table table-bordered">
    <thead class="thead-light">
      <tr>
        <th>Reference</th>
        <th>Worker metadata</th>
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

See the example of
[using trial metadata](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/trial-metadata-substitution.yaml).

<a id="custom-resource"></a>

## Use custom Kubernetes resource as trial template

By default, you can define your trial worker as Kubernetes `Job`,
Kubeflow `TFJob`, Kubeflow `PyTorchJob`, Kubeflow `MPIJob` or Tekton `Pipeline`.

**Note:** To use Tekton `Pipeline`, you need to modify Tekton installation
to change [`nop`](https://github.com/tektoncd/pipeline/tree/master/cmd/nop) image.
Follow the
[Tekton integration guide](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/tekton)
to know more about it.

It is possible to use your own Kubernetes CRD or other Kubernetes resource
(e.g. [Kubernetes `Deployment`](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/))
as trial worker without modifying Katib controller source code and building
new image. As long as, your CRD creates Kubernetes pods, allows to inject
[sidecar container](https://kubernetes.io/docs/concepts/workloads/pods/) on
these pods and has succeeded and failed status, you can use it in Katib.

To do that, you need to modify Katib components before installing Katib on your
Kubernetes cluster. For that, you have to know your CRD API group, API version,
object kind, plural name of the object. Check the
[Kubernetes guide](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
to know more about CRDs.

Follow these two simple steps to integrate your custom CRD in Katib:

1. Modify Katib controller
   [ClusterRole's rules](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/katib-controller/rbac.yaml#L5)
   with the new rule for your custom object. To know more about ClusterRole, check
   [Kubernetes guide](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole).

   For example, to support Tekton `Pipeline`:

   ```yaml
   - apiGroups:
       - tekton.dev
     resources:
       - pipelineruns
     verbs:
       - "*"
   ```

1. Modify Katib controller
   [Deployment's `args`](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/katib-controller/katib-controller.yaml#L26)
   with the new
   `--trial-resources=<object-kind>.<object-version>.<object-API group>` flag.

   For example, to support Tekton `Pipeline`:

   ```yaml
   - "--trial-resources=PipelineRun.v1beta1.tekton.dev"
   ```

After these changes, deploy Katib as described in
[getting started guide](/docs/components/hyperparameter-tuning/hyperparameter/#installing-katib).
You can check logs from the Katib controller:

```shell
kubectl logs $(kubectl get pods -n kubeflow -o name | grep katib-controller) -n kubeflow
```

Expected output for the Tekton `Pipeline`:

```shell
{"level":"info","ts":1604325430.9762623,"logger":"kubebuilder.controller","msg":"Starting EventSource","controller":"trial-controller","source":"kind source: tekton.dev/v1beta1, Kind=PipelineRun"}
{"level":"info","ts":1604325430.9763885,"logger":"trial-controller","msg":"Job watch added successfully","CRD Group":"tekton.dev","CRD Version":"v1beta1","CRD Kind":"PipelineRun"}
```

If above steps are successful, you are able to use your custom object YAML
as experiment's trial template source spec.

We appreciate if you share your experience with us and contribute in Katib with
using various CRDs in Katib.
The [developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md)
is a good starting point to know how to contribute to the project.

## Next steps

- Learn to configure and run your experiment with Katib in the
  [running an experiment](/docs/components/katib/experiment/) guide.

- About the [Katib configuration file (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/) for each Katib component.
