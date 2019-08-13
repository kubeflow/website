+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstall Kubeflow"
weight = 10
+++


## Uninstall Kubeflow and delete your Amazon EKS cluster.

```
cd ${KFAPP}
kfctl delete all -V

# TODO(@Jeffwan): move this line once #3767 is resolved
kfctl delete ns istio-system
```

> Note: If you installed Kubeflow on an existing Amazon EKS cluster, these scripts won't tear down your cluster in this step. In this case, you must manually delete your cluster.