+++
title = "Kubeflow on AWS Features"
weight = 200
+++

## Reasons to use Kubeflow on AWS

Running Kubeflow on Amazon EKS brings the following optional and configurable features:

* You can manage your Amazon EKS cluster provisioning with **eksctl** and easily choose between multiple compute and GPU worker node configurations.
* You can manage ingress traffic with the **AWS ALB Ingress Controller**.
* You can leverage the **Amazon FSx CSI driver** to manage Lustre file systems which are optimized for compute-intensive workloads, such as high-performance computing and machine learning. Amazon FSx can scale to hundreds of GBps of throughput and millions of IOPS.
* Centralized and unified Kubernetes cluster logs in **Amazon CloudWatch**, which helps with debugging and troubleshooting.
* You can enable TLS and Authentication with **AWS Certificate Manager** and **AWS Cognito**.
* You can enable **Private Access** for your Kubernetes cluster's API server endpoint.
* Your Kubeflow on AWS deployment automatically detects GPU worker nodes and installs the **NVIDIA Device Plugin**.
