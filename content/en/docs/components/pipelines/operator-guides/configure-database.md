+++
title = "Database Configuration"
description = ""
weight = 4
+++

{{% kfp-v2-keywords %}}

Kubeflow Pipelines (KFP) uses a relational database to store pipeline definitions, run history, and other metadata. The API server is the main component that interacts with the database.

By default, KFP deploys with MySQL. PostgreSQL configuration is available only for development and evaluation.

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

## PostgreSQL (Development and Evaluation Only)

{{% alert title="Warning" color="warning" %}}
**PostgreSQL is for development and evaluation only; it is not supported for production KFP 2.18 deployments.** KFP 2.18 still depends on ML Metadata (MLMD), whose PostgreSQL backend has a [known concurrency limitation](https://github.com/kubeflow/pipelines/issues/14353): concurrent first-time metadata type creation can fail runs and leave duplicate metadata type records. PostgreSQL will not be supported until KFP 3.0, when MLMD is removed. Use MySQL for production deployments.
{{% /alert %}}

Some KFP components and manifests can be configured to use PostgreSQL through the `pgx` driver. The following kustomize overlays are available for development and evaluation:

- `manifests/kustomize/env/platform-agnostic-postgresql` — standalone (single-user)
- `manifests/kustomize/env/platform-agnostic-multi-user-postgresql` — multi-user

### Available development and evaluation configurations

The available PostgreSQL overlays use the following configuration:

- execution cache **enabled**
- proxy **disabled**
- pod-to-pod TLS **disabled**

No PostgreSQL overlay is available for the following combinations:

| Mode | Unavailable combination |
| --- | --- |
| Standalone | PostgreSQL with pod-to-pod TLS enabled |
| Standalone | PostgreSQL with the execution cache disabled |
| Standalone | PostgreSQL with proxy enabled |
| Multi-user | PostgreSQL with the execution cache disabled |
| Multi-user | PostgreSQL with the artifact proxy enabled |

These combinations are also rejected explicitly by the project's CI deployment script and are not exercised in testing.

{{% alert title="Warning" color="warning" %}}
**Pod-to-pod TLS is not available with PostgreSQL.** The only pod-to-pod TLS overlay, `platform-agnostic-standalone-tls`, is a standalone MySQL-based configuration, and there is no PostgreSQL equivalent for either standalone or multi-user deployments. Enabling pod-to-pod TLS on a PostgreSQL deployment does not encrypt traffic between pods.

Note that the absence of a multi-user TLS overlay is not specific to PostgreSQL: no multi-user pod-to-pod TLS overlay exists for any database backend. Switching to MySQL does not enable pod-to-pod TLS in multi-user mode.
{{% /alert %}}

For proxy-enabled, cache-disabled, and artifact-proxy deployments, use the MySQL-backed configuration. MySQL is also the required choice for all production deployments.

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

For a development or evaluation deployment with TLS certificates, replace `disable` with `verify-full` (or another [PostgreSQL sslmode](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS)).

### Deploying with PostgreSQL for development or evaluation

KFP 2.18 release images will not include PostgreSQL configuration. For development or evaluation, use both the manifests and container images built from `master`. Do not use this mutable development path for production deployments.

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
