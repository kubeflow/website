+++
title = "Katib Configuration Overview"
description = "How to make changes in Katib configuration"
weight = 50
                    
+++

This guide describes
[Katib config](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/katib-controller/katib-config.yaml) —
the Kubernetes
[Config Map](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) that contains information about:

1. Current [metrics collectors](/docs/components/katib/experiment/#metrics-collector) (`key = metrics-collector-sidecar`).
1. Current [algorithms](/docs/components/katib/experiment/#search-algorithms-in-detail) (suggestions) (`key = suggestion`).

The Katib Config Map must be deployed in the
[`KATIB_CORE_NAMESPACE`](/docs/components/katib/env-variables/#katib-controller)
namespace with the `katib-config` name. The Katib controller parses the Katib config when
you submit your experiment.

You can edit this Config Map even after deploying Katib.

If you are deploying Katib in the Kubeflow namespace, run this command to edit your Katib config:

```shell
kubectl edit configMap katib-config -n kubeflow
```

## Metrics Collector Sidecar settings

These settings are related to Katib metrics collectors, where:

- key: `metrics-collector-sidecar`
- value: corresponding JSON settings for each metrics collector kind

Example for the `File` metrics collector with all settings:

```json
metrics-collector-sidecar: |-
{
  "File": {
    "image": "docker.io/kubeflowkatib/file-metrics-collector",
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

All of these settings except **`image`** can be omitted. If you don't specify any other settings,
a default value is set automatically.

1. `image` - a Docker image for the `File` metrics collector's container (**must be specified**).

1. `imagePullPolicy` - [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images)
   for the `File` metrics collector's container.

   The default value is `IfNotPresent`

1. `resources` - [resources](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)
   for the `File` metrics collector's container. In the above example you
   can check how to specify `limits` and `requests`. Currently, you can specify
   only `memory`, `cpu` and `ephemeral-storage` resources.

   The default values for the `requests` are:

   - `memory = 10Mi`
   - `cpu = 50m`
   - `ephemeral-storage = 500Mi`

   The default values for the `limits` are:

   - `memory = 100Mi`
   - `cpu = 500m`
   - `ephemeral-storage = 5Gi`

   It is possible to not request the `ephemeral-storage` resource for the
   metrics collector's container. For example to use
   [GKE nodepool autoscalers](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler#limitations).
   To do that, set the negative values for the `ephemeral-storage` requests and
   limits in your Katib config:

   ```json
   "requests": {
     "ephemeral-storage": "-1"
   },
   "limits": {
     "ephemeral-storage": "-1"
   }
   ```

## Suggestion settings

These settings are related to Katib suggestions, where:

- key: `suggestion`
- value: corresponding JSON settings for each algorithm name

If you want to use a new algorithm, you need to update the Katib config. For example,
using a `random` algorithm with all settings looks as follows:

```json
suggestion: |-
{
  "random": {
    "image": "docker.io/kubeflowkatib/suggestion-hyperopt",
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
    "serviceAccountName": "random-sa"
  },
  ...
}
```

All of these settings except **`image`** can be omitted. If you don't specify any other settings,
a default value is set automatically.

1. `image` - a Docker image for the suggestion's container with a `random`
   algorithm (**must be specified**).

   Image example: `docker.io/kubeflowkatib/<suggestion-name>`

   For each algorithm (suggestion) you can specify one of the following
   suggestion names in Docker image:

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
           <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/hyperband">Katib
             Hyperband</a> implementation</td>
         </tr>
         <tr>
           <td><code>suggestion-enas</code></td>
           <td><code>enas</code></td>
           <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/nas/enas">Katib
             ENAS</a> implementation</td>
         </tr>
         <tr>
           <td><code>suggestion-darts</code></td>
           <td><code>darts</code></td>
           <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/nas/darts">Katib
             DARTS</a> implementation</td>
         </tr>
       </tbody>
     </table>
   </div>

1. `imagePullPolicy` - [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images)
   for the suggestion's container with a `random` algorithm.

   The default value is `IfNotPresent`

1. `resources` - [resources](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)
   for the suggestion's container with a `random` algorithm.
   In the above example you can check how to specify `limits` and `requests`.
   Currently, you can specify only `memory`, `cpu` and
   `ephemeral-storage` resources.

   The default values for the `requests` are:

   - `memory = 10Mi`
   - `cpu = 50m`
   - `ephemeral-storage = 500Mi`

   The default values for the `limits` are:

   - `memory = 100Mi`
   - `cpu = 500m`
   - `ephemeral-storage = 5Gi`

   It is possible to not request the `ephemeral-storage` resource for the
   suggestion's container. For example to use
   [GKE nodepool autoscalers](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler#limitations).
   To do that, set the negative values for the `ephemeral-storage` requests and
   limits in your Katib config:

   ```json
   "requests": {
     "ephemeral-storage": "-1"
   },
   "limits": {
     "ephemeral-storage": "-1"
   }
   ```

1. `serviceAccountName` - [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)
   for the suggestion's container with a `random` algorithm.

   In the above example, the `random-sa` service account is attached for each
   experiment's suggestion with a `random` algorithm until you change or delete
   this service account from the Katib config.

   By default, the suggestion pod doesn't have any specific service account,
   in which case, the pod uses the
   [default](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
   service account.
