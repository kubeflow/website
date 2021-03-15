+++
title = "Create or access an IBM Cloud Kubernetes cluster on a VPC"
description = "Instructions for creating or connecting to a Kubernetes cluster on IBM Cloud vpc-gen2"
weight = 4
+++

## Create and setup a new cluster

Follow these steps to create and setup a new IBM Cloud Kubernetes Service(IKS) cluster on `vpc-gen2` provider.

A `vpc-gen2` cluster does not expose each node to the public internet directly and thus has more secure
and more complex network setup. It is recommended setup for secured production use cases of Kubeflow.

### Setting environment variables

Choose the region and the worker node provider for your cluster, and set the environment variables.

```shell
export KUBERNERTES_VERSION=1.18
export CLUSTER_ZONE=us-south-3
export CLUSTER_NAME=kubeflow-vpc
```

where:

- `KUBERNETES_VERSION` Run `ibmcloud ks versions` to see the supported Kubernetes versions. Refer to
  [Supported version matrix](https://www.kubeflow.org/docs/started/k8s/overview/#minimum-system-requirements).
- `CLUSTER_ZONE` Run `ibmcloud ks locations` to list supported zones. For example, choose `us-south-3` to create your
  cluster in the Dallas (US) data center.
- `CLUSTER_NAME` must be lowercase and unique among any other Kubernetes
  clusters in the specified `${CLUSTER_ZONE}`.

**Notice**: Refer to [Creating clusters](https://cloud.ibm.com/docs/containers?topic=containers-clusters) in the IBM
Cloud documentation for additional information on how to set up other providers and zones in your cluster.

### Choosing a worker node flavor

The worker nodes flavor name varies from zones and providers. Run 
`ibmcloud ks flavors --zone ${CLUSTER_ZONE} --provider vpc-gen2` to list available flavors.

Below are some examples of flavors supported in the `us-south-3` zone with `vpc-gen2` node provider:

```shell
ibmcloud ks flavors --zone us-south-3 --provider vpc-gen2
```

Example output:

```
For more information about these flavors, see 'https://ibm.biz/flavors'
Name         Cores   Memory   Network Speed   OS             Server Type   Storage   Secondary Storage   Provider   
bx2.16x64    16      64GB     16Gbps          UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.2x8†     2       8GB      4Gbps           UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.32x128   32      128GB    16Gbps          UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.48x192   48      192GB    16Gbps          UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
bx2.4x16     4       16GB     8Gbps           UBUNTU_18_64   virtual       100GB     0B                  vpc-gen2   
...
```

The recommended configuration for a cluster is at least 8 vCPU cores with 16GB memory. Hence, we recommend
`bx2.4x16` flavor to create a two-worker-node cluster. Keep in mind that you can always scale the cluster
by adding more worker nodes should your application scales up.

Now set the environment variable with the flavor you choose.

```shell
export WORKER_NODE_FLAVOR=bx2.4x16
```

## Create an IBM Cloud Kubernetes cluster for `vpc-gen2` infrastructure

Creating a `vpc-gen2` based cluster needs a VPC, a subnet and a public gateway attached to it. Fortunately, this is a one
time setup. Future `vpc-gen2` clusters can reuse the same VPC/subnet(with attached public-gateway).

1. Begin with installing a vpc-infrastructure plugin:

    ```shell
    ibmcloud plugin install vpc-infrastructure
    ```
   
   Refer to this [link](https://cloud.ibm.com/docs/containers?topic=containers-vpc_ks_tutorial), for more information.

2. Target the gen 2 to access gen 2 resources:

    ```shell
    ibmcloud is target --gen 2
    ```
   
   Verify that the target is correctly set up:

    ```shell
    ibmcloud is target
    ```

    Example output:
    
    ```
    Target Generation: 2
    ```

3. Create or use an existing VPC:
   
   a) Use an existing VPC: 
   
    ```shell
    ibmcloud is vpcs
    ```

    Example output:
    ```
    Listing vpcs for generation 2 compute in all resource groups and region ...
    ID                                          Name                Status      Classic access   Default network ACL                                    Default security group                                 Resource group   
    r006-hidden-68cc-4d40-xxxx-4319fa3gxxxx   my-vpc1              available   false            husker-sloping-bee-resize                              blimp-hasty-unaware-overflow                           kubeflow   
    ```

    If the above list contains the VPC that can be used to deploy your cluster - make a note of its ID.
   
   b) To create a new VPC, proceed as follows:

    ```shell
    ibmcloud is vpc-create my-vpc
    ```

    Example output:

    ```
    Creating vpc my-vpc in resource group kubeflow under account IBM as ...
                                                      
    ID                                             r006-hidden-68cc-4d40-xxxx-4319fa3fxxxx   
    Name                                           my-vpc   
    ...  
    ```

   **Save the ID in a variable `VPC_ID` as follows, so that we can use it later.**
   
    ```shell
    export VPC_ID=r006-hidden-68cc-4d40-xxxx-4319fa3fxxxx
    ```

4. Create or use an existing subnet:

    a) To use an existing subnet:
    
    ```shell
    ibmcloud is subnets
    ```

    Example output:
    
    ```
    Listing subnets for generation 2 compute in all resource groups and region ...
    ID                                          Name                      Status      Subnet CIDR       Addresses     ACL                                                    Public Gateway                             VPC                 Zone         Resource group   
    0737-27299d09-1d95-4a9d-a491-a6949axxxxxx   my-subnet                 available   10.240.128.0/18   16373/16384   husker-sloping-bee-resize                              my-gateway                                 my-vpc              us-south-3   kubeflow   
    ```

    If the above list contains the subnet corresponding to your VPC, that can be used to deploy your cluster - make sure
   you note it's ID.
   
    b) To create a new subnet:
        - List address prefixes and note the CIDR block corresponding to a Zone;
   in the below example, for Zone: `us-south-3` the CIDR block is : `10.240.128.0/18`.
   
    ```shell
    ibmcloud is vpc-address-prefixes $VPC_ID
    ```
    
    Example output:
    
    ```
    Listing address prefixes of vpc r006-hidden-68cc-4d40-xxxx-4319fa3fxxxx under account IBM as user new@user-email.com...
    ID                                          Name                                CIDR block        Zone         Has subnets   Is default   Created   
    r006-xxxxxxxx-4002-46d2-8a4f-f69e7ba3xxxx   rising-rectified-much-brew          10.240.0.0/18     us-south-1   false         true         2021-03-05T14:58:39+05:30   
    r006-xxxxxxxx-dca9-4321-bb6c-960c4424xxxx   retrial-reversal-pelican-cavalier   10.240.64.0/18    us-south-2   false         true         2021-03-05T14:58:39+05:30   
    r006-xxxxxxxx-7352-4a46-bfb1-fcbac6cbxxxx   subfloor-certainly-herbal-ajar      10.240.128.0/18   us-south-3   false         true         2021-03-05T14:58:39+05:30  
    ```

    - Now create a subnet as follows:

    ```shell
    ibmcloud is subnet-create my-subnet $VPC_ID $CLUSTER_ZONE --ipv4-cidr-block "10.240.128.0/18"
    ```

    Example output:
    
    ```
    Creating subnet my-subnet in resource group kubeflow under account IBM as user new@user-email.com...
                          
    ID                  0737-27299d09-1d95-4a9d-a491-a6949axxxxxx   
    Name                my-subnet
    ```

   - Make sure you export the subnet IDs follows:

    ```shell
    export SUBNET_ID=0737-27299d09-1d95-4a9d-a491-a6949axxxxxx
    ```

5. Create a `vpc-gen2` based Kubernetes cluster:
    
    ```shell
    ibmcloud ks cluster create vpc-gen2 \
    --name $CLUSTER_NAME \
    --zone $CLUSTER_ZONE \
    --version ${KUBERNETES_VERSION} \
    --flavor ${WORKER_NODE_FLAVOR} \
    --vpc-id ${VPC_ID} \
    --subnet-id ${SUBNET_ID} \
    --workers 2
    ```

6. Attach a public gateway

   This step is mandatory for Kubeflow deployment to succeed, because pods need public internet access to download images.
   
   First check, if your cluster is already assigned a public gateway:
   
    ```shell
    ibmcloud is pubgws
    ```

    Example output:

    ```
    Listing public gateways for generation 2 compute in all resource groups and region ...
    ID                                          Name                                       Status      Floating IP      VPC                 Zone         Resource group   
    r006-xxxxxxxx-5731-4ffe-bc51-1d9e5fxxxxxx   my-gateway                                 available   xxx.xxx.xxx.xxx       my-vpc              us-south-3   default   
   
    ```
   
   In the above run, gateway is already attached for the vpc: `my-vpc`. In case no gateway is attached, proceed with
   rest of the setup.

   
   Attach a public gateway:
   
   ```shell
   ibmcloud is public-gateway-create my-gateway $VPC_ID $CLUSTER_ZONE
   ```

   Example output:
   ```
   ID: r006-xxxxxxxx-5731-4ffe-bc51-1d9e5fxxxxxx
   ```

   Save the above generated gateway ID as follows:

   ```shell
   export GATEWAY_ID="r006-xxxxxxxx-5731-4ffe-bc51-1d9e5fxxxxxx"
   ```

   Finally, attach the public gateway to the subnet:
   
   ```
   ibmcloud is subnet-update $SUBNET_ID --public-gateway-id $GATEWAY_ID
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

Make sure all worker nodes are up with the command below:

```shell
kubectl get nodes
```

and make sure all the nodes are in `Ready` state.

### Delete the cluster

Delete the cluster including it's storage

```shell
ibmcloud ks cluster rm --force-delete-storage -c ${CLUSTER_NAME}
```
