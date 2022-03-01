+++
title = "Install Kubeflow"
description = "Get started and explore options for deploying Kubeflow on Amazon EKS"
weight = 20
+++

There are a number of deployment options for installing Kubeflow with AWS service integrations.

The following installation guides assume that you have an existing Kubernetes cluster. To get started with creating an Amazon Elastic Kubernetes Service (EKS) cluster, see [Getting started with Amazon EKS - `eksctl`](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html). 

If you experience any issues with installation, see [Troubleshooting Kubeflow on AWS](/docs/distributions/aws/troubleshooting-aws).

## Deployment options

Read on to explore more options for AWS-integrated deployment options. 

For vanilla installation, see [Deploying Kubeflow on EKS](https://github.com/awslabs/kubeflow-manifests/tree/main/docs/deployment/vanilla). 

For more detailed instructions, see [Deployment Options](https://github.com/awslabs/kubeflow-manifests/tree/main/docs/deployment#deployment-options) for the AWS Distribution of Kubeflow.

### Authentication

The default deployment will leverage [Dex](https://dexidp.io/), an OpenID Connect provider. See the [AWS Kubeflow Manifests](https://github.com/awslabs/kubeflow-manifests#dex) component notes for more information.

Optionally, you may deploy Kubeflow with an integration for [AWS Cognito](https://aws.amazon.com/cognito/) for your authentication needs. Refer to the [Deploying Kubeflow with AWS Cognito as idP](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/cognito) guide.

### Integration with storage and database services

Kubeflow components on AWS can be deployed with integrations for [Amazon S3](https://aws.amazon.com/s3/) and [Amazon RDS](https://aws.amazon.com/rds/). Refer to the [Kustomize Manifests for RDS and S3](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/rds-s3) guide for deployment configuration instructions.

For convenience, there is also a single guide for deploying Kubeflow on AWS with [RDS, S3, and Cognito](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/cognito-rds-s3).

Along with Kubernetes support for Amazon EBS, Kubeflow on AWS has integrations for using [Amazon EFS](https://aws.amazon.com/efs/) or [Amazon FSx for Lustre](https://aws.amazon.com/fsx/lustre/) for persistent storage.

Amazon EFS supports `ReadWriteMany` access mode, which means the volume can be mounted as read-write by many nodes. This is useful for creating a shared filesystem that can be mounted into multiple pods, as you may have with Jupyter. For example, one group can share datasets or models across an entire team.

Amazon FSx for Lustre provides a high-performance file system optimized for fast processing for machine learning and high performance computing (HPC) workloads.  Lustre also supports `ReadWriteMany`. One difference between Amazon EFS and Lustre is that Lustre can be used to cache training data with direct connectivity to Amazon S3 as the backing store. With this configuration, you don't need to transfer data to the file system before using the volume.

Refer to the respective guides for [Amazon EFS](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/storage/efs) and [Amazon FSx for Lustre](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/storage/fsx-for-lustre) for more details.

## Deploy Kubeflow

Before deploying Kubeflow on AWS, be sure that you have: 

* a default [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) in your Kubernetes cluster. This will already be in place with an EKS cluster.
* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed and configured for your cluster.
* kustomize [version 3.2.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/v3.2.0) installed.

In recent versions, Kubeflow distribution manifests are maintained outside of the Kubeflow project. To prepare for deployment on AWS, clone the [AWS Kubeflow Manifests](https://github.com/awslabs/kubeflow-manifests) project locally and checkout the version that you wish to install.

```shell
git clone https://github.com/awslabs/kubeflow-manifests kubeflow-manifests
cd kubeflow-manifests
git checkout v1.3-branch
```

You can install all Kubeflow official components (residing under `apps`) and all common services (residing under `common`) using the following command:

```shell
while ! kustomize build example | kubectl apply -f - | grep -v unchanged; do echo "Retrying to apply resources"; sleep 10; done
```

For additional configuration and deployment options, see the [AWS Kubeflow Manifests documentation](https://github.com/awslabs/kubeflow-manifests/#installation).

## Working with your Kubeflow deployment

It will take some time for the deployment to complete. Make sure all Pods are ready before trying to connect, otherwise you might get unexpected errors. To check that all Kubeflow-related Pods are ready, use the following commands:

```shell
kubectl get pods -n cert-manager
kubectl get pods -n istio-system
kubectl get pods -n auth
kubectl get pods -n knative-eventing
kubectl get pods -n knative-serving
kubectl get pods -n kubeflow
kubectl get pods -n kubeflow-user-example-com
```

For instructions on connecting to your Kubeflow deployment, see [Connect to your Kubeflow cluster](https://github.com/awslabs/kubeflow-manifests/#connect-to-your-kubeflow-cluster).

For security reasons, be sure that you [change the default user password](https://github.com/awslabs/kubeflow-manifests/#change-default-user-password).

## Post-installation

Kubeflow provides multi-tenancy support and users are not able to create notebooks in either the `kubeflow` or `default` namespaces. For more information, see [Multi-Tenancy](https://www.kubeflow.org/docs/components/multi-tenancy/). 

Automatic profile creation is not enabled by default. To create profiles as an administrator, see [Manual profile creation](https://www.kubeflow.org/docs/components/multi-tenancy/getting-started/#manual-profile-creation).

