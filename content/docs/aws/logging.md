+++
title = "Logging"
description = "Add logging support for kubeflow"
weight = 70
+++

Amazon EKS control plane logging provides audit and diagnostic logs directly from the Amazon EKS control plane to [CloudWatch](https://aws.amazon.com/cloudwatch/) Logs in your account. These logs make it easy for you to secure and run your clusters. You can select the exact log types you need, and logs are sent as log streams to a group for each Amazon EKS cluster in [CloudWatch](https://aws.amazon.com/cloudwatch/).

If you look at `${KF_DIR}/aws_config/cluster_features.yaml`, you will see following configuration:

```shell
CONTROL_PLANE_LOGGING=false
CONTROL_PLANE_LOGGING_COMPONENTS=api,audit,authenticator,controllerManager,scheduler

WORKER_NODE_GROUP_LOGGING=false
```

By default, cluster control plane logs and worker node group logs aren't sent to CloudWatch Logs. You must enable each log type individually to send logs for your cluster.


### Control Plane Logging

You can update `CONTROL_PLANE_LOGGING=true` to enable control plane logs and customize the components you want to collect logs from. Only these components are available and you have to use command between components.

* api
* audit
* authenticator
* controllerManager
* scheduler

Open the [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home#logs:prefix=/aws/eks). Choose the cluster that you want to view logs for. The log group name format is `/aws/eks/${AWS_CLUSTER_NAME}/cluster`.

> Note: If you set `CONTROL_PLANE_LOGGING=false`, the value of `CONTROL_PLANE_LOGGING_COMPONENTS` will not be used.

### Worker Node Group Logging

You can update `WORKER_NODE_GROUP_LOGGING=true` to enable worker node group logs and all pod logs are sent to CloudWatch.  The log group name format is `/eks/${AWS_CLUSTER_NAME}/containers`.

If you want to change logs setting after you have created your cluster, please check [here](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) for details.
