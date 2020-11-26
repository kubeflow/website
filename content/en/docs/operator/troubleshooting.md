+++
title = "Troubleshooting"
description = "Troubleshooting with Kubeflow deployment"
weight = 25
+++

This guide provides some tips on troubleshooting known Kubeflow deployment problems.

### Remove leftover cluster-wide resources after the Kubeflow is uninstalled

After Kubeflow deployment is uninstalled, some _mutatingwebhookconfigurations_ and _validatingwebhookconfigurations_ resources are cluster-wide resources and may not be removed as their owner is not the _KfDef_ instance. To remove them, run following:

```shell
kubectl delete mutatingwebhookconfigurations --all
kubectl delete validatingwebhookconfigurations --all
```
