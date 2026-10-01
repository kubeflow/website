+++
title = "Server Configuration"
description = "Guidance on managing your Kubeflow Pipelines instances"
weight = 2
+++


By default, you can use Kubeflow Pipelines deployment manifests as provided,
which aim to offer a standard configuration for most use cases. At the same time,
customizations are available for more advanced usage.

When deploying Kubeflow Pipelines servers, you can pass various environment variables
to customize the behavior of servers.

## Frontend Server

When deploying frontend server called `ml-pipeline-ui`, you can pass various environment
variables to customize the server behavior for your namespace. Some examples are shown
in the [ml-pipeline-ui-deployment.yaml](https://github.com/kubeflow/pipelines/blob/b630d5c8ae7559be0011e67f01e3aec1946ef765/manifests/kustomize/base/pipeline/ml-pipeline-ui-deployment.yaml#L32-L50).

### Artifact storage endpoint allowlist

You can configure `ALLOWED_ARTIFACT_DOMAIN_REGEX` to allowlist object storage endpoint
that your frontend server will fetch artifacts from. If the domain that frontend server
tries to fetch does not match the regular expression defined in
`ALLOWED_ARTIFACT_DOMAIN_REGEX`, it will return error to users that the requested domain
is not allowed.

#### Standalone Kubeflow Pipelines deployment

By default, the value for `ALLOWED_ARTIFACT_DOMAIN_REGEX` is `"^.*$"`. You can customize
this value for your users, for example: `^.*.yourdomain$` in the
[ml-pipeline-ui-deployment.yaml](https://github.com/kubeflow/pipelines/blob/b630d5c8ae7559be0011e67f01e3aec1946ef765/manifests/kustomize/base/pipeline/ml-pipeline-ui-deployment.yaml#L32-L50).


#### Full fledged Kubeflow deployment

For full fledged Kubeflow, each namespace corresponds to a project with the same name.
To configure the `ALLOWED_ARTIFACT_DOMAIN_REGEX` value for user namespace, add an entry in `ml-pipeline-ui-artifact`
just like this example in [sync.py](https://github.com/kubeflow/pipelines/blob/b630d5c8ae7559be0011e67f01e3aec1946ef765/manifests/kustomize/base/installs/multi-user/pipelines-profile-controller/sync.py#L304-L310) for `ALLOWED_ARTIFACT_DOMAIN_REGEX` environment variable,
the entry is identical to the environment variable instruction in Standalone Kubeflow Pipelines
deployment.

## Proxy

Since KFP 2.5, you can set a server-scoped proxy configuration for the backend by setting any of the following environment variables (in uppercase) in the 
API Server deployment. All variables are optional.

- `HTTP_PROXY`
- `HTTPS_PROXY`
- `NO_PROXY`

If `HTTP_PROXY` or `HTTPS_PROXY` is set and `NO_PROXY` is not set, `NO_PROXY` will automatically be set to `localhost,127.0.0.1,.svc.cluster.local,kubernetes.default.svc,metadata-grpc-service,0,1,2,3,4,5,6,7,8,9`.

### Example of an API Server deployment with `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` set

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: ml-pipeline
    application-crd-id: kubeflow-pipelines
  name: ml-pipeline
  namespace: kubeflow
spec:
  selector:
    matchLabels:
      app: ml-pipeline
      application-crd-id: kubeflow-pipelines
  template:
    metadata:
      annotations:
        cluster-autoscaler.kubernetes.io/safe-to-evict: "true"
      labels:
        app: ml-pipeline
        application-crd-id: kubeflow-pipelines
    spec:
      containers:
      - env:
        - name: HTTP_PROXY
          value: http://squid.squid.svc.cluster.local:3128
        - name: HTTPS_PROXY
          value: http://squid.squid.svc.cluster.local:3128
        - name: NO_PROXY
          value: localhost,127.0.0.1,.svc.cluster.local,kubernetes.default.svc,metadata-grpc-service,0,1,2,3,4,5,6,7,8,9
```

## Custom CA Bundle

You can configure the Kubeflow Pipelines API server to use a custom Certificate Authority (CA) bundle for pipeline workloads by providing the CA certificate through a Kubernetes Secret or ConfigMap.

The following environment variables are available:

* **`CABUNDLE_SECRET_NAME`**: The name of the Kubernetes Secret containing the custom CA certificate.
* **`CABUNDLE_CONFIGMAP_NAME`**: The name of the Kubernetes ConfigMap containing the custom CA certificate.
* **`CABUNDLE_KEY_NAME`**: The key containing the CA certificate in the Secret or ConfigMap. The default value is `ca.crt`.

`CABUNDLE_SECRET_NAME` takes precedence over `CABUNDLE_CONFIGMAP_NAME`. If `CABUNDLE_SECRET_NAME` is set, KFP uses the specified Secret even if `CABUNDLE_CONFIGMAP_NAME` is also set. If neither is set, KFP does not configure a custom CA bundle.

The CA certificate is mounted into the pipeline workload at `/kfp/certs/ca.crt`.

### Example using a Kubernetes Secret

The following example configures KFP to use a CA certificate from a Kubernetes Secret named `my-ca-secret`:

```yaml
- name: CABUNDLE_SECRET_NAME
  value: my-ca-secret
```

By default, KFP looks for the certificate in the `ca.crt` key of the Secret. If the certificate is stored under a different key, set `CABUNDLE_KEY_NAME` to that key:

```yaml
- name: CABUNDLE_SECRET_NAME
  value: my-ca-secret
- name: CABUNDLE_KEY_NAME
  value: my-custom-ca
```

### Example using a Kubernetes ConfigMap

To use a CA certificate stored in a ConfigMap, set `CABUNDLE_CONFIGMAP_NAME`:

```yaml
- name: CABUNDLE_CONFIGMAP_NAME
  value: my-ca-configmap
```

By default, KFP looks for the certificate in the `ca.crt` key. If the certificate is stored under a different key, configure `CABUNDLE_KEY_NAME`:

```yaml
- name: CABUNDLE_CONFIGMAP_NAME
  value: my-ca-configmap
- name: CABUNDLE_KEY_NAME
  value: my-custom-ca
```
