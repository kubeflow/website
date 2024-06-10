+++
title = "Connect the Pipelines SDK to Kubeflow Pipelines"
description = "How to connect the Pipelines SDK to Kubeflow Pipelines in various ways"
weight = 7
+++

How to connect Pipelines SDK to Kubeflow Pipelines will depend on __what kind__ of Kubeflow deployment you have, and __from where you are running your code__.

* [Full Kubeflow (from inside cluster)](#full-kubeflow-subfrom-inside-clustersub)
* [Full Kubeflow (from outside cluster)](#full-kubeflow-subfrom-outside-clustersub)
* [Standalone Kubeflow Pipelines (from inside cluster)](#standalone-kubeflow-pipelines-subfrom-inside-clustersub)
* [Standalone Kubeflow Pipelines (from outside cluster)](#standalone-kubeflow-pipelines-subfrom-outside-clustersub)


{{% alert title="Tip" color="info" %}}
Before you begin, you will need to:
* [Deploy Kubeflow Pipelines](/docs/components/pipelines/legacy-v1/overview/)
* [Install the Kubeflow Pipelines SDK](/docs/components/pipelines/sdk/install-sdk/)
{{% /alert %}}

## Full Kubeflow <sub>(from inside cluster)</sub>

<details>
<summary>Click to expand</summary>
<hr>

When running the Pipelines SDK inside a multi-user Kubeflow cluster, a [ServiceAccount token volume](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection) 
can be mounted to the Pod, the Kubeflow Pipelines SDK can use this token to authenticate itself with the Kubeflow Pipelines API.

The following code creates a `kfp.Client()` using a ServiceAccount token for authentication.

```python
import kfp

# the namespace in which you deployed Kubeflow Pipelines
namespace = "kubeflow"

# the KF_PIPELINES_SA_TOKEN_PATH environment variable is used when no `path` is set
# the default KF_PIPELINES_SA_TOKEN_PATH is /var/run/secrets/kubeflow/pipelines/token
credentials = kfp.auth.ServiceAccountTokenVolumeCredentials(path=None)

client = kfp.Client(host=f"http://ml-pipeline-ui.{namespace}", credentials=credentials)

print(client.list_experiments())
```

The following Pod demonstrates mounting a ServiceAccount token volume.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: access-kfp-example
spec:
  containers:
  - image: hello-world:latest
    name: hello-world
    env:
      - ## this environment variable is automatically read by `kfp.Client()`
        ## this is the default value, but we show it here for clarity
        name: KF_PIPELINES_SA_TOKEN_PATH
        value: /var/run/secrets/kubeflow/pipelines/token
    volumeMounts:
      - mountPath: /var/run/secrets/kubeflow/pipelines
        name: volume-kf-pipeline-token
        readOnly: true
  volumes:
    - name: volume-kf-pipeline-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              expirationSeconds: 7200
              ## defined by the `TOKEN_REVIEW_AUDIENCE` environment variable on the `ml-pipeline` deployment
              audience: pipelines.kubeflow.org      
```

You may use Kubeflow's [`PodDefaults`](https://github.com/kubeflow/kubeflow/tree/master/components/admission-webhook) to inject the required ServiceAccount token volume into your Pods:

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
  env:
    - ## this environment variable is automatically read by `kfp.Client()`
      ## this is the default value, but we show it here for clarity
      name: KF_PIPELINES_SA_TOKEN_PATH
      value: /var/run/secrets/kubeflow/pipelines/token
  volumes:
    - name: volume-kf-pipeline-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              expirationSeconds: 7200
              ## defined by the `TOKEN_REVIEW_AUDIENCE` environment variable on the `ml-pipeline` deployment
              audience: pipelines.kubeflow.org      
  volumeMounts:
    - mountPath: /var/run/secrets/kubeflow/pipelines
      name: volume-kf-pipeline-token
      readOnly: true
```

{{% alert title="Tip" color="info" %}}
* `PodDefaults` are namespaced resources, so you need to create one inside __each__ of your Kubeflow `Profile` namespaces.
* The Notebook Spawner UI will be aware of any `PodDefaults` in the user's namespace (they are selectable under the "configurations" section).
{{% /alert %}}

### RBAC Authorization

The Kubeflow Pipelines API respects Kubernetes RBAC, and will check RoleBindings assigned to the ServiceAccount before allowing it to take Pipelines API actions.

For example, this RoleBinding allows Pods with the `default-editor` ServiceAccount in `namespace-2` to manage Kubeflow Pipelines in `namespace-1`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-namespace-2-kubeflow-edit
  ## this RoleBinding is in `namespace-1`, because it grants access to `namespace-1`
  namespace: namespace-1
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-edit
subjects:
  - kind: ServiceAccount
    name: default-editor
    ## the ServiceAccount lives in `namespace-2`
    namespace: namespace-2
```

{{% alert title="Tip" color="info" %}}
* Review the ClusterRole called [`aggregate-to-kubeflow-pipelines-edit`](https://github.com/kubeflow/pipelines/blob/efb96135033fc6e6e55078d33814c45a98566e68/manifests/kustomize/base/installs/multi-user/view-edit-cluster-roles.yaml#L36-L99) 
for a list of some important `pipelines.kubeflow.org` RBAC verbs.
* Kubeflow Notebooks pods run as the `default-editor` ServiceAccount by default, so the RoleBindings for `default-editor` apply to them
and give them access to submit pipelines in their own namespace.
{{% /alert %}}

</details>

## Full Kubeflow <sub>(from outside cluster)</sub>

<details>
<summary>Click to expand</summary>
<hr>

The process to authenticate the Pipelines SDK from outside the cluster in multi-user mode will vary by distribution:

* [Kubeflow on Google Cloud](/docs/distributions/gke/pipelines/authentication-sdk/#connecting-to-kubeflow-pipelines-in-a-full-kubeflow-deployment)
* [Kubeflow on AWS](/docs/distributions/aws/pipeline/#authenticate-kubeflow-pipeline-using-sdk-outside-cluster)
* [Kubeflow on Azure](https://awslabs.github.io/kubeflow-manifests/docs/component-guides/pipelines/)
* [Kubeflow on IBM Cloud](/docs/distributions/ibm/pipelines/#2-authenticating-multi-user-kubeflow-pipelines-with-the-sdk)

### Example for Dex

For the deployments that use [Dex](https://dexidp.io/) as their identity provider, this example demonstrates how to authenticate the Pipelines SDK from outside the cluster.

__Step 1:__ expose your `istio-ingressgateway` service locally (if your Kubeflow Istio gateway is not already exposed on a domain)

```bash
# `svc/istio-ingressgateway` may be called something else, or use different ports
kubectl port-forward --namespace istio-system svc/istio-ingressgateway 8080:80
```

__Step 2:__ this Python code defines a `get_istio_auth_session()` function that returns a session cookie by authenticating with dex

```python
import re
import requests
from urllib.parse import urlsplit

def get_istio_auth_session(url: str, username: str, password: str) -> dict:
    """
    Determine if the specified URL is secured by Dex and try to obtain a session cookie.
    WARNING: only Dex `staticPasswords` and `LDAP` authentication are currently supported
             (we default default to using `staticPasswords` if both are enabled)

    :param url: Kubeflow server URL, including protocol
    :param username: Dex `staticPasswords` or `LDAP` username
    :param password: Dex `staticPasswords` or `LDAP` password
    :return: auth session information
    """
    # define the default return object
    auth_session = {
        "endpoint_url": url,    # KF endpoint URL
        "redirect_url": None,   # KF redirect URL, if applicable
        "dex_login_url": None,  # Dex login URL (for POST of credentials)
        "is_secured": None,     # True if KF endpoint is secured
        "session_cookie": None  # Resulting session cookies in the form "key1=value1; key2=value2"
    }

    # use a persistent session (for cookies)
    with requests.Session() as s:

        ################
        # Determine if Endpoint is Secured
        ################
        resp = s.get(url, allow_redirects=True)
        if resp.status_code != 200:
            raise RuntimeError(
                f"HTTP status code '{resp.status_code}' for GET against: {url}"
            )

        auth_session["redirect_url"] = resp.url

        # if we were NOT redirected, then the endpoint is UNSECURED
        if len(resp.history) == 0:
            auth_session["is_secured"] = False
            return auth_session
        else:
            auth_session["is_secured"] = True

        ################
        # Get Dex Login URL
        ################
        redirect_url_obj = urlsplit(auth_session["redirect_url"])

        # if we are at `/auth?=xxxx` path, we need to select an auth type
        if re.search(r"/auth$", redirect_url_obj.path): 
            
            #######
            # TIP: choose the default auth type by including ONE of the following
            #######
            
            # OPTION 1: set "staticPasswords" as default auth type
            redirect_url_obj = redirect_url_obj._replace(
                path=re.sub(r"/auth$", "/auth/local", redirect_url_obj.path)
            )
            # OPTION 2: set "ldap" as default auth type 
            # redirect_url_obj = redirect_url_obj._replace(
            #     path=re.sub(r"/auth$", "/auth/ldap", redirect_url_obj.path)
            # )
            
        # if we are at `/auth/xxxx/login` path, then no further action is needed (we can use it for login POST)
        if re.search(r"/auth/.*/login$", redirect_url_obj.path):
            auth_session["dex_login_url"] = redirect_url_obj.geturl()

        # else, we need to be redirected to the actual login page
        else:
            # this GET should redirect us to the `/auth/xxxx/login` path
            resp = s.get(redirect_url_obj.geturl(), allow_redirects=True)
            if resp.status_code != 200:
                raise RuntimeError(
                    f"HTTP status code '{resp.status_code}' for GET against: {redirect_url_obj.geturl()}"
                )

            # set the login url
            auth_session["dex_login_url"] = resp.url

        ################
        # Attempt Dex Login
        ################
        resp = s.post(
            auth_session["dex_login_url"],
            data={"login": username, "password": password},
            allow_redirects=True
        )
        if len(resp.history) == 0:
            raise RuntimeError(
                f"Login credentials were probably invalid - "
                f"No redirect after POST to: {auth_session['dex_login_url']}"
            )

        # store the session cookies in a "key1=value1; key2=value2" string
        auth_session["session_cookie"] = "; ".join([f"{c.name}={c.value}" for c in s.cookies])

    return auth_session
```

__Step 3:__ this Python code uses the above `get_istio_auth_session()` function to create a `kfp.Client()`

```python
import kfp

KUBEFLOW_ENDPOINT = "http://localhost:8080"
KUBEFLOW_USERNAME = "user@example.com"
KUBEFLOW_PASSWORD = "12341234"

auth_session = get_istio_auth_session(
    url=KUBEFLOW_ENDPOINT,
    username=KUBEFLOW_USERNAME,
    password=KUBEFLOW_PASSWORD
)

client = kfp.Client(host=f"{KUBEFLOW_ENDPOINT}/pipeline", cookies=auth_session["session_cookie"])
print(client.list_experiments())
```

</details>

## Standalone Kubeflow Pipelines <sub>(from inside cluster)</sub>

<details>
<summary>Click to expand</summary>
<hr>

{{% alert title="Warning" color="warning" %}}
This information only applies to _Standalone Kubeflow Pipelines_.
{{% /alert %}}

When running inside the Kubernetes cluster, you may connect Pipelines SDK directly to the `ml-pipeline-ui` service via [cluster-internal service DNS resolution](https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services).

{{% alert title="Tip" color="info" %}}
In [standalone deployments](/docs/components/pipelines/legacy-v1/installation/standalone-deployment/) of Kubeflow Pipelines, there is no authentication enforced on the `ml-pipeline-ui` service.
{{% /alert %}}

For example, when running in the __same namespace__ as Kubeflow:

```python
import kfp

client = kfp.Client(host="http://ml-pipeline-ui:80")

print(client.list_experiments())
```

For example, when running in a __different namespace__ to Kubeflow:

```python
import kfp

# the namespace in which you deployed Kubeflow Pipelines
namespace = "kubeflow" 

client = kfp.Client(host=f"http://ml-pipeline-ui.{namespace}")

print(client.list_experiments())
```

</details>

## Standalone Kubeflow Pipelines <sub>(from outside cluster)</sub>

<details>
<summary>Click to expand</summary>
<hr>

{{% alert title="Warning" color="warning" %}}
This information only applies to _Standalone Kubeflow Pipelines_.
{{% /alert %}}

When running outside the Kubernetes cluster, you may connect Pipelines SDK to the `ml-pipeline-ui` service by using [kubectl port-forwarding](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

{{% alert title="Tip" color="info" %}}
In [standalone deployments](/docs/components/pipelines/legacy-v1/installation/standalone-deployment/) of Kubeflow Pipelines, there is no authentication enforced on the `ml-pipeline-ui` service.
{{% /alert %}}

__Step 1:__ run the following command on your external system to initiate port-forwarding:

```bash
# change `--namespace` if you deployed Kubeflow Pipelines into a different namespace
kubectl port-forward --namespace kubeflow svc/ml-pipeline-ui 3000:80
```

__Step 2:__ the following code will create a `kfp.Client()` against your port-forwarded `ml-pipeline-ui` service:

```python
import kfp

client = kfp.Client(host="http://localhost:3000")

print(client.list_experiments())
```

</details>


## Next Steps

* [Using the Kubeflow Pipelines SDK](/docs/components/pipelines/tutorials/sdk-examples/)
* [Kubeflow Pipelines SDK Reference](https://kubeflow-pipelines.readthedocs.io/en/stable/)
* [Experiment with the Kubeflow Pipelines API](/docs/components/pipelines/tutorials/api-pipelines/)
