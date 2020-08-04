+++
title = "Multi-user Isolation"
description = "Getting started with Kubeflow Pipelines multi-user isolation"
weight = 35
+++

Multi-user isolation for Kubeflow Pipelines is an integration to [Kubeflow multi-user isolation](/docs/components/multi-tenancy/).

Please refer to [Getting Started with Multi-user isolation](/docs/components/multi-tenancy/getting-started/)
for the common Kubeflow multi-user operations including the following:

* [Grant user minimal Kubernetes cluster access](/docs/components/multi-tenancy/getting-started/#pre-requisites-grant-user-minimal-kubernetes-cluster-access)
* [Managing contributors through the Kubeflow UI](/docs/components/multi-tenancy/getting-started/#managing-contributors-through-the-kubeflow-ui)
<!-- TODO(Bobgy): document Grant user GCP permissions in above doc -->

Note, Kubeflow Pipelines multi-user isolation is only supported in
[the full Kubeflow deployment](/docs/pipelines/installation/overview/#full-kubeflow-deployment)
starting from Kubeflow v1.1 and **only** in the following platforms:

* Google Cloud
* Amazon Web Services
* IBM Cloud

Also be aware that the isolation support in Kubeflow doesn’t provide any hard
security guarantees against malicious attempts by users to infiltrate other
user’s profiles.
 
## How are resources separated?

Kubeflow Pipelines separates its resources by Kubernetes namespaces (Kubeflow profiles).

Experiments belong to namespaces directly and there's no longer a default
experiment. Runs and recurring runs belong to their parent experiment's namespace.

Pipeline runs run in user namespaces, so that users can leverage Kubernetes
namespace isolation. For example, they can configure different secrets for other
services in different namespaces.

There's no multi-user isolation for pipeline definitions right now.

### When using the UI

When you visit the Kubeflow Pipelines UI from the Kubeflow dashboard, it only shows
experiments, runs and recurring runs in your chosen namespace. Similarly, when
you create resources from the UI, they also belong to the namespace you have
chosen.

You can select a different namespace to view resources in other namespaces.

Other users cannot see your namespace without permission. They will be rejected by
authorization checks in Kubeflow Pipelines API server.

<!---
#### Configuring Google Cloud permissions for namespace
#### Granting Google Cloud permissions to UI Artifact Preview and Visualization

For artifacts stored on Google Cloud Storage (GCS), Kubeflow Pipelines deploys
artifact fetcher servers on user namespaces. The servers use `default-editor`
Kubernetes service account, so that they are using the same Google service
account as pipeline runs.
-->

### When using the SDK

* <!-- this should be in GCP pipelines - auth doc --> how to authenticate to the public endpoint

When calling SDK methods for experiments, you need to provide the additional
namespace argument. Runs, recurring runs are owned by an experiment. They are
in the same namespace as the parent experiment, so you can call their SDK
methods as before.

For example:

```python
import kfp
client = kfp.Client(...)

client.create_experiment(name='<Your experiment name>', namespace='<Your namespace>')
print(client.list_experiments(namespace='<Your namespace>'))
client.run_pipeline(experiment_id='<Your experiment ID>', job_name='<Your job ID>', pipeline_id='<Your pipeline ID>')
print(client.list_runs(experiment_id='<Your experiment ID>'))
print(client.list_runs(namespace='<Your namespace>'))
```

We also provide a helper method that saves a user namespace as default context
in config file `$HOME/.config/kfp/context.json`. After setting a default
namespace, the SDK methods default to use this namespace if no `namespace`
argument provided.

```python
import kfp
client = kfp.Client(...)

# Note, this saves the namespace in `$HOME/.config/kfp/context.json`. Therefore,
# You only need to call this once. The saved namespace context will be picked up
# by other clients you use later.
client.set_user_namespace(namespace='<Your namespace>')
print(client.get_user_namespace())

client.create_experiment(name='<Your experiment name>')
print(client.list_experiments())
client.run_pipeline(experiment_id='<Your experiment ID>', job_name='<Your job ID>', pipeline_id='<Your pipeline ID>')
print(client.list_runs())

# Specifying a different namespace will override the default context.
print(client.list_runs(namespace='<Your other namespace>'))
```

Detailed documentation for KFP SDK can be found on
[Pipelines SDK Reference](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html).

### When using rest API or generated API client

* add namespace resource reference/namespace argument to api endpoints.

All features are supported.

Mention which resources are separated:
* experiments
* runs
* jobs
* external artifacts e.g. links in mlpipeline-ui-metadata.json
* tensorboard

Others not separated mentioned below

## What are current limitations?

* pipelines
* mlmd
* minio artifact storage
* in-cluster auth based on service account token or istio mTLS
