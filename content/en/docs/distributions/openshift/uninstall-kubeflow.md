+++
title = "Uninstall Kubeflow"
description = "Instructions for uninstalling Kubeflow from your OpenShift cluster"
weight = 10
                    
+++

## Uninstall a Kubeflow Instance
To delete a Kubeflow installation please follow these steps:

```
kfctl delete --file=./kfdef/kfctl_openshift_v1.3.0.yaml
rm -rf kustomize/
rm -rf .cache/
```

Delete all MutatingWebhookConfiguration and ValidatingWebhookConfiguration created by Kubeflow
