+++
title = "Database Configuration"
description = ""
weight = 4
+++

{{% kfp-v2-keywords %}}

Kubeflow Pipelines (KFP) uses a relational database to store pipeline definitions, run history, and other metadata. The API server is the main component that interacts with the database.

By default, KFP deploys with MySQL. PostgreSQL is also available as an experimental option.

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

## PostgreSQL (Experimental)

{{% alert title="Warning" color="warning" %}}
PostgreSQL support is experimental and not yet included in a stable release. It is expected to be available starting from v3.0.0.
{{% /alert %}}

KFP provides a dedicated kustomize overlay for PostgreSQL-based deployments at `manifests/kustomize/env/platform-agnostic-postgresql`.

### Deploying with PostgreSQL After Official Release

Once PostgreSQL support is included in a stable release (v3.0.0+), the base images will have PostgreSQL support built in. You can deploy KFP with PostgreSQL using the `platform-agnostic-postgresql` overlay:

```bash
export PIPELINE_VERSION=<version-with-postgresql-support>
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/cluster-scoped-resources?ref=$PIPELINE_VERSION"
kubectl wait --for condition=established --timeout=60s crd/applications.app.k8s.io
kubectl apply -k "github.com/kubeflow/pipelines/manifests/kustomize/env/platform-agnostic-postgresql?ref=$PIPELINE_VERSION"
```

### Early Access: Building from Source

The current stable release images do not include PostgreSQL support. If you want to try PostgreSQL before the official release, you need to build images from the `master` branch of the [kubeflow/pipelines](https://github.com/kubeflow/pipelines) repository.

#### Build the Required Images

Clone the repository and build the images:

```bash
cd backend
make image_api_server
make image_cache
```

#### Push to Your Registry

Tag and push the built images to your own container registry:

```bash
docker tag gcr.io/ml-pipeline/api-server:latest your-registry/kfp-api-server:your-tag
docker tag gcr.io/ml-pipeline/cache-server:latest your-registry/kfp-cache-server:your-tag
docker push your-registry/kfp-api-server:your-tag
docker push your-registry/kfp-cache-server:your-tag
```

#### Create a Custom Overlay

Create a kustomize overlay that references the `platform-agnostic-postgresql` base and overrides the image references with your custom-built images:

```bash
mkdir -p my-postgresql-overlay
cd my-postgresql-overlay
```

Create a `kustomization.yaml`:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - ../manifests/kustomize/env/platform-agnostic-postgresql

images:
  - name: ghcr.io/kubeflow/kfp-api-server
    newName: your-registry/kfp-api-server
    newTag: your-tag
  - name: ghcr.io/kubeflow/kfp-cache-server
    newName: your-registry/kfp-cache-server
    newTag: your-tag
```

#### Deploy

Apply your custom overlay:

```bash
kubectl apply -k my-postgresql-overlay
```
