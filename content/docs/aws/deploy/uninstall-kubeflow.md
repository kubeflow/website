+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstall Kubeflow"
weight = 10
+++


## Uninstall Kubeflow

```
cd ${KFAPP}
kfctl delete all -V
```

> Note: If you installed Kubeflow on an existing Amazon EKS cluster, these scripts won't tear down your cluster in this step. If you want to shutdown EKS cluster, you must manually delete it by yourself.