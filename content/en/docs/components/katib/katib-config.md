+++
title = "Katib Configuration Overview"
description = "How to make changes in Katib configuration"
weight = 70
                    
+++

This guide describes
[Katib config](https://github.com/kubeflow/katib/blob/master/manifests/v1beta1/components/controller/katib-config.yaml) —
the Kubernetes
[Config Map](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) that contains information about:

1. Current
   [metrics collectors](/docs/components/katib/experiment/#metrics-collector)
   (`key = metrics-collector-sidecar`).

1. Current
   [algorithms](/docs/components/katib/experiment/#search-algorithms-in-detail)
   (suggestions) (`key = suggestion`).

1. Current
   [early stopping algorithms](/docs/components/katib/early-stopping/#early-stopping-algorithms-in-detail)
   (`key = early-stopping`).

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
    },
    "waitAllProcesses": false
  },
  ...
}
```

All of these settings except **`image`** can be omitted. If you don't specify any other settings,
a default value is set automatically.

1. `image` - a Docker image for the `File` metrics collector's container (**must be specified**).

1. `imagePullPolicy` - an [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images)
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

   You can run your metrics collector's container without requesting
   the `cpu`, `memory`, or `ephemeral-storage` resource from the Kubernetes cluster.
   For instance, you have to remove `ephemeral-storage` from the container resources to use the
   [Google Kubernetes Engine cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler#limitations).

   To remove specific resources from the metrics collector's container set the
   negative values in requests and limits in your Katib config as follows:

   ```json
   "requests": {
     "cpu": "-1",
     "memory": "-1",
     "ephemeral-storage": "-1"
   },
   "limits": {
     "cpu": "-1",
     "memory": "-1",
     "ephemeral-storage": "-1"
   }
   ```

1. `waitAllProcesses` - a flag to define whether the metrics collector should
   wait until all processes in the training container are finished before start
   to collect metrics.

   The default value is `true`

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

All of these settings except **`image`** can be omitted. If you don't specify
any other settings, a default value is set automatically.

1. `image` - a Docker image for the suggestion's container with a `random`
   algorithm (**must be specified**).

   Image example: `docker.io/kubeflowkatib/<suggestion-name>`

   For each algorithm (suggestion) you can specify one of the following
   suggestion names in the Docker image:

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
           <td><code>cmaes</code>, <code>random</code>, <code>tpe</code>, <code>sobol</code></td>
           <td><a href="https://github.com/c-bata/goptuna">Goptuna</a> optimization framework</td>
         </tr>
         <tr>
           <td><code>suggestion-optuna</code></td>
           <td><code>multivariate-tpe</code>, <code>tpe</code>, <code>cmaes</code>, <code>random</code></td>
           <td><a href="https://github.com/optuna/optuna">Optuna</a> optimization framework</td>
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

1. `imagePullPolicy` - an [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images)
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

   You can run your suggestion's container without requesting
   the `cpu`, `memory`, or `ephemeral-storage` resource from the Kubernetes cluster.
   For instance, you have to remove `ephemeral-storage` from the container resources to use the
   [Google Kubernetes Engine cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler#limitations).

   To remove specific resources from the suggestion's container set the
   negative values in requests and limits in your Katib config as follows:

   ```json
   "requests": {
     "cpu": "-1",
     "memory": "-1",
     "ephemeral-storage": "-1"
   },
   "limits": {
     "cpu": "-1",
     "memory": "-1",
     "ephemeral-storage": "-1"
   }
   ```

1. `serviceAccountName` - a [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)
   for the suggestion's container with a `random` algorithm.

   In the above example, the `random-sa` service account is attached for each
   experiment's suggestion with a `random` algorithm until you change or delete
   this service account from the Katib config.

   By default, the suggestion pod doesn't have any specific service account,
   in which case, the pod uses the
   [default](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
   service account.

   **Note:** If you want to run your experiments with
   [early stopping](/docs/components/katib/early-stopping/),
   the suggestion's deployment must have permission to update the experiment's
   trial status. If you don't specify a service account in the Katib config,
   Katib controller creates required
   [Kubernetes Role-based access control](https://kubernetes.io/docs/reference/access-authn-authz/rbac)
   for the suggestion.

   If you need your own service account for the experiment's
   suggestion with early stopping, you have to follow the rules:

   - The service account name can't be equal to
     `<experiment-name>-<experiment-algorithm>`

   - The service account must have sufficient permissions to update
     the experiment's trial status.

### Suggestion volume settings

When you create an experiment with
[`FromVolume` resume policy](/docs/components/katib/resume-experiment#resume-policy-fromvolume),
you are able to specify
[PersistentVolume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)
and
[PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
settings for the experiment's suggestion. Learn more about Katib concepts
in the [overview guide](/docs/components/katib/overview/#suggestion).

If PV settings are empty, Katib controller creates only PVC.
If you want to use the default volume specification, you can omit these settings.

Follow the example for the `random` algorithm:

```json
suggestion: |-
{
  "random": {
    "image": "docker.io/kubeflowkatib/suggestion-hyperopt",
    "volumeMountPath": "/opt/suggestion/data",
    "persistentVolumeClaimSpec": {
      "accessModes": [
        "ReadWriteMany"
      ],
      "resources": {
        "requests": {
          "storage": "3Gi"
        }
      },
      "storageClassName": "katib-suggestion"
    },
    "persistentVolumeSpec": {
      "accessModes": [
        "ReadWriteMany"
      ],
      "capacity": {
        "storage": "3Gi"
      },
      "hostPath": {
        "path": "/tmp/suggestion/unique/path"
      },
      "storageClassName": "katib-suggestion"
    },
    "persistentVolumeLabels": {
      "type": "local"
    }
  },
  ...
}
```

1. `volumeMountPath` - a [mount path](https://kubernetes.io/docs/tasks/configure-pod-container/configure-volume-storage/#configure-a-volume-for-a-pod)
   for the suggestion's container with `random` algorithm.

   The default value is `/opt/katib/data`

1. `persistentVolumeClaimSpec` - a [PVC specification](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#persistentvolumeclaimspec-v1-core)
   for the suggestion's PVC.

   The default value is set, if you don't specify any of these settings:

   - `persistentVolumeClaimSpec.accessModes[0]` - the default value is
     [`ReadWriteOnce`](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)

   - `persistentVolumeClaimSpec.resources.requests.storage` - the default value
     is `1Gi`

1. `persistentVolumeSpec` - a [PV specification](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#persistentvolumespec-v1-core)
   for the suggestion's PV.

   PV `persistentVolumeReclaimPolicy` is always equal to **`Delete`** to properly
   remove all resources once Katib experiment is deleted. To know more about
   PV reclaim policies check the
   [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming).

1. `persistentVolumeLabels` - [PV labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
   for the suggestion's PV.

## Early stopping settings

These settings are related to Katib early stopping, where:

- key: `early-stopping`
- value: corresponding JSON settings for each early stopping algorithm name

If you want to use a new early stopping algorithm, you need to update the
Katib config. For example, using a `medianstop` early stopping algorithm with
all settings looks as follows:

```json
early-stopping: |-
{
  "medianstop": {
    "image": "docker.io/kubeflowkatib/earlystopping-medianstop",
    "imagePullPolicy": "Always"
  },
  ...
}
```

All of these settings except **`image`** can be omitted. If you don't specify
any other settings, a default value is set automatically.

1. `image` - a Docker image for the early stopping's container with a
   `medianstop` algorithm (**must be specified**).

   Image example: `docker.io/kubeflowkatib/<early-stopping-name>`

   For each early stopping algorithm you can specify one of the following
   early stopping names in the Docker image:

   <div class="table-responsive">
     <table class="table table-bordered">
       <thead class="thead-light">
         <tr>
           <th>Early stopping name</th>
           <th>Early stopping algorithm</th>
           <th>Description</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td><code>earlystopping-medianstop</code></td>
           <td><code>medianstop</code></td>
           <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/earlystopping/v1beta1/medianstop">Katib
             Median Stopping</a> implementation</td>
         </tr>
       </tbody>
     </table>
   </div>

1. `imagePullPolicy` - an
   [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images)
   for the early stopping's container with a `medianstop` algorithm.

   The default value is `IfNotPresent`

## Next steps

- Learn how to
  [configure and run your Katib experiments](/docs/components/katib/experiment/).

- How to
  [restart your experiment and use the resume policies](/docs/components/katib/resume-experiment/).

- How to [set up environment variables](/docs/components/katib/env-variables/)
  for each Katib component.
