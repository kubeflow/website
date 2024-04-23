+++
title = "Overview of Trial Templates"
description = "How to specify trial template parameters and support a custom resource (CRD) in Katib"
weight = 50
                    
+++

This guide describes how to configure trial template parameters and use custom
[Kubernetes CRD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
in Katib. You will learn about changing trial template specification, how to use
[Kubernetes ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
to store templates and how to modify Katib controller to support your
Kubernetes CRD in Katib experiments.

Katib has these CRD examples in upstream:

- [Kubernetes `Job`](https://kubernetes.io/docs/concepts/workloads/controllers/job/)

- [Kubeflow `TFJob`](/docs/components/training/user-guides/tensorflow/)

- [Kubeflow `PyTorchJob`](/docs/components/training/user-guides/pytorch/)

- [Kubeflow `MXJob`](/docs/components/training/user-guides/mxnet)

- [Kubeflow `XGBoostJob`](/docs/components/training/user-guides/xgboost)

- [Kubeflow `MPIJob`](/docs/components/training/user-guides/mpi)

- [Tekton `Pipelines`](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/tekton)

- [Argo `Workflows`](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/argo)

To use your own Kubernetes resource follow the steps [below](#custom-resource).

For the details on how to configure and run your experiment, follow the
[running an experiment guide](/docs/components/katib/experiment/).

## Use trial template to submit experiment

To run the Katib experiment you have to specify a trial template for your
worker job where actual training is running. Learn more about Katib concepts
in the [overview guide](/docs/components/katib/overview/#trial).

### Configure trial template specification

Trial template specification is located under `.spec.trialTemplate` of your experiment.
For the API overview refer to the
[`TrialTemplate` type](https://github.com/kubeflow/katib/blob/318f66890ebee00eba9893f7145d366795caa1d0/pkg/apis/controller/experiments/v1beta1/experiment_types.go#L216-L278).

To define experiment's trial, you should specify these parameters in `.spec.trialTemplate`:

- `trialParameters` - list of the parameters which are used in the trial template
  during experiment execution.

  **Note:** Your trial template must contain each parameter from the
  `trialParameters`. You can set these parameters in any field of your template,
  except `.metadata.name` and `.metadata.namespace`.
  Check [below](#template-metadata) how you can use trial `metadata` parameters
  in your template. For example, your training container can receive
  hyperparameters as command-line or arguments or as environment variables.

  Your experiment's suggestion produces `trialParameters` before running the trial.
  Each `trialParameter` has these structure:

  - `name` - the parameter name that is replaced in your template.

  - `description` (optional) - the description of the parameter.

  - `reference` - the parameter name that experiment's suggestion returns.
    Usually, for the hyperparameter tuning parameter references are equal to the
    experiment search space. For example, in grid example search space has
    [three parameters](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/hp-tuning/grid.yaml#L18-L36)
    (`lr`, `num-layers` and `optimizer`) and `trialParameters` contains each of
    these parameters in
    [`reference`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/hp-tuning/grid.yaml#L39-L48).

- You have to define your experiment's trial template in **one** of the `trialSpec`
  or `configMap` sources.

  **Note:** Your template must omit `.metadata.name` and `.metadata.namespace`.

  To set the parameters from the `trialParameters`, you need to use this
  expression: `${trialParameters.<parameter-name>}` in your template.
  Katib automatically replaces it with the appropriate values from the
  experiment's suggestion.

  For example,
  [`--lr=${trialParameters.learningRate}`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/hp-tuning/grid.yaml#L62)
  is the [`learningRate`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/hp-tuning/grid.yaml#L40)
  parameter.

  - `trialSpec` - the experiment's trial template in
    [unstructured](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured)
    format. The template should be a valid YAML. Check the
    [grid example](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/hp-tuning/grid.yaml#L49-L65).

  - `configMap` - Kubernetes ConfigMap specification where the experiment's
    trial template is located. This ConfigMap must have the label
    `katib.kubeflow.org/component: trial-templates` and contains key-value pairs, where
    `key: <template-name>, value: <template-yaml>`. Check the example of the
    [ConfigMap with trial templates](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/controller/trial-templates.yaml).

    The `configMap` specification should have:

    1. `configMapName` - the ConfigMap name with the trial templates.

    1. `configMapNamespace` - the ConfigMap namespace with the trial templates.

    1. `templatePath` - the ConfigMap's data path to the template.

    Check the example with
    [ConfigMap source](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/trial-template/trial-configmap-source.yaml#L50-L53)
    for the trial template.

`.spec.trialTemplate` parameters below are used to control trial behavior.
If parameter has the default value, it can be **omitted** in the experiment YAML.

- `retain` - indicates that trial's resources are not clean-up after the trial
  is complete. Check the example with
  [`retain: true`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/tekton/pipeline-run.yaml#L32)
  parameter.

  The default value is `false`

- `primaryPodLabels` - the
  [trial worker's](/docs/components/katib/overview/#worker-job) Pod or Pods
  labels. These Pods are injected by Katib metrics collector.

  **Note:** If `primaryPodLabels` is **omitted**, the metrics collector wraps
  all worker's Pods. Learn more about Katib metrics collector in
  [running an experiment guide](/docs/components/katib/experiment/#metrics-collector).
  Check the example with
  [`primaryPodLabels`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/kubeflow-training-operator/mpijob-horovod.yaml#L29-L30).

  The default value for Kubeflow `TFJob`, `PyTorchJob`, `MXJob`, and `XGBoostJob` is `job-role: master`

  The `primaryPodLabels` default value works only if you specify your template
  in `.spec.trialTemplate.trialSpec`. For the `configMap` template source you
  have to manually set `primaryPodLabels`.

- `primaryContainerName` - the training container name where actual
  model training is running. Katib metrics collector wraps this container
  to collect required metrics for the single experiment optimization step.

- `successCondition` - The trial worker's object
  [status](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
  in which trial's job has succeeded. This condition must be in
  [GJSON format](https://github.com/tidwall/gjson). Check the example with
  [`successCondition`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/tekton/pipeline-run.yaml#L36).

  The default value for Kubernetes `Job` is
  `status.conditions.#(type=="Complete")#|#(status=="True")#`

  The default value for Kubeflow `TFJob`, `PyTorchJob`, `MXJob`, and `XGBoostJob` is
  `status.conditions.#(type=="Succeeded")#|#(status=="True")#`

  The `successCondition` default value works only if you specify your template
  in `.spec.trialTemplate.trialSpec`. For the `configMap` template source
  you have to manually set `successCondition`.

- `failureCondition` - The trial worker's object
  [status](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
  in which trial's job has failed. This condition must be in
  [GJSON format](https://github.com/tidwall/gjson). Check the example with
  [`failureCondition`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/tekton/pipeline-run.yaml#L37).

  The default value for Kubernetes `Job` is
  `status.conditions.#(type=="Failed")#|#(status=="True")#`

  The default value for Kubeflow `TFJob`, `PyTorchJob`, `MXJob`, and `XGBoostJob` is
  `status.conditions.#(type=="Failed")#|#(status=="True")#`

  The `failureCondition` default value works only if you specify your template
  in `.spec.trialTemplate.trialSpec`. For the `configMap` template source you
  have to manually set `failureCondition`.

<a id="template-metadata"></a>

### Use trial metadata in template

You can't specify `.metadata.name` and `.metadata.namespace` in your
trial template, but you can get this data during the experiment run.
For example, if you want to append the trial's name to your model storage.

To do this, point `.trialParameters[x].reference` to the
appropriate metadata parameter and use `.trialParameters[x].name`
in your trial template.

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
[using trial metadata](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/trial-template/trial-metadata-substitution.yaml).

<a id="custom-resource"></a>

## Use custom Kubernetes resource as a trial template

In Katib examples you can find the following trial worker types:
[Kubernetes `Job`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/hp-tuning/random.yaml),
[Kubeflow `TFJob`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/kubeflow-training-operator/tfjob-mnist-with-summaries.yaml),
[Kubeflow `PyTorchJob`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/kubeflow-training-operator/pytorchjob-mnist.yaml),
[Kubeflow `MXJob`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/kubeflow-training-operator/mxjob-byteps.yaml),
[Kubeflow `XGBoostJob`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/kubeflow-training-operator/xgboostjob-lightgbm.yaml),
[Kubeflow `MPIJob`](https://github.com/kubeflow/katib/blob/master/examples/v1beta1/kubeflow-training-operator/mpijob-horovod.yaml),
[Tekton `Pipelines`](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/tekton),
and [Argo `Workflows`](https://github.com/kubeflow/katib/tree/master/examples/v1beta1/argo).

It is possible to use your own Kubernetes CRD or other Kubernetes resource
(e.g. [Kubernetes `Deployment`](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/))
as a trial worker without modifying Katib controller source code and building
the new image. As long as your CRD creates Kubernetes Pods, allows to inject
the [sidecar container](https://kubernetes.io/docs/concepts/workloads/pods/) on
these Pods and has succeeded and failed status, you can use it in Katib.

To do that, you need to modify Katib components before installing it on your
Kubernetes cluster. Accordingly, you have to know your CRD API group and version,
the CRD object's kind. Also, you need to know which resources your custom object
is created. Check the
[Kubernetes guide](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
to know more about CRDs.

Follow these two simple steps to integrate your custom CRD in Katib:

1. Modify Katib controller
   [ClusterRole's rules](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/controller/rbac.yaml#L5)
   with the new rule to give Katib access to all resources that are created
   by the trial. To know more about ClusterRole, check
   [Kubernetes guide](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole).

   In case of Tekton `Pipelines`, trial creates Tekton `PipelineRun`, then
   Tekton `PipelineRun` creates Tekton `TaskRun`. Therefore, Katib controller
   ClusterRole should have access to the `pipelineruns` and `taskruns`:

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

1. Modify Katib controller
   [Deployment's `args`](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/controller/controller.yaml#L27)
   with the new flag:
   `--trial-resources=<object-kind>.<object-API-version>.<object-API-group>`.

   For example, to support Tekton `Pipelines`:

   ```yaml
   - "--trial-resources=PipelineRun.v1beta1.tekton.dev"
   ```

After these changes, deploy Katib as described in the
[getting started guide](/docs/components/katib/hyperparameter/#installing-katib)
and wait until the `katib-controller` Pod is created.
You can check logs from the Katib controller to verify your resource integration:

```shell
$ kubectl logs $(kubectl get pods -n kubeflow -o name | grep katib-controller) -n kubeflow | grep '"CRD Kind":"PipelineRun"'

{"level":"info","ts":1628032648.6285546,"logger":"trial-controller","msg":"Job watch added successfully","CRD Group":"tekton.dev","CRD Version":"v1beta1","CRD Kind":"PipelineRun"}
```

If you ran the above steps successfully, you should be able to use your custom
object YAML in the experiment's trial template source spec.

We appreciate your feedback on using various CRDs in Katib.
It would be great, if you let us know about your experiments.
The [developer guide](https://github.com/kubeflow/katib/blob/master/docs/developer-guide.md)
is a good starting point to know how to contribute to the project.

## Next steps

- Learn how to
  [configure and run your Katib experiments](/docs/components/katib/experiment/).

- Check the
  [Katib Configuration (Katib config)](/docs/components/katib/katib-config/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
