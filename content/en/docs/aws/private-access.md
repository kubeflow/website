+++
title = "Private Access"
description = "How to create private EKS clusters"
weight = 80
                    
+++
{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}

This section helps you to enable private access for your Amazon EKS cluster's Kubernetes API server endpoint and completely disable public access so that it's not accessible from the internet.

## Enable Private Access for your cluster's API server endpoint

You can enable private access to the Kubernetes API server so that all communication between your worker nodes and the API server stays within your VPC. You can also completely disable public access to your API server so that it's not accessible from the internet.

```
aws eks update-cluster-config \
    --region region \
    --name <your_eks_cluster_name> \
    --resources-vpc-config endpointPublicAccess=true,endpointPrivateAccess=true
```

By default, this API server endpoint is public to the internet (`endpointPublicAccess=true`) , and access to the API server is secured using a combination of [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) and native Kubernetes [Role Based Access Control](https://kubernetes.io/docs/admin/authorization/rbac/) (`endpointPrivateAccess=false`).

You can enable private access to the Kubernetes API server so that all communication between your worker nodes and the API server stays within your VPC (`endpointPrivateAccess=true`). You can also completely disable public access to your API server so that it's not accessible from the internet (`endpointPublicAccess=false`). In this case, you need to have an instance inside your VPC to talk with your Kubernetes API server.

Note: You may see `InvalidParameterException` if you have invalid combination.

Please check [Amazon EKS Cluster Endpoint Access Control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) for more details.