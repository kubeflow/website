+++
title = "Initial cluster setup for existing cluster"
weight = 6
+++

## Before you start

This is one step of [installing Kubeflow](/docs/aws/deploy/install-kubeflow), please make sure you have completed the prerequisite steps there before proceeding.

### Deploy Kubeflow on existing Amazon EKS Cluster

If you would like to deploy Kubeflow on existing Amazon EKS cluster, the only difference in setup is when you initialize the platform setup. Since you manage your own cluster resources, you need to provide `AWS_CLUSTER_NAME` and `AWS_NODEGROUP_ROLE_NAMES`.


1. Retrieve the Amazon EKS cluster name, AWS Region, and IAM role name for your worker nodes. Set these values to the following environment variables.

    ```shell
    export KFAPP=kfapp
    export REGION=<YOUR EKS CLUSTER REGION>
    export AWS_CLUSTER_NAME=<YOUR EKS CLUSTER NAME>
    export AWS_NODEGROUP_ROLE_NAMES=<YOUR NODE GROUP ROLE NAMES>
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

    If you have multiple node groups, you will see corresponding number of node group roles. In that case, please provide the role names as a comma-separated list.

1. Initial setup

    ```shell
    cd ${KUBEFLOW_SRC}

    ${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform aws \
    --awsClusterName ${AWS_CLUSTER_NAME} \
    --awsRegion ${REGION} \
    --awsNodegroupRoleNames ${AWS_NODEGROUP_ROLE_NAMES}
    ```
