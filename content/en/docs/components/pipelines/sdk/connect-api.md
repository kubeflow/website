+++
title = "Connecting to Kubeflow Pipelines using the SDK client"
description = "How to connect to Kubeflow Pipelines using the SDK client and configure the SDK client using environment variables"
weight = 25
+++

This guide demonstrates how to connect to Kubeflow Pipelines using [the Kubeflow Pipelines SDK client](/docs/components/pipelines/sdk/sdk-overview/), and how to [configure the SDK client using environment variables](#configure-sdk-client-by-environment-variables).


The Kubeflow Pipelines REST API is available at the same endpoint as the Kubeflow Pipelines user interface (UI).
The SDK client can send requests to this endpoint to upload pipelines, create pipeline runs, schedule recurring runs, and more.


## Before you begin

* You need a Kubeflow Pipelines deployment using one of the [installation options](/docs/components/pipelines/installation/overview/).
* [Install the Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/install-sdk/).


## Connect to Kubeflow Pipelines from outside your cluster

Kubeflow distributions secure the Kubeflow Pipelines public endpoint with authentication and authorization.
Since Kubeflow distributions can have different authentication and authorization requirements, the steps needed to connect to your Kubeflow Pipelines instance might be different depending on the Kubeflow distribution you installed. Refer to documentation for [your Kubeflow distribution](/docs/started/installing-kubeflow/):

* [Connecting to Kubeflow Pipelines on Google Cloud using the SDK](/docs/distributions/gke/pipelines/authentication-sdk/)
* [Kubeflow Pipelines on AWS](https://awslabs.github.io/kubeflow-manifests/docs/component-guides/pipelines/)
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

## Connect to Kubeflow Pipelines from the same cluster

### Non-multi-user mode

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

### Multi-User mode

Note, multi-user mode technical details were put in the [How in-cluster authentication works](#how-multi-user-mode-in-cluster-authentication-works) section below.

Choose your use-case from one of the options below:

* **Access Kubeflow Pipelines from Jupyter notebook**

  In order to **access Kubeflow Pipelines from Jupyter notebook**, an additional per namespace (profile) manifest is required:

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

  After the manifest is applied, newly created Jupyter notebook contains an additional option in the **configurations** section.
  Read more about **configurations** in the [Jupyter notebook server](/docs/components/notebooks/setup/#create-a-jupyter-notebook-server-and-add-a-notebook).

  Note, Kubeflow `kfp.Client` expects token either in `KF_PIPELINES_SA_TOKEN_PATH` environment variable or 
  mounted to `/var/run/secrets/kubeflow/pipelines/token`. Do not change these values in the manifest. 
  Similarly, `audience` should not be modified as well. No additional setup is required to refresh tokens.

  Remember the setup has to be repeated per each namespace (profile) that should have access to Kubeflow Pipelines API from within Jupyter notebook.

* **Access Kubeflow Pipelines from within any Pod**

  In this case, the configuration is almost similar to the Jupyter Notebook case described above. 
  The Pod manifest has to be extended with projected volume and mounted into either 
  `KF_PIPELINES_SA_TOKEN_PATH` or `/var/run/secrets/kubeflow/pipelines/token`. 

  Manifest below shows example Pod with token mounted into `/var/run/secrets/kubeflow/pipelines/token`:

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: access-kfp-example
    namespace: my-namespace
  spec:
    containers:
    - image: my-image:latest 
      name: access-kfp-example
      volumeMounts:
        - mountPath: /var/run/secrets/kubeflow/pipelines
          name: volume-kf-pipeline-token
          readOnly: true
    serviceAccountName: default-editor
    volumes:
      - name: volume-kf-pipeline-token
        projected:
          sources:
            - serviceAccountToken:
                path: token
                expirationSeconds: 7200
                audience: pipelines.kubeflow.org      
  ```

  Note that this example uses `default-editor` in `my-namespace` as the service account identity, but you can configure
  to use any service account that runs in your Pod. You need to bind service account to cluster role `kubeflow-pipelines-edit`
  or `kubeflow-pipelines-view` documented in 
  [view-edit-cluster-roles.yaml](https://github.com/kubeflow/pipelines/blob/sdk/release-1.8/manifests/kustomize/base/installs/multi-user/view-edit-cluster-roles.yaml#L7-L32).

#### Managing access to Kubeflow Pipelines API across namespaces

As already mentioned, access to Kubeflow Pipelines API requires per namespace setup.
Alternatively, you can configure the access in a single namespace and allow other
namespaces to access Kubeflow Pipelines API through it.

Note, the examples below assume that `namespace-1` is a namespace (profile) that will be granted access to Kubeflow Pipelines API 
through the `namespace-2` namespace. The `namespace-2` should already be configured to access Kubeflow Pipelines API.

Cross-namespace access can be achieved in two ways:

* **With additional RBAC settings.**

  This option requires that only `namespace-2` has to have `PodDefault` manifest configured.

  Access is granted by giving `namespace-1:ServiceAccount/default-editor` the `ClusterRole/kubeflow-edit` in `namespace-2`:

  ```
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: kubeflow-edit-namespace-1
    namespace: namespace-2
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: kubeflow-edit
  subjects:
  - kind: ServiceAccount
    name: default-editor
    namespace: namespace-1
  ```

* **By sharing access to the other profile.**

  In this scenario, access is granted by `namespace-2` adding `namespace-1` as a  
  [contributor](https://www.kubeflow.org/docs/components/multi-tenancy/getting-started/#managing-contributors-through-the-kubeflow-ui). 
  Specifically, the owner of the `namespace-2` uses Kubeflow UI "Manage contributors" page. In the "Contributors to your namespace" 
  textbox he adds email address associated with the `namespace-1`.

#### How Multi-User mode in-cluster authentication works

When calling Kubeflow Pipelines API in the same cluster, Kubeflow Pipelines SDK authenticates itself as your Pod's service account in your namespace using ServiceAccountToken 
[projection](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection). This is where a verifiable token with a limited lifetime is being injected into a Pod (e.g. Jupyter notebook's).

Then Kubeflow Pipelines SDK uses this token to authorize against Kubeflow Pipelines API.
It is important to understand that `serviceAccountToken` method respects the Kubeflow Pipelines RBAC, 
and does not allow access beyond what the ServiceAcount running the notebook Pod has.

More details about `PodDefault` can be found [here](https://github.com/kubeflow/kubeflow/blob/master/components/admission-webhook/README.md).

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
