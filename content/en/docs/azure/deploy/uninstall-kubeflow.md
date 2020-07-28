+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstalling Kubeflow"
weight = 10
+++

{{% alert title="Out of date" color="warning" %}}
This guide contains outdated information pertaining to Kubeflow 1.0. This guide
needs to be updated for Kubeflow 1.1.
{{% /alert %}}


Uninstall Kubeflow on your Azure AKS cluster.

```
# Go to your Kubeflow deployment directory
cd ${KF_DIR}

# Remove Kubeflow
kfctl delete -f ${CONFIG_FILE}
```