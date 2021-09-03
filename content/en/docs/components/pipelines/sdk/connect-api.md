+++
title = "Connecting to Kubeflow Pipelines using the SDK client"
description = "How to connect to Kubeflow Pipelines using the SDK client and configure the SDK client using environment variables"
weight = 25
+++

This guide demonstrates how to connect to Kubeflow Pipelines using [the Kubeflow Pipelines SDK client](/docs/components/pipelines/sdk/sdk-overview/), and how to [configure the SDK client using environment variables](#configure-sdk-client-by-environment-variables).

## Before you begin

* You need a Kubeflow Pipelines deployment using one of the [installation options](/docs/components/pipelines/installation/overview/).
* [Install the Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/install-sdk/).

## Connect to Kubeflow Pipelines using SDK

The Kubeflow Pipelines REST API is available at the same endpoint as the Kubeflow Pipelines user interface (UI).
The SDK client can send requests to this endpoint to upload pipelines, create pipeline runs, schedule recurring runs and more.

### Connect to Kubeflow Pipelines from outside your cluster

Kubeflow distributions secure the Kubeflow Pipelines public endpoint with authentication and authorization.
Since Kubeflow distributions can have different authentication and authorization requirements, the steps needed to connect to your Kubeflow Pipelines instance might be different depending on the Kubeflow distribution you installed. Refer to documentation for [your Kubeflow distribution](/docs/started/installing-kubeflow/):

* [Connecting to Kubeflow Pipelines on Google Cloud using the SDK](/docs/distributions/gke/pipelines/authentication-sdk/)
* [Kubeflow Pipelines on AWS](https://www.kubeflow.org/docs/distributions/aws/pipeline/#authenticate-kubeflow-pipeline-using-sdk-inside-cluster)
* [Authentication using OIDC in Azure](/docs/distributions/azure/authentication-oidc/)
* [Pipelines on IBM Cloud Kubernetes Service (IKS)](/docs/distributions/ibm/pipelines/)

For [Kubeflow Pipelines standalone](https://www.kubeflow.org/docs/components/pipelines/installation/standalone-deployment/) and [Google Cloud AI Platform Pipelines](/docs/components/pipelines/installation/overview/#google-cloud-ai-platform-pipelines), you can also connect to the API via `kubectl port-forward`.

Kubeflow Pipelines standalone deploys a Kubernetes service named `ml-pipeline-ui` in your Kubernetes cluster without extra authentication.

You can use [kubectl port-forward](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) to port forward the Kubernetes service locally to your laptop outside of the cluster:

```bash
# Change the namespace if you deployed Kubeflow Pipelines in a different
# namespace.
$ kubectl port-forward svc/ml-pipeline-ui 3000:80 --namespace kubeflow
```

You can verify that port forwarding is working properly by visiting [http://localhost:3000](http://localhost:3000) in your browser. If port forwarding is working properly, the Kubeflow Pipelines UI appears.

Run the following python code to instantiate the `kfp.Client`:

```python
import kfp
client = kfp.Client(host='http://localhost:3000')
print(client.list_experiments())
```

Note, for Kubeflow Pipelines in multi-user mode, you cannot access the API using kubectl port-forward
because it requires authentication. Refer to distribution specific documentation as recommended above.

### Connect to Kubeflow Pipelines from the same cluster

#### Multi-User mode

Authentication uses ServiceAccountToken 
[projection](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection) where token with limited lifetime, that can be verified by Kubeflow Pipelines API, is being injected into (e.g. Jupyter notebook's) Pod.

In order to **access Kubeflow Pipeline from Jupyter notebook**, additional per namespace (profile) manifest is required:

```yaml
apiVersion: kubeflow.org/v1alpha1
kind: PodDefault
metadata:
  name: access-ml-pipeline
  namespace: "<YOUR_USER_PROFILE_NAMESPACE>"
spec:
  desc: Allow access to Kubeflow Pipelines
  selector:
    matchLabels:
      access-ml-pipeline: "true"
  volumes:
    - name: volume-kf-pipeline-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              expirationSeconds: 7200
              audience: pipelines.kubeflow.org      
  volumeMounts:
    - mountPath: /var/run/secrets/kubeflow/pipelines
      name: volume-kf-pipeline-token
      readOnly: true
  env:
    - name: KF_PIPELINES_SA_TOKEN_PATH
      value: /var/run/secrets/kubeflow/pipelines/token
```

After the manifest is deployed, newly created Jupyter notebook contains additional option (`Allow access to Kubeflow Pipelines`) in section **configurations**.
Read more about **configurations** on [Jupyter notebook server](/docs/components/notebooks/setup/#create-a-jupyter-notebook-server-and-add-a-notebook).

Note, Kubeflow `kfp.Client` expects token either in `KF_PIPELINES_SA_TOKEN_PATH` environment variable or mounted to `/var/run/secrets/kubeflow/pipelines/token`. Do not change these values in the manifest. Similarly, `audience` should not be modified as well.

If token is found, `kfp.Client` puts it in the `Authorization: Bearer <token>` header where Kubeflow Pipelines API can read it. No additional setup is required to refresh tokens.

Setup is similar for other cases like e.g. **cron tasks or in-cluster CI/CD**: Configure your Pod with token in either `KF_PIPELINES_SA_TOKEN_PATH` or `/var/run/secrets/kubeflow/pipelines/token` and `kfp.Client` will gain access to Kubeflow Pipelines.

#### Generic

As mentioned above, the Kubeflow Pipelines API Kubernetes service is `ml-pipeline-ui`.

Using [Kubernetes standard mechanisms to discover the service](https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services), you can access `ml-pipeline-ui` service from a Pod in the same namespace by DNS name:

```python
import kfp
client = kfp.Client(host='http://ml-pipeline-ui:80')
print(client.list_experiments())
```

Or, you can access `ml-pipeline-ui` service by using environment variables:

```python
import kfp
import os
host = os.getenv('ML_PIPELINE_UI_SERVICE_HOST')
port = os.getenv('ML_PIPELINE_UI_SERVICE_PORT')
client = kfp.Client(host=f'http://{host}:{port}')
print(client.list_experiments())
```

When accessing Kubeflow Pipelines from a Pod in a different namespace, you must access by the service name and the namespace:

```python
import kfp
namespace = 'kubeflow' # or the namespace you deployed Kubeflow Pipelines
client = kfp.Client(host=f'http://ml-pipeline-ui.{namespace}:80')
print(client.list_experiments())
```

## Configure SDK client by environment variables

It's usually beneficial to configure the Kubeflow Pipelines SDK client using Kubeflow Pipelines environment variables,
so that you can initiate `kfp.Client` instances without any explicit arguments.

For example, when the API endpoint is [http://localhost:3000](http://localhost:3000), run the following to configure environment variables in bash:

```bash
export KF_PIPELINES_ENDPOINT=http://localhost:3000
```

Or configure in a Jupyter Notebook by using the [IPython built-in `%env` magic command](https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-env):

```python
%env KF_PIPELINES_ENDPOINT=http://localhost:3000
```

Then you can use the SDK client without explicit arguments.

```python
import kfp
# When not specified, host defaults to env var KF_PIPELINES_ENDPOINT.
# This is now equivalent to `client = kfp.Client(host='http://localhost:3000')`
client = kfp.Client()
print(client.list_experiments())
```

Refer to [more configurable environment variables here](https://github.com/kubeflow/pipelines/blob/54ac9a6a7173aecbbb30a043b2077e790cac6953/sdk/python/kfp/_client.py#L84-L90).

## Next Steps

* [Using the Kubeflow Pipelines SDK](/docs/components/pipelines/tutorials/sdk-examples/)
* [Kubeflow Pipelines SDK Reference](https://kubeflow-pipelines.readthedocs.io/en/stable/)
* [Experiment with the Kubeflow Pipelines API](/docs/components/pipelines/tutorials/api-pipelines/)
