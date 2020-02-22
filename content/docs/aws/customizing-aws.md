+++
title = "Customizing Kubeflow on AWS"
description = "Tailoring a AWS deployment of Kubeflow"
weight = 20
+++

This guide describes how to customize your deployment of Kubeflow on Amazon EKS.
These steps can be done before you run `apply -V -f ${CONFIG_FILE}` command. Please see the following sections for details. If you don't understand the deployment process, please see [deploy](/docs/aws/deploy) for details.


## Customizing Kubeflow

Here are the optional configuration parameters for kfctl on the AWS platform.

| Options  | Description  | Required |
|---|---|---|
| `awsClusterName` | Name of your new or existing Amazon EKS cluster  |  YES |
| `awsRegion`  |  The AWS Region to launch in |  YES |
| `awsNodegroupRoleNames`  |  The IAM role names for your worker nodes | YES for existing clusters / No for new clusters |


### Customize your Amazon EKS cluster

Before you run `kfctl apply -V -f ${CONFIG_FILE}`, you can edit the cluster configuration file to change cluster specification before you create the cluster.

Cluster configuration is stored in `${KF_DIR}/aws_config/cluster_config.yaml`. Please see [eksctl](https://eksctl.io/) for configuration details.

For example, the following is a cluster manifest with one node group which has 2 `p2.xlarge` instances. You can easily enable SSH and configure a public key. All worker nodes will be in single Availability Zone.

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  # AWS_CLUSTER_NAME and AWS_REGION will override `name` and `region` here.
  name: kubeflow-example
  region: us-west-2
  version: '1.13'
# If your region has multiple availability zones, you can specify 3 of them.
#availabilityZones: ["us-west-2b", "us-west-2c", "us-west-2d"]

# NodeGroup holds all configuration attributes that are specific to a nodegroup
# You can have several node groups in your cluster.
nodeGroups:
  - name: eks-gpu
    instanceType: p2.xlarge
    availabilityZones: ["us-west-2b"]
    desiredCapacity: 2
    minSize: 0
    maxSize: 2
    volumeSize: 30
    ssh:
      allow: true
      sshPublicKeyPath: '~/.ssh/id_rsa.pub'

  # Example of GPU node group
  # - name: Tesla-V100
  # Choose your Instance type for the node group.
  #   instanceType: p3.2xlarge
  # GPU cluster can use single availability zone to improve network performance
  #   availabilityZones: ["us-west-2b"]
  # Autoscaling Groups settings
  #   desiredCapacity: 0
  #   minSize: 0
  #   maxSize: 4
  # Node Root Disk
  #   volumeSize: 50
  # Enable SSH out side your VPC.
  #   allowSSH: true
  #   sshPublicKeyPath: '~/.ssh/id_rsa.pub'
  # Customize Labels
  #   labels:
  #     'k8s.amazonaws.com/accelerator': 'nvidia-tesla-k80'
  # Setup pre-defined iam roles to node group.
  #   iam:
  #     withAddonPolicies:
  #       autoScaler: true

```

### Customize Authentication
Please see [this section](/docs/aws/authentication)

### Customize IAM Role for Pods
Please see [this section](/docs/aws/iam-for-sa)

### Customize Private Access
Please see [this section](/docs/aws/private-access)

### Customize Logging
Please see [this section](/docs/aws/logging)