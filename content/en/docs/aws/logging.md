+++
title = "Logging"
description = "Add logging support for kubeflow"
weight = 70
+++

Amazon EKS control plane logging provides audit and diagnostic logs directly from the Amazon EKS control plane to [CloudWatch](https://aws.amazon.com/cloudwatch/) Logs in your account. These logs make it easy for you to secure and run your clusters. You can select the exact log types you need, and logs are sent as log streams to a group for each Amazon EKS cluster in [CloudWatch](https://aws.amazon.com/cloudwatch/).

By default, cluster control plane logs and worker node group logs aren't sent to CloudWatch Logs. You must enable each log type individually to send logs for your cluster.

### Control Plane Logging

You can easily use aws command to enable control plane logs and customize the components you want to collect logs from. Only following components are available.

* api
* audit
* authenticator
* controllerManager
* scheduler

Run command to enable logs
```shell
aws eks --region us-west-2 update-cluster-config --name ${AWS_CLUSTER_NAME} \
--logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true}]}'
```

Open the [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home#logs:prefix=/aws/eks). Choose the cluster that you want to view logs from. The log group name format is `/aws/eks/${AWS_CLUSTER_NAME}/cluster`.

### Worker Node Group Logging

You can add `fluentd-cloud-watch` to addons to enable worker node group logs and all pod logs are sent to CloudWatch.
```
  plugins:
  - kind: KfAwsPlugin
    metadata:
      name: aws
    spec:
      region: us-west-2
      addons:
      - fluentd-cloud-watch
```

You will see three log groups in total.

* /aws/containerinsights/${AWS_CLUSTER_NAME}/containers
* /aws/containerinsights/${AWS_CLUSTER_NAME}/dataplane
* /aws/containerinsights/${AWS_CLUSTER_NAME}/host
