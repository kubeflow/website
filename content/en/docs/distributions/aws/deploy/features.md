+++
title = "AWS Features for Kubeflow"
description = "Get to know the benefits of using Kubeflow with AWS service intergrations"
weight = 10
+++

Running Kubeflow on AWS gives you the following feature benefits and configuration options:

## Manage AWS compute environments
* Provision and manage your **[Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)** clusters with **[eksctl](https://github.com/weaveworks/eksctl)** and easily configure multiple compute and GPU node configurations.
* Use AWS-optimized container images, based on **[AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/what-is-dlc.html)**, with Kubeflow Notebooks.

## Load balancing, certificates, and identity management
* Manage external traffic with **[AWS Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)**.
* Get started with TLS authentication using **[AWS Certificate Manager](https://aws.amazon.com/certificate-manager/)** and **[AWS Cognito](https://aws.amazon.com/cognito/)**.

## Integrate with AWS database and storage solutions
* Integrate Kubeflow with **[Amazon Relational Database Service (RDS)](https://aws.amazon.com/rds/)** for a highly scalable pipelines and metadata store.
* Deploy Kubeflow with integrations for **[Amazon S3](https://aws.amazon.com/s3/)** for an easy-to-use pipeline artifacts store.
* Use Kubeflow with **[Amazon Elastic File System (EFS)](https://aws.amazon.com/efs/)** for a simple, scalabale, and serverless storage solution. 
* Leverage the **[Amazon FSx CSI driver](https://github.com/kubernetes-sigs/aws-fsx-csi-driver)** to manage Lustre file systems which are optimized for compute-intensive workloads, such as high-performance computing and machine learning. **[Amazon FSx for Lustre](https://aws.amazon.com/fsx/lustre/)** can scale to hundreds of GBps of throughput and millions of IOPS.

To get started with Kubeflow on AWS, see [Install Kubeflow](https://www.kubeflow.org/docs/distributions/aws/deploy/install-kubeflow/). 