+++
title = "AWS Features for Kubeflow"
description = "Get to know the benefits of using Kubeflow with AWS service intergrations"
weight = 10
+++

Running Kubeflow on AWS gives you the following feature benefits and configuration options:

## Manage AWS compute environments
* Provision and manage your **[Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)** clusters with **[eksctl](https://github.com/weaveworks/eksctl)** and easily configure multiple compute and GPU node configurations.
* Your deployment will use AWS-optimized Jupyter Notebook container images, which are based on **[AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/what-is-dlc.html)**.

## Load balancing, certificates, and identity management
* Manage ingress traffic with the **[AWS ALB Ingress Controller](https://github.com/kubernetes-sigs/aws-alb-ingress-controller)**.
* Get started with TLS authentication using **[AWS Certificate Manager](https://aws.amazon.com/certificate-manager/)** and **[AWS Cognito](https://aws.amazon.com/cognito/)**.

## Integrate with AWS storage and database solutions
* Leverage the **[Amazon FSx CSI driver](https://github.com/kubernetes-sigs/aws-fsx-csi-driver)** to manage Lustre file systems which are optimized for compute-intensive workloads, such as high-performance computing and machine learning. **[Amazon FSx for Lustre](https://aws.amazon.com/fsx/lustre/)** can scale to hundreds of GBps of throughput and millions of IOPS.
* Use Kubeflow with **[Amazon Elastic File System (EFS)](https://aws.amazon.com/efs/)** for a simple, scalabale, and serverless storage solution. 
* Integrate Kubeflow with **[Amazon Relational Database Service (RDS)](https://aws.amazon.com/rds/)** for a highly scalable and easy-to-use pipelines and metadata store.

To get started with Kubeflow on AWS, see [Install Kubeflow](https://www.kubeflow.org/docs/distributions/aws/deploy/install-kubeflow/). 