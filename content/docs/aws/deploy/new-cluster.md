+++
title = "Init cluster setup for new cluster"
weight = 5
+++

## Before you start

This is one step of [installing Kubeflow](/docs/aws/deploy/install-kubeflow), please make sure you have completed the prerequisite steps there before proceeding.

## Setup a new cluster

```
export AWS_CLUSTER_NAME=kubeflow-aws

cd ${KUBEFLOW_SRC}

${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform aws \
--awsClusterName ${AWS_CLUSTER_NAME} \
--awsRegion ${REGION}
```

`AWS_CLUSTER_NAME` - Specify a unique name for your Amazon EKS.