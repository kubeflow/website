+++
title = "Initial cluster setup for existing cluster"
weight = 6
+++

## Before you start

This is one step of [installing Kubeflow](/docs/aws/deploy/install-kubeflow), please make sure you have completed the prerequisite steps there before proceeding.

### Deploy Kubeflow on existing Amazon EKS Cluster

If you would like to deploy Kubeflow on existing Amazon EKS cluster, the only difference in setup is when you initialize the platform setup. Since you manage your own cluster resources, you need to provide `AWS_CLUSTER_NAME`, `cluster region` and `worker roles`.


1. Retrieve the Amazon EKS cluster name, AWS Region, and IAM role name for your worker nodes. Set these values in the manifest file.

    ```shell
    export AWS_CLUSTER_NAME=<YOUR EKS CLUSTER NAME>
    export KFAPP=${AWS_CLUSTER_NAME}
    ```

    > Note: To get your Amazon EKS worker node IAM role name, you can check IAM setting by running the following commands. This command assumes that you used `eksctl` to create your cluster. If you use other provisioning tools to create your worker node groups, please find the role that is associated with your worker nodes in the Amazon EC2 console.

    ```shell
    aws iam list-roles \
        | jq -r ".Roles[] \
        | select(.RoleName \
        | startswith(\"eksctl-$AWS_CLUSTER_NAME\") and contains(\"NodeInstanceRole\")) \
        .RoleName"

    eksctl-kubeflow-example-nodegroup-ng-185-NodeInstanceRole-1DDJJXQBG9EM6
    ```

    Change cluster region and worker roles names in your `kfctl_aws.yaml`
    ```yaml
      region: us-west-2
      roles:
        - eksctl-kubeflow-example-nodegroup-ng-185-NodeInstanceRole-1DDJJXQBG9EM6
    ```
    > If you have multiple node groups, you will see corresponding number of node group roles. In that case, please provide the role names as an array.

1. Install Kubeflow

    ```shell
    kfctl init ${KFAPP} --config=${CONFIG} -V
    cd ${KFAPP}
    kfctl generate all -v
    kfctl apply all -v
    ```

All rest steps are exact same for both install kubeflow on new cluster and existing cluster. Please come back to [Installing Kubeflow](/docs/aws/deploy/install-kubeflow) for details.