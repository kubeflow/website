+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow on IBM Cloud"
weight = 5
+++

This guide describes how to use the kfctl binary to deploy Kubeflow on IBM Cloud Kubernetes Service (IKS).

## Prerequisites

* Authenticate with IBM Cloud

  Log into IBM Cloud using the [IBM Cloud Command Line Interface (CLI)](https://www.ibm.com/cloud/cli) as follows:

  ```shell
  ibmcloud login
  ```

* Create and access a Kubernetes cluster on IKS

  To deploy Kubeflow on IBM Cloud, you need a cluster running on IKS. If you don't have a cluster running, follow the [Create an IBM Cloud cluster](/docs/ibm/create-cluster) guide.

  Run the following command to switch the Kubernetes context and access the cluster:
  
  ```shell
  ibmcloud ks cluster config --cluster <cluster_name>
  ```

  Replace `<cluster_name>` with your cluster name.

## IBM Cloud Block Storage Setup

**Note**: This section is only required when the worker nodes provider `WORKER_NODE_PROVIDER` is set to `classic`. For other infrastructures, IBM Cloud Block Storage is already set up as the cluster's default storage class.

When using the `classic` worker nodes provider of IBM Cloud Kubernetes cluster, by default, it uses [IBM Cloud File Storage](https://www.ibm.com/cloud/file-storage) based on NFS as the default storage class. File Storage is designed to run RWX (read-write multiple nodes) workloads with proper security built around it. Therefore, File Storage [does not allow `fsGroup` securityContext](https://cloud.ibm.com/docs/containers?topic=containers-security#container) which is needed for DEX and Kubeflow Jupyter Server.

[IBM Cloud Block Storage](https://www.ibm.com/cloud/block-storage) provides a fast way to store data and
satisfy many of the Kubeflow persistent volume requirements such as `fsGroup` out of the box and optimized RWO (read-write single node) which is used on all Kubeflow's persistent volume claim. 

Therefore, you're recommended to set up [IBM Cloud Block Storage](https://cloud.ibm.com/docs/containers?topic=containers-block_storage#add_block) as the default storage class so that you can
get the best experience from Kubeflow.

1. [Follow the instructions](https://helm.sh/docs/intro/install/) to install the Helm version 3 client on your local machine.

2. Add the IBM Cloud Helm chart repository to the cluster where you want to use the IBM Cloud Block Storage plug-in.

    ```shell
    helm repo add iks-charts https://icr.io/helm/iks-charts
    helm repo update
    ```

3. Install the IBM Cloud Block Storage plug-in. When you install the plug-in, pre-defined block storage classes are added to your cluster.

    ```shell
    helm install 1.7.0 iks-charts/ibmcloud-block-storage-plugin -n kube-system
    ```
    
    Example output:
    ```
    NAME: 1.7.0
    LAST DEPLOYED: Fri Aug 28 11:23:56 2020
    NAMESPACE: kube-system
    STATUS: deployed
    REVISION: 1
    NOTES:
    Thank you for installing: ibmcloud-block-storage-plugin.   Your release is named: 1.7.0
    ...
    ```

4. Verify that the installation was successful.

    ```shell
    kubectl get pod -n kube-system | grep block
    ```
    
5. Verify that the storage classes for Block Storage were added to your cluster.

    ```
    kubectl get storageclasses | grep block
    ```

6. Set the Block Storage as the default storage class.

    ```shell
    NEW_STORAGE_CLASS=ibmc-block-gold
    OLD_STORAGE_CLASS=$(kubectl get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io\/is-default-class=="true")].metadata.name}')
    kubectl patch storageclass ${NEW_STORAGE_CLASS} -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

    # List all the (default) storage classes
    kubectl get storageclass | grep "(default)"
    ```

    Example output:
    ```
    ibmc-block-gold (default)   ibm.io/ibmc-block   65s
    ```

    Make sure `ibmc-block-gold` is the only `(default)` storage class. If there are two or more rows in the above output, unset the previous `(default)` storage classes with the command below:
    ```shell
    kubectl patch storageclass ${OLD_STORAGE_CLASS} -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
    ```

## Understanding the Kubeflow deployment process

The deployment process is controlled by the following commands:

* **build** - (Optional) Creates configuration files defining the various
  resources in your deployment. You only need to run `kfctl build` if you want
  to edit the resources before running `kfctl apply`.
* **apply** - Creates or updates the resources.
* **delete** - Deletes the resources.

### App layout

Your Kubeflow application directory **${KF_DIR}** contains the following files and 
directories:

* **${CONFIG_FILE}** is a YAML file that defines configurations related to your 
  Kubeflow deployment.

  * This file is a copy of the GitHub-based configuration YAML file that
    you used when deploying Kubeflow. For example, {{% config-uri-ibm %}}.
  * When you run `kfctl apply` or `kfctl build`, kfctl creates
    a local version of the configuration file, `${CONFIG_FILE}`,
    which you can further customize if necessary.

* **kustomize** is a directory that contains the kustomize packages for Kubeflow applications.
    * The directory is created when you run `kfctl build` or `kfctl apply`.
    * You can customize the Kubernetes resources (modify the manifests and run `kfctl apply` again).


## Kubeflow installation
Run the following commands to set up and deploy Kubeflow.

1. Download the kfctl {{% kf-latest-version %}} release from the
  [Kubeflow releases 
  page](https://github.com/kubeflow/kfctl/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball
      ```
      tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
      ```
1. Make kfctl binary easier to use (optional). If you don’t add the binary to your path, you must use the full path to the kfctl binary each time you run it.
      ```
      export PATH=$PATH:<path to where kfctl was unpacked>
      ```
    
Choose either **single user** or **multi-tenant** section based on your usage.

### Single user
Run the following commands to set up and deploy Kubeflow for a single user without any authentication.
```
# Set KF_NAME to the name of your Kubeflow deployment. This also becomes the
# name of the directory containing your configuration.
# For example, your deployment name can be 'my-kubeflow' or 'kf-test'.
export KF_NAME=<your choice of name for the Kubeflow deployment>

# Set the path to the base directory where you want to store one or more 
# Kubeflow deployments. For example, /opt/.
# Then set the Kubeflow application directory for this deployment.
export BASE_DIR=<path to a base directory>
export KF_DIR=${BASE_DIR}/${KF_NAME}

# Set the configuration file to use, such as the file specified below:
export CONFIG_URI="https://raw.githubusercontent.com/kubeflow/manifests/v1.1-branch/kfdef/kfctl_ibm.v1.1.0.yaml"

# Generate and deploy Kubeflow:
mkdir -p ${KF_DIR}
cd ${KF_DIR}
kfctl apply -V -f ${CONFIG_URI}
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

### Multi-user, auth-enabled

Run the following steps to deploy Kubeflow with [IBM Cloud AppID](https://cloud.ibm.com/catalog/services/app-id)
as authentication provider. 

The scenario is a Kubeflow cluster admin configures Kubeflow as an web
application in AppID and manages user authentication with builtin
identity providers (Cloud Directory, SAML, etc) or custom providers.

1. Follow the guide [Getting started with App ID](https://cloud.ibm.com/docs/appid?topic=appid-getting-started)
to create an AppID service instance.
2. Follow the step [Registering your app](https://cloud.ibm.com/docs/appid?topic=appid-app#app-register)
to create an application with type _reguarwebapp_ under the provioned AppID
instance. Make sure the _scope_ contains _email_. Then retrieve the following 
configuration parameters from your AppID:
    * `clientId`
    * `secret`
    * `oAuthServerUrl`
3. Follow the step [Adding redirect URIs](https://cloud.ibm.com/docs/appid?topic=appid-managing-idp)
to fill a URL for AppID to redirect to Kubeflow. the URL should look like `https://<kubeflow-FQDN>/login/oidc`. Notice that you could follow the guide [Securing the Kubeflow authentication with HTTPS](../authentication/) for the value of `<kubeflow-FQDN>`.
4. Create the namespace `istio-system` if not exist:
    ```
    kubectl create namespace istio-system
    ```
5. Create a secret prior to kubeflow deployment by filling parameters from the
step 2 accordingly:
    ```SHELL
    kubectl create secret generic appid-application-configuration -n istio-system \
      --from-literal=clientId=<clientId> \
      --from-literal=secret=<secret> \
      --from-literal=oAuthServerUrl=<oAuthServerUrl> \
      --from-literal=oidcRedirectUrl=https://<kubeflow-FQDN>/login/oidc
    ```
    * `<oAuthServerUrl>` - fill in the value of oAuthServerUrl
    * `<clientId>` - fill in the value of clientId
    * `<secret>` - fill in the value of secret
    * `<kubeflow-FQDN>` - fill in the FQDN of Kubeflow
    
    **Notice**: If any of the parameters changed after Kubeflow deployment, it 
    will need to manually update these parameters in the secret `appid-application-configuration`
    then restart authservice by running the command `kubectl rollout restart sts authservice -n istio-system`.
6. Setup environment variables:
    ```
    export KF_NAME=<your choice of name for the Kubeflow deployment>

    # Set the path to the base directory where you want to store one or more 
    # Kubeflow deployments. For example, /opt/.
    export BASE_DIR=<path to a base directory>

    # Then set the Kubeflow application directory for this deployment.
    export KF_DIR=${BASE_DIR}/${KF_NAME}
    ```
7. Setup configuration files:
    ```
    export CONFIG_URI="https://raw.githubusercontent.com/kubeflow/manifests/master/kfdef/kfctl_ibm_multi_user.yaml"
    # Generate and deploy Kubeflow:
    mkdir -p ${KF_DIR}
    cd ${KF_DIR}
    kfctl build -V -f ${CONFIG_URI}
    ```
8. Deploy Kubeflow:
    ```
    kfctl apply -V -f ${CONFIG_URI}
    ```
9. Wait until the deployment finishes successfully. e.g., all pods are in `Running` state when running `kubectl get pod -n kubeflow`.

## Verify installation

Check the pod `authservice-0` is in running state in namespace `istio-system`:
```SHELL
kubectl get pod authservice-0 -n istio-system
```

Please follow the steps in [Exposing the Kubeflow dashboard with DNS and TLS termination](../authentication/#exposing-the-kubeflow-dashboard-with-dns-and-tls-termination) to secure the Kubeflow dashboard with HTTPS, then you should be
redirected to AppID for authentication when visiting `https://<kubeflow-FQDN>/`.

## Additional information

You can find general information about Kubeflow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/other-guides/kustomize/).
