+++
title = "Private Access"
description = "Using Amazon EKS private clusters with Kubeflow"
weight = 40
+++

This section discusses configuring fully private clusters in Amazon EKS for Kubeflow. This involves configuring your cluster's Kubernetes API server endpoint to be private within your VPC and disabling public access. This configuration offers a fully private Kubernetes cluster that is not accessible from the internet, and entails some specific requirements.

## Enable Private Access for your cluster's API server endpoint

Amazon EKS cluster endpoint access control can be configured to only allow traffic from within your cluster's VPC or a connected network. In this configuration, there is no public access to the API server endpoint from the internet.

By default, the Kubernetes API server endpoint is public to the internet (`endpointPublicAccess=true`) and access to the API server is secured using a combination of [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) and built-in Kubernetes [Role Based Access Control](https://kubernetes.io/docs/admin/authorization/rbac/) (`endpointPrivateAccess=false`).

You can enable private access to the Kubernetes API server so that all communication between your worker nodes and the API server stays within your VPC (`endpointPrivateAccess=true`). You can also completely disable public access to your API server so that it's not accessible from the internet (`endpointPublicAccess=false`). 

You can create the cluster with this configuration, or endpoint access can be modified for existing clusters through the EKS Console or with the CLI. For example:

```shell
aws eks update-cluster-config \
    --region ${AWS_REGION} \
    --name ${AWS_CLUSTER_NAME} \
    --resources-vpc-config endpointPublicAccess=false,endpointPrivateAccess=true
```

Once this configuration is in place, API server access must originate from within the VPC or a connected network. This includes access for kubectl and other administrative tools which work with the cluster's API server endpoint.

For more information see the Amazon EKS User Guide section on [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html).

## Working With Fully Private Clusters in Amazon EKS

With the above configuration options, fully private clusters can be configured in Amazon EKS. There are multiple requirements and considerations when working with such a configuration, including ensuring access to container images and various configuration requirements for integration with other AWS services such as Amazon CloudWatch and AWS X-Ray.

For more information about Amazon EKS private clusters, see https://docs.aws.amazon.com/eks/latest/userguide/private-clusters.html