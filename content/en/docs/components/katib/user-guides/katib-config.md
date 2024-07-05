+++
title = "How to use Katib Config"
description = "Katib configuration overview and how to update values"
weight = 80
+++

This guide describes
[the Katib Config](https://github.com/kubeflow/katib/blob/19268062f1b187dde48114628e527a2a35b01d64/manifests/v1beta1/installs/katib-standalone/katib-config.yaml) —
the main configuration file for every Katib component. We use Kubernetes
[ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) to
fetch that config into [the Katib control plane components](/docs/components/katib/installation/#katib-control-plane-components).

The ConfigMap must be deployed in the
[`KATIB_CORE_NAMESPACE`](/docs/components/katib/user-guides/env-variables/#katib-controller)
namespace with the `katib-config` name.

Katib config has the initialization: `init` and the runtime: `runtime` parameters. You can modify
these parameters by editing the `katib-config` ConfigMap:

```shell
kubectl edit configMap katib-config -n kubeflow
```

## Initialization Parameters

Katib Config parameters set in `init` represent initialization settings for
the Katib control plane. These parameters can be modified before Katib control plane is deployed.

```yaml
apiVersion: config.kubeflow.org/v1beta1
kind: KatibConfig
init:
  certGenerator:
    enable: true
    ...
  controller:
    trialResources:
      - Job.v1.batch
      - TFJob.v1.kubeflow.org
    ...
```

It has settings for the following Katib components:

1. Katib certificate generator: `certGenerator`

1. Katib controller: `controller`

### Katib Certificate Generator Parameters

The following parameters set in `.init.certGenerator` configure the Katib certificate generator:

- `enable` - whether to enable Katib certificate generator.

  The default value is `false`

- `webhookServiceName` - a service name for the Katib webhooks. If it is set, Katib certificate
  generator is forcefully enabled.

  The default value is `katib-controller`

- `webhookSecretName` - a secret name to store Katib webhooks certificates. If it is set, Katib
  certificate generator is forcefully enabled.

  The default value is `katib-webhook-cert`

### Katib Controller Parameters

The following parameters set in `.init.controller` configure the Katib controller:

- `experimentSuggestionName` - the implementation of Suggestion interface for
  Experiment controller.

  The default value is `default`

- `metricsAddr` - a TCP address that the Katib controller should bind to
  for serving prometheus metrics.

  The default value is `8080`

- `healthzAddr` - a TCP address that the Katib controller should bind to
  for health probes.

  The default value is `18080`

- `injectSecurityContext` - whether to inject security context to Katib metrics collector sidecar
  container from Katib Trial training container.

  The default value is `false`

- `trialResources` - list of resources that can be used as a Trial template. The Trial resources
  must be in this format: Kind.version.group (e.g. `TFJob.v1.kubeflow.org`).
  Follow [this guide](/docs/components/katib/user-guides/trial-template/#use-crds-with-trial-template)
  to understand how to make Katib Trial work with your Kubernetes CRDs.

  The default value is `[Job.v1.batch]`

- `webhookPort` - a port number for Katib admission webhooks.

  The default value is `8443`

- `enableLeaderElection` - whether to enable leader election for Katib controller. If this value
  is true only single Katib controller Pod is active.

  The default value is `false`

- `leaderElectionID` - an ID for the Katib controller leader election.

  The default value is `3fbc96e9.katib.kubeflow.org`

## Runtime Parameters

Katib Config parameters set in `runtime` represent runtime settings for
the Katib Experiment. These parameters can be modified before Katib Experiment is created. When
Katib Experiment is created Katib controller fetches the latest configuration from the
`katib-config` ConfigMap.

```yaml
apiVersion: config.kubeflow.org/v1beta1
kind: KatibConfig
runtime:
  metricsCollectors:
    - kind: StdOut
      image: docker.io/kubeflowkatib/file-metrics-collector:latest
    ...
  suggestions:
    - algorithmName: random
      image: docker.io/kubeflowkatib/suggestion-hyperopt:latest
    ...
  earlyStoppings:
    - algorithmName: medianstop
      image: docker.io/kubeflowkatib/earlystopping-medianstop:latest
    ...
```

### Metrics Collectors Parameters

Parameters set in `.runtime.metricsCollectors` configure container for
[the Katib metrics collector](/docs/components/katib/user-guides/metrics-collector).
The following settings are **required** for each Katib metrics collector that you want to use in your Katib Experiments:

- `kind` - one of the Katib metrics collector types.

- `image` - a Docker image for the metrics collector's container.

The following settings are **optional**:

- `imagePullPolicy` - an [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images)
  for the metrics collector's container.

  The default value is `IfNotPresent`

- `resources` - [resources](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)
  for the metrics collector's container.

  The default values for the `resources` are:

  ```yaml
  metricsCollectors:
    - kind: StdOut
      image: docker.io/kubeflowkatib/file-metrics-collector:latest
      resources:
        requests:
          cpu: 50m
          memory: 10Mi
          ephemeral-storage: 500Mi
        limits:
          cpu: 500m
          memory: 100Mi
          ephemeral-storage: 5Gi
  ```

  You can run your metrics collector's container without requesting
  the `cpu`, `memory`, or `ephemeral-storage` resource from the Kubernetes cluster.
  For instance, you have to remove `ephemeral-storage` from the container resources to use the
  [Google Kubernetes Engine cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler#limitations).

  To remove specific resources from the metrics collector's container set the
  negative values in requests and limits in your Katib config as follows:

  ```yaml
  resources:
    requests:
      cpu: -1
      memory: -1
      ephemeral-storage: -1
    limits:
      cpu: -1
      memory: -1
      ephemeral-storage: -1
  ```

- `waitAllProcesses` - a flag to define whether the metrics collector should wait until all
  processes in the Trial's training container are finished before start to collect metrics.

  The default value is `false`

### Suggestions Parameters

Parameters set in `.runtime.suggestions` configure Deployment for
[the Katib Suggestions](/docs/components/katib/reference/architecture/#suggestion). Every Suggestion represents
one of the AutoML algorithms that you can use in Katib Experiments.
The following settings are **required** for Suggestion Deployment:

- `algorithmName` - one of the Katib algorithm names. For example: `tpe`

- `image` - a Docker image for the Suggestion Deployment's container. Image
  example: `docker.io/kubeflowkatib/<suggestion-name>`

  For each algorithm you can specify one of the following Suggestion names in the Docker image:

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
          <td><code>multivariate-tpe</code>, <code>tpe</code>, <code>cmaes</code>, <code>random</code>, <code>grid</code></td>
          <td><a href="https://github.com/optuna/optuna">Optuna</a> optimization framework</td>
        </tr>
        <tr>
          <td><code>suggestion-hyperband</code></td>
          <td><code>hyperband</code></td>
          <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/hyperband">Katib
            Hyperband</a> implementation</td>
        </tr>
        <tr>
          <td><code>suggestion-pbt</code></td>
          <td><code>pbt</code></td>
          <td><a href="https://github.com/kubeflow/katib/tree/master/pkg/suggestion/v1beta1/pbt">Katib
            PBT</a> implementation</td>
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

The following settings are **optional**:

- `<ContainerV1>` - you can specify all
  [container parameters](https://github.com/kubernetes/api/blob/669e693933c77e91648f8602dc2555d96e6279ad/core/v1/types.go#L2608)
  inline for your Suggestion Deployment. For example, `resources` for container resources or
  `env` for container environment variables.

  Configuration for `resources` works the same as for Katib metrics collector's container `resources`.

- `serviceAccountName` - a [ServiceAccount](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)
  for the Suggestion Deployment.

  By default, the Suggestion Pod doesn't have any specific ServiceAccount,
  in which case, the Pod uses the
  [default](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
  service account.

  **Note:** If you want to run your Experiments with
  [early stopping](/docs/components/katib/user-guides/early-stopping/),
  the Suggestion's Deployment must have permission to update the Experiment's
  Trial status. If you don't specify a ServiceAccount in the Katib config,
  Katib controller creates required
  [Kubernetes Role-based access control](https://kubernetes.io/docs/reference/access-authn-authz/rbac)
  for the Suggestion.

  If you need your own ServiceAccount for the Experiment's
  Suggestion with early stopping, you have to follow the rules:

  - The ServiceAccount name can't be equal to
    `<experiment-name>-<experiment-algorithm>`

  - The ServiceAccount must have sufficient permissions to update
    the Experiment's Trial status.

#### Suggestion Volume Parameters

When you create an Experiment with
[`FromVolume` resume policy](/docs/components/katib/user-guide/resume-experiment#resume-policy-fromvolume),
you are able to specify
[PersistentVolume (PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)
and
[PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
settings for the Experiment's Suggestion to restore stage of the AutoML algorithm.

If PV settings are empty, Katib controller creates only PVC.
If you want to use the default volume specification, you can omit these parameters.

For example, Suggestion volume config for `random` algorithm:

```yaml
suggestions:
  - algorithmName: random
    image: docker.io/kubeflowkatib/suggestion-hyperopt:latest
    volumeMountPath: /opt/suggestion/data
    persistentVolumeClaimSpec:
      accessModes:
        - ReadWriteMany
      resources:
        requests:
          storage: 3Gi
      storageClassName: katib-suggestion
    persistentVolumeSpec:
      accessModes:
        - ReadWriteMany
      capacity:
        storage: 3Gi
      hostPath:
        path: /tmp/suggestion/unique/path
      storageClassName: katib-suggestion
    persistentVolumeLabels:
      type: local
```

- `volumeMountPath` - a [mount path](https://kubernetes.io/docs/tasks/configure-pod-container/configure-volume-storage/#configure-a-volume-for-a-pod)
  for the Suggestion Deployment's container.

  The default value is `/opt/katib/data`

- `persistentVolumeClaimSpec` - a [PVC specification](https://github.com/kubernetes/api/blob/669e693933c77e91648f8602dc2555d96e6279ad/core/v1/types.go#L487)
  for the Suggestion Deployment's PVC.

  The default value is:

  ```yaml
  persistentVolumeClaimSpec:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  ```

- `persistentVolumeSpec` - a [PV specification](https://github.com/kubernetes/api/blob/669e693933c77e91648f8602dc2555d96e6279ad/core/v1/types.go#L324)
  for the Suggestion Deployment's PV.

  Suggestion Deployment's PV always has **`persistentVolumeReclaimPolicy: Delete`** to properly
  remove all resources once Katib Experiment is deleted. To know more about PV reclaim policies
  check the
  [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming).

- `persistentVolumeLabels` - [PV labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
  for the Suggestion Deployment's PV.

### Early Stoppings Parameters

Parameters set in `runtime.earlyStoppings` configure container for
[the Katib Early Stopping algorithms](/docs/components/katib/user-guides/early-stopping/#early-stopping-algorithms).
The following settings are **required** for each early stopping algorithm that you want
to use in your Katib Experiments:

- `algorithmName` - one of the early stopping algorithm names (e.g. `medianstop`).

- `image` - a Docker image for the early stopping container.

The following settings are **optional**:

- `imagePullPolicy` - an [image pull policy](https://kubernetes.io/docs/concepts/configuration/overview/#container-images)
  for the early stopping's container.

  The default value is `IfNotPresent`

- `resources` - [resources](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-requests-and-limits-of-pod-and-container)
  for the early stopping's container.

  Configuration for `resources` works the same as for Katib metrics collector's container `resources`.

## Next steps

- How to [set up environment variables](/docs/components/katib/user-guides/env-variables/) for
  various Katib component.
