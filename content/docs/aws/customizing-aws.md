+++
title = "Customizing Kubeflow on AWS"
description = "Tailoring a AWS deployment of Kubeflow"
weight = 20
+++

This guide describes how to customize your deployment of Kubeflow on EKS.
Some of the steps can be done before `apply platform`, some of them can be done before `apply k8s`. Please check following sections for details. If you don't understand development phase. Please check [deploy](/docs/aws/deploy) for details.


## Customizing Kubeflow

Here're all configuration options for kfctl for platform aws.

| Options  | Description  | Required |
|---|---|---|
| awsClusterName | Name of new cluster or existing eks cluster  |  YES |
| awsRegion  |  Region EKS cluster launch in |  YES |
| awsNodegroupRoleNames  |  EKS node groups role names | YES for existing cluster/ No for new cluster |


### Customize EKS cluster

Before you run `${KUBEFLOW_SRC}/scripts/kfctl.sh apply platform`, you can edit cluster configuration file to change cluster specs before cluster creation.

Cluster config is located in `${KUBEFLOW_SRC}/${KFAPP}/aws_config/cluster_config.yaml`. Please check [eksctl](https://eksctl.io/) for configuration details.

For example, this is a cluster manifest with one node group which has 2 p2.xlarge instance. You can easily enable SSH and configure public key. All worker nodes will be in single availability zone.

```yaml
apiVersion: eksctl.io/v1alpha4
kind: ClusterConfig
metadata:
  # AWS_CLUSTER_NAME and AWS_REGION will override `name` and `region` here.
  name: kubeflow-example
  region: us-west-2
  version: '1.12'
# If your region has multiple availability zones, you can specify 3 of them.
#availabilityZones: ["us-west-2b", "us-west-2c", "us-west-2d"]

# NodeGroup holds all configuration attributes that are specific to a nodegroup
# You can have several node group in your cluster.
nodeGroups:
  - name: eks-gpu
    instanceType: p2.xlarge
    availabilityZones: ["us-west-2b"]
    desiredCapacity: 2
    minSize: 0
    maxSize: 2
    volumeSize: 30
    allowSSH: true
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

### Customize Private Access
Please check [section](/docs/aws/private-access)

### Customize Logging
Please check [section](/docs/aws/logging)

### Customize Authentication
Please check [section](/docs/aws/authentication)
