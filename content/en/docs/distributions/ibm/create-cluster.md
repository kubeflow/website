+++
title = "Create or access an IBM Cloud Kubernetes cluster"
description = "Instructions for creating or connecting to a Kubernetes cluster on IBM Cloud"
weight = 3
+++

This guide describes how to create a Kubernetes cluster with IBM Cloud Kubernetes Service.

[IBM Cloud Kubernetes Service](https://www.ibm.com/cloud/container-service/) provides powerful tools and services to help deploy highly available containerized apps in Kubernetes clusters and to automate, isolate, secure, manage, and monitor your workloads across zones or regions. 

## Prerequisites

1. `IBMid`

    To get started, first go to [IBM Cloud](https://ibm.biz/Bdqgck) to create your `IBMid` if you do not have one.

2. Installing the IBM Cloud CLI

    Follow the instructions in this [Getting started with the IBM Cloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-getting-started#overview) guide to install the IBM Cloud CLI.

3. Installing the IBM Cloud Kubernetes Service plug-in with the command

    ```shell
    ibmcloud plugin install container-service
    ```

    Refer to this [link](https://cloud.ibm.com/docs/cli?topic=containers-cli-plugin-kubernetes-service-cli) for more info on IBM Cloud Kubernetes Service CLI.

4. Authenticating with IBM Cloud

    ```shell
    ibmcloud login
    ```

    Use your registered email and password for your `IBMid` to log in to IBM Cloud.

## Connecting to an existing cluster

If you have an existing cluster, use it to install Kubeflow as far as it meets the minimum system requirement. 

Get the Kubeconfig file:

```shell
ibmcloud ks cluster config --cluster $CLUSTER_NAME
```

From here on, go to [Install Kubeflow on IKS](/docs/ibm/deploy/install-kubeflow-on-iks) for more information.


## Create and setup a new cluster

* Use a `classic` provider if you want to try out Kubeflow.
* Use a `vpc-gen2` provider if you are familiar with Cloud networking and want to deploy Kubeflow on a secure environment.

A `classic` provider exposes each cluster node to the public internet and therefore has
a relatively simpler networking setup. Services exposed using Kubernetes `NodePort` need to be secured using 
authentication mechanism.

To create a cluster with `vpc-gen2` provider, follow the
[Create a cluster on IKS with a `vpc-gen2` provider](/docs/ibm/create-cluster-vpc)
guide.

The next section will explain how to create and set up a new IBM Cloud Kubernetes Service (IKS)

### Setting environment variables

Choose the region and the worker node provider for your cluster, and set the environment variables.

```shell
export KUBERNETES_VERSION=1.17
export CLUSTER_ZONE=dal13
export WORKER_NODE_PROVIDER=classic
export CLUSTER_NAME=kubeflow
```

where:

- `KUBERNETES_VERSION` specifies the Kubernetes version for the cluster. Run `ibmcloud ks versions` to see the supported
  Kubernetes versions. If this environment variable is not set, the cluster will be created with the default version set
  by IBM Cloud Kubernetes Service. Refer to
  [Minimum system requirements](https://www.kubeflow.org/docs/started/k8s/overview/#minimum-system-requirements)
  and choose a Kubernetes version compatible with the Kubeflow release to be deployed.
- `CLUSTER_ZONE` identifies the regions or location where cluster will be created. Run `ibmcloud ks locations` to
  list supported IBM Cloud Kubernetes Service locations. For example, choose `dal13` to create your cluster in the
  Dallas (US) data center.
- `WORKER_NODE_PROVIDER` specifies the kind of IBM Cloud infrastructure on which the Kubernetes worker nodes will be
  created. The `classic` type supports worker nodes with GPUs. There are other worker nodes providers including
  `vpc-classic` and `vpc-gen2` where zone names and worker flavors will be different. Run
  `ibmcloud ks zones --provider classic` to list zone names for `classic` provider and set the `CLUSTER_ZONE`
  accordingly.
- `CLUSTER_NAME` must be lowercase and unique among any other Kubernetes
  clusters in the specified `${CLUSTER_ZONE}`.

**Notice**: Refer to [Creating clusters](https://cloud.ibm.com/docs/containers?topic=containers-clusters) in the IBM
Cloud documentation for additional information on how to set up other providers and zones in your cluster.

### Choosing a worker node flavor

The worker node flavor name varies from zones and providers. Run 
`ibmcloud ks flavors --zone ${CLUSTER_ZONE} --provider ${WORKER_NODE_PROVIDER}` to list available flavors.

For example, the following are some worker node flavors supported in the `dal13` zone with a `classic` node provider.

```shell
ibmcloud ks flavors --zone dal13 --provider classic
```

Example output:

```
OK
For more information about these flavors, see 'https://ibm.biz/flavors'
Name                      Cores   Memory   Network Speed   OS             Server Type   Storage      Secondary Storage   Provider
b2c.16x64                 16      64GB     1000Mbps        UBUNTU_16_64   virtual       25GB         100GB               classic
b2c.32x128                32      128GB    1000Mbps        UBUNTU_16_64   virtual       25GB         100GB               classic
b2c.4x16                  4       16GB     1000Mbps        UBUNTU_16_64   virtual       25GB         100GB               classic
b2c.56x242                56      242GB    1000Mbps        UBUNTU_16_64   virtual       25GB         100GB               classic
b2c.8x32                  8       32GB     1000Mbps        UBUNTU_16_64   virtual       25GB         100GB               classic
b3c.16x64                 16      64GB     1000Mbps        UBUNTU_18_64   virtual       25GB         100GB               classic
b3c.32x128                32      128GB    1000Mbps        UBUNTU_18_64   virtual       25GB         100GB               classic
b3c.4x16                  4       16GB     1000Mbps        UBUNTU_18_64   virtual       25GB         100GB               classic
b3c.56x242                56      242GB    1000Mbps        UBUNTU_18_64   virtual       25GB         100GB               classic
b3c.8x32                  8       32GB     1000Mbps        UBUNTU_18_64   virtual       25GB         100GB               classic
...
```

Choose a flavor that will work for your applications. For the purpose of the Kubeflow deployment, the recommended
configuration for a cluster is at least 8 vCPU cores with 16GB memory. Hence you can either choose the `b3c.8x32` flavor
to create a one-worker-node cluster or choose the `b3c.4x16` flavor to create a two-worker-node cluster. Keep in mind
that you can always scale the cluster by adding more worker nodes should your application scales up.

Now, set the environment variable with the worker node flavor of your choice:

```shell
export WORKER_NODE_FLAVOR=b3c.4x16
```

### Creating an IBM Cloud Kubernetes cluster

Run with the following command to create a cluster:

```shell
ibmcloud ks cluster create ${WORKER_NODE_PROVIDER} \
  --name ${CLUSTER_NAME} \
  --zone=${CLUSTER_ZONE} \
  --version=${KUBERNETES_VERSION} \
  --flavor ${WORKER_NODE_FLAVOR} \
  --workers=2
```

Replace the `workers` parameter above with the desired number of worker nodes.


**Note**: If you're starting in a fresh account with no public and private VLANs, they are created automatically for you
when creating a Kubernetes cluster with worker nodes provider `classic` for the first time. If you already have VLANs
configured in your account, retrieve them via `ibmcloud ks vlans --zone ${CLUSTER_ZONE}` and include the public and 
private VLAN ids (set in the `PUBLIC_VLAN_ID` and `PRIVATE_VLAN_ID` environment variables) in the command, for example:

```shell
ibmcloud ks cluster create ${WORKER_NODE_PROVIDER} \
  --name=$CLUSTER_NAME \
  --zone=$CLUSTER_ZONE \
  --version=${KUBERNETES_VERSION} \
  --flavor ${WORKER_NODE_FLAVOR} \
  --workers=2 \
  --private-vlan ${PRIVATE_VLAN_ID} \
  --public-vlan ${PUBLIC_VLAN_ID} 
```

Wait until the cluster is deployed and configured. It can take a while for the cluster to be ready. Run with following
command to periodically check the state of your cluster. Your cluster is ready when the state is `normal`.

```shell
ibmcloud ks clusters --provider ${WORKER_NODE_PROVIDER} |grep ${CLUSTER_NAME} |awk '{print "Name:"$1"\tState:"$3}'
```

### Verifying the cluster

To use the created cluster, switch the Kubernetes context to point to the cluster with the command

```shell
ibmcloud ks cluster config --cluster ${CLUSTER_NAME}
```

Make sure all worker nodes are up with the command below

```shell
kubectl get nodes
```

and make sure all the nodes are in `Ready` state.

### Delete the cluster

Delete the cluster including it's storage:

```shell
ibmcloud ks cluster rm --force-delete-storage -c ${CLUSTER_NAME}
```
