+++
title = "Customizing Kubeflow on AWS"
description = "Tailoring a AWS deployment of Kubeflow"
weight = 20
+++

This guide describes how to customize your deployment of Kubeflow on Amazon EKS.
These steps can be done before you run `apply -V -f ${CONFIG_FILE}` command. Please see the following sections for details. If you don't understand the deployment process, please see [deploy](/docs/aws/deploy) for details.


### Customize your Amazon EKS cluster

> Note: This is only working for user who like `kfctl` to create a new EKS cluster. If you already have the cluster, you can skip this section.

Before you run `kfctl apply -V -f ${CONFIG_FILE}`, you can edit the cluster configuration file to change cluster specification before you create the cluster.

For example, the following is a cluster manifest with one node group which has 2 `p2.xlarge` instances. You can easily enable SSH and configure a public key. All worker nodes will be in single Availability Zone.

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  # AWS_CLUSTER_NAME and AWS_REGION will override `name` and `region` here.
  name: kubeflow-example
  region: us-west-2
  version: '1.14'
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
      publicKeyPath: '~/.ssh/id_rsa.pub'

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
  #   publicKeyPath: '~/.ssh/id_rsa.pub'
  # Customize Labels
  #   labels:
  #     'k8s.amazonaws.com/accelerator': 'nvidia-tesla-k80'
  # Setup pre-defined iam roles to node group.
  #   iam:
  #     withAddonPolicies:
  #       autoScaler: true

```

### Customize Authentication

If you use {{% config-uri-aws-standard %}}, you can consider to change the default password in the [configuration file]({{% config-uri-aws-standard %}}). The configuration file contains:

```
spec:
  auth:
  basicAuth:
    password: 12341234
    username: admin@kubeflow.org
```

If you use {{% config-uri-aws-cognito %}}, please see [this section](/docs/aws/authentication)

### Customize IAM Role for Pods
Please see [this section](/docs/aws/iam-for-sa)

### Customize Private Access
Please see [this section](/docs/aws/private-access)

### Customize Logging
Please see [this section](/docs/aws/logging)