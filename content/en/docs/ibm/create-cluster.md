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

From here on, please see [Install Kubeflow](/docs/ibm/deploy/install-kubeflow-on-iks).


## Create and setup a new cluster

Follow these steps to create and setup a new IBM Cloud Kubernetes Service(IKS) cluster:

### Choose between a `classic` or `vpc-gen2` provider.
A `vpc-gen2` cluster does not expose each node to the public internet directly and thus has more secure
and more complex network setup. A `classic` provider, does expose each cluster node to the public internet, and thus has
simpler networking setup - it might be a good option for trial run of Kubeflow.

However, in the case of `classic` provider set-up is easier, the onus to secure each service that is exposed through
Kubernetes (e.g. NodePort/Load Balancer) is on the user. To secure the cluster access, one can either configure
authentication for each service exposed or setup firewall rules for each open port. Configuring firewalls for `classic`
provider is covered in this doc
[IBM Cloud doc link](https://cloud.ibm.com/docs/containers?topic=containers-firewall#firewall_outbound), configuring
authentication is covered in the [install-Kubeflow](/docs/ibm/deploy/install-kubeflow-on-iks#multi-user-auth-enabled)
section.

Considering the risk associated with exposing computing resources on the public internet, it might be easier to setup
`vpc-gen2` cluster than securing a `classic` provider cluster.

### Setting environment variables

Choose the region and the worker node provider for your cluster, and set the environment variables.

```shell
export KUBERNERTES_VERSION=1.17
export CLUSTER_ZONE=dal13
export WORKER_NODE_PROVIDER=classic
export CLUSTER_NAME=kubeflow
```

- `KUBERNETES_VERSION` specifies the Kubernetes version for the cluster. Run `ibmcloud ks versions` to see the supported
  Kubernetes versions. If this environment variable is not set, the cluster will be created with the default version set
  by IBM Cloud Kubernetes Service. Refer to the
  [Minimum system requirements](https://www.kubeflow.org/docs/started/k8s/overview/#minimum-system-requirements)
  and choose a Kubernetes version compatible with the Kubeflow release to be deployed.
- `CLUSTER_ZONE` identifies the regions or location where CLUSTER_NAME will be created. Run `ibmcloud ks locations` to
  list supported IBM Cloud Kubernetes Service locations. For example, choose `dal13` to create CLUSTER_NAME in the
  Dallas (US) data center.
- `WORKER_NODE_PROVIDER` specifies the kind of IBM Cloud infrastructure on which the Kubernetes worker nodes will be
  created. The `classic` type supports worker nodes with GPUs. There are other worker nodes providers including
  `vpc-classic` and `vpc-gen2` where zone names and worker flavors will be different. Please use
  `ibmcloud ks zones --provider ${WORKER_NODE_PROVIDER}` to list zone names for all the providers and set the
  `CLUSTER_ZONE` with respect to your chosen provider.
- `CLUSTER_NAME` must be lowercase and unique among any other Kubernetes
  clusters in the specified `${CLUSTER_ZONE}`.

**Notice**: Refer to [Creating clusters](https://cloud.ibm.com/docs/containers?topic=containers-clusters) in the IBM
Cloud documentation for additional information on how to set up other providers and zones in your cluster.

### Choosing a worker node flavor for a `classic` or `vpc-gen2` provider.

The worker nodes flavor name varies from zones and providers. Run 
`ibmcloud ks flavors --zone ${CLUSTER_ZONE} --provider ${WORKER_NODE_PROVIDER}` to list available flavors.

For example, following are some flavors supported in the `dal13` zone with `classic` node provider.

```text
$ ibmcloud ks flavors --zone dal13 --provider classic
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

Below are some examples of flavors supported in the `us-south-3` zone with `vpc-gen2` node provider:

```text
$ ibmcloud ks flavors --zone us-south-3 --provider vpc-gen2
OK
For more information about these flavors, see 'https://ibm.biz/flavors'
Name         Cores   Memory   Network Speed   OS             Server Type   Storage   Secondary Storage   Provider   
bx2.16x64    16      64GB     16Gbps          UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.2x8†     2       8GB      4Gbps           UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.32x128   32      128GB    16Gbps          UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.48x192   48      192GB    16Gbps          UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.4x16     4       16GB     8Gbps           UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
...
```

Choose a flavor that will work for your applications. For the purpose of the Kubeflow deployment, the recommended
configuration for a cluster is at least 8 vCPU cores with 16GB memory. Hence you can either choose the `b3c.8x32` flavor
to create a one-worker-node cluster or choose the `b3c.4x16` flavor to create a two-worker-node cluster. Keep in mind
that you can always scale the cluster by adding more worker nodes should your application scales up.

Now set the environment variable with the flavor you choose.

```shell
export WORKER_NODE_FLAVOR=b3c.4x16
```

If the chosen cluster is in `vpc-gen2`, then for example, the selected environment variables can be:

```shell
export KUBERNERTES_VERSION=1.18
export CLUSTER_ZONE=us-south-3
export WORKER_NODE_PROVIDER=vpc-gen2
export CLUSTER_NAME=kubeflow-test-vpc-gen2
export WORKER_NODE_FLAVOR=bx2.4x16
```

### Creating an IBM Cloud Kubernetes cluster for a `classic` provider

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

Note: If you're starting in a fresh account with no public and private VLANs, they are created automatically for you
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
ibmcloud ks clusters --provider ${WORKER_NODE_PROVIDER} |grep ${CLUSTER_NAME}|awk '{print "Name:"$1"\tState:"$3}'
```

## Create an IBM Cloud Kubernetes cluster for `vpc-gen2` infrastructure

1. Begin with installing a vpc-infrastructure plugin:

   `$ ibmcloud plugin install vpc-infrastructure`
   
   Refer to this [link](https://cloud.ibm.com/docs/containers?topic=containers-vpc_ks_tutorial), for more information.

2. Target the gen 2 to access gen 2 resources:

   `$ ibmcloud is target --gen 2`
   
   Verify, the target is correctly setup

   ```shell
   $ ibmcloud is target
   Target Generation: 2
   ```

3. Create or use an existing VPC:
   
   a) Use an existing VPC: 
   
    ```shell
    
     ibmcloud is vpcs
    Listing vpcs for generation 2 compute in all resource groups and region ...
    ID                                          Name                Status      Classic access   Default network ACL                                    Default security group                                 Resource group   
    r006-hidden-68cc-4d40-xxxx-4319fa3gxxxx   my-vpc1              available   false            husker-sloping-bee-resize                              blimp-hasty-unaware-overflow                           kubeflow   
    
    ```
    If the above list contains the VPC that can be used to deploy your cluster - note it's ID.
   
   b) To create a new VPC, proceed as follows:

    ```shell
    $ ibmcloud is vpc-create my-vpc
    Creating vpc my-vpc in resource group kubeflow under account IBM as ...
                                                      
    ID                                             r006-hidden-68cc-4d40-xxxx-4319fa3fxxxx   
    Name                                           my-vpc   
    ...  
    ```

   Save the ID in a variable `VPC_ID` as follows, so that we can use it later.
   
   `export VPC_ID=r006-hidden-68cc-4d40-xxxx-4319fa3fxxxx`

4. Create or use an existing subnet:

    a) To use an existing subnet:
    
    ```$ ibmcloud is subnets
    Listing subnets for generation 2 compute in all resource groups and region ...
    ID                                          Name                      Status      Subnet CIDR       Addresses     ACL                                                    Public Gateway                             VPC                 Zone         Resource group   
    0737-27299d09-1d95-4a9d-a491-a6949axxxxxx   my-subnet                 available   10.240.128.0/18   16373/16384   husker-sloping-bee-resize                              my-gateway                                 my-vpc              us-south-3   kubeflow   
    ```
   If the above list contains the subnet corresponding to your VPC, that can be used to deploy your cluster - note it's
   ID.
   
    b) To create a new subnet
      * List address prefixes and note the CIDR block corresponding to a Zone,
   in below example, for Zone: `us-south-3` CIDR block is : `10.240.128.0/18`
         ```shell
          $ ibmcloud is vpc-address-prefixes $VPC_ID
          
          Listing address prefixes of vpc r006-hidden-68cc-4d40-xxxx-4319fa3fxxxx under account IBM as user new@user-email.com...
          ID                                          Name                                CIDR block        Zone         Has subnets   Is default   Created   
          r006-xxxxxxxx-4002-46d2-8a4f-f69e7ba3xxxx   rising-rectified-much-brew          10.240.0.0/18     us-south-1   false         true         2021-03-05T14:58:39+05:30   
          r006-xxxxxxxx-dca9-4321-bb6c-960c4424xxxx   retrial-reversal-pelican-cavalier   10.240.64.0/18    us-south-2   false         true         2021-03-05T14:58:39+05:30   
          r006-xxxxxxxx-7352-4a46-bfb1-fcbac6cbxxxx   subfloor-certainly-herbal-ajar      10.240.128.0/18   us-south-3   false         true         2021-03-05T14:58:39+05:30  
         ```
   * Now create a subnet as follows.
   
       ```shell
       $ ibmcloud is subnet-create my-subnet $VPC_ID us-south-3 --ipv4-cidr-block "10.240.128.0/18"
       Creating subnet my-subnet in resource group kubeflow under account IBM as user new@user-email.com...
                              
       ID                  0737-27299d09-1d95-4a9d-a491-a6949axxxxxx   
       Name                my-subnet
       ```

   Export the subnet id as,
   
   `export SUBNET_ID=0737-27299d09-1d95-4a9d-a491-a6949axxxxxx`

5. Create a `vpc-gen2` based Kubernetes cluster
   
   ```shell
   $ ibmcloud ks cluster create ${WORKER_NODE_PROVIDER}   --name ${CLUSTER_NAME}   --zone=${CLUSTER_ZONE}   --version=${KUBERNETES_VERSION}   --flavor ${WORKER_NODE_FLAVOR} --vpc-id $VPC_ID --subnet-id $SUBNET_ID --workers=2
   Creating cluster...
   OK
   Cluster created with ID cxxxxxxd00kq9mnxxxxx
   ```

6. Attach a public gateway

   This step is mandatory for Kubeflow deployment to succeed, because pods need public internet access to download images.
   
   First check, if your cluster is already assigned a public gateway:
   
   ```shell
   $ ibmcloud is pubgws
   Listing public gateways for generation 2 compute in all resource groups and region ...
   ID                                          Name                                       Status      Floating IP      VPC                 Zone         Resource group   
   r006-xxxxxxxx-5731-4ffe-bc51-1d9e5fxxxxxx   my-gateway                                 available   xxx.xxx.xxx.xxx       my-vpc              us-south-3   default   
   
   ```
   
   In the above run, gateway is already attached for the vpc: `my-vpc`. In case no gateway is attached, proceed with
   rest of the setup.
   
   Attach a public gateway:
   
   ```shell
   $ ibmcloud is public-gateway-create my-gateway $VPC_ID us-south-3
   ID: r006-xxxxxxxx-5731-4ffe-bc51-1d9e5fxxxxxx
   
   $ export GATEWAY_ID="r006-xxxxxxxx-5731-4ffe-bc51-1d9e5fxxxxxx"
   
   $ ibmcloud is subnet-update $SUBNET_ID --public-gateway-id $GATEWAY_ID
   Updating subnet 0737-27299d09-1d95-4a9d-a491-a6949axxxxxx under account IBM as user new@user-email.com...
                          
   ID                  0737-27299d09-1d95-4a9d-a491-a6949axxxxxx   
   Name                my-subnet   
   ...
   
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
