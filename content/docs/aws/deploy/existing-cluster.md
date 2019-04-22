+++
title = "Init cluster setup for existing cluster"
weight = 6
+++

## Before start

This is one step of [tutoral](/docs/aws/deploy/install-kubeflow), please make sure you have previous setup done.

### Deploy Kubeflow on existing EKS Cluster

If you would like to deploy Kubeflow on existing EKS cluster, the only difference setup is when you init platform setup. Since you manage your own cluster resources, you need to provide `AWS_CLUSTER_NAME` and `AWS_NODE_GROUP_ROLE_NAMES`.


1. Get your cluster name and node group roles ready

    ```
    export AWS_CLUSTER_NAME=<YOUR EKS CLUSTER NAME>
    export AWS_NODE_GROUP_ROLE_NAMES=<YOUR NODE GROUP ROLE NAMES>
    ```

    > Note: To get your EKS cluster node groups, you can check IAM setting or running following commands. We assume you use `eksctl` to create cluster. If you use other provision tools to create node groups, please find the roles by yourself.

    ```
    aws iam list-roles \
        | jq -r ".Roles[] \
        | select(.RoleName \
        | startswith(\"eksctl-$AWS_CLUSTER_NAME\") and contains(\"NodeInstanceRole\")) \
        .RoleName"

    eksctl-kubeflow-example-nodegroup-ng-185-NodeInstanceRole-1DDJJXQBG9EM6
    ```

    If you have multiple node groups, you will see corresponding number of node group roles. In that case, please use comma , between roles for string concat.

1. Init setups

    ```
    cd ${KUBEFLOW_SRC}

    ${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform aws \
    --awsClusterName ${AWS_CLUSTER_NAME} \
    --awsRegion ${AWS_REGION} \
    --awsNodegroupRoleNames ${AWS_NODE_GROUP_ROLE_NAMES}
    ```


