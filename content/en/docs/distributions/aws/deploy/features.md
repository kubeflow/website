+++
title = "AWS Features for Kubeflow"
weight = 10
+++

Running Kubeflow on Amazon EKS gives you the following feature benefits and configuration options:

* You can provision and manage your Amazon EKS clusters with **[eksctl](https://github.com/weaveworks/eksctl)** and easily configure multiple compute and GPU node configurations.
* Your Kubeflow on AWS deployment automatically detects GPU worker nodes and installs the **[NVIDIA Device Plugin](https://github.com/NVIDIA/k8s-device-plugin)**.
* Centralized and unified Kubernetes cluster logs in **[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/)**, which helps with monitoring, troubleshooting, and debugging.
* You can easily enable TLS authentication with **[AWS Certificate Manager](https://aws.amazon.com/certificate-manager/)** and **[AWS Cognito](https://aws.amazon.com/cognito/)**.
* Your deployment will use AWS-optimized Jupyter Notebook container images, which are based on **[AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/deep-learning-containers-eks.html)**.
* You can enable **[Private Access](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)** for your Kubernetes cluster's API server endpoint.
* You can manage ingress traffic with the **[AWS ALB Ingress Controller](https://github.com/kubernetes-sigs/aws-alb-ingress-controller)**.
* You can leverage the **[Amazon FSx CSI driver](https://github.com/kubernetes-sigs/aws-fsx-csi-driver)** to manage Lustre file systems which are optimized for compute-intensive workloads, such as high-performance computing and machine learning. Amazon FSx can scale to hundreds of GBps of throughput and millions of IOPS.
* You can easily integrate Kubeflow with **[Amazon RDS](https://aws.amazon.com/rds/)** for a highly scalable and easy-to-use pipelines and metadata store.
