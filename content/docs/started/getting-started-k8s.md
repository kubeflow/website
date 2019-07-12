+++
title = "Kubeflow on Kubernetes"
description = "Instructions for installing Kubeflow on your existing Kubernetes cluster"
weight = 4
+++

Follow these instructions if you want to install Kubeflow on an existing Kubernetes cluster.

If you are using a Kubernetes distribution or Cloud Provider which has specific instructions for installing Kubeflow we recommend following those instructions. Those instructions do additional Cloud specific setup to create a really great Kubeflow experience.

For installing Kubeflow on an existing Kubernetes Cluster, you can use one of the following options:

* [Kubeflow for Existing Clusters by Arrikto](#Kubeflow-for-Existing-Clusters---by-Arrikto)

## Kubeflow for Existing Clusters - by Arrikto

This installation of Kubeflow is maintained by [Arrikto](https://www.arrikto.com/), is geared towards existing Kubernetes clusters and does not depend on any cloud-specific feature.

In this reference architecture, we use [Dex](https://github.com/dexidp/dex) and [Istio](https://istio.io/) for vendor-neutral authentication.

![platform existing architecture](https://i.imgur.com/OlaN73j.png)

### Prerequisites
- Kubernetes Cluster with LoadBalancer support.

If you don't have a Kubernetes Cluster, you can create a compliant Kubernetes Engine (GKE) on Google Cloud Platform cluster with the following script:

<details>

<summary>GKE Cluster Creation Script</summary>

```bash
#!/bin/bash

set -e

# This script uses the gcloud command.
# For more info, visit: https://cloud.google.com/sdk/gcloud/reference/container/

# Edit according to your preference
GCP_USER="$(gcloud config list account --format "value(core.account)")"
GCP_PROJECT="$(gcloud config list project --format "value(core.project)")"
GCP_ZONE="us-west1-b"

CLUSTER_VERSION="$(gcloud container get-server-config --format="value(validMasterVersions[0])")" 
CLUSTER_NAME="kubeflow"

############################
# Create and setup cluster #
############################

gcloud container clusters create ${CLUSTER_NAME} \
--project ${GCP_PROJECT} \
--zone ${GCP_ZONE} \
--cluster-version ${CLUSTER_VERSION} \
--machine-type "n1-standard-8" --num-nodes "1" \
--image-type "UBUNTU" \
--disk-type "pd-ssd" --disk-size "50" \
--no-enable-cloud-logging --no-enable-cloud-monitoring \
--no-enable-ip-alias \
--enable-autoupgrade --enable-autorepair

echo "Getting credentials for newly created cluster..."
gcloud container clusters get-credentials ${CLUSTER_NAME} --zone=${GCP_ZONE}

echo "Setting up GKE RBAC..."
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=${GCP_USER}
```

</details>

### Deploy Kubeflow

In case you are deploying Kubeflow on multi-node cluster, you can follow this [guide](/docs/use-cases/kubeflow-on-multinode-cluster) to set up your system to use remote NFS filesystem in cluster nodes.

Follow these steps to deploy Kubeflow:

1. Download a `kfctl` release from the [Kubeflow releases page](https://github.com/kubeflow/kubeflow/releases/) and unpack it:

    ```
    tar -xvf kfctl_<release tag>_<platform>.tar.gz
    ```

    Alternatively, you can build the `kfctl` binary yourself:

    ```
    git clone https://github.com/kubeflow/kubeflow.git
    cd kubeflow/bootstrap
    make build-kfctl-container
    ```    

1. Run the following commands to set up and deploy Kubeflow. The code below includes an optional command to add the binary `kfctl` to your path. If you don't add the binary to your path, you must use the full path to the `kfctl` binary each time you run it.

```bash
# Add kfctl to PATH, to make the kfctl binary easier to use.
export PATH=$PATH:"<path to kfctl>"
export KFAPP="<your choice of application directory name>"
export CONFIG="https://raw.githubusercontent.com/kubeflow/kubeflow/master/bootstrap/config/kfctl_existing_arrikto.0.6.yaml"

# Specify credentials for the default user.
export KUBEFLOW_USER_EMAIL="admin@kubeflow.org"
export KUBEFLOW_PASSWORD="12341234"

kfctl init ${KFAPP} --config=${CONFIG} -V
cd ${KFAPP}
kfctl generate all -V
kfctl apply all -V
```

 * **${KFAPP}** - the _name_ of a directory where you want Kubeflow 
  configurations to be stored. This directory is created when you run
  `kfctl init`. If you want a custom deployment name, specify that name here.
  The value of this variable becomes the name of your deployment.
  The value of this variable cannot be greater than 25 characters. It must
  contain just the directory name, not the full path to the directory.
  The content of this directory is described in the next section.


### Accessing Kubeflow

##### Log in as a static user

After deploying Kubeflow, the Kubeflow Dashboard is available at the Istio Gateway IP.
To get the Istio Gateway IP, run:

```bash
kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Get the IP and open it in a browser: `https://<ip>/`.

Enter the credentials you specified in `KUBEFLOW_USER_EMAIL`, `KUBEFLOW_PASSWORD` and access the Kubeflow Dashboard!

#### Add static users for basic auth

To add users to basic auth, you just have to edit the Dex ConfigMap under the key `staticPasswords`.
```bash
# Download the dex config
kubectl get cm dex -n kubeflow -o jsonpath='{.data.config\.yaml}' > dex-config.yaml

# Edit the dex config with extra users.
# The password must be hashed with bcrypt with an at least 10 difficulty level.
# You can use an online tool like: https://passwordhashing.com/BCrypt

# After editing the config, update the ConfigMap
kubectl create cm dex --from-file=config.yaml=dex-config.yaml --dry-run -oyaml | kubectl apply -f -
```

### Delete Kubeflow

Run the following commands to delete your deployment and reclaim all resources:

```
cd ${KFAPP}
# If you want to delete all the resources, run:
kfctl delete all
```

### Understanding the deployment process

The deployment process is controlled by 4 different commands:

* **init** - one time set up.
* **generate** - creates config files defining the various resources.
* **apply** - creates or updates the resources.
* **delete** - deletes the resources.

With the exception of `init`, all commands take an argument which describes the
set of resources to apply the command to; this argument can be one of the
following:

* **k8s** - all resources that run on Kubernetes.
* **all** - platform and Kubernetes resources.

#### App layout

Your Kubeflow app directory contains the following files and directories:

* **${KFAPP}/app.yaml** defines configurations related to your Kubeflow deployment.
* **${KFAPP}/kustomize**: contains the YAML manifests that will be deployed.

### Next steps

* Follow the instructions to [connect to the Kubeflow web 
  UIs](/docs/other-guides/accessing-uis/), where you can manage various 
  aspects of your Kubeflow deployment.
* Run a [sample machine learning workflow](/docs/examples/resources/).
* Get started with [Kubeflow Pipelines](/docs/pipelines/pipelines-quickstart/)