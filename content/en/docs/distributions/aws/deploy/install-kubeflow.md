+++
title = "Install Kubeflow"
description = "Get started and explore options for deploying Kubeflow on Amazon EKS"
weight = 20
+++

There are a number of deployment options for installing Kubeflow with AWS service integrations.

The following installation guides assume that you have an existing Kubernetes cluster. To get started with creating an Amazon Elastic Kubernetes Service (EKS) cluster, see [Getting started with Amazon EKS - `eksctl`](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html). To verify compatibility between EKS Kubernetes and Kubeflow versions during setup, see [Amazon EKS and Kubeflow Compatibility](https://www.kubeflow.org/docs/distributions/aws/deploy/eks-compatibility/).

> Note: It is necessary to use a Kubernetes cluster with compatible tool versions and compute power. For more information, see the specific prerequisites for the [deployment option](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples) of your choosing.

If you experience any issues with installation, see [Troubleshooting Kubeflow on AWS](/docs/distributions/aws/troubleshooting-aws).

## Deployment options

Read on to explore more options for AWS-integrated deployment options. 

### Components configured for Cognito, RDS and S3

There is a single guide for deploying Kubeflow on AWS with [RDS, S3, and Cognito](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/cognito-rds-s3).

### Vanilla version with Dex for auth and EBS volumes as PV

The default deployment will leverage [Dex](https://dexidp.io/), an OpenID Connect provider. See the [vanilla installation](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/vanilla) example for more information.

### Components configured for RDS and S3

Kubeflow components on AWS can be deployed with integrations for just [Amazon S3](https://aws.amazon.com/s3/) and [Amazon RDS](https://aws.amazon.com/rds/). Refer to the [Kustomize Manifests for RDS and S3](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/rds-s3) guide for deployment configuration instructions.

### Components configured for Cognito 

Optionally, you may deploy Kubeflow with an integration only with [AWS Cognito](https://aws.amazon.com/cognito/) for your authentication needs. Refer to the [Deploying Kubeflow with AWS Cognito as idP](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/cognito) guide.

## Additional component integrations

Along with Kubernetes support for Amazon EBS, Kubeflow on AWS has integrations for using [Amazon EFS](https://aws.amazon.com/efs/) or [Amazon FSx for Lustre](https://aws.amazon.com/fsx/lustre/) for persistent storage.

### Using EFS with Kubeflow

Amazon EFS supports `ReadWriteMany` access mode, which means the volume can be mounted as read-write by many nodes. This is useful for creating a shared filesystem that can be mounted into multiple pods, as you may have with Jupyter. For example, one group can share datasets or models across an entire team.

Refer to the [Amazon EFS example](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/storage/efs) for more information.

### Using FSx for Lustre with Kubeflow

Amazon FSx for Lustre provides a high-performance file system optimized for fast processing for machine learning and high performance computing (HPC) workloads.  Lustre also supports `ReadWriteMany`. One difference between Amazon EFS and Lustre is that Lustre can be used to cache training data with direct connectivity to Amazon S3 as the backing store. With this configuration, you don't need to transfer data to the file system before using the volume.

Refer to the [Amazon FSx for Lustre example](https://github.com/awslabs/kubeflow-manifests/tree/v1.3-branch/distributions/aws/examples/storage/fsx-for-lustre) for more details.

## Usage Tracking

AWS uses customer feedback and usage information to improve the quality of the services and software we offer to customers. We have added usage data collection to the AWS Kubeflow distribution in order to better understand customer usage and guide future improvements. Usage tracking for Kubeflow is activated by default, but is entirely voluntary and can be deactivated at any time. 

Usage tracking for Kubeflow on AWS collects the instance ID used by one of the worker nodes in a customer’s cluster. This data is sent back to AWS once per day. Usage tracking only collects the EC2 instance ID where Kubeflow is running and does not collect or export any other data to AWS. If you wish to deactivate this tracking, instructions are below. 

### How to activate usage tracking

Usage tracking is activated by default. If you deactivated usage tracking for your Kubeflow deployment and would like to activate it after the fact, you can do so at any time with the following command:

```bash
kustomize build distributions/aws/aws-telemetry | kubectl apply -f -
```

### How to deactivate usage tracking

**Before deploying Kubeflow:** 

You can deactivate usage tracking by skipping the telemetry component installation in one of two ways:

1. For single line installation, comment out the `aws-telemetry` line in the `kustomization.yaml` file. e.g. in [cognito-rds-s3 kustomization.yaml](https://github.com/awslabs/kubeflow-manifests/blob/v1.3-branch/distributions/aws/examples/cognito-rds-s3/kustomization.yaml#L58-L59) file:
    ```
    # ./../aws-telemetry
    ```
1. For individual component installation, **do not** install the `aws-telemetry` component: 
    ```
    # AWS Telemetry - This is an optional component. See usage tracking documentation for more information
    kustomize build distributions/aws/aws-telemetry | kubectl apply -f -
    ```
**After deploying Kubeflow:**

To deactivate usage tracking on an existing deployment, delete the `aws-kubeflow-telemetry` cronjob with the following command:

```
kubectl delete cronjob -n kubeflow aws-kubeflow-telemetry
```

### Information collected by usage tracking

* **Instance ID** - We collect the instance ID used by one of the worker nodes in the customer’s EKS cluster. This collection occurs once per day.

### Learn more

The telemetry data we collect is in accordance with AWS data privacy policies. For more information, see the following:

* [AWS Service Terms](https://aws.amazon.com/service-terms/)
* [Data Privacy](https://aws.amazon.com/compliance/data-privacy-faq/)

## Post-installation

Kubeflow provides multi-tenancy support and users are not able to create notebooks in either the `kubeflow` or `default` namespaces. For more information, see [Multi-Tenancy](https://www.kubeflow.org/docs/components/multi-tenancy/). 

Automatic profile creation is not enabled by default. To create profiles as an administrator, see [Manual profile creation](https://www.kubeflow.org/docs/components/multi-tenancy/getting-started/#manual-profile-creation).

