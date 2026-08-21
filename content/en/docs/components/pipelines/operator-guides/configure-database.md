+++
title = "Database Configuration"
description = ""
weight = 4
+++

{{% kfp-v2-keywords %}}

Kubeflow Pipelines (KFP) uses a relational database to store pipeline definitions, run history, and other metadata. The API server is the main component that interacts with the database.

By default, KFP deploys with MySQL. PostgreSQL is also available for a limited set of deployment configurations.

## MySQL (Default)

MySQL is the default database backend for KFP. It is automatically configured when you deploy KFP using the standard kustomize manifests. No additional database configuration is needed.

To deploy KFP with MySQL using the platform-agnostic overlay:

```bash
export PIPELINE_VERSION={{% pipelines/latest-version %}}
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic?ref=$PIPELINE_VERSION"
```

For full installation instructions, see the [Installation](/docs/components/pipelines/operator-guides/installation/) guide.

MySQL is the fully supported backend, and it is the backend assumed by the deployment overlays for proxy-enabled, cache-disabled, pod-to-pod TLS, and artifact proxy configurations.

## PostgreSQL (Limited Support)

{{% alert title="Warning" color="warning" %}}
PostgreSQL support is not yet part of a tagged Kubeflow Pipelines release. The instructions in this section apply to the `master` branch and are intended for development and evaluation, not for production. Production deployments should use MySQL until PostgreSQL support ships in a release.
{{% /alert %}}

KFP can be deployed with PostgreSQL as its database backend using the `pgx` driver. Dedicated kustomize overlays are provided for this purpose:

- `manifests/kustomize/env/platform-agnostic-postgresql` — standalone (single-user)
- `manifests/kustomize/env/platform-agnostic-multi-user-postgresql` — multi-user

### Support Scope

PostgreSQL support is deliberately scoped to the core deployment path. Only the following configuration is tested and supported:

- execution cache **enabled**
- proxy **disabled**
- pod-to-pod TLS **disabled**

No PostgreSQL overlay exists for the following combinations, so they are **not supported**:

| Mode | Unsupported combination |
| --- | --- |
| Standalone | PostgreSQL with pod-to-pod TLS enabled |
| Standalone | PostgreSQL with the execution cache disabled |
| Standalone | PostgreSQL with proxy enabled |
| Multi-user | PostgreSQL with the execution cache disabled |
| Multi-user | PostgreSQL with the artifact proxy enabled |

These combinations are also rejected explicitly by the project's CI deployment script, so they are not exercised in testing.

{{% alert title="Warning" color="warning" %}}
**Pod-to-pod TLS is not available with PostgreSQL.** The only pod-to-pod TLS overlay, `platform-agnostic-standalone-tls`, is a standalone MySQL-based configuration, and there is no PostgreSQL equivalent for either standalone or multi-user deployments. Enabling pod-to-pod TLS on a PostgreSQL deployment does not encrypt traffic between pods.

Note that the absence of a multi-user TLS overlay is not specific to PostgreSQL: no multi-user pod-to-pod TLS overlay exists for any database backend. Switching to MySQL does not enable pod-to-pod TLS in multi-user mode.
{{% /alert %}}

For proxy-enabled, cache-disabled, and artifact-proxy deployments, use the MySQL-backed configuration. Extending PostgreSQL support to these combinations is tracked in [kubeflow/pipelines#13822](https://github.com/kubeflow/pipelines/issues/13822).

### Configuring `sslmode`

The API server requires `sslmode` to be set explicitly in the PostgreSQL connection parameters; it will not start without it. The base overlay leaves `sslmode` unset so that deployments fail fast rather than silently running without TLS.

Add `patches` to your local overlay to set `sslmode` on both the API server and the cache server. The following example extends the overlay from the next section with `sslmode=disable` for local development:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-postgresql?ref=master

images:
  - name: ghcr.io/kubeflow/kfp-api-server
    newTag: master
  - name: ghcr.io/kubeflow/kfp-cache-server
    newTag: master

patches:
  - patch: |-
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: ml-pipeline
      spec:
        template:
          spec:
            containers:
              - name: ml-pipeline-api-server
                env:
                  - name: DBCONFIG_POSTGRESQLCONFIG_EXTRAPARAMS
                    value: '{"sslmode":"disable"}'
  - patch: |-
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: cache-server
      spec:
        template:
          spec:
            containers:
              - name: server
                args:
                  - "--db_driver=$(DBCONFIG_DRIVER)"
                  - "--db_host=$(DBCONFIG_POSTGRESQLCONFIG_HOST)"
                  - "--db_port=$(DBCONFIG_POSTGRESQLCONFIG_PORT)"
                  - "--db_name=$(DBCONFIG_DB_NAME)"
                  - "--db_user=$(DBCONFIG_POSTGRESQLCONFIG_USER)"
                  - "--db_password=$(DBCONFIG_POSTGRESQLCONFIG_PASSWORD)"
                  - "--db_extra_params={\"sslmode\":\"disable\"}"
                  - "--namespace_to_watch=$(NAMESPACE_TO_WATCH)"
                  - "--listen_port=$(WEBHOOK_PORT)"
```

For production deployments with TLS certificates, replace `disable` with `verify-full` (or another [PostgreSQL sslmode](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS)).

### Deploying with PostgreSQL from `master`

Because PostgreSQL support is not yet in a tagged release, the released container images do not include it. Deploying the overlay at a release tag will not produce a working PostgreSQL deployment. You must use both the manifests and the container images built from `master`.

The base manifests use placeholder image tags (dummy) , so you need a small local overlay that references the remote manifests as a base and overrides those two images.

Create a directory and add a `kustomization.yaml`:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-postgresql?ref=master

images:
  - name: ghcr.io/kubeflow/kfp-api-server
    newTag: master
  - name: ghcr.io/kubeflow/kfp-cache-server
    newTag: master
```

For a multi-user deployment, use the multi-user overlay as the base instead. Multi-user mode requires Istio; see the [multi-user guide](/docs/components/pipelines/operator-guides/multi-user/).

```yaml
resources:
  - github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-multi-user-postgresql?ref=master
```



Then apply the cluster-scoped resources followed by your overlay:

```bash
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=master"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k .
```

Note the following when using this path:

- The `resources` entry must be a remote URL or a relative path. Kustomize rejects absolute paths with a `new root ... cannot be absolute` error.
- `kustomize edit set image` only modifies a local `kustomization.yaml`. It has no effect on a remote base, which is why the image overrides are declared in the file above.
- `master` is a mutable tag. The images it points to change as commits land, so a redeployment may pick up different code.

### Deploying with PostgreSQL After Release

Once PostgreSQL support is included in a Kubeflow Pipelines release, the released images will include it and no image overrides are needed. Deploy the overlay directly:

```bash
export PIPELINE_VERSION=<version-with-postgresql-support>
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-postgresql?ref=$PIPELINE_VERSION"
```

For a multi-user deployment, use the `platform-agnostic-multi-user-postgresql` overlay instead:

```bash
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-multi-user-postgresql?ref=$PIPELINE_VERSION"
```
