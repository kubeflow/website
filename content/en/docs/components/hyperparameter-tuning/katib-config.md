+++
title = "Katib Configuration Overview"
description = "How to make changes in Katib configuration"
weight = 40
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


This page describes information about [Katib config](https://github.com/kubeflow/katib/blob/master/manifests/v1alpha3/katib-controller/katib-config.yaml).

Katib config is the Kubernetes [Config Map](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) that contains information about:

1. Current [Metrics Collectors](/docs/components/hyperparameter-tuning/experiment/#metrics-collector) (`key = metrics-collector-sidecar`)
1. Current [Algorithms](/docs/components/hyperparameter-tuning/experiment/#search-algorithms-in-detail) (Suggestions) (`key = suggestion`).

Katib Config Map must be deployed in [`KATIB_CORE_NAMESPACE`](/docs/components/hyperparameter-tuning/env-variables/#katib-controller) namespace with `katib-config` name. Katib controller parses Katib config when you submit Experiment.

You can edit this Config Map even after deploying Katib.

If you deploy Katib in Kubeflow namespace, to edit Katib config run this:

`kubectl edit configMap katib-config -n kubeflow`

## Metrics Collector Sidecar settings

These settings are related to Katib Metrics Collectors, where:

- key = `metrics-collector-sidecar`
- value = corresponding settings JSON for each Metrics Collector.

Example for the `File` Metrics Collector with all settings:

```json
metrics-collector-sidecar: |-
{
  "File": {
    "image": "gcr.io/kubeflow-images-public/katib/v1alpha3/file-metrics-collector",
    "imagePullPolicy": "Always",
    "resources": {
      "requests": {
        "memory": "200Mi",
        "cpu": "250m",
        "ephemeral-storage": "200Mi"
      },
      "limits": {
        "memory": "1Gi",
        "cpu": "500m",
        "ephemeral-storage": "2Gi"
      }
    }
  },
  ...
}
```

All of these settings except **`image`** can be omitted. If you don't specify any other settings, default value is be set.

1. `image` - Docker image name for the `File` Metrics Collector.

    **Must be specified**.

1. `imagePullPolicy` - `File` Metrics Collector container [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images).

    Default value is `IfNotPresent`.

1. `resources` - `File` Metrics Collector [container resources](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container). In the above example you can see how to specify `limits` and `requests`. Currently, you can specify only `memory`, `cpu` and `ephemeral-storage` resource.

    Default values for the `requests` are:

    - `memory = 10Mi`.
    - `cpu = 50m`.
    - `ephemeral-storage = 500Mi`.

    Default values for the `limits` are:

    - `memory = 100Mi`.
    - `cpu = 500m`.
    - `ephemeral-storage = 5Gi`.

## Suggestion settings

These settings are related to Katib suggestions, where:

- key = `suggestion`
- value = corresponding settings JSON for each algorithm.

If you want to use new algorithm, you must update Katib config with the new suggestion.

Example for the `random` suggestion with all settings:

```json
suggestion: |-
{
  "random": {
    "image": "gcr.io/kubeflow-images-public/katib/v1alpha3/suggestion-hyperopt",
    "imagePullPolicy": "Always",
    "resources": {
      "requests": {
        "memory": "100Mi",
        "cpu": "100m",
        "ephemeral-storage": "100Mi"
      },
      "limits": {
        "memory": "500Mi",
        "cpu": "500m",
        "ephemeral-storage": "3Gi"
      }
    },
    "serviceAccountName": "suggestion-serviceaccount"
  },
  ...
}
```

All of these settings except **`image`** can be omitted. If you don't specify any other settings, default value is be set.

1. `image` - Docker image name for the `random` suggestion. **Must be specified**

    Image name example: `gcr.io/kubeflow-images-public/katib/v1alpha3/<suggestion-name>`

    For each algorithm (suggestion) you can specify one of the following suggestion names in Docker image:

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="thead-light">
          <tr>
            <th>Suggestion name</th>
            <th>List of supported algorithms</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>suggestion-hyperopt</code></td>
            <td><code>random</code>, <code>tpe</code></td>
            <td><a href="https://github.com/hyperopt/hyperopt">Hyperopt</a> optimization framework</td>
          </tr>
          <tr>
            <td><code>suggestion-chocolate</code></td>
            <td><code>grid</code>, <code>random</code>, <code>quasirandom</code>, <code>bayesianoptimization</code>, <code>mocmaes</code></td>
            <td><a href="https://github.com/AIworx-Labs/chocolate">Chocolate</a> optimization framework</td>
          </tr>
          <tr>
            <td><code>suggestion-skopt</code></td>
            <td><code>bayesianoptimization</code></td>
            <td><a href="https://github.com/scikit-optimize/scikit-optimize">Scikit-optimize</a> optimization framework</td>
          </tr>
          <tr>
            <td><code>suggestion-goptuna</code></td>
            <td><code>cmaes</code>, <code>random</code>, <code>tpe</code></td>
            <td><a href="https://github.com/c-bata/goptuna">Goptuna</a> optimization framework</td>
          </tr>
          <tr>
            <td><code>suggestion-hyperband</code></td>
            <td><code>hyperband</code></td>
            <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1alpha3/hyperband">Katib
              Hyperband</a> implementation</td>
          </tr>
          <tr>
            <td><code>suggestion-enas</code></td>
            <td><code>enas</code></td>
            <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1alpha3/nas/enas">Katib
              ENAS</a> implementation</td>
          </tr>
          <tr>
            <td><code>suggestion-darts</code></td>
            <td><code>darts</code></td>
            <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1alpha3/nas/darts">Katib
              DARTS</a> implementation</td>
          </tr>
        </tbody>
      </table>
    </div>

1. `imagePullPolicy` - `Random` suggestion container [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images).

    Default value is `IfNotPresent`.

1. `resources` - `Random` suggestion [container resources](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container). In the above example you can see how to specify `limits` and `requests`. Currently, you can specify only `memory`, `cpu` and `ephemeral-storage` resource.

    Default values for the `requests` are:

    - `memory = 10Mi`.
    - `cpu = 50m`.
    - `ephemeral-storage = 500Mi`.

    Default values for the `limits` are:

    - `memory = 100Mi`.
    - `cpu = 500m`.
    - `ephemeral-storage = 5Gi`.

1. `serviceAccountName` - `Random` suggestion container [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/). In the above example, `suggestion-serviceaccount` service account is used for each Experiment with `random` algorithm, until you change or delete this service account from the Katib config.

    By default suggestion pod doesn't have specific service account. In that case, Suggestion pod uses [default](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server) service account.
