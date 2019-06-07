+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstalling Kubeflow"
weight = 10
+++

Uninstall Kubeflow on your Azure AKS cluster.

```
# Go to KFAPP Directory
cd ${KUBEFLOW_SRC}/${KFAPP}

# Remove Kubeflow
kfctl delete all
```