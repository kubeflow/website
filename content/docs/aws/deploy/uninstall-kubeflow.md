+++
title = "Uninstall kubeflow"
description = "Instructions for uninstall Kubeflow"
weight = 10
+++


## Uninstall kubeflow and delete EKS cluster.

```
cd ${KUBEFLOW_SRC}/${KFAPP}
${KUBEFLOW_SRC}/scripts/kfctl.sh delete all
```

> Note: If you install kubeflow on existing cluster, scripts won't not tear down your cluster in this step since you manage your own cluster and node groups. Scripts only wipe all kubeflow components.




