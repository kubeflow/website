+++
title = "Install Kubeflow on OpenShift"
description = "Instructions for deploying Kubeflow on IBM Cloud OpenShift"
weight = 7
+++

This guide describes how to use the kfctl binary to deploy Kubeflow on IBM Cloud Kubernetes Service (IKS).

## Prerequisites

* Authenticate with IBM Cloud

  Log into IBM Cloud at [IBM Cloud](https://cloud.ibm.com)

* Install OpenShift CLI

  OpenShift CLI is the way to manage and access OpenShift cluster. You can [Install OpenShift CLI](https://cloud.ibm.com/docs/openshift?topic=openshift-openshift-cli) from this instructions.

* Create and access a OpenShift cluster on IKS

  To deploy Kubeflow on IBM Cloud, you need a cluster running OpenShift on IKS. If you don't have a cluster running, follow the [Create an IBM Cloud OpenShift cluster](https://cloud.ibm.com/docs/openshift?topic=openshift-clusters) guide.

  To access the cluster follow these directions [Access OpenShift Cluster](https://cloud.ibm.com/docs/openshift?topic=openshift-access_cluster). We can easily get access from the openshift console on IBM Cloud[Connecting to the cluster from the console](https://cloud.ibm.com/docs/openshift?topic=openshift-access_cluster#access_oc_console).


## Installation 

If you're experiencing issues during the installation because of conflicts on your Kubeflow deployment, you can [uninstall Kubeflow](/docs/ibm/deploy/uninstall-kubeflow) and install it again.

### Single user

Run the following commands to set up and deploy Kubeflow for a single user without any authentication.

**Note**: By default, Kubeflow deployment on IBM Cloud uses the [Kubeflow pipeline with the Tekton backend](https://github.com/kubeflow/kfp-tekton#kubeflow-pipelines-with-tekton).
If you want to use the Kubeflow pipeline with the Argo backend, you can change `CONFIG_URI` to this kfdef instead

```
https://raw.githubusercontent.com/kubeflow/manifests/master/kfdef/kfctl_openshift.v1.2.0.yaml
```

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
export CONFIG_URI="https://raw.githubusercontent.com/kubeflow/manifests/master/kfdef/kfctl_openshift.master.kfptekton.yaml"

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

The Kubeflow deployment is exposed with a Route. To find the Route you can use 

```
oc get route -n istio-system istio-ingressgateway -o=jsonpath='{.spec.host}'
```

## Next steps

To secure the Kubeflow dashboard with HTTPS, follow the steps in [Exposing the Kubeflow dashboard with DNS and TLS termination](/docs/ibm/deploy/authentication/#setting-up-an-nlb).

## Additional information

You can find general information about Kubeflow configuration in the guide to [configuring Kubeflow with kfctl and kustomize](/docs/other-guides/kustomize/).
