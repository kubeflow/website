+++
title = "Logging"
description = "Amazon EKS Control Plane and Node logging for Kubeflow"
weight = 20
+++

Amazon EKS control plane logging provides audit and diagnostic logs directly from the Amazon EKS control plane to [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) logs in your account. These logs make it easy for you to monitor your clusters and troubleshoot issues if they arise. You can select which log types you need, and the logs are sent as log streams to a named group for each Amazon EKS cluster.

By default, cluster control plane logs and worker node group logs aren't sent to CloudWatch. You must enable each log type individually to send logs for your cluster.

## Control Plane Logging

You can easily use the `aws` utility to enable control plane logs and customize the components you want to collect logs from. Only following components are available.

* api
* audit
* authenticator
* controllerManager
* scheduler

Run command to enable logs
```shell
aws eks update-cluster-config \
  --region ${AWS_REGION} \
  --name ${AWS_CLUSTER_NAME} \
  --logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true}]}'
```

If you prefer, you can also enable cluster logging with `eksctl`. For example, to enable all logs:
```shell
eksctl utils update-cluster-logging \
	--enable-types all \
  --region ${AWS_REGION} \
  --cluster ${AWS_CLUSTER_NAME} \
  --approve
```

Finally, logging can also be configured from within the Amazon EKS console, under the `Configuration` panel for your cluster.

Once configured, open the [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home#logs:prefix=/aws/eks). Choose the cluster that you want to view logs from. The log group name format is `/aws/eks/${AWS_CLUSTER_NAME}/cluster`.

## Worker Node Group Logging

You can add `fluentd-cloud-watch` to addons to enable node group logs. With this configuration in place, all Pod logs are sent to CloudWatch.

```yaml
  plugins:
  - kind: KfAwsPlugin
    metadata:
      name: aws
    spec:
      region: ${AWS_REGION}
      addons:
      - fluentd-cloud-watch
```

You will see three log groups in total, again organized under the cluster name.

* /aws/containerinsights/${AWS_CLUSTER_NAME}/containers
* /aws/containerinsights/${AWS_CLUSTER_NAME}/dataplane
* /aws/containerinsights/${AWS_CLUSTER_NAME}/host
