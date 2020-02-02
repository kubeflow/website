+++
title = "Install Kubeflow"
description = "Instructions for deploying Kubeflow with the shell"
weight = 4
+++

This guide describes how to use the kfctl binary to
deploy Kubeflow on IBM Cloud.

## Prerequisites

### Installing the IBM Cloud developer tools

> If you already have `ibmcloud` installed with the `ibmcloud cs` plugin, you
> can skip these steps.

1.  Download and install the `ibmcloud` command line tool:
    https://console.bluemix.net/docs/cli/index.html#overview

1.  Install the `cs` (container-service) plugin:
    ```
    ibmcloud plugin install container-service -r Bluemix
    ```
1.  Authorize `ibmcloud`:
    ```
    ibmcloud login
    ```

### Setting environment variables

To simplify the command lines for this walkthrough, you need to define a few
environment variables.

1.  Set `CLUSTER_NAME`, `CLUSTER_REGION`, and `CLUSTER_ZONE` variables:

    ```
    export CLUSTER_NAME=knative
    export CLUSTER_REGION=us-south
    export CLUSTER_ZONE=dal13
    ```

    - `CLUSTER_NAME` must be lowercase and unique among any other Kubernetes
      clusters in this IBM Cloud region.
    - `CLUSTER_REGION` can be any region where IKS is available. You can get a
      list of all available regions via the
      [IBM Cloud documentation](https://console.bluemix.net/docs/containers/cs_regions.html#regions-and-zones)
      or via `ibmcloud cs regions`.
    - `CLUSTER_ZONE` can be any zone that is available in the specified region
      above. You can get a list of all avaible locations from the
      [IBM Cloud documentation](https://console.bluemix.net/docs/containers/cs_regions.html#zones)
      or by using `ibmcloud cs zones` after you set the region by using
      `ibmcloud cs region-set $CLUSTER_REGION`.

### Creating a IBM Cloud Kubernetes cluster

To make sure the cluster is large enough to host all the Knative and Istio
components, the recommended configuration for a cluster is:

- Kubernetes version 1.15 or later
- 4 vCPU nodes with 16GB memory (`b2c.4x16`)

1.  Set `ibmcloud` to the appropriate region:

    ```
    ibmcloud cs region-set $CLUSTER_REGION
    ```

1.  Create a Kubernetes cluster on IKS with the required specifications:

    ```
    ibmcloud cs cluster-create --name=$CLUSTER_NAME \
      --zone=$CLUSTER_ZONE \
      --machine-type=b2c.4x16 \
      --workers=3
    ```

    If you're starting in a fresh account with no public and private VLANs, they
    are created automatically for you. If you already have VLANs configured in
    your account, get them via `ibmcloud cs vlans --zone $CLUSTER_ZONE` and
    include the public/private VLAN in the `cluster-create` command:

    ```
    ibmcloud cs cluster-create --name=$CLUSTER_NAME \
      --zone=$CLUSTER_ZONE \
      --machine-type=b2c.4x16 \
      --workers=3 \
      --private-vlan $PRIVATE_VLAN_ID \
      --public-vlan $PUBLIC_VLAN_ID
    ```

1.  Wait until your Kubernetes cluster is deployed:

    ```
    ibmcloud cs clusters | grep $CLUSTER_NAME
    ```

    It can take a while for your cluster to be deployed. Repeat the above
    command until the state of your cluster is "normal".


1.  Point `kubectl` to the cluster:

    ```
    ibmcloud cs cluster-config $CLUSTER_NAME
    ```

    Follow the instructions on the screen to `EXPORT` the correct `KUBECONFIG`
    value to point to the created cluster.


1.  Make sure all nodes are up:

    ```
    kubectl get nodes
    ```

    Make sure all the nodes are in `Ready` state. You are now ready to install
    Istio into your cluster.

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
    you used when deploying Kubeflow. For example, {{% config-uri-k8s-istio %}}.
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
  page](https://github.com/kubeflow/kubeflow/releases/tag/{{% kf-latest-version %}}).

1. Unpack the tar ball
      ```
      tar -xvf kfctl_{{% kf-latest-version %}}_<platform>.tar.gz
      ```

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary kfctl to your path. If you don’t add the binary to your path, you must use the full path to the kfctl binary each time you run it.

    ```
    # The following command is optional, to make kfctl binary easier to use.
    export PATH=$PATH:<path to where kfctl was unpacked>

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
    export CONFIG_URI="https://raw.githubusercontent.com/kubeflow/manifests/master/kfdef/kfctl_ibm.yaml"

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

1. Check the resources deployed correctly in namespace `kubeflow`

     ```
     kubectl get all -n kubeflow
     ```

1. Open Kubeflow Dashboard. The default installation does not create an external endpoint but you can use port-forwarding to visit your cluster. Run the following command and visit http://localhost:8080.

     ```
     kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
     ```

In case you want to expose the Kubeflow Dashboard over an external IP, you can change the type of the ingress gateway. To do that, you can edit the service:

     ```
     kubectl edit -n istio-system svc/istio-ingressgateway
     ```

From that file, replace `type: NodePort` with `type: LoadBalancer` and save.

While the change is being applied, you can watch the service until below command prints a value under the `EXTERNAL-IP` column:

     ```
     kubectl get -w -n istio-system svc/istio-ingressgateway
     ```

The external IP should be accessible by visiting http://<EXTERNAL-IP>. Note that above installation instructions do not create any protection for the external endpoint so it will be accessible to anyone without any authentication. 

## Additional information

You can find general information about Kubeflow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/other-guides/kustomize/).
