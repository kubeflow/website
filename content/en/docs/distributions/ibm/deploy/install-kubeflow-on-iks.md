+++
title = "Install Kubeflow on IKS"
description = "Instructions for deploying Kubeflow on IBM Cloud Kubernetes Service"
weight = 6
+++

This guide describes how to use the kfctl binary to deploy Kubeflow on IBM Cloud Kubernetes Service (IKS).

## Prerequisites

* Authenticate with IBM Cloud

  Log into IBM Cloud using the [IBM Cloud Command Line Interface (CLI)](https://www.ibm.com/cloud/cli) as follows:

  ```shell
  ibmcloud login
  ```

  Or, if you have federated credentials, run the following command:
  
  ```shell
  ibmcloud login --sso  
  ```

* Create and access a Kubernetes cluster on IKS

  To deploy Kubeflow on IBM Cloud, you need a cluster running on IKS. If you don't have a cluster running, follow the [Create an IBM Cloud cluster](/docs/ibm/create-cluster) guide.

  Run the following command to switch the Kubernetes context and access the cluster:
  
  ```shell
  ibmcloud ks cluster config --cluster <cluster_name>
  ```

  Replace `<cluster_name>` with your cluster name.

### Storage setup for a **Classic** IBM Cloud Kubernetes cluster

**Note**: This section is only required when the worker nodes provider `WORKER_NODE_PROVIDER` is set to `classic`. For other infrastructures, IBM Cloud Storage with Group ID support is already set up as the cluster's default storage class.

When you use the `classic` worker node provider of an IBM Cloud Kubernetes cluster, it uses the regular [IBM Cloud File Storage](https://www.ibm.com/cloud/file-storage) based on NFS as the default storage class. File Storage is designed to run RWX (read-write multiple nodes) workloads with proper security built around it. Therefore, File Storage [does not allow `fsGroup` securityContext](https://cloud.ibm.com/docs/containers?topic=containers-security#container) unless it's configured with Group ID, which is needed for the [OIDC authentication service](https://github.com/arrikto/oidc-authservice) and Kubeflow Jupyter server.

Therefore, you're recommended to set up the default storage class with Group ID support so that you can get the best experience from Kubeflow.

1. Set the File Storage with Group ID support as the default storage class.

    ```shell
    NEW_STORAGE_CLASS=ibmc-file-gold-gid
    OLD_STORAGE_CLASS=$(kubectl get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io\/is-default-class=="true")].metadata.name}')
    kubectl patch storageclass ${NEW_STORAGE_CLASS} -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

    # List all the (default) storage classes
    kubectl get storageclass | grep "(default)"
    ```

    Example output:
    ```
    ibmc-file-gold-gid (default)   ibm.io/ibmc-file    Delete          Immediate           false                  14h
    ```

2. Make sure `ibmc-file-gold-gid` is the only `(default)` storage class. If there are two or more rows in the above output, unset the previous `(default)` storage classes with the command below:
    ```shell
    kubectl patch storageclass ${OLD_STORAGE_CLASS} -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
    ```

### Storage setup for **vpc-gen2** IBM Cloud Kubernetes cluster

**Note**: To deploy Kubeflow, you don't need to change the storage setup for `vpc-gen2` Kubernetes cluster.

Currently, there is no option available for setting up RWX (read-write multiple nodes) type of storages.
RWX is not a mandatory requirement to run Kubeflow and most pipelines.
It is required by certain sample jobs/pipelines where multiple pods write results to a common storage.
A job or a pipeline can also write to a common object storage like `minio`, so the absence of this feature is 
not a blocker for working with Kubeflow.
Examples of jobs/pipelines that will not work, are: 
[Distributed training with tf-operator](https://github.com/kubeflow/tf-operator/tree/master/examples/v1/mnist_with_summaries)

If you are on `vpc-gen2` and still need RWX, you may try [portworx enterprise product](https://portworx.com/products/features/).
To set it up on IBM Cloud use the [portworx install with IBM Cloud](https://docs.portworx.com/portworx-install-with-kubernetes/cloud/ibm/) guide. 


## Installation 

Choose either **single user** or **multi-tenant** section based on your usage.

If you're experiencing issues during the installation because of conflicts on your Kubeflow deployment, you can [uninstall Kubeflow](/docs/ibm/deploy/uninstall-kubeflow) and install it again.

### Single user

Run the following commands to set up and deploy Kubeflow for a single user without any authentication.

**Note**: By default, Kubeflow deployment on IBM Cloud uses the [Kubeflow pipeline with the Tekton backend](https://github.com/kubeflow/kfp-tekton#kubeflow-pipelines-with-tekton).
If you want to use the Kubeflow pipeline with the Argo backend, modify and uncomment the `argo` and `kfp-argo` applications
inside the `kfctl_ibm.yaml` below and remove the `kfp-tekton` applications. 

```shell
# Set KF_NAME to the name of your Kubeflow deployment. This also becomes the
# name of the directory containing your configuration.
# For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
export KF_NAME=<your choice of name for the Kubeflow deployment>

# Set the path to the base directory where you want to store one or more 
# Kubeflow deployments. For example, /opt/.
# Then set the Kubeflow application directory for this deployment.
export BASE_DIR=<path to a base directory>
export KF_DIR=${BASE_DIR}/${KF_NAME}

# Set the configuration file to use, such as:
export CONFIG_FILE=kfctl_ibm.yaml
export CONFIG_URI="https://github.com/IBM/manifests/blob/v1.3/distributions/kfdef/kfctl_ibm.v1.3.0.yaml"

# Generate Kubeflow:
mkdir -p ${KF_DIR}
cd ${KF_DIR}
curl -L ${CONFIG_URI} > ${CONFIG_FILE}

# Deploy Kubeflow. You can customize the CONFIG_FILE if needed.
kfctl apply -V -f ${CONFIG_FILE}
```

* **${KF_NAME}** - The name of your Kubeflow deployment.
  If you want a custom deployment name, specify that name here.
  For example,  `my-kubeflow` or `kf-test`.
  The value of KF_NAME must consist of lower case alphanumeric characters or
  '-', and must start and end with an alphanumeric character.
  The value of this variable cannot be greater than 25 characters. It must
  contain just a name, not a directory path.
  This value also becomes the name of the directory where your Kubeflow 
  configurations are stored, that is, the Kubeflow application directory. 

* **${KF_DIR}** - The full path to your Kubeflow application directory.

The Kubeflow endpoint is exposed with [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport) 30380. If you don't have any experience on Kubernetes, you can [expose the Kubeflow endpoint as a LoadBalancer](#expose-the-kubeflow-endpoint-as-loadbalancer) and access the **EXTERNAL_IP**.

For single user Kubeflow we use Dex authentication by default. Access the cluster with the following

```
username=user@example.com
password=12341234
```

### Multi-user, auth-enabled

Run the following steps to deploy Kubeflow with [IBM Cloud AppID](https://cloud.ibm.com/catalog/services/app-id)
as an authentication provider. 

The scenario is a Kubeflow cluster admin configures Kubeflow as a web
application in AppID and manages user authentication with builtin identity
providers (Cloud Directory, SAML, social log-in with Google or Facebook etc.) or
custom providers.

1. Set up environment variables:

    ```shell
    export KF_NAME=<your choice of name for the Kubeflow deployment>

    # Set the path to the base directory where you want to store one or more 
    # Kubeflow deployments. For example, use `/opt/`.
    export BASE_DIR=<path to a base directory>

    # Then set the Kubeflow application directory for this deployment.
    export KF_DIR=${BASE_DIR}/${KF_NAME}
    ```

2. Set up configuration files:

    ```shell
    export CONFIG_FILE=kfctl_ibm_multi_user.yaml
    export CONFIG_URI="https://raw.githubusercontent.com/IBM/manifests/v1.3/distributions/kfdef/kfctl_ibm_multi_user.v1.3.0.yaml"
    # Generate and deploy Kubeflow:
    mkdir -p ${KF_DIR}
    cd ${KF_DIR}
    curl -L ${CONFIG_URI} > ${CONFIG_FILE}
    ```
    
**Note**: By default, the IBM configuration is using the [Kubeflow pipeline with the Tekton backend](https://github.com/kubeflow/kfp-tekton#kubeflow-pipelines-with-tekton).
    If you want to use the Kubeflow pipeline with the Argo backend, modify and uncomment the `kfp-argo` applications inside the `kfctl_ibm_multi_user.yaml` and remove the `kfp-tekton` applications. 
    
1. Deploy Kubeflow:

    ```shell
    kfctl apply -V -f ${CONFIG_FILE}
    ```

2. Wait until the deployment finishes successfully — for example, all pods should be in the `Running` state when you run the command:

    ```shell
    kubectl get pod -n kubeflow
    ```

3. Follow the [Creating an App ID service instance on IBM Cloud](https://cloud.ibm.com/catalog/services/app-id) guide for Kubeflow authentication. 
You can also learn [how to use App ID](https://cloud.ibm.com/docs/appid?topic=appid-getting-started) with different authentication methods.

4. Follow the [Registering your app](https://cloud.ibm.com/docs/appid?topic=appid-app#app-register) section of the App ID guide
to create an application with type _regularwebapp_ under the provisioned AppID
instance. Make sure the _scope_ contains _email_. Then retrieve the following
configuration parameters from your AppID:
    * `clientId`
    * `secret`
    * `oAuthServerUrl`
    
5. Register the Kubeflow OIDC redirect page. The Kubeflow OIDC redirect URL is `http://<kubeflow-FQDN>/login/oidc`. 
`<kubeflow-FQDN>` is the endpoint for accessing Kubeflow. By default, the `<kubeflow-FQDN>` on IBM Cloud is `<worker_node_external_ip>:30380`. If you don't have any experience on Kubernetes, you can [expose the Kubeflow endpoint as a LoadBalancer](#expose-the-kubeflow-endpoint-as-loadbalancer) and use the **EXTERNAL_IP** for your `<kubeflow-FQDN>`.

  Then, you need to place the Kubeflow OIDC redirect URL under **Manage Authentication** > **Authentication settings** > **Add web redirect URLs**.
  
<img src="/docs/images/ibm/appid-redirect-settings.png" 
  alt="APP ID Redirect Settings"
  class="mt-3 mb-3 border border-info rounded">


1. We create a configmap `oidc-authservice-parameters` and a secret `oidc-authservice-client` in the `istio-system` namespace that holds the info needed by the `authservice`

We will be updating these to match our `appid` service created in the last step. 

These are the values we will need

 * `<oAuthServerUrl>` - fill in the value of oAuthServerUrl
 * `<clientId>` - fill in the value of clientId
 * `<secret>` - fill in the value of secret
 * `<kubeflow-FQDN>` - fill in the FQDN of Kubeflow, if you don't know yet, just give a dummy one like `localhost`. Then change it after you got one.

Patch ConfigMap

```bash
export OIDC_PROVIDER=<oAuthServerUrl>
export OIDC_AUTH_URL=<oAuthServerUrl>/authorization
export REDIRECT_URL=http://<kubeflow-fqdn>/login/oidc

export PATCH=$(printf '{"data": {"OIDC_AUTH_URL": "%s", "OIDC_PROVIDER": "%s", "REDIRECT_URL": "%s"}}' $OIDC_AUTH_URL $OIDC_PROVIDER $REDIRECT_URL)

kubectl patch cm -n istio-system oidc-authservice-parameters -p=$PATCH
```

Patch Secret

```bash
export CLIENT_ID=<clientId>
export CLIENT_SECRET=<secret>

export PATCH=$(printf '{"stringData": {"CLIENT_ID": "%s", "CLIENT_SECRET": "%s"}}' $CLIENT_ID $CLIENT_SECRET)

kubectl patch secret -n istio-system oidc-authservice-client -p=$PATCH
```
 
 **Note**: If any of the parameters are changed after the initial Kubeflow deployment, you 
 will need to manually update these parameters in the configmap `oidc-authservice-parameters` and/or secret `oidc-authservice-client`.
 Then, restart authservice by deleting the existing pod `kubectl delete po -n istio-system authservice-0 `.

### Verify mutli-user installation

Check the pod `authservice-0` is in running state in namespace `istio-system`:

```SHELL
kubectl get pod authservice-0 -n istio-system
```

### Extra network setup requirement for **vpc-gen2** clusters only

**Note**: These steps are not required for `classic` clusters, i.e. where `WORKER_NODE_PROVIDER` is set to `classic`.

A `vpc-gen2` cluster does not assign a public IP address to the Kubernetes master node by default.
It provides access via a Load Balancer, which is configured to allow only a set of ports over public internet.
Access the cluster's resources in a `vpc-gen2` cluster, using one of the following options,

* Load Balancer method: To configure via a Load Balancer, go to [Expose the Kubeflow endpoint as a LoadBalancer](#expose-the-kubeflow-endpoint-as-loadbalancer).
    This method is recommended when you have Kubeflow deployed with [Multi-user, auth-enabled](#multi-user-auth-enabled) support — otherwise it will expose
  cluster resources to the public.

* Socks proxy method: If you need access to nodes or NodePort in the `vpc-gen2` cluster, this can be achieved by starting another instance in the 
same `vpc-gen2` cluster and assigning it a public IP (i.e. the floating IP). Next, use SSH to log into the instance or create an SSH socks proxy,
  such as `ssh -D9999 root@new-instance-public-ip`.

Then, configure the socks proxy at `localhost:9999` and access cluster services.

* `kubectl port-forward` method: To access Kubeflow dashboard, run `kubectl -n istio-system port-forward service/istio-ingressgateway 7080:http2`.
    Then in a browser, go to[http://127.0.0.1:7080/](http://127.0.0.1:7080/)

_**Important notice**: Exposing cluster/compute resources publicly without setting up a proper user authentication mechanism
is very insecure and can have very serious consequences(even legal). If there is no need to expose cluster services publicly,
Socks proxy method or `kubectl port-forward` method are recommended._

## Next steps: secure the Kubeflow dashboard with HTTPS

### Prerequisites

For both `classic` and `vpc-gen2` cluster providers, make sure you have [Multi-user, auth-enabled](#multi-user-auth-enabled) Kubeflow set up.

### Setup

Follow the steps in [Exposing the Kubeflow dashboard with DNS and TLS termination](../authentication/#exposing-the-kubeflow-dashboard-with-dns-and-tls-termination).
Then, you will have the required DNS name as Kubeflow FQDN to enable the OIDC flow for AppID:


1. Follow the step [Adding redirect URIs](https://cloud.ibm.com/docs/appid?topic=appid-managing-idp#add-redirect-uri)
to fill a URL for AppID to redirect to Kubeflow. The URL should look like `https://<kubeflow-FQDN>/login/oidc`.

2. Update the secret `appid-application-configuration` with the updated Kubeflow FQDN to replace `<kubeflow-FQDN>` in below command:

```SHELL
export REDIRECT_URL=https://<kubeflow-FQDN>/login/oidc
export PATCH=$(printf '{"data": {"REDIRECT_URL": "%s"}}' $REDIRECT_URL)

kubectl patch configmap appid-application-configuration -n istio-system -p=$PATCH
```

3. Restart the pod `authservice-0`:

```shell
kubectl rollout restart statefulset authservice -n istio-system
```

Then, visit `https://<kubeflow-FQDN>/`. The page should redirect you to AppID for authentication.

## Additional information

You can find general information about Kubeflow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/methods/kfctl/kustomize/).

## Troubleshooting

### Expose the Kubeflow endpoint as a LoadBalancer

By default, the Kubeflow deployment on IBM Cloud only exposes the endpoint as [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport) 31380. If you want to expose the endpoint as a [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer), run:

```shell
kubectl patch svc istio-ingressgateway -n istio-system -p '{"spec": {"type": "LoadBalancer"}}'
```

Then, you can locate the LoadBalancer in the **EXTERNAL_IP** column when you run the following command:

```shell
kubectl get svc istio-ingressgateway -n istio-system
```

There is a small delay, usually ~5 mins, for above commands to take effect.
