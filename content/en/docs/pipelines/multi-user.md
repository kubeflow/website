+++
title = "Multi-user Isolation for Pipelines"
description = "Getting started with Kubeflow Pipelines multi-user isolation"
weight = 35
+++

Multi-user isolation for Kubeflow Pipelines is an integration to [Kubeflow multi-user isolation](/docs/components/multi-tenancy/).

Refer to [Getting Started with Multi-user isolation](/docs/components/multi-tenancy/getting-started/)
for the common Kubeflow multi-user operations including the following:

* [Grant user minimal Kubernetes cluster access](/docs/components/multi-tenancy/getting-started/#pre-requisites-grant-user-minimal-kubernetes-cluster-access)
* [Managing contributors through the Kubeflow UI](/docs/components/multi-tenancy/getting-started/#managing-contributors-through-the-kubeflow-ui)
* For Google Cloud: [In-cluster authentication to Google Cloud from Kubeflow](/docs/gke/authentication/#in-cluster-authentication)

Note, Kubeflow Pipelines multi-user isolation is only supported in
[the full Kubeflow deployment](/docs/pipelines/installation/overview/#full-kubeflow-deployment)
starting from Kubeflow v1.1 and **currently** on all platforms except OpenShift. For the latest status about platform support, refer to [kubeflow/manifests#1364](https://github.com/kubeflow/manifests/issues/1364#issuecomment-668415871).

Also be aware that the isolation support in Kubeflow doesn’t provide any hard
security guarantees against malicious attempts by users to infiltrate other
user’s profiles.
 
## How are resources separated?

Kubeflow Pipelines separates its resources by Kubernetes namespaces (Kubeflow profiles).

Experiments belong to namespaces directly and there's no longer a default
experiment. Runs and recurring runs belong to their parent experiment's namespace.

Pipeline runs are executed in user namespaces, so that users can leverage Kubernetes
namespace isolation. For example, they can configure different secrets for other
services in different namespaces.

Other users cannot see resources in your namespace without permission, because
the Kubeflow Pipelines API server rejects requests for namespaces that the
current user is not authorized to access.

Note, there's no multi-user isolation for pipeline definitions right now.
Refer to [Current Limitations](#current-limitations) section for more details.

### When using the UI

When you visit the Kubeflow Pipelines UI from the Kubeflow dashboard, it only shows
experiments, runs, and recurring runs in your chosen namespace. Similarly, when
you create resources from the UI, they also belong to the namespace you have
chosen.

You can select a different namespace to view resources in other namespaces.

### When using the SDK

First, you need to connect to the Kubeflow Pipelines public endpoint using the
SDK. For Google Cloud, follow [these instructions](/docs/gke/pipelines/authentication-sdk/#connecting-to-kubeflow-pipelines-in-a-full-kubeflow-deployment).

When calling SDK methods for experiments, you need to provide the additional
namespace argument. Runs, recurring runs are owned by an experiment. They are
in the same namespace as the parent experiment, so you can just call their SDK
methods in the same way as before.

For example:

```python
import kfp
client = kfp.Client(...) # Refer to documentation above for detailed arguments.

client.create_experiment(name='<Your experiment name>', namespace='<Your namespace>')
print(client.list_experiments(namespace='<Your namespace>'))
client.run_pipeline(
    experiment_id='<Your experiment ID>', # Experiment determines namespace.
    job_name='<Your job ID>',
    pipeline_id='<Your pipeline ID>')
print(client.list_runs(experiment_id='<Your experiment ID>'))
print(client.list_runs(namespace='<Your namespace>'))
```

To store your user namespace as the default context, use the
[`set_user_namespace`](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html#kfp.Client.set_user_namespace)
method. This method stores your user namespace in a configuration file at
`$HOME/.config/kfp/credentials.json`. After setting a default namespace, the SDK
methods default to use this namespace if no namespace argument is provided.

```python
# Note, this saves the namespace in `$HOME/.config/kfp/credentials.json`. Therefore,
# You only need to call this once. The saved namespace context will be picked up
# by other clients you use later.
client.set_user_namespace(namespace='<Your namespace>')
print(client.get_user_namespace())

client.create_experiment(name='<Your experiment name>')
print(client.list_experiments())
client.run_pipeline(
    experiment_id='<Your experiment ID>', # Experiment determines namespace.
    job_name='<Your job name>',
    pipeline_id='<Your pipeline ID>')
print(client.list_runs())

# Specifying a different namespace will override the default context.
print(client.list_runs(namespace='<Your other namespace>'))
```

Note, it is no longer possible to access the Kubeflow Pipelines API service from
in-cluster workload directly, read [Current Limitations section](#current-limitations)
for more details.

Detailed documentation for the Kubeflow Pipelines SDK can be found in the
[Kubeflow Pipelines SDK Reference](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.client.html).

### When using REST API or generated python API client

Similarly, when calling [REST API endpoints](/docs/pipelines/reference/api/kubeflow-pipeline-api-spec/)
or using [the generated python API client](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.server_api.html),
namespace argument is required for experiment APIs. Note that namespace is
referred to using a resource reference. The resource reference **type** is
`NAMESPACE` and resource reference **key id** is the namespace name.

The following example demonstrates how to use [the generated Python API client (kf-server-api)](https://kubeflow-pipelines.readthedocs.io/en/latest/source/kfp.server_api.html) in a multi-user environment.

```python
from kfp_server_api import ApiRun, ApiPipelineSpec, \
    ApiExperiment, ApiResourceType, ApiRelationship, \
    ApiResourceReference, ApiResourceKey
# or you can also do the following instead
# from kfp_server_api import *

experiment=client.experiments.create_experiment(body=ApiExperiment(
    name='test-experiment-1234',
    resource_references=[ApiResourceReference(
        key=ApiResourceKey(
            id='<namespace>', # Replace with your own namespace.
            type=ApiResourceType.NAMESPACE,
        ),
        relationship=ApiRelationship.OWNER,
    )],
))
print(experiment)
pipeline = client.pipelines.list_pipelines().pipelines[0]
print(pipeline)
client.runs.create_run(body=ApiRun(
    name='test-run-1234',
    pipeline_spec=ApiPipelineSpec(
        pipeline_id=pipeline.id,
    ),
    resource_references=[ApiResourceReference(
        key=ApiResourceKey(
            id=experiment.id,
            type=ApiResourceType.EXPERIMENT,
        ),
        relationship=ApiRelationship.OWNER,
    )],
))
runs=client.runs.list_runs(
    resource_reference_key_type=ApiResourceType.EXPERIMENT,
    resource_reference_key_id=experiment.id,
)
print(runs)
```

## Current limitations

### Resources without isolation

The following resources do not currently support isolation and are shared
without access control:

* Pipelines (Pipeline definitions).
* Artifacts, Executions, and other metadata entities in [Machine Learning Metadata (MLMD)](https://www.tensorflow.org/tfx/guide/mlmd).
* [Minio artifact storage](https://min.io/) which contains pipeline runs' input/output artifacts.

### In-cluster API request authentication

Clients can only access the Kubeflow Pipelines API from the public endpoint
that enforces authentication.

In-cluster direct access to the API endpoint is denied by Istio authorization
policies, because there's no secure way to authenticate in-cluster requests to
the Kubeflow Pipelines API server yet.

If you need to access the API endpoint from in-cluster workload like Jupyter
notebooks or cron tasks, current suggested workaround is to connect through
public endpoint and follow platform specific documentation to authenticate
programmatically using user credentials. For Google Cloud, you can refer to
[Connecting to Kubeflow Pipelines in a full Kubeflow deployment on Google Cloud](/docs/gke/pipelines/authentication-sdk/#connecting-to-kubeflow-pipelines-in-a-full-kubeflow-deployment).
