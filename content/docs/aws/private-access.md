+++
title = "Private Access"
description = "How to create private EKS clusters"
weight = 80
+++

This section helps you to enable private access for your Amazon EKS cluster's Kubernetes API server endpoint and completely disable public access so that it's not accessible from the internet.

## Enable Private Access for your cluster's API server endpoint

You can enable private access to the Kubernetes API server so that all communication between your worker nodes and the API server stays within your VPC. You can also completely disable public access to your API server so that it's not accessible from the internet.

You can enable private access in `${KUBEFLOW_SRC}/${KFAPP}/aws_config/cluster_features.sh`.

```shell
PRIVATE_LINK=false
ENDPOINT_PUBLIC_ACCESS=true
ENDPOINT_PRIVATE_ACCESS=false
```

By default, this API server endpoint is public to the internet (`ENDPOINT_PUBLIC_ACCESS=true`) , and access to the API server is secured using a combination of AWS Identity and Access Management (IAM) and native Kubernetes [Role Based Access Control](https://kubernetes.io/docs/admin/authorization/rbac/)(`ENDPOINT_PRIVATE_ACCESS=false`).

You can enable private access to the Kubernetes API server so that all communication between your worker nodes and the API server stays within your VPC(`ENDPOINT_PRIVATE_ACCESS=true`). You can also completely disable public access to your API server so that it's not accessible from the internet. (`ENDPOINT_PUBLIC_ACCESS=false`). In this case, you need to have an instance inside your VPC to talk with your kubernetes API server.

Note: You may see `InvalidParameterException` if you have invalid combination.

Please check [Amazon EKS Cluster Endpoint Access Control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) for more details.

