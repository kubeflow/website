+++
title = "Connecting to API"
description = "How to connect to Kubeflow Pipelines API using the SDK"
weight = 80
+++

This guide describes how to connect to your Kubeflow Pipelines API using [the Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/sdk-overview/) in general.

The exact steps needed to connect to your own Kubeflow Pipelines API is different depending on the Kubeflow distribution you installed, because they may have different authentication requirements. Refer to documentation for [your Kubeflow distribution](/docs/started/installing-kubeflow/):

* [Connecting to Kubeflow Pipelines on Google Cloud using the SDK](/docs/distributions/gke/pipelines/authentication-sdk/)
* [Kubeflow Pipelines on AWS](https://www.kubeflow.org/docs/distributions/aws/pipeline/#authenticate-kubeflow-pipeline-using-sdk-inside-cluster)
* [Authentication using OIDC in Azure](/docs/distributions/azure/authentication-oidc/)
* [Pipelines on IBM Cloud Kubernetes Service (IKS)](/docs/distributions/ibm/pipelines/)

## Before you begin

* You need a Kubeflow Pipelines deployment using one of the [installation options](/docs/components/pipelines/installation/overview/).
* [Install the Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/install-sdk/).

## How Kubeflow Pipelines SDK connects to API?

Kubeflow Pipelines REST API is available in the same endpoint as its UI.
The SDK client can send requests to this endpoint to upload pipelines, create pipeline runs, schedule recurring runs and more.

If the endpoint is accessible without authentication / authorization, it's easier to connect.

## Connect to API from outside your cluster

If you deployed [Kubeflow Pipelines standalone](https://www.kubeflow.org/docs/components/pipelines/installation/standalone-deployment/). It deploys a Kubernetes service named `ml-pipeline-ui` in your Kubernetes cluster without extra authentication.

You can use [kubectl port-forward](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) to port forward the Kubernetes service locally to your laptop outside of the cluster:

```bash
# The Kubeflow Pipelines API service and the UI is available at
# http://localhost:3000 without authentication check.
$ kubectl port-forward svc/ml-pipeline-ui 3000:80 --namespace kubeflow
# Change the namespace if you deployed Kubeflow Pipelines in a different
# namespace.
```

You can verify port forwarding is working properly by visiting <http://localhost:3000> in your browser. Kubeflow Pipelines UI should show up.

Then, you can create an SDK client in python by:

```python
import kfp
client = kfp.Client(host='http://localhost:3000')
print(client.list_experiments())
```

Note, for Kubeflow Pipelines in multi-user mode, you cannot access the API using kubectl port-forward
because it requires authentication. Refer to distribution specific documentation as recommended above.

## Connect to API from the same cluster

As mentioned above, the Kubeflow Pipelines API Kubernetes service is `ml-pipeline-ui`.

Using [Kubernetes standard mechanisms to discover the service](https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services), we can access it from a Pod in the same namespace by DNS name:

```python
import kfp
client = kfp.Client(host='http://ml-pipeline-ui:80')
print(client.list_experiments())
```

Or by environment variables:

```python
import kfp
import os
host = os.getenv('ML_PIPELINE_UI_SERVICE_HOST')
port = os.getenv('ML_PIPELINE_UI_SERVICE_PORT')
client = kfp.Client(host=f'http://{host}:{port}')
print(client.list_experiments())
```

When not in the same namespace, we can only access by DNS name with namespace:

```python
import kfp
namespace = 'kubeflow' # or the namespace you deployed Kubeflow Pipelines
client = kfp.Client(host=f'http://ml-pipeline-ui.{namespace}:80')
print(client.list_experiments())
```

## Configure SDK client transparently

It's usually beneficial to configure SDK client by Kubeflow Pipelines environment variables,
so that you can initiate `kfp.Client` instances without any explicit arguments.

For example, when port forwarding API endpoint locally, configure environment variables in bash by:

```bash
export KF_PIPELINES_ENDPOINT=http://localhost:3000
```

Or configure in a jupyter notebook by:

```python
%env KF_PIPELINES_ENDPOINT=http://localhost:3000
```

Then you can use the SDK client without explicit arguments.

```python
import kfp
client = kfp.Client()
print(client.list_experiments())
```

Refer to [more configurable environment variables here](https://github.com/kubeflow/pipelines/blob/54ac9a6a7173aecbbb30a043b2077e790cac6953/sdk/python/kfp/_client.py#L84-L90).
