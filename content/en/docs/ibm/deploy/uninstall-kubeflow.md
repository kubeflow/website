+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstalling Kubeflow"
weight = 10
+++

Uninstall Kubeflow on your IBM Cloud IKS cluster.

```
# Go to your Kubeflow deployment directory
cd ${KF_DIR}

# Remove Kubeflow
kfctl delete -f ${CONFIG_FILE}
```
