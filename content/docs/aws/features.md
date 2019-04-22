+++
title = "Kubeflow on AWS Features"
weight = 2
+++

## Reasons to use Kubeflow on AWS

Running Kubeflow on EKS brings the following features and they are optional and configurable.

* Manage EKS cluster provision with **eksctl** and provide flexibility to start different flavor of GPU nodes.
* Manage external traffic with **AWS ALB Ingress Controller**.
* Leverage **Amazon FSx CSI driver** to manage Lustre file system which is optimized for compute-intensive workloads, such as high-performance computing and machine learning. It can scale to hundreds of GBps of throughput and millions of IOPS.
* Centralized and unified Kubernetes cluster logs in **CloudWatch** which helps debugging and troubleshooting.
* Enable TLS and Authentication with **AWS Certificate Manager** and **AWS Cognito**
* Enable **Private Access** for your Kubernetes cluster's API server endpoint
* Automatically detect GPU instance and install **Nvidia Device Plugin**
