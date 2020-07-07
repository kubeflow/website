+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstall Kubeflow"
weight = 10
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}



## Uninstall Kubeflow

```
cd ${KF_DIR}
kfctl delete -f ${CONFIG_FILE}
```
This will delete the kubeflow and istio-system namespaces which have been created via kfctl.

> Note: If you installed Kubeflow on an existing Amazon EKS cluster, these scripts won't tear down your cluster in this step. If you want to shutdown EKS cluster, you must manually delete it by yourself.

## Uninstall Kubernetes

If you have installed a dedicated EKS cluster for kubeflow and you want to delete this as well, assuming it was done via a `cluster.yaml` file and eksctl, use this:
```
eksctl delete cluster -f cluster.yaml
```
That will invoke the DELETE action in the cloudformation stacks.

> Note: It is possible that parts of the cloudformation delete will fail. In that case try to manually delete the eks-xxx role in IAM first, then the ALB, the eks target groups and the subnets of that particular cluster. Then retry the command, it will properly delete the nodegroups and the cluster.