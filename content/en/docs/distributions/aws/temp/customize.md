+++
title = "Customization Guides for Kubeflow on AWS"
description = "Tailoring a deployment of Kubeflow on AWS and Amazon EKS"
weight = 10
+++

This guide describes how to customize your deployment of Kubeflow on AWS and Amazon EKS.
These steps can optionally be done before you run `kfctl apply` command with your local configuration file in place.
For information and instructions on the deployment process, please see the [Deploy](/docs/distributions/aws/deploy) guide for details.

### Customize your Amazon EKS cluster

The first thing to consider for customization is your cluster configuration. Both the [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/index.html) and the [eksctl](https://eksctl.io/) docs site have information on various methods and options. You can configure options in the cluster as well as specify a large number of customizations in the cluster nodes. For example, you may consider provisioning GPU-based compute resources and using the EKS-optimized AMI with GPU support built in.

The easiest way to manage configurations for cluster creation as well as ongoing maintenance operations is to use `eksctl`. It provides an easy-to-use command-line utility which also provides support for a cluster configuration file. 

For example, the following is a cluster manifest with one node group which has 2 `p2.xlarge` instances. Note this also provides a simple method for enabling remote node access via SSH with a configured public key.

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  # AWS_CLUSTER_NAME and AWS_REGION will override `name` and `region` here.
  name: kubeflow-example
  region: us-west-2
  version: "1.18"
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

Basic authentication is the default configuration when using the standard [configuration file]({{% aws/config-uri-aws-standard %}}).
When using this method, remember to change the default password in this section:

```yaml
spec:
  auth:
  basicAuth:
    password: 12341234
    username: admin@kubeflow.org
```

You can optionally configure your deployment to use [AWS Cognito](https://aws.amazon.com/cognito/) or [OpenID Connect](https://openid.net/connect/). 
For more information on these options, see [Authentication](/docs/distributions/aws/authentication).

### Further customizations

Please refer to the following configuration sections for more information and options.

* For information on Control Plane and Kubernetes Node logging, refer to [Logging](/docs/distributions/aws/customizing-aws/logging).
* For information on using a custom domain with your Kubeflow deployment, refer to [Custom Domain](/docs/distributions/aws/customizing-aws/custom-domain).
* For information on configuring Private Clusters in Amazon EKS, refer to [Private Access](/docs/distributions/aws/customizing-aws/private-access).
* For information and instructions on using different types of storage, refer to [Storage Options](/docs/distributions/aws/customizing-aws/storage).
* For information on using Amazon RDS for pipeline and metadata store, refer to [Configure External Database Using Amazon RDS](/docs/distributions/aws/customizing-aws/rds).
