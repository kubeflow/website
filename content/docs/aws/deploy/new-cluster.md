+++
title = "Init cluster setup for new cluster"
weight = 5
+++

## Before start

This is one step of [tutoral](/docs/aws/deploy/install-kubeflow), please make sure you have previous setup done.

## Setup new cluster

```
export AWS_CLUSTER_NAME=kubeflow-aws

cd ${KUBEFLOW_SRC}

${KUBEFLOW_SRC}/scripts/kfctl.sh init ${KFAPP} --platform aws \
--awsClusterName ${AWS_CLUSTER_NAME} \
--awsRegion ${REGION}
```

AWS_CLUSTER_NAME - EKS cluster name