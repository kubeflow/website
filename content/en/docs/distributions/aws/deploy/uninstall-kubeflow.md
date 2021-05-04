+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstalling Kubeflow"
weight = 30
+++

## Uninstall Kubeflow

The following command will delete the Kubeflow installation created via `kfctl install`.

```
kfctl delete -V -f kfctl_aws.yaml
```

> Note: This will not delete your Amazon EKS cluster, you must manually delete it by yourself if desired.

## (Optional) Delete Cluster

If you had created a dedicated cluster in Amazon EKS for Kubeflow using `eksctl` and wish to delete it, the following command can be used.

```
eksctl delete cluster -f cluster.yaml
```

> Note: It is possible that parts of the CloudFormation deletion will fail depending upon modifications made post-creation. In that case, manually delete the eks-xxx role in IAM, then the ALB, the EKS target groups and the subnets of that particular cluster. Then retry the command to delete the nodegroups and the cluster.